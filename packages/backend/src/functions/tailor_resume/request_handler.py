import json
from LLM_tailoring.schema import AnsweredResumeTailoringQuestions
from docx_to_pdf import convert_docx_to_pdf
from firebase.buckets import upload_tailored_resume
from functions.tailor_resume.tailorer import tailor_resume
from functions.validation import validate_inputs_tailoring

from firebase_functions import https_fn


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
