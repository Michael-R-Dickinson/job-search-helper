from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class VeteranHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        veteran_mapping = {
            "protected_veteran": "Yes, I am a protected veteran",
            "not_veteran": "No, I am not a veteran",
            "prefer_not_to_say": "I prefer not to say",
        }

        return veteran_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "protected_veteran": [
                "Yes",
                "Yes, I am a protected veteran",
                "Protected veteran",
                "Veteran",
                "I am a veteran",
                "Military veteran",
                "Armed forces veteran",
                "Disabled veteran",
            ],
            "not_veteran": [
                "No",
                "No, I am not a veteran",
                "Not a veteran",
                "Non-veteran",
                "I am not a veteran",
                "Civilian",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "veteran"
