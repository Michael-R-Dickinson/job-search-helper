import { get, ref } from 'firebase/database'
import { database } from '../extensionFirebase'

type UserAutofillFieldsData = Partial<{
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}>

export const getUserAutofillBucket = async (
  userId: string,
): Promise<UserAutofillFieldsData | null> => {
  const userAutofillBucketRef = ref(database, `users/${userId}/autofill`)
  const snapshot = await get(userAutofillBucketRef)

  if (!snapshot.exists()) return null

  return snapshot.val()
}
