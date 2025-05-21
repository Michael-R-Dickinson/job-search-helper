import firebase_admin
from firebase_admin import credentials, db


def init_firebase():
    cred = credentials.Certificate("firebase_admin_creds.json")

    firebase_admin.initialize_app(
        cred,
        {
            "storageBucket": "jobsearchhelper-231cf.firebasestorage.app",
            "databaseURL": "https://jobsearchhelper-231cf-default-rtdb.firebaseio.com",
        },
    )
