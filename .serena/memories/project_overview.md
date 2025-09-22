# Perfectify Project Overview

## Purpose
Perfectify is a job search assistance platform that helps users with:
- AI-powered resume tailoring 
- Form autofill for job applications
- Cover letter generation
- LinkedIn job data extraction

## Tech Stack
- **Frontend**: Next.js 15 with React 19, Tailwind CSS, DaisyUI, React Query
- **Chrome Extension**: Manifest v3, Vite, Mantine UI, Jotai state management
- **Backend**: Python 3.12 Firebase Functions, Poetry dependency management
- **Database**: Firebase (Auth, Firestore, Storage, Functions)
- **Testing**: Vitest for extension, pytest for backend

## Architecture
- **Monorepo** structure with pnpm workspace
- Three main packages: frontend, chrome-extension, backend
- Firebase project ID: jobsearchhelper-231cf