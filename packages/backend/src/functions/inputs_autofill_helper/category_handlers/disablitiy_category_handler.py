from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    get_decline_answer_canonicals,
    BaseCategoryHandler,
)

from dictor import dictor
from functions.inputs_autofill_helper.option_selection import (
    get_most_similar_canonical_option,
)


class DisabilityHandler(BaseCategoryHandler):
    disability_canonicals = {
        "disabled": ["yes", "Yes, I have a disability"],
        "enabled": ["no", "No, I do not have a disability"],
        "prefer_not_to_say": get_decline_answer_canonicals(),
    }

    def get_disability_value(self):
        return dictor(self.user_autofill_data, "disability")

    def can_autofill_category(self) -> bool:
        return self.get_disability_value() is not None

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return self.get_disability_value()

    def handle_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        input_label = classified_input.label
        best_canonical = get_most_similar_canonical_option(
            input_label, self.disability_canonicals
        )
        print("best canonical: ", best_canonical)

        return self.get_disability_value() == best_canonical
