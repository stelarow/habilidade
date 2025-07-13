export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'student' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color_theme: string
  icon?: string
  background_type: string
  created_at: string
  updated_at: string
}

export interface Instructor {
  id: string
  user_id: string
  bio?: string
  expertise: string[]
  social_links: Record<string, string>
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
  user?: User
}

export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  short_description?: string
  thumbnail_url?: string
  video_preview_url?: string
  category_id?: string
  instructor_id?: string
  price: number
  duration_minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  requirements: string[]
  what_you_learn: string[]
  background_theme: string
  is_published: boolean
  created_at: string
  updated_at: string
  category?: Category
  instructor?: Instructor
  lessons?: Lesson[]
  stats?: CourseStats
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  description?: string
  video_url?: string
  video_duration: number
  order_index: number
  materials: Material[]
  content?: string // Rich text content for lesson materials/handouts
  allows_file_upload: boolean // Whether students can upload files
  transcript?: string
  is_preview: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  progress?: Progress
  exercises?: Exercise[]
  quizzes?: Quiz[]
  submissions?: LessonSubmission[]
}

export interface Material {
  type: 'pdf' | 'link' | 'text' | 'image' | 'subtitle'
  title: string
  url?: string
  content?: string
  size?: number
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at?: string
  access_until?: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  progress_percentage: number
  created_at: string
  updated_at: string
  course?: Course
  user?: User
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  enrollment_id: string
  completed: boolean
  last_position: number
  watch_time: number
  completed_at?: string
  created_at: string
  updated_at: string
  lesson?: Lesson
}

export interface Certificate {
  id: string
  user_id: string
  course_id: string
  enrollment_id: string
  certificate_url?: string
  issued_at: string
  verification_code: string
  created_at: string
  course?: Course
  user?: User
}

export interface Review {
  id: string
  user_id: string
  course_id: string
  rating: number
  comment?: string
  is_published: boolean
  created_at: string
  updated_at: string
  user?: User
  course?: Course
}

export interface AdminSettings {
  id: string
  key: string
  value: any
  description?: string
  created_at: string
  updated_at: string
}

export interface CourseStats {
  id: string
  title: string
  slug: string
  total_enrollments: number
  completed_enrollments: number
  average_rating: number
  total_reviews: number
  total_duration: number
}

export interface UserCourseProgress {
  user_id: string
  full_name: string
  course_id: string
  course_title: string
  course_slug: string
  enrolled_at: string
  progress_percentage: number
  status: string
  total_lessons: number
  completed_lessons: number
  total_watch_time: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  totalPages: number
  hasMore: boolean
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  remember?: boolean
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  terms: boolean
}

export interface CourseForm {
  title: string
  description: string
  short_description: string
  category_id: string
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
  requirements: string[]
  what_you_learn: string[]
  background_theme: string
  thumbnail_url?: string
  video_preview_url?: string
}

export interface LessonForm {
  title: string
  description: string
  video_url?: string
  content?: string
  materials: Material[]
  allows_file_upload: boolean
  is_preview: boolean
  order_index: number
}

// Video Player Types
export interface VideoPlayerProps {
  url: string
  poster?: string
  onProgress?: (progress: { played: number; playedSeconds: number }) => void
  onEnded?: () => void
  onStart?: () => void
  onPause?: () => void
  onPlay?: () => void
  onReady?: (player: any) => void
  controls?: boolean
  playing?: boolean
  muted?: boolean
  volume?: number
  playbackRate?: number
  width?: string | number
  height?: string | number
}

export interface VideoProgress {
  played: number
  playedSeconds: number
  loaded: number
  loadedSeconds: number
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  monthlyGrowth: {
    students: number
    courses: number
    enrollments: number
    revenue: number
  }
}

export interface RecentActivity {
  id: string
  type: 'enrollment' | 'completion' | 'review' | 'course_created'
  message: string
  user?: User
  course?: Course
  timestamp: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: 'free' | 'paid'
  rating?: number
  duration?: 'short' | 'medium' | 'long'
  sort?: 'newest' | 'oldest' | 'rating' | 'price_low' | 'price_high' | 'popular'
}

export interface SearchResult {
  courses: Course[]
  total: number
  filters: {
    categories: { id: string; name: string; count: number }[]
    levels: { level: string; count: number }[]
    priceRanges: { range: string; count: number }[]
  }
}

// Notification Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  created_at: string
  action?: {
    label: string
    url: string
  }
}

// Analytics Types
export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  averageSessionDuration: number
  topPages: { path: string; views: number }[]
  conversionRate: number
  revenueData: { date: string; amount: number }[]
  userGrowth: { date: string; users: number }[]
}

// State Management Types
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface CourseState {
  courses: Course[]
  currentCourse: Course | null
  loading: boolean
  error: string | null
  filters: SearchFilters
}

export interface ProgressState {
  progress: Record<string, Progress>
  currentLesson: Lesson | null
  videoProgress: VideoProgress
  loading: boolean
  error: string | null
}

// Theme Types
export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: {
    dark: string
    blue: string
  }
  text: {
    primary: string
    secondary: string
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type PickRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

// Exercise, Quiz and Submission Types
export interface Exercise {
  id: string
  lesson_id: string
  title: string
  description?: string
  download_url?: string
  order_index: number
  created_at: string
  updated_at: string
  lesson?: Lesson
}

export interface Quiz {
  id: string
  lesson_id: string
  title: string
  description?: string
  instructions?: string
  time_limit_minutes?: number
  attempts_allowed: number
  passing_score: number
  is_published: boolean
  created_at: string
  updated_at: string
  lesson?: Lesson
  questions?: QuizQuestion[]
  attempts?: QuizAttempt[]
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  points: number
  order_index: number
  created_at: string
  updated_at: string
  quiz?: Quiz
}

export interface LessonSubmission {
  id: string
  lesson_id: string
  user_id: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  created_at: string
  updated_at: string
  lesson?: Lesson
  user?: User
  reviewer?: User
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  answers: Record<string, number> // question_id -> selected_option_index
  score: number
  total_points: number
  passed: boolean
  attempt_number: number
  started_at: string
  completed_at?: string
  time_spent_minutes?: number
  created_at: string
  quiz?: Quiz
  user?: User
}

// Form Types for New Entities
export interface ExerciseForm {
  title: string
  description?: string
  download_url?: string
  order_index: number
}

export interface QuizForm {
  title: string
  description?: string
  instructions?: string
  time_limit_minutes?: number
  attempts_allowed: number
  passing_score: number
  is_published: boolean
}

export interface QuizQuestionForm {
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  points: number
  order_index: number
}

export interface LessonSubmissionForm {
  file: File
}

export interface QuizAttemptForm {
  answers: Record<string, number>
}

// Extended Lesson Form with all new features
export interface ExtendedLessonForm {
  // Basic lesson info
  title: string
  description?: string
  video_url?: string
  content?: string
  allows_file_upload: boolean
  materials: Material[]
  is_preview: boolean
  order_index: number
  
  // Exercises
  exercises: ExerciseForm[]
  
  // Quiz
  quiz?: {
    title: string
    description?: string
    instructions?: string
    time_limit_minutes?: number
    attempts_allowed: number
    passing_score: number
    questions: QuizQuestionForm[]
  }
}

// Blog Types
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  author_id: string
  category_id?: string
  tags: string[]
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
  author?: User
  category?: Category
}