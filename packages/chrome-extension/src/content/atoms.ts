import { atom } from 'jotai'

type UserInfo = {
  userId: string
  displayName: string | null
}
export const userAtom = atom<UserInfo | null>(null)
export const userResumeNamesAtom = atom<string[]>([])

export const tailoringResumeAtom = atom<Promise<string> | null>(null)

export const jobUrlAtom = atom<string | null>(null)
