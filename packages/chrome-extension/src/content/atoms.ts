import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Maps resume name to public_url
export type ResumesMap = Record<string, string>

type UserInfo = {
  userId: string
  displayName: string | null | undefined
}
export const userAtom = atomWithStorage<UserInfo | null>('basicUserData', null)
export const userResumesAtom = atomWithStorage<ResumesMap | null>('userResumesStore', null)

// Should resolve to a string that is the public url of the resume
export const tailoringResumeAtom = atom<{
  promise: Promise<string> | null
  name: string | null
}>({
  promise: null,
  name: null,
})

const testingJobUrl = 'https://www.linkedin.com/jobs/view/4198077637/?alternateChannel=search'
export const jobUrlAtom = atom<string | null>(testingJobUrl)
