import datetime
import os

from firebase import init_firebase
from firebase_admin import storage

from constants import COVER_LETTERS_PATH, RESUMES_PATH
from utils import get_time_string


DOCX_FILE_FORMAT = (
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
)


def get_user_bucket_path(userId: str, tailored: bool = False) -> str:
    """
    Returns the path to the user's bucket,
    either for tailored resumes or original resumes
    """
    base = f"resumes/{userId}"
    if tailored:
        return f"{base}/tailored"
    else:
        return base


def get_pdf_cache_path(userId: str) -> str:
    """
    Returns the path to the user's PDF cache bucket
    """
    return f"resumes/{userId}/pdf_cache"


def get_cached_pdf_url(userId: str, file_name: str) -> str:
    """
    Check if a cached PDF exists for the given file and return its public URL
    Returns None if no cached PDF exists
    """
    bucket = storage.bucket()
    # Convert file name to PDF name (replace extension with .pdf)
    pdf_name = os.path.splitext(file_name)[0] + ".pdf"
    blob_path = f"{get_pdf_cache_path(userId)}/{pdf_name}"
    blob = bucket.blob(blob_path)

    if blob.exists():
        blob.make_public()
        return blob.public_url

    return None


def upload_pdf_to_cache(pdf_url: str, userId: str, file_name: str) -> str:
    """
    Downloads PDF from URL and uploads it to the user's PDF cache
    Returns the public URL of the cached PDF
    """
    import requests

    bucket = storage.bucket()
    # Convert file name to PDF name (replace extension with .pdf)
    pdf_name = os.path.splitext(file_name)[0] + ".pdf"
    blob_path = f"{get_pdf_cache_path(userId)}/{pdf_name}"
    blob = bucket.blob(blob_path)

    # Download the PDF from the URL
    response = requests.get(pdf_url)
    response.raise_for_status()

    # Upload to Firebase storage
    blob.upload_from_string(response.content, content_type="application/pdf")
    blob.make_public()

    return blob.public_url


def upload_resume_from_file(file, userId: str, file_name: str, public: bool = False):
    """
    Uploads resume to the user's bucket
    returns download url
    """
    bucket = storage.bucket()
    fileLocation = bucket.blob(
        f"{get_user_bucket_path(userId=userId, tailored=False)}/{file_name}"
    )
    fileLocation.upload_from_file(file, content_type=DOCX_FILE_FORMAT)
    if public:
        fileLocation.make_public()

    return fileLocation.public_url


def get_stored_resumes(userId: str):
    """
    Gets the list of resumes stored in the user's bucket with their public URLs
    """
    bucket = storage.bucket()
    resume_dict = {}
    blobs = bucket.list_blobs(
        prefix=get_user_bucket_path(userId=userId, tailored=False) + "/",
        delimiter="/",
    )
    for blob in blobs:
        resume_name = os.path.basename(blob.name)
        blob.make_public()
        resume_dict[resume_name] = blob.public_url

    return resume_dict


def upload_tailored_resume(
    resume_path: str, userId: str, file_name: str, extension: str, public: bool = False
):
    """
    Uploads resume to the user's bucket
    returns download url
    """
    bucket = storage.bucket()
    fileLocation = bucket.blob(
        f"{get_user_bucket_path(userId=userId, tailored=True)}/{file_name}_{get_time_string()}{extension}"
    )
    fileLocation.upload_from_filename(resume_path)
    if public:
        fileLocation.make_public()

    public_url = fileLocation.public_url

    download_url = fileLocation.generate_signed_url(
        version="v4",
        expiration=datetime.datetime.now() + datetime.timedelta(days=1),
        method="GET",
    )

    return download_url, public_url


def fetch_and_download_file(blob_path: str, output_path: str):
    """
    Fetches and downloads a file from the bucket
    """
    bucket = storage.bucket()
    blob = bucket.blob(blob_path)
    if not blob.exists():
        raise FileNotFoundError(f"File {blob_path} not found")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    blob.download_to_filename(output_path)

    return output_path


def fetch_and_download_resume(userId: str, resumeName: str):
    return fetch_and_download_file(
        blob_path=f"resumes/{userId}/{resumeName}",
        output_path=f"{RESUMES_PATH}/{userId}/{resumeName}",
    )


def fetch_and_download_cover_letter(userId: str, coverLetterName: str):
    return fetch_and_download_file(
        blob_path=f"cover_letters/{userId}/{coverLetterName}",
        output_path=f"{COVER_LETTERS_PATH}/{userId}/{coverLetterName}",
    )


if __name__ == "__main__":
    init_firebase()
    resumePath = fetch_and_download_resume("testUserId", "V3 Compressed Fabric.docx")
    print(resumePath)
