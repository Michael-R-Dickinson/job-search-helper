# Technical Design Document: Resume Tailoring String Answers Migration

## Technical Description

This is a **migration** to enhance the resume tailoring experience questions to allow string answers instead of just boolean "yes"/"no" responses. Currently, experience questions only accept boolean answers which are passed to the LLM as true/false values. The new implementation will allow users to provide additional context when answering "yes" to experience questions (e.g., "Have you used React.js?" → "Yes" + "at Google"). Skills questions will maintain their current boolean-only flow. This migration requires no backwards compatibility since this is a single dev unreleased app.

## Relevant Files

**Core files to modify:**

- `packages/backend/src/LLM_tailoring/resume/schema.py` - Update QuestionAnswers type and AnsweredResumeTailoringQuestions
- `packages/chrome-extension/src/backendApi.ts` - Update QuestionAnswers interface
- `packages/frontend/src/lib/api.ts` - Update QuestionAnswers interface
- `packages/chrome-extension/src/content/components/AnimatedQuestionCard.tsx` - Add string input UI for experience questions
- `packages/chrome-extension/src/content/components/TailoringQuestions.tsx` - Update answer handling logic
- `packages/backend/src/LLM_tailoring/resume/resume_prompt.py` - Update LLM prompt to handle string responses

**Consumer files that need updating:**

- `packages/chrome-extension/src/content/components/autofillListItems/ResumeListItemContent.tsx` - Update type references
- `packages/chrome-extension/src/utils.ts` - Update getEmptyQuestionAnswers function

## Key Decision Points

1. **Answer Data Structure**: Use `Record<string, QuestionAnswer>` with structured answer object instead of `Record<string, boolean>`

   - **Choice**: Create `QuestionAnswer` type with `answer: boolean` and `additional_info: string` fields
   - **Why**: Provides clear separation between the yes/no decision and additional context, making the data structure more explicit and easier to work with.

2. **LLM Prompt Updates**: Modify prompt to handle both boolean and string responses
   - **Choice**: Update prompt template to display string responses as additional context after the yes/no answer
   - **Why**: Allows LLM to use the rich context while maintaining clear understanding of the yes/no decision.

## Core Logic Snippets

**Updated Type Definitions:**

```typescript
// Shared QuestionAnswer type
export interface QuestionAnswer {
  answer: boolean
  additional_info: string
}

// Backend schema update
class QuestionAnswerModel(BaseModel):
    answer: bool
    additional_info: str

QuestionAnswers = dict[str, QuestionAnswerModel]

// Frontend/Extension type update
export type QuestionAnswerMap = Record<string, QuestionAnswer>
```

**UI State Management:**

```typescript
type ExperienceAnswerState = {
  hasAnswered: boolean
  currentAnswer: QuestionAnswer | null
  additionalInfoValue: string
  isConfirmed: boolean
  showConfirmButton: boolean
}
```

**Answer Processing Logic:**

```typescript
const createQuestionAnswer = (answer: boolean, additionalInfo: string = ''): QuestionAnswer => ({
  answer,
  additional_info: additionalInfo.trim(),
})

const updateQuestionAnswer = (
  questionAnswers: QuestionAnswersAllowUnfilled,
  question: FlatQuestion,
  answer: QuestionAnswer,
): QuestionAnswersAllowUnfilled => {
  return {
    ...questionAnswers,
    [question.type]: {
      ...questionAnswers[question.type],
      [question.question]: answer,
    },
  }
}
```

## UI Flow Design

### Experience Questions UI Flow

**Initial State:**
- Question text displayed
- Yes/No buttons visible
- Additional info input field visible below buttons (initially empty and unfocused)
- No confirm button visible

**User selects "No":**
- Immediately proceeds to next question (existing behavior)
- No additional info collection needed

**User selects "Yes":**
- Yes button remains selected/highlighted
- Focus automatically moves to additional info input field
- Confirm checkmark button appears inside the input field (right side)
- User can type additional context

**User submits additional info:**
- Via Enter key: Submits current answer and proceeds to next question
- Via confirm button click: Submits current answer and proceeds to next question
- Additional info can be empty (optional)

