from functions.inputs_autofill_helper.autofill_schema import InputType


PROTOTYPES: dict[InputType, list[str]] = {
    # Basic Fields
    InputType.FULL_NAME: [
        "Please enter your full legal name",
        "Full name",
        "What is your full name?",
        "Legal name",
        "Complete name",
    ],
    InputType.FIRST_NAME: [
        "First name",
        "Please enter your first name",
        "Given name",
        "What is your first name?",
        "First/Given name",
    ],
    InputType.PREFERRED_FIRST_NAME: [
        "Preferred first name",
        "What would you like to be called?",
        "Preferred name",
        "First name (preferred)",
        "Name you go by",
    ],
    InputType.LAST_NAME: [
        "Last name",
        "Please enter your last name",
        "Family name",
        "What is your last name?",
        "Surname",
    ],
    InputType.PHONE_NUMBER: [
        "Phone number",
        "Mobile number",
        "Contact number",
        "Telephone number",
        "Phone",
    ],
    # Profiles
    InputType.LINKEDIN_URL: [
        "LinkedIn profile URL",
        "LinkedIn profile",
        "LinkedIn URL",
        "LinkedIn link",
        "Your LinkedIn",
    ],
    InputType.GITHUB_URL: [
        "GitHub URL",
        "GitHub profile",
        "GitHub link",
        "GitHub username",
        "Your GitHub",
    ],
    InputType.PERSONAL_WEBSITE: [
        "Website or personal portfolio link",
        "Personal website",
        "Portfolio URL",
        "Your website",
        "Personal portfolio",
    ],
    InputType.OTHER_WEBSITE: [
        "Other website",
        "Additional website",
        "Other relevant links",
        "Other URL",
        "Additional portfolio",
    ],
    InputType.JOB_DISCOVERY: [
        "How did you hear about this job?",
        "How did you hear about us?",
        "How did you find this opportunity?",
        "Where did you hear about this position?",
        "How did you learn about this role?",
    ],
    # Location
    InputType.GENERAL_LOCATION: [
        "Current location",
        "Where are you located?",
        "Location",
        "Current city and state",
        "Your location",
        "Where do you currently live?",
    ],
    InputType.MAILING_ADDRESS: [
        "Current mailing address",
        "Address",
        "Address Line 1",
        "Mailing address",
        "Home address",
        "Street address",
    ],
    InputType.LOCATION_CITY: [
        "City",
        "Current city",
        "What city are you in?",
        "City name",
        "Your city",
    ],
    InputType.STATE_PROVINCE: [
        "State",
        "Province",
        "State/Province",
        "Which state?",
        "Current state",
    ],
    InputType.COUNTRY: [
        "Country",
        "Which country?",
        "Country of residence",
        "Current country",
        "What country are you in?",
    ],
    InputType.POSTAL_CODE: [
        "Postal code",
        "Zip code",
        "Postal code",
    ],
    # Availability
    InputType.AVAILABLE_MONTHS: [
        "How many months are you available to participate in an internship?",
        "Available months",
        "Duration of availability",
        "How long are you available?",
        "Number of months available",
    ],
    InputType.START_TIME: [
        "When are you available to start?",
        "When can you start internship?",
        "Start date",
        "Available start date",
        "When can you begin?",
    ],
    InputType.FULL_TIME_AVAILABILITY: [
        "Are you available to work full-time or part-time as part of an internship?",
        "Full-time or part-time availability",
        "Are you available full-time?",
        "Full-time availability",
        "Can you work full-time?",
    ],
    # Work Authorization
    InputType.SPONSORSHIP_REQUIRED: [
        "Do you require or will you require sponsorship to work in the US?",
        "Will you now or in the future require immigration sponsorship for employment with Tesla?",
        "Will you now or in the future require sponsorship for employment visa status?",
        "Do you now, or will you in the future, require sponsorship for employment visa status?",
        "Do you need sponsorship to work in the United States?",
    ],
    InputType.SPONSORSHIP_EXPLANATION: [
        "Do you require or will you require sponsorship to work in the US? If so, explain."
        "If yes, please explain your sponsorship needs",
        "Please explain your sponsorship requirements",
        "Sponsorship details",
        "Describe your visa sponsorship needs",
        "Additional sponsorship information",
    ],
    InputType.USING_WORK_VISA: [
        "Is your eligibility based on a work visa?",
        "Are you currently on a work visa?",
        "Do you have a work visa?",
        "Is your work authorization based on a visa?",
        "Are you using a work visa?",
    ],
    InputType.AUTHORIZATION: [
        "Are you legally authorized to work in the US?",
        "Are you legally authorized to work in the United States on a full-time basis?",
        "Are you legally authorized to work in United States of America?",
        "Do you have work authorization?",
        "Are you authorized to work in the US?",
    ],
    # Previous Job
    InputType.CURRENT_COMPANY: [
        "Company",
        "Current company",
        "Current employer",
        "Where do you currently work?",
        "Current organization",
    ],
    InputType.YEARS_EXPERIENCE: [
        "Years of experience",
        "How many years of experience do you have?",
        "Years of relevant experience",
        "Total years of experience",
        "Professional experience (years)",
    ],
    # Self Identification
    InputType.DISABILITY: [
        "Do you have a disability or chronic condition (physical, visual, auditory, cognitive, mental, emotional, or other) that substantially limits one or more of your major life activities?",
        "Do you have a disability?",
        "Disability status",
        "Do you consider yourself to have a disability?",
        "Disability disclosure",
    ],
    InputType.VETERAN: [
        "Are you a veteran or active member of the United States Armed Forces?",
        "Veteran status",
        "Are you a veteran?",
        "Military service",
        "Are you a US veteran?",
    ],
    InputType.TRANSGENDER: [
        "Are you transgender?",
        "Transgender status",
        "Do you identify as transgender?",
        "Transgender identity",
        "Are you a transgender person?",
    ],
    InputType.GENDER_IDENTITY: [
        "How would you describe your gender identity?",
        "Gender identity",
        "What is your gender?",
        "Gender",
        "How do you identify your gender?",
    ],
    InputType.PRONOUNS: [
        "What are your pronouns?",
        "Preferred pronouns",
        "Your pronouns",
        "Pronouns (she/her, he/him, they/them, etc.)",
        "How should we refer to you?",
    ],
    InputType.SEXUAL_ORIENTATION: [
        "What is your sexual orientation?",
        "Sexual orientation",
        "How do you identify your sexual orientation?",
        "Sexual identity",
        "Orientation",
    ],
    InputType.HISPANIC_LATINO: [
        "Are you Hispanic/Latino?",
        "Hispanic or Latino origin",
        "Do you identify as Hispanic or Latino?",
        "Hispanic/Latino ethnicity",
        "Are you of Hispanic or Latino origin?",
    ],
    InputType.DESIRED_SALARY: [
        "Desired salary",
        "Expected salary",
        "Salary expectations",
        "What is your desired salary?",
        "Salary requirements",
    ],
    # Education
    InputType.SCHOOL: [
        "School",
        "University",
        "College",
        "Educational institution",
        "What school do you attend?",
    ],
    InputType.ENROLLED_STUDENT: [
        "Are you a current university student?",
        "Are you currently enrolled?",
        "Current student status",
        "Are you currently a student?",
        "Student enrollment status",
    ],
    InputType.REPORT_REQUIRED: [
        "Do you need to write a thesis or report for your university as part of your internship?",
        "Thesis/report requirement",
        "Do you need academic credit?",
        "University report requirements",
        "Academic requirements",
    ],
    InputType.EDUCATION_START_DATE: [
        "Start date (year)",
        "When did you start?",
        "Education start date",
        "Year started",
        "Beginning year",
    ],
    InputType.EDUCATION_END_DATE: [
        "End date year",
        "When did you finish?",
        "Education end date",
        "Year completed",
        "Completion year",
        "When will you graduate? (expected month & year)",
        "Graduation date",
        "Expected graduation",
    ],
    InputType.DEGREE: [
        "Degree",
        "What degree are you pursuing?",
        "Degree type",
        "Highest degree",
        "Academic degree",
    ],
    InputType.DISCIPLINE: [
        "Discipline",
        "Field of study",
        "Major",
        "Area of study",
        "Academic discipline",
    ],
    InputType.UNKNOWN: ["gabagabagoo"],
}


def get_flattened_proto_strings():
    categories, texts = [], []
    for cat, variants in PROTOTYPES.items():
        for t in variants:
            categories.append(cat)
            texts.append(t)

    return categories, texts
