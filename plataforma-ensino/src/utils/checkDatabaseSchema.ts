import { createClient } from '@/lib/supabase/server';

export async function checkDatabaseSchema() {
  const supabase = createClient();
  
  console.log('=== Checking Database Schema ===\n');
  
  // 1. Check if tables exist
  console.log('1. Checking tables existence:');
  const tables = ['class_schedules', 'schedule_slots', 'enrollments', 'courses', 'users'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table '${table}': ERROR - ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': EXISTS (${count} rows)`);
      }
    } catch (e) {
      console.log(`❌ Table '${table}': ERROR - ${e}`);
    }
  }
  
  // 2. Check class_schedules structure
  console.log('\n2. Checking class_schedules columns:');
  const { data: scheduleColumns } = await supabase
    .from('class_schedules')
    .select('*')
    .limit(1);
  
  if (scheduleColumns && scheduleColumns.length > 0) {
    console.log('Columns:', Object.keys(scheduleColumns[0]));
  }
  
  // 3. Check foreign key relationships
  console.log('\n3. Testing foreign key relationships:');
  
  // Test schedule_slots relationship
  const { data: slotTest, error: slotError } = await supabase
    .from('class_schedules')
    .select('id, schedule_slot_id, schedule_slots(*)')
    .limit(1);
  
  if (slotError) {
    console.log('❌ schedule_slots relationship:', slotError.message);
  } else if (slotTest?.length > 0) {
    console.log('✅ schedule_slots relationship works');
    console.log('Sample:', JSON.stringify(slotTest[0], null, 2));
  } else {
    console.log('⚠️  No data to test schedule_slots relationship');
  }
  
  // Test enrollments relationship
  const { data: enrollmentTest, error: enrollmentError } = await supabase
    .from('class_schedules')
    .select('id, enrollment_id, enrollments(*)')
    .limit(1);
  
  if (enrollmentError) {
    console.log('❌ enrollments relationship:', enrollmentError.message);
  } else if (enrollmentTest?.length > 0) {
    console.log('✅ enrollments relationship works');
    console.log('Sample:', JSON.stringify(enrollmentTest[0], null, 2));
  } else {
    console.log('⚠️  No data to test enrollments relationship');
  }
  
  // 4. Check nested relationships
  console.log('\n4. Testing nested relationships:');
  const { data: nestedTest, error: nestedError } = await supabase
    .from('class_schedules')
    .select(`
      id,
      enrollments (
        id,
        courses (
          id,
          title
        ),
        users (
          id,
          email
        )
      )
    `)
    .limit(1);
  
  if (nestedError) {
    console.log('❌ Nested relationships:', nestedError.message);
  } else if (nestedTest?.length > 0) {
    console.log('✅ Nested relationships work');
    console.log('Sample:', JSON.stringify(nestedTest[0], null, 2));
  } else {
    console.log('⚠️  No data to test nested relationships');
  }
  
  // 5. Check if schedule_slot_id exists
  console.log('\n5. Checking schedule_slot_id column:');
  const { data: slotIdCheck } = await supabase
    .from('class_schedules')
    .select('id, schedule_slot_id')
    .limit(5);
  
  if (slotIdCheck) {
    console.log('schedule_slot_id values:', slotIdCheck.map(s => s.schedule_slot_id));
  }
}