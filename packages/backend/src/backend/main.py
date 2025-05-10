import os
from firebase_admin import storage

from backend.firebase import init_firebase
from backend.linkedinScraper import fetch_job_description_markdown


def main(userId: str, resumeName: str, linkedinUrl: str):
    init_firebase()

    bucket = storage.bucket()
    resumeFile = bucket.blob(f"resumes/{userId}/{resumeName}")
    if not resumeFile.exists():
        print("Resume file does not exist")
        return

    os.makedirs(f"resumes/{userId}", exist_ok=True)
    resumeFile.download_to_filename(f"resumes/{userId}/{resumeName}")

    # Get the job description from the linkedin url
    jobDescription = fetch_job_description_markdown(linkedinUrl)


if __name__ == "__main__":
    main(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4220271151/?alternateChannel=search",
    )
