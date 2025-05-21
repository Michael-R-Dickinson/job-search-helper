import datetime
import os

from firebase import init_firebase
from firebase_admin import storage

from constants import COVER_LETTERS_PATH, RESUMES_PATH
from utils import get_time_string


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
