import uuid
from firebase import init_firebase
from functions.inputs_autofill_helper.autofill_schema import (
    FieldType,
    Input,
    InputList,
)
from functions.inputs_autofill_helper.category_handlers.disablitiy_category_handler import (
    DisabilityHandler,
)
from functions.save_filled_values_helper.input_saver import save_input_values

TESTING_USER = "test-autofill-user"


def get_instruction_by_value_path(instructions, value_path):
    for instruction in instructions:
        if instruction["path"] == value_path:
            return instruction

    raise LookupError(f"No instruction with path {value_path}")


def create_testing_input(**kwargs):
    fieldType = kwargs.get("fieldType")
    if fieldType == None or fieldType == "":
        raise ValueError("Field type must be specified")
    is_checkable = fieldType == FieldType.RADIO or fieldType == FieldType.CHECKBOX
    default_value = False if is_checkable else ""
    defaults = {
        "label": "",
        "name": "",
        "fieldType": fieldType,
        "wholeQuestionLabel": "",
        "value": default_value,
        "id": str(uuid.uuid4()),
    }
    defaults.update(kwargs)
    return Input(**defaults)


def test_disability_autofill() -> None:
    init_firebase()

    save_inputs = [
        create_testing_input(
            label="Yes",
            wholeQuestionLabel="Are you disabled?",
            fieldType="radio",
            value=True,
        ),
        create_testing_input(
            label="No",
            wholeQuestionLabel="Are you disabled?",
            fieldType="radio",
            value=False,
        ),
    ]

    updated_autofill_data = save_input_values(TESTING_USER, InputList(save_inputs))

    assert updated_autofill_data[DisabilityHandler.value_path] == "disabled"

    # autofills = get_filled_inputs(
    #     TESTING_USER,
    #     create_testing_input(
    #         label="Yes, the most",
    #         fieldType="radio",
    #         wholeQuestionLabel="Are you disabled af?",
    #     ),
    #     create_testing_input(
    #         label="Nope",
    #         fieldType="radio",
    #         wholeQuestionLabel="Are you disabled af?",
    #     ),
    # )

    # answer_0 = autofills[0]
    # assert answer_0["value"] == True
