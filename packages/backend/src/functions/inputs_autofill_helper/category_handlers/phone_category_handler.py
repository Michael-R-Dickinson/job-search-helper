from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    TextOnlyCategoryHandler,
    ClassifiedInput,
    ClassifiedInputList,
)


class PhoneNumberHandler(TextOnlyCategoryHandler):
    def can_autofill_category(self) -> bool:
        return self.user_autofill_data["phone"]["phoneNum"] is not None

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        phone = self.user_autofill_data["phone"]["phoneNum"]
        return phone
