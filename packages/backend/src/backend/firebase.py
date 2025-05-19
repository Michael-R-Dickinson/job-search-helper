from datetime import timedelta, datetime
from backend.LLM_tailoring.schema import AnsweredResumeTailoringQuestions
import firebase_admin
from firebase_admin import credentials, db
import pickle
import base64


def init_firebase():
    cred = credentials.Certificate("firebase_admin_creds.json")

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": "jobsearchhelper-231cf.firebasestorage.app",
            "databaseURL": "https://jobsearchhelper-231cf-default-rtdb.firebaseio.com",
        },
    )


def pickle_object(obj: object) -> str:
    """
    Pickle an object to a string.
    """

    pickled_obj = pickle.dumps(obj)
    return base64.b64encode(pickled_obj).decode("utf-8")


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
