import { useEffect } from 'react'
import triggerGetUserData from '../triggers/triggerGetUserData'
import { userAtom, userResumesAtom } from '../atoms'
import { useSetAtom } from 'jotai/react'

const useFetchUserData = () => {
  const setUser = useSetAtom(userAtom)
  const setResumes = useSetAtom(userResumesAtom)

  useEffect(() => {
    triggerGetUserData().then((userData) => {
      if (userData === undefined) {
        console.warn('PERFECTIFY: No user data found, user is likely not logged in')
        setUser(null)
        return
      }
      setUser(userData)
      if (userData.userResumes) {
        setResumes(userData.userResumes)
      }
    })
  }, [setResumes, setUser])
}

export default useFetchUserData
