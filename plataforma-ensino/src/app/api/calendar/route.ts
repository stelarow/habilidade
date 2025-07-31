import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminApi } from '@/lib/middleware/api-auth';

async function getCalendarHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    const supabase = createClient();

    // Build the query to get calendar data from student_schedules with proper joins
    // First, get all student schedules and join with enrollments
    let query = supabase
      .from('student_schedules')
      .select(`
        *,
        enrollments(
          *,
          users(id, full_name, email),
          courses(id, title)
        )
      `);

    // Filter by teacher if provided
    if (teacherId) {
      query = query.eq('instructor_id', teacherId);
    }

    const { data: schedules, error } = await query.order('day_of_week').order('start_time');

    console.log('Calendar API - Raw query result:', { schedules, error });

    if (error) {
      console.error('Calendar API - Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calendar data', details: error.message },
        { status: 500 }
      );
    }

    // Filter and transform the data to match the expected CalendarData interface
    const calendarData = (schedules || [])
      .filter((schedule: any) => {
        // Filter by active enrollment status
        return schedule.enrollments && schedule.enrollments.status === 'active';
      })
      .map((schedule: any) => {
        const enrollment = schedule.enrollments;
        const user = enrollment?.users;
        const course = enrollment?.courses;
        
        // Generate slot label from time
        const startTime = schedule.start_time || '';
        const endTime = schedule.end_time || '';
        const slotLabel = startTime && endTime ? `${startTime.slice(0,5)} às ${endTime.slice(0,5)}` : '';
        
        return {
          id: schedule.id,
          teacherId: schedule.instructor_id || '',
          studentEmail: user?.email || '',
          studentName: user?.full_name || '',
          courseName: course?.title || '',
          dayOfWeek: schedule.day_of_week,
          startTime: startTime,
          endTime: endTime,
          slotLabel: slotLabel,
          startDate: enrollment?.start_date || '',
          endDate: enrollment?.end_date || ''
        };
      });

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

export const GET = requireAdminApi(getCalendarHandler);