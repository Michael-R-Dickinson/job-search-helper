from firebase.buckets import fetch_and_download_cover_letter
from firebase_functions import https_fn


def tailor_cover_letter(
    user_id: str,
    file_name: str,
    job_description_link: str,
) -> https_fn.Response:
    """
    Tailor a cover letter based on the provided job description link.
    """
    cover_letter_path = fetch_and_download_cover_letter(user_id, file_name)
