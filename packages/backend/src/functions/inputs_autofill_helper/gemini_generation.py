import json
from typing import ClassVar, Literal, Union
from google.genai import types
from pydantic import BaseModel
from LLM_tailoring.gemini import get_chat
from google.genai import types

from functions.inputs_autofill_helper.autofill_schema_string import (
    AUTOFILL_SCHEMA_STRING,
)

SYSTEM_INSTRUCTION = (
    """
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
Fill all inputs that can be filled with the user data from the schema - EVERY ONE OF THEM. For ones that absolutely cannot be filled with the user data, output an empty string. 

Schema, in zod format:

"""
    + AUTOFILL_SCHEMA_STRING
)


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
