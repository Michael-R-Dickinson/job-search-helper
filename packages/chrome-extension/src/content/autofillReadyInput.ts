import { FREE_RESPONSE_VALUE, RESUME_UPLOAD_VALUE } from '../autofillEngine/inputCategoryHandlers'
import { AutofillInstructionsSchema, type AutofillInstruction } from '../autofillEngine/schema'
import type { ElementInfo } from './hooks/useInputElements'
import InputElement from './input'
import { getElementByReferenceId } from './inputsManipulation/autofillInputElements'

class AutofillReadyInputElement extends InputElement {
  private _autofillValue: string | boolean

  constructor(element: ElementInfo, elementReferenceId: string, autofillValue: string | boolean) {
    super(element, elementReferenceId)
    this._autofillValue = autofillValue
  }

  public static fromReferenceId(elementReferenceId: string, autofillValue: string | boolean) {
    const element = getElementByReferenceId(elementReferenceId)
    if (!element) {
      throw new Error(`Element with reference ID ${elementReferenceId} not found`)
    }
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLButtonElement
      )
    ) {
      throw new Error(
        `Element with reference ID ${elementReferenceId} is not an input, textarea, select, or button`,
      )
    }

    return new AutofillReadyInputElement(element, elementReferenceId, autofillValue)
  }

  public isResumeAutofill(): boolean {
    return this._autofillValue === RESUME_UPLOAD_VALUE
  }

  public isFreeResponseAutofill(): boolean {
    return this._autofillValue === FREE_RESPONSE_VALUE
  }

  public get autofillValue(): string | boolean {
    return this._autofillValue
  }

  // Only to be used for resume autofills to set the url
  public setAutofillUrl(value: string) {
    this._autofillValue = value
  }
}

export class AutofillReadyInputArray extends Array<AutofillReadyInputElement> {
  constructor(inputs: AutofillReadyInputElement[]) {
    const inputsArray = Array.isArray(inputs)
      ? inputs
      : Array.from(inputs as ArrayLike<AutofillReadyInputElement>)

    super(...inputsArray)
  }

  public static fromAutofillInstructions(
    instructions: AutofillInstruction[],
  ): AutofillReadyInputArray {
    const parseResult = AutofillInstructionsSchema.safeParse(instructions)
    if (!parseResult.success) {
      throw new Error('Invalid autofill instructions: ' + JSON.stringify(parseResult.error))
    }

    const autofillReadyInputs = instructions
      .map((instruction) => {
        try {
          return AutofillReadyInputElement.fromReferenceId(instruction.input_id, instruction.value)
        } catch (e) {
          console.error('Error creating AutofillReadyInputElement:', e)
          return null
        }
      })
      .filter((i) => i !== null)
      .filter((i) => i.autofillValue !== null && i.autofillValue !== '')
    return new AutofillReadyInputArray(autofillReadyInputs)
  }

  public getResumeAutofills(): AutofillReadyInputArray {
    return new AutofillReadyInputArray(this.filter((input) => input.isResumeAutofill()))
  }
  public getFreeResponseAutofills(): AutofillReadyInputArray {
    return new AutofillReadyInputArray(this.filter((input) => input.isFreeResponseAutofill()))
  }
  public getStandardAutofills(): AutofillReadyInputArray {
    return new AutofillReadyInputArray(
      this.filter((input) => !input.isFreeResponseAutofill() && !input.isResumeAutofill()),
    )
  }

  public setAutofillResumeUrl(url: string): void {
    this.forEach((input) => {
      if (input.isResumeAutofill()) {
        input.setAutofillUrl(url)
      }
    })
  }

  public exclude(inputs: AutofillReadyInputElement[]): AutofillReadyInputArray {
    return new AutofillReadyInputArray(this.filter((input) => !inputs.includes(input)))
  }
}

export default AutofillReadyInputElement
