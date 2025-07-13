import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'

// GET /api/admin/courses - List courses for admin use (dropdown options, etc.)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const { user, profile } = await requireAdmin()
    
    const supabase = createClient()
    const url = new URL(request.url)
    
    // Parse query parameters
    const onlyBasicInfo = url.searchParams.get('basic') === 'true'
    const search = url.searchParams.get('search')
    
    let query = supabase
      .from('courses')
      .select(onlyBasicInfo 
        ? 'id, title, slug, created_at'
        : `
          *,
          category:categories(id, name, color_theme),
          instructor:instructors(
            id,
            user:users(full_name, email)
          ),
          lessons_count:lessons(count)
        `
      )
      .order('created_at', { ascending: false })
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    const { data: courses, error } = await query
    
    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: courses
    })
    
  } catch (error) {
    console.error('Courses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}