import firebase_admin
from firebase_admin import credentials


def init_firebase():
    try:
        # Try to initialize with credentials first (production)
        cred = credentials.Certificate("firebase_admin_creds.json")
        firebase_admin.initialize_app(
            cred,
            {
                "storageBucket": "jobsearchhelper-231cf.firebasestorage.app",
                "databaseURL": "https://jobsearchhelper-231cf-default-rtdb.firebaseio.com",
            },
        )
    except FileNotFoundError:
        # If credentials file not found, initialize without credentials (emulator)
        print(
            "Initializing firebase without credentials - ADD ADMIN CREDS FOR FULL ACCESS"
        )
        firebase_admin.initialize_app(
            options={
                "storageBucket": "jobsearchhelper-231cf.firebasestorage.app",
                "databaseURL": "https://jobsearchhelper-231cf-default-rtdb.firebaseio.com",
            }
        )
