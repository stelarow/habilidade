# Technical Standards

## Architecture Overview

### Marketing Website (React + Vite)
- **Framework**: React 19 with Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM v6
- **Build**: Optimized code splitting with manual chunks
- **Performance**: Lazy loading, preconnect optimization, memory management

### Learning Platform (Next.js + TypeScript)
- **Framework**: Next.js 14.2.x with App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS 3.4+ with design system
- **Database**: Supabase (PostgreSQL) with RLS policies
- **Authentication**: Supabase Auth with middleware protection
- **State**: Zustand for client state management

## Code Quality Standards

### JavaScript/TypeScript
- Use ESLint with SonarJS, Unicorn, and React Hooks plugins
- Prefer functional components with hooks
- Use TypeScript strict mode in platform
- Follow React 19 best practices (concurrent features)
- Implement proper error boundaries

### Performance Requirements
- Code splitting with lazy loading
- Manual chunk optimization for vendor libraries
- Background components in separate chunks
- Memory management with cleanup hooks
- Performance level detection for low-end devices

### Styling Guidelines
- Use Tailwind utility classes
- Maintain brand color consistency (#d400ff, #00c4ff, #a000ff)
- Implement responsive design (mobile-first)
- Use Montserrat font family
- Apply glass effects and corner cuts for brand identity

## Development Workflow

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components
│   └── backgrounds/    # Course-specific backgrounds
├── pages/              # Route components (marketing site)
├── app/                # Next.js App Router (platform)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── constants/          # Application constants
```

### Component Patterns
- Use React.lazy() for route-level code splitting
- Implement proper loading states with Suspense
- Create reusable UI components in components/ui/
- Use custom hooks for complex logic
- Implement proper TypeScript interfaces

### Database Standards (Platform)
- Use Supabase with Row Level Security (RLS)
- Implement proper database triggers and functions
- Use typed queries with generated types
- Follow PostgreSQL best practices
- Implement proper indexing for performance