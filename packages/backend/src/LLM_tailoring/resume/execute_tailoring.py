from LLM_tailoring.resume.resume_prompt import LLM_SYSTEM_INSTRUCTIONS
from google.genai import types
from LLM_tailoring.resume.schema import ResumeResponseSchema, ResumeTailoringQuestions
from LLM_tailoring.gemini import execute_tailoring_with_gemini, get_chat
from google.genai import types


def get_content_config() -> types.GenerateContentConfig:
    content_config = types.GenerateContentConfig(
        system_instruction=LLM_SYSTEM_INSTRUCTIONS,
        response_mime_type="application/json",
        response_schema=ResumeResponseSchema,
        thinking_config=types.ThinkingConfig(
            # Disable thinking
            thinking_budget=0
        ),
    )
    return content_config


def tailor_resume_with_llm(prompt: str, chat_history: dict):
    return execute_tailoring_with_gemini(
        prompt=prompt,
        content_config=get_content_config(),
        model="gemini-2.5-flash-preview-04-17",
        chat_history=chat_history,
    )


def generate_questions_with_llm(prompt: str):
    chat = get_chat(
        content_config=get_content_config(),
        model="gemini-2.5-flash-preview-04-17",
    )
    response = chat.send_message(prompt)
    chat_history = chat.get_history()

    questions_raw: ResumeTailoringQuestions = response.parsed

    return questions_raw, chat_history
