import json
from typing import ClassVar, Literal, Union
from google.genai import types
from pydantic import BaseModel
from LLM_tailoring.gemini import get_chat
from google.genai import types

from functions.inputs_autofill_helper.autofill_schema_string import (
    AUTOFILL_SCHEMA_STRING,
)

SYSTEM_INSTRUCTIONS = (
    """
You are helping to autofill values in a job application form. To do this, you will receive a list of inputs and their values. You will then produce a list of paths in our database that values will be saved to. For example, if an input has label "Name" and value "John Doe", you will produce the following entries in save_values:
{ value_save_path: "name/first_name", value: "John" }
{ value_save_path: "name/last_name", value: "Doe" }
Specify boolean values with the lowercase format "true" or "false".

To help with this, the schema for the database will be provided so you know what paths are available. 

Schema, in zod format:
{schema}
"""
    + AUTOFILL_SCHEMA_STRING
)

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
