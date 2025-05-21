import datetime
import os
from util import get_time_string
from firebase import init_firebase
from firebase_admin import storage

from constants import RESUMES_PATH


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


def fetch_and_download_resume(userId: str, resumeName: str):
    bucket = storage.bucket()
    resumeFile = bucket.blob(f"resumes/{userId}/{resumeName}")
    if not resumeFile.exists():
        raise FileNotFoundError(f"Resume {resumeName} not found for user {userId}")

    os.makedirs(f"{RESUMES_PATH}/{userId}", exist_ok=True)
    resumePath = f"{RESUMES_PATH}/{userId}/{resumeName}"
    resumeFile.download_to_filename(resumePath)

    return resumePath


if __name__ == "__main__":
    init_firebase()
    resumePath = fetch_and_download_resume("testUserId", "V3 Compressed Fabric.docx")
    print(resumePath)
