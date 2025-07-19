# Project Structure

## Root Directory
```
plataforma-ensino/
├── src/                    # Source code
├── database/              # Database schema and migrations
├── public/                # Static assets
├── tests/                 # Test files
├── .kiro/                 # Kiro configuration and steering
├── middleware.ts          # Next.js middleware for auth
└── [config files]         # Various configuration files
```

## Source Code Organization (`src/`)

### App Router (`src/app/`)
- **Route Structure**: Next.js 14 App Router with nested layouts
- **Page Types**: 
  - Public routes: `/`, `/courses`, `/course/[slug]`
  - Auth routes: `/auth/login`, `/auth/register`
  - Protected routes: `/dashboard`, `/course/[slug]/lesson/[lessonSlug]`
  - Admin routes: `/admin/*`
  - Test routes: `/test-*` (development only)

### Components (`src/components/`)
```
components/
├── admin/                 # Admin panel components
├── backgrounds/           # Animated background components (9 variants)
├── course/               # Course-related components
├── header/               # Navigation and header components
├── lesson/               # Lesson page components
│   ├── LessonPageRedesigned.tsx      # New lesson interface
│   ├── LessonPageIntegration.tsx     # Bridge component
│   ├── VideoSection.tsx              # Video player section
│   ├── PDFSection.tsx                # PDF viewer section
│   ├── QuizSection.tsx               # Interactive quiz
│   ├── ExercisesSection.tsx          # File upload exercises
│   └── CompletionSection.tsx         # Lesson completion
├── navigation/           # Navigation components
├── test/                 # Test-specific components
├── ui/                   # Reusable UI components (Design System)
└── index.ts              # Component exports
```

### Custom Hooks (`src/hooks/`)
- **Progress Tracking**: `useVideoProgress`, `usePDFProgress`, `useLessonProgress`
- **Completion Logic**: `useLessonCompletion`, `useCompletionCriteria`
- **Performance**: `useLessonPerformance`, `useTimeTracker`
- **UI Behavior**: `useScrollBehavior`, `usePageTimer`
- **Auth**: `useAdminAuth`

### Types (`src/types/`)
- **Main Types**: `index.ts` - Core interfaces (User, Course, Lesson, etc.)
- **Lesson Types**: `lesson/` - Lesson-specific type definitions
- **Type Conventions**: 
  - Interfaces over types for object shapes
  - Strict TypeScript with comprehensive typing
  - Optional properties use `undefined` over `null`

### Libraries (`src/lib/`)
```
lib/
├── auth/                 # Authentication utilities
├── supabase/            # Supabase client configurations
│   ├── client.ts        # Browser client
│   ├── server.ts        # Server client
│   └── middleware-client.ts  # Middleware client
├── utils.ts             # General utilities
├── video-security.ts    # Video protection utilities
└── youtube-utils.ts     # YouTube integration
```

### Contexts (`src/contexts/`)
- **LessonContext.tsx**: Lesson state management and data sharing

### Utilities (`src/utils/`)
- **Lesson Utils**: Progress calculations, test utilities, completion icons
- **Naming Convention**: Descriptive, feature-specific naming

## Database (`database/`)
- **schema.sql**: Complete database schema with RLS policies
- **Migration Files**: Incremental database changes
- **Security Policies**: Row Level Security configurations

## Static Assets (`public/`)
```
public/
├── images/              # General images
├── materials/           # Course materials
├── pdf/                # PDF documents
├── templates/          # Document templates
└── [standard files]    # favicon, next.svg, etc.
```

## Testing (`tests/`)
- **Unit Tests**: Component and utility testing
- **E2E Tests**: End-to-end user flows
- **Auth Tests**: Authentication flow testing
- **Utils**: Testing utilities and helpers

## Configuration Files
- **next.config.mjs**: Next.js config with Sentry, PDF.js, security headers
- **tailwind.config.ts**: Design system with Habilidade brand colors
- **middleware.ts**: Route protection and role-based redirects
- **tsconfig.json**: Strict TypeScript configuration
- **playwright.config.ts**: E2E testing setup

## Naming Conventions
- **Files**: kebab-case for pages, PascalCase for components
- **Components**: PascalCase with descriptive names
- **Hooks**: camelCase starting with "use"
- **Types**: PascalCase interfaces
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: Tailwind utilities + custom CSS properties

## Import/Export Patterns
- **Explicit Exports**: Components exported through index.ts files
- **Namespace Prevention**: Prefixed component names (e.g., LessonVideoPlayerComponent)
- **Barrel Exports**: Organized re-exports for clean imports
- **Relative Imports**: Use `@/` alias for src directory

## Development Patterns
- **Component Composition**: Small, focused components
- **Custom Hooks**: Extract reusable logic
- **Type-First**: Define interfaces before implementation
- **Server/Client Split**: Clear separation of server and client components
- **Progressive Enhancement**: Works without JavaScript, enhanced with it