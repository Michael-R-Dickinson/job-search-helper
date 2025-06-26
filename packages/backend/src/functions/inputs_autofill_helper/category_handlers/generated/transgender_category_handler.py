from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class TransgenderHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        transgender_mapping = {
            "yes": "Yes, I am transgender",
            "no": "No, I am not transgender",
            "prefer_not_to_say": "I prefer not to say",
        }

        return transgender_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "yes": [
                "Yes",
                "Yes, I am transgender",
                "Transgender",
                "Trans",
                "I am transgender",
                "I identify as transgender",
            ],
            "no": [
                "No",
                "No, I am not transgender",
                "Not transgender",
                "Cisgender",
                "Cis",
                "I am not transgender",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "identity/transgender"
