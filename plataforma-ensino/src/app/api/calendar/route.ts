import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    const supabase = createClient();

    // Build the query to get calendar data from enrollments
    let query = supabase
      .from('enrollments')
      .select(`
        id,
        user_id,
        course_id,
        day_of_week,
        start_time,
        end_time,
        slot_label,
        start_date,
        end_date,
        instructor_id,
        user:users(id, full_name, email),
        course:courses(id, title),
        instructor:instructors(user_id, users!inner(id, full_name, email))
      `)
      .eq('status', 'active')
      .not('day_of_week', 'is', null)
      .not('slot_label', 'is', null);

    // Filter by teacher if provided
    if (teacherId) {
      query = query.eq('instructor_id', teacherId);
    }

    const { data: enrollments, error } = await query.order('day_of_week').order('start_time');

    if (error) {
      console.error('Calendar API - Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calendar data', details: error.message },
        { status: 500 }
      );
    }

    // Transform the data to match the expected CalendarData interface
    const calendarData = (enrollments || []).map((enrollment: any) => ({
      id: enrollment.id,
      teacherId: enrollment.instructor_id || '',
      studentEmail: enrollment.user?.email || '',
      studentName: enrollment.user?.full_name || '',
      courseName: enrollment.course?.title || '',
      dayOfWeek: enrollment.day_of_week,
      startTime: enrollment.start_time || '',
      endTime: enrollment.end_time || '',
      slotLabel: enrollment.slot_label || '',
      startDate: enrollment.start_date || '',
      endDate: enrollment.end_date || ''
    }));

    console.log(`Calendar API - Returning ${calendarData.length} calendar items`);
    if (teacherId) {
      console.log(`Calendar API - Filtered by teacher: ${teacherId}`);
    }

    return NextResponse.json({
      data: calendarData,
      total: calendarData.length
    });

  } catch (error) {
    console.error('Calendar API - Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}