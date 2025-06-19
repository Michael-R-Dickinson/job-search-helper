import json
from firebase import init_firebase
from functions.inputs_autofill_helper.autofill_schema import InputList
from functions.inputs_autofill_helper.fill_inputs import get_filled_inputs
from firebase_functions import https_fn
from functions.inputs_autofill_helper.testing import get_cached_inputs
from pydantic import ValidationError


def validate_autofill_inputs(user_id, inputs) -> tuple[str, InputList]:
    if not user_id:
        raise ValueError("User ID is required")

    try:
        inputs = InputList.model_validate(inputs)

    except ValidationError as e:
        raise ValueError(f"Invalid inputs: {e}")

    return user_id, inputs


def handle_autofill_request(user_id, inputs):
    try:
        user_id, inputs = validate_autofill_inputs(user_id, inputs)
        autofill_instructions = get_filled_inputs(user_id, inputs)

    except ValueError as e:
        print("\nERROR when getting autofill instructions", e, "\n")
        raise e
        # return https_fn.Response(
        #     json.dumps({"message": str(e)}),
        #     status=400,
        # )

    return https_fn.Response(
        json.dumps(
            {
                "message": "Autofill instructions generated",
                "autofill_instructions": autofill_instructions,
            }
        ),
        status=200,
    )


if __name__ == "__main__":
    init_firebase()
    cached_inputs = get_cached_inputs()
    handle_autofill_request("J6hCwOP0KeYUpCRPLOebTIWLA392", cached_inputs)
