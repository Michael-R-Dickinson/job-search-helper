import json
from firebase_functions import https_fn
from functions.inputs_autofill_helper.request_handler import validate_autofill_inputs
from functions.save_filled_values_helper.input_saver import save_input_values


def handle_save_filled_values_request(user_id, inputs):
    try:
        user_id, inputs = validate_autofill_inputs(user_id, inputs)
        save_input_values(user_id, inputs)

    except ValueError as e:
        return https_fn.Response(
            json.dumps({"message": str(e)}),
            status=400,
        )

    return https_fn.Response(
        json.dumps(
            {
                "message": "Filled inputs saved",
            }
        ),
        status=200,
    )
