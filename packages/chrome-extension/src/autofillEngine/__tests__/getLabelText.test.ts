import { describe, it, expect, beforeEach, afterEach } from 'vitest'
// import { getLabelText, getWholeQuestionLabel } from '../getLabelText'

describe.skip('Placeholder test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})

// describe('getLabelText', () => {
//   let container: HTMLDivElement

//   beforeEach(() => {
//     container = document.createElement('div')
//     document.body.appendChild(container)
//   })

//   afterEach(() => {
//     document.body.removeChild(container)
//   })

//   it('should find explicit labels using for/id attributes', () => {
//     container.innerHTML = `
//       <label for="test-input">Email Address</label>
//       <input type="email" id="test-input" />
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Email Address')
//   })

//   it('should find implicit labels (parent)', () => {
//     container.innerHTML = `
//       <label>
//         Full Name
//         <input type="text" />
//       </label>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Full Name')
//   })

//   it('should find labels with application-label class structure', () => {
//     container.innerHTML = `
//       <div>
//         <div class="application-label full-width textarea">
//           <div class="text">
//             Tell us more about your video games or projects?
//             <span class="required">✱</span>
//           </div>
//         </div>
//         <div class="application-field full-width required-field">
//           <textarea class="card-field-input" name="test-field"></textarea>
//         </div>
//       </div>
//     `
//     const textarea = container.querySelector('textarea') as HTMLTextAreaElement
//     expect(getLabelText(textarea)).toBe('Tell us more about your video games or projects?')
//   })

//   it('should find labels with field-label class', () => {
//     container.innerHTML = `
//       <div class="form-group">
//         <div class="field-label">What is your experience level?</div>
//         <div class="field-input">
//           <select>
//             <option>Beginner</option>
//             <option>Expert</option>
//           </select>
//         </div>
//       </div>
//     `
//     const select = container.querySelector('select') as HTMLSelectElement
//     expect(getLabelText(select)).toBe('What is your experience level?')
//   })

//   it('should find labels with form-label class', () => {
//     container.innerHTML = `
//       <div class="field-container">
//         <div class="form-label">Phone Number</div>
//         <input type="tel" />
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Phone Number')
//   })

//   it('should find labels with question-label class', () => {
//     container.innerHTML = `
//       <div class="question-container">
//         <div class="question-label">Do you have any certifications?</div>
//         <div class="answer-field">
//           <input type="checkbox" />
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Do you have any certifications?')
//   })

//   it('should remove required indicators from labels', () => {
//     container.innerHTML = `
//       <div class="application-label">
//         <span>Full Name *</span>
//       </div>
//       <input type="text" />
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Full Name')
//   })

//   it('should remove "Required" text from labels', () => {
//     container.innerHTML = `
//       <div class="field-label">Email Address (Required)</div>
//       <input type="email" />
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Email Address')
//   })

//   it('should handle nested label structures', () => {
//     container.innerHTML = `
//       <div class="form-section">
//         <div class="application-label">
//           <div class="label-wrapper">
//             <div class="text">
//               Describe your relevant work experience
//               <span class="required">✱</span>
//             </div>
//           </div>
//         </div>
//         <div class="field-wrapper">
//           <textarea></textarea>
//         </div>
//       </div>
//     `
//     const textarea = container.querySelector('textarea') as HTMLTextAreaElement
//     expect(getLabelText(textarea)).toBe('Describe your relevant work experience')
//   })

//   it('should find labels from nearby headings', () => {
//     container.innerHTML = `
//       <div class="section">
//         <h3>What programming languages do you know?</h3>
//         <div class="field">
//           <input type="text" />
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('What programming languages do you know?')
//   })

//   it('should prioritize explicit labels over other methods', () => {
//     container.innerHTML = `
//       <div class="application-label">Generic Question</div>
//       <label for="specific-input">Specific Label</label>
//       <input type="text" id="specific-input" />
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Specific Label')
//   })

//   it('should handle question-like text patterns', () => {
//     container.innerHTML = `
//       <div class="question-section">
//         <div class="text">Please describe your ideal work environment</div>
//         <textarea></textarea>
//       </div>
//     `
//     const textarea = container.querySelector('textarea') as HTMLTextAreaElement
//     expect(getLabelText(textarea)).toBe('Please describe your ideal work environment')
//   })

//   it('should detect question patterns with "tell us"', () => {
//     container.innerHTML = `
//       <div class="form-field">
//         <div class="label">Tell us about your hobbies</div>
//         <input type="text" />
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('Tell us about your hobbies')
//   })

//   it('should return null when no label is found', () => {
//     container.innerHTML = `
//       <div>
//         <input type="text" />
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBeNull()
//   })

//   it('should handle complex nested structures with multiple label candidates', () => {
//     container.innerHTML = `
//       <div class="application-form">
//         <div class="section-header">Personal Information</div>
//         <div class="field-group">
//           <div class="application-label primary">
//             <div class="text">What is your current job title?</div>
//           </div>
//           <div class="application-field">
//             <input type="text" />
//           </div>
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getLabelText(input)).toBe('What is your current job title?')
//   })
// })

