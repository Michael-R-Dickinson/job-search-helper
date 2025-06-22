from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    EnumBasedCategoryHandler,
    SimpleTextOnlyCategoryHandler,
)

from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)


class SponsorshipYesNoHandler(EnumBasedCategoryHandler):
    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        if self._autofill_value == "require_sponsorship":
            return "Yes, I require sponsorship to work"
        else:
            return "No, I do not require sponsorship to work"

    @property
    def CANONICALS(self) -> dict[str, list[str]]:
        return {
            "require_sponsorship": ["yes", "Yes, I require sponsorship"],
            "no_sponsorship": ["No", "No, I do not require sponsorship"],
        }

    @property
    def VALUE_PATH(self) -> str:
        return "sponsorship/yesNoAnswer"


class SponsorshipExplanationHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "sponsorship/textAnswer"
