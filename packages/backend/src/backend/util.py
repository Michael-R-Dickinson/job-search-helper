from datetime import datetime
import json
import re
from typing import Optional
import uuid

from backend.LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from pydantic import ValidationError


def remove_unnecessary_whitespace(text):
    """
    Collapse sequences of single‐character tokens into words, while preserving
    spacing between real words.

    E.g. "K E Y  S K I L L S" → "KEY SKILLS"
    """
    # 1) Split on two or more whitespace characters → these mark word boundaries
    segments = re.split(r"\s{2,}", text)
    cleaned_segments = []

    for seg in segments:
        # Normalize inner whitespace to single spaces, strip edges
        tokens = seg.strip().split()
        # If every token is exactly one character, collapse them into a word
        if tokens and all(len(tok) == 1 for tok in tokens):
            cleaned_segments.append("".join(tokens))
        else:
            # Otherwise treat as normal text, rejoin with single spaces
            cleaned_segments.append(" ".join(tokens))

    # Rejoin the segments with a single space (words were split by ≥2 spaces)
    return " ".join(cleaned_segments)


def clean_heading_text(text):
    """
    Cleans the heading text by removing unnecessary whitespace and
    converting text to lower case
    """

    cleaned_text = remove_unnecessary_whitespace(text)

    normalized_text = cleaned_text.lower()

    return normalized_text


def print_sections(sections):
    for section, content in sections.items():
        print(f"Section: {section}")
        for paragraph in content:
            print(paragraph.text)
        print("\n")


def get_user_bucket_path(userId: str, tailored: bool = False) -> str:
    """
    Returns the path to the user's bucket,
    either for tailored resumes or original resumes
    """
    base = f"resumes/{userId}"
    if tailored:
        return f"{base}/tailored"
    else:
        return base


def get_time_string():
    return datetime.now().strftime("%d_%H-%M-%S")


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
    question_answers: str,
):
    validate_file_name_and_userId(
        userId=userId,
        fileName=fileName,
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


def generate_uuid() -> str:
    """
    Generates a UUID
    """
    return str(uuid.uuid4().hex)
