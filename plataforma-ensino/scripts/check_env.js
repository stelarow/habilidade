// Check Environment Configuration
console.log('🔍 Checking environment configuration...\n');

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (length: ' + (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0) + ')' : 'Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (length: ' + (process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0) + ')' : 'Not set');

console.log('\n📁 Environment Files:');
const fs = require('fs');
const path = require('path');

const envFiles = ['.env.local', '.env', '.env.development', '.env.production'];
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`${file}: ${exists ? '✅ Exists' : '❌ Not found'}`);
});

console.log('\n💡 Next Steps:');
console.log('1. Create a .env.local file with your Supabase credentials');
console.log('2. Copy the example file: cp .env.example .env.local');
console.log('3. Update the values with your actual Supabase project details');
console.log('4. Get credentials from your Supabase project settings');