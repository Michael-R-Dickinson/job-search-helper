import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../firebase'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ENVIRONMENT_NAME } from '@/constants'

type AnonymousUser = {
  uid: string
  displayName: string
  emailVerified: false
}

const COOKIE_NAME = 'perfectify-anonymous-user-id'
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  // expire after 1 hour (tokens auto-expire in ~1h)

  // only send over HTTPS in production -- TALK ABOUT POTENTIAL BACKEND
  secure: ENVIRONMENT_NAME === 'production', // TO TEST LOCALLY change this to secure: false
  // mitigate CSRF
  sameSite: 'Lax',
  // make it available site-wide
  path: '/',
}

interface AuthState {
  user: User | AnonymousUser
  loading: boolean
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null

  const pairs = document.cookie.split(';').map((s) => s.trim())
  for (const pair of pairs) {
    const [key, value] = pair.split('=')
    if (key === name) return decodeURIComponent(value)
  }
  return null
}

const getAnonymousUser = (): AnonymousUser => {
  let anonymousUserId: string | null = null

  const cookieUserId = getCookie(COOKIE_NAME)
  if (cookieUserId) {
    anonymousUserId = cookieUserId
  } else {
    anonymousUserId = crypto.randomUUID()
    Cookies.set(COOKIE_NAME, anonymousUserId, COOKIE_OPTIONS)
  }

  const anonymousUser: AnonymousUser = {
    uid: anonymousUserId,
    displayName: `Anonymous - ${anonymousUserId}`,
    emailVerified: false,
  }

  return anonymousUser
}
const useAuth = (): AuthState => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | AnonymousUser | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })

    if (user == null) {
      const anonymousUser = getAnonymousUser()
      setUser(anonymousUser)
      setLoading(false)
    }

    return () => unsubscribe()
  }, [user])

  const temporaryUser: AnonymousUser = {
    uid: 'anonymous',
    displayName: 'Anonymous',
    emailVerified: false,
  }

  return { user: user || temporaryUser, loading }
}

export default useAuth
