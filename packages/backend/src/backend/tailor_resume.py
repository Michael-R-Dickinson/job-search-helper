import os

from backend.util import get_time_string, get_user_bucket_path
from firebase_admin import storage

from backend.fetch_data.fetch_job_description import fetch_job_description_markdown
from backend.LLM_tailoring.serialization import serialize_raw_resume, serialize_sections
from backend.LLM_tailoring.LLM_prompt import generate_llm_prompt
from backend.LLM_tailoring.gemini import execute_tailoring_with_gemini
from backend.constants import RESUMES_PATH
import datetime

from backend.segmentation.segment_resume import (
    parse_resume_for_sections,
)
from backend.fetch_data.fetch_resume import fetch_and_download_resume
from backend.deserialization.update_resume import (
    update_resume_section,
)


def upload_tailored_resume(resume_path: str, userId: str, resume_name: str):
    """
    Uploads resume to the user's bucket
    returns download url
    """
    bucket = storage.bucket()
    fileLocation = bucket.blob(
        f"{get_user_bucket_path(userId=userId, tailored=True)}/{resume_name}_{get_time_string()}.docx"
    )
    fileLocation.upload_from_filename(resume_path)

    download_url = fileLocation.generate_signed_url(
        version="v4",
        expiration=datetime.datetime.now() + datetime.timedelta(days=1),
        method="GET",
    )

    return download_url


def tailor_resume(userId: str, resume_name: str, linkedin_url: str):
    job_description = fetch_job_description_markdown(linkedin_url)

    resume_path = fetch_and_download_resume(userId, resume_name)
    resume_sections, doc = parse_resume_for_sections(resume_path)
    sections_strings = serialize_sections(resume_sections)

    raw_resume_string = serialize_raw_resume(resume_path)
    prompt = generate_llm_prompt(
        job_description=job_description,
        resume=raw_resume_string,
        experience_paragraphs=sections_strings["experience"],
        skills_paragraphs=sections_strings["skills"],
    )

    updated_resume_data = execute_tailoring_with_gemini(prompt)
    update_resume_section(
        resume_sections["skills"],
        updated_resume_data.skillsSection,
    )

    update_resume_section(
        resume_sections["experience"],
        updated_resume_data.experienceSection,
    )

    resume_path = f"{RESUMES_PATH}/outputs/resume-{get_time_string()}.docx"
    os.makedirs(f"{RESUMES_PATH}/outputs", exist_ok=True)
    doc.save(resume_path)

    download_url = upload_tailored_resume(resume_path, userId, resume_name)

    return download_url


if __name__ == "__main__":
    tailor_resume(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4220271151/?alternateChannel=search",
    )
