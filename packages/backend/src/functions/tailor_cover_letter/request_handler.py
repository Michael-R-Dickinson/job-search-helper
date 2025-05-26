import json
from firebase_functions import https_fn
from functions.tailor_cover_letter.cl_tailorer import tailor_cover_letter
from functions.validation import validate_file_name_and_userId, validate_linkedin_url


def validate_inputs(
    user_id: str,
    cover_letter_name: str,
    resume_name: str,
    job_description_link: str,
):
    """
    Validate the inputs for the cover letter tailoring request.
    """
    validate_file_name_and_userId(
        userId=user_id,
        fileName=cover_letter_name,
    )
    if not resume_name:
        raise ValueError(
            "Missing resumeName in the request. Please provide a valid resume name."
        )
    if not job_description_link:
        raise ValueError(
            "Missing jobDescriptionLink in the request. Please provide a valid LinkedIn job description link."
        )
    if not validate_linkedin_url(job_description_link):
        raise ValueError(
            "Invalid LinkedIn URL. Please provide a valid LinkedIn job description link."
        )


def handle_cover_letter_tailor_request(
    user_id: str,
    cover_letter_name: str,
    resume_name: str,
    job_description_link: str,
) -> https_fn.Response:
    """
    Handle the request to tailor a cover letter.
    - validate inputs
    - call tailoring function
    - handle errors and response objects
    """

    try:
        validate_inputs(
            user_id=user_id,
            cover_letter_name=cover_letter_name,
            resume_name=resume_name,
            job_description_link=job_description_link,
        )

        tailor_cover_letter(
            user_id=user_id,
            cover_letter_name=cover_letter_name,
            resume_name=resume_name,
            job_description_link=job_description_link,
        )

        return https_fn.Response(
            json.dumps(
                {
                    "message": "Hello world!",
                }
            ),
            status=200,
        )
    except ValueError as e:
        return https_fn.Response(
            json.dumps({"message": f"Invalid Inputs: f{e}"}),
            status=400,
        )
