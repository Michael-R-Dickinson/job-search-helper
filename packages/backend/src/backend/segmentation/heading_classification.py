import re

from backend.constants import SECTION_HEADER_TOKENS


_word_re = re.compile(r"\b\w+\b")


def is_header_text(text: str, header: str) -> bool:
    """Determines if a text is likely a section header for a given section.
    This should only be used on text that is already identified as a heading

    Compares the number of words that are likely indicative that it is this section header
    against the number of words that are not indicative of this section header

    If there are more positive tokens than other tokens, we mark it as this section header
    """

    positive_tokens = SECTION_HEADER_TOKENS[header]["positive"]
    vetos_tokens = SECTION_HEADER_TOKENS[header]["veto"]

    words = [t.lower() for t in _word_re.findall(text)]
    if not words:
        return False

    # Handle Vetoes
    if any(tok in vetos_tokens for tok in words):
        return False

    # Count positive tokens
    pos_token_count = sum(1 for tok in words if tok in positive_tokens)
    other_count = len(words) - pos_token_count

    return pos_token_count >= other_count


if __name__ == "__main__":
    experience_examples = [
        "Work History",
        "Work Experience",
        "Employment History",
        "Professional Experience",
        "Professional History",
        "History",
        "Employment",
        "Professional Summary",
        "Summary",
        "Skills & Experience",
        "Experience and Skills",
        "Summary of Qualifications",
    ]

    skills_examples = [
        "skills",
        "Key Skills",
        "Skills and Abilities",
        "Core Competencies",
        "Core Skills",
        "Technical Skills",
        "Technical Proficiencies",
        "Skills Summary",
        "Summary of Skills",
        "Summary of Qualifications",
    ]

    for h in skills_examples:
        print(f"{h:25} -> {is_header_text(h, 'skills')}")
    print("\n")

    for h in experience_examples:
        print(f"{h:25} -> {is_header_text(h, 'experience')}")
