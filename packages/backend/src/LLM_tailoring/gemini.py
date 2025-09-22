import json
import os
from typing import Optional

from LLM_tailoring.resume.schema import CoverLetterSchema, ResumeResponseSchema
from dotenv import load_dotenv

from google import genai
from google.genai import types

from constants import CACHE_PATH
from utils import delete_top_level_files, get_objects_hash

AVAILABLE_SCHEMAS = [ResumeResponseSchema, CoverLetterSchema]

LLM_MODELS = {
    "flash": "gemini-2.5-flash",
    "flash-light": "gemini-2.5-flash-lite",
}


def get_cache_name(args):
    # Generate a unique cache path based on the input parameters
    hash_string = get_objects_hash(*args)
    cache_name = f"cache-{hash_string}.json"
    return cache_name


def load_cached_response(*args):
    if not (os.environ["CACHE_LLM_RESPONSES"] == "True"):
        return None

    cache_name = get_cache_name(args)
    cache_path = os.path.join(CACHE_PATH, cache_name)

    if not (os.path.exists(cache_path)):
        return None

    with open(cache_path, "r") as f:
        raw = f.read()

    # parse back into Pydantic model
    # a very hacky way to handle the fact that we cache multiple types, but as this is just for debugging
    # it is fine for now
    for model in AVAILABLE_SCHEMAS:
        try:
            return model.parse_raw(raw)
        except Exception:
            pass


def cache_response(*args, response):
    # Get rid of old cache files
    os.makedirs(CACHE_PATH, exist_ok=True)
    delete_top_level_files(CACHE_PATH)

    # We always cache the response, even if we don't load it later
    # This is because we want to be able to debug the response if needed
    cache_name = get_cache_name(args)
    cache_path = os.path.join(CACHE_PATH, cache_name)
    with open(cache_path, "w") as f:
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
    chat_history: Optional[dict] = None,
):
    cached_response = load_cached_response(str(prompt))
    if cached_response is not None:
        print("Successfully loaded cached response")
        return cached_response

    # Bring back chat history which includes the resume and job description
    chat = get_chat(content_config=content_config, model=model, history=chat_history)
    response = chat.send_message(
        prompt,
    )

    tailored_resume_raw = response.parsed

    cache_response(str(prompt), response=tailored_resume_raw)

    return tailored_resume_raw


if __name__ == "__main__":
    load_dotenv()

    from pydantic import BaseModel

    class TextGenerationSchema(BaseModel):
        content: str

    response = execute_tailoring_with_gemini(
        prompt="Hello whats your name?",
        content_config=types.GenerateContentConfig(
            system_instruction="Be nice",
            response_mime_type="application/json",
            response_schema=TextGenerationSchema,
            thinking_config=types.ThinkingConfig(
                # Disable thinking
                thinking_budget=0
            ),
        ),
        model="gemini-2.5-flash-preview-04-17",
        # model="claude-3-7-sonnet@20250219",
    )

    print(response)
