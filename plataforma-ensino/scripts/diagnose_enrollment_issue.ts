#!/usr/bin/env tsx

/**
 * Diagnostic script for enrollment instructor validation issues
 * 
 * This script helps identify and resolve issues related to:
 * - Missing instructors in database
 * - Incorrect instructor roles
 * - Database configuration problems
 * 
 * Usage: npx tsx scripts/diagnose_enrollment_issue.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file for:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test instructor ID from the error scenario
const TEST_INSTRUCTOR_ID = '3834f9e6-2fd9-447f-9d74-757cdd6b6e44'

async function diagnosticTests() {
  console.log('🚀 Starting enrollment diagnostic tests...\n')

  // Test 1: Check database connection
  console.log('1️⃣ Testing database connection...')
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return
    }
    console.log('✅ Database connection successful\n')
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return
  }

  // Test 2: Check if users table exists and has proper structure
  console.log('2️⃣ Checking users table structure...')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, role')
      .limit(1)
    
    if (error) {
      console.error('❌ Users table error:', error.message)
      return
    }
    console.log('✅ Users table accessible with required columns\n')
  } catch (error) {
    console.error('❌ Users table structure error:', error)
    return
  }

  // Test 3: Check for the specific instructor causing the error
  console.log('3️⃣ Checking for problematic instructor...')
  console.log(`   Looking for instructor ID: ${TEST_INSTRUCTOR_ID}`)
  
  const { data: specificInstructor, error: specificError } = await supabase
    .from('users')
    .select('id, full_name, email, role, created_at')
    .eq('id', TEST_INSTRUCTOR_ID)
    .single()

  if (specificError) {
    console.error('❌ Specific instructor not found:', specificError.message)
    console.log('   This explains the "instrutores não foram encontrados" error')
  } else {
    console.log('✅ Specific instructor found:')
    console.table([{
      ID: specificInstructor.id,
      Name: specificInstructor.full_name,
      Email: specificInstructor.email,
      Role: specificInstructor.role,
      Created: new Date(specificInstructor.created_at).toLocaleDateString()
    }])
    
    if (!['admin', 'instructor'].includes(specificInstructor.role)) {
      console.warn('⚠️ Instructor has invalid role for teaching')
    }
  }
  console.log()

  // Test 4: Check all existing instructors
  console.log('4️⃣ Listing all existing instructors...')
  const { data: allInstructors, error: instructorsError } = await supabase
    .from('users')
    .select('id, full_name, email, role, created_at')
    .in('role', ['admin', 'instructor'])
    .order('full_name')

  if (instructorsError) {
    console.error('❌ Error fetching instructors:', instructorsError.message)
  } else if (!allInstructors || allInstructors.length === 0) {
    console.warn('⚠️ No instructors found in database')
    console.log('   This means no users have role "instructor" or "admin"')
  } else {
    console.log(`✅ Found ${allInstructors.length} instructors:`)
    console.table(allInstructors.map(i => ({
      ID: i.id.substring(0, 8) + '...',
      Name: i.full_name,
      Email: i.email,
      Role: i.role,
      Created: new Date(i.created_at).toLocaleDateString()
    })))
  }
  console.log()

  // Test 5: Check instructors table (if it exists)
  console.log('5️⃣ Checking instructors profile table...')
  const { data: instructorProfiles, error: profilesError } = await supabase
    .from('instructors')
    .select('id, user_id, bio, expertise, rating')
    .limit(10)

  if (profilesError) {
    console.warn('⚠️ Instructors table error:', profilesError.message)
    console.log('   This table may not exist or may have permission issues')
  } else {
    console.log(`✅ Found ${instructorProfiles?.length || 0} instructor profiles`)
    if (instructorProfiles && instructorProfiles.length > 0) {
      console.table(instructorProfiles.map(p => ({
        Profile_ID: p.id.substring(0, 8) + '...',
        User_ID: p.user_id.substring(0, 8) + '...',
        Bio_Length: p.bio?.length || 0,
        Expertise_Count: p.expertise?.length || 0,
        Rating: p.rating
      })))
    }
  }
  console.log()

  // Test 6: Check teacher_availability table
  console.log('6️⃣ Checking teacher availability table...')
  const { data: availability, error: availabilityError } = await supabase
    .from('teacher_availability')
    .select('teacher_id, day_of_week, start_time, end_time')
    .limit(5)

  if (availabilityError) {
    console.warn('⚠️ Teacher availability table error:', availabilityError.message)
    console.log('   This table may not exist or may have permission issues')
  } else {
    console.log(`✅ Found ${availability?.length || 0} availability records`)
    if (availability && availability.length > 0) {
      console.table(availability.map(a => ({
        Teacher_ID: a.teacher_id.substring(0, 8) + '...',
        Day: a.day_of_week,
        Start: a.start_time,
        End: a.end_time
      })))
    }
  }
  console.log()

  // Summary and recommendations
  console.log('📋 DIAGNOSTIC SUMMARY:')
  console.log('=' * 50)
  
  if (!specificInstructor) {
    console.log('❌ PRIMARY ISSUE: The instructor "Maria Eduarda" (3834f9e6-2fd9-447f-9d74-757cdd6b6e44) does not exist')
    console.log('   SOLUTION: Run the seed script to create missing instructors')
    console.log('   Command: psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB -f database/seed_instructors.sql')
    console.log()
  }

  if (!allInstructors || allInstructors.length === 0) {
    console.log('❌ SECONDARY ISSUE: No instructors exist in the system')
    console.log('   SOLUTION: Create instructor accounts with proper roles')
    console.log()
  }

  console.log('🔧 RECOMMENDED ACTIONS:')
  console.log('1. Run the instructor seed script: database/seed_instructors.sql')
  console.log('2. Verify instructor roles are set to "instructor" or "admin"')
  console.log('3. Test the enrollment flow with seeded instructors')
  console.log('4. Update frontend to validate instructor selection')
  
  console.log('\n✅ Diagnostic complete!')
}

// Run diagnostics
diagnosticTests().catch(console.error)