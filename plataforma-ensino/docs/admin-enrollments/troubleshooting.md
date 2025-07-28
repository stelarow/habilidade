# Admin Enrollments Troubleshooting Guide

## Common Issues and Solutions

This guide covers the most frequently encountered issues in the admin enrollments system, their root causes, and step-by-step solutions.

## Critical Issues

### 1. Instructor Validation Errors

#### Issue: "Instructor not found" or "Invalid instructor ID"

**Symptoms:**
- Enrollment creation fails with instructor validation errors
- Error message: "Um ou mais instrutores não foram encontrados"
- Console shows instructor ID mismatches

**Root Cause:**
The system uses two different ID types for instructors:
- `instructors.id` - Primary key in instructors table
- `users.id` - Foreign key referencing the instructor's user account

**Critical Mapping:**
- `teacher_availability.teacher_id` → `instructors.id`
- `student_schedules.instructor_id` → `users.id`

**Recent Fix Applied (January 2025):**
```typescript
// Fixed in /api/admin/enrollments/route.ts
// The API now correctly validates instructor_id as users.id
const { data: instructorUsers } = await supabase
  .from('users')
  .select('id, role, full_name, email')
  .in('id', instructorIds)  // instructorIds are actually user_ids
  .in('role', ['admin', 'instructor'])
```

**Solution Steps:**
1. **Verify Instructor Data:**
   ```sql
   -- Check instructor profile exists
   SELECT i.id as instructor_id, i.user_id, u.full_name, u.role
   FROM instructors i
   JOIN users u ON i.user_id = u.id
   WHERE u.full_name = 'Maria Eduarda';
   ```

2. **Validate ID Mapping:**
   ```typescript
   // In TeacherSelector component, ensure both IDs are provided
   const teacher = {
     id: instructor.id,        // For availability queries
     userId: instructor.user_id // For schedule creation
   }
   ```

3. **Debug API Request:**
   ```bash
   # Check the actual request payload
   POST /api/admin/enrollments
   {
     "schedules": [{
       "instructor_id": "355f9ed5-c838-4c66-8671-2cfbf87121fa" // This should be users.id
     }]
   }
   ```

**Prevention:**
- Always use `instructor.user_id` when creating student schedules
- Use `instructor.id` only for teacher availability queries
- Add validation in TeacherSelector to ensure both IDs are present

---

### 2. Schedule Slot Format Errors

#### Issue: Invalid schedule slot format causing parsing failures

**Symptoms:**
- Schedule slots not parsing correctly
- Error: "Invalid schedule slot format"
- In-person enrollments fail during submission

**Root Cause:**
Schedule slots use a specific format: `"teacherUserId:dayOfWeek:startTime-endTime"`

**Correct Format Examples:**
```
"355f9ed5-c838-4c66-8671-2cfbf87121fa:1:09:00-10:00"  ✅ Correct
"355f9ed5-c838-4c66-8671-2cfbf87121fa:Monday:9-10"    ❌ Incorrect
"teacher123:1:09:00-10:00"                            ❌ Incorrect
```

**Solution Steps:**
1. **Verify Slot Format:**
   ```typescript
   // In SimplifiedWeeklySchedule component
   const formatSlot = (teacherUserId: string, day: number, startTime: string, endTime: string) => {
     return `${teacherUserId}:${day}:${startTime}-${endTime}`
   }
   
   // Example: "355f9ed5-c838-4c66-8671-2cfbf87121fa:1:09:00-10:00"
   ```

2. **Debug Slot Parsing:**
   ```typescript
   // In enrollmentValidation.ts
   console.log('parseScheduleSlot - Input:', slotString)
   const parts = slotString.split(':')
   console.log('parseScheduleSlot - Parts:', parts)
   ```

3. **Validate Time Format:**
   ```typescript
   // Ensure times are in HH:MM format
   const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
   if (!timeFormat.test(startTime)) {
     console.error('Invalid time format:', startTime)
   }
   ```

**Prevention:**
- Use consistent time formatting throughout the application
- Validate slot format before saving to state
- Add unit tests for slot parsing functions

---

### 3. Form Validation Failures

#### Issue: Form submission blocked by validation errors

**Symptoms:**
- "Adicionar Matrícula" button disabled
- Red validation error messages
- Form submission prevented

**Common Validation Issues:**

**Missing Required Fields:**
```typescript
// Check required fields based on enrollment type
if (formData.is_in_person) {
  // Required for in-person
  - user_id ✅
  - course_id ✅
  - teacher_id ❌ Missing
  - schedule_slot_1 ❌ Missing
}
```

**Solution Steps:**
1. **Debug Form State:**
   ```typescript
   // In EnrollmentForm component
   console.log('Form validation state:', {
     formData,
     errors,
     localSelectedSlots,
     formattedSelectedSlots
   })
   ```

2. **Check Validation Logic:**
   ```typescript
   // In enrollmentValidation.ts
   const { isValid, errors } = validateEnrollmentForm(formData)
   console.log('Validation result:', { isValid, errors })
   ```

