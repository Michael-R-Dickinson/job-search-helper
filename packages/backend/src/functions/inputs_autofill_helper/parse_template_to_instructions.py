import re
from functions.inputs_autofill_helper.gemini_generation import (
    AutofillResponseSchema,
    IfExpression,
)


def get_dict_value_by_path(path: str, nested_dict: dict):
    active_dict = nested_dict
    for path_segment in path.split("/"):
        if path_segment:
            active_dict = active_dict.get(path_segment)
            if not isinstance(active_dict, dict):
                # If we reached the leaf of the dict tree, return the value
                return active_dict
    return None


def extract_value_path_segments(path: str):
    """
    Parse out each segment in curly braces and outside curly braces.

    Example:
    Input: "{name/first_name}-{name/last_name}"
    Output: ["{name/first_name}", "-", "{name/last_name}"]
    """
    if not path:
        return []

    pattern = r"(\{[^}]*\}|[^{]+)"
    segments = re.findall(pattern, path)
    return segments


def is_special_value_path_token(value: str):
    return value.lower() in ["{true}", "{false}"]


def get_special_value_path_value(value: str):
    if value.lower() == "{true}":
        return True
    elif value.lower() == "{false}":
        return False
    else:
        raise ValueError(f"Invalid special value path token: {value}")


# We only accept booleans and strings
# Ints and other types can be autofilled as strings
def handle_type_conversions(value):
    if isinstance(value, bool):
        return value
    return str(value)


def get_value_from_path(path: str, user_data: dict):
    segments = extract_value_path_segments(path)
    output = []
    for segment in segments:
        if segment.startswith("{"):
            if is_special_value_path_token(segment):
                return get_special_value_path_value(segment)
            key = segment[1:-1]
            value = get_dict_value_by_path(key, user_data)
            value = handle_type_conversions(value)
            if value is None:
                continue
            # If we have a boolean, we can return it directly
            # As this just indicates that a radio button or checkbox should be checked
            if isinstance(value, bool):
                return value

            output.append(value)
        else:
            output.append(segment)

    return "".join(output)


def map_autofill_template_to_instructions(
    autofill_template_values: AutofillResponseSchema,
    user_autofill_data: dict,
    original_inputs: list = None,
):
    output_instructions = []
    instructions = autofill_template_values.autofill_instructions
    for instruction in instructions:
        autofill_value = None
        if isinstance(instruction.valuePathString, str):
            value = get_value_from_path(instruction.valuePathString, user_autofill_data)
            autofill_value = value
        elif isinstance(instruction.valuePathString, IfExpression):
            expression = instruction.valuePathString

            condition = expression.condition
            condition_check_value = get_value_from_path(
                condition.valuePathString, user_autofill_data
            )
            if condition_check_value == condition.value:
                autofill_value = get_value_from_path(
                    expression.truthyValuePathString, user_autofill_data
                )
            else:
                autofill_value = get_value_from_path(
                    expression.falsyValuePathString, user_autofill_data
                )

        else:
            raise ValueError(
                f"Unknown instruction type: {type(instruction.valuePathString)}"
            )

        # find text text of the input with the same input_id as the instruction
        initial_input_text = next(
            (
                input["label"]
                for input in original_inputs
                if input["id"] == instruction.input_id
            ),
            None,
        )
        output_instructions.append(
            {
                "input_id": instruction.input_id,
                "value": autofill_value,
                "input_text": initial_input_text,
            }
        )

    return output_instructions


if __name__ == "__main__":
    print(
        get_dict_value_by_path(
            "name/first_name",
            {
                "name": {"first_name": "John", "last_name": "Doe"},
            },
        )
    )
