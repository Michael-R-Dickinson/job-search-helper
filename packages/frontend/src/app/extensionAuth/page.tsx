'use client'
import { auth, authProvider } from '../../../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const ExtensionAuth = () => {
  const authenticate = async () => {
    const result = await signInWithPopup(auth, authProvider)
    // This gives us a Google Access Token
    // We need this to sign in using credentials in the extension
    const credential = GoogleAuthProvider.credentialFromResult(result)

    if (window.opener !== null) {
      window.opener.postMessage(
        {
          accessToken: credential?.accessToken,
        },
        'chrome-extension://eaimbdpojdifkhoeappcfldgkipeioig',
      )
    }
  }
  return (
    <div className="my-24">
      <h1>Auth</h1>
      <button onClick={authenticate} className="h-24 mb-8 cursor-pointer">
        SignIn
      </button>
    </div>
  )
}

export default ExtensionAuth
