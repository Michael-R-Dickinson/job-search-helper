from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    get_decline_answer_canonicals,
)


class SexualOrientationHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        orientation_mapping = {
            "heterosexual": "Heterosexual",
            "homosexual": "Homosexual",
            "pansexual": "Pansexual",
            "asexual": "Asexual",
            "queer": "Queer",
            "prefer_not_to_say": "I prefer not to say",
        }

        return orientation_mapping.get(self._autofill_value, "I prefer not to say")

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "heterosexual": [
                "Heterosexual",
                "heterosexual",
                "Straight",
                "straight",
                "Hetero",
                "hetero",
            ],
            "homosexual": [
                "Homosexual",
                "homosexual",
                "Gay",
                "gay",
                "Lesbian",
                "lesbian",
            ],
            "pansexual": [
                "Pansexual",
                "pansexual",
                "Pan",
                "pan",
                "Omnisexual",
                "omnisexual",
            ],
            "asexual": [
                "Asexual",
                "asexual",
                "Ace",
                "ace",
                "Aromantic",
                "aromantic",
            ],
            "queer": [
                "Queer",
                "queer",
                "LGBTQ+",
                "LGBT",
                "Questioning",
                "questioning",
            ],
            "prefer_not_to_say": get_decline_answer_canonicals(),
        }

    @property
    def VALUE_PATH(self) -> str:
        return "identity/sexual_orientation"
