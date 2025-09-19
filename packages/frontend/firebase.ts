import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence } from 'firebase/auth'
import {
  PUBLIC_FIREBASE_API_KEY,
  PUBLIC_FIREBASE_APP_ID,
  PUBLIC_FIREBASE_AUTH_DOMAIN,
  PUBLIC_FIREBASE_MEASUREMENT_ID,
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  PUBLIC_FIREBASE_PROJECT_ID,
  PUBLIC_FIREBASE_STORAGE_BUCKET,
} from '@/constants'

export const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)

// export const analytics = getAnalytics(app)

export const authProvider = new GoogleAuthProvider()
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence) // Set persistence to local

export const storage = getStorage(app)

// export const auth = {
//   currentUser: {
//     uid: 'testUserId',
//   },
// }
