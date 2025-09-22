# Task Completion Checklist

When completing coding tasks:

1. **Implementation**
   - Follow existing code patterns and conventions
   - Use TypeScript strict mode
   - Maintain domain separation

2. **Testing**
   - Run tests after implementation changes: `pnpm run test`
   - Especially important for autofill modifications
   - Be mindful of API call limits in testing

3. **Code Quality**
   - Run linting: `pnpm run lint` 
   - Type checking with mypy for Python code
   - Ensure readability and maintainability

4. **Build Verification**
   - Run build commands to ensure no breaking changes
   - Frontend: `pnpm run build`
   - Extension: `pnpm run build`

## Important Notes
- NEVER commit changes unless explicitly requested
- Prioritize editing existing files over creating new ones
- No automatic documentation creation