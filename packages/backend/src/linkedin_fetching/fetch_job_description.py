from errors.data_fetching_errors import DescriptionNotFound, LinkedinError
from linkedin_fetching.fetch_html import fetch_job_html

from bs4 import BeautifulSoup
from typing import List, Tuple

import re
from urllib.parse import parse_qs, urlparse


def parse_job_description(html: str) -> List[Tuple[str, str]]:
    """
    Returns a list of (kind, text) tuples in the order they appear:
      - kind == 'paragraph'
      - kind == 'bullet'
      - kind == 'heading'
    """
    soup = BeautifulSoup(html, "html.parser")
    markup = soup.select_one("div.show-more-less-html__markup")
    if not markup:
        raise DescriptionNotFound("Couldn't find the description container")

    blocks: List[Tuple[str, str]] = []
    # Depth-first, document order:
    for el in markup.find_all(["p", "li", "strong"], recursive=True):
        text = el.get_text(strip=True, separator=" ")
        if not text:
            continue

        if el.name == "strong" and text.endswith(":"):
            # standalone heading like "Responsibilities:"
            blocks.append(("heading", text))

        elif el.name == "li":
            blocks.append(("bullet", text))

        elif el.name == "p":
            # skip <p> that *only* wraps a heading we've already captured
            # e.g. <p><strong>Responsibilities:</strong></p>
            inner_strong = el.find("strong")
            if inner_strong and inner_strong.get_text(strip=True).endswith(":"):
                continue
            blocks.append(("paragraph", text))

    return blocks


def to_markdown(blocks: List[Tuple[str, str]]) -> str:
    md_lines: List[str] = []
    for kind, text in blocks:
        if kind == "heading":
            md_lines.append(f"**{text}**")
        elif kind == "bullet":
            md_lines.append(f"- {text}")
        else:  # paragraph
            md_lines.append(text)
        md_lines.append("")  # blank line
    return "\n".join(md_lines).strip()


def extract_linkedin_job_id(url: str) -> str | None:
    match = re.search(r"/jobs/view/(\d+)", url)
    if match:
        return match.group(1)
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    if "currentJobId" in qs:
        return qs["currentJobId"][0]
    return None


def get_canonical_linkedin_job_url(url: str) -> str | None:
    job_id = extract_linkedin_job_id(url)
    if job_id:
        return f"https://www.linkedin.com/jobs/view/{job_id}/"
    return None


def fetch_job_description_markdown(url: str) -> str:
    canonical_url = get_canonical_linkedin_job_url(url)
    if not canonical_url:
        raise LinkedinError(
            "Could not extract job ID from LinkedIn URL. Please provide a valid job link."
        )

    html = fetch_job_html(canonical_url)
    blocks = parse_job_description(html)
    return to_markdown(blocks)


if __name__ == "__main__":
    url = (
        "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4223055571"
    )
    markdown = fetch_job_description_markdown(url)
    print(markdown)
