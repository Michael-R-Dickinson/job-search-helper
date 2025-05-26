from LLM_tailoring.cover_letter.cover_letter_prompt import LLM_SYSTEM_INSTRUCTIONS
from LLM_tailoring.gemini import execute_tailoring_with_gemini
from google.genai import types


class TextGenerationSchema(types.Schema):
    content: str


def get_content_config() -> types.GenerateContentConfig:
    content_config = types.GenerateContentConfig(
        system_instruction=LLM_SYSTEM_INSTRUCTIONS,
        response_mime_type="application/json",
        response_schema=None,
        thinking_config=types.ThinkingConfig(
            # Disable thinking
            thinking_budget=0
        ),
    )
    return content_config


def generate_content_with_llm(prompt: str) -> TextGenerationSchema:
    return execute_tailoring_with_gemini(
        prompt=prompt,
        content_config=get_content_config(),
        model="gemini-2.5-flash-preview-04-17",
    )
