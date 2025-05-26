import copy
import re
from docx_functions.modifications import (
    clean_paragraph_whitespace,
)
from docx_functions.paragraph_info import has_border, has_spacing


SECTION_HEADER_KEYWORDS = {
    "experience",
    "employment",
    "education",
    "skills",
    "projects",
    "certifications",
    "summary",
    "profile",
    "contact",
}


def is_mostly_uppercase(para, caps_ratio=0.8):
    """
    True if more than caps_ratio of total letters are uppercase.
    caps_ratio is the fraction of total letters that need to be uppercase for the paragraph to be considered uppercase.
    """

    text = para.text.strip()
    letters = [c for c in text if c.isalpha()]
    if letters:
        capital_letter_ratio = sum(1 for c in letters if c.isupper()) / len(letters)
        return capital_letter_ratio >= caps_ratio

    return False


def is_title_case(para):
    """
    True if text is short (≤ max_words) AND
    each word starts uppercase (Title Case).
    """
    text = para.text.strip()
    words = text.split()
    return all(w[0].isupper() and w[1:].islower() for w in words if len(w) > 1)


def is_title_or_upper_case(para, caps_ratio=0.8):
    title_case = is_title_case(para)
    uppercase = is_mostly_uppercase(para, caps_ratio)
    return title_case or uppercase


# TODO: Perhaps change this to any emphasized text (bold, underline)
def is_primarily_bold(para, bold_ratio=0.6):
    """
    True if more than bold_ratio of runs are bold.
    """
    runs = para.runs
    if not runs:
        return False

    bold_runs = sum(1 for r in runs if r.bold)
    if bold_runs / len(runs) >= bold_ratio:
        return True

    return False


def is_above_average_font_size(para, doc, multiplier=1.0):
    """
    True if any run in para has font.size > avg_size * multiplier.
    """

    # Compute avg font size once per doc
    avg_size = getattr(doc, "_avg_font_size", None)
    if avg_size is None:
        avg_size = compute_average_font_size(doc)
        doc._avg_font_size = avg_size

    if avg_size is None:
        return False
    threshold = avg_size * multiplier
    return any(run.font.size and run.font.size.pt > threshold for run in para.runs)


def has_few_distinct_words(para, max_words=4):
    """
    Return True if the paragraph has ≤ max_words distinct words.
    """
    text = para.text.lower()
    # extract word tokens (alphanumeric + underscore)
    words = re.findall(r"\b\w+\b", text)
    return len(set(words)) <= max_words


def compute_average_font_size(doc):
    """
    Scan all runs with a defined font size and return the average in Pt.
    """
    sizes = [
        run.font.size.pt
        for para in doc.paragraphs
        for run in para.runs
        if run.font.size
    ]
    return sum(sizes) / len(sizes) if sizes else None


def preprocess_paragraph(para):
    """
    Preprocess the text by removing extra whitespace.
    """
    clean_paragraph_whitespace(para)

    return para


def has_keyword(para):
    """True if any SECTION_KEYWORDS appears in the paragraph text."""
    text = para.text.lower()
    return any(kw in text for kw in SECTION_HEADER_KEYWORDS)


def is_builtin_heading_style(para):
    """True if the paragraph uses a built-in Heading style."""
    name = para.style.name or ""
    return name.startswith("Heading")


def is_likely_heading(para, doc):
    """
    Combine all heuristics. Return True if:
      - built-in heading style OR
      - keyword match
    OR at least two formatting signals of:
      font jump, bold/all-caps, whitespace, border, title/short.
    """
    if not para.text.strip():
        return False

    processed_para = copy.deepcopy(para)
    preprocess_paragraph(processed_para)

    signals = [
        is_builtin_heading_style(para),
        has_keyword(para),
        is_above_average_font_size(processed_para, doc),
        is_primarily_bold(processed_para),
        has_spacing(processed_para),
        has_border(processed_para),
        is_title_or_upper_case(processed_para),
    ]

    # The number of things making it likely a paragraph is a heading
    total_positive_indicators = sum(signals)

    # Headings should not be more than a few words long
    if not has_few_distinct_words(processed_para, max_words=4):
        total_positive_indicators -= 2

    is_heading = total_positive_indicators >= 2

    # ! Debugging
    # if is_heading:
    #     print(
    #         f"Indicators: {total_positive_indicators} \t Heading: {processed_para.text}"
    #     )

    return is_heading
