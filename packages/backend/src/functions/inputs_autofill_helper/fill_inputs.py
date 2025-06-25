import json
from firebase.realtime_db import get_user_autofill_data
from functions.inputs_autofill_helper.autofill_schema import InputList
from functions.inputs_autofill_helper.category_handlers.get_handler import (
    get_category_handler,
)
from functions.inputs_autofill_helper.embeddings import get_input_classifications


def get_filled_inputs(user_id, inputs: InputList):
    user_autofill_data = get_user_autofill_data(user_id)
    print("user_autofill_data\n", user_autofill_data)
    if not user_autofill_data:
        user_autofill_data = {}

    classified_inputs = get_input_classifications(inputs)
    print("classified\n", classified_inputs.model_dump_json(), "\n\n")

    filled_inputs = []
    for classified_input in classified_inputs:
        try:
            category_handler = get_category_handler(
                classified_input.category, user_autofill_data
            )
            value = category_handler.get_autofill_value(
                classified_input, classified_inputs
            )
            if value is None:
                continue

            filled_inputs.append(
                {
                    "input_text": classified_input.label
                    or classified_input.wholeQuestionLabel,
                    "input_id": classified_input.id,
                    "value": value,
                }
            )
        except NotImplementedError:
            print(f"Not implemented: {classified_input.category}")
            continue

    print("filled_inputs\n", json.dumps(filled_inputs, indent=4))

    return filled_inputs
