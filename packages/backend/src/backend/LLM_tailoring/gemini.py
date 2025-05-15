import os
from dotenv import load_dotenv
from pydantic import BaseModel

from google import genai
from google.genai import types

from backend.LLM_tailoring.schema import ResumeOutput
from backend.constants import CACHE_PATH
from backend.LLM_tailoring.LLM_prompt import LLM_CONTENT_CONFIG


def load_cached_response():
    if not (os.environ["CACHE_LLM_RESPONSES"] == "True"):
        return None
    if not (os.path.exists(CACHE_PATH)):
        return None

    print(f"Loading cached response from {CACHE_PATH}")
    with open(CACHE_PATH, "r") as f:
        raw = f.read()
    # parse back into Pydantic model
    return ResumeOutput.parse_raw(raw)


def cache_response(response: ResumeOutput):
    # We always cache the response, even if we don't load it later
    # This is because we want to be able to debug the response if needed
    with open(CACHE_PATH, "w") as f:
        f.write(response.json())


def execute_tailoring_with_gemini(prompt: str):
    load_dotenv()

    cached_response = load_cached_response()
    if cached_response is not None:
        return cached_response

    api_key = os.environ.get("GCP_AI_API_KEY")

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        # Flash 2.5 is stronger but more expensive
        # model="gemini-2.0-flash",
        model="gemini-2.5-flash-preview-04-17",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=LLM_CONTENT_CONFIG,
            response_mime_type="application/json",
            response_schema=ResumeOutput,
            # Uncomment to disable thinking
            # thinking_budget=0,
        ),
    )

    # Use instantiated objects.
    tailored_resume_raw: ResumeOutput = response.parsed
    cache_response(tailored_resume_raw)

    return tailored_resume_raw


if __name__ == "__main__":
    load_dotenv()

    api_key = os.environ.get("GCP_AI_API_KEY")
    print(f"API Key: {api_key}")
