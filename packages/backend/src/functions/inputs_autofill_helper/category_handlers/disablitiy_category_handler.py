from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    SaveInstruction,
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
    value_path = "disability"
    disability_canonicals = {
        "disabled": ["yes", "Yes, I have a disability"],
        "enabled": ["no", "No, I do not have a disability", "nope"],
        "prefer_not_to_say": get_decline_answer_canonicals(),
    }

    def get_disability_value(self):
        return dictor(self.user_autofill_data, self.value_path)

    def can_autofill_category(self) -> bool:
        return self.get_disability_value() is not None

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return self.get_disability_value()

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        input_label = classified_input.label
        best_canonical = get_most_similar_canonical_option(
            input_label, self.disability_canonicals
        )
        print("best canonical: ", best_canonical)

        return self.get_disability_value() == best_canonical

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        if classified_input.value == None or classified_input.value == "":
            return []

        value = classified_input.value.lower()

        if "yes" in value:
            return {
                "path": self.value_path,
                "value": "disabled",
                "dont_overwrite_existing": True,
            }

        if "no" in value:
            return {
                "path": self.value_path,
                "value": "enabled",
                "dont_overwrite_existing": True,
            }

        return []

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        if classified_input.value == None or classified_input.value == "":
            return []

        # We only fill this when the box is checked as we can be absolutely certain the user has intended this
        if classified_input.value == False:
            return []

        input_label = classified_input.label
        best_canonical = get_most_similar_canonical_option(
            input_label, self.disability_canonicals
        )

        return {
            "path": self.value_path,
            "value": best_canonical,
        }
