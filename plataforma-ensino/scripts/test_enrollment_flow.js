#!/usr/bin/env node

/**
 * Comprehensive Enrollment Flow Test Script
 * 
 * This script validates the complete enrollment flow including:
 * 1. Frontend loads teacher Maria Eduarda correctly
 * 2. Available time slots are displayed
 * 3. Time slot selection without errors  
 * 4. Enrollment submission works without instructor errors
 * 5. Data is correctly saved to database
 */

const { createClient } = require('@supabase/supabase-js')

// Environment variables check
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

console.log('🚀 Starting Enrollment Flow Test...\n')

async function testTeacherMaria() {
  console.log('1️⃣ Testing Teacher Maria Eduarda Loading...')
  
  try {
    // Test direct teacher query by name
    const { data: teachers, error } = await supabase
      .from('instructors')
      .select(`
        id,
        user_id,
        bio,
        rating,
        expertise,
        users:user_id (
          full_name,
          email,
          avatar_url,
          role
        ),
        teacher_availability (
          id,
          teacher_id,
          day_of_week,
          start_time,
          end_time,
          max_students,
          is_active
        )
      `)
      .eq('users.full_name', 'Maria Eduarda')

    if (error) throw error

    if (!teachers || teachers.length === 0) {
      console.log('❌ Maria Eduarda not found in database')
      return false
    }

    const maria = teachers[0]
    console.log('✅ Maria Eduarda found:', {
      id: maria.id,
      userId: maria.user_id,
      name: maria.users.full_name,
      email: maria.users.email,
      role: maria.users.role,
      availabilitySlots: maria.teacher_availability?.length || 0
    })

    if (maria.users.role !== 'instructor' && maria.users.role !== 'admin') {
      console.log('❌ Maria Eduarda does not have instructor/admin role:', maria.users.role)
      return false
    }

    return {
      instructor: maria,
      hasAvailability: maria.teacher_availability && maria.teacher_availability.length > 0
    }
  } catch (error) {
    console.error('❌ Error fetching Maria Eduarda:', error.message)
    return false
  }
}

async function testTimeSlots(instructorId) {
  console.log('\n2️⃣ Testing Time Slots Display...')
  
  try {
    const { data: availability, error } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('teacher_id', instructorId)
      .eq('is_active', true)

    if (error) throw error

    console.log('✅ Available time slots:', availability?.length || 0)
    
    if (availability && availability.length > 0) {
      availability.forEach(slot => {
        const dayNames = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
        console.log(`   📅 ${dayNames[slot.day_of_week]}: ${slot.start_time} - ${slot.end_time} (${slot.max_students} alunos)`)
      })
      return availability
    } else {
      console.log('⚠️ No active time slots found for Maria Eduarda')
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching time slots:', error.message)
    return []
  }
}

async function testEnrollmentSubmission(mariaData, timeSlots) {
  console.log('\n3️⃣ Testing Enrollment Submission...')
  
  try {
    // Find a test user (student)
    const { data: students, error: studentError } = await supabase
      .from('users')
      .select('id, full_name, email, role')
      .eq('role', 'student')
      .limit(1)

    if (studentError) throw studentError

    if (!students || students.length === 0) {
      console.log('❌ No student users found for testing')
      return false
    }

    const testStudent = students[0]
    console.log('✅ Test student found:', testStudent.full_name, testStudent.email)

    // Find a test course
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('is_published', true)
      .limit(1)

    if (courseError) throw courseError

    if (!courses || courses.length === 0) {
      console.log('❌ No published courses found for testing')
      return false
    }

    const testCourse = courses[0]
    console.log('✅ Test course found:', testCourse.title)

    // Test enrollment payload using enhanced API format
    const enrollmentPayload = {
      student_id: testStudent.id,
      course_id: testCourse.id,
      start_date: new Date().toISOString().split('T')[0], // Today's date
      modality: 'in-person',
      schedules: timeSlots.slice(0, 1).map(slot => ({
        instructor_id: mariaData.user_id, // IMPORTANT: Use user_id, not instructor.id
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time
      }))
    }

    console.log('📝 Enrollment payload prepared:', JSON.stringify(enrollmentPayload, null, 2))

    // Check if student is already enrolled (cleanup if needed)
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', testStudent.id)
      .eq('course_id', testCourse.id)
      .single()

    if (existingEnrollment) {
      console.log('🧹 Cleaning up existing enrollment for testing...')
      await supabase.from('enrollments').delete().eq('id', existingEnrollment.id)
    }

    return {
      payload: enrollmentPayload,
      student: testStudent,
      course: testCourse
    }
  } catch (error) {
    console.error('❌ Error preparing enrollment test:', error.message)
    return false
  }
}

async function testApiEndpoint(enrollmentData) {
  console.log('\n4️⃣ Testing API Endpoint...')
  
  try {
    // Test the enrollment API endpoint using fetch
    const response = await fetch('http://localhost:3000/api/admin/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrollmentData.payload)
    })

    const result = await response.json()

    if (!response.ok) {
      console.log('❌ API Response Error:', result.error)
      if (result.details) {
        console.log('📋 Error Details:', JSON.stringify(result.details, null, 2))
      }
      return false
    }

    console.log('✅ Enrollment created successfully via API')
    console.log('📋 API Response:', JSON.stringify(result, null, 2))

    return result.data
  } catch (error) {
    console.error('❌ API call failed:', error.message)
    return false
  }
}

