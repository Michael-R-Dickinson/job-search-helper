from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
    get_cover_letter_value,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)


class CoverLetterHandler(BaseCategoryHandler):
    def can_autofill_category(self) -> bool:
        return True

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return get_cover_letter_value()

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
