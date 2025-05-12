import os
from docx import Document
from docx.text.paragraph import Paragraph
from firebase_admin import storage

from docx.oxml.ns import qn

from backend.firebase import init_firebase

import re
from docx.oxml.ns import qn
from docx import Document

from backend.docx_functions import is_likely_heading, iter_doc_paragraphs


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


def parse_resume(resumePath: str):
    doc = Document(resumePath)
    segments = segment_resume(doc)

    for section, content in segments.items():
        print(f"Section: {section}")
        for paragraph in content:
            print(paragraph)
        print("\n")


def segment_resume(doc: Document):
    """
    Segments the resume into sections based on headings.
    """
    sections = {}

    current_section_heading = "intro"
    prev_para_was_heading = False

    for p in iter_doc_paragraphs(doc):
        if is_likely_heading(p, doc) and not prev_para_was_heading:
            prev_para_was_heading = True
            current_section_heading = p.text
            sections[current_section_heading] = []

        else:
            sections[current_section_heading].append(p.text)
            prev_para_was_heading = False

    return sections


if __name__ == "__main__":
    # resumePath = fetch_resume("testUserId", "V3 Compressed Fabric.docx")
    resumePath = "resumes/testUserId/V3Resume.docx"
    # resumePath = "resumes/testUserId/Senior-Product-Manager-Resume-Example.docx"
    parse_resume(resumePath)
