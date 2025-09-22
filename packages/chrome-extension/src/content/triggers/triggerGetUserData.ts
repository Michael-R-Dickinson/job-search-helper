import { eventTypes } from '../../events'
import type { ResumesMap } from '../atoms'

export type UserDataResponse =
  | {
      userId: string
      displayName: string | null | undefined
      userResumes: ResumesMap
    }
  | undefined

const triggerGetUserData = async () => {
  const response: UserDataResponse = await chrome.runtime.sendMessage({
    type: eventTypes.RETRIEVE_USER_DATA,
  })
  return response
}

export default triggerGetUserData
