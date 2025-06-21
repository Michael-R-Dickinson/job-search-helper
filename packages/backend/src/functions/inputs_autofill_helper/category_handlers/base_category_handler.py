from abc import ABC
from typing import Union

from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    FieldType,
    SaveInstruction,
)

DECLINE_ANSWER_CANONICALS = [
    "prefer not to say",
    "i would rather not say",
    "choose not to specify",
]


def get_decline_answer_canonicals():
    return DECLINE_ANSWER_CANONICALS


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

        field_type = classified_input.fieldType
        if self.is_text_field(field_type):
            return self.handle_text_input(classified_input, other_inputs)

        if field_type == FieldType.SELECT:
            return self.handle_select_input(classified_input, other_inputs)

        if field_type == FieldType.RADIO:
            return self.handle_radio_input(classified_input, other_inputs)

        if field_type == FieldType.CHECKBOX:
            return self.handle_checkbox_input(classified_input, other_inputs)

        raise ValueError(f"unsupported field type {field_type}")

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        raise NotImplementedError("Text input handler must be implemented")

    def handle_select_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        # If no other behavior is defined, we can just use the text input handler and pray
        return self.handle_text_input(classified_input, other_inputs)

    def handle_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        raise NotImplementedError("No handler created for this radio input")

    def handle_checkbox_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        return self.handle_radio_input(classified_input, other_inputs)

    def save_filled_value(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        field_type = classified_input.fieldType
        if self.is_text_field(field_type) or field_type == FieldType.SELECT:
            return self.save_text_value(classified_input)

        elif field_type == FieldType.CHECKBOX or field_type == FieldType.RADIO:
            return self.save_checkable_value(classified_input)

        raise ValueError(f"Unsupported field type for save {field_type}")

    def save_text_value(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        raise NotImplementedError(
            f"No save handler created for text input on {self.__class__.__name__}"
        )

    def save_checkable_value(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        raise NotImplementedError(
            f"No save handler created for checkable input on {self.__class__.__name__}"
        )


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
