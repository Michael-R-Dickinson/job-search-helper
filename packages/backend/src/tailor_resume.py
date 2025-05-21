import os

from LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from firebase.realtime_db import cache_get_object
from util import get_time_string
from firebase import init_firebase

from linkedin_fetching.fetch_job_description import fetch_job_description_markdown
from docx_functions.marshaling.serialization import (
    serialize_raw_resume,
    serialize_sections,
)
from LLM_tailoring.LLM_prompt import (
    generate_questions_llm_prompt,
    generate_tailoring_llm_prompt,
)
from LLM_tailoring.gemini import (
    execute_tailoring_with_gemini,
    generate_questions_with_llm,
)
from constants import RESUMES_PATH

from docx_functions.segmentation.segment_resume import (
    parse_resume_for_sections,
)
from firebase.buckets import fetch_and_download_resume
from docx_functions.marshaling.deserialization import (
    update_resume_section,
)


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
