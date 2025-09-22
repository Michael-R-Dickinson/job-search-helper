# Code Style and Conventions

## TypeScript
- Strict mode enabled across all packages
- Path aliases: `@/*` maps to `./src/*` in frontend and extension

## Code Organization  
- Domain separation: Break large functions into focused, self-documenting units
- Component separation: Extract complex functionality into separate components or hooks
- Co-located tests in `__tests__/` directories

## Formatting
- Prettier configuration: Semi-colons disabled, single quotes, 100 char width

## Testing Strategy
- Chrome Extension: Vitest with jsdom, limit API calls to ~15-20 using vectorized inputs
- Backend: pytest with mypy type checking
- Focus on common input types and edge cases

## Patterns
- Firebase integration for user data and preferences
- Zod schemas for validation (autofillEngine/schema.ts)
- Autofill engine handles form field detection and filling