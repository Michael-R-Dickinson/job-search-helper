import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth/web-extension'

const app = initializeApp({
  apiKey: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
})

const auth = getAuth(app)

async function openAuthWindow() {
  const win = await chrome.windows.create({
    url: 'http://localhost:8080/extensionAuth',
    type: 'popup',
    width: 800,
    height: 600,
  })

  console.log('Opening auth window for extension')
  const AUTH_WINDOW = 'http://localhost:8080/extensionAuth'
  const w = window.open(AUTH_WINDOW, 'ExtensionAuth', 'width=800,height=600')

  window.addEventListener('message', (evt) => {
    if (evt.origin !== 'http://localhost:8080') return
    const data = evt.data
    const accessToken = data.accessToken

    const cred = GoogleAuthProvider.credential(null, accessToken)

    try {
      signInWithCredential(auth, cred)
        .then(() => console.log('✅ Firebase Auth in extension done'))
        .catch(console.error)
        .finally(() => w?.close())
    } catch (error) {
      console.error('Error signing in with credential:', error)
    }
  })
}

const authenticate = async () => {
  openAuthWindow()
}

export default authenticate
