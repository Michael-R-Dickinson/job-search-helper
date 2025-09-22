# ENV Vars
import os
import sys

from dotenv import load_dotenv

load_dotenv()

# Environment variable validation
def validate_env_vars():
    """Validate that required environment variables are set and warn about missing optional ones."""

    # Essential environment variables - app will not work without these
    essential_vars = {
        "GCP_AI_API_KEY": "Required for AI/LLM functionality"
    }

    # Non-essential environment variables - app can work with degraded functionality
    optional_vars = {
        "CACHE_LLM_RESPONSES": "Controls LLM response caching (defaults to False)",
        "CLOUDCONVERT_API_KEY": "Required for DOCX to PDF conversion",
        "PROXY_URL": "Optional proxy for LinkedIn fetching"
    }

    missing_essential = []
    missing_optional = []

    # Check essential variables
    for var_name, description in essential_vars.items():
        value = os.environ.get(var_name)
        if not value or value.strip() == "":
            missing_essential.append(f"  - {var_name}: {description}")

    # Check optional variables
    for var_name, description in optional_vars.items():
        value = os.environ.get(var_name)
        if not value or value.strip() == "":
            missing_optional.append(f"  - {var_name}: {description}")

    # Handle missing essential variables
    if missing_essential:
        error_msg = "❌ CRITICAL: Missing required environment variables:\n" + "\n".join(missing_essential)
        error_msg += "\n\nPlease set these variables in your .env file or environment."
        print(error_msg, file=sys.stderr)
        raise RuntimeError("Missing required environment variables")

    # Warn about missing optional variables
    if missing_optional:
        warning_msg = "⚠️  WARNING: Missing optional environment variables:\n" + "\n".join(missing_optional)
        warning_msg += "\n\nSome functionality may be limited."
        print(warning_msg, file=sys.stderr)

# Validate environment variables on import
validate_env_vars()

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
