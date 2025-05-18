// const RESUME_TAILOR_API_URL =
//   'https://us-central1-jobsearchhelper-231cf.cloudfunctions.net/on_request'
const RESUME_TAILOR_API_URL = 'http://127.0.0.1:5001/jobsearchhelper-231cf/us-central1/on_request'

interface ResponseJson {
  message: string
  docx_download_url: string
  public_url: string
  pdf_url: string
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
  const res = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: false },
  })

  const json = await res.json()
  console.log('Response JSON:', json)

  if (!res.ok) {
    const errorText = json?.message || 'No error message provided'
    console.log('Error response:', json)
    throw new Error(`Error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return { json: json, status: res.status, statusText: res.statusText }
}
