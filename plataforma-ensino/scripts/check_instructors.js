const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vfpdyllwquaturpcifpl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw'
);

async function checkInstructorData() {
  console.log('🔍 Checking instructors and users...\n');
  
  const { data: instructors, error } = await supabase
    .from('instructors')
    .select('id, user_id, bio, rating, expertise');
  
  if (error) {
    console.error('❌ Error fetching instructors:', error.message);
    return;
  }
  
  console.log('📊 Instructors found:', instructors?.length || 0);
  
  if (instructors && instructors.length > 0) {
    for (const instructor of instructors) {
      console.log('\n📋 Instructor:', instructor.id);
      console.log('   User ID:', instructor.user_id);
      
      // Check the corresponding user
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .eq('id', instructor.user_id)
        .single();
        
      if (userError) {
        console.log('   ❌ User not found:', userError.message);
      } else if (user) {
        console.log('   👤 User:', user.full_name, '(' + user.email + ')');
        console.log('   🎭 Role:', user.role);
        
        if (user.role !== 'instructor' && user.role !== 'admin') {
          console.log('   ⚠️  ISSUE: User needs instructor/admin role! Current role:', user.role);
        }
      }
      
      // Check availability
      const { data: availability } = await supabase
        .from('teacher_availability')
        .select('id, day_of_week, start_time, end_time, max_students, is_active')
        .eq('teacher_id', instructor.id);
        
      console.log('   📅 Availability slots:', availability?.length || 0);
      if (availability && availability.length > 0) {
        availability.forEach(slot => {
          const dayNames = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
          console.log(`      - ${dayNames[slot.day_of_week]}: ${slot.start_time}-${slot.end_time} (${slot.max_students} alunos) ${slot.is_active ? '✅' : '❌'}`);
        });
      }
    }
  }
  
  // Also check all users to see who exists
  console.log('\n🔍 All users in database:');
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, full_name, email, role')
    .order('full_name');
    
  if (allUsers && allUsers.length > 0) {
    allUsers.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email}) - Role: ${user.role}`);
    });
  } else {
    console.log('   No users found');
  }
}

checkInstructorData().catch(console.error);