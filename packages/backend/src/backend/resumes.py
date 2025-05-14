import copy
import os
from docx import Document
from docx.text.paragraph import Paragraph

from firebase_admin import storage
from backend.firebase import init_firebase

from backend.docx_functions import (
    insert_paragraph_after,
    is_likely_heading,
    iter_doc_paragraphs,
    merge_identical_runs,
    set_list_indent_level,
)
from backend.util import clean_heading_text, print_sections
from backend.section_identification import is_section_header
from backend.constants import RESUMES_PATH, SECTION_HEADER_TOKENS
from backend.tailoring.schema import SerializedParagraph, SerializedRun


def fetch_resume(userId: str, resumeName: str):
    init_firebase()

    bucket = storage.bucket()
    resumeFile = bucket.blob(f"resumes/{userId}/{resumeName}")
    if not resumeFile.exists():
        raise FileNotFoundError(f"Resume {resumeName} not found for user {userId}")

    os.makedirs(f"{RESUMES_PATH}/{userId}", exist_ok=True)
    resumePath = f"{RESUMES_PATH}/{userId}/{resumeName}"
    resumeFile.download_to_filename(resumePath)

    return resumePath


def parse_resume_for_sections(resumePath: str):
    doc = Document(resumePath)
    segments = segment_resume(doc)
    critical_sections = filter_to_critical_sections(segments)

    for section_paragraphs in critical_sections.values():
        for para in section_paragraphs:
            merge_identical_runs(para)

    return critical_sections, doc


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


def clear_runs_only(para: Paragraph):
    """
    Remove only the <w:r> children of this paragraph, leaving its
    paragraph properties (styles, spacing, etc.) intact.
    """
    for run in list(para.runs):
        para._p.remove(run._element)


def add_runs_to_paragraph(
    paragraph: Paragraph,
    runs: list[SerializedRun],
    run_template=None,
):
    for run in runs:
        if run_template:
            new_run = copy.deepcopy(run_template)
            new_run.text = run.text
            paragraph._p.append(new_run._element)

        else:
            new_run = paragraph.add_run(run.text)

        if run.styles is not None:
            new_run.bold = "bold" in run.styles
            new_run.italic = "italic" in run.styles
            new_run.underline = "underline" in run.styles


def delete_paragraphs(paragraphs: list[Paragraph]):
    for para in paragraphs:
        delete_paragraph(para)


def delete_paragraph(paragraph: Paragraph):
    element = paragraph._element
    element.getparent().remove(element)


def find_first_non_match(paragraphs, lookup, start_idx=0):
    """
    Finds the first paragraph that does not match the lookup
    """

    for para in paragraphs[start_idx:]:
        if para.text not in lookup:
            return para

    return paragraphs[-1]


def update_resume_section(
    section_content: list[Paragraph], new_paragraphs: list[SerializedParagraph]
):
    """
    Updates the section with new paragraphs
    """

    preserved_paragraphs_lookup = set(
        [p.get_text() for p in new_paragraphs if p.preserved]
    )
    existing_paragraphs_lookup = {
        para.text: idx for idx, para in enumerate(section_content)
    }

    pointer_paragraph = section_content[0]
    for updated_para_raw in new_paragraphs:
        if (
            updated_para_raw.get_text() in existing_paragraphs_lookup
            and updated_para_raw.preserved
        ):
            # print("Found in lookup: ", updated_para.get_text()[:25])
            existing_paragraph_idx = existing_paragraphs_lookup.get(
                updated_para_raw.get_text()
            )
            pointer_paragraph = find_first_non_match(
                section_content,
                preserved_paragraphs_lookup,
                start_idx=existing_paragraph_idx + 1,
            )

            continue

        # Otherwise, we need to insert a new paragraph
        new_para = pointer_paragraph.insert_paragraph_before(
            style=pointer_paragraph.style
        )
        add_runs_to_paragraph(
            new_para,
            updated_para_raw.runs,
            run_template=pointer_paragraph.runs[0] if pointer_paragraph.runs else None,
        )

        if updated_para_raw.list_indent_level is not None:
            set_list_indent_level(
                new_para,
                updated_para_raw.list_indent_level,
            )

    # Delete all paragraphs that are not in the new paragraphs
    # These are just the old paragraphs from the original resume
    # So we delete them
    for para in section_content:
        if para.text not in preserved_paragraphs_lookup:
            delete_paragraph(para)


if __name__ == "__main__":
    # resumePath = fetch_resume("testUserId", "V3 Compressed Fabric.docx")
    # resumePath = f"{RESUMES_PATH}/testUserId/V3Resume.docx"
    resumePath = f"{RESUMES_PATH}/testUserId/Senior-Product-Manager-Resume-Example.docx"
    parse_resume_for_sections(resumePath)
