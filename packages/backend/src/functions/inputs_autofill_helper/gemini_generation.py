import json
from typing import ClassVar, Literal, Union
from google.genai import types
from pydantic import BaseModel
from LLM_tailoring.gemini import get_chat
from google.genai import types

SYSTEM_INSTRUCTION = """
You are helping to autofill a job application form. We will pass you a number of inputs and you will map each of them to a valuePath.
The valuePath is a path to a value in our user data. You will be given the schema of the user data to know what data is available to you. For example, if you were attempting to fill in a "first name" input, the valuePath would be {name/first_name}. You may also combine multiple inputs in a single value path, for example, to fill a "full name" input, the value path would be {name/first_name} {name/last_name}.

Finally, you may create simple two-case conditionals to check if a value is equal to a specific value, and then output a different valuePath based on the result. 
For example, to produce "yes" if a user is a veteran, you would output the following conditional:

{
    "condition": {
        "valuePathString": "{veteran}",
        "value": "yes"
    },
    "truthyValuePathString": "yes",
    "falsyValuePathString": "no"
}

If the result of the value at a valuePath is a boolean that is true, this will indicate that a radio button or checkbox should be checked.
You may also output the special {true} valuePath which will always evaluate to true. 

Include the curly braces in your response.
Skip and do not output any inputs that cannot be filled with the user data from the schema.

Schema, in zod format:

export const GenderEnum = z.enum(['male', 'female', 'non_binary', 'other', 'prefer_not_to_say'])
export const VeteranStatusEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
export const RaceEthnicityEnum = z.enum([
  'asian',
  'black',
  'hispanic',
  'white',
  'native_american',
  'pacific_islander',
  'two_or_more',
  'other',
  'prefer_not_to_say',
])
export const HispanicLatinoEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
export const DisabilityStatusEnum = z.enum(['yes', 'no', 'prefer_not_to_say'])
export const AuthorizationStatusEnum = z.enum(['yes', 'no'])
export const SponsorshipStatusEnum = z.enum(['yes', 'no'])


export const UserAutofillPreferencesSchema = z.object({
  name: z
    .object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
    .optional(),
  email: z.string().optional(),
  gender: GenderEnum.optional(),
  veteran: VeteranStatusEnum.optional(),
  race_ethnicity: RaceEthnicityEnum.optional(),
  hispanic_latino: HispanicLatinoEnum.optional(),
  disability: DisabilityStatusEnum.optional(),
  phone: z
    .object({
      phoneNum: z.number().optional(),
      extension: z.string().optional(),
      type: z.enum(['mobile', 'landline']).optional(),
    })
    .optional(),
  location: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
  authorization: AuthorizationStatusEnum.optional(),
  sponsorship: z
    .object({
      text: z.string().optional(),
      yesNoAnswer: z.boolean().optional(),
    })
    .optional(),
  school: z.string().optional(),
  degree: z.string().optional(),
  discipline: z.string().optional(),
  end_date_year: z.string().optional(),
  linkedin_profile: z.string().optional(),
  website: z.string().optional(),
  other_website: z.string().optional(),
  twitter_url: z.string().optional(),
  github_url: z.string().optional(),
  current_company: z.string().optional(),
  salary_expectations: z.string().optional(),
  current_job_title: z.string().optional(),
  pronouns: z.string().optional(),
})
"""


class EqualsCondition(BaseModel):
    valuePathString: str
    value: str


class IfExpression(BaseModel):
    expressionType: ClassVar[str] = "if"

    condition: EqualsCondition
    truthyValuePathString: str
    falsyValuePathString: str


class AutofillInstruction(BaseModel):
    input_id: str
    valuePathString: Union[str, IfExpression]
    initialLabel: str


class AutofillResponseSchema(BaseModel):
    autofill_instructions: list[AutofillInstruction]


def generate_autofill_with_gemini(inputs) -> AutofillResponseSchema:
    chat = get_chat(
        content_config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=AutofillResponseSchema,
        ),
        model="gemini-2.0-flash-lite",
    )
    response = chat.send_message(
        json.dumps(inputs),
    )
    return response.parsed
