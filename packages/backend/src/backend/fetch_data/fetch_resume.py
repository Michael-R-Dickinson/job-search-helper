import os
from firebase_admin import storage

from backend.constants import RESUMES_PATH
from backend.firebase import init_firebase


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
    resumePath = fetch_and_download_resume("testUserId", "V3 Compressed Fabric.docx")
    print(resumePath)
