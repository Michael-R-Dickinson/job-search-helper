import os

from LLM_tailoring.resume.execute_tailoring import tailor_resume_with_llm
from LLM_tailoring.resume.resume_prompt import generate_tailoring_llm_prompt
from LLM_tailoring.resume.schema import AnsweredResumeTailoringQuestions
from firebase.realtime_db import cache_get_object
from utils import get_time_string
from firebase import init_firebase

from docx_functions.marshaling.serialization import (
    serialize_sections,
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
    cached_data = cache_get_object(chat_id)
    chat_history, questions = cached_data["chat_history"], cached_data["questions"]

    updated_resume_data = tailor_resume_with_llm(
        prompt=resume_tailoring_prompt, chat_history=chat_history
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


if __name__ == "__main__":
    init_firebase()
    path = tailor_resume(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4189842654/?alternateChannel=search",
    )
    print("Tailored resume path:", path)
