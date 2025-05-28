import { get, ref } from 'firebase/database'
import { database } from '../extensionFirebase'
import type { UserAutofillPreferences } from '../autofillEngine/schema'

const getUserAutofillPreferencesPath = (userId: string) => `users/${userId}/autofill`

export const getUserAutofillValues = async (
  userId: string,
): Promise<UserAutofillPreferences | null> => {
  const userAutofillDataRef = ref(database, getUserAutofillPreferencesPath(userId))
  const snapshot = await get(userAutofillDataRef)

  if (!snapshot.exists()) return null

  return snapshot.val()
}
