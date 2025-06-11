import { useEffect } from 'react'
import triggerGetUserData from '../eventTriggers'
import { userAtom, userResumesAtom } from '../atoms'
import { useSetAtom } from 'jotai/react'

const useFetchUserData = () => {
  const setUser = useSetAtom(userAtom)
  const setResumes = useSetAtom(userResumesAtom)

  useEffect(() => {
    triggerGetUserData().then((userData) => {
      if (!userData) return
      setUser(userData)
      if (userData.userResumes) {
        setResumes(userData.userResumes)
      }
    })
  }, [setResumes, setUser])
}

export default useFetchUserData
