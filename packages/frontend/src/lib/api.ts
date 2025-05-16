// const RESUME_TAILOR_API_URL =
//   'https://us-central1-jobsearchhelper-231cf.cloudfunctions.net/on_request'
const RESUME_TAILOR_API_URL = 'http://127.0.0.1:5001/jobsearchhelper-231cf/us-central1/on_request'

interface ResponseJson {
  message: string
  download_url: string
}

export async function getTailoredResume(
  fileName: string,
  linkedInJobUrl: string,
  userId: string,
): Promise<{
  json: ResponseJson
  status: number
  statusText: string
}> {
  const queryParams = new URLSearchParams({
    userId: userId,
    fileName: fileName,
    jobDescriptionLink: linkedInJobUrl,
  })
  const url = `${RESUME_TAILOR_API_URL}?${queryParams.toString()}`
  console.log('Fetching tailored resume from:', url)
  const res = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: false },
  })
  console.log('Response from tailored resume API:', res)
  return { json: await res.json(), status: res.status, statusText: res.statusText }
}
