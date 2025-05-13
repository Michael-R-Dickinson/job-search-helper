from backend.resumes import (
    fetch_resume,
    parse_resume_for_sections,
    update_resume_section,
)
from backend.scrapeLinkdin import fetch_job_description_markdown
from backend.tailoring.serialization import serialize_raw_resume, serialize_sections
from backend.tailoring.LLM_prompt import generate_llm_prompt
from backend.tailoring.gemini import execute_tailoring_with_gemini


def main(userId: str, resumeName: str, linkedinUrl: str):
    job_description = fetch_job_description_markdown(linkedinUrl)

    resume_path = fetch_resume(userId, resumeName)
    resume_sections, doc = parse_resume_for_sections(resume_path)
    sections_string = serialize_sections(resume_sections)

    raw_resume_string = serialize_raw_resume(resume_path)
    prompt = generate_llm_prompt(
        job_description=job_description,
        resume=raw_resume_string,
        experience_paragraphs=sections_string["experience"],
        skills_paragraphs=sections_string["skills"],
    )

    # print("PROMPT:\n", prompt)

    updated_resume_data = execute_tailoring_with_gemini(prompt)
    update_resume_section(
        resume_sections["skills"],
        updated_resume_data.skillsSection,
    )

    doc.save("output.docx")


if __name__ == "__main__":
    main(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4220271151/?alternateChannel=search",
    )
