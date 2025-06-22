from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
    SimpleTextOnlyCategoryHandler,
)

from dictor import dictor


class StudentHandler(BaseCategoryHandler):
    def can_autofill_category(self):
        return self.get_currently_enrolled() != None

    def get_currently_enrolled(self):
        return dictor(self.user_autofill_data, "education.currently_enrolled")

    # Unlikely text case
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        is_student_boolean = self.get_currently_enrolled()
        return "I am a student" if is_student_boolean else "I am not a student"

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        is_student_boolean = self.get_currently_enrolled()
        is_positive_input = self.is_positive_answer(classified_input.value)

        if is_positive_input:
            return is_student_boolean
        else:
            return not is_student_boolean

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        value = classified_input.value
        is_enrolled = "yes" in value.lower()
        return {
            "path": "education/currently_enrolled",
            "value": is_enrolled,
        }

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        is_positive_input = self.is_positive_answer(classified_input.value)
        value = classified_input.value
        if not value == True:
            # We only set the value on a true
            return []

        if is_positive_input:
            return {
                "path": "education/currently_enrolled",
                "value": value,
            }

        else:
            return {
                "path": "education/currently_enrolled",
                "value": not value,
            }


class UniversityHandler(SimpleTextOnlyCategoryHandler):
    def get_value_path(self) -> str:
        return "education/school"


class StartYearHandler(SimpleTextOnlyCategoryHandler):
    def get_value_path(self) -> str:
        return "education/start_date_year"


class EndYearHandler(SimpleTextOnlyCategoryHandler):
    def get_value_path(self) -> str:
        return "education/end_date_year"