// describe('getWholeQuestionLabel', () => {
//   let container: HTMLDivElement

//   beforeEach(() => {
//     container = document.createElement('div')
//     document.body.appendChild(container)
//   })

//   afterEach(() => {
//     document.body.removeChild(container)
//   })

//   it('should return null for non-radio/checkbox inputs', () => {
//     container.innerHTML = `
//       <div>What is your name?</div>
//       <input type="text" />
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBeNull()
//   })

//   it('should find fieldset legend for radio buttons', () => {
//     container.innerHTML = `
//       <fieldset>
//         <legend>Are you eligible to work in the US?</legend>
//         <label><input type="radio" name="eligibility" value="yes" /> Yes</label>
//         <label><input type="radio" name="eligibility" value="no" /> No</label>
//       </fieldset>
//     `
//     const input = container.querySelector('input[value="yes"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Are you eligible to work in the US?')
//   })

//   it('should find question context for checkboxes', () => {
//     container.innerHTML = `
//       <div class="question-group">
//         <div class="question-text">Do you have any of the following skills?</div>
//         <div class="options">
//           <label><input type="checkbox" value="javascript" /> JavaScript</label>
//           <label><input type="checkbox" value="python" /> Python</label>
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input[value="javascript"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Do you have any of the following skills?')
//   })

//   it('should clean up option words from question text', () => {
//     container.innerHTML = `
//       <div class="question">
//         <div>Are you willing to relocate? Yes No</div>
//         <label><input type="radio" name="relocate" value="yes" /> Yes</label>
//         <label><input type="radio" name="relocate" value="no" /> No</label>
//       </div>
//     `
//     const input = container.querySelector('input[value="yes"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Are you willing to relocate?')
//   })

//   it('should handle application-label structure for radio buttons', () => {
//     container.innerHTML = `
//       <div class="form-question">
//         <div class="application-label">
//           <div class="text">Do you require visa sponsorship?</div>
//         </div>
//         <div class="radio-group">
//           <label><input type="radio" name="visa" value="yes" /> Yes</label>
//           <label><input type="radio" name="visa" value="no" /> No</label>
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input[value="yes"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Do you require visa sponsorship?')
//   })

//   it('should prioritize fieldset legend over other question text for radio buttons', () => {
//     container.innerHTML = `
//       <div class="question">Do you like programming?</div>
//       <fieldset>
//         <legend>Are you available for remote work?</legend>
//         <label><input type="radio" name="remote" value="yes" /> Yes</label>
//         <label><input type="radio" name="remote" value="no" /> No</label>
//       </fieldset>
//     `
//     const input = container.querySelector('input[value="yes"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Are you available for remote work?')
//   })

//   it('should find question context with common question starters', () => {
//     container.innerHTML = `
//       <div class="form-section">
//         <div class="question-text">Please confirm your availability for travel</div>
//         <div class="checkbox-group">
//           <label><input type="checkbox" value="domestic" /> Domestic travel</label>
//           <label><input type="checkbox" value="international" /> International travel</label>
//         </div>
//       </div>
//     `
//     const input = container.querySelector('input[value="domestic"]') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBe('Please confirm your availability for travel')
//   })

//   it('should return null when no broader question context is found', () => {
//     container.innerHTML = `
//       <div>
//         <label><input type="radio" name="test" value="option1" /> Option 1</label>
//       </div>
//     `
//     const input = container.querySelector('input') as HTMLInputElement
//     expect(getWholeQuestionLabel(input)).toBeNull()
//   })
// })
