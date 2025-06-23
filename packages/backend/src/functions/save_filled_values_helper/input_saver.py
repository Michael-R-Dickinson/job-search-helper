from firebase.realtime_db import get_user_autofill_data, save_user_autofill_data
from functions.inputs_autofill_helper.autofill_schema import InputList, SaveInstruction
from functions.inputs_autofill_helper.category_handlers.get_handler import (
    get_category_handler,
)
from functions.inputs_autofill_helper.embeddings import get_input_classifications


def convert_to_int(value) -> int:
    try:
        return int(value)
    except (ValueError, TypeError):
        return value


def convert_to_boolean(value) -> bool:
    if isinstance(value, str):
        if value == "true":
            return True
        elif value == "false":
            return False
    return value


TYPE_CONVERSION_MAP = {
    "phone/phoneNum": convert_to_int,
    "sponsorship/yesNoAnswer": convert_to_boolean,
}


def get_updated_user_autofill_data_obj(
    prev_user_autofill_data, save_values: list[SaveInstruction]
):
    # Start with the previous data or an empty dict if None
    updated_data = prev_user_autofill_data.copy() if prev_user_autofill_data else {}

    # Iterate through each save value
    for save_input in save_values:
        save_path = save_input["path"]
        path_parts = save_path.split("/")
        value = save_input["value"]

        # Apply type conversion if path has a converter configured
        if save_path in TYPE_CONVERSION_MAP:
            converter_func = TYPE_CONVERSION_MAP[save_path]
            value = converter_func(value)

        # Navigate/create the nested structure
        current_level = updated_data
        for i, part in enumerate(path_parts[:-1]):  # All but the last part
            if part not in current_level:
                current_level[part] = {}
            elif not isinstance(current_level[part], dict):
                # If the existing value is not a dict, replace it with a dict
                current_level[part] = {}
            current_level = current_level[part]

        # Set the final value
        current_level[path_parts[-1]] = value

    return updated_data


def save_input_values(user_id: str, inputs: InputList):
    user_autofill_data = get_user_autofill_data(user_id)
    if not user_autofill_data:
        user_autofill_data = {}

    classified_inputs = get_input_classifications(inputs)
    # print("\n classifieds", classified_inputs.model_dump_json())

    save_instructions: list[SaveInstruction] = []
    for classified_input in classified_inputs:
        category_handler = get_category_handler(
            classified_input.category, user_autofill_data
        )
        save_instruction = category_handler.save_filled_value(classified_input)
        if not isinstance(save_instruction, list):
            save_instruction = [save_instruction]

        save_instructions.extend(save_instruction)

    updated_data = get_updated_user_autofill_data_obj(
        user_autofill_data, save_instructions
    )
    save_user_autofill_data(user_id, updated_data)
    return updated_data
