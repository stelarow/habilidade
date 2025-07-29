import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create service client with service role for admin access (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get all users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, role, email')
      .order('full_name');

    if (usersError) {
      console.error('Users query error:', usersError);
    }

    // Get all instructors
    const { data: instructorsData, error: instructorsError } = await supabase
      .from('instructors')
      .select('id, user_id, specializations, expertise, created_at')
      .order('created_at');

    if (instructorsError) {
      console.error('Instructors query error:', instructorsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        users: usersData || [],
        instructors: instructorsData || [],
        usersError: usersError?.message || null,
        instructorsError: instructorsError?.message || null,
        debug: {
          userCount: usersData?.length || 0,
          instructorCount: instructorsData?.length || 0,
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}