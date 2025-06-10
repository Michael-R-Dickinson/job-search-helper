import { atom } from 'jotai'

type UserInfo = {
  userId: string
  displayName: string | null
}
export const userAtom = atom<UserInfo | null>(null)
export const userResumeNamesAtom = atom<string[]>([])
