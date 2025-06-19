from firebase.realtime_db import get_user_autofill_data
from functions.inputs_autofill_helper.autofill_schema import InputList
from functions.inputs_autofill_helper.embeddings import get_input_classifications


def get_filled_inputs(user_id, inputs: InputList):
    user_autofill_data = get_user_autofill_data(user_id)
    if not user_autofill_data:
        raise ValueError("User data not found")

    classified_inputs = get_input_classifications(inputs)
    print("classified\n", classified_inputs)

    # autofill_template_values = generate_autofill_with_gemini(inputs)
    # autofill_instructions = map_autofill_template_to_instructions(
    #     autofill_template_values, user_autofill_data, original_inputs=inputs
    # )
    # print("\nInitial Inputs: ", inputs, "\n")
    # print("Autofill Template: ", autofill_template_values.model_dump(), "\n")
    # print("Finished Autofill Instructions: ", autofill_instructions, "\n\n")

    # return autofill_instructions
