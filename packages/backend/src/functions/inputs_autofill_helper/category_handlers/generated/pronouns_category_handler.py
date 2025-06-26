from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class PronounsHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        pronoun_mapping = {
            "he/him": "he/him",
            "she/her": "she/her",
            "they/them": "they/them",
            "ze/zir": "ze/zir",
            "other": "Other",
            "prefer_not_to_say": "I prefer not to say",
        }

        return pronoun_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "he/him": [
                "he/him",
                "He/Him",
                "he",
                "him",
                "He",
                "Him",
                "masculine",
                "male pronouns",
            ],
            "she/her": [
                "she/her",
                "She/Her",
                "she",
                "her",
                "She",
                "Her",
                "feminine",
                "female pronouns",
            ],
            "they/them": [
                "they/them",
                "They/Them",
                "they",
                "them",
                "They",
                "Them",
                "neutral",
                "gender neutral",
            ],
            "ze/zir": [
                "ze/zir",
                "Ze/Zir",
                "ze",
                "zir",
                "Ze",
                "Zir",
            ],
            "other": [
                "Other",
                "other",
                "Custom",
                "Different",
                "Self-describe",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "identity/pronouns"
