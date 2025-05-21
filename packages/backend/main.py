import json

from backend.LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from backend.docx_to_pdf import convert_docx_to_pdf
from firebase import init_firebase
from firebase_functions import https_fn, options
from firebase_admin import initialize_app

from backend.errors.data_fetching_errors import DescriptionNotFound, LinkedinError
from backend.firebase import cache_set_object
from backend.tailor_resume import (
    get_tailoring_questions,
    tailor_resume,
    upload_tailored_resume,
)
from backend.util import (
    generate_uuid,
    validate_inputs_questions,
    validate_inputs_tailoring,
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


def handle_resume_questions_request(
    user_id: str, file_name: str, job_description_link: str
):
    try:
        validate_inputs_questions(
            userId=user_id,
            fileName=file_name,
            job_description_link=job_description_link,
        )

        questions, chat_history = get_tailoring_questions(
            user_id=user_id,
            resume_name=file_name,
            linkedin_url=job_description_link,
        )

        chat_id = generate_uuid()
        cache_set_object(
            id=chat_id,
            obj=chat_history,
        )

        return https_fn.Response(
            json.dumps(
                {
                    "message": "Tailoring questions generated",
                    "questions": questions.to_dict(),
                    "chat_id": chat_id,
                }
            ),
            status=200,
        )

    except ValueError as e:
        print(f"Invalid inputs: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Invalid inputs, {e}"}),
            status=400,
        )
    except DescriptionNotFound as e:
        print(f"Error fetching job description: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Error fetching job description, {e}"}),
            status=500,
        )
    except LinkedinError as e:
        print(f"Error parsing job description: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Error parsing job description, {e}"}),
            status=500,
        )
    except Exception as e:
        print(f"Error generating questions resume: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Error generating questions resume, {e}"}),
            status=500,
        )


def handle_resume_tailor_request(
    user_id: str, file_name: str, chat_id: str, question_answers: str
):
    """
    This is only called after the questions request has been made, thus it has a chat to pull in the chat
    History object with the context of the resume, and job description
    """
    try:
        validate_inputs_tailoring(
            userId=user_id,
            fileName=file_name,
            chat_id=chat_id,
            question_answers=question_answers,
        )

        question_responses = json.loads(question_answers)
        question_responses = AnsweredResumeTailoringQuestions(**question_responses)
        resume_path = tailor_resume(
            user_id=user_id,
            resume_name=file_name,
            chat_id=chat_id,
            question_responses=question_responses,
        )

        pdf_url = convert_docx_to_pdf(resume_path)

        docx_download_url, public_url = upload_tailored_resume(
            resume_path, user_id, file_name[:-5], extension=".docx", public=True
        )

        return https_fn.Response(
            json.dumps(
                {
                    "message": "Tailored resume uploaded to firebase",
                    "docx_download_url": docx_download_url,
                    "public_url": public_url,
                    "pdf_url": pdf_url,
                }
            ),
            status=200,
        )
    except ValueError as e:
        print(f"Invalid inputs: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Invalid inputs, {e}"}),
            status=400,
        )
    except Exception as e:
        print(f"Error tailoring resume: {e}")
        return https_fn.Response(
            json.dumps({"message": f"Error tailoring resume, {e}"}),
            status=500,
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
