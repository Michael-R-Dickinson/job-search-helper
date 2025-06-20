from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    TextOnlyCategoryHandler,
)


class FirstNameHandler(TextOnlyCategoryHandler):
    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        first_name = self.user_autofill_data["name"]["first_name"]
        return first_name


class LastNameHandler(TextOnlyCategoryHandler):
    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        last_name = self.user_autofill_data["name"]["last_name"]
        return last_name


class FullNameHandler(TextOnlyCategoryHandler):
    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        first_name = self.user_autofill_data["name"]["first_name"]
        last_name = self.user_autofill_data["name"]["last_name"]
        return f"{first_name} {last_name}"