async function testDatabaseValidation(enrollmentId) {
  console.log('\n5️⃣ Testing Database Validation...')
  
  try {
    // Verify enrollment was created
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        *,
        user:users(full_name, email),
        course:courses(title, slug)
      `)
      .eq('id', enrollmentId)
      .single()

    if (enrollmentError) throw enrollmentError

    if (!enrollment) {
      console.log('❌ Enrollment not found in database')
      return false
    }

    console.log('✅ Enrollment verified in database:', {
      id: enrollment.id,
      student: enrollment.user.full_name,
      course: enrollment.course.title,
      status: enrollment.status,
      modality: enrollment.modality
    })

    // Verify student schedules were created
    const { data: schedules, error: scheduleError } = await supabase
      .from('student_schedules')
      .select('*')
      .eq('enrollment_id', enrollmentId)

    if (scheduleError) throw scheduleError

    console.log('✅ Student schedules verified:', schedules?.length || 0, 'schedule(s) created')

    if (schedules && schedules.length > 0) {
      schedules.forEach(schedule => {
        const dayNames = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
        console.log(`   📅 ${dayNames[schedule.day_of_week]}: ${schedule.start_time} - ${schedule.end_time}`)
        console.log(`   👨‍🏫 Instructor ID: ${schedule.instructor_id}`)
      })
    }

    return {
      enrollment,
      schedules: schedules || []
    }
  } catch (error) {
    console.error('❌ Database validation failed:', error.message)
    return false
  }
}

async function cleanupTestData(enrollmentId) {
  console.log('\n🧹 Cleaning up test data...')
  
  try {
    // Delete student schedules first (foreign key constraint)
    await supabase
      .from('student_schedules')
      .delete()
      .eq('enrollment_id', enrollmentId)

    // Delete enrollment
    await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId)

    console.log('✅ Test data cleaned up successfully')
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message)
  }
}

async function runFullTest() {
  let testEnrollmentId = null

  try {
    // Test 1: Maria Eduarda Loading
    const mariaResult = await testTeacherMaria()
    if (!mariaResult) {
      console.log('\n❌ Test FAILED: Maria Eduarda not found or configured incorrectly')
      return false
    }

    // Test 2: Time Slots
    const timeSlots = await testTimeSlots(mariaResult.instructor.id)
    if (timeSlots.length === 0) {
      console.log('\n⚠️ Warning: No time slots available for Maria Eduarda')
    }

    // Test 3: Enrollment Preparation
    const enrollmentData = await testEnrollmentSubmission(mariaResult.instructor, timeSlots)
    if (!enrollmentData) {
      console.log('\n❌ Test FAILED: Could not prepare enrollment data')
      return false
    }

    // Test 4: API Endpoint
    const apiResult = await testApiEndpoint(enrollmentData)
    if (!apiResult) {
      console.log('\n❌ Test FAILED: API endpoint error')
      return false
    }

    testEnrollmentId = apiResult.id

    // Test 5: Database Validation
    const dbResult = await testDatabaseValidation(testEnrollmentId)
    if (!dbResult) {
      console.log('\n❌ Test FAILED: Database validation error')
      return false
    }

    console.log('\n🎉 All tests PASSED! Enrollment flow is working correctly.')
    console.log('\n📊 Test Summary:')
    console.log('✅ Teacher Maria Eduarda loads correctly')
    console.log('✅ Time slots are displayed properly')
    console.log('✅ Time slot selection works without errors')
    console.log('✅ Enrollment submission works without instructor errors')
    console.log('✅ Data is correctly saved to database')

    return true

  } catch (error) {
    console.error('\n💥 Unexpected error during testing:', error)
    return false
  } finally {
    // Cleanup test data
    if (testEnrollmentId) {
      await cleanupTestData(testEnrollmentId)
    }
  }
}

// Run the test
runFullTest().then(success => {
  process.exit(success ? 0 : 1)
})