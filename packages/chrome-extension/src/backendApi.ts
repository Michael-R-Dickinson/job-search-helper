import type { MinifiedInput } from './autofillEngine/geminiCategorizeInputs'
import { AutofillInstructionsSchema } from './autofillEngine/schema'

const API_URL = 'http://127.0.0.1:5001/jobsearchhelper-231cf/us-central1'

export const autofillInstructionsQuery = async (inputs: Partial<MinifiedInput>[]) => {
  const filteredInputs = inputs.filter((input) => input.label)
  const serializedInputs = JSON.stringify(filteredInputs)
  const queryParams = new URLSearchParams({
    userId: 'J6hCwOP0KeYUpCRPLOebTIWLA392',
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
