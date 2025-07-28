# Admin Enrollments System Documentation

## Overview

The Admin Enrollments system is a comprehensive enrollment management interface that allows administrators to create, manage, and monitor student enrollments across the educational platform. It supports both online and in-person course enrollments with sophisticated scheduling capabilities.

## Key Features

- **Dual Enrollment Types**: Online and in-person course enrollment support
- **Advanced Scheduling**: Teacher selection and time slot management for in-person courses
- **Progress Management**: Individual lesson progress tracking and modification
- **Real-time Validation**: Form validation with detailed error messages
- **Enhanced UI/UX**: Modern React interface with TypeScript support
- **API Integration**: RESTful API endpoints with comprehensive error handling

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Enrollments                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React/TypeScript)                               │
│  ├── EnrollmentsManagement.tsx (Main Interface)            │
│  ├── EnrollmentForm.tsx (Create/Edit Forms)                │
│  └── SchedulingSection.tsx (In-person Scheduling)          │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes)                            │
│  ├── /api/admin/enrollments (CRUD Operations)              │
│  ├── /api/admin/progress (Progress Management)             │
│  └── /api/calculate-end-date (Date Calculations)           │
├─────────────────────────────────────────────────────────────┤
│  Database (Supabase PostgreSQL)                            │
│  ├── enrollments (Main enrollment data)                    │
│  ├── student_schedules (In-person class schedules)         │
│  ├── progress (Lesson completion tracking)                 │
│  └── teacher_availability (Instructor availability)        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Accessing the System

1. Navigate to `/admin/enrollments` (requires admin role)
2. The system will display a list of all current enrollments
3. Use the "Adicionar Matrícula" button to create new enrollments

### Creating Enrollments

**Online Enrollment:**
1. Select user and course
2. Leave "Curso Presencial" unchecked
3. Set optional access dates
4. Submit form

**In-person Enrollment:**
1. Select user and course
2. Check "Curso Presencial"
3. Select teacher from available instructors
4. Choose time slots from teacher's availability
5. Optionally enable "Duas aulas por semana" for two weekly sessions
6. Submit form

## Directory Structure

```
docs/admin-enrollments/
├── README.md                    # This overview document
├── architecture.md              # Technical architecture details
├── components.md               # Component breakdown and relationships
├── api-flows.md                # API endpoints and data flows
└── troubleshooting.md          # Common issues and solutions
```

## Recent Improvements

### Instructor Validation Fix (January 2025)
- **Issue**: Enrollment creation failed due to instructor ID mapping confusion
- **Solution**: Clarified distinction between `instructors.id` and `users.id` in API validation
- **Impact**: Resolved "instructor not found" errors for valid instructors like Maria Eduarda

### Enhanced Form Validation
- **Zod Integration**: Comprehensive form validation with detailed error messages
- **Real-time Feedback**: Instant validation feedback during form completion
- **Schedule Validation**: Proper validation for in-person scheduling requirements

### Preview Mode Implementation
- **Non-destructive Selection**: Schedule slots can be selected without auto-submission
- **Visual Feedback**: Clear indication of selected slots before final submission
- **Error Prevention**: Prevents accidental enrollment creation during schedule selection

## Key Components

- **EnrollmentsManagement**: Main dashboard interface
- **EnrollmentForm**: Modal form for creating/editing enrollments
- **SchedulingSection**: Advanced scheduling interface for in-person courses
- **SimplifiedWeeklySchedule**: Teacher availability visualization
- **TeacherSelector**: Instructor selection with course-specific filtering

## Database Integration

The system integrates with multiple database tables:

- `enrollments`: Core enrollment data
- `users`: Student and instructor information
- `courses`: Course details and metadata
- `instructors`: Instructor profiles and qualifications
- `student_schedules`: In-person class scheduling
- `teacher_availability`: Instructor availability slots
- `progress`: Individual lesson completion tracking

## Security Features

- **Admin-only Access**: Requires admin role verification
- **Row Level Security**: Database-level access controls
- **Input Validation**: Comprehensive data validation at API level
- **Error Logging**: Detailed error tracking and reporting

## Next Steps

1. Review the [Architecture Documentation](./architecture.md) for technical details
2. Examine [Component Relationships](./components.md) for UI structure
3. Study [API Flows](./api-flows.md) for backend integration
4. Consult [Troubleshooting Guide](./troubleshooting.md) for common issues

## Support

For technical support or questions about the enrollment system:
- Review the troubleshooting guide for common solutions
- Check the API documentation for endpoint specifications
- Examine component documentation for UI implementation details