import json

from firebase import init_firebase
from firebase_functions import https_fn, options
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


# @https_fn.on_request(
#     cors=options.CorsOptions(
#         cors_origins=["*"],
#         cors_methods=["GET", "POST", "OPTIONS"],
#     )
# )
# def tailor_cover_letter(req: https_fn.Request) -> https_fn.Response:
#     userId = req.args.get("userId")
#     fileName = req.args.get("fileName")
#     jobDescriptionLink = (req.args.get("jobDescriptionLink"),)

#     get_tailored_cover_letter(
#         userId=userId,
#         fileName=fileName,
#         jobDescriptionLink=jobDescriptionLink,
#     )
