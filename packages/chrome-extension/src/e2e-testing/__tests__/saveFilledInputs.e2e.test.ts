import { describe, it, expect } from 'vitest'
import { resurrectInputInfosFromTest } from '../saveInputInfosForTests'
import fs from 'fs'
import path from 'path'
import { serializeInputsHtml } from '../../content/serializeInputsHtml'
import saveAutofillValues from '../../autofillEngine/saveAutofillValues'

// Load the test cases JSON
export const testCasesPath = path.resolve(__dirname, 'inputsTestCases.json')
export const testWebsites = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'))

export const TEST_USER_ID = 'test-user-id'
describe('End-to-end save feature', () => {
  testWebsites.forEach((websiteTestData: any) => {
    it(`should correctly save autofill values for ${websiteTestData.sourceURL}`, async () => {
      // 1. Resurrect InputInfo[] from serialized data
      const inputInfos = resurrectInputInfosFromTest(websiteTestData.inputsData)
      const filledInputsExpected = websiteTestData.saveFilledInputsResponse

      // Take preprocessing from triggerSaveFilledValues.ts
      // But manually pass it to saveAutofillValues so we don't rely on the chrome
      // sendMessage function which is not available in the test environment
      const serializedInputs = serializeInputsHtml(inputInfos)
      const saveFilledInputsResponse = await saveAutofillValues(serializedInputs, TEST_USER_ID)

      expect(saveFilledInputsResponse).toEqual(filledInputsExpected)
    })
  })
})
