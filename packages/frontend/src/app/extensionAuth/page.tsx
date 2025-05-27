'use client'
import { useEffect } from 'react'
import { auth, authProvider } from '../../../firebase'
import useAuth from '@/hooks/useAuth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const ExtensionAuth = () => {
  const sendAuthTokensToParent = async () => {
    // if (loading) {
    //   return
    // }
    const result = await signInWithPopup(auth, authProvider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    // const currentUser = auth.currentUser
    // console.log(await currentUser?.getIdTokenResult())
    // console.log(await currentUser?.getIdToken())
    if (window.opener !== null) {
      // const idToken = await currentUser?.getIdToken()
      // console.log('current user', currentUser)
      window.opener.postMessage(
        {
          accessToken: credential?.accessToken,
          // idToken: idToken,
        },
        'chrome-extension://eaimbdpojdifkhoeappcfldgkipeioig',
      )
    }
  }
  // const { loading } = useAuth()
  // useEffect(() => {
  //   sendAuthTokensToParent()

  // window.close()

  // const message = currentUser
  //   ? JSON.stringify({ type: 'AUTH_SUCCESS', payload: currentUser })
  //   : JSON.stringify({ type: 'AUTH_ERROR', payload: 'No user signed in' })

  // const PARENT_FRAME = document.location.ancestorOrigins[0]
  // globalThis.parent.self.postMessage(message, PARENT_FRAME)
  // console.log('posting message to parent frame', message)
  // }, [])

  // useEffect(() => {
  //   const authenticate = async () => {
  //     if (loading) {
  //       console.log('loading')
  //       return
  //     }
  //     if (auth.currentUser) {
  //       console.log('user already signed in ', auth.currentUser)
  //       return
  //     }

  //     const res = await signInWithPopup(auth, authProvider)
  //     if (res) {
  //       console.log('signed in', res.user)
  //     }
  //   }

  return (
    <div className="my-24">
      <h1>Auth</h1>
      <button
        onClick={async () => {
          // await auth.signOut()
          sendAuthTokensToParent()
          // console.log('signing out', auth.currentUser)
        }}
        className="h-24 mb-8 cursor-pointer"
      >
        SignIn
      </button>
    </div>
  )
}

export default ExtensionAuth
