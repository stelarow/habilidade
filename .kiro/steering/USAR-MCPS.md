---
inclusion: always
---

# MCP Tool Usage Guidelines

## Tool Selection Strategy

@Magicuidesign é um MCP access to all Magic UI components so that it can generate code with minimal errors.

### Supabase MCP
- **Use for**: Database operations on the learning platform (`plataforma-ensino/`)
- **When**: Creating migrations, querying data, managing RLS policies, debugging auth issues
- **Best Practice**: Always check existing schema before making changes
- **Context**: Learning platform uses Supabase with TypeScript, RLS enabled

### Context7 Documentation
- **Use for**: Library documentation lookup when implementing features
- **When**: Working with React, Next.js, Tailwind, or third-party libraries
- **Best Practice**: Resolve library ID first, then fetch focused documentation
- **Context**: Project uses React 19, Next.js 14.2.x, Tailwind CSS 3.4+

### Puppeteer Testing
- **Use for**: E2E testing, debugging UI issues, form validation testing
- **When**: Testing contact forms, course navigation, responsive design
- **Best Practice**: Connect to existing Chrome instance for efficiency
- **Context**: Marketing site uses EmailJS forms, platform has complex auth flows

### Sequential Thinking
- **Use for**: Complex architectural decisions, debugging multi-step issues
- **When**: Planning refactors, analyzing performance problems, designing new features
- **Best Practice**: Break down problems into logical steps, revise as needed

## Project-Specific Patterns

### Database Operations
- Use Supabase MCP for platform database work
- Always apply migrations rather than direct SQL for schema changes
- Check advisors after DDL changes to catch missing RLS policies

### Documentation Lookup
- Use Context7 for React/Next.js patterns and best practices
- Focus searches on specific topics (hooks, routing, performance)
- Prioritize official documentation over community content

### Testing Workflows
- Use Puppeteer for form testing (EmailJS integration critical)
- Test responsive design across device sizes
- Validate auth redirects and middleware behavior

### Problem Solving
- Use sequential thinking for architectural decisions
- Consider both marketing site (React/Vite) and platform (Next.js) contexts
- Factor in performance requirements and brand consistency

## Efficiency Guidelines

- Run multiple independent MCP operations in parallel when possible
- Cache documentation lookups for repeated library references
- Use specific database queries rather than broad data fetches
- Combine testing scenarios to minimize browser automation overhead