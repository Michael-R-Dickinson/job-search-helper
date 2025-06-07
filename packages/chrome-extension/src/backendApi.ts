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
