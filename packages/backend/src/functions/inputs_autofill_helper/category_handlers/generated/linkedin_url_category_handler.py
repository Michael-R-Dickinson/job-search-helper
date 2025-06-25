from functions.inputs_autofill_helper.category_handlers.base_category_handler import (
    SimpleTextOnlyCategoryHandler,
)


class LinkedInUrlHandler(SimpleTextOnlyCategoryHandler):
    @property
    def VALUE_PATH(self) -> str:
        return "linkedin_profile"
