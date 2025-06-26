from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class GenderIdentityHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        gender_mapping = {
            "man": "Man",
            "woman": "Woman",
            "non_binary": "Non-binary",
            "other": "Other",
            "prefer_not_to_say": "I prefer not to say",
        }

        return gender_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "man": [
                "Male",
                "Man",
                "M",
                "male",
                "man",
            ],
            "woman": [
                "Female",
                "Woman",
                "F",
                "female",
                "woman",
            ],
            "non_binary": [
                "Non-binary",
                "Nonbinary",
                "Non binary",
                "Enby",
                "Gender neutral",
                "Genderqueer",
                "Neither",
            ],
            "other": [
                "Other",
                "Self-describe",
                "Different identity",
                "Another option",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "identity/gender"
