from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    SimpleTextOnlyCategoryHandler,
)


class EnrolledHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        if self._autofill_value == "enrolled":
            return "Yes, I am enrolled"
        elif self._autofill_value == "not_enrolled":
            return "No, i am not enrolled"
        else:
            raise ValueError()

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "enrolled": ["Yes", "I am enrolled"],
            "not_enrolled": ["No", "I am not enrolled"],
        }

    @property
    def VALUE_PATH(self) -> str:
        return "education/currently_enrolled"


class UniversityHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "education/school"


class StartYearHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "education/start_date_year"


class EndYearHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "education/end_date_year"
