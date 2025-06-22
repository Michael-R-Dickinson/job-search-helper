from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)
from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from dictor import dictor


class AuthorizationHandler(BaseCategoryHandler):
    def can_autofill_category(self) -> bool:
        return dictor(self.user_autofill_data, "authorization") is not None

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str:
        authorized_value = dictor(self.user_autofill_data, "authorization")
        if authorized_value == "us_authorized":
            return "I am authorized to work in the United States"
        if authorized_value == "no_authorization":
            return "I am not authorized to work in the United States"
        else:
            raise ValueError("Authorization value incorrect")

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool:
        authorized_value_bool = (
            dictor(self.user_autofill_data, "authorization") == "us_authorized"
        )

        positive_answer_choice = self.is_positive_answer(classified_input.value)
        if positive_answer_choice:
            return authorized_value_bool
        else:
            return not authorized_value_bool

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        raise NotImplementedError

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        raise NotImplementedError
