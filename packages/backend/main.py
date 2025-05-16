import json

from backend.errors.data_fetching_errors import DescriptionNotFound, LinkedinError
from backend.firebase import init_firebase
from backend.tailor_resume import tailor_resume
from firebase_functions import https_fn, options
from firebase_admin import initialize_app

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
    userId = req.args.get("userId")
    fileName = req.args.get("fileName")
    jobDescriptionLink = req.args.get("jobDescriptionLink")

    if not userId or not fileName or not jobDescriptionLink:
        return https_fn.Response(
            "Missing userId or fileName or jobDescriptionLink in the request.",
            status=400,
        )

    try:
        download_url = tailor_resume(
            userId=userId,
            resume_name=fileName,
            linkedin_url=jobDescriptionLink,
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
                "message": f"Tailored resume uploaded to: {download_url}",
                download_url: download_url,
            }
        ),
        status=200,
    )
