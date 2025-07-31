# Code Style and Conventions

## General Guidelines
- Keep files under 500 lines
- Never hardcode secrets or credentials
- Use TypeScript strict mode (for Next.js app)
- Follow existing project patterns
- Use ESLint and follow its rules

## React/JavaScript Conventions
- Use functional components with hooks
- Use camelCase for variables and functions
- Use PascalCase for component names
- Import order: external libraries, internal modules, relative imports
- Use JSX file extension for React components

## CSS/Styling
- Use Tailwind CSS utility classes
- Follow responsive-first approach
- Use CSS custom properties for themes
- Keep component-specific styles in CSS modules when needed

## File Organization
- Components in `/src/components/`
- Pages in `/src/pages/`
- Utilities in `/src/utils/`
- Services in `/src/services/`
- Hooks in `/src/hooks/`

## Testing
- Write tests before implementation (TDD)
- Unit tests with Jest
- E2E tests with Playwright (for Next.js app)
- Test files co-located with components