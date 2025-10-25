# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Perfectify is a job search assistance platform built as a **pnpm monorepo** with three main packages:
- **Frontend**: Next.js 15 application for the web interface
- **Chrome Extension**: Manifest v3 extension for form autofill
- **Backend**: Python Firebase Functions for AI-powered resume tailoring

## Development Commands

### Frontend (`/packages/frontend/`)
```bash
pnpm run dev     # Start Next.js dev server on port 8080 with Turbopack
pnpm run build   # Build production application
pnpm run start   # Start production server
pnpm run lint    # Run ESLint
```

### Chrome Extension (`/packages/chrome-extension/`)
```bash
pnpm run dev     # Start Vite dev server
pnpm run build   # TypeScript compilation + Vite build
pnpm run test    # Run Vitest tests
pnpm run preview # Preview built extension
```

### Backend (`/packages/backend/`)
```bash
uv sync           # Install dependencies
uv run pytest     # Run tests
uv run mypy src   # Type check
```

## Architecture Overview

### Frontend Structure
- **Next.js App Router** in `src/app/` with pages for dashboard, onboarding, and resume viewing
- **React Query** for server state management with providers in `Providers.tsx`
- **Tailwind CSS + DaisyUI** for styling
- **Firebase Auth** for authentication
- Components organized by feature in `src/components/`

### Chrome Extension Architecture
- **Manifest v3** with service worker in `background.ts`
- **Content scripts** inject autofill functionality across all websites
- **Autofill Engine** (`src/autofillEngine/`) handles form field detection and filling
- **Jotai** for local state management
- **Mantine UI** components with Emotion styling
- **Firebase integration** for user data and preferences

### Backend Functions
- **Resume Tailoring** (`functions/tailor_resume/`) - AI-powered resume customization
- **Free Response** (`functions/free_response/`) - AI-generated application responses
- **Document Processing** (`docx_functions/`) - Resume parsing and manipulation
- **LinkedIn Integration** (`linkedin_fetching/`) - Job data extraction

## Testing Approach

### Chrome Extension Testing
- **Framework**: Vitest with jsdom environment
- **Location**: Co-located `__tests__/` directories
- **Run Command**: `pnpm run test` (maps to `vitest run`)
- **Coverage**: Focuses on autofill engine with strategic test cases
- **API Call Limits**: Limit testing to ~15-20 API calls using vectorized inputs
- **Test Strategy**: Test common input types and edge cases, avoid direct canonical matches

### Backend Testing
- **Framework**: pytest with mypy type checking
- **Focus**: Autofill logic and Firebase Functions

## Key Development Patterns

### Code Organization
- **TypeScript strict mode** across all packages
- **Path aliases**: `@/*` maps to `./src/*` in frontend and extension
- **Domain separation**: Break large functions into focused, self-documenting units
- **Component separation**: Extract complex functionality into separate components or hooks

### Testing Strategy for Autofill
- **Input Types**:
  - Checkables (radio/checkbox): Expect boolean values, use `wholeQuestionLabel` only for checkables
  - Selects: Expect text strings that match select options
  - Text inputs: Direct values from user preferences
- **Schema**: Use Zod schemas from `autofillEngine/schema.ts` for validation
- **Optimization**: Test multiple cases in single API calls using input arrays

### Chrome Extension Specifics
- **Manifest v3** architecture with service workers
- **Content script injection** on all URLs with iframe support
- **Chrome APIs**: Uses tabs, scripting, storage, and activeTab permissions
- **Build tool**: CRXJS Vite plugin for extension packaging

## Firebase Configuration

- **Project ID**: `jobsearchhelper-231cf`
- **Services**: Authentication, Firestore, Storage, Functions
- **Runtime**: Python 3.12 for Cloud Functions
- **CORS**: Configured for development and production

## Dependencies and Tools

### Shared Technologies
- **TypeScript**: Strict mode enabled
- **Firebase SDK**: Authentication and data storage
- **Lucide React**: Icon library
- **Prettier**: Semi-colons disabled, single quotes, 100 char width

### Package-Specific
- **Frontend**: React 19, Tailwind, React Query, DaisyUI
- **Extension**: Mantine, Jotai, Fuse.js for fuzzy search, Zod for validation
- **Backend**: uv dependency management, pytest, mypy

## Important Notes

- **Monorepo**: Use pnpm for all package management
- **Testing**: Run tests after implementation changes, especially for autofill modifications
- **API Limits**: Be mindful of external API call limits in testing
- **Code Quality**: Prioritize readable, self-documenting code with proper domain separation