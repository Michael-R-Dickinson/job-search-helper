import { useEffect } from 'react'
import triggerGetUserData from '../eventTriggers'
import { userAtom, userResumeNamesAtom } from '../atoms'
import { useSetAtom } from 'jotai/react'

const useFetchUserData = () => {
  const setUser = useSetAtom(userAtom)
  const setResumeNames = useSetAtom(userResumeNamesAtom)

  useEffect(() => {
    triggerGetUserData().then((userData) => {
      if (!userData) return
      setUser(userData)
      if (userData.userResumeNames) {
        setResumeNames(userData.userResumeNames)
      }
    })
  }, [setResumeNames, setUser])
}

export default useFetchUserData
