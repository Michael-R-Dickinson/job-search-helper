import os

from backend.fetch_data.fetch_job_description import fetch_job_description_markdown
from backend.tailoring.serialization import serialize_raw_resume, serialize_sections
from backend.tailoring.LLM_prompt import generate_llm_prompt
from backend.tailoring.gemini import execute_tailoring_with_gemini
from backend.constants import RESUMES_PATH
from datetime import datetime

from backend.resumes import update_resume_section
from backend.segmentation.segment_resume import (
    parse_resume_for_sections,
)
from backend.fetch_data.fetch_resume import download_resume


def main(userId: str, resumeName: str, linkedinUrl: str):
    job_description = fetch_job_description_markdown(linkedinUrl)

    resume_path = download_resume(userId, resumeName)
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

    os.makedirs(f"{RESUMES_PATH}/outputs", exist_ok=True)
    doc.save(
        f"{RESUMES_PATH}/outputs/resume-{datetime.now().strftime("%d_%H-%M-%S")}.docx"
    )


if __name__ == "__main__":
    main(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4220271151/?alternateChannel=search",
    )
