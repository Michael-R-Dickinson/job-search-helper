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

const COOKIE_NAME = 'perfectify-anonymous-user-id'
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  // expire after 1 hour (tokens auto-expire in ~1h)
  expires: 1 / 24, // 1 hour ** CHANGE this for hour

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

function getCookie(name: string) {
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

const useAuthWithCookie = (): AuthState => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  onAuthStateChanged(auth, (u) => {
    setUser(u)
    setLoading(false)
  })

  if (user == null) {
    const anonymousUser = getAnonymousUser()
    return { user: anonymousUser, loading }
  }

  return { user, loading }
}

export default useAuthWithCookie
