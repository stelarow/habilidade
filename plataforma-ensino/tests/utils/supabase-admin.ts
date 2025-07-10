import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function autoConfirmTestUser(email: string) {
  try {
    // Get user by email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error getting users:', getUserError);
      return false;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error('User not found:', email);
      return false;
    }

    // Update user to confirm email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true
      }
    );

    if (updateError) {
      console.error('Error confirming user email:', updateError);
      return false;
    }

    console.log('✅ Auto-confirmed test user:', email);
    return true;
  } catch (error) {
    console.error('Error in autoConfirmTestUser:', error);
    return false;
  }
}

export async function deleteTestUser(email: string) {
  try {
    // Get user by email
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error('Error getting users:', getUserError);
      return false;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found for deletion:', email);
      return true; // Consider it successful if user doesn't exist
    }

    // Delete user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return false;
    }

    console.log('🗑️ Deleted test user:', email);
    return true;
  } catch (error) {
    console.error('Error in deleteTestUser:', error);
    return false;
  }
}