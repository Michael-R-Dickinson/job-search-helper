from datetime import timedelta, datetime
from LLM_tailoring.resume.schema import AnsweredResumeTailoringQuestions
from utils import pickle_object
from firebase import init_firebase
import firebase_admin
from firebase_admin import credentials, db
import pickle
import base64


def unpickle_object(obj: str) -> object:
    """
    Unpickle an object from a string.
    """

    pickled_obj = base64.b64decode(obj.encode("utf-8"))
    return pickle.loads(pickled_obj)


def get_cache_path(id: str) -> str:
    return f"cache/{id}"


def cache_set_object(id: str, obj: object, expiry_length_seconds: int = 3600):
    """
    Cache an object at a given ID in Firebase.
    """
    payload = {
        "object": pickle_object(obj),
        "expiresAt": (
            datetime.utcnow() + timedelta(seconds=expiry_length_seconds)
        ).isoformat(),
    }

    ref = db.reference(get_cache_path(id))
    ref.set(payload)


def cache_get_object(id: str) -> object:
    """
    Get an object from the cache.
    """
    ref = db.reference(get_cache_path(id))
    print("path", ref.path)
    payload = ref.get()

    try:
        obj = payload["object"]
    except TypeError:
        raise ValueError("Object not found in cache")

    return unpickle_object(obj)


def get_user_values_path(user_id):
    return f"users/{user_id}"


def get_user_autofill_values_path(user_id):
    return f"{get_user_values_path(user_id)}/autofill"


def get_user_autofill_data(user_id):
    ref = db.reference(get_user_autofill_values_path(user_id))
    return ref.get()


if __name__ == "__main__":
    init_firebase()
    print("Firebase initialized")

    obj = AnsweredResumeTailoringQuestions(
        skills_to_add={"skill1": True, "skill2": False},
        experience_questions={"question1": True, "question2": False},
    )

    cache_set_object("testObject", obj, 3600)
    obj_fetched = cache_get_object("testObject")
    print("Cached object:", obj, obj_fetched)
