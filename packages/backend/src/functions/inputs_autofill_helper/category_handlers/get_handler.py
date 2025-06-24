from functions.inputs_autofill_helper.autofill_schema import InputType
from functions.inputs_autofill_helper.category_handlers.authorization_category_handler import (
    AuthorizationHandler,
)
from functions.inputs_autofill_helper.category_handlers.cover_letter_category_handler import (
    CoverLetterHandler,
)
from functions.inputs_autofill_helper.category_handlers.disablitiy_category_handler import (
    DisabilityHandler,
)
from functions.inputs_autofill_helper.category_handlers.email_category_handler import (
    EmailHandler,
)
from functions.inputs_autofill_helper.category_handlers.free_response_category_handler import (
    FreeResponseHandler,
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
from functions.inputs_autofill_helper.category_handlers.generated.gender_identity_category_handler import (
    GenderIdentityHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.pronouns_category_handler import (
    PronounsHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.sexual_orientation_category_handler import (
    SexualOrientationHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.linkedin_url_category_handler import (
    LinkedInUrlHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.github_url_category_handler import (
    GitHubUrlHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.personal_website_category_handler import (
    PersonalWebsiteHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.hispanic_latino_category_handler import (
    HispanicLatinoHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.transgender_category_handler import (
    TransgenderHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.veteran_category_handler import (
    VeteranHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.degree_category_handler import (
    DegreeHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.discipline_category_handler import (
    DisciplineHandler,
)
from functions.inputs_autofill_helper.category_handlers.generated.race_ethnicity_category_handler import (
    RaceEthnicityHandler,
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
        case InputType.EMAIL:
            return EmailHandler(user_autofill_data)
        case InputType.PREFERRED_FIRST_NAME:
            raise NotImplementedError("No Preferred First Name Handler Implemented")

        # Profiles
        case InputType.LINKEDIN_URL:
            return LinkedInUrlHandler(user_autofill_data)
        case InputType.GITHUB_URL:
            return GitHubUrlHandler(user_autofill_data)
        case InputType.PERSONAL_WEBSITE:
            return PersonalWebsiteHandler(user_autofill_data)
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
            return VeteranHandler(user_autofill_data)
        case InputType.TRANSGENDER:
            return TransgenderHandler(user_autofill_data)
        case InputType.GENDER_IDENTITY:
            return GenderIdentityHandler(user_autofill_data)
        case InputType.PRONOUNS:
            return PronounsHandler(user_autofill_data)
        case InputType.SEXUAL_ORIENTATION:
            return SexualOrientationHandler(user_autofill_data)
        case InputType.HISPANIC_LATINO:
            return HispanicLatinoHandler(user_autofill_data)
        case InputType.ETHNICITY:
            return RaceEthnicityHandler(user_autofill_data)
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
            return DegreeHandler(user_autofill_data)
        case InputType.DISCIPLINE:
            return DisciplineHandler(user_autofill_data)
        case InputType.FREE_RESPONSE:
            return FreeResponseHandler(user_autofill_data)
        case InputType.COVER_LETTER:
            return CoverLetterHandler(user_autofill_data)

        # Default Cases
        case InputType.UNKNOWN:
            return UnknownCategoryHandler(user_autofill_data)
        case _:
            raise ValueError(
                f"Category handler not found for category: {category_name}"
            )
