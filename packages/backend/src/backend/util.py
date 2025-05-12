import re


def remove_unnecessary_whitespace(text):
    """
    Collapse sequences of single‐character tokens into words, while preserving
    spacing between real words.

    E.g. "K E Y  S K I L L S" → "KEY SKILLS"
    """
    # 1) Split on two or more whitespace characters → these mark word boundaries
    segments = re.split(r"\s{2,}", text)
    cleaned_segments = []

    for seg in segments:
        # Normalize inner whitespace to single spaces, strip edges
        tokens = seg.strip().split()
        # If every token is exactly one character, collapse them into a word
        if tokens and all(len(tok) == 1 for tok in tokens):
            cleaned_segments.append("".join(tokens))
        else:
            # Otherwise treat as normal text, rejoin with single spaces
            cleaned_segments.append(" ".join(tokens))

    # Rejoin the segments with a single space (words were split by ≥2 spaces)
    return " ".join(cleaned_segments)


def clean_heading_text(text):
    """
    Cleans the heading text by removing unnecessary whitespace and
    converting text to lower case
    """

    cleaned_text = remove_unnecessary_whitespace(text)

    normalized_text = cleaned_text.lower()

    return normalized_text
