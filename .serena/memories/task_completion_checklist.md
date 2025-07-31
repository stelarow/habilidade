# Task Completion Checklist

## Before Committing
1. **Lint the code**: `npm run lint` (fix any errors)
2. **Type check**: `npm run type-check` or `npm run typecheck` 
3. **Run tests**: `npm run test`
4. **Build verification**: `npm run build` (ensure no build errors)

## For Learning Platform (Next.js)
1. **Additional checks**: `npm run check:all` (combines lint + type-check)
2. **E2E tests**: `npm run test:e2e` (if UI changes)

## Security & Best Practices
- Never commit secrets or API keys
- Use environment variables for configuration
- Follow RLS (Row Level Security) patterns for Supabase
- Test database operations thoroughly

## Git Workflow
- Create descriptive commit messages
- Maintain clean git history
- Document complex business logic
- Use feature branches for significant changes

## Performance
- Batch file operations when possible
- Use concurrent operations for performance
- Optimize images and assets