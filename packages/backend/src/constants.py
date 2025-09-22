# ENV Vars
import os

from dotenv import load_dotenv

load_dotenv()


GCP_API_KEY = os.environ.get("GCP_AI_API_KEY")
CACHE_LLM_RESPONSES = os.environ.get("CACHE_LLM_RESPONSES")
CLOUDCONVERT_API_KEY = os.environ.get("CLOUDCONVERT_API_KEY")
PROXY_URL = os.environ.get("PROXY_URL")

PROJECT_ID = "jobsearchhelper-231cf"
REGION = "us-central1"

CACHE_PATH = "llm_output_cache"
RESUMES_PATH = "resumes"
COVER_LETTERS_PATH = "cover_letters"

EXPERIENCE_TOKENS = {
    "experience",
    "employment",
    "work",
    "history",
    "career",
    "job",
    "professional",
}
EXPERIENCE_VETO_TOKENS = {
    "summary",
    "profile",
    "objective",
    "skills",
    "certifications",
}

SKILLS_TOKENS = {
    "skills",
    "abilities",
    "competencies",
    "proficiencies",
    "summary",
    "technical",
    "qualifications",
}

# Positive tokens are words make it likely that a piece of text is that section header
# Like "employment" indicates that the section is probably an experience section

SECTION_HEADER_TOKENS = {
    "experience": {"positive": EXPERIENCE_TOKENS, "veto": set()},
    "skills": {
        "positive": SKILLS_TOKENS,
        "veto": {"experience", "employment", "work"},
    },
}
