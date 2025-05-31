import { describe, it, expect } from 'vitest'
import { resurrectInputInfosFromTest } from '../saveInputInfosForTests'
import { serializeInputsHtml } from '../../content/serializeInputsHtml'
import saveFilledInputs from '../../autofillEngine/saveFilledInputs'
import { testWebsites, TEST_USER_ID } from './saveFilledInputs.e2e.test'
import getAutofillInstructions from '../../autofillEngine/getAutofillInstructions'

describe('End-to-end autofill feature', () => {
  testWebsites.forEach((websiteTestData: any) => {
    it(`should correctly autofill inputs for  ${websiteTestData.sourceURL}`, async () => {
      const autofillInstructionsExpected = websiteTestData.autofillInstructionsResponse
      // Ressurect inputInfos from the test data - essentially simulating the inputs from the website
      const inputInfos = resurrectInputInfosFromTest(websiteTestData.inputsData)
      // We use the flow for saving filled values - tested in saveFilledInputs.e2e.test.ts - to load the test
      // values into the database, so when we autofill we gaurantee we're pulling from the right values
      const serializedInputs = serializeInputsHtml(inputInfos)
      await saveFilledInputs(serializedInputs, TEST_USER_ID)
      // Then we take the flow from triggerGetAutofillValues and getAutofillValues to get autofill instructions
      // And these we validate as they're the final result of autofilling
      const autofillInstructions = await getAutofillInstructions(serializedInputs, TEST_USER_ID)
      // We validate the autofill instructions against the test data
      expect(autofillInstructions).toEqual(autofillInstructionsExpected)
    })
  })
})
