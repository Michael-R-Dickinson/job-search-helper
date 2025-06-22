from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class DisabilityHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        if self._autofill_value == "disabled":
            return "Yes, I have a disability"
        elif self._autofill_value == "enabled":
            return "No I do not have a disability"
        else:
            return "I prefer not to say"

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "disabled": [
                "Yes",
                "Yes, I have a disability",
                "I am disabled",
            ],
            "enabled": [
                "No",
                "No, I do not have a disability",
                "I am not disabled",
                "nope",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "disability"
