from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
    FieldType,
    InputType,
    SaveInstruction,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)


class JobDiscoveryHandler(BaseCategoryHandler):
    def can_autofill_category(self) -> bool:
        return True

    def fill_text_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return "LinkedIn"

    def fill_select_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> str | None:
        return "Linkedin|Job Board|linkedin profile|company website"

    def fill_radio_input(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ) -> bool | None:
        def is_job_discovery_checkable(input):
            return input.category == InputType.JOB_DISCOVERY and input.fieldType in [
                FieldType.RADIO,
                FieldType.CHECKBOX,
            ]

        all_discover_inputs = list(filter(is_job_discovery_checkable, other_inputs))
        linkedin_option = next(
            (i for i in all_discover_inputs if "linkedin" in i.label.lower()), None
        )
        if linkedin_option is not None:
            return linkedin_option == classified_input

        # if we don't find an option that says linkedin, we just pick the first option of the list
        # this check makes sure we only return True if the element passed as classified_input is the first element
        # of this category
        return all_discover_inputs[0] == classified_input

    def save_text_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        return []

    def save_checkable_input(
        self, classified_input: ClassifiedInput
    ) -> SaveInstruction | list[SaveInstruction]:
        return []
