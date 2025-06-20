from functions.inputs_autofill_helper.autofill_schema import (
    ClassifiedInput,
    ClassifiedInputList,
)
from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    BaseCategoryHandler,
)


class UnknownCategoryHandler(BaseCategoryHandler):
    def get_autofill_value(
        self, classified_input: ClassifiedInput, other_inputs: ClassifiedInputList
    ):
        return None
