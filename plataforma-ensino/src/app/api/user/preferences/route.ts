import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const userPreferencesSchema = z.object({
  // UI Preferences
  theme: z.enum(['violet-dark', 'light', 'dark', 'high-contrast']).optional(),
  font_size: z.enum(['small', 'medium', 'large', 'extra-large']).optional(),
  reduced_motion: z.boolean().optional(),
  high_contrast: z.boolean().optional(),
  
  // Learning Preferences
  auto_advance: z.boolean().optional(),
  show_progress: z.boolean().optional(),
  email_notifications: z.boolean().optional(),
  push_notifications: z.boolean().optional(),
  
  // Gamification Preferences
  show_achievements: z.boolean().optional(),
  show_leaderboard: z.boolean().optional(),
  public_profile: z.boolean().optional(),
  
  // Study Settings
  reminder_frequency: z.enum(['none', 'daily', 'weekly', 'custom']).optional(),
  study_goal_minutes: z.number().min(1).max(480).optional() // Max 8 hours per day
})

// GET /api/user/preferences - Get user preferences
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (preferencesError && preferencesError.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', preferencesError)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      theme: 'violet-dark',
      font_size: 'medium',
      reduced_motion: false,
      high_contrast: false,
      auto_advance: false,
      show_progress: true,
      email_notifications: true,
      push_notifications: true,
      show_achievements: true,
      show_leaderboard: true,
      public_profile: false,
      reminder_frequency: 'daily',
      study_goal_minutes: 30
    }

    return NextResponse.json({
      data: preferences || defaultPreferences
    })

  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = userPreferencesSchema.parse(body)

    const now = new Date().toISOString()

    // Upsert user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .upsert([{
        user_id: user.id,
        ...validatedData,
        updated_at: now
      }], {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (preferencesError) {
      console.error('Error updating user preferences:', preferencesError)
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    // If notification preferences changed, update user's notification settings
    if (validatedData.email_notifications !== undefined || validatedData.push_notifications !== undefined) {
      await updateNotificationSettings(supabase, user.id, {
        email_enabled: validatedData.email_notifications,
        push_enabled: validatedData.push_notifications
      })
    }

    return NextResponse.json({
      data: preferences,
      message: 'Preferences updated successfully'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid preferences data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/preferences/reset - Reset preferences to default
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const defaultPreferences = {
      user_id: user.id,
      theme: 'violet-dark',
      font_size: 'medium',
      reduced_motion: false,
      high_contrast: false,
      auto_advance: false,
      show_progress: true,
      email_notifications: true,
      push_notifications: true,
      show_achievements: true,
      show_leaderboard: true,
      public_profile: false,
      reminder_frequency: 'daily',
      study_goal_minutes: 30,
      updated_at: new Date().toISOString()
    }

    const { data: preferences, error: preferencesError } = await supabase
      .from('user_preferences')
      .upsert([defaultPreferences], {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (preferencesError) {
      console.error('Error resetting user preferences:', preferencesError)
      return NextResponse.json(
        { error: 'Failed to reset preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: preferences,
      message: 'Preferences reset to default successfully'
    })

  } catch (error) {
    console.error('Reset preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update notification settings
async function updateNotificationSettings(supabase: any, userId: string, settings: any) {
  try {
    // This could be extended to integrate with external notification services
    // For now, we'll just log the change
    console.log(`Notification settings updated for user ${userId}:`, settings)
    
    // Update user metadata if needed
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        notification_preferences: settings
      }
    })

    if (error) {
      console.error('Error updating user metadata:', error)
    }
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error)
  }
}