from functions.inputs_autofill_helper.autofill_schema import InputType
from functions.inputs_autofill_helper.category_handlers.authorization_category_handler import (
    AuthorizationHandler,
)
from functions.inputs_autofill_helper.category_handlers.name_category_handlers import (
    FirstNameHandler,
    FullNameHandler,
    LastNameHandler,
)
from functions.inputs_autofill_helper.category_handlers.phone_category_handler import (
    PhoneNumberHandler,
)
from functions.inputs_autofill_helper.category_handlers.sponsorship_category_handler import (
    SponsorshipHandler,
)
from functions.inputs_autofill_helper.category_handlers.student_category_handler import (
    StudentCategoryHandler,
    UniversityCategoryHandler,
)
from functions.inputs_autofill_helper.category_handlers.unknown_category_handler import (
    UnknownCategoryHandler,
)


def get_category_handler(category_name: str, user_autofill_data):
    match category_name:
        case InputType.FIRST_NAME:
            return FirstNameHandler(user_autofill_data)
        case InputType.LAST_NAME:
            return LastNameHandler(user_autofill_data)
        case InputType.FULL_NAME:
            return FullNameHandler(user_autofill_data)
        case InputType.PHONE_NUMBER:
            return PhoneNumberHandler(user_autofill_data)
        case InputType.SPONSORSHIP_REQUIRED:
            return SponsorshipHandler(user_autofill_data)
        case InputType.AUTHORIZATION:
            return AuthorizationHandler(user_autofill_data)
        case InputType.ENROLLED_STUDENT:
            return StudentCategoryHandler(user_autofill_data)
        case InputType.SCHOOL:
            return UniversityCategoryHandler(user_autofill_data)
        case InputType.UNKNOWN:
            return UnknownCategoryHandler(user_autofill_data)
        case _:
            raise ValueError(
                f"Category handler not found for category: {category_name}"
            )
