import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use server client with service role for admin access
    const supabase = createClient();
    
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