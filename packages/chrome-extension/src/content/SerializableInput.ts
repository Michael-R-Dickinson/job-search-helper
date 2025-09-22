import { z } from 'zod'
import {
  INPUT_ELEMENT_TYPES,
  type InputElementType,
  type MinifiedInput,
  type SerializedHtmlInput,
} from '../autofillEngine/schema'

export const SerializedHtmlInputSchema = z.object({
  label: z.string().nullable(),
  wholeQuestionLabel: z.string().nullable().optional(),
  html: z.string(),
  fieldType: z.nativeEnum(INPUT_ELEMENT_TYPES),
  name: z.string(),
  placeholder: z.string(),
  autocomplete: z.string(),
  htmlId: z.string(),
  className: z.string(),
  value: z.string(),
  required: z.boolean(),
  // A unique identifier we give to the input element to identify it in the DOM
  // This is used to match the input element to the autofill instruction in the frontend
  elementReferenceId: z.string(),
})

class SerializableInput {
  public readonly elementReferenceId: string
  public readonly label: string | null
  public readonly wholeQuestionLabel: string | null
  public readonly html: string
  public readonly fieldType: InputElementType
  public readonly name: string
  public readonly placeholder: string
  public readonly autocomplete: string
  public readonly htmlId: string
  public readonly className: string
  public readonly value: string
  public readonly required: boolean

  constructor(
    elementReferenceId: string,
    label: string | null,
    wholeQuestionLabel: string | null,
    html: string,
    fieldType: InputElementType,
    name: string,
    placeholder: string,
    autocomplete: string,
    htmlId: string,
    className: string,
    value: string,
    required: boolean,
  ) {
    this.elementReferenceId = elementReferenceId
    this.label = label
    this.wholeQuestionLabel = wholeQuestionLabel
    this.html = html
    this.fieldType = fieldType
    this.name = name
    this.placeholder = placeholder
    this.autocomplete = autocomplete
    this.htmlId = htmlId
    this.className = className
    this.value = value
    this.required = required
  }

  public toString(): string {
    const stringifiedProperties = [
      `elementReferenceId: ${this.elementReferenceId}`,
      `label: ${this.label}`,
      ...(this.wholeQuestionLabel ? [`wholeQuestionLabel: ${this.wholeQuestionLabel}`] : []),
      `id: ${this.elementReferenceId}`,
      `fieldType: ${this.fieldType}`,
    ]
    return 'Serializable(' + stringifiedProperties.join(', ') + ')'
  }

  public toMinified(): MinifiedInput {
    return {
      label: this.label,
      name: this.name,
      fieldType: this.fieldType,
      wholeQuestionLabel: this.wholeQuestionLabel,
      value: this.value,
      id: this.elementReferenceId,
    }
  }

  public static fromSerialized(serializedObject: unknown): SerializableInput {
    const parsed = SerializedHtmlInputSchema.parse(serializedObject)
    return new SerializableInput(
      parsed.elementReferenceId,
      parsed.label,
      parsed.wholeQuestionLabel ?? null,
      parsed.html,
      parsed.fieldType,
      parsed.name,
      parsed.placeholder,
      parsed.autocomplete,
      parsed.htmlId,
      parsed.className,
      parsed.value,
      parsed.required,
    )
  }

  public toSerialized(): SerializedHtmlInput {
    return {
      elementReferenceId: this.elementReferenceId,
      label: this.label,
      wholeQuestionLabel: this.wholeQuestionLabel,
      html: this.html,
      fieldType: this.fieldType,
      name: this.name,
      placeholder: this.placeholder,
      autocomplete: this.autocomplete,
      htmlId: this.htmlId,
      className: this.className,
      value: this.value,
      required: this.required,
    }
  }
}

export class SerializableInputArray extends Array<SerializableInput> {
  constructor(inputs: SerializableInput[]) {
    console.log('SerializableInputArray constructor', typeof inputs, inputs)
    // Convert to proper Array to ensure it's iterable before spreading
    const inputsArray = Array.isArray(inputs)
      ? inputs
      : Array.from(inputs as ArrayLike<SerializableInput>)

    super(...inputsArray)
  }

  public toMinified(): MinifiedInput[] {
    return this.map((input) => input.toMinified())
  }

  public toSerialized(): SerializedHtmlInput[] {
    return this.map((input) => input.toSerialized())
  }

  public toString(): string {
    return 'SerializableInputArray(' + this.map((input) => input.toString()).join('\n') + ')'
  }

  public withoutEmptyValues(): SerializableInputArray {
    return new SerializableInputArray(
      this.filter((input) => input.value !== '' && input.value !== null),
    )
  }

  public static fromSerialized(serializedObject: unknown): SerializableInputArray {
    const parsed = SerializedHtmlInputSchema.array().parse(serializedObject)
    console.log('SerializableInputArray fromSerialized', parsed)
    return new SerializableInputArray(
      parsed.map((input) => SerializableInput.fromSerialized(input)),
    )
  }
}

export default SerializableInput
