import json
from firebase import init_firebase
from firebase.realtime_db import get_user_autofill_data
from functions.inputs_autofill_helper.gemini_generation import (
    AutofillResponseSchema,
    generate_autofill_with_gemini,
)
from functions.inputs_autofill_helper.parse_template_to_instructions import (
    map_autofill_template_to_instructions,
)


def get_filled_inputs(user_id, inputs):
    user_autofill_data = get_user_autofill_data(user_id)
    if not user_autofill_data:
        raise ValueError("User data not found")

    autofill_template_values = generate_autofill_with_gemini(inputs)
    autofill_instructions = map_autofill_template_to_instructions(
        autofill_template_values, user_autofill_data, original_inputs=inputs
    )
    print("\nInitial Inputs: ", inputs, "\n")
    print("Autofill Template: ", autofill_template_values.model_dump(), "\n")
    print("Finished Autofill Instructions: ", autofill_instructions, "\n\n")

    return autofill_instructions


if __name__ == "__main__":
    init_firebase()
    get_filled_inputs("J6hCwOP0KeYUpCRPLOebTIWLA392", {})
