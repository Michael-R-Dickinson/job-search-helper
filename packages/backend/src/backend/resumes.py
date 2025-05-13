import os
from docx import Document
from docx.text.paragraph import Paragraph

from firebase_admin import storage
from backend.firebase import init_firebase

from backend.docx_functions import (
    is_likely_heading,
    iter_doc_paragraphs,
    merge_identical_runs,
)
from backend.util import clean_heading_text, print_sections
from backend.section_header_constants import SECTION_HEADER_TOKENS
from backend.section_identification import is_section_header


def fetch_resume(userId: str, resumeName: str):
    init_firebase()

    bucket = storage.bucket()
    resumeFile = bucket.blob(f"resumes/{userId}/{resumeName}")
    if not resumeFile.exists():
        raise FileNotFoundError(f"Resume {resumeName} not found for user {userId}")

    os.makedirs(f"resumes/{userId}", exist_ok=True)
    resumePath = f"resumes/{userId}/{resumeName}"
    resumeFile.download_to_filename(resumePath)

    return resumePath


def parse_resume_for_sections(resumePath: str):
    doc = Document(resumePath)
    segments = segment_resume(doc)
    critical_sections = filter_to_critical_sections(segments)

    for section_paragraphs in critical_sections.values():
        for para in section_paragraphs:
            merge_identical_runs(para)

    return critical_sections


def filter_to_critical_sections(sections):
    """
    Filters the sections to only include important sections for tailoring
    """

    critical_sections = {}
    for section in sections.keys():
        for header_title in SECTION_HEADER_TOKENS.keys():
            if is_section_header(section, header_title):
                critical_sections[header_title] = sections[section]
                break

    return critical_sections


def segment_resume(doc: Document):
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


if __name__ == "__main__":
    # resumePath = fetch_resume("testUserId", "V3 Compressed Fabric.docx")
    # resumePath = "resumes/testUserId/V3Resume.docx"
    resumePath = "resumes/testUserId/Senior-Product-Manager-Resume-Example.docx"
    parse_resume_for_sections(resumePath)
