import json
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from firebase_functions import https_fn


def validate_autofill_inputs(user_id, inputs):
    if not user_id:
        raise ValueError("User ID is required")
    if not inputs:
        raise ValueError("Inputs are required")

    # TODO: VALIDATE INPUTS WITH PYDANTIC
    return True


def handle_autofill_request(user_id, inputs):
    try:
        validate_autofill_inputs(user_id, inputs)
        autofill_instructions = get_filled_inputs(user_id, inputs)

    except ValueError as e:
        print("\nERROR when getting autofill instructions", e, "\n")
        return https_fn.Response(
            json.dumps({"message": str(e)}),
            status=400,
        )

    return https_fn.Response(
        json.dumps(
            {
                "message": "Autofill instructions generated",
                "autofill_instructions": autofill_instructions,
            }
        ),
        status=200,
    )
