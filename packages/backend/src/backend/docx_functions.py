import re
from docx import Document
from docx.shared import Pt
from docx.oxml.ns import qn


def is_builtin_heading_style(para):
    """True if the paragraph uses a built-in Heading style."""
    name = para.style.name or ""
    return name.startswith("Heading")


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


def is_above_average_font_size(para, avg_size, multiplier=1.3):
    """
    True if any run in para has font.size > avg_size * multiplier.
    """
    if avg_size is None:
        return False
    threshold = avg_size * multiplier
    return any(run.font.size and run.font.size.pt >= threshold for run in para.runs)


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


def has_extra_whitespace(para, space_pt_threshold=6):
    """
    True if space_before or space_after ≥ space_pt_threshold (in points).
    """
    fmt = para.paragraph_format
    for attr in ("space_before", "space_after"):
        val = getattr(fmt, attr)
        pt = getattr(val, "pt", None)
        if pt is not None and pt >= space_pt_threshold:
            return True
    return False


def has_border(para):
    """
    True if the paragraph has any border defined in its pPr.
    """
    pPr = para._p.pPr
    if pPr is None:
        return False
    # look for any <w:pBdr> (paragraph borders)
    return pPr.find(qn("w:pBdr")) is not None


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


SECTION_KEYWORDS = {
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


def has_keyword(para):
    """True if any SECTION_KEYWORDS appears in the paragraph text."""
    text = para.text.lower()
    return any(kw in text for kw in SECTION_KEYWORDS)


def has_few_distinct_words(para, max_words=4):
    """
    Return True if the paragraph has ≤ max_words distinct words.
    """
    text = para.text.lower()
    # extract word tokens (alphanumeric + underscore)
    words = re.findall(r"\b\w+\b", text)
    return len(set(words)) <= max_words


def is_likely_heading(para, doc):
    """
    Combine all heuristics. Return True if:
      - built-in heading style OR
      - keyword match
    OR at least two formatting signals of:
      font jump, bold/all-caps, whitespace, border, title/short.
    """
    # Fast positives
    if is_builtin_heading_style(para) or has_keyword(para):
        return True

    # Compute avg font size once per doc
    avg_size = getattr(doc, "_avg_font_size", None)
    if avg_size is None:
        avg_size = compute_average_font_size(doc)
        doc._avg_font_size = avg_size

    signals = [
        is_above_average_font_size(para, avg_size),
        is_primarily_bold(para),
        has_extra_whitespace(para),
        has_border(para),
        is_title_or_upper_case(para),
    ]

    # The number of things making it likely a paragraph is a heading
    total_positive_indicators = sum(signals)
    if not has_few_distinct_words(para):
        total_positive_indicators -= 2

    is_heading = total_positive_indicators >= 2

    return is_heading
