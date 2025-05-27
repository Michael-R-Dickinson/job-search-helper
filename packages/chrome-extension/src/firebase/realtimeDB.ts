import { get, ref } from 'firebase/database'
import { database } from '../extensionFirebase'
import type { InputCategory } from '../autofillEngine/categorizeInputs'

type UserAutofillFieldsData = Partial<Record<InputCategory, string>>

export const getUserAutofillValues = async (
  userId: string,
): Promise<UserAutofillFieldsData | null> => {
  const userAutofillBucketRef = ref(database, `users/${userId}/autofill`)
  const snapshot = await get(userAutofillBucketRef)

  if (!snapshot.exists()) return null

  return snapshot.val()
}
