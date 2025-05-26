import re


def validate_linkedin_url(url: str) -> bool:
    """
    Validates the LinkedIn URL

    should be in one of the following formats:
    - https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4223055571
    - https://www.linkedin.com/jobs/view/4223055571/?alternateChannel=search
    """
    pattern = re.compile(
        r"^https://www\.linkedin\.com/jobs/"
        r"(?:"
        r"collections/recommended/\?currentJobId=\d+"
        r"|"
        r"view/\d+/\?alternateChannel=[^/]+"
        r")$"
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
