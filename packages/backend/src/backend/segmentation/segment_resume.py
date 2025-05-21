from docx import Document
from constants import RESUMES_PATH, SECTION_HEADER_TOKENS
from docx_functions.general import iter_doc_paragraphs
from docx_functions.modifications import (
    merge_identical_runs,
)
from backend.segmentation.heading_classification import (
    is_header_text,
)
from backend.segmentation.heading_recognition import (
    is_likely_heading,
)
from backend.util import clean_heading_text


def filter_to_critical_sections(sections):
    """
    Filters the sections to only include important sections for tailoring
    """

    critical_sections = {}
    for section in sections.keys():
        for header_title in SECTION_HEADER_TOKENS.keys():
            if is_header_text(section, header_title):
                critical_sections[header_title] = sections[section]
                break

    return critical_sections


def extract_sections_from_resume(doc: Document):
    """
    Segments the resume into sections based on headings.
    """
    sections = {"intro": []}

    current_section_heading = "intro"
    prev_para_was_heading = False

    for p in iter_doc_paragraphs(doc):
        if is_likely_heading(p, doc) and not prev_para_was_heading:
            prev_para_was_heading = True
            current_section_heading = clean_heading_text(p.text)
            sections[current_section_heading] = []

        else:
            sections[current_section_heading].append(p)
            prev_para_was_heading = False

    return sections


def parse_resume_for_sections(resumePath: str):
    doc = Document(resumePath)
    segments = extract_sections_from_resume(doc)
    critical_sections = filter_to_critical_sections(segments)

    for section_paragraphs in critical_sections.values():
        for para in section_paragraphs:
            merge_identical_runs(para)

    return critical_sections, doc


if __name__ == "__main__":
    # resumePath = f"{RESUMES_PATH}/testUserId/V3Resume.docx"
    resumePath = f"{RESUMES_PATH}/testUserId/Senior-Product-Manager-Resume-Example.docx"
    parse_resume_for_sections(resumePath)
