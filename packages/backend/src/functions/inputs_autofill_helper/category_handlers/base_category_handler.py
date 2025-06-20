from abc import ABC

from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    FieldType,
)


class BaseCategoryHandler(ABC):
    def __init__(self, user_autofill_data):
        self.user_autofill_data = user_autofill_data

    # Helper for easily checking if we can autofill this input category with the user's data
    def can_autofill_category(self) -> bool:
        return True

    def is_positive_answer(self, text: str) -> bool:
        return any([answer in text.lower() for answer in ["yes", "true"]])

    def is_text_field(self, fieldType: FieldType):
        return fieldType in [
            FieldType.TEXT,
            FieldType.TEXTBOX,
            FieldType.URL,
            FieldType.PASSWORD,
            FieldType.DATE,
            FieldType.EMAIL,
            FieldType.NUMBER,
            FieldType.TEL,
        ]

    def get_autofill_value(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | bool | None:
        if not self.can_autofill_category():
            return None

        fieldType = classified_input.fieldType
        if self.is_text_field(fieldType):
            return self.handle_text_input(classified_input, other_inputs)

        if fieldType == FieldType.SELECT:
            return self.handle_select_input(classified_input, other_inputs)

        if fieldType == FieldType.RADIO:
            return self.handle_radio_input(classified_input, other_inputs)

        if fieldType == FieldType.CHECKBOX:
            return self.handle_checkbox_input(classified_input, other_inputs)

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        raise NotImplementedError("Text input handler must be implemented")

    def handle_select_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str:
        # If no other behavior is defined, we can just use the text input handler and pray
        self.handle_text_input(classified_input, other_inputs)

    def handle_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        raise NotImplementedError("No handler created for this radio input")

    def handle_checkbox_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        self.handle_radio_input(classified_input, other_inputs)


class TextOnlyCategoryHandler(BaseCategoryHandler):
    def can_autofill_category(self) -> bool:
        return self.get_text() != ""

    def get_text(self):
        return ""

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return self.get_text()

    def get_autofill_value(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        if (
            not self.is_text_field(classified_input.fieldType)
            or classified_input.fieldType == FieldType.SELECT
        ):
            raise ValueError(
                f"TextOnlyCategoryHandler can only handle text fields, got {classified_input.fieldType} for category {classified_input.category} - label {classified_input.label}"
            )

        return self.handle_text_input(classified_input, other_inputs)
