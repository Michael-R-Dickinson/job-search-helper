import { describe, it, expect } from 'vitest'
import { resurrectInputInfosFromTest } from '../saveInputInfosForTests'
import fs from 'fs'
import path from 'path'
import { serializeInputsHtml } from '../../content/serializeInputsHtml'
import saveAutofillValues from '../../autofillEngine/saveAutofillValues'

// Load the test cases JSON
const testCasesPath = path.resolve(__dirname, 'inputsTestCases.json')
const testSites = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'))

const TEST_USER_ID = 'test-user-id'
describe('End-to-end save feature', () => {
  testSites.forEach((websiteTestData: any) => {
    it(`should correctly save autofill values for ${websiteTestData.sourceURL}`, async () => {
      // 1. Resurrect InputInfo[] from serialized data
      const inputInfos = resurrectInputInfosFromTest(websiteTestData.inputsData)
      const filledInputsExpected = websiteTestData.saveFilledInputsResponse

      // Debug: print resurrected inputInfos and their values
      inputInfos.forEach((info, idx) => {
        console.log(
          `Resurrected input #${idx}: label=${info.label}, id=${info.element.id}, value=${(info.element as any).value}`,
        )
      })

      // Take preprocessing from triggerSaveFilledValues.ts
      // But manually pass it to saveAutofillValues so we don't rely on the chrome
      // sendMessage function which is not available in the test environment
      const serializedInputs = serializeInputsHtml(inputInfos)
      const saveFilledInputsResponse = await saveAutofillValues(serializedInputs, TEST_USER_ID)

      // console.log('saveFilledInputsResponse', saveFilledInputsResponse)
      // 3. Validate that the saveFilledInputsResponse matches the expected response
      console.log(
        'Expected saveFilledInputsResponse:',
        JSON.stringify(filledInputsExpected, null, 2),
      )
      console.log(
        'Actual saveFilledInputsResponse:',
        JSON.stringify(saveFilledInputsResponse, null, 2),
      )
      expect(saveFilledInputsResponse).toEqual(filledInputsExpected)
    })
  })
})
