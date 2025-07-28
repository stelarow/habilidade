// Test Database Connection and Apply Fixes
// This script tests the Supabase connection and applies necessary fixes

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Check environment variables
console.log('🔧 Environment check:');
console.log('- SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('- SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.log('Make sure .env.local exists and contains:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:');
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Total users in database: ${data.count || 0}`);
    return true;
  } catch (error) {
    console.error('❌ Connection error:');
    console.error('Type:', typeof error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', error);
    return false;
  }
}

async function checkSchema() {
  console.log('\n🔍 Checking instructors table schema...');
  
  try {
    // Check if specializations column exists by trying to select it
    const { data, error } = await supabase
      .from('instructors')
      .select('id, user_id, expertise, specializations')
      .limit(1);
    
    if (error && error.message.includes('column "specializations" does not exist')) {
      console.log('⚠️  specializations column missing - needs migration');
      return false;
    } else if (error) {
      console.error('❌ Schema check failed:', error.message);
      return false;
    }
    
    console.log('✅ Schema looks correct');
    return true;
  } catch (error) {
    console.error('❌ Schema check error:', error.message);
    return false;
  }
}

async function addMissingColumns() {
  console.log('\n🔧 Adding missing columns to instructors table...');
  
  try {
    // Add specializations column if it doesn't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'instructors' 
            AND column_name = 'specializations'
          ) THEN
            ALTER TABLE instructors ADD COLUMN specializations TEXT[] DEFAULT NULL;
            UPDATE instructors SET specializations = expertise WHERE expertise IS NOT NULL;
          END IF;
        END $$;
      `
    });
    
    if (alterError) {
      console.error('❌ Failed to add columns:', alterError.message);
      return false;
    }
    
    console.log('✅ Columns added successfully');
    return true;
  } catch (error) {
    console.error('❌ Column addition error:', error.message);
    return false;
  }
}

async function seedMariaEduarda() {
  console.log('\n🌱 Seeding Maria Eduarda data...');
  
  try {
    // Insert/update user
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: '355f9ed5-c838-4c66-8671-2cfbf87121fa',
        email: 'madu.wein@hotmail.com',
        full_name: 'Maria Eduarda',
        role: 'instructor'
      }, {
        onConflict: 'id'
      });
    
    if (userError) {
      console.error('❌ Failed to seed user:', userError.message);
      return false;
    }
    
    // Insert/update instructor
    const { error: instructorError } = await supabase
      .from('instructors')
      .upsert({
        id: '3834f9e6-2fd9-447f-9d74-757cdd6b6e44',
        user_id: '355f9ed5-c838-4c66-8671-2cfbf87121fa',
        bio: 'Professora especializada em ensino personalizado e acompanhamento pedagógico.',
        expertise: ['Educação', 'Pedagogia', 'Acompanhamento Escolar'],
        specializations: ['Educação', 'Pedagogia', 'Acompanhamento Escolar'],
        rating: 5.0,
        total_reviews: 0
      }, {
        onConflict: 'id'
      });
    
    if (instructorError) {
      console.error('❌ Failed to seed instructor:', instructorError.message);
      return false;
    }
    
    console.log('✅ Maria Eduarda data seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    return false;
  }
}

async function verifyData() {
  console.log('\n🔍 Verifying seeded data...');
  
  try {
    // Check user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or('full_name.ilike.%maria eduarda%,email.eq.madu.wein@hotmail.com');
    
    if (userError) {
      console.error('❌ User verification failed:', userError.message);
      return false;
    }
    
    console.log(`📊 Found ${userData?.length || 0} users matching Maria Eduarda`);
    if (userData && userData.length > 0) {
      userData.forEach(user => {
        console.log(`  - ${user.full_name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    // Check instructor
    const { data: instructorData, error: instructorError } = await supabase
      .from('instructors')
      .select('*, users!instructors_user_id_fkey(full_name, email)')
      .eq('user_id', '355f9ed5-c838-4c66-8671-2cfbf87121fa');
    
    if (instructorError) {
      console.error('❌ Instructor verification failed:', instructorError.message);
      return false;
    }
    
    console.log(`📊 Found ${instructorData?.length || 0} instructor profiles for Maria Eduarda`);
    if (instructorData && instructorData.length > 0) {
      instructorData.forEach(instructor => {
        console.log(`  - Instructor ID: ${instructor.id}`);
        console.log(`  - Expertise: ${instructor.expertise?.join(', ') || 'None'}`);
        console.log(`  - Specializations: ${instructor.specializations?.join(', ') || 'None'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database fix process...\n');
  
  // Test connection
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Cannot proceed without database connection');
    return;
  }
  
  // Check schema
  const schemaOk = await checkSchema();
  if (!schemaOk) {
    console.log('\n⚠️  Schema issues detected, attempting fixes...');
    const fixOk = await addMissingColumns();
    if (!fixOk) {
      console.log('\n❌ Failed to fix schema issues');
      return;
    }
  }
  
  // Seed data
  const seedOk = await seedMariaEduarda();
  if (!seedOk) {
    console.log('\n❌ Failed to seed data');
    return;
  }
  
  // Verify everything works
  const verifyOk = await verifyData();
  if (!verifyOk) {
    console.log('\n❌ Data verification failed');
    return;
  }
  
  console.log('\n🎉 Database fix process completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Test the instructor validation page');
  console.log('2. Verify the test page can find Maria Eduarda');
  console.log('3. Check that all database queries work properly');
}

// Run the script
main().catch(console.error);