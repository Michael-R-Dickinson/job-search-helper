import json
from typing import ClassVar, Literal, Union
from google.genai import types
from pydantic import BaseModel
from LLM_tailoring.gemini import get_chat
from google.genai import types

SYSTEM_INSTRUCTIONS = """
You are helping to autofill values in a job application form. To do this, you will receive a list of inputs and their values. You will then produce a list of paths in our database that values will be saved to. For example, if an input has label "Name" and value "John Doe", you will produce the following entries in save_values:
{ value_save_path: "name/first_name", value: "John" }
{ value_save_path: "name/last_name", value: "Doe" }
Specify boolean values with the lowercase format "true" or "false".

To help with this, the schema for the database will be provided so you know what paths are available. 

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

PROMPT_TEMPLATE = """
Inputs: 

{inputs}
"""


class SaveInput(BaseModel):
    value_save_path: str
    value: str


class SaveInputResponseSchema(BaseModel):
    save_values: list[SaveInput]


def generate_save_input_paths(inputs) -> SaveInputResponseSchema:
    chat = get_chat(
        content_config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTIONS,
            response_mime_type="application/json",
            response_schema=SaveInputResponseSchema,
        ),
        model="gemini-2.0-flash-lite",
    )
    response = chat.send_message(
        PROMPT_TEMPLATE.format(inputs=json.dumps(inputs)),
    )
    return response.parsed
