import { AutofillInstructionsSchema, type MinifiedInput } from './autofillEngine/schema'

const API_URL = 'http://127.0.0.1:5001/jobsearchhelper-231cf/us-central1'

export const autofillInstructionsQuery = async (
  inputs: Partial<MinifiedInput>[],
  userId: string,
) => {
  const filteredInputs = inputs.filter((input) => input.label)
  const serializedInputs = JSON.stringify(filteredInputs)
  const queryParams = new URLSearchParams({
    userId,
  })
  console.log('fltered inputs', filteredInputs)
  const response = await fetch(
    `${API_URL}/get_input_autofill_instructions?${queryParams.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: serializedInputs,
    },
  )
  const data = await response.json()
  const instructions = data.autofill_instructions

  const parsedData = AutofillInstructionsSchema.parse(instructions)

  return parsedData
}

export const saveFilledInputsQuery = async (inputs: Partial<MinifiedInput>[], userId: string) => {
  const filteredInputs = inputs.filter((input) => input.label)
  const serializedInputs = JSON.stringify(filteredInputs)
  const queryParams = new URLSearchParams({
    userId,
  })
  await fetch(`${API_URL}/save_filled_inputs?${queryParams.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: serializedInputs,
  })
}

export const uploadResumeQuery = async (file: File, userId: string): Promise<boolean> => {
  console.log('uploading resume', file, userId)
  const formData = new FormData()
  formData.append('file', file)
  const queryParams = new URLSearchParams({
    userId,
  })
  try {
    const response = await fetch(`${API_URL}/upload_resume?${queryParams.toString()}`, {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    console.log('upload resume response', data)
    return true
  } catch (error) {
    console.error('error uploading resume', error)
    return false
  }
}

export const getResumesQuery = async (userId: string): Promise<string[]> => {
  const queryParams = new URLSearchParams({
    userId,
  })
  const response = await fetch(`${API_URL}/get_resume_list?${queryParams.toString()}`)
  const data = await response.json()
  console.log('get resumes response', data)
  return data.resume_names
}

// ! Copied from backendApi.ts in frontend
// TODO: Create a shared package for these
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

  const url = `${API_URL}/on_request?${queryParams.toString()}`
  const res = await fetch(url, {
    method: 'GET',
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
  const url = `${API_URL}/on_request?${queryParams.toString()}`
  const res = await fetch(url, {
    method: 'GET',
    cache: 'force-cache',
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
