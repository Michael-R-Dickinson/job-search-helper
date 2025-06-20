from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    TextOnlyCategoryHandler,
)
from dictor import dictor


class PhoneNumberHandler(TextOnlyCategoryHandler):
    def get_text(self):
        return dictor(self.user_autofill_data, "phone.phoneNum")
