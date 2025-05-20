import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserBucketPath(userId: string, tailored: boolean = false): string {
  const base = `resumes/${userId}`
  if (tailored) {
    return `${base}/tailored`
  }
  return base
}

export const getEmptyMap = <T extends string | number, U>(
  arr: T[],
  defaultValue: U,
): Record<T, U> => {
  return arr.reduce(
    (acc, curr) => {
      acc[curr] = defaultValue
      return acc
    },
    {} as Record<T, U>,
  )
}
