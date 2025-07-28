// Debug script to test instructor validation with Maria Eduarda's data
// This will help identify exactly where the validation is failing

const mariaEduardaData = {
  // From database query
  user_id: '355f9ed5-c838-4c66-8671-2cfbf87121fa',
  instructor_id: '3834f9e6-2fd9-447f-9d74-757cdd6b6e44',
  full_name: 'Maria Eduarda',
  email: 'madu.wein@hotmail.com',
  role: 'instructor'
}

// Simulate the enrollment request payload that should be sent
const simulatedEnrollmentPayload = {
  student_id: 'some-test-student-id',
  course_id: 'some-test-course-id', 
  start_date: '2025-01-28',
  modality: 'in-person',
  schedules: [
    {
      instructor_id: mariaEduardaData.user_id, // This should be the user.id, not instructor.id
      day_of_week: 1, // Monday
      start_time: '08:00:00',
      end_time: '10:00:00'
    }
  ]
}

console.log('=== DEBUG INSTRUCTOR VALIDATION ===')
console.log('Maria Eduarda Database Record:')
console.log(JSON.stringify(mariaEduardaData, null, 2))
console.log('\nSimulated Enrollment Payload:')
console.log(JSON.stringify(simulatedEnrollmentPayload, null, 2))
console.log('\nKey Points to Check:')
console.log('1. schedules[].instructor_id should equal user.id (not instructor.id)')
console.log('2. API validates instructor_id against users table first')
console.log('3. Then checks if user has instructor profile')
console.log('4. Finally validates user role is "instructor" or "admin"')
console.log('\nExpected Flow:')
console.log('✓ instructor_id:', mariaEduardaData.user_id, '-> found in users table')
console.log('✓ user_id:', mariaEduardaData.user_id, '-> has instructor profile with id:', mariaEduardaData.instructor_id)
console.log('✓ role:', mariaEduardaData.role, '-> valid for teaching')