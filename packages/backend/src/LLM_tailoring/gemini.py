import os
from typing import Optional
from LLM_tailoring.resume.prompt import LLM_SYSTEM_INSTRUCTIONS
from dotenv import load_dotenv

from google import genai
from google.genai import types

from LLM_tailoring.schema import (
    ResumeContent,
    ResumeResponseSchema,
    ResumeTailoringQuestions,
)
from constants import CACHE_PATH


def load_cached_response():
    if not (os.environ["CACHE_LLM_RESPONSES"] == "True"):
        return None
    if not (os.path.exists(CACHE_PATH)):
        return None

    print(f"Loading cached response from {CACHE_PATH}")
    with open(CACHE_PATH, "r") as f:
        raw = f.read()
    # parse back into Pydantic model
    return ResumeContent.parse_raw(raw)


def cache_response(response: ResumeContent):
    # We always cache the response, even if we don't load it later
    # This is because we want to be able to debug the response if needed
    with open(CACHE_PATH, "w") as f:
        f.write(response.json())


def get_chat(content_config: types.GenerateContentConfig, **kwargs):
    load_dotenv()
    api_key = os.environ.get("GCP_AI_API_KEY")
    client = genai.Client(api_key=api_key)

    chat = client.chats.create(
        config=content_config,
        **kwargs,
    )

    return chat


def execute_tailoring_with_gemini(
    prompt: str,
    content_config: types.GenerateContentConfig,
    model: str,
    chat_history: Optional[dict],
):
    cached_response = load_cached_response()
    if cached_response is not None:
        return cached_response

    # Bring back chat history which includes the resume and job description
    chat = get_chat(content_config=content_config, model=model, history=chat_history)
    response = chat.send_message(
        prompt,
    )

    tailored_resume_raw: ResumeContent = response.parsed

    return tailored_resume_raw


if __name__ == "__main__":
    load_dotenv()

    api_key = os.environ.get("GCP_AI_API_KEY")
    print(f"API Key: {api_key}")
