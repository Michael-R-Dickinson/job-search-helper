import os
from docx_functions.paragraph_info import get_list_indent_level
from md2docx_python.src.docx2md_python import word_to_markdown

from constants import RESUMES_PATH
from docx.text.paragraph import Paragraph


def add_font_styles(styleSet: set, styles):
    if styles.bold:
        styleSet.add("bold")
    if styles.italic:
        styleSet.add("italic")
    if styles.underline:
        styleSet.add("underline")

    return styleSet


def json_serialize_paragraph(paragraph: Paragraph):
    paragraph_styles = add_font_styles(set(), paragraph.style.font)

    serialized_runs = []
    for run in paragraph.runs:
        # Add in run level styles
        run_styles = paragraph_styles.copy()
        run_styles = add_font_styles(run_styles, run)

        serialized = {
            "text": run.text,
            "styles": list(run_styles),
        }

        serialized_runs.append(serialized)

    serialized_paragraph = {"runs": serialized_runs}

    list_level = get_list_indent_level(paragraph)
    if not (list_level == 0):
        serialized_paragraph["list_indent_level"] = list_level

    return serialized_paragraph


def json_serialize_paragraphs(paragraphs: list[Paragraph]) -> list[dict]:
    serialized_paragraphs = []
    for paragraph in paragraphs:
        serialized_paragraphs.append(json_serialize_paragraph(paragraph))

    return serialized_paragraphs


def serialize_sections(sections) -> dict:
    """
    Format the sections for the LLM.
    """

    formatted_sections = {}
    for section, paragraphs in sections.items():
        formatted_paragraphs = []
        for paragraph in paragraphs:
            formatted_paragraphs.append(json_serialize_paragraph(paragraph))
        formatted_sections[section] = formatted_paragraphs

    return formatted_sections


# TODO: Handle the serialization to markdown without this external library
def serialize_raw_docx(doc_path):
    """
    Serialize the raw resume to markdown.
    """
    # Roundabout way to get the markdown text, but the library offers no other APIs
    markdown_path = f"{RESUMES_PATH}/temp.md"
    os.makedirs(RESUMES_PATH, exist_ok=True)

    word_to_markdown(doc_path, markdown_path)
    with open(markdown_path, "r") as f:
        markdown_text = f.read()
    # os.remove(markdown_path)

    return markdown_text
