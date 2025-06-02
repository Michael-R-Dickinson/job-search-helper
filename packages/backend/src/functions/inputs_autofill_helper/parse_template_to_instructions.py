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


def get_value_from_path(path: str, user_data: dict):
    segments = extract_value_path_segments(path)
    output = []
    for segment in segments:
        if segment.startswith("{"):
            key = segment[1:-1]
            value = get_dict_value_by_path(key, user_data)
            if value:
                output.append(value)
        else:
            output.append(segment)

    return "".join(output)


def map_autofill_template_to_instructions(
    autofill_template_values: AutofillResponseSchema,
    user_autofill_data: dict,
):
    output_instructions = []
    instructions = autofill_template_values.autofill_instructions
    for instruction in instructions:
        if isinstance(instruction.valuePathString, str):
            value = get_value_from_path(instruction.valuePathString, user_autofill_data)
            output_instructions.append(
                {
                    "input_id": instruction.input_id,
                    "value": value,
                }
            )
        elif isinstance(instruction.valuePathString, IfExpression):
            expression = instruction.valuePathString

            condition = expression.condition
            condition_check_value = get_value_from_path(
                condition.valuePathString, user_autofill_data
            )
            if condition_check_value == condition.value:
                value = get_value_from_path(
                    expression.truthyValuePathString, user_autofill_data
                )
            else:
                value = get_value_from_path(
                    expression.falsyValuePathString, user_autofill_data
                )

            output_instructions.append(
                {
                    "input_id": instruction.input_id,
                    "value": value,
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
