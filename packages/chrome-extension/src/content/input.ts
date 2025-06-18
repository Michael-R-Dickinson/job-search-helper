import { getLabelText, getWholeQuestionLabel } from '../autofillEngine/getLabelText'
import type { InputElementType } from '../autofillEngine/schema'
import SerializableInput from './SerializableInput'
import type { ElementInfo } from './hooks/useInputElements'
import { extractDisplayedValue, getFieldType, removeValuePrefixes } from './serializeInputsHtml'

class InputElement {
  readonly label: string | null
  readonly elementReferenceId: string
  readonly element: ElementInfo

  readonly wholeQuestionLabel: string | null
  readonly name: string
  readonly fieldType: InputElementType
  readonly value: string

  constructor(element: ElementInfo, elementReferenceId: string) {
    this.elementReferenceId = elementReferenceId
    this.element = element
    this.label = InputElement.cleanLabelText(getLabelText(element))
    this.wholeQuestionLabel = getWholeQuestionLabel(element)
    this.fieldType = getFieldType(element)
    this.name = element.name || ''

    this.value = this.getValue()
  }

  get placeholder(): string {
    return ''
  }

  get isTextInput(): boolean {
    return this.fieldType === 'text' || this.fieldType === 'textbox'
  }

  get isFileUploadInput(): boolean {
    return this.fieldType === 'file' || this.fieldType === 'button'
  }

  get isCheckable(): boolean {
    return (
      this.element instanceof HTMLInputElement &&
      (this.fieldType === 'checkbox' || this.fieldType === 'radio')
    )
  }

  // can be autofilled by LLM - essentially text inputs and checkboxes
  get isLLMAutofillable(): boolean {
    return this.isTextInput || this.isCheckable
  }

  private getValue(): string {
    let value = this.element.value
      ? this.element.value
      : extractDisplayedValue(this.element, this.placeholder, this.label || '')
    value = removeValuePrefixes(value)
    if (this.element instanceof HTMLInputElement) {
      value = this.element.checked.toString()
    }
    return value
  }

  public toString(): string {
    const stringifiedProperties = [
      `label: ${this.label}`,
      ...(this.wholeQuestionLabel ? [`wholeQuestionLabel: ${this.wholeQuestionLabel}`] : []),
      `id: ${this.elementReferenceId}`,
    ]
    return 'InputElement(' + stringifiedProperties.join(', ') + ')'
  }

  public toSerializable(): SerializableInput {
    return new SerializableInput(
      this.elementReferenceId,
      this.label,
      this.wholeQuestionLabel,
      this.element.outerHTML,
      this.fieldType,
      this.name,
      this.placeholder,
      this.element.getAttribute('autocomplete') || '',
      this.element.id,
      this.element.className,
      this.value,
      Boolean(this.element.getAttribute('required')),
    )
  }

  public static cleanLabelText(label: string | null): string | null {
    if (!label) return null
    return label?.toLowerCase().trim().replace(/\*$/, '').trim()
  }
}

export default InputElement