3. **Verify Button Enable Logic:**
   ```typescript
   // Button should be enabled when:
   const isFormValid = selectedUser && 
                      selectedCourse && 
                      (!formData.is_in_person || (
                        formData.teacher_id && 
                        localSelectedSlots.length > 0 &&
                        (!formData.has_two_classes_per_week || localSelectedSlots.length === 2)
                      ))
   ```

**Prevention:**
- Add comprehensive form validation tests
- Provide clear validation feedback messages
- Use TypeScript for compile-time validation

---

## Database Issues

### 4. Foreign Key Constraint Violations

#### Issue: Database constraint errors during enrollment creation

**Symptoms:**
- Error: "violates foreign key constraint"
- Enrollment creation fails after form submission
- Database rollback occurs

**Common Constraints:**
- `enrollments_user_id_fkey` - Invalid user ID
- `enrollments_course_id_fkey` - Invalid course ID
- `student_schedules_instructor_id_fkey` - Invalid instructor user ID

**Solution Steps:**
1. **Verify Referenced Records:**
   ```sql
   -- Check user exists
   SELECT id, full_name FROM users WHERE id = 'user-id-here';
   
   -- Check course exists and is published
   SELECT id, title, is_published FROM courses WHERE id = 'course-id-here';
   
   -- Check instructor user exists with correct role
   SELECT id, full_name, role FROM users 
   WHERE id = 'instructor-user-id-here' AND role IN ('admin', 'instructor');
   ```

2. **Validate Data Before Insert:**
   ```typescript
   // In API route
   const { data: userExists } = await supabase
     .from('users')
     .select('id')
     .eq('id', userId)
     .single()
   
   if (!userExists) {
     return NextResponse.json({ error: 'User not found' }, { status: 400 })
   }
   ```

3. **Check Database Logs:**
   ```bash
   # In Supabase dashboard, check logs for detailed error messages
   # Look for constraint violation details
   ```

**Prevention:**
- Always validate foreign keys before database operations
- Use transactions to ensure data consistency
- Implement proper error handling and rollback logic

---

### 5. Permission and RLS Issues

#### Issue: Row Level Security blocking admin operations

**Symptoms:**
- "Permission denied" errors
- Data not visible to admin users
- API calls returning empty results

**Common RLS Issues:**
- Admin user role not properly set
- RLS policies not covering admin operations
- Session authentication issues

**Solution Steps:**
1. **Verify Admin Role:**
   ```sql
   -- Check user role in database
   SELECT id, email, role FROM users WHERE email = 'admin@example.com';
   ```

2. **Test RLS Policies:**
   ```sql
   -- Test admin access to enrollments
   SELECT * FROM enrollments LIMIT 1;
   
   -- If empty, check RLS policy
   SELECT tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'enrollments';
   ```

3. **Verify Session:**
   ```typescript
   // In API route
   const { user, profile } = await requireAdmin()
   console.log('Admin session:', { user: user?.id, role: profile?.role })
   ```

**Prevention:**
- Regularly audit RLS policies
- Test admin functionality with different user roles
- Implement proper session management

---

## Performance Issues

### 6. Slow Enrollment List Loading

#### Issue: Long loading times for enrollment list

**Symptoms:**
- Page takes several seconds to load
- Large data sets cause browser slowdown
- Poor user experience with loading states

**Causes:**
- Large number of enrollments without pagination
- Heavy database queries with multiple joins
- Inefficient React rendering

**Solution Steps:**
1. **Implement Pagination:**
   ```typescript
   // In EnrollmentsManagement component
   const [currentPage, setCurrentPage] = useState(1)
   const [pageSize] = useState(20)
   
   const fetchEnrollments = async (page: number) => {
     const response = await fetch(`/api/admin/enrollments?page=${page}&limit=${pageSize}`)
     return response.json()
   }
   ```

