from abc import ABC, abstractmethod
from typing import Union, override

from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    FieldType,
    SaveInstruction,
)

from dictor import dictor

from functions.inputs_autofill_helper.option_selection import (
    get_most_similar_canonical_option,
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
            return self.fill_text_input(classified_input, other_inputs)

        if field_type == FieldType.SELECT:
            return self.fill_select_input(classified_input, other_inputs)

        if field_type == FieldType.RADIO:
            return self.fill_radio_input(classified_input, other_inputs)

        if field_type == FieldType.CHECKBOX:
            return self.fill_checkbox_input(classified_input, other_inputs)

        raise ValueError(f"unsupported field type {field_type}")

    # Helper for easily checking if we can autofill this input category with the user's data
    @abstractmethod
    def can_autofill_category(self) -> bool:
        pass

    @abstractmethod
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        raise NotImplementedError("Text input handler must be implemented")

    def fill_select_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        # If no other behavior is defined, we can just use the text input handler and pray
        return self.fill_text_input(classified_input, other_inputs)

    @abstractmethod
    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        raise NotImplementedError("No handler created for this radio input")

    def fill_checkbox_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        return self.fill_radio_input(classified_input, other_inputs)

    # Saving Methods
    def save_filled_value(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        field_type = classified_input.fieldType
        if self.is_text_field(field_type) or field_type == FieldType.SELECT:
            return self.save_text_input(classified_input)

        elif field_type == FieldType.CHECKBOX or field_type == FieldType.RADIO:
            return self.save_checkable_input(classified_input)

        raise ValueError(f"Unsupported field type for save {field_type}")

    @abstractmethod
    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        pass

    @abstractmethod
    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> Union[SaveInstruction, list[SaveInstruction]]:
        pass


class TextOnlyCategoryHandler(BaseCategoryHandler, ABC):
    @override
    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        raise ValueError(
            f"TextOnlyCategoryHandler {self.__class__.__name__} can only handle text fields, got {classified_input.fieldType} while filling for label {classified_input.label}"
        )

    @override
    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        raise ValueError(
            f"TextOnlyCategoryHandler {self.__class__.__name__} can only handle text fields, got {classified_input.fieldType} while saving for label {classified_input.label}"
        )


class SimpleTextOnlyCategoryHandler(TextOnlyCategoryHandler, ABC):
    def _get_text(self) -> str:
        return dictor(self.user_autofill_data, self.VALUE_PATH.replace("/", "."))

    @override
    def can_autofill_category(self) -> bool:
        return self._get_text() is not None

    @override
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return self._get_text()

    @override
    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        if classified_input.value == "" or classified_input.value is None:
            return []

        return {
            "value": classified_input.value,
            "path": self.VALUE_PATH,
        }

    @property
    @abstractmethod
    def VALUE_PATH(self) -> str:
        # ie "name/first_name"
        pass


class EnumBasedHandler(BaseCategoryHandler, ABC):
    """
    For input categories whose autofill value in the schema is represented by an enum - ie. disability status is represented by an enum with values "disabled" or "enabled".
    These input fields could be either a select dropdown or a radio button, or sometimes even a raw text box.
    """

    @property
    def _autofill_value(self):
        return dictor(self.user_autofill_data, self.VALUE_PATH.replace("/", "."))

    def can_autofill_category(self) -> bool:
        return self._autofill_value is not None

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        label = classified_input.label
        best_canonical = get_most_similar_canonical_option(label, self.CANONICALS)
        print(f"label: {label} best_canonical {best_canonical}")

        if best_canonical == self._autofill_value:
            return True

        return False

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        value = classified_input.value
        best_canonical = get_most_similar_canonical_option(value, self.CANONICALS)

        return {
            "path": self.VALUE_PATH,
            "value": best_canonical,
            "dont_overwrite_existing": True,
        }

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        label = classified_input.label
        checked = classified_input.value == True
        best_canonical = get_most_similar_canonical_option(label, self.CANONICALS)

        if not checked:
            # We only save when the box is checked as we can be absolutely certain the user has intended this
            return []

        return {
            "path": self.VALUE_PATH,
            "value": best_canonical,
            "dont_overwrite_existing": False,
        }

    @property
    @abstractmethod
    def CANONICALS(self) -> dict[str, list[str]]:
        pass

    @property
    @abstractmethod
    def VALUE_PATH(self) -> str:
        # ie. sponsorship/yesNoAnswer
        pass
