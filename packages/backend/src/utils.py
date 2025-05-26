import base64
from datetime import datetime
import hashlib
import os
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


def get_objects_hash(*args, digest_size=8) -> str:
    data = pickle.dumps(args)
    hash_value = hashlib.blake2b(data, digest_size=digest_size)
    hash_string = (
        base64.urlsafe_b64encode(hash_value.digest()).decode("utf-8").rstrip("=")
    )
    return hash_string


def delete_top_level_files(dir_path: str):
    for item in os.listdir(dir_path):
        item_path = os.path.join(dir_path, item)
        if os.path.isfile(item_path) or os.path.islink(item_path):
            os.unlink(item_path)
