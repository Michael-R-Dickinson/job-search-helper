from docx_functions.general import get_paragraphs, load_docx
from docx_functions.marshaling.serialization import serialize_raw_docx
from firebase.buckets import fetch_and_download_cover_letter
from firebase_functions import https_fn
from linkedin_fetching.fetch_job_description import fetch_job_description_markdown


def tailor_cover_letter(
    user_id: str,
    file_name: str,
    job_description_link: str,
) -> https_fn.Response:
    """
    Tailor a cover letter based on the provided job description link.
    """
    cover_letter_path = fetch_and_download_cover_letter(user_id, file_name)
    job_description = fetch_job_description_markdown(job_description_link)

    cover_letter_rawtext = serialize_raw_docx(cover_letter_path)
    paragraphs = get_paragraphs(load_docx(cover_letter_path))
