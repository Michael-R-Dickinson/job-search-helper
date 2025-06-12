import { atom } from 'jotai'

// Maps resume name to public_url
export type ResumesMap = Record<string, string>

type UserInfo = {
  userId: string
  displayName: string | null | undefined
}
export const userAtom = atom<UserInfo | null>(null)
export const userResumesAtom = atom<ResumesMap | null>(null)

// Should resolve to a string that is the public url of the resume
export const tailoringResumeAtom = atom<Promise<string> | null>(null)

const testingJobUrl = 'https://www.linkedin.com/jobs/view/4198077637/?alternateChannel=search'
export const jobUrlAtom = atom<string | null>(testingJobUrl)
