from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
)
from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)


class AuthorizationHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        authorized_value = self._autofill_value
        if authorized_value == "us_authorized":
            return "Yes, I am authorized to work in the United States"
        if authorized_value == "no_authorization":
            return "No, I am not authorized to work in the United States"
        else:
            raise ValueError("Authorization value incorrect")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "us_authorized": ["Yes", "I am authorized to work"],
            "no_authorization": ["No", "I am not authorized"],
        }

    @property
    def VALUE_PATH(self) -> str:
        return "authorization"
