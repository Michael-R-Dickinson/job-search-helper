from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
    TextOnlyCategoryHandler,
)

from dictor import dictor


class StudentHandler(BaseCategoryHandler):
    def can_autofill_category(self):
        return self.get_currently_enrolled() != None

    def get_currently_enrolled(self):
        return dictor(self.user_autofill_data, "education.currently_enrolled")

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        is_student_boolean = self.get_currently_enrolled()
        return "I am a student" if is_student_boolean else "I am not a student"

    def handle_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        is_student_boolean = self.get_currently_enrolled()
        is_positive_input = self.is_positive_answer(classified_input.value)

        if is_positive_input:
            return is_student_boolean
        else:
            return not is_student_boolean


class UniversityHandler(TextOnlyCategoryHandler):
    def get_text(self):
        return dictor(self.user_autofill_data, "education.school")


class StartYearHandler(TextOnlyCategoryHandler):
    def get_text(self):
        return dictor(self.user_autofill_data, "education.start_year_date")


class EndYearHandler(TextOnlyCategoryHandler):
    def get_text(self):
        return dictor(self.user_autofill_data, "education.end_date_year")
