import json
from firebase_functions import https_fn
from functions.free_reponse.free_response_writer import write_response
from functions.validation import validate_file_name_and_userId, validate_linkedin_url


def validate_inputs(
    user_id: str,
    prompt: str,
    job_description_link: str,
    resume_name: str,
) -> None:
    validate_file_name_and_userId(
        userId=user_id,
        fileName=resume_name,
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
    if not prompt:
        raise ValueError(
            "Missing prompt in the request. Please provide a valid prompt."
        )


def handle_write_free_response_request(
    user_id: str,
    prompt: str,
    job_description_link: str,
    resume_name: str,
) -> https_fn.Response:
    try:
        validate_inputs(
            user_id=user_id,
            job_description_link=job_description_link,
            prompt=prompt,
            resume_name=resume_name,
        )
        content = write_response(
            user_id=user_id,
            prompt=prompt,
            job_description_link=job_description_link,
            resume_name=resume_name,
        )
        return https_fn.Response(
            json.dumps(
                {"message": "Free response written successfully", "content": content}
            ),
            status=200,
        )
    except ValueError as e:
        return https_fn.Response(
            json.dumps({"message": f"Invalid Inputs: f{e}"}),
            status=400,
        )
