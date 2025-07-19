# Design Document

## Overview

The lesson header responsive fix will implement a flexible layout system that adapts to different screen sizes while maintaining the Habilidade brand identity. The solution will use CSS Grid and Flexbox to create a responsive header that prevents text wrapping and overlap issues.

## Architecture

### Component Structure
```
LessonHeader
├── LogoSection (fixed width)
├── ProgressSection (flexible, responsive)
│   ├── VideoProgress
│   ├── MaterialProgress  
│   └── ExerciseProgress
└── ActionSection (fixed width)
    └── ExitButton
```

### Layout Strategy
- **CSS Grid**: Main header container with three columns (logo, progress, actions)
- **Flexbox**: Progress section for flexible item arrangement
- **Media Queries**: Breakpoint-based responsive behavior
- **Text Truncation**: Ellipsis for overflow text with tooltips

## Components and Interfaces

### LessonHeaderResponsive Component
```typescript
interface LessonHeaderProps {
  courseTitle: string
  lessonTitle: string
  videoProgress: number
  materialProgress: number
  exerciseProgress: number
  onExit: () => void
  className?: string
}

interface ProgressItemProps {
  label: string
  shortLabel: string
  progress: number
  color: string
  compact?: boolean
}
```

### Responsive Breakpoints
- **Desktop**: >= 1024px - Full layout with all text
- **Tablet**: 768px - 1023px - Compact labels, maintained spacing
- **Mobile**: < 768px - Minimal layout, possible hamburger menu

## Data Models

### Progress Display Configuration
```typescript
interface ProgressConfig {
  desktop: {
    showFullLabels: true
    showPercentages: true
    layout: 'horizontal'
  }
  tablet: {
    showFullLabels: false
    showPercentages: true
    layout: 'horizontal'
  }
  mobile: {
    showFullLabels: false
    showPercentages: false
    layout: 'compact'
  }
}
```

## Error Handling

### Layout Overflow Protection
- **Text Overflow**: Implement CSS `text-overflow: ellipsis` with `overflow: hidden`
- **Container Overflow**: Use `min-width: 0` on flex items to allow shrinking
- **Fallback Layout**: Graceful degradation for unsupported browsers

### Responsive Failure Handling
- **Media Query Fallback**: Default to mobile layout if queries fail
- **JavaScript Enhancement**: Optional JS for advanced responsive features
- **Progressive Enhancement**: Core functionality works without JS

## Testing Strategy

### Visual Regression Testing
- Screenshot comparison across different viewport sizes
- Cross-browser compatibility testing
- Device-specific testing (iOS Safari, Android Chrome)

### Responsive Testing Approach
```typescript
// Test breakpoints
const breakpoints = [
  { name: 'mobile', width: 375 },
  { name: 'tablet', width: 768 },
  { name: 'desktop', width: 1024 },
  { name: 'wide', width: 1440 }
]

// Test scenarios
const scenarios = [
  'short-course-title',
  'long-course-title',
  'very-long-lesson-title',
  'all-progress-100',
  'mixed-progress-values'
]
```

### Unit Testing
- Component rendering at different screen sizes
- Progress calculation and display
- Tooltip functionality
- Button accessibility

## Implementation Details

### CSS Grid Layout
```css
.lesson-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: "logo progress actions";
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
}

@media (max-width: 768px) {
  .lesson-header {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
  }
}
```

### Progress Section Responsive Behavior
```css
.progress-section {
  display: flex;
  gap: 1rem;
  align-items: center;
  min-width: 0; /* Allow shrinking */
}

@media (max-width: 1024px) {
  .progress-section {
    gap: 0.5rem;
  }
  
  .progress-item-label {
    display: none;
  }
  
  .progress-item-short {
    display: inline;
  }
}

@media (max-width: 768px) {
  .progress-section {
    flex-direction: column;
    gap: 0.25rem;
  }
}
```

### Text Truncation with Tooltips
```typescript
const TruncatedText: React.FC<{text: string, maxLength: number}> = ({text, maxLength}) => {
  const shouldTruncate = text.length > maxLength
  const displayText = shouldTruncate ? `${text.slice(0, maxLength)}...` : text
  
  return (
    <span title={shouldTruncate ? text : undefined}>
      {displayText}
    </span>
  )
}
```

## Design Decisions

### Layout Approach
- **CSS Grid over Flexbox** for main container: Better control over three-column layout
- **Flexbox for progress section**: Better for dynamic content arrangement
- **Fixed-width logo and actions**: Ensures consistent branding and button accessibility

### Responsive Strategy
- **Content-first approach**: Prioritize essential information at smaller sizes
- **Progressive disclosure**: Hide less critical elements on smaller screens
- **Touch-friendly targets**: Maintain 44px minimum touch targets on mobile

### Performance Considerations
- **CSS-only solution**: Avoid JavaScript for basic responsive behavior
- **Minimal media queries**: Use efficient breakpoint strategy
- **Hardware acceleration**: Use transform properties for smooth animations

## Accessibility

### Screen Reader Support
- Proper ARIA labels for progress indicators
- Semantic HTML structure
- Focus management for interactive elements

### Keyboard Navigation
- Tab order preservation across responsive layouts
- Keyboard shortcuts for exit functionality
- Focus indicators that work at all screen sizes

### Color and Contrast
- Maintain Habilidade brand colors while ensuring WCAG compliance
- High contrast mode compatibility
- Color-blind friendly progress indicators