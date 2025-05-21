import os
from LLM_tailoring.cover_letter.cover_letter_prompt import generate_cover_letter_prompt
from LLM_tailoring.cover_letter.execute_tailoring import tailor_cover_letter_with_llm
from constants import COVER_LETTERS_PATH
from docx_functions.general import get_paragraphs, load_docx
from docx_functions.marshaling.deserialization import update_resume_section
from docx_functions.marshaling.serialization import serialize_raw_docx
from firebase.buckets import fetch_and_download_cover_letter, fetch_and_download_resume
from firebase_functions import https_fn
from linkedin_fetching.fetch_job_description import fetch_job_description_markdown
from utils import get_time_string


def tailor_cover_letter(
    user_id: str,
    cover_letter_name: str,
    resume_name: str,
    job_description_link: str,
) -> https_fn.Response:
    """
    Tailor a cover letter based on the provided job description link.
    """
    cover_letter_path = fetch_and_download_cover_letter(user_id, cover_letter_name)
    resume_path = fetch_and_download_resume(user_id, resume_name)

    resume_rawtext = serialize_raw_docx(resume_path)
    cover_letter_rawtext = serialize_raw_docx(cover_letter_path)

    doc = load_docx(cover_letter_path)
    paragraphs = get_paragraphs(doc)

    job_description = fetch_job_description_markdown(job_description_link)

    prompt = generate_cover_letter_prompt(
        job_description=job_description,
        resume_rawtext=resume_rawtext,
        cover_letter_rawtext=cover_letter_rawtext,
        paragraphs=paragraphs,
    )
    tailored_cover_letter = tailor_cover_letter_with_llm(prompt)

    # Using the resume function, but with the whole cover letter as a single "resume" section
    update_resume_section(
        section_content=paragraphs,
        new_paragraphs=tailored_cover_letter,
    )

    save_path = f"{COVER_LETTERS_PATH}/outputs/{user_id}/{cover_letter_name}-{get_time_string()}.docx"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    doc.save(save_path)