**Skills Questions UI Flow:**
- Maintains existing simple Yes/No flow with immediate progression
- No additional info input shown

### Key Interaction Differences

| Question Type | UI Elements | Flow |
|---------------|-------------|------|
| Skills | Yes/No buttons only | Select → Immediate next |
| Experience | Yes/No buttons + Additional info input | "No" → Immediate next<br>"Yes" → Focus input → Enter/Click confirm → Next |

## Implementation Process (High-Level)

**Direct Migration** approach chosen because:

- This is a single dev unreleased app with no backwards compatibility requirements
- The change affects core data structures and would be complex to maintain dual systems
- Clean migration provides better long-term maintainability

### Step 1: Update Backend

**Goal**: Ensure backend can receive, parse, and process structured QuestionAnswer objects from chrome extension

**Tasks**:

- Update `packages/backend/src/LLM_tailoring/resume/schema.py`:
  - Replace `QuestionAnswers = dict[str, bool]` with new QuestionAnswer model
  - Update `AnsweredResumeTailoringQuestions` to use structured answers
- Update `packages/backend/src/LLM_tailoring/resume/resume_prompt.py`:
  - Modify `generate_tailoring_llm_prompt` to format structured answers in LLM prompt
  - Update prompt template to display both boolean decisions and additional context
- Go step by step through the flow and ensure that structured answers from chrome extension are properly deserialized and integrated into LLM prompts

### Step 2: Update Chrome Extension

**Goal**: Update chrome extension UI and types to support additional information input for experience questions

**Tasks**:

- Update `packages/chrome-extension/src/backendApi.ts`:
  - Replace `QuestionAnswerMap = Record<string, boolean>` with `Record<string, QuestionAnswer>`
  - Update `QuestionAnswers` interface to use new structure
- Update `packages/chrome-extension/src/content/components/AnimatedQuestionCard.tsx`:
  - Add additional info input UI that's always visible below Yes/No buttons for experience questions
  - Implement conditional flow: "No" immediately proceeds → "Yes" focuses additional info input and shows confirm button
  - Support Enter key submission within additional info input
- Update `packages/chrome-extension/src/content/components/TailoringQuestions.tsx`:
  - Modify answer handling to accept both immediate boolean answers (skills/No responses) and structured QuestionAnswer objects (experience Yes responses)
  - Update `handleAnswer` to handle both boolean and QuestionAnswer parameters
  - Update state management for structured answers
- Update `packages/chrome-extension/src/utils.ts`:
  - Modify `getEmptyQuestionAnswers` to return proper QuestionAnswer structure
- Update `packages/chrome-extension/src/content/components/autofillListItems/ResumeListItemContent.tsx`:
  - Update type references to use new QuestionAnswer structure

**AnimatedQuestionCard Implementation Details:**

```typescript
// Updated component props
type AnimatedQuestionCardProps = {
  question: string
  onAnswer: (answer: boolean | QuestionAnswer) => void // Support both types
  onNextQuestion: () => void
  isSkillsQuestion: boolean
  isLastQuestion: boolean
}

// Internal state for experience questions
const [yesSelected, setYesSelected] = useState(false)
const [additionalInfo, setAdditionalInfo] = useState('')
const [showConfirmButton, setShowConfirmButton] = useState(false)

// Handle "No" - immediate submission with boolean
const handleNo = () => {
  if (isSkillsQuestion) {
    onAnswer(false) // Skills: boolean
  } else {
    onAnswer({ answer: false, additional_info: '' }) // Experience: QuestionAnswer
  }
  // Proceed to next question immediately
}

// Handle "Yes" - different behavior for skills vs experience
const handleYes = () => {
  if (isSkillsQuestion) {
    onAnswer(true) // Skills: immediate boolean submission
    // Proceed to next question immediately
  } else {
    setYesSelected(true)
    setShowConfirmButton(true)
    // Focus additional info input
    // Wait for user to submit via Enter or confirm button
  }
}

// Handle additional info submission for experience questions
const handleSubmitExperienceAnswer = () => {
  onAnswer({ answer: true, additional_info: additionalInfo.trim() })
  // Proceed to next question
}
```
