import json

from firebase import init_firebase
from firebase_functions import https_fn, options
from functions.free_reponse.request_handler import handle_write_free_response_request
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from functions.inputs_autofill_helper.request_handler import handle_autofill_request
from functions.tailor_cover_letter.request_handler import (
    handle_cover_letter_tailor_request,
)
from functions.tailor_resume.request_handler import handle_resume_tailor_request
from functions.tailoring_questions.request_handler import (
    handle_resume_questions_request,
)

init_firebase()


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST", "OPTIONS"],
    )
)
def on_request(req: https_fn.Request) -> https_fn.Response:
    """
    Main entry point for the function. This function routes between handle_resume_questions_request and handle_resume_tailor_request.
    We could have two functions but because we have low traffic we want to prevent two cold starts
    """
    function = req.args.get("function")
    if function == "get_questions":
        user_id = req.args.get("userId")
        file_name = req.args.get("fileName")
        jobDescriptionLink = req.args.get("jobDescriptionLink")
        return handle_resume_questions_request(
            user_id=user_id,
            file_name=file_name,
            job_description_link=jobDescriptionLink,
        )

    elif function == "tailor_resume":
        user_id = req.args.get("userId")
        file_name = req.args.get("fileName")
        chat_id = req.args.get("chatId")
        question_answers = req.args.get("questionAnswers")

        return handle_resume_tailor_request(
            user_id=user_id,
            file_name=file_name,
            chat_id=chat_id,
            question_answers=question_answers,
        )

    else:
        return https_fn.Response(
            json.dumps({"message": "Invalid function name"}),
            status=400,
        )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST", "OPTIONS"],
    )
)
def tailor_cover_letter(req: https_fn.Request) -> https_fn.Response:
    user_id = req.args.get("userId")
    cover_letter_name = req.args.get("coverLetterName")
    resume_name = req.args.get("resumeName")
    job_description_link = req.args.get("jobDescriptionLink")

    return handle_cover_letter_tailor_request(
        user_id=user_id,
        cover_letter_name=cover_letter_name,
        resume_name=resume_name,
        job_description_link=job_description_link,
    )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["GET", "POST", "OPTIONS"],
    )
)
def get_autofill_instructions(req: https_fn.Request) -> https_fn.Response:
    user_id = req.args.get("userId")
    prompt = req.args.get("prompt")
    job_description_link = req.args.get("jobDescriptionLink")
    resume_name = req.args.get("resumeName")

    return handle_write_free_response_request(
        user_id=user_id,
        prompt=prompt,
        job_description_link=job_description_link,
        resume_name=resume_name,
    )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],
        cors_methods=["POST", "OPTIONS"],
    )
)
def get_input_autofill_instructions(req: https_fn.Request) -> https_fn.Response:
    user_id = req.args.get("userId")
    data = req.get_json()
    return handle_autofill_request(user_id, data)
