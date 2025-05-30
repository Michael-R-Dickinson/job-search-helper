import { get, ref, set } from 'firebase/database'
import { database } from '../extensionFirebase'
import type { RealtimeDbSaveResult, UserAutofillPreferences } from '../autofillEngine/schema'

const getUserAutofillPreferencesPath = (userId: string) => `users/${userId}/autofill`

export const getUserAutofillValues = async (
  userId: string,
): Promise<UserAutofillPreferences | null> => {
  const userAutofillDataRef = ref(database, getUserAutofillPreferencesPath(userId))
  const snapshot = await get(userAutofillDataRef)

  if (!snapshot.exists()) return null

  return snapshot.val()
}

export const saveUserAutofillValue = async (
  userId: string,
  valuePath: string,
  value: string | boolean,
): Promise<RealtimeDbSaveResult> => {
  const userAutofillDataRef = ref(
    database,
    `${getUserAutofillPreferencesPath(userId)}/${valuePath}`,
  )
  await set(userAutofillDataRef, value)

  return {
    status: 'success',
    valuePath,
    value,
  }
}
