from datetime import datetime
import re


def remove_unnecessary_whitespace(text):
    """
    Collapse sequences of single‐character tokens into words, while preserving
    spacing between real words.

    E.g. "K E Y  S K I L L S" → "KEY SKILLS"
    """
    # 1) Split on two or more whitespace characters → these mark word boundaries
    segments = re.split(r"\s{2,}", text)
    cleaned_segments = []

    for seg in segments:
        # Normalize inner whitespace to single spaces, strip edges
        tokens = seg.strip().split()
        # If every token is exactly one character, collapse them into a word
        if tokens and all(len(tok) == 1 for tok in tokens):
            cleaned_segments.append("".join(tokens))
        else:
            # Otherwise treat as normal text, rejoin with single spaces
            cleaned_segments.append(" ".join(tokens))

    # Rejoin the segments with a single space (words were split by ≥2 spaces)
    return " ".join(cleaned_segments)


def clean_heading_text(text):
    """
    Cleans the heading text by removing unnecessary whitespace and
    converting text to lower case
    """

    cleaned_text = remove_unnecessary_whitespace(text)

    normalized_text = cleaned_text.lower()

    return normalized_text


def print_sections(sections):
    for section, content in sections.items():
        print(f"Section: {section}")
        for paragraph in content:
            print(paragraph.text)
        print("\n")


def get_user_bucket_path(userId: str, tailored: bool = False) -> str:
    """
    Returns the path to the user's bucket,
    either for tailored resumes or original resumes
    """
    base = f"users/{userId}"
    if tailored:
        return f"{base}/tailored/"
    else:
        return base


def get_time_string():
    return datetime.now().strftime("%d_%H-%M-%S")
