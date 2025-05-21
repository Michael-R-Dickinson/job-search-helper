import json
from errors.data_fetching_errors import DescriptionNotFound, LinkedinError
from firebase.realtime_db import cache_set_object
from functions.tailoring_questions.question_generator import get_tailoring_questions
from util import (
    generate_uuid,
)
from firebase_functions import https_fn
from functions.validation import validate_inputs_questions


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
