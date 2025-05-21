import base64
from datetime import datetime
import pickle
import uuid


def get_time_string():
    return datetime.now().strftime("%d_%H-%M-%S")


def generate_uuid() -> str:
    """
    Generates a UUID
    """
    return str(uuid.uuid4().hex)


def pickle_object(obj: object) -> str:
    """
    Pickle an object to a string.
    """

    pickled_obj = pickle.dumps(obj)
    return base64.b64encode(pickled_obj).decode("utf-8")
