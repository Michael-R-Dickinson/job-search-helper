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
## Description
You are helping to autofill a job application form. We will pass you a number of inputs and you will map each of them to an autofilling action - typically a valuePath.

## Inputs
You will be given the following fields for each input:
- id: The id of the input
- name: The name of the input provided by the webpage
- fieldType: The type of the input (text, radio, checkbox, select, etc.)
- wholeQuestionLabel: Only used when multiple labels are present - typically for radio buttons when the label will indicate the value of the radio button (yes/no) and the whole question label will be the question being asked.
- value: the current value of the input

## Output Format
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

Include the curly braces in your response.
Fill all inputs that can be filled with the user data from the schema - EVERY ONE OF THEM. For ones that absolutely cannot be filled with the user data, output an empty string. 


### Radio Buttons and Checkboxes
If the result of the value at a valuePath is a boolean, this will indicate that a radio button or checkbox should be checked. You may specify a value to always be true or false using the special lowercase {true} or {false} valuePaths. 
Radio buttons and checkboxes must receive a boolean value otherwise no action will be taken. 
When filling radios/checkboxes, unless the valuePath maps directly to a boolean, use a conditional to ensure that the output is a boolean:
{
    "condition": {
        "valuePathString": "{authorization}",
        "value": "us_authorized"
    },
    "truthyValuePathString": "{true}",
    "falsyValuePathString": "{false}"
}
Remember, this is ONLY FOR RADIO BUTTONS AND CHECKBOXES. Do not output boolean values for text fields. DONT DO IT EVER - no {true} or {false} for anything except things that are explicitly fieldtype radio or checkbox.

### Enums
If you need to output a text field but only have an enum, you may come up with a reasonable string interpretation of the enum.

## Special Fields
For fields like, how did you find out about this position - always fill with Linkedin

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


class AutofillResponseSchema(BaseModel):
    autofill_instructions: list[AutofillInstruction]


def generate_autofill_with_gemini(inputs) -> AutofillResponseSchema:
    chat = get_chat(
        content_config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=AutofillResponseSchema,
            temperature=0.0,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
        model="gemini-2.5-flash-preview-04-17",
    )
    response = chat.send_message(
        json.dumps(inputs),
    )
    return response.parsed
