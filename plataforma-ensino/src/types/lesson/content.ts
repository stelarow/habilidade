// Lesson Content Types for Adaptive Layout System
// Part of Fase 1: Arquitetura e Fundação

export interface VideoData {
  url: string
  duration: number
  thumbnail?: string
  playbackId?: string // For Mux or other video services
  aspectRatio?: number
  captions?: string
}

export interface PDFData {
  id?: string
  url: string
  title: string
  filename: string
  size: number // in bytes
  pageCount?: number
  downloadable: boolean
}

export interface ExerciseData {
  id: string
  title: string
  description?: string
  downloadUrl?: string
  fileName?: string
  fileSize?: number
  orderIndex: number
  status?: 'not_started' | 'in_progress' | 'completed'
  allowsUpload: boolean
  uploadInstructions?: string
}

export interface QuizData {
  id: string
  title: string
  description?: string
  timeLimit?: number // in minutes
  attemptsAllowed: number
  passingScore: number
  totalQuestions: number
  status?: 'not_started' | 'in_progress' | 'completed' | 'passed' | 'failed'
  lastScore?: number
  remainingAttempts?: number
}

export interface MaterialData {
  type: 'pdf' | 'link' | 'text' | 'image' | 'subtitle' | 'document'
  title: string
  url?: string
  content?: string
  size?: number
  downloadable?: boolean
  description?: string
}

// Main lesson content interface
export interface LessonContent {
  id: string
  title: string
  description?: string
  video?: VideoData
  pdf?: PDFData
  exercises?: ExerciseData[]
  quiz?: QuizData
  content?: string // Rich text/HTML content
  materials?: MaterialData[]
  transcript?: string
  estimatedDuration?: number // in minutes
}

// Content priority system
export enum ContentPriority {
  VERY_HIGH = 'very_high', // Video, Quiz (when active)
  HIGH = 'high',           // PDF (when no video), Main content
  MEDIUM = 'medium',       // Exercises, Materials
  LOW = 'low'              // Transcript, Additional materials
}

export interface ContentPriorityMap {
  video: ContentPriority.VERY_HIGH
  quiz: ContentPriority.VERY_HIGH
  pdf: ContentPriority.HIGH
  content: ContentPriority.HIGH
  exercises: ContentPriority.MEDIUM
  materials: ContentPriority.MEDIUM
  transcript: ContentPriority.LOW
}

// Component availability checker
export interface ContentAvailability {
  hasVideo: boolean
  hasPDF: boolean
  hasQuiz: boolean
  hasExercises: boolean
  hasContent: boolean
  hasMaterials: boolean
  hasTranscript: boolean
}

// Helper function type for determining content availability
export type ContentAvailabilityChecker = (content: LessonContent) => ContentAvailability

// Layout calculation helper
export interface LayoutCalculation {
  primaryContent: 'video' | 'pdf' | 'content' | null
  sidebarContent: ('quiz' | 'materials' | 'exercises')[]
  bottomContent: ('exercises' | 'transcript' | 'materials')[]
  layoutState: 'video-primary' | 'pdf-primary' | 'content-only' | 'minimal'
}

export type LayoutCalculator = (content: LessonContent) => LayoutCalculation