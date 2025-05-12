import os
from docx import Document
from docx.text.paragraph import Paragraph
from firebase_admin import storage

from docx.oxml.ns import qn

from backend.firebase import init_firebase

import re
from docx.oxml.ns import qn
from docx import Document

from backend.docx_functions import is_likely_heading


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


def display_paragraph(para, doc):
    if is_likely_heading(para, doc):
        # print(f"Heading: {para.text}")
        pass
    # print(para.text)


def parse_resume(resumePath: str):
    doc = Document(resumePath)

    for p in doc.iter_inner_content():
        if isinstance(p, Paragraph):
            display_paragraph(p, doc)

        else:
            display_table_text(p, doc)


def display_table_text(table, doc):
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                display_paragraph(paragraph, doc)


if __name__ == "__main__":
    # resumePath = fetch_resume("testUserId", "V3 Compressed Fabric.docx")
    resumePath = "resumes/testUserId/V3Resume.docx"
    # resumePath = "resumes/testUserId/Senior-Product-Manager-Resume-Example.docx"
    parse_resume(resumePath)
