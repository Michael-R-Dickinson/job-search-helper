from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)


class UnknownCategoryHandler(BaseCategoryHandler):
    def get_autofill_value(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        return None

    def can_autofill_category(self) -> bool:
        return False

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return None

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        return None

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        return []

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        return []
