# Design Document

## Overview

This design document outlines the technical approach for recreating the lesson page interface based on the example provided in "Exemplo-pagina-aula". The goal is to maintain all existing functionality (progress tracking, completion flow, celebration animations) while adapting the visual interface to match the example design exactly.

## Architecture

### Component Structure

The redesigned lesson page will follow a layered architecture:

```
LessonPageRedesigned (New Main Component)
├── LessonHeaderRedesigned (New Header Component)
│   ├── Logo & Navigation
│   ├── Progress Indicators (Desktop)
│   └── Mobile Progress Row
├── LessonContentSections (New Content Layout)
│   ├── VideoSection
│   ├── PDFSection  
│   ├── ExercisesSection
│   ├── QuizSection
│   └── CompletionSection
└── EnhancedLessonCompletion (Existing - Reused)
    └── LessonCompletionCelebration (Existing - Reused)
```

### Integration Strategy

- **Preserve Existing Logic**: Maintain all existing hooks and completion logic ✅
- **New Visual Layer**: Create new components that wrap existing functionality ✅
- **Responsive Design**: Implement the exact responsive behavior from the example
- **State Management**: Reuse existing progress tracking and completion state ✅
- **Completion Integration**: Successfully integrated with `EnhancedLessonCompletion` wrapper ✅

## Components and Interfaces

### LessonPageRedesigned Component

```typescript
interface LessonPageRedesignedProps {
  lesson: {
    id: string
    title: string
    slug: string
    course: {
      id: string
      title: string
      slug: string
    }
  }
  progressData: LessonProgressData | null
  onExit?: () => void
  onLessonComplete?: () => void
}
```

**Key Features:**
- Fixed header with brand styling
- Container-based layout with proper spacing
- Card-based content sections
- Integration with existing completion flow

### LessonHeaderRedesigned Component

```typescript
interface LessonHeaderRedesignedProps {
  course: { title: string; slug: string }
  lesson: { title: string; slug: string }
  progressData: LessonProgressData | null
  onExit: () => void
}
```

**Design Elements:**
- Fixed positioning (`fixed top-0 left-0 right-0 z-50`)
- Brand colors: `bg-header-bg text-header-foreground`
- Logo: Gradient "H" with "Escola Habilidade" text
- Progress indicators with icons (Clock, FileText, Camera, Trophy)
- Responsive layout: Desktop full view, Mobile compact view

### Content Sections

#### VideoSection
- Aspect ratio video container (`aspect-video`)
- Play/Pause button overlay
- Progress bar at bottom
- Title and description below

#### PDFSection  
- Simulated PDF viewer area
- Progress tracking button
- Page counter display

#### ExercisesSection
- Two-column layout (Downloads | Uploads)
- File download buttons
- Drag-and-drop upload area
- Uploaded files list

#### QuizSection
- Question-by-question display
- Radio button selections
- Submit button
- Results display with score and badge

#### CompletionSection
- Criteria validation display
- Missing criteria warnings
- Success message when ready
- Completion button (enabled/disabled)

## Data Models

### Progress State Integration

The design will integrate with existing `LessonProgressData` structure:

```typescript
// Map existing data to UI elements
const mapProgressToUI = (progressData: LessonProgressData) => ({
  videoProgress: progressData.videoProgress?.percentageWatched || 0,
  pdfProgress: progressData.pdfProgress?.percentageRead || 0,
  exerciseProgress: progressData.exerciseProgress?.completionPercentage || 0,
  quizProgress: progressData.quizProgress?.score || 0,
  quizCompleted: progressData.quizProgress?.isCompleted || false
})
```

### Local State Management

```typescript
interface LessonUIState {
  // Video simulation
  isPlaying: boolean
  currentTime: number
  duration: number
  
  // PDF simulation  
  pdfProgress: number
  
  // Exercise uploads
  exerciseUploads: File[]
  
  // Quiz state
  quizAnswers: { [questionId: number]: number }
  quizScore: number
  quizCompleted: boolean
}
```

