import os
from dotenv import load_dotenv

from google import genai
from google.genai import types

from LLM_tailoring.schema import (
    ResponseSchema,
    ResumeContent,
    ResumeTailoringQuestions,
)
from constants import CACHE_PATH
from LLM_tailoring.LLM_prompt import (
    LLM_SYSTEM_INSTRUCTIONS,
)


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


def get_chat(**kwargs):
    load_dotenv()
    api_key = os.environ.get("GCP_AI_API_KEY")
    client = genai.Client(api_key=api_key)

    chat = client.chats.create(
        config=types.GenerateContentConfig(
            system_instruction=LLM_SYSTEM_INSTRUCTIONS,
            response_mime_type="application/json",
            response_schema=ResponseSchema,
            thinking_config=types.ThinkingConfig(
                # Disable thinking
                thinking_budget=0
            ),
        ),
        model="gemini-2.5-flash-preview-04-17",
        **kwargs,
    )

    return chat


def generate_questions_with_llm(prompt: str):
    chat = get_chat()
    response = chat.send_message(prompt)
    chat_history = chat.get_history()

    questions_raw: ResumeTailoringQuestions = response.parsed

    return questions_raw, chat_history


def execute_tailoring_with_gemini(prompt: str, chat_history: dict) -> ResumeContent:
    cached_response = load_cached_response()
    if cached_response is not None:
        return cached_response

    # Bring back chat history which includes the resume and job description
    chat = get_chat(history=chat_history)
    response = chat.send_message(
        prompt,
    )

    tailored_resume_raw: ResumeContent = response.parsed

    return tailored_resume_raw


if __name__ == "__main__":
    load_dotenv()

    api_key = os.environ.get("GCP_AI_API_KEY")
    print(f"API Key: {api_key}")
