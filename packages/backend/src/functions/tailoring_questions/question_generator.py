from LLM_tailoring.resume_LLM_prompt import generate_questions_llm_prompt
from LLM_tailoring.gemini import generate_questions_with_llm

from firebase.buckets import fetch_and_download_resume
from linkedin_fetching.fetch_job_description import fetch_job_description_markdown
from docx_functions.marshaling.serialization import serialize_raw_docx


def get_tailoring_questions(user_id: str, resume_name: str, linkedin_url: str):
    job_description = fetch_job_description_markdown(linkedin_url)
    resume_path = fetch_and_download_resume(user_id, resume_name)

    raw_resume_string = serialize_raw_docx(resume_path)
    questions_prompt = generate_questions_llm_prompt(
        job_description=job_description,
        resume=raw_resume_string,
    )

    questions_object, chat_history = generate_questions_with_llm(questions_prompt)

    return questions_object, chat_history
