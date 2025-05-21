from LLM_tailoring.cover_letter.cover_letter_prompt import LLM_SYSTEM_INSTRUCTIONS
from LLM_tailoring.gemini import execute_tailoring_with_gemini
from LLM_tailoring.resume.schema import CoverLetterSchema, SerializedParagraph
from google.genai import types
from pydantic import BaseModel


def get_content_config() -> types.GenerateContentConfig:
    content_config = types.GenerateContentConfig(
        system_instruction=LLM_SYSTEM_INSTRUCTIONS,
        response_mime_type="application/json",
        response_schema=CoverLetterSchema,
        thinking_config=types.ThinkingConfig(
            # Disable thinking
            thinking_budget=0
        ),
    )
    return content_config


def tailor_cover_letter_with_llm(prompt: str) -> CoverLetterSchema:
    return execute_tailoring_with_gemini(
        prompt=prompt,
        content_config=get_content_config(),
        model="gemini-2.5-flash-preview-04-17",
    )
