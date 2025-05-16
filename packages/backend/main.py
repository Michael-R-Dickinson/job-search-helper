import json

from firebase_functions import https_fn, options
from firebase_admin import initialize_app

from backend.errors.data_fetching_errors import DescriptionNotFound, LinkedinError
from backend.firebase import init_firebase
from backend.tailor_resume import tailor_resume, upload_tailored_resume
from backend.util import validate_inputs

init_firebase()


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=[
            "http://localhost:3000",
            "http://localhost:8080",
        ],
        cors_methods=["GET", "POST", "OPTIONS"],
    )
)
def on_request(req: https_fn.Request) -> https_fn.Response:
    user_id = req.args.get("userId")
    file_name = req.args.get("fileName")
    jobDescriptionLink = req.args.get("jobDescriptionLink")

    try:
        validate_inputs(
            userId=user_id,
            fileName=file_name,
            jobDescriptionLink=jobDescriptionLink,
        )

        resume_path = tailor_resume(
            user_id=user_id,
            resume_name=file_name,
            linkedin_url=jobDescriptionLink,
        )

        docx_download_url, public_url = upload_tailored_resume(
            resume_path, user_id, file_name[:-5], extension=".docx", public=True
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

    return https_fn.Response(
        json.dumps(
            {
                "message": "Tailored resume uploaded to firebase",
                "docx_download_url": docx_download_url,
                "public_url": public_url,
            }
        ),
        status=200,
    )


if __name__ == "__main__":
    req = https_fn.Request(
        environ={
            "userId": "testUserId",
            "fileName": "business_resume.docx_16_06-45-52.docx",
            "jobDescriptionLink": "https://www.linkedin.com/jobs/view/4096785875/?alternateChannel=search",
        }
    )
    res = on_request(req)
    print(res.get_data(as_text=True))
