import json
import re

from LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from pydantic import ValidationError


def validate_linkedin_url(url: str) -> bool:
    """
    Validates the LinkedIn URL
    """
    pattern = re.compile(
        r"^(https?://)?(www\.)?(linkedin\.com)/jobs/view/\d+/\?alternateChannel=search"
    )
    return bool(pattern.match(url))


def validate_file_name(file_name: str) -> bool:
    """
    Validates the file name
    """
    pattern = re.compile(r"^[\w\s\-_.]+\.docx$")
    return bool(pattern.match(file_name))


def validate_file_name_and_userId(
    userId: str,
    fileName: str,
):
    """
    Validates the file name and userId
    """
    if not userId or not fileName:
        raise ValueError("Missing userId or fileName in the request.")

    if not validate_file_name(fileName):
        raise ValueError(
            "Invalid file name. Please provide a valid file name with .docx extension."
        )


def validate_inputs_questions(
    userId: str,
    fileName: str,
    job_description_link: str,
):
    validate_file_name_and_userId(
        userId=userId,
        fileName=fileName,
    )
    if not job_description_link:
        raise ValueError(
            "Missing jobDescriptionLink in the request. Please provide a valid LinkedIn job description link."
        )
    if not validate_linkedin_url(job_description_link):
        raise ValueError(
            "Invalid LinkedIn URL. Please provide a valid LinkedIn job description link."
        )


def validate_inputs_tailoring(
    userId: str,
    fileName: str,
    chat_id: str,
    question_answers: str,
):
    validate_file_name_and_userId(
        userId=userId,
        fileName=fileName,
    )
    if not chat_id:
        raise ValueError(
            "Missing chatId in the request. Please provide a valid chat ID."
        )

    if not question_answers:
        raise ValueError(
            "Missing questionAnswers in the request. Please provide valid question answers."
        )
    try:
        question_answers_obj = json.loads(question_answers)
        AnsweredResumeTailoringQuestions(**question_answers_obj)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Invalid questionAnswers format. Please provide valid JSON. Error: {e}"
        )
    except ValidationError as e:
        raise ValueError(f"Validation failed for questionAnswers: {e.errors()}")
