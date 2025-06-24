from enum import Enum
from typing import NotRequired, Optional, TypedDict
from pydantic import BaseModel, RootModel


class FieldType(Enum):
    TEXT = "text"
    SELECT = "select"
    TEXTBOX = "textbox"
    EMAIL = "email"
    TEL = "tel"
    RADIO = "radio"
    CHECKBOX = "checkbox"
    NUMBER = "number"
    DATE = "date"
    PASSWORD = "password"
    URL = "url"
    FILE = "file"
    BUTTON = "button"


class InputType(Enum):
    # Basic Fields
    FULL_NAME = "full_name"
    FIRST_NAME = "first_name"
    PREFERRED_FIRST_NAME = "preferred_first_name"
    LAST_NAME = "last_name"
    PHONE_NUMBER = "phone_number"

    # Profiles
    LINKEDIN_URL = "linkedin_url"
    GITHUB_URL = "github_url"
    PERSONAL_WEBSITE = "personal_website"
    OTHER_WEBSITE = "other_website"
    JOB_DISCOVERY = "job_discovery"

    # Location
    GENERAL_LOCATION = "general_location"
    MAILING_ADDRESS = "mailing_address"
    LOCATION_CITY = "location_city"
    STATE_PROVINCE = "state_province"
    COUNTRY = "country"
    POSTAL_CODE = "postal_code"

    # Availability
    AVAILABLE_MONTHS = "available_months"
    START_TIME = "start_time"
    FULL_TIME_AVAILABILITY = "full_time_availability"

    # Work Authorization
    SPONSORSHIP_REQUIRED = "sponsorship_required"
    SPONSORSHIP_EXPLANATION = "sponsorship_explanation"
    USING_WORK_VISA = "using_work_visa"
    AUTHORIZATION = "authorization"

    # Previous Job
    CURRENT_COMPANY = "current_company"
    YEARS_EXPERIENCE = "years_experience"

    # Self Identification
    DISABILITY = "disability"
    VETERAN = "veteran"
    TRANSGENDER = "transgender"
    GENDER_IDENTITY = "gender_identity"
    PRONOUNS = "pronouns"
    SEXUAL_ORIENTATION = "sexual_orientation"
    HISPANIC_LATINO = "hispanic_latino"
    DESIRED_SALARY = "desired_salary"

    # Education
    SCHOOL = "school"
    ENROLLED_STUDENT = "enrolled_student"
    REPORT_REQUIRED = "report_required"
    EDUCATION_START_DATE = "education_start_date"
    EDUCATION_END_DATE = "education_end_date"
    DEGREE = "degree"
    DISCIPLINE = "discipline"

    UNKNOWN = "unknown"


class Input(BaseModel):
    label: str
    fieldType: FieldType
    name: Optional[str] = None
    wholeQuestionLabel: Optional[str] = None
    value: Optional[str | bool] = None
    id: str

    def with_category(self, category: InputType, score: float):
        data = self.model_dump()
        data["category"] = category
        data["classification_score"] = score
        return ClassifiedInput.model_validate(data)


class ListModel(RootModel):
    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]

    def __len__(self):
        return len(self.root)


class InputList(ListModel):
    root: list[Input]


class ClassifiedInput(Input):
    category: InputType
    classification_score: float


class ClassifiedInputList(ListModel):
    root: list[ClassifiedInput]


class SaveInstruction(TypedDict):
    value: str | bool
    path: str
    dont_overwrite_existing: NotRequired[bool]
