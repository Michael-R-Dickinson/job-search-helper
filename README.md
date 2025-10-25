# ResuMe

A job search platform that automates resume tailoring, form autofill, and application tracking. The system consists of a Next.js web application, Chrome extension, and Python backend with Firebase Functions.

## Features

### Resume Tailoring

Takes a user's base resume (Word or Google Doc) and a LinkedIn job URL as input. Extracts the job description, analyzes it with Claude AI, and modifies the resume's experience and skills sections to better match the job requirements. The system:

- Parses Word documents into structured sections
- Segments resume content by section (experience, skills, etc.)
- Generates prompts for Claude based on job description and resume content
- Updates document sections while preserving formatting
- Outputs modified Word document

### Application Form Autofill

A Chrome extension that detects and fills form fields across job application websites. Uses a two-tier system:

**Pattern Matching**: Categorizes common fields (name, email, LinkedIn URL, pronouns, GitHub, etc.) using predicate functions that analyze field attributes and labels. Fills these directly from user preferences stored in Firebase.

**Backend Autofill**: For complex or ambiguous fields, sends field metadata to backend endpoints that use a combination of embedding-based similarity matching and LLM interpretation to determine appropriate values. Returns autofill instructions that the extension executes.

The extension runs content scripts on all URLs, detects form changes, and applies autofill on user trigger.

### Application Tracking

Dashboard interface for viewing submitted applications, interview schedules, and application status. Stores application metadata in Firebase.

### Additional Functions

- **Free Response Generation**: Uses Claude to generate essay-style answers for application questions based on user resume and job description
- **Cover Letter Tailoring**: Applies similar LLM-based customization to cover letter templates
- **LinkedIn Scraping**: Extracts job description text from LinkedIn job posting URLs

## Technical Architecture

**Frontend**: Next.js 15 with React 19, Tailwind CSS, DaisyUI. Uses React Query for server state. Firebase Auth for authentication.

**Chrome Extension**: Manifest v3 extension built with Vite and CRXJS. Uses Jotai for state management, Mantine for UI components. Content scripts inject into all pages to detect and fill forms.

**Backend**: Python 3.12 Firebase Functions. Uses:
- Claude AI (Anthropic API) for resume tailoring and text generation
- Gemini (Google) for form autofill interpretation
- python-docx for Word document manipulation
- NLTK for text tokenization in similarity matching
- textdistance for computing string similarity scores
- Firebase Admin SDK for database and storage operations

**Database**: Firebase (Firestore for data, Realtime Database for caching, Cloud Storage for resume files)

**Deployment**:
- Frontend: Hosted web application
- Extension: Chrome Web Store distribution
- Backend: Firebase Functions (Python runtime)

## Autofill System Details

The autofill system handles field interpretation through two paths:

1. **Simple categorization**: Direct pattern matching on field labels/names using regex and keyword detection. Returns values immediately from user profile.

2. **Backend processing**: Sends field data to backend endpoints that employ two different approaches:

   **Embedding + Cosine Similarity**: For fields with predefined options (select menus, radio buttons), the system:
   - Computes text embeddings for option labels
   - Compares against canonical value embeddings using cosine similarity
   - Uses tokenization with contraction expansion and negation detection (words like "not", "can't", "isn't") to penalize mismatched negations
   - Returns the best matching option based on similarity scores

   **LLM Interpretation**: For open-ended or complex fields, Gemini:
   - Analyzes field context against user data schema
   - Generates value path strings like `{name/first_name} {name/last_name}`
   - Creates conditional expressions for boolean fields: `if {authorization} equals "us_authorized" then {true} else {false}`
   - Handles enum-to-text conversions when needed
   - Identifies free-response fields that require generated content

The extension parses returned instructions and fills fields accordingly. For free-response fields, it can optionally trigger the free response generation endpoint.
