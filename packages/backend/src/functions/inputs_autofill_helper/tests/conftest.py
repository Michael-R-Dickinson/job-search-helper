import time
import pytest

import uuid

from firebase.realtime_db import get_user_autofill_data, save_user_autofill_data
from functions.inputs_autofill_helper.autofill_schema import FieldType, Input
import firebase_admin
from firebase import init_firebase


TESTING_USER = "test-autofill-user"


def get_testing_user():
    return TESTING_USER


def create_testing_user_if_none():
    if get_user_autofill_data(TESTING_USER) is None:
        # Save some data to the user so that we can access the key
        # Users/test-autofill-user/autofill
        save_user_autofill_data(TESTING_USER, {"test": "test"})


def init_firebase_once():
    """Initialize Firebase only if it hasn't been initialized already"""
    try:
        firebase_admin.get_app()
    except ValueError:
        # App doesn't exist, so initialize it
        init_firebase()


def clear_test_user_autofills():
    save_user_autofill_data(TESTING_USER, [])


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


@pytest.fixture(autouse=True)
def setup_tests():
    init_firebase_once()
    clear_test_user_autofills()

    yield

    time.sleep(0.1)
