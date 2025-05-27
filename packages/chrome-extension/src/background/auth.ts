import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  type User,
} from 'firebase/auth/web-extension'
import { auth } from '../extensionFirebase'

// Single use big number
// Nonce generation by LLM - tested and working for OAuth2
function makeNonce(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let n = ''
  for (let i = 0; i < length; i++) {
    n += chars.charAt(
      Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * chars.length),
    )
  }
  return n
}

const backgroundAuthenticate = async () => {
  const CLIENT_ID = '979682135581-6i1h455suorolvf4q94q42jdqcsn7u10.apps.googleusercontent.com'
  const REDIRECT_URI = chrome.identity.getRedirectURL()
  console.log('Redirect URI:', REDIRECT_URI)
  const AUTH_URL =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    '?client_id=' +
    encodeURIComponent(CLIENT_ID) +
    '&response_type=' +
    encodeURIComponent('token id_token') +
    '&redirect_uri=' +
    encodeURIComponent(REDIRECT_URI) +
    '&scope=' +
    encodeURIComponent('openid email profile') +
    '&nonce=' +
    encodeURIComponent(makeNonce(24))

  try {
    const redirectResponse = await chrome.identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true,
    })

    const hash = redirectResponse?.split('#')[1]
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const idToken = params.get('id_token')

    const cred = GoogleAuthProvider.credential(idToken, accessToken)
    const result = await signInWithCredential(auth, cred)
    console.log('Firebase Auth result:', result)
  } catch (err) {
    console.error('Auth flow failed:', err)
  }
}

const authenticate = () => {
  if (user) {
    console.log('User already authenticated:', user)
    return true // Keep the message channel open for sendResponse
  }
  backgroundAuthenticate()
}

// Live user state
let user: User | null = null
onAuthStateChanged(auth, (u) => {
  user = u
})

export default authenticate
