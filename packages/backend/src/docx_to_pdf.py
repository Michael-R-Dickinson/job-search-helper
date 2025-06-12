import os
from typing import Union
from io import IOBase

from constants import RESUMES_PATH
import cloudconvert
from dotenv import load_dotenv
import requests


def convert_docx_to_pdf(docx_input: Union[str, IOBase]):
    """
    Convert a DOCX file to PDF using CloudConvert.

    Args:
        docx_input: Either a file path (string) or a file-like object

    Returns:
        str: URL to the converted PDF file
    """
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

    # Handle both file path and file object
    if isinstance(docx_input, str):
        # File path provided
        with open(docx_input, "rb") as file:
            files = {"file": file}
            response = requests.post(upload_url, data=upload_parameters, files=files)
    else:
        # Reset file pointer to beginning in case it was read before
        docx_input.seek(0)

        # For Flask FileStorage objects, we might need to specify the filename
        if hasattr(docx_input, "filename") and docx_input.filename:
            files = {
                "file": (
                    docx_input.filename,
                    docx_input,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                )
            }
        else:
            files = {"file": docx_input}

        response = requests.post(upload_url, data=upload_parameters, files=files)

    if response.status_code != 201:
        raise RuntimeError(
            f"File upload failed: {response.status_code} {response.text}"
        )

    job = cloudconvert.Job.wait(id=job["id"])

    export_task = None
    for task in job["tasks"]:
        print(f"Task: {task.get('name')}, Status: {task.get('status')}")
        if task.get("status") == "error":
            print(f"Task error: {task.get('message', 'No error message')}")

        if task.get("name") == "export-file" and task.get("status") == "finished":
            export_task = task
            break

    if export_task is None:
        # Find any failed tasks to provide better error information
        failed_tasks = [task for task in job["tasks"] if task.get("status") == "error"]
        if failed_tasks:
            error_messages = [
                task.get("message", "Unknown error") for task in failed_tasks
            ]
            raise RuntimeError(
                f"CloudConvert job failed. Errors: {'; '.join(error_messages)}"
            )
        else:
            raise RuntimeError("Export task not found or not finished successfully")

    file = export_task.get("result").get("files")[0]
    return file["url"]


if __name__ == "__main__":
    docx_path = f"{RESUMES_PATH}/business_resume.docx"
    convert_docx_to_pdf(docx_path)
