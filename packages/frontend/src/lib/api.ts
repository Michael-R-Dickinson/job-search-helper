// const RESUME_TAILOR_API_URL =
// 'https://us-central1-jobsearchhelper-231cf.cloudfunctions.net/on_request'

const RESUME_TAILOR_API_URL = 'http://127.0.0.1:5001/jobsearchhelper-231cf/us-central1/on_request'

export type QuestionAnswerMap = Record<string, boolean>

export interface QuestionAnswers {
  skillsToAdd: QuestionAnswerMap
  experienceQuestions: QuestionAnswerMap
}

export interface QuestionsResponse {
  message: string
  questions: {
    skills_to_add: string[]
    experience_questions: string[]
  }
  chat_id: string
}

export const getTailoringQuestions = async (
  userId: string,
  fileName: string,
  linkedInJobUrl: string,
): Promise<{ json: QuestionsResponse; status: number; statusText: string }> => {
  const queryParams = new URLSearchParams({
    function: 'get_questions',
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
  console.log('Questions Response JSON:', json)
  if (!res.ok) {
    const errorText = json?.message || 'No error message provided'
    console.log('Question fetch error response:', json)
    throw new Error(`Error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return { json: json, status: res.status, statusText: res.statusText }
}

interface TailoredResumeResponse {
  message: string
  docx_download_url: string
  public_url: string
  pdf_url: string
}

export const getTailoredResume = async (
  fileName: string,
  userId: string,
  chatId: string,
  questionAnswers: QuestionAnswers,
): Promise<{
  json: TailoredResumeResponse
  status: number
  statusText: string
}> => {
  const queryParams = new URLSearchParams({
    function: 'tailor_resume',
    userId: userId,
    fileName: fileName,
    chatId: chatId,
    questionAnswers: JSON.stringify({
      skills_to_add: questionAnswers.skillsToAdd,
      experience_questions: questionAnswers.experienceQuestions,
    }),
  })
  const url = `${RESUME_TAILOR_API_URL}?${queryParams.toString()}`
  const res = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: false },
  })

  const json = await res.json()
  console.log('Tailoring Response JSON:', json)

  if (!res.ok) {
    const errorText = json?.message || 'No error message provided'
    console.log('Tailoring error response:', json)
    throw new Error(`Error: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return { json: json, status: res.status, statusText: res.statusText }
}
