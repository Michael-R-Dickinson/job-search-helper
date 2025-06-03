from firebase.realtime_db import get_user_autofill_data, save_user_autofill_data
from src.functions.save_filled_values_helper.gemini_save_inputs import (
    generate_save_input_paths,
)


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


def get_updated_user_autofill_data_obj(prev_user_autofill_data, save_values):
    # Start with the previous data or an empty dict if None
    updated_data = prev_user_autofill_data.copy() if prev_user_autofill_data else {}

    # Iterate through each save value
    for save_input in save_values.save_values:
        path_parts = save_input.value_save_path.split("/")
        value = save_input.value

        # Apply type conversion if path has a converter configured
        if save_input.value_save_path in TYPE_CONVERSION_MAP:
            converter_func = TYPE_CONVERSION_MAP[save_input.value_save_path]
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


def save_input_values(user_id, inputs):
    save_values = generate_save_input_paths(inputs)
    user_autofill_data = get_user_autofill_data(user_id)
    updated_user_autofill_data = get_updated_user_autofill_data_obj(
        user_autofill_data, save_values
    )
    save_user_autofill_data(user_id, updated_user_autofill_data)
