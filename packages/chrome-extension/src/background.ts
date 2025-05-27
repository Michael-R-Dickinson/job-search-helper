import { initializeApp } from 'firebase/app'
import { eventTypes } from './events'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, type User } from 'firebase/auth/web-extension'

console.log('Background script loaded')

function makeNonce(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let n = "";
  for (let i = 0; i < length; i++) {
    n += chars.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * chars.length));
  }
  return n;
}

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

const backgroundAuthenticate = async () => {

  const CLIENT_ID   = "979682135581-6i1h455suorolvf4q94q42jdqcsn7u10.apps.googleusercontent.com";
  const REDIRECT_URI = chrome.identity.getRedirectURL(); 
  console.log("Redirect URI:", REDIRECT_URI);
  const AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    "?client_id="     + encodeURIComponent(CLIENT_ID) +
    "&response_type=" + encodeURIComponent("token id_token") +
    "&redirect_uri="  + encodeURIComponent(REDIRECT_URI) +
    "&scope="         + encodeURIComponent("openid email profile") +
    "&nonce="         + encodeURIComponent(makeNonce(24))

    try {
    const redirectResponse = await chrome.identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true
    });

    const hash = redirectResponse?.split("#")[1];
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const idToken     = params.get("id_token");

    const cred = GoogleAuthProvider.credential(idToken, accessToken);
    const result = await signInWithCredential(auth, cred);
    console.log("Firebase Auth result:", result);
    console.log("✅ Signed into Firebase from background");
  } catch (err) {
    console.error("Auth flow failed:", err);
  }
}

let user: User | null = null
onAuthStateChanged(auth, (u) => {
  user = u
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === eventTypes.BEGIN_AUTHENTICATION_FLOW) {
    if (user) {
      console.log('User already authenticated:', user)
      return true // Keep the message channel open for sendResponse
    }
    backgroundAuthenticate()
    return true // Keep the message channel open for sendResponse
  }
})