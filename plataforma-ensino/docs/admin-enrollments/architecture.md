# Admin Enrollments System Architecture

## System Overview

The Admin Enrollments system follows a modern full-stack architecture with clear separation of concerns, utilizing Next.js 14 with TypeScript for type safety and Supabase for backend services.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for full type safety
- **State Management**: React hooks with local state and Zustand for global state
- **UI Library**: Custom components with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Heroicons for consistent iconography

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with custom middleware
- **Validation**: Zod for runtime type checking
- **Error Handling**: Structured error responses with detailed logging

### Infrastructure
- **Deployment**: Vercel/Netlify for frontend, Supabase for backend
- **Security**: RLS policies, admin role verification, input sanitization
- **Monitoring**: Sentry for error tracking and performance monitoring

## Data Flow Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL    ┌─────────────────┐
│   Admin UI      │────────────────▶│   API Routes    │──────────▶│   Database      │
│   (React/TS)    │                 │   (Next.js)     │           │   (Supabase)    │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
        │                                    │                            │
        ▼                                    ▼                            ▼
┌─────────────────┐                 ┌─────────────────┐           ┌─────────────────┐
│ Form Validation │                 │ Business Logic  │           │ RLS Policies    │
│ (Zod Schemas)   │                 │ & Auth Checks   │           │ & Triggers      │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
```

## Component Architecture

### High-Level Component Hierarchy

```
AdminEnrollmentsPage
├── EnrollmentsManagementLazy
    └── EnrollmentsManagement
        ├── EnrollmentsList (Table Interface)
        ├── EnrollmentForm (Modal)
        │   ├── UserSelector
        │   ├── CourseSelector
        │   └── SchedulingSection
        │       ├── TeacherSelector
        │       └── SimplifiedWeeklySchedule
        └── ProgressModal
            └── LessonProgressList
```

### Component Responsibilities

#### EnrollmentsManagement (Main Container)
- **Purpose**: Central state management and coordination
- **Key Features**:
  - Enrollment list display with filtering/search
  - Status management (active, completed, cancelled)
  - Progress tracking integration
  - Modal state management

#### EnrollmentForm (Modal Interface)
- **Purpose**: Create and edit enrollment records
- **Key Features**:
  - Dual-mode operation (online/in-person)
  - Real-time form validation
  - Dynamic teacher/schedule selection
  - Enhanced error handling with toast notifications

#### SchedulingSection (In-person Enrollment)
- **Purpose**: Handle complex scheduling for in-person courses
- **Key Features**:
  - Teacher availability visualization
  - Time slot selection with conflict detection
  - Support for single/double weekly sessions
  - Preview mode to prevent accidental submissions

## Database Schema Integration

### Core Tables

#### enrollments
```sql
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    access_until TIMESTAMP WITH TIME ZONE,
    status enrollment_status DEFAULT 'active',
    modality TEXT DEFAULT 'online', -- 'online' or 'in-person'
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### student_schedules
```sql
CREATE TABLE public.student_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.users(id), -- Note: references users.id
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### teacher_availability
```sql
CREATE TABLE public.teacher_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.instructors(id), -- Note: references instructors.id
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Critical ID Mapping

**IMPORTANT**: The system uses different ID references for different purposes:

- **student_schedules.instructor_id** → `users.id` (for the instructor's user account)
- **teacher_availability.teacher_id** → `instructors.id` (for the instructor's profile)

This mapping was a key source of the recent instructor validation bug.

## API Architecture

### Endpoint Structure

```
/api/admin/enrollments/
├── GET    / (List enrollments with pagination/filtering)
├── POST   / (Create new enrollment)
├── PUT    /[id] (Update existing enrollment)
└── DELETE /[id] (Remove enrollment)

/api/admin/progress/
├── GET    / (Get progress for enrollment)
├── POST   / (Update lesson progress)
└── PUT    /[id] (Bulk progress updates)
```

### Request/Response Patterns

#### Enhanced API Format (Preferred)
```typescript
// POST /api/admin/enrollments
{
  student_id: string,
  course_id: string,
  start_date: string, // YYYY-MM-DD
  modality: 'online' | 'in-person',
  schedules?: Array<{
    instructor_id: string, // users.id
    day_of_week: number,   // 1-7
    start_time: string,    // HH:MM:SS
    end_time: string       // HH:MM:SS
  }>
}
```

#### Legacy Format (Backward Compatibility)
```typescript
// POST /api/admin/enrollments (legacy)
{
  user_id: string,
  course_id: string,
  teacher_id?: string,
  is_in_person: boolean,
  has_two_classes_per_week: boolean,
  schedule_slot_1?: string,
  schedule_slot_2?: string
}
```

## Validation Architecture

### Zod Schema Validation

The system uses layered validation:

1. **Frontend Validation**: Real-time form validation with immediate feedback
2. **API Validation**: Server-side validation with detailed error responses
3. **Database Constraints**: Final validation layer with PostgreSQL constraints

### Example Validation Flow

```typescript
// Frontend (EnrollmentForm)
const { isValid, errors } = validateEnrollmentForm(formData)

// API Layer (route.ts)
const validatedData = enhancedEnrollmentSchema.parse(body)

// Database Layer (PostgreSQL)
-- CONSTRAINT enrollments_progress_check CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
```

## Error Handling Strategy

### Multi-Level Error Handling

1. **Form Level**: Immediate validation feedback with field-specific errors
2. **API Level**: Structured error responses with actionable messages
3. **Database Level**: Constraint violations with rollback capabilities
4. **UI Level**: Toast notifications with user-friendly error messages

### Error Response Format

```typescript
// API Error Response
{
  error: string,           // User-friendly message
  details?: {              // Technical details
    field_errors?: object,
    validation_errors?: array,
    missing_instructor_ids?: string[],
    invalid_instructors?: object[]
  },
  message?: string         // Additional context
}
```

## Security Architecture

### Authentication & Authorization

- **Middleware Protection**: Routes protected at the Next.js middleware level
- **API-Level Checks**: `requireAdmin()` function for server-side validation
- **RLS Policies**: Database-level security with Supabase Row Level Security

### Data Validation & Sanitization

- **Input Sanitization**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries through Supabase client
- **XSS Protection**: React's built-in XSS protection + additional sanitization

## Performance Considerations

### Frontend Optimization

- **Lazy Loading**: Components loaded on-demand with React.lazy()
- **Debounced Search**: User/course search with 300ms debounce
- **Optimistic Updates**: UI updates before server confirmation
- **Memoization**: React.memo and useMemo for expensive calculations

### Backend Optimization

- **Database Indexing**: Strategic indexes on frequently queried columns
- **Connection Pooling**: Supabase handles connection management
- **Caching Strategy**: Browser caching for static data, no server-side caching for admin data

### Database Optimization

```sql
-- Strategic indexes for performance
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_student_schedules_enrollment_id ON public.student_schedules(enrollment_id);
```

## Monitoring & Observability

### Error Tracking

- **Sentry Integration**: Comprehensive error tracking and performance monitoring
- **Console Logging**: Detailed logging for development and debugging
- **Database Logs**: Supabase provides query and error logging

### Performance Monitoring

- **React DevTools**: Component performance profiling
- **Next.js Analytics**: Build and runtime performance metrics
- **Database Metrics**: Query performance through Supabase dashboard

## Scalability Considerations

### Current Limitations

- **Single Region**: Supabase deployment in single region
- **Client-Side Pagination**: Frontend handles pagination logic
- **Synchronous Processing**: All operations are synchronous

### Future Scalability Improvements

- **Server-Side Pagination**: Move pagination logic to API layer
- **Background Processing**: Async enrollment processing for bulk operations
- **Caching Layer**: Redis cache for frequently accessed data
- **CDN Integration**: Static asset optimization

## Integration Points

### External Systems

- **Supabase Auth**: User authentication and session management
- **Email Service**: Future integration for enrollment notifications
- **Calendar Systems**: Future integration with external calendar services

### Internal Systems

- **Course Management**: Integration with course creation and management
- **User Management**: Tight integration with user profiles and roles
- **Progress Tracking**: Integration with lesson completion system
- **Certificate System**: Future integration with certificate generation

This architecture provides a solid foundation for the enrollment system while maintaining flexibility for future enhancements and scalability requirements.