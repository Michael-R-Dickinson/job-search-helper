from backend.resumes import fetch_resume, parse_resume
from backend.scrapeLinkdin import fetch_job_description_markdown


def main(userId: str, resumeName: str, linkedinUrl: str):
    job_description = fetch_job_description_markdown(linkedinUrl)

    resume_path = fetch_resume(userId, resumeName)
    resume_data = parse_resume(resume_path)


if __name__ == "__main__":
    main(
        "testUserId",
        "V3 Compressed Fabric.docx",
        "https://www.linkedin.com/jobs/view/4220271151/?alternateChannel=search",
    )
