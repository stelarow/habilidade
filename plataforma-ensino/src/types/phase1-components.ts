/**
 * TypeScript definitions for Phase 1 components
 * Centralized type definitions to ensure strict mode compliance
 */

// Base API response types
export interface BaseApiResponse {
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends BaseApiResponse {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Course and Lesson types
export interface Course {
  id: string
  title: string
  description: string
  slug: string
  thumbnail?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_minutes: number
  created_at: string
  updated_at: string
}

export interface LessonData {
  id: string
  title: string
  description?: string
  order_index: number
  video_duration?: number
  video_url?: string
  content_html?: string
  quiz_id?: string
  assignment_id?: string
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface LessonProgress {
  id: string
  lesson_id: string
  enrollment_id: string
  completed: boolean
  last_position: number
  progress_percentage: number
  watch_time_minutes: number
  is_unlocked: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface LessonWithProgress {
  lesson: LessonData
  progress: LessonProgress | null
}

export interface CourseStats {
  total_lessons: number
  completed_lessons: number
  progress_percentage: number
  total_study_time: number
  last_accessed_at?: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  status: 'active' | 'completed' | 'suspended'
  enrolled_at: string
  completed_at?: string
}

export interface CourseProgressData {
  enrollment: Enrollment
  lessons: LessonWithProgress[]
  stats: CourseStats
}

// Quiz types
export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank'
  options: string[]
  correct_answer: string
  explanation: string
  points: number
  order_index: number
}

export interface QuizData {
  id: string
  title: string
  description?: string
  lesson_id?: string
  time_limit_minutes?: number
  passing_score_percentage: number
  max_attempts?: number
  questions: QuizQuestion[]
}

export interface QuizSubmission {
  id: string
  quiz_id: string
  enrollment_id: string
  score: number
  percentage: number
  passed: boolean
  time_taken_seconds: number
  attempt_number: number
  started_at: string
  completed_at: string
}

export interface QuizAnswerSubmission {
  question_id: string
  selected_answer: string
  time_taken_seconds: number
}

export interface QuizSubmissionRequest {
  quiz_id: string
  enrollment_id: string
  answers: QuizAnswerSubmission[]
  total_time_seconds: number
  started_at: string
  completed_at: string
}

// User and Authentication types
export interface UserMetadata {
  full_name?: string
  avatar_url?: string
  preferred_language?: string
  timezone?: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata: UserMetadata
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  bio?: string
  avatar_url?: string
  role: 'student' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
}

// Gamification types
export interface GamificationStats {
  user_id: string
  current_level: number
  total_xp: number
  xp_to_next_level: number
  current_streak: number
  longest_streak: number
  badges_earned: number
  achievements_unlocked: number
  last_activity_date?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: 'course_completion' | 'streak' | 'time_spent' | 'quiz_master' | 'early_bird'
  requirement_value: number
  xp_reward: number
  badge_color: string
  is_active: boolean
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  current_progress: number
  is_unlocked: boolean
  unlocked_at?: string
  created_at: string
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  type: 'achievement' | 'reminder' | 'course_update' | 'system'
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
  read_at?: string
}

// User preferences types
export interface UserPreferences {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  language: 'pt' | 'en' | 'es'
  email_notifications: boolean
  push_notifications: boolean
  study_reminders: boolean
  preferred_study_time?: string
  timezone?: string
  created_at: string
  updated_at: string
}

// Progress update types
export interface ProgressUpdateRequest {
  lessonId: string
  enrollmentId: string
  lastPosition: number
  progressPercentage?: number
  completed?: boolean
  watchTime?: number
}

// Navigation types for components
export interface BreadcrumbItem {
  label: string
  href?: string
  isActive: boolean
}

export interface NavigationInfo {
  previousLesson?: {
    id: string
    title: string
    isLocked?: boolean
  }
  nextLesson?: {
    id: string
    title: string
    isLocked?: boolean
  }
}

// Content area types
export interface VideoContent {
  url: string
  thumbnail?: string
  duration?: number
  subtitles?: Array<{
    language: string
    url: string
  }>
}

export interface InteractiveContent {
  embedUrl: string
  embedType: 'canva' | 'figma' | 'miro' | 'google_slides' | 'custom'
  allowFullscreen: boolean
  sandbox?: string
}

export interface TextContent {
  html?: string
  markdown?: string
}

export interface ContentData {
  video?: VideoContent
  interactive?: InteractiveContent
  text?: TextContent
  quiz?: QuizData
}

// API Error types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
  status?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: ApiError
}

// Real-time subscription types
export interface RealtimeEvent<T = unknown> {
  event: string
  payload: T
  timestamp: string
}

export interface ProgressUpdateEvent {
  user_id: string
  lesson_id: string
  progress_percentage: number
  completed: boolean
}

export interface AchievementUnlockedEvent {
  user_id: string
  achievement_id: string
  achievement: Achievement
  xp_earned: number
}

export interface NotificationEvent {
  user_id: string
  notification: Notification
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Hook return types
export interface UseAuthReturn {
  user: AuthUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: ApiError | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

export interface UseCourseProgressReturn {
  data: CourseProgressData | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export interface UseUpdateProgressReturn {
  mutate: (request: ProgressUpdateRequest) => Promise<void>
  isLoading: boolean
  error: ApiError | null
}

export interface UseGamificationStatsReturn {
  data: GamificationStats | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}

export interface UseUserPreferencesReturn {
  preferences: UserPreferences | null
  isLoading: boolean
  error: ApiError | null
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>
}

// Real-time hook return types
export interface UseRealTimeProgressReturn {
  isConnected: boolean
  lastUpdate: ProgressUpdateEvent | null
  error: string | null
}

export interface UseRealTimeNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
}

export interface UseRealTimeAchievementsReturn {
  newAchievements: Achievement[]
  isConnected: boolean
  dismissAchievement: (achievementId: string) => void
}

// Component prop types with strict typing
export interface StrictComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

export interface LoadingState {
  isLoading: boolean
  error: ApiError | null
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrevious: boolean
}

// Export utility type for making properties required
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// Export utility type for making properties partial
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Export strict event handler types
export type StrictEventHandler<T = unknown> = (data: T) => void | Promise<void>
export type StrictVoidHandler = () => void | Promise<void>
export type StrictStringHandler = (value: string) => void | Promise<void>
export type StrictNumberHandler = (value: number) => void | Promise<void>
export type StrictBooleanHandler = (value: boolean) => void | Promise<void>