# CLAUDE.md - Escola Habilidade Project

This file provides guidance to Claude Code when working with this educational platform.

## Project Overview

Dual-architecture educational platform for Escola Habilidade:

- **Main Website** (`/`) - React 19 + Vite marketing site
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Development Guidelines

### Code Style
- Keep files under 500 lines
- Never hardcode secrets or credentials
- Use TypeScript strict mode
- Follow existing project patterns

### Testing
- Write tests before implementation (TDD)
- Run tests before committing: `npm test`
- Include unit, integration, and E2E tests

### Build Commands
- `npm run dev` - Development server
- `npm run build` - Production build  
- `npm run test` - Run test suite
- `npm run lint` - Code linting
- `npm run typecheck` - TypeScript validation

### Database (Supabase)
- Use migrations for schema changes
- Follow RLS (Row Level Security) patterns
- Test database operations thoroughly

### Best Practices
- Batch file operations when possible
- Use concurrent operations for performance
- Maintain clean git history
- Document complex business logic

## MCP Integration (Optional)
- **Context7**: Library documentation lookups
- **Supabase MCP**: Database operations and migrations

## Important Notes
- Set bash command timeouts to 10+ minutes for complex operations
- Always run lint and typecheck before committing
- Use environment variables for configuration
- Follow security best practices for authentication

## Credentials
- Use sudo password: `123` when needed for system commands

## Learning Platform Login
- Username: alessandrobatisp@gmail.com
- Password: $Stelarow123