from enum import Enum


class InputType(Enum):
    FULL_NAME = "full_name"
    SPONSORSHIP_REQUIRED = "sponsorship_required"
    DISABILITY = "disability"
    VETERAN = "veteran"
    SPONSORSHIP_EXPLANATION = "sponsorship_explanation"
    LINKEDIN_URL = "linkedin_url"
    PERSONAL_WEBSITE = "personal_website"
    GENDER_IDENTITY = "gender_identity"
    SEXUAL_ORIENTATION = "sexual_orientation"
    UNKNOWN = "unknown"


PROTOTYPES: dict[InputType, list[str]] = {
    InputType.FULL_NAME: ["Please enter your full legal name", "Full name"],
    InputType.SPONSORSHIP_REQUIRED: [
        "Do you require or will you require sponsorship to work in the US?"
    ],
    InputType.SPONSORSHIP_EXPLANATION: [
        "If yes, please explain your sponsorship needs"
    ],
    InputType.DISABILITY: [
        "Do you have a disability or chronic condition (physical, visual, auditory, cognitive, mental, emotional, or other) that substantially limits one or more of your major life activities, including mobility, communication (seeing, hearing, speaking), and learning?"
    ],
    InputType.VETERAN: [
        "Are you a veteran or active member of the United States Armed Forces?"
    ],
    InputType.LINKEDIN_URL: ["LinkedIn profile URL"],
    InputType.PERSONAL_WEBSITE: ["Website or personal portfolio link"],
    InputType.GENDER_IDENTITY: ["How would you describe your gender identity?"],
    InputType.SEXUAL_ORIENTATION: ["What is your sexual orientation?"],
    InputType.UNKNOWN: ["gabagabagoo"],
}


def get_flattened_proto_strings():
    categories, texts = [], []
    for cat, variants in PROTOTYPES.items():
        for t in variants:
            categories.append(cat)
            texts.append(t)

    return categories, texts
