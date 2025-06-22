import uuid
from functions.inputs_autofill_helper.autofill_schema import FieldType, Input


TESTING_USER = "test-autofill-user"


def get_testing_user():
    return TESTING_USER


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
