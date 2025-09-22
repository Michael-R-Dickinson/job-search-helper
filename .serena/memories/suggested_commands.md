# Development Commands

## Frontend (packages/frontend/)
- `pnpm run dev` - Start Next.js dev server on port 8080 with Turbopack
- `pnpm run build` - Build production application
- `pnpm run start` - Start production server  
- `pnpm run lint` - Run ESLint

## Chrome Extension (packages/chrome-extension/)
- `pnpm run dev` - Start Vite dev server
- `pnpm run build` - TypeScript compilation + Vite build
- `pnpm run test` - Run Vitest tests
- `pnpm run preview` - Preview built extension

## Backend (packages/backend/)
- Uses Poetry for dependency management
- Deploy via Firebase Functions
- `pytest` - Run tests
- `mypy` - Type checking

## Global
- `pnpm` - Package manager for monorepo