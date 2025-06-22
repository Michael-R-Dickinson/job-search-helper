from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)
from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from dictor import dictor

from functions.inputs_autofill_helper.option_selection import (
    get_most_similar_canonical_option,
)


class AuthorizationHandler(BaseCategoryHandler):
    CANONICALS = {
        "us_authorized": ["Yes", "I am authorized to work"],
        "no_authorization": ["No", "I am not authorized"],
    }

    def can_autofill_category(self) -> bool:
        return dictor(self.user_autofill_data, "authorization") is not None

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str:
        authorized_value = dictor(self.user_autofill_data, "authorization")
        if authorized_value == "us_authorized":
            return "Yes, I am authorized to work in the United States"
        if authorized_value == "no_authorization":
            return "No, I am not authorized to work in the United States"
        else:
            raise ValueError("Authorization value incorrect")

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        authorization_value = dictor(self.user_autofill_data, "authorization")
        best_canonical = get_most_similar_canonical_option(
            classified_input.label, self.CANONICALS
        )
        if authorization_value == best_canonical:
            return True

        return None

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        value = classified_input.value
        best_canonical = get_most_similar_canonical_option(value, self.CANONICALS)

        return {
            "path": "authorization",
            "value": best_canonical,
            "dont_overwrite_existing": True,
        }

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        best_canonical = get_most_similar_canonical_option(classified_input.label)
        checked = classified_input.value == True

        # Only set value for checked options
        if not checked:
            return []

        return {"path": "authorization", "value": best_canonical}
