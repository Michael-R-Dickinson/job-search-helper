import os

from backend.constants import RESUMES_PATH
import cloudconvert
from dotenv import load_dotenv
import requests


def convert_docx_to_pdf(docx_path: str):
    load_dotenv()

    api_key = os.environ["CLOUDCONVERT_API_KEY"]
    if not api_key:
        raise RuntimeError("Missing CLOUDCONVERT_API_KEY env var")

    cloudconvert.configure(api_key=api_key, sandbox=False)

    job = cloudconvert.Job.create(
        payload={
            "tasks": {
                "import-file": {"operation": "import/upload"},
                "convert-file": {
                    "operation": "convert",
                    "input_format": "docx",
                    "output_format": "pdf",
                    "engine": "office",
                    "input": ["import-file"],
                    "optimize_print": True,
                    "pdf_a": False,
                    "include_markup": False,
                    "bookmarks": False,
                    "engine_version": "2.1",
                    "filename": "output.pdf",
                },
                "export-file": {
                    "operation": "export/url",
                    "input": ["convert-file"],
                    "inline": True,
                    "archive_multiple_files": False,
                },
            },
            "tag": "jobbuilder",
        }
    )
    import_task = next(task for task in job["tasks"] if task["name"] == "import-file")
    upload_url = import_task["result"]["form"]["url"]
    upload_parameters = import_task["result"]["form"]["parameters"]

    # Upload the file
    with open(docx_path, "rb") as file:
        files = {"file": file}
        response = requests.post(upload_url, data=upload_parameters, files=files)

    if response.status_code != 201:
        raise RuntimeError(
            f"File upload failed: {response.status_code} {response.text}"
        )

    job = cloudconvert.Job.wait(id=job["id"])

    for task in job["tasks"]:
        if task.get("name") == "export-file" and task.get("status") == "finished":
            export_task = task

    file = export_task.get("result").get("files")[0]
    return file["url"]


if __name__ == "__main__":
    docx_path = f"{RESUMES_PATH}/business_resume.docx"
    convert_docx_to_pdf(docx_path)
