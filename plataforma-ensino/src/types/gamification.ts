// Enhanced types for gamification and progress tracking

export interface UserPreferences {
  id: string
  user_id: string
  theme: 'violet-dark' | 'light' | 'dark' | 'high-contrast'
  font_size: 'small' | 'medium' | 'large' | 'extra-large'
  reduced_motion: boolean
  high_contrast: boolean
  auto_advance: boolean
  show_progress: boolean
  email_notifications: boolean
  push_notifications: boolean
  show_achievements: boolean
  show_leaderboard: boolean
  public_profile: boolean
  reminder_frequency: 'none' | 'daily' | 'weekly' | 'custom'
  study_goal_minutes: number
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'general' | 'progress' | 'streak' | 'social' | 'mastery' | 'time'
  criteria: AchievementCriteria
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  badge_color: string
  unlock_message: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AchievementCriteria {
  type: string
  target: number
  minimum_quizzes?: number
  [key: string]: any
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  progress_data: Record<string, any>
  achievement?: Achievement
}

export interface GamificationStats {
  user_id: string
  total_xp: number
  current_level: number
  xp_to_next_level: number
  current_streak: number
  longest_streak: number
  last_activity_date: string | null
  total_study_minutes: number
  weekly_study_minutes: number
  monthly_study_minutes: number
  average_quiz_score: number
  courses_completed: number
  lessons_completed: number
  achievement_count: number
  badge_count: number
  created_at: string
  updated_at: string
}

export interface LessonAnalytics {
  id: string
  user_id: string
  lesson_id: string
  enrollment_id: string
  session_start: string
  session_end: string | null
  active_time_seconds: number
  total_time_seconds: number
  pause_count: number
  video_interactions: Record<string, any>
  quiz_interactions: Record<string, any>
  content_interactions: Record<string, any>
  comprehension_score: number | null
  attention_score: number | null
  completion_quality: 'skipped' | 'rushed' | 'normal' | 'thorough'
  created_at: string
  updated_at: string
}

export interface EnhancedProgress {
  id: string
  user_id: string
  lesson_id: string
  enrollment_id: string
  completed: boolean
  last_position: number
  watch_time: number
  completed_at: string | null
  created_at: string
  updated_at: string
  is_completed: boolean
  time_spent_minutes: number
  pdf_progress_percentage: number
  quiz_score: number | null
  exercises_completed: number
  completion_criteria: Record<string, any>
  is_unlocked: boolean
  unlocked_at: string | null
  last_accessed_at: string | null
  progress_percentage: number
  engagement_score: number
  difficulty_rating: number | null
  notes: string | null
  bookmarked: boolean
  review_requested: boolean
}

export interface QuizResponse {
  id: string
  quiz_attempt_id: string
  question_id: string
  user_id: string
  selected_answer: number
  is_correct: boolean
  points_earned: number
  time_taken_seconds: number | null
  response_confidence: number | null
  feedback_shown: boolean
  explanation_helpful: boolean | null
  hint_used: boolean
  created_at: string
}

export interface QuizSubmission {
  quiz_id: string
  enrollment_id: string
  answers: QuizAnswer[]
  total_time_seconds: number
  started_at: string
  completed_at?: string
}

export interface QuizAnswer {
  question_id: string
  selected_answer: number
  time_taken_seconds?: number
  confidence_level?: number
  hint_used?: boolean
}

export interface QuizResult {
  attempt: {
    id: string
    attempt_number: number
    score: number
    total_points: number
    score_percentage: number
    passed: boolean
    time_spent_minutes: number
    completed_at: string
  }
  quiz_info: {
    title: string
    passing_score: number
    attempts_allowed: number | null
    attempts_remaining: number | null
  }
  detailed_results: QuizQuestionResult[]
  performance_analysis: {
    accuracy: number
    average_time_per_question: number
    hints_used: number
    confidence_distribution: Record<number, number>
  }
  feedback: {
    overall_message: string
    improvement_suggestions: string[]
    next_steps: string[]
  }
  can_retry: boolean
}

export interface QuizQuestionResult {
  question_id: string
  question_text: string
  options: any[]
  selected_answer: number
  correct_answer: number
  is_correct: boolean
  points_earned: number
  max_points: number
  explanation: string | null
  time_taken_seconds: number | null
  confidence_level: number | null
  hint_used: boolean
}

export interface ContentBookmark {
  id: string
  user_id: string
  lesson_id: string
  bookmark_type: 'lesson' | 'section' | 'timestamp'
  timestamp_seconds: number | null
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UserNotification {
  id: string
  user_id: string
  notification_type: 'achievement_unlocked' | 'course_completed' | 'lesson_available' | 
                    'streak_milestone' | 'quiz_available' | 'reminder_study' | 'social_activity'
  title: string
  message: string
  action_url: string | null
  metadata: Record<string, any>
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_read: boolean
  is_delivered: boolean
  delivered_at: string | null
  expires_at: string | null
  created_at: string
}

export interface ProgressAnalytics {
  gamification: GamificationStats
  study_time: {
    total_minutes: number
    daily_average: number
    daily_data: Array<{
      date: string
      minutes: number
    }>
    streak: {
      current_streak: number
      longest_streak: number
    }
  }
  progress: {
    completion_rate: number
    total_lessons: number
    completed_lessons: number
    average_progress: number
  }
  quiz_performance: {
    total_attempts: number
    average_score: number
    best_score: number
    improvement_trend: number
  }
  recent_achievements: Array<Achievement & { unlocked_at: string }>
  insights: Array<{
    type: 'positive' | 'suggestion' | 'warning'
    title: string
    message: string
  }>
}

export interface Recommendation {
  type: 'study_time' | 'streak' | 'quiz_performance' | 'comprehension' | 'level_up'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface NearbyAchievement {
  achievement_id: string
  name: string
  description: string
  icon: string
  points: number
  progress_percentage: number
  progress_description: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

// Course Progress specific types
export interface CourseProgressDetail {
  enrollment: {
    id: string
    progress_percentage: number
    status: string
    enrolled_at: string
    calculated_progress: number
  }
  lessons: Array<{
    lesson: {
      id: string
      title: string
      slug: string
      order_index: number
      video_duration: number | null
      is_preview: boolean
    }
    progress: EnhancedProgress
    analytics: LessonAnalytics | null
  }>
  stats: {
    total_lessons: number
    completed_lessons: number
    progress_percentage: number
    total_study_time: number
    average_engagement: number
  }
  recent_activity: Array<{
    lesson_id: string
    session_start: string
    active_time_seconds: number
    lesson: {
      title: string
      slug: string
    }
  }>
}

// Update existing Progress interface to be more specific
export interface Progress extends EnhancedProgress {
  lesson?: {
    id: string
    title: string
    slug: string
    order_index: number
    video_duration: number | null
    is_preview: boolean
  }
}