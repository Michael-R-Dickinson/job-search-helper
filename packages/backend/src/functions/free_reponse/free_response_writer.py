from LLM_tailoring.claude import execute_generation_with_claude
from LLM_tailoring.free_response.text_based_prompt import generate_free_response_prompt

from docx_functions.marshaling.serialization import serialize_raw_docx

from firebase.buckets import fetch_and_download_resume
from linkedin_fetching.fetch_job_description import fetch_job_description_markdown


def write_response(
    user_id: str,
    prompt: str,
    job_description_link: str,
    resume_name: str,
) -> str:
    resume_path = fetch_and_download_resume(user_id, resume_name)
    resume_rawtext = serialize_raw_docx(resume_path)
    job_description = fetch_job_description_markdown(job_description_link)

    prompt = generate_free_response_prompt(
        job_description=job_description,
        resume=resume_rawtext,
    )

    response = execute_generation_with_claude(prompt, model="claude-sonnet-4-20250514")

    return response
