from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class HispanicLatinoHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        hispanic_mapping = {
            "yes": "Yes, I am Hispanic or Latino",
            "no": "No, I am not Hispanic or Latino",
            "prefer_not_to_say": "I prefer not to say",
        }

        return hispanic_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "yes": [
                "Yes",
                "Yes, I am Hispanic or Latino",
                "Hispanic",
                "Latino",
                "Latina",
                "Latinx",
                "Si",
                "Sí",
            ],
            "no": [
                "No",
                "No, I am not Hispanic or Latino",
                "Not Hispanic",
                "Not Latino",
                "Non-Hispanic",
                "Non-Latino",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "race/hispanic_latino"
