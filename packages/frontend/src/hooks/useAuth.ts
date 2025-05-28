// useAuthWithCookie.ts
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../firebase'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'


type AnonymousUser = {
  uid: string
  displayName: string
  emailVerified: false
}
const anonymousUser: AnonymousUser = {
  uid: 'anonymous',
  displayName: 'Anonymous',
  emailVerified: false,
}


const COOKIE_NAME = 'fb_id_token'
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  // expire after 1 hour (tokens auto-expire in ~1h)
  expires: 1 / 24,   // 1 hour ** CHANGE this for hour 

  // only send over HTTPS in production -- TALK ABOUT POTENTIAL BACKEND
  secure: process.env.NODE_ENV === 'production', // TO TEST LOCALLY change this to secure: false
  // mitigate CSRF
  sameSite: 'Lax',
  // make it available site-wide
  path: '/',
}


interface AuthState {
  user: User | AnonymousUser
  loading: boolean
}


const useAuthWithCookie = (): AuthState => {
  const [loading, setLoading] = useState(true)
  const [user, setUser]     = useState<User | null>(null)


  useEffect(() => {
    // subscribe to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        // get fresh ID token
        const token = await u.getIdToken(/* forceRefresh */ true)
        // store it in a cookie
        Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
      } else {
        setUser(null)
        // remove when signed out
        Cookies.remove(COOKIE_NAME, { path: '/' })
      }
      setLoading(false)
    })


    return () => {
      unsubscribe()
    }
  }, [])


 
  if (user == null) {
    return { user: anonymousUser, loading }
  }
  return { user, loading }
}


export default useAuthWithCookie

