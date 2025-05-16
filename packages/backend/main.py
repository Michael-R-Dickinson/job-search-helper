from backend.firebase import init_firebase
from backend.tailor_resume import tailor_resume
from firebase_functions import https_fn
from firebase_admin import initialize_app
from firebase_functions import options

init_firebase()


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    )
)
def on_request(req: https_fn.Request) -> https_fn.Response:
    print("Received request:", req.args)

    userId = req.args.get("userId")
    fileName = req.args.get("fileName")
    jobDescriptionLink = req.args.get("jobDescriptionLink")

    if not userId or not fileName or not jobDescriptionLink:
        return https_fn.Response(
            "Missing userId or fileName or jobDescriptionLink in the request.",
            status=400,
        )

    download_url = tailor_resume(
        userId=userId,
        resume_name=fileName,
        linkedin_url=jobDescriptionLink,
    )

    return https_fn.Response(
        f"Tailored resume uploaded to: {download_url}",
        status=200,
    )
