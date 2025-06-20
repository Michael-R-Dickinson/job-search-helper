from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)

from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from dictor import dictor


class SponsorshipHandler(BaseCategoryHandler):
    def can_autofill_category(self) -> bool:
        return dictor(self.user_autofill_data, "sponsorship") is not None

    def handle_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        text_answer = dictor(self.user_autofill_data, "sponsorship.textAnswer")
        if text_answer is not None:
            return text_answer
        else:
            return None

    def handle_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        radio_answer = dictor(self.user_autofill_data, "sponsorship.yesNoAnswer")
        if radio_answer is not None:
            return radio_answer

        radio_answer_bool = radio_answer == "require_sponsorship"
        if self.is_positive_answer(classified_input.value):
            return radio_answer_bool
        else:
            return not radio_answer_bool
