# XState Implementation Analysis for useAutofillInputs

## Overview

This document analyzes how XState could be applied to refactor the `useAutofillInputs` hook, which currently manages complex async state through manual status tracking and promise references.

## Current State Management Problems

### Implicit State Machine

The current implementation has an implicit state machine with these states:

- `idle` - No autofill process started
- `loading` - Fetching autofill instructions (split into simple/complex phases)
- `fetched` - Instructions ready for execution
- `filling_inputs` - Currently executing autofill
- `success` - Autofill completed successfully
- `error` - Something went wrong

### Current Issues

1. **Manual State Tracking**: Two separate status enums that can get out of sync
2. **Promise References**: Manual promise lifecycle management with refs
3. **Complex Dependencies**: Simple inputs must complete before complex inputs
4. **Error Handling**: No centralized error recovery
5. **Race Conditions**: Potential issues with concurrent autofill attempts
6. **Testing Difficulty**: Hard to test all state combinations

## Proposed XState Architecture

### Main State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    Autofill State Machine                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  idle ──START──→ checkingInputs ──INPUTS_FOUND──→ loading   │
│   ↑                     │                           │       │
│   │                     │                           ↓       │
│   │              INSUFFICIENT_INPUTS            fetchingData│
│   │                     │                           │       │
│   │                     ↓                           ↓       │
│   │                iframeMode                   dataReady   │
│   │                     │                           │       │
│   │                     │                           ↓       │
│   │                     │                      executing    │
│   │                     │                           │       │
│   │                     │                           ↓       │
│   └──RESET──────────────┴───────────────────── completed   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Hierarchical States

The `loading` state would contain nested states for the two-phase fetch:

```
loading
├── fetchingSimple
│   ├── pending
│   ├── processing
│   └── done
└── fetchingComplex
    ├── pending
    ├── processing
    └── done
```

The `executing` state would handle the filling sequence:

```
executing
├── preparingIframes
├── fillingSimple
├── fillingComplex
├── handlingResumes
└── completing
```

## State Machine Definition

### States and Transitions

| State                        | Entry Actions           | Exit Actions       | Possible Transitions                                           |
| ---------------------------- | ----------------------- | ------------------ | -------------------------------------------------------------- |
| `idle`                       | Clear previous data     | -                  | `START → checkingInputs`                                       |
| `checkingInputs`             | Count input elements    | -                  | `INPUTS_FOUND → loading`<br>`INSUFFICIENT_INPUTS → iframeMode` |
| `iframeMode`                 | Set iframe flag         | -                  | `RESET → idle`                                                 |
| `loading.fetchingSimple`     | Trigger simple fetch    | -                  | `SIMPLE_DONE → fetchingComplex`                                |
| `loading.fetchingComplex`    | Trigger complex fetch   | Store instructions | `COMPLEX_DONE → dataReady`                                     |
| `dataReady`                  | Process instructions    | -                  | `EXECUTE → executing`                                          |
| `executing.preparingIframes` | Send iframe messages    | -                  | `IFRAMES_READY → fillingSimple`                                |
| `executing.fillingSimple`    | Fill simple inputs      | -                  | `SIMPLE_FILLED → fillingComplex`                               |
| `executing.fillingComplex`   | Fill complex inputs     | -                  | `COMPLEX_FILLED → handlingResumes`                             |
| `executing.handlingResumes`  | Process resume uploads  | -                  | `RESUMES_HANDLED → completing`                                 |
| `executing.completing`       | Send completion message | -                  | `COMPLETED → completed`                                        |
| `completed`                  | Update UI state         | -                  | `RESET → idle`<br>`RESUME_UPLOAD → executingResume`            |

### Context Data

The machine context would store:

```typescript
interface AutofillContext {
  // Input elements
  elements: InputElement[]
  elementCount: number

  // Fetch results
  simpleInstructions: AutofillReadyInputArray | null
  complexInstructions: AutofillReadyInputArray | null
  allInstructions: AutofillReadyInputArray | null

  // UI state
  unfilledInputs: InputInfo[]
  freeResponseInputs: InputElement[]

  // Configuration
  usesIframes: boolean
  animationSpeed: AutofillAnimationSpeeds

  // Special instructions
  resumeInstructions: AutofillReadyInputArray

  // Error handling
  error: Error | null
  retryCount: number
}
```

### Services (Async Operations)

XState services would replace the current promise-based approach:

```typescript
const services = {
  // Replace triggerGetSimpleAutofillValues
  fetchSimpleInstructions: (context) => triggerGetSimpleAutofillValues(context.elements),

  // Replace triggerGetAutofillValues
  fetchComplexInstructions: (context) => triggerGetAutofillValues(context.complexInputs),

  // Replace executeAutofillSequence parts
  sendIframeMessages: () => sendMessageToIframes(eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES),

  fillSimpleInputs: (context) =>
    autofillInputElements(context.simpleInstructions, context.animationSpeed),

  fillComplexInputs: (context) =>
    autofillInputElements(context.complexInstructions, AutofillAnimationSpeeds.NONE),

  // For resume uploads
  executeResumeUpload: (context, event) =>
    autofillInputElements(
      context.resumeInstructions.withResumeUrl(event.resumeName),
      AutofillAnimationSpeeds.NONE,
    ),
}
```

## Promise Integration Patterns

### Awaiting State Transitions

External components can await specific states:

```typescript
// Current approach (manual promise refs)
const instructions = await complexInputsPromiseRef.current

// XState approach (await state transitions)
const service = interpret(autofillMachine).start()
await waitFor(service, (state) => state.matches('dataReady'))
const instructions = service.getSnapshot().context.allInstructions
```

### State-Based Promises

Create promises that resolve when reaching specific states:

```typescript
const createStatePromise = (service, targetState) => {
  return new Promise((resolve) => {
    const subscription = service.subscribe((state) => {
      if (state.matches(targetState)) {
        subscription.unsubscribe()
        resolve(state.context)
      }
    })
  })
}

// Usage
const dataReadyPromise = createStatePromise(autofillService, 'dataReady')
const completedPromise = createStatePromise(autofillService, 'completed')
```

## Error Handling Strategy

### Centralized Error States

All async operations would have consistent error handling:

```
Any State ──ERROR──→ error
   ↑                   │
   │                   ↓
   └──RETRY─────── retrying
```

### Error Recovery

- **Retry Logic**: Automatic retries with exponential backoff
- **Partial Recovery**: Continue with available data if some operations fail
- **User Feedback**: Clear error messages with recovery options
