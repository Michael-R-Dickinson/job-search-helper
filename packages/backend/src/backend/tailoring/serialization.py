import os
from md2docx_python.src.docx2md_python import word_to_markdown

from backend.constants import RESUMES_PATH
from backend.docx_functions import get_list_level


def json_serialize_paragraph(paragraph):
    serialized_runs = []
    list_level = get_list_level(paragraph)

    for run in paragraph.runs:
        serialized = {
            "text": run.text,
            "styles": [],
        }

        if run.bold:
            serialized["styles"].append("bold")
        if run.italic:
            serialized["styles"].append("italic")
        if run.underline:
            serialized["styles"].append("underline")

        serialized_runs.append(serialized)

    serialized_paragraph = {"runs": serialized_runs}
    if not (list_level == 0):
        serialized_paragraph["list_indent_level"] = list_level

    return serialized_paragraph


def serialize_sections(sections):
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
def serialize_raw_resume(doc_path):
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
