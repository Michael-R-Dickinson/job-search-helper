import { eventTypes } from '../events'

const triggerGetUserData = async () => {
  const response = await chrome.runtime.sendMessage({
    type: eventTypes.RETRIEVE_USER_DATA,
  })
  return response
}

export default triggerGetUserData
