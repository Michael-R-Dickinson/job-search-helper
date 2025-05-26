'use client'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, authProvider } from '../../firebase'
import { FirebaseError } from 'firebase/app'

const SignInButton = () => {
  const signIn = async () => {
    // Taken from https://firebase.google.com/docs/auth/web/google-signin
    // And modified slightly to use async/await
    try {
      const result = await signInWithPopup(auth, authProvider)
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (!credential) {
        throw new Error('No credential found')
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error('An unknown error occurred during sign-in:', error)
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData?.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)

        console.error('Error Code:', errorCode)
        console.error('Error Message:', errorMessage)
        return
      }
    }
  }

  return (
    <div>
      <button   className="btn rounded-lg"
        onClick={signIn}

      >
        Sign in
      </button>
    </div>
  )
}

export default SignInButton
