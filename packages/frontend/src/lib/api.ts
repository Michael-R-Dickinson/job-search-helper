const RESUME_TAILOR_API_URL = 'https://on-request-nduy76ia4q-uc.a.run.app'

export async function getTailoredResume(fileName: string, linkedInJobUrl: string, userId: string) {
  const queryParams = new URLSearchParams({
    userId: userId,
    fileName: fileName,
    jobDescriptionLink: linkedInJobUrl,
  })
  const url = `${RESUME_TAILOR_API_URL}?${queryParams.toString()}`
  const res = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: false },
  })
  return { json: await res.json(), status: res.status, statusText: res.statusText }
}
