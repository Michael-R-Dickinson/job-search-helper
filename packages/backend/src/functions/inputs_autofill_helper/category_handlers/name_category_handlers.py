from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    SimpleTextOnlyCategoryHandler,
    TextOnlyCategoryHandler,
)

from dictor import dictor


class FirstNameHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "name/first_name"


class LastNameHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "name/last_name"


class FullNameHandler(TextOnlyCategoryHandler):
    def get_names(self):
        first_name = dictor(self.user_autofill_data, "name.first_name")
        last_name = dictor(self.user_autofill_data, "name.last_name")
        return first_name, last_name

    def can_autofill_category(self) -> bool:
        first, last = self.get_names()
        return first is not None and last is not None

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        first_name, last_name = self.get_names()
        return f"{first_name} {last_name}"

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        value = classified_input.value
        names = value.split()
        if len(names) != 2:
            print("Error Parsing Names - More than two names detected: ", names)
            return []

        return [
            {
                "path": "name/first_name",
                "value": names[0],
                "dont_overwrite_existing": True,
            },
            {
                "path": "name/last_name",
                "value": names[1],
                "dont_overwrite_existing": True,
            },
        ]
