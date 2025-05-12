import firebase_admin
from firebase_admin import credentials


def init_firebase():
    cred = credentials.Certificate("firebase_admin_creds.json")

    firebase_admin.initialize_app(
        cred, {"storageBucket": "jobsearchhelper-231cf.firebasestorage.app"}
    )


if __name__ == "__main__":
    init_firebase()
    print("Firebase initialized")
