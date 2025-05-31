import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth/web-extension'
import { getDatabase } from 'firebase/database'

const app = initializeApp({
  apiKey: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,

  databaseURL: 'https://jobsearchhelper-231cf-default-rtdb.firebaseio.com',
})
export const database = getDatabase(app)

export const auth = getAuth(app)
