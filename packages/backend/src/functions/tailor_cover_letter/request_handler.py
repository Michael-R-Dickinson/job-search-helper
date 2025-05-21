import json
from firebase_functions import https_fn
from functions.tailor_cover_letter.cl_tailorer import tailor_cover_letter
from functions.validation import validate_file_name_and_userId, validate_linkedin_url


def validate_inputs(
    userId: str,
    fileName: str,
    job_description_link: str,
):
    """
    Validate the inputs for the cover letter tailoring request.
    """
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


def handle_cover_letter_tailor_request(
    user_id: str,
    file_name: str,
    job_description_link: str,
) -> https_fn.Response:
    """
    Handle the request to tailor a cover letter.
    """

    try:
        validate_inputs(
            userId=user_id,
            fileName=file_name,
            job_description_link=job_description_link,
        )

        tailor_cover_letter(
            user_id=user_id,
            file_name=file_name,
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
