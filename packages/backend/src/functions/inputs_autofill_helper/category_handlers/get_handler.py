from functions.inputs_autofill_helper.autofill_schema import InputType
from functions.inputs_autofill_helper.category_handlers.authorization_category_handler import (
    AuthorizationHandler,
)
from functions.inputs_autofill_helper.category_handlers.disablitiy_category_handler import (
    DisabilityHandler,
)
from functions.inputs_autofill_helper.category_handlers.job_discovery_category_handler import (
    JobDiscoveryHandler,
)
from functions.inputs_autofill_helper.category_handlers.location_category_handlers import (
    AddressHandler,
    CityHandler,
    CountryHandler,
    GeneralLocationHandler,
    PostalCodeHandler,
    StateHandler,
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
    SponsorshipExplanationHandler,
    SponsorshipYesNoHandler,
)
from functions.inputs_autofill_helper.category_handlers.student_category_handler import (
    EndYearHandler,
    EnrolledHandler,
    StartYearHandler,
    UniversityHandler,
)
from functions.inputs_autofill_helper.category_handlers.unknown_category_handler import (
    UnknownCategoryHandler,
)


def get_category_handler(category_name: str, user_autofill_data):
    match category_name:
        # Basic Fields
        case InputType.FIRST_NAME:
            return FirstNameHandler(user_autofill_data)
        case InputType.LAST_NAME:
            return LastNameHandler(user_autofill_data)
        case InputType.FULL_NAME:
            return FullNameHandler(user_autofill_data)
        case InputType.PHONE_NUMBER:
            return PhoneNumberHandler(user_autofill_data)
        case InputType.PREFERRED_FIRST_NAME:
            raise NotImplementedError("No Preferred First Name Handler Implemented")

        # Profiles
        case InputType.LINKEDIN_URL:
            raise NotImplementedError("No LinkedIn URL Handler Implemented")
        case InputType.GITHUB_URL:
            raise NotImplementedError("No GitHub URL Handler Implemented")
        case InputType.PERSONAL_WEBSITE:
            raise NotImplementedError("No Personal Website Handler Implemented")
        case InputType.OTHER_WEBSITE:
            raise NotImplementedError("No Other Website Handler Implemented")
        case InputType.JOB_DISCOVERY:
            return JobDiscoveryHandler(user_autofill_data)

        # Location
        case InputType.GENERAL_LOCATION:
            return GeneralLocationHandler(user_autofill_data)
        case InputType.MAILING_ADDRESS:
            return AddressHandler(user_autofill_data)
        case InputType.LOCATION_CITY:
            return CityHandler(user_autofill_data)
        case InputType.STATE_PROVINCE:
            return StateHandler(user_autofill_data)
        case InputType.COUNTRY:
            return CountryHandler(user_autofill_data)
        case InputType.POSTAL_CODE:
            return PostalCodeHandler(user_autofill_data)

        # Availability
        case InputType.AVAILABLE_MONTHS:
            raise NotImplementedError("No Available Months Handler Implemented")
        case InputType.START_TIME:
            raise NotImplementedError("No Start Time Handler Implemented")
        case InputType.FULL_TIME_AVAILABILITY:
            raise NotImplementedError("No Full Time Availability Handler Implemented")

        # Work Authorization
        case InputType.SPONSORSHIP_REQUIRED:
            return SponsorshipYesNoHandler(user_autofill_data)
        case InputType.SPONSORSHIP_EXPLANATION:
            return SponsorshipExplanationHandler(user_autofill_data)
        case InputType.AUTHORIZATION:
            return AuthorizationHandler(user_autofill_data)
        case InputType.USING_WORK_VISA:
            raise NotImplementedError("No Using Work Visa Handler Implemented")

        # Previous Job
        case InputType.CURRENT_COMPANY:
            raise NotImplementedError("No Current Company Handler Implemented")
        case InputType.YEARS_EXPERIENCE:
            raise NotImplementedError("No Years Experience Handler Implemented")

        # Self Identification
        case InputType.DISABILITY:
            return DisabilityHandler(user_autofill_data)
        case InputType.VETERAN:
            raise NotImplementedError("No Veteran Handler Implemented")
        case InputType.TRANSGENDER:
            raise NotImplementedError("No Transgender Handler Implemented")
        case InputType.GENDER_IDENTITY:
            raise NotImplementedError("No Gender Identity Handler Implemented")
        case InputType.PRONOUNS:
            raise NotImplementedError("No Pronouns Handler Implemented")
        case InputType.SEXUAL_ORIENTATION:
            raise NotImplementedError("No Sexual Orientation Handler Implemented")
        case InputType.HISPANIC_LATINO:
            raise NotImplementedError("No Hispanic Latino Handler Implemented")
        case InputType.DESIRED_SALARY:
            raise NotImplementedError("No Desired Salary Handler Implemented")

        # Education
        case InputType.SCHOOL:
            return UniversityHandler(user_autofill_data)
        case InputType.ENROLLED_STUDENT:
            return EnrolledHandler(user_autofill_data)
        case InputType.REPORT_REQUIRED:
            raise NotImplementedError("No Report Required Handler Implemented")
        case InputType.EDUCATION_START_DATE:
            return StartYearHandler(user_autofill_data)
        case InputType.EDUCATION_END_DATE:
            return EndYearHandler(user_autofill_data)
        case InputType.DEGREE:
            raise NotImplementedError("No Degree Handler Implemented")
        case InputType.DISCIPLINE:
            raise NotImplementedError("No Discipline Handler Implemented")

        # Default Cases
        case InputType.UNKNOWN:
            return UnknownCategoryHandler(user_autofill_data)
        case _:
            raise ValueError(
                f"Category handler not found for category: {category_name}"
            )
