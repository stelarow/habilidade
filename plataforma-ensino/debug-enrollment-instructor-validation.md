# Debug Guide: Instructor Validation Error Fix

## Problem Fixed
The instructor validation error "Um ou mais instrutores não foram encontrados ou não têm permissão para lecionar" has been comprehensively addressed with enhanced validation and error reporting.

## Changes Made

### 1. Enhanced API Validation (`/src/app/api/admin/enrollments/route.ts`)

**Multi-step validation process:**
- Step 1: Check if user IDs exist in `users` table
- Step 2: Check if users have `instructor` profiles in `instructors` table
- Step 3: Validate user roles (must be 'instructor' or 'admin')

**Detailed error messages:**
- Missing users: Lists specific user IDs not found
- Missing instructor profiles: Lists users without instructor profiles
- Invalid roles: Lists users with wrong roles

### 2. Enhanced Error Handling (`/src/components/admin/EnrollmentForm.tsx`)

**Specific error handling for:**
- `usuários não foram encontrados no sistema`
- `não possuem perfil de instrutor`
- `não têm permissão para lecionar`

### 3. Enhanced Debug Logging

**Added comprehensive logging in:**
- `TeacherSelector.tsx`: Teacher data mapping
- `SchedulingSection.tsx`: Teacher selection flow
- API route: Multi-step validation results

## Database Requirements

Ensure these tables and relationships exist:

```sql
-- Users table with role
users (id, role, full_name, email)

-- Instructors table linked to users
instructors (id, user_id, bio, rating, expertise, max_students_per_class)

-- Teacher availability (uses instructor.id)
teacher_availability (id, teacher_id, day_of_week, start_time, end_time, max_students, is_active)

-- Student schedules (uses user.id for instructor_id)
student_schedules (id, enrollment_id, instructor_id, day_of_week, start_time, end_time)
```

## ID Mapping Chain

**Critical ID flow:**
1. `TeacherSelector` provides both `instructor.id` and `instructor.user_id`
2. `SchedulingSection` passes `teacher.userId` (which is `user.id`) to form
3. `SimplifiedWeeklySchedule` uses `teacherUserId` for slot formatting
4. `enrollmentValidation` transforms slots using `teacherUserId`
5. API receives `instructor_id` in schedules (actually `user.id`)
6. API validates against `users` table and `instructors` table

## Testing Steps

### 1. Verify Database Seeding
```sql
-- Check if instructors exist and have proper relationships
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    u.role,
    i.id as instructor_id,
    i.user_id as instructor_user_id
FROM users u 
LEFT JOIN instructors i ON i.user_id = u.id 
WHERE u.role IN ('instructor', 'admin');
```

### 2. Test Enrollment Flow
1. Open admin panel → Enrollments
2. Click "Adicionar Matrícula"
3. Select user and course
4. Check "Curso Presencial"
5. Select a teacher from the list
6. Select schedule slots
7. Submit enrollment

### 3. Check Console Logs

**Expected logs during teacher selection:**
```
TeacherSelector - Teacher data mapping: {instructorId: "...", userId: "...", name: "...", email: "..."}
SchedulingSection - Teacher selected: {instructorId: "...", userId: "...", name: "...", willPassToParent: "..."}
```

**Expected logs during API validation:**
```
Enrollment API - Validating instructor IDs (as user_ids): ["..."]
Enrollment API - Found users: [...]
Enrollment API - Found instructor profiles: [...]
Enrollment API - Validation results: {...}
Enrollment API - All instructor users validated successfully
```

## Common Issues and Solutions

### Issue 1: User not found
**Error:** "Um ou mais usuários não foram encontrados no sistema"
**Solution:** Check if the user ID exists in the `users` table

### Issue 2: Missing instructor profile
**Error:** "Um ou mais usuários não possuem perfil de instrutor"
**Solution:** Create instructor profile: `INSERT INTO instructors (user_id, ...) VALUES (...)`

### Issue 3: Wrong user role
**Error:** "Um ou mais usuários não têm permissão para lecionar"
**Solution:** Update user role: `UPDATE users SET role = 'instructor' WHERE id = '...'`

### Issue 4: No teacher availability data
**Warning:** TeacherSelector shows teachers but no schedules available
**Solution:** Add teacher availability: `INSERT INTO teacher_availability (...) VALUES (...)`

## Database Seeding Commands

```sql
-- Ensure Maria Eduarda has proper instructor setup
INSERT INTO instructors (id, user_id, bio, expertise, rating, max_students_per_class) 
VALUES (
    '3834f9e6-2fd9-447f-9d74-757cdd6b6e44',
    '355f9ed5-c838-4c66-8671-2cfbf87121fa',
    'Instrutora experiente em desenvolvimento web',
    ARRAY['React', 'JavaScript', 'TypeScript'],
    5.0,
    10
) ON CONFLICT (user_id) DO UPDATE SET
    bio = EXCLUDED.bio,
    expertise = EXCLUDED.expertise,
    rating = EXCLUDED.rating,
    max_students_per_class = EXCLUDED.max_students_per_class;

-- Ensure user has correct role
UPDATE users 
SET role = 'instructor' 
WHERE id = '355f9ed5-c838-4c66-8671-2cfbf87121fa';

-- Add some teacher availability
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, max_students, is_active)
VALUES 
    ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 1, '09:00:00', '11:00:00', 3, true),
    ('3834f9e6-2fd9-447f-9d74-757cdd6b6e44', 3, '14:00:00', '16:00:00', 3, true)
ON CONFLICT DO NOTHING;
```

## Verification Queries

```sql
-- Verify instructor data integrity
SELECT 
    'Instructor validation check' as test,
    COUNT(*) as total_instructors,
    COUNT(CASE WHEN u.role IN ('instructor', 'admin') THEN 1 END) as valid_role_count,
    COUNT(CASE WHEN ta.teacher_id IS NOT NULL THEN 1 END) as has_availability_count
FROM instructors i
JOIN users u ON u.id = i.user_id
LEFT JOIN teacher_availability ta ON ta.teacher_id = i.id;

-- Check for orphaned records
SELECT 'Orphaned instructor profiles' as issue, COUNT(*) as count
FROM instructors i
LEFT JOIN users u ON u.id = i.user_id
WHERE u.id IS NULL;

SELECT 'Users with instructor role but no profile' as issue, COUNT(*) as count
FROM users u
LEFT JOIN instructors i ON i.user_id = u.id
WHERE u.role = 'instructor' AND i.id IS NULL;
```

The comprehensive fix addresses all aspects of the instructor validation chain and provides detailed error reporting for quick issue resolution.