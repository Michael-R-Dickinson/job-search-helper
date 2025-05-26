import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../../firebase'
import { useState } from 'react'

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

const useAuth = (): { user: User | AnonymousUser; loading: boolean } => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  onAuthStateChanged(auth, (u) => {
    setUser(u)
    setLoading(false)
  })

  if (user == null) return { user: anonymousUser, loading }

  return { user, loading }
}

export default useAuth