2. **Optimize Database Queries:**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_enrollments_status_created_at 
   ON enrollments(status, created_at DESC);
   
   CREATE INDEX IF NOT EXISTS idx_enrollments_user_course 
   ON enrollments(user_id, course_id);
   ```

3. **Add Memoization:**
   ```typescript
   // Memoize expensive computations
   const filteredEnrollments = useMemo(() => {
     return enrollments.filter(enrollment => {
       // Filter logic here
     })
   }, [enrollments, searchTerm, statusFilter])
   ```

**Prevention:**
- Always implement pagination for large data sets
- Use database indexes on frequently queried columns
- Implement proper loading states and skeleton screens

---

### 7. Memory Leaks in Components

#### Issue: Memory usage increasing over time

**Symptoms:**
- Browser becoming slower over time
- High memory usage in DevTools
- Potential browser crashes

**Causes:**
- Event listeners not cleaned up
- Timers not cleared
- Subscriptions not unsubscribed

**Solution Steps:**
1. **Clean Up Event Listeners:**
   ```typescript
   useEffect(() => {
     const handleResize = () => {
       // Handler logic
     }
     
     window.addEventListener('resize', handleResize)
     
     return () => {
       window.removeEventListener('resize', handleResize)
     }
   }, [])
   ```

2. **Clear Timers:**
   ```typescript
   useEffect(() => {
     const timeoutId = setTimeout(() => {
       // Timer logic
     }, 300)
     
     return () => clearTimeout(timeoutId)
   }, [dependency])
   ```

3. **Cancel Async Operations:**
   ```typescript
   useEffect(() => {
     let cancelled = false
     
     const fetchData = async () => {
       const result = await api.getData()
       if (!cancelled) {
         setData(result)
       }
     }
     
     fetchData()
     
     return () => {
       cancelled = true
     }
   }, [])
   ```

**Prevention:**
- Always clean up side effects in useEffect
- Use AbortController for cancelling fetch requests
- Monitor memory usage during development

---

## UI/UX Issues

### 8. Modal and Form State Issues

#### Issue: Modal state persisting incorrectly

**Symptoms:**
- Previous form data showing in new enrollment
- Modal not closing properly
- State inconsistencies between form instances

**Solution Steps:**
1. **Reset Form State:**
   ```typescript
   const handleCancel = () => {
     setFormData(defaultFormData)
     setErrors({})
     setLocalSelectedSlots([])
     setShowEnrollmentForm(false)
   }
   ```

2. **Use Keys for Modal Remounting:**
   ```typescript
   // Force component remount when mode changes
   <EnrollmentForm
     key={`${enrollmentFormMode}-${selectedEnrollment?.id || 'new'}`}
     mode={enrollmentFormMode}
     // Other props
   />
   ```

3. **Clear Dependent State:**
   ```typescript
   // When changing enrollment type, clear related fields
   const handleEnrollmentTypeChange = (isInPerson: boolean) => {
     setFormData(prev => ({
       ...prev,
       is_in_person: isInPerson,
       teacher_id: isInPerson ? prev.teacher_id : '',
       schedule_slot_1: isInPerson ? prev.schedule_slot_1 : '',
       schedule_slot_2: isInPerson ? prev.schedule_slot_2 : ''
     }))
   }
   ```

**Prevention:**
- Always reset form state when opening new modals
- Use proper state management patterns
- Test modal behavior thoroughly

---

## Debugging Tools and Techniques

### Browser Developer Tools

**Console Debugging:**
```typescript
// Add debug logs to track data flow
console.log('EnrollmentForm - Form data:', formData)
console.log('EnrollmentForm - Validation errors:', errors)
console.log('EnrollmentForm - Selected slots:', localSelectedSlots)
```

**Network Tab:**
- Monitor API calls for errors
- Check request/response payloads
- Verify authentication headers

**React DevTools:**
- Inspect component props and state
- Track state changes over time
- Profile component performance

### Database Debugging

**Supabase Dashboard:**
- Check real-time logs
- Monitor query performance
- Verify RLS policy execution

**SQL Console:**
```sql
-- Debug enrollment relationships
SELECT 
  e.id,
  e.status,
  u.full_name as student_name,
  c.title as course_title,
  ss.day_of_week,
  ss.start_time,
  ss.end_time,
  iu.full_name as instructor_name
FROM enrollments e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN courses c ON e.course_id = c.id
LEFT JOIN student_schedules ss ON ss.enrollment_id = e.id
LEFT JOIN users iu ON ss.instructor_id = iu.id
WHERE e.id = 'enrollment-id-here';
```

### API Testing

**Postman/Curl Testing:**
```bash
# Test enrollment creation
curl -X POST http://localhost:3000/api/admin/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "student_id": "user-id",
    "course_id": "course-id",
    "start_date": "2025-01-28",
    "modality": "online"
  }'
```

## Error Prevention Checklist

### Pre-Development
- [ ] Review database schema and relationships
- [ ] Understand ID mapping between tables
- [ ] Plan form validation strategy
- [ ] Design error handling approach

### During Development
- [ ] Add comprehensive logging
- [ ] Implement proper TypeScript types
- [ ] Write unit tests for critical functions
- [ ] Test with various data scenarios

### Pre-Production
- [ ] Test with production-like data volume
- [ ] Verify all error scenarios
- [ ] Check performance under load
- [ ] Validate security and permissions

### Post-Deployment
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Collect user feedback
- [ ] Plan regular maintenance

## Support Resources

**Documentation:**
- [Database Schema](../database/schema.sql)
- [API Routes](./api-flows.md)
- [Component Guide](./components.md)

**Development Tools:**
- React DevTools
- Supabase Dashboard
- Browser Network Tab
- PostgreSQL logs

**Testing:**
- Jest for unit tests
- Playwright for E2E tests
- Postman for API testing

This troubleshooting guide should help resolve most common issues encountered in the admin enrollments system. For new issues not covered here, follow the debugging techniques outlined and consider adding solutions to this guide for future reference.