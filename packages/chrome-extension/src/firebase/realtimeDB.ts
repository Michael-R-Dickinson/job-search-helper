import { get, ref } from 'firebase/database'
import { database } from '../extensionFirebase'
import type { UserAutofillPreferences } from '../autofillEngine/schema'

const getUserAutofillPreferencesPath = (userId: string) => `users/${userId}/autofill`

export const getUserAutofillValues = async (
  userId: string,
): Promise<UserAutofillPreferences | null> => {
  const userAutofillBucketRef = ref(database, getUserAutofillPreferencesPath(userId))
  const snapshot = await get(userAutofillBucketRef)

  if (!snapshot.exists()) return null

  return snapshot.val()
}
