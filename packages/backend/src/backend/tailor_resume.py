import os

from backend.LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from backend.firebase import cache_get_object, init_firebase
from backend.util import get_time_string, get_user_bucket_path
from firebase_admin import storage

from backend.fetch_data.fetch_job_description import fetch_job_description_markdown
from backend.LLM_tailoring.serialization import serialize_raw_resume, serialize_sections
from backend.LLM_tailoring.LLM_prompt import (
    generate_questions_llm_prompt,
    generate_tailoring_llm_prompt,
)
from backend.LLM_tailoring.gemini import (
    execute_tailoring_with_gemini,
    generate_questions_with_llm,
)
from backend.constants import RESUMES_PATH
import datetime

from backend.segmentation.segment_resume import (
    parse_resume_for_sections,
)
from backend.fetch_data.fetch_resume import fetch_and_download_resume
from backend.deserialization.update_resume import (
    update_resume_section,
)


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


def tailor_resume(
    user_id: str,
    resume_name: str,
    question_responses: AnsweredResumeTailoringQuestions,
    chat_id: str,
):
    resume_path = fetch_and_download_resume(user_id, resume_name)
    resume_sections, doc = parse_resume_for_sections(resume_path)
    sections_strings = serialize_sections(resume_sections)

    resume_tailoring_prompt = generate_tailoring_llm_prompt(
        experience_paragraphs=sections_strings["experience"],
        skills_paragraphs=sections_strings["skills"],
        question_responses=question_responses,
    )

    # ChatID allows us to pull in the chat history object
    chat_history = cache_get_object(chat_id)
    updated_resume_data = execute_tailoring_with_gemini(
        resume_tailoring_prompt, chat_history
    )

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

    return resume_path


def get_tailoring_questions(user_id: str, resume_name: str, linkedin_url: str):
    job_description = fetch_job_description_markdown(linkedin_url)
    resume_path = fetch_and_download_resume(user_id, resume_name)

    raw_resume_string = serialize_raw_resume(resume_path)
    questions_prompt = generate_questions_llm_prompt(
        job_description=job_description,
        resume=raw_resume_string,
    )

    questions_object, chat_history = generate_questions_with_llm(questions_prompt)

    return questions_object, chat_history


if __name__ == "__main__":
    init_firebase()
    path = tailor_resume(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4189842654/?alternateChannel=search",
    )
    print("Tailored resume path:", path)
