/**
 * Test script to debug calendar API data flow
 * Run this in a Next.js API route or server component to test
 */

export async function testCalendarAPI() {
  console.log('=== Testing Calendar API ===');
  
  try {
    // First, let's query the database directly to see what data exists
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    
    // 1. Check class_schedules table
    console.log('\n1. Checking class_schedules table:');
    const { data: schedules, error: schedulesError } = await supabase
      .from('class_schedules')
      .select('*')
      .limit(5);
    
    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError);
    } else {
      console.log('Sample schedules:', JSON.stringify(schedules, null, 2));
      console.log('Total schedules found:', schedules?.length || 0);
    }
    
    // 2. Check schedule_slots table
    console.log('\n2. Checking schedule_slots table:');
    const { data: slots, error: slotsError } = await supabase
      .from('schedule_slots')
      .select('*')
      .limit(5);
    
    if (slotsError) {
      console.error('Error fetching slots:', slotsError);
    } else {
      console.log('Sample slots:', JSON.stringify(slots, null, 2));
      console.log('Total slots found:', slots?.length || 0);
    }
    
    // 3. Test the full query from the API
    console.log('\n3. Testing full API query:');
    const { data: fullQuery, error: fullQueryError } = await supabase
      .from('class_schedules')
      .select(`
        id,
        enrollment_id,
        teacher_id,
        created_at,
        schedule_slots (
          day_of_week,
          start_time,
          end_time,
          slot_label
        ),
        enrollments (
          user_id,
          start_date,
          end_date,
          courses (
            title
          ),
          users (
            email,
            full_name
          )
        )
      `)
      .limit(5);
    
    if (fullQueryError) {
      console.error('Error with full query:', fullQueryError);
    } else {
      console.log('Full query results:', JSON.stringify(fullQuery, null, 2));
      console.log('Total results:', fullQuery?.length || 0);
      
      // Check the structure of the first result
      if (fullQuery && fullQuery.length > 0) {
        const first = fullQuery[0];
        console.log('\n4. Analyzing first result structure:');
        console.log('- Has schedule_slots?', !!first.schedule_slots);
        console.log('- schedule_slots is array?', Array.isArray(first.schedule_slots));
        console.log('- Has enrollments?', !!first.enrollments);
        console.log('- enrollments is array?', Array.isArray(first.enrollments));
        
        if (first.enrollments) {
          const enrollment = Array.isArray(first.enrollments) ? first.enrollments[0] : first.enrollments;
          console.log('- Has users?', !!enrollment?.users);
          console.log('- users is array?', Array.isArray(enrollment?.users));
          console.log('- Has courses?', !!enrollment?.courses);
          console.log('- courses is array?', Array.isArray(enrollment?.courses));
        }
      }
    }
    
    // 4. Check if there are enrollments without schedules
    console.log('\n5. Checking for enrollments without schedules:');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        teacher_id,
        courses (title),
        users (email, full_name)
      `)
      .limit(10);
    
    if (!enrollmentsError && enrollments) {
      console.log('Sample enrollments:', JSON.stringify(enrollments?.slice(0, 3), null, 2));
      console.log('Total enrollments found:', enrollments.length);
      
      // Check which enrollments don't have schedules
      const enrollmentIds = enrollments.map(e => e.id);
      const { data: scheduledEnrollments } = await supabase
        .from('class_schedules')
        .select('enrollment_id')
        .in('enrollment_id', enrollmentIds);
      
      const scheduledIds = new Set(scheduledEnrollments?.map(s => s.enrollment_id) || []);
      const unscheduledEnrollments = enrollments.filter(e => !scheduledIds.has(e.id));
      
      console.log('Enrollments without schedules:', unscheduledEnrollments.length);
      if (unscheduledEnrollments.length > 0) {
        console.log('First unscheduled enrollment:', JSON.stringify(unscheduledEnrollments[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Function to test the API endpoint from client side
export async function testCalendarAPIEndpoint() {
  console.log('=== Testing Calendar API Endpoint ===');
  
  try {
    const response = await fetch('/api/calendar');
    const contentType = response.headers.get('content-type');
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.data && Array.isArray(data.data)) {
      console.log('Total items returned:', data.data.length);
      
      if (data.data.length > 0) {
        console.log('\nFirst item structure:');
        const first = data.data[0];
        Object.keys(first).forEach(key => {
          console.log(`- ${key}:`, typeof first[key], first[key]);
        });
      }
      
      // Group by day and time
      const grouped = data.data.reduce((acc: any, item: any) => {
        const key = `Day ${item.dayOfWeek} - ${item.slotLabel}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item.studentName || item.studentEmail);
        return acc;
      }, {});
      
      console.log('\nSchedule summary:');
      Object.entries(grouped).forEach(([key, students]) => {
        console.log(`${key}: ${(students as string[]).join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('Endpoint test error:', error);
  }
}