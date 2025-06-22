from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    SimpleTextOnlyCategoryHandler,
)


class PhoneNumberHandler(SimpleTextOnlyCategoryHandler):
    def get_value_path(self) -> str:
        return "phone/phoneNum"