## Error Handling

### Progress Validation
- Validate completion criteria before enabling completion button
- Display clear error messages for missing requirements
- Provide visual feedback for each completion criterion

### File Upload Handling
- Validate file types and sizes
- Display upload progress and success states
- Handle upload errors gracefully

### Quiz Validation
- Ensure all questions are answered before submission
- Validate score calculation
- Handle quiz retry scenarios

## Testing Strategy

### Component Testing
- Unit tests for each new component
- Integration tests with existing completion flow
- Responsive design testing across breakpoints

### User Experience Testing
- Progress tracking accuracy
- Completion flow validation
- Mobile responsiveness
- Accessibility compliance

### Performance Testing
- Component rendering performance
- State update efficiency
- Memory usage optimization

## Implementation Approach

### Phase 1: Core Layout
1. Create `LessonPageRedesigned` main component
2. Implement `LessonHeaderRedesigned` with exact styling
3. Set up responsive container layout

### Phase 2: Content Sections
1. Implement `VideoSection` with simulation logic
2. Create `PDFSection` with progress tracking
3. Build `ExercisesSection` with file handling
4. Develop `QuizSection` with question flow

### Phase 3: Integration ✅ COMPLETED
1. ✅ Connect with existing `EnhancedLessonCompletion`
2. ✅ Integrate progress data mapping
3. ✅ Implement completion criteria validation
4. ✅ Test end-to-end flow

### Phase 4: Polish
1. Fine-tune responsive behavior
2. Add loading states and transitions
3. Implement accessibility features
4. Performance optimization

## Styling Guidelines

### Design System Integration ✅ ENHANCED
The lesson page redesign now uses a comprehensive design token system with CSS custom properties for maximum flexibility and maintainability:

#### Core Design Tokens
- **Semantic Colors**: `hsl(var(--background))`, `hsl(var(--foreground))`, `hsl(var(--card))`
- **Brand Colors**: `hsl(var(--primary))`, `hsl(var(--secondary))`, `hsl(var(--accent))`
- **State Colors**: `hsl(var(--success))`, `hsl(var(--warning))`, `hsl(var(--destructive))`
- **Component Colors**: `hsl(var(--header-bg))`, `hsl(var(--border))`, `hsl(var(--input))`

#### CSS Classes from Example
- `min-h-screen bg-background` - Uses semantic background token
- `fixed top-0 left-0 right-0 z-50 bg-header-bg text-header-foreground shadow-lg` - Header-specific tokens
- `container mx-auto px-4 py-3` - Responsive container
- `gradient-text` for brand elements - Maintains brand identity
- `gradient-button` for primary actions - Interactive elements
- `border-border/50` for card borders - Semantic border with opacity

#### Token System Benefits
- **Theme Support**: Automatic light/dark theme compatibility
- **Consistency**: Centralized color management across all components
- **Maintainability**: Single source of truth for design decisions
- **Accessibility**: Optimized contrast ratios built into tokens

### Responsive Breakpoints
- Mobile: `< 640px` - Compact header, stacked layout
- Tablet: `640px - 1024px` - Intermediate layout
- Desktop: `> 1024px` - Full header with all progress indicators

### Responsive Spacing Implementation
- **Top Padding**: `pt-32 sm:pt-28 lg:pt-20` - Accommodates fixed header height across breakpoints
- **Horizontal Padding**: `px-3 sm:px-4 lg:px-6` - Progressive spacing for different screen sizes
- **Vertical Padding**: `py-4 sm:py-6` - Responsive content spacing
- **Content Spacing**: `space-y-6 sm:space-y-8` - Adaptive spacing between sections

### Brand Integration
- Maintain Escola Habilidade brand colors through design tokens
- Use CSS custom properties for gradient definitions
- Preserve accessibility standards with semantic color tokens
- Follow design system patterns with token-based architecture