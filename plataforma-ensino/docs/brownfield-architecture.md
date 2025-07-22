# 📊 Plataforma Ensino Habilidade - Brownfield Architecture Document

## Introduction

This document captures the **CURRENT STATE** of the Plataforma Ensino Habilidade educational platform codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents working on enhancements to the lesson system and platform optimization.

### Document Scope

**Focused on areas relevant to:** Lesson page redesign enhancement, modular component integration, and video/PDF/quiz system optimization. Primary focus on active development areas with lesson system modernization.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-07-22 | 1.0 | Initial brownfield analysis focused on lesson system redesign | Business Analyst |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `src/app/page.tsx` (Next.js 14 App Router root)
- **Configuration**: `next.config.mjs`, `tailwind.config.ts`, `.env.local`
- **Core Business Logic**: `src/components/lesson/`, `src/hooks/`, `src/lib/supabase/`
- **API Definitions**: `src/app/api/` - RESTful endpoints for lesson management
- **Database Models**: `database/schema.sql` - Complete PostgreSQL schema with RLS
- **Key Algorithms**: `src/utils/lessonProgressUtils.ts`, `src/components/lesson/LessonPageIntegration.tsx`

### Enhancement Focus - Lesson System Redesign Impact Areas

**Primary Components Being Enhanced:**
- `src/components/lesson/LessonPageRedesigned.tsx` - New modular lesson interface
- `src/components/lesson/LessonPageIntegration.tsx` - Data bridge component
- `src/components/lesson/VideoSection.tsx` - Enhanced video player component
- `src/components/lesson/PDFSection.tsx` - Improved PDF viewer with performance fixes
- `src/components/lesson/QuizSection.tsx` - Interactive quiz component
- `src/components/lesson/CompletionSection.tsx` - Lesson completion workflow

**Test Pages for Validation:**
- `/test-lesson-redesigned` - Full redesigned interface testing
- `/test-completion-section` - Completion workflow validation
- `/test-lesson-header` - Header component responsive testing

## High Level Architecture

### Technical Summary

**Current State**: Advanced brownfield Next.js 14 educational platform in **Phase 2** implementation with focus on lesson system modernization. Heavy development on modular component architecture with data integration layer.

### Actual Tech Stack (from package.json)

| Category | Technology | Version | Notes |
|----------|------------|---------|--------|
| Runtime | Node.js | 18+ | Required minimum |
| Framework | Next.js | 14.2.30 | App Router with RSC |
| Language | TypeScript | 5.4.4 | Strict mode enabled |
| Database | Supabase | 2.50.4 | PostgreSQL + Auth + Storage |
| UI Framework | Tailwind CSS | 3.4.1 | Custom design system |
| State Management | Zustand | 4.5.0 | Preferred over Redux |
| Forms | React Hook Form | 7.48.0 | + Zod validation |
| Video Player | Mux Player | 2.6.0 | + React Player fallback |
| PDF Processing | PDF.js | 5.3.31 | + React-PDF wrapper |
| Error Tracking | Sentry | 7.104.0 | Full Next.js integration |
| Testing | Jest + Playwright | 29.7.0 + 1.40.0 | Unit + E2E coverage |

### Repository Structure Reality Check

- **Type**: Monorepo with dual architecture (main site + learning platform)
- **Package Manager**: npm with lockfile
- **Notable**: Heavy use of test pages for component validation, modular lesson architecture in active development

## Source Tree and Module Organization

### Project Structure (Actual)

```text
plataforma-ensino/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── api/                  # REST API endpoints
│   │   ├── auth/                 # Authentication pages (login, register)
│   │   ├── admin/                # Admin dashboard (role-protected)
│   │   ├── course/[slug]/        # Course detail pages
│   │   │   └── lesson/[lessonSlug]/  # Lesson pages (OLD + NEW)
│   │   │       ├── page.tsx          # Current production lesson page
│   │   │       ├── page-redesigned.tsx  # NEW: Redesigned lesson interface
│   │   │       └── page-old.tsx      # Backup of original implementation
│   │   ├── test-*/               # Multiple test pages for component validation
│   │   └── dashboard/            # Student dashboard
│   ├── components/
│   │   ├── lesson/               # CRITICAL: Active lesson redesign components
│   │   │   ├── LessonPageRedesigned.tsx     # New modular lesson interface
│   │   │   ├── LessonPageIntegration.tsx    # Data bridge component
│   │   │   ├── VideoSection.tsx             # Enhanced video player
│   │   │   ├── PDFSection.tsx              # PDF viewer with perf fixes
│   │   │   ├── QuizSection.tsx             # Interactive quiz component
│   │   │   ├── CompletionSection.tsx       # Completion workflow
│   │   │   └── header/                     # Responsive lesson header system
│   │   ├── admin/                # Admin management components
│   │   ├── ui/                   # Shared UI design system
│   │   └── backgrounds/          # Course-themed backgrounds (9 types)
│   ├── hooks/                    # Custom React hooks (14 specialized)
│   │   ├── useLessonProgress.ts  # CRITICAL: Lesson progress calculation
│   │   ├── useLessonPerformance.ts  # Performance monitoring hook
│   │   └── useCompletionCriteria.ts  # Completion logic hook
│   ├── lib/                      # Core utilities and configurations
│   │   ├── supabase/             # Database client configurations
│   │   └── auth/                 # Authentication helpers
│   ├── types/                    # TypeScript definitions
│   │   └── lesson/               # Lesson-specific type definitions
│   └── utils/                    # Utility functions
│       ├── lessonProgressUtils.ts    # CRITICAL: Progress calculations
│       └── lessonTestUtils.ts        # Test data generation
├── database/
│   └── schema.sql                # Complete PostgreSQL schema with RLS
├── tests/                        # Jest + Playwright test suites
└── middleware.ts                 # Next.js middleware for auth/admin routing
```

### Key Modules and Their Purpose

- **Lesson System (Active Development)**: `src/components/lesson/` - Modular redesigned lesson interface
- **Data Integration**: `LessonPageIntegration.tsx` - Bridges old data structure with new UI
- **Performance Hooks**: `src/hooks/useLessonPerformance.ts` - Monitors lesson loading performance  
- **Authentication**: `middleware.ts` - Role-based route protection (admin/student/instructor)
- **Database Layer**: `src/lib/supabase/` - Client/server database configurations
- **Admin System**: `src/app/admin/` - Complete administrative dashboard

## Data Models and APIs

### Data Models

**Primary Database Schema**: See `database/schema.sql` (Complete PostgreSQL schema)

**Key Lesson-Related Tables:**
- **courses** - Course metadata and configuration
- **lessons** - Lesson content, video URLs, materials
- **progress** - User progress tracking with detailed metrics
- **exercises** - Practical assignments and submissions
- **quizzes** - Assessment questions and results
- **enrollments** - User-course relationships

### API Specifications

**Next.js API Routes** (`src/app/api/`):
- **Lesson Management**: `/api/lessons/[id]/complete` - Mark lesson completion
- **Admin Endpoints**: `/api/admin/courses`, `/api/admin/lessons` - CRUD operations
- **Progress Tracking**: Various progress update endpoints
- **Video Security**: `/api/secure-video/` - Protected video access

**Authentication**: JWT via Supabase Auth with middleware-based protection

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Lesson Page Dual Implementation**: 
   - `page.tsx` (production) vs `page-redesigned.tsx` (development)
   - Integration component bridges data formats between old/new systems
   - **Location**: `src/app/course/[slug]/lesson/[lessonSlug]/`

2. **PDF Performance Issues**: 
   - Known blank space rendering issues documented in `PDF_BLANK_SPACE_FIX.md`
   - Multiple PDF components: `PDFSection.tsx`, `PDFSectionEnhanced.tsx`, `PDFSection.tsx.backup`
   - Performance monitoring needed via `usePDFPerformance.ts`

3. **Component Architecture Migration**:
   - Mixed patterns: Old page structure vs new modular components
   - Data transformation layer in `LessonPageIntegration.tsx` adds complexity
   - Multiple test pages indicate ongoing validation needs

4. **Progress Calculation Complexity**:
   - Complex progress algorithms in `lessonProgressUtils.ts`
   - Multiple progress hooks for different aspects (video, PDF, quiz, overall)
   - Needs consolidation and optimization

### Workarounds and Gotchas

- **Lesson Navigation**: Integration component handles both old and new exit patterns
- **Progress Data**: Complex transformation from database format to component format in `LessonPageIntegration.tsx`
- **Test Pages**: Multiple `/test-*` routes for component validation - these are REQUIRED for development
- **PDF Rendering**: Known issues with blank space - use enhanced version with performance monitoring
- **Video Players**: Multiple implementations (Mux, React Player) - Mux preferred for production

## Integration Points and External Dependencies

### External Services

| Service | Purpose | Integration Type | Key Files |
|---------|---------|------------------|-----------|
| Supabase | Database + Auth + Storage | SDK + REST | `src/lib/supabase/` |
| Mux | Video Streaming | React Component | `@mux/mux-player-react` |
| Sentry | Error Tracking | Next.js Plugin | `sentry.*.config.ts` |
| PDF.js | Document Rendering | WebAssembly | `public/pdf.worker.min.mjs` |
| Netlify | Deployment (Backup) | Build Plugin | `netlify.toml` |

### Internal Integration Points

- **Authentication Flow**: Supabase Auth → Next.js Middleware → Role-based routing
- **Lesson Data Flow**: Database → Integration Component → Redesigned UI Components
- **Progress Tracking**: Real-time updates via Supabase Realtime subscriptions
- **File Upload**: Supabase Storage for exercise submissions and course materials

## Development and Deployment

### Local Development Setup

1. **Environment Variables**: Copy `.env.example` to `.env.local` with Supabase keys
2. **Database Setup**: Run `database/schema.sql` on Supabase project
3. **Development Server**: `npm run dev` (Next.js on port 3000)
4. **Known Issues**: 
   - Middleware requires restart when auth config changes
   - Test pages require manual navigation (`/test-lesson-redesigned`)

### Build and Deployment Process

- **Build Command**: `npm run build` (MANUAL - user must run)
- **Development**: `npm run dev` (MANUAL - user must run) 
- **Testing**: `npm run test` (Jest), `npm run test:e2e` (Playwright)
- **Environments**: Development only currently, production deployment pending

### Testing Infrastructure

- **Unit Tests**: Jest with React Testing Library
- **E2E Tests**: Playwright configured for auth flows
- **Component Testing**: Multiple test pages in `/test-*` routes
- **Manual Testing**: Primary QA method for lesson components

## Enhancement Focus - Lesson System Redesign

### Current Implementation Status

**Active Development Components:**
- **LessonPageRedesigned.tsx** - New modular lesson interface (90% complete)
- **LessonPageIntegration.tsx** - Data transformation bridge (functional)
- **VideoSection.tsx** - Enhanced video player with performance monitoring
- **PDFSection.tsx** - PDF viewer with blank space fixes applied
- **QuizSection.tsx** - Interactive quiz interface with real-time scoring
- **CompletionSection.tsx** - Lesson completion workflow with celebration

### Files That Will Need Modification

Based on the lesson redesign requirements:
- `src/app/course/[slug]/lesson/[lessonSlug]/page.tsx` - Switch to use redesigned interface
- `src/components/lesson/LessonPageIntegration.tsx` - Optimize data transformation
- `src/hooks/useLessonProgress.ts` - Performance optimization for progress calculations
- `src/utils/lessonProgressUtils.ts` - Consolidate progress calculation logic

### New Files/Modules Completed

- `src/components/lesson/LessonPageRedesigned.tsx` - New modular lesson interface
- `src/components/lesson/completion/` - Completion workflow components
- `src/hooks/useLessonPerformance.ts` - Performance monitoring
- `src/test-utils/pdf-test-setup.ts` - PDF testing utilities

### Integration Considerations

- **Data Bridge**: Integration component handles transformation between database and UI formats
- **Performance Monitoring**: Real-time performance tracking via custom hooks
- **Responsive Design**: Lesson header system with mobile-first approach
- **Progress Persistence**: Real-time progress updates to Supabase with optimistic UI updates

## Performance and Scalability Notes

### Current Performance Patterns

- **Server Components**: Next.js App Router with RSC for optimal performance
- **Custom Hooks**: Specialized hooks for performance monitoring (`useLessonPerformance`)
- **Progress Optimization**: Debounced progress updates to reduce database calls
- **PDF Performance**: Enhanced PDF section with blank space fix and performance monitoring

### Scalability Considerations

- **Database**: Supabase with Row Level Security policies for multi-tenant isolation
- **Real-time**: Supabase Realtime for progress synchronization across devices
- **Caching**: Next.js ISR for course catalog, dynamic for lesson content
- **CDN**: Static assets via Next.js optimization, video via Mux CDN

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Development
npm run dev             # Start Next.js development server (MANUAL)
npm run build          # Production build (MANUAL) 
npm run lint           # ESLint + TypeScript checking
npm run test           # Jest unit tests
npm run test:watch     # Jest in watch mode
npm run test:e2e       # Playwright E2E tests
npm run test:auth      # Authentication flow testing

# Analysis and Debugging
npm run analyze        # Bundle analyzer for optimization
```

### Critical Development Notes

- **Build Process**: User must manually run `npm run build` - never execute automatically
- **Development Server**: User must manually run `npm run dev` - never execute automatically  
- **Test Pages**: Access via `/test-lesson-redesigned`, `/test-completion-section` for component validation
- **PDF Issues**: Use enhanced PDF section with performance monitoring for blank space fixes

### Debugging and Troubleshooting

- **Logs**: Next.js console output + Sentry error tracking
- **Debug Mode**: Multiple debug pages (`/debug-auth`, `/debug-middleware`)
- **Common Issues**: See `MIDDLEWARE_TROUBLESHOOTING.md` for auth issues
- **Performance**: Use lesson performance hooks for optimization insights

---

## 📋 Documentation Complete

This brownfield architecture document captures the **ACTUAL state** of your educational platform with focus on the ongoing lesson system redesign. Key highlights:

### Current Status
- **Advanced brownfield platform** in Phase 2 development
- **Lesson redesign system** 90% complete with modular components
- **Dual implementation** (old production + new redesigned interfaces)
- **Data integration layer** bridging old and new architectures

### Critical Areas for AI Agents
- **Lesson Components**: Focus on `src/components/lesson/` directory
- **Integration Pattern**: Use `LessonPageIntegration.tsx` as data bridge
- **Test Validation**: Use `/test-*` pages for component testing
- **Performance Monitoring**: Specialized hooks for optimization

### Technical Debt Priorities
1. **PDF Performance Issues** - documented with fixes applied
2. **Progress Calculation Complexity** - needs consolidation
3. **Dual Implementation** - migration to redesigned interface needed

The document provides comprehensive guidance for AI agents to understand, navigate, and enhance your lesson system while respecting existing constraints and technical debt.