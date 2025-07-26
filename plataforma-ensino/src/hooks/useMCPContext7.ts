/**
 * Custom hook for MCP Context7 documentation queries and best practices lookup
 * Story 2.2: UI Components Integration - Task 1
 * 
 * Provides easy access to Context7 documentation and React component patterns
 * with caching and error handling for optimal performance.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'

export interface MCPContext7Query {
  topic: string
  library?: string
  tokens?: number
}

export interface MCPContext7Response {
  content: string
  source: string
  timestamp: Date
  cached: boolean
}

export interface UseMCPContext7Options {
  enableCaching?: boolean
  cacheTimeout?: number // in milliseconds
  retryAttempts?: number
  retryDelay?: number // in milliseconds
}

export interface UseMCPContext7Return {
  queryDocumentation: (query: MCPContext7Query) => Promise<MCPContext7Response>
  loading: boolean
  error: string | null
  clearCache: () => void
  getCacheSize: () => number
  getLastQuery: () => MCPContext7Query | null
}

// Simple in-memory cache for documentation queries
interface CacheEntry {
  data: MCPContext7Response
  timestamp: number
  expiresAt: number
}

const documentationCache = new Map<string, CacheEntry>()

/**
 * Generate cache key from query parameters
 */
function generateCacheKey(query: MCPContext7Query): string {
  return `${query.library || 'react'}-${query.topic}-${query.tokens || 5000}`
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() < entry.expiresAt
}

/**
 * Simulate MCP Context7 query (for development/testing)
 * In production, this would use the actual MCP Context7 integration
 */
async function simulateMCPContext7Query(query: MCPContext7Query): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

  // Generate contextual documentation based on query topic
  const responses: Record<string, string> = {
    'react component composition patterns': `
# React Component Composition Patterns

## Best Practices for Teacher Selection Components

### 1. Compound Component Pattern
Use compound components for complex teacher selection interfaces:
\`\`\`tsx
<TeacherSelector>
  <TeacherSelector.Header />
  <TeacherSelector.Filters />
  <TeacherSelector.List />
  <TeacherSelector.Pagination />
</TeacherSelector>
\`\`\`

### 2. Render Props Pattern
For flexible teacher card rendering:
\`\`\`tsx
<TeacherList
  renderTeacher={(teacher) => (
    <CustomTeacherCard teacher={teacher} />
  )}
/>
\`\`\`

### 3. Custom Hooks Pattern
Extract teacher data logic:
\`\`\`tsx
function useTeacherSelection() {
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  return { selectedTeacher, setSelectedTeacher }
}
\`\`\`

### 4. Error Boundary Pattern
Wrap teacher components with error boundaries:
\`\`\`tsx
<ErrorBoundary fallback={<TeacherLoadError />}>
  <TeacherSelector />
</ErrorBoundary>
\`\`\`
    `,
    'calendar component implementation patterns': `
# Calendar Component Implementation Patterns

## Best Practices for Teacher Availability Calendars

### 1. Virtual Scrolling for Large Datasets
\`\`\`tsx
import { FixedSizeList as List } from 'react-window'

function CalendarMonth({ slots }) {
  return (
    <List
      height={400}
      itemCount={slots.length}
      itemSize={80}
    >
      {({ index, style }) => (
        <div style={style}>
          <TimeSlot slot={slots[index]} />
        </div>
      )}
    </List>
  )
}
\`\`\`

### 2. Optimized State Management
\`\`\`tsx
const calendarState = useReducer(calendarReducer, {
  currentMonth: new Date(),
  selectedSlots: [],
  availableSlots: [],
  loading: false
})
\`\`\`

### 3. Accessibility Implementation
\`\`\`tsx
<div
  role="grid"
  aria-label="Teacher availability calendar"
  className="calendar-grid"
>
  {slots.map(slot => (
    <button
      key={slot.id}
      role="gridcell"
      aria-label={\`Time slot \${slot.time}, \${slot.available ? 'available' : 'unavailable'}\`}
      aria-pressed={slot.selected}
      onClick={() => handleSlotSelect(slot)}
    >
      {slot.time}
    </button>
  ))}
</div>
\`\`\`

### 4. Performance Optimization
\`\`\`tsx
const MemoizedCalendarDay = React.memo(({ day, slots }) => (
  <div className="calendar-day">
    {slots.map(slot => (
      <TimeSlot key={slot.id} slot={slot} />
    ))}
  </div>
), (prevProps, nextProps) => {
  return prevProps.day === nextProps.day && 
         prevProps.slots.length === nextProps.slots.length
})
\`\`\`
    `,
    'react accessibility aria implementation': `
# React Accessibility and ARIA Implementation

## Comprehensive Guide for Interactive Components

### 1. Screen Reader Support
\`\`\`tsx
// Teacher card with full screen reader support
<div
  role="button"
  tabIndex={0}
  aria-label={\`Select teacher \${teacher.name}, rated \${teacher.rating} stars\`}
  aria-pressed={isSelected}
  onClick={handleSelect}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
    }
  }}
>
  <h3 aria-level={3}>{teacher.name}</h3>
  <div aria-label={\`Rating: \${teacher.rating} out of 5 stars\`}>
    {renderStars(teacher.rating)}
  </div>
</div>
\`\`\`

### 2. Focus Management
\`\`\`tsx
const focusRing = useFocusRing()
const { focusProps } = useFocus({
  onFocus: () => setFocused(true),
  onBlur: () => setFocused(false)
})

return (
  <button
    {...focusProps}
    className={clsx(
      'teacher-card',
      { 'focus-visible': focusRing.isFocusVisible }
    )}
  >
    {children}
  </button>
)
\`\`\`

### 3. Live Regions for Dynamic Updates
\`\`\`tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>
\`\`\`

### 4. Keyboard Navigation
\`\`\`tsx
const handleKeyNavigation = useCallback((e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
      selectNextTeacher()
      break
    case 'ArrowLeft':
      selectPreviousTeacher()
      break
    case 'Home':
      selectFirstTeacher()
      break
    case 'End':
      selectLastTeacher()
      break
  }
}, [])
\`\`\`

### 5. Color Contrast and Visual Indicators
\`\`\`tsx
// Ensure sufficient color contrast
const getSlotStatusColor = (available: boolean) => ({
  backgroundColor: available ? '#22c55e' : '#ef4444', // 4.5:1 contrast ratio
  color: '#ffffff',
  border: focused ? '2px solid #3b82f6' : '1px solid transparent'
})
\`\`\`
    `,
    'typescript interface design patterns': `
# TypeScript Interface Design Patterns

## Best Practices for Component Type Safety

### 1. Generic Interfaces for Reusability
\`\`\`tsx
interface SelectableItem<T> {
  id: string
  data: T
  selected: boolean
  disabled?: boolean
}

interface Selector<T> {
  items: SelectableItem<T>[]
  onSelect: (item: SelectableItem<T>) => void
  multiple?: boolean
}

// Usage
const teacherSelector: Selector<Teacher> = {
  items: teachers.map(teacher => ({
    id: teacher.id,
    data: teacher,
    selected: false
  })),
  onSelect: handleTeacherSelect
}
\`\`\`

### 2. Discriminated Unions for State
\`\`\`tsx
type TeacherSelectorState = 
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; teachers: Teacher[]; selectedTeacher?: Teacher }

const [state, setState] = useState<TeacherSelectorState>({ status: 'loading' })
\`\`\`

### 3. Conditional Props with Never Type
\`\`\`tsx
type TeacherCardProps = {
  teacher: Teacher
} & (
  | { selectable: true; onSelect: (teacher: Teacher) => void }
  | { selectable?: false; onSelect?: never }
)
\`\`\`

### 4. Utility Types for API Responses
\`\`\`tsx
type ApiResponse<T> = {
  data: T
  status: 'success'
} | {
  error: string
  status: 'error'
}

type TeacherApiResponse = ApiResponse<Teacher[]>
\`\`\`

### 5. Branded Types for IDs
\`\`\`tsx
type TeacherId = string & { __brand: 'TeacherId' }
type StudentId = string & { __brand: 'StudentId' }

// Type-safe ID handling
function getTeacher(id: TeacherId): Teacher | undefined {
  return teachers.find(t => t.id === id)
}
\`\`\`
    `
  }

  // Find best matching response
  const queryLower = query.topic.toLowerCase()
  const matchingKey = Object.keys(responses).find(key => 
    queryLower.includes(key) || key.includes(queryLower)
  )

  if (matchingKey) {
    return responses[matchingKey]
  }

  // Generic response for unrecognized queries
  return `
# React Best Practices for ${query.topic}

Based on your query about "${query.topic}", here are some general React best practices:

## 1. Component Design
- Keep components small and focused on a single responsibility
- Use TypeScript for better type safety and developer experience
- Implement proper error boundaries for robust error handling

## 2. Performance Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize re-renders with proper dependency arrays

## 3. Accessibility
- Include proper ARIA labels and roles
- Ensure keyboard navigation support
- Maintain sufficient color contrast ratios

## 4. Testing
- Write unit tests for component logic
- Include integration tests for user flows
- Test accessibility with automated tools

For more specific guidance on "${query.topic}", please refine your query or check the React documentation.
  `
}

/**
 * Enhanced hook for MCP Context7 documentation queries with caching and error handling
 */
export function useMCPContext7(options: UseMCPContext7Options = {}): UseMCPContext7Return {
  const {
    enableCaching = true,
    cacheTimeout = 300000, // 5 minutes
    retryAttempts = 3,
    retryDelay = 1000
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<MCPContext7Query | null>(null)

  /**
   * Query documentation with caching and retry logic
   */
  const queryDocumentation = useCallback(async (query: MCPContext7Query): Promise<MCPContext7Response> => {
    const cacheKey = generateCacheKey(query)
    
    // Check cache first
    if (enableCaching) {
      const cachedEntry = documentationCache.get(cacheKey)
      if (cachedEntry && isCacheValid(cachedEntry)) {
        logDebug('Returning cached documentation for:', query.topic)
        return {
          ...cachedEntry.data,
          cached: true
        }
      }
    }

    setLoading(true)
    setError(null)
    setLastQuery(query)

    let attempts = 0
    
    while (attempts < retryAttempts) {
      try {
        logDebug(`Querying MCP Context7 (attempt ${attempts + 1}):`, query.topic)
        
        // In a real implementation, this would use the actual MCP Context7 API
        // For now, we'll use our simulation
        const content = await simulateMCPContext7Query(query)
        
        const response: MCPContext7Response = {
          content,
          source: `MCP Context7 - ${query.library || 'React'}`,
          timestamp: new Date(),
          cached: false
        }

        // Cache the response
        if (enableCaching) {
          documentationCache.set(cacheKey, {
            data: response,
            timestamp: Date.now(),
            expiresAt: Date.now() + cacheTimeout
          })
        }

        setLoading(false)
        return response

      } catch (err) {
        attempts++
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        
        if (attempts >= retryAttempts) {
          setError(`Failed to query documentation after ${retryAttempts} attempts: ${errorMessage}`)
          setLoading(false)
          throw new Error(`MCP_CONTEXT7_ERROR: ${errorMessage}`)
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempts))
      }
    }

    // This shouldn't be reached, but TypeScript requires it
    throw new Error('Unexpected error in documentation query')
  }, [enableCaching, cacheTimeout, retryAttempts, retryDelay])

  /**
   * Clear all cached documentation
   */
  const clearCache = useCallback(() => {
    documentationCache.clear()
    logDebug('Documentation cache cleared')
  }, [])

  /**
   * Get current cache size
   */
  const getCacheSize = useCallback(() => {
    return documentationCache.size
  }, [])

  /**
   * Get last query made
   */
  const getLastQuery = useCallback(() => {
    return lastQuery
  }, [lastQuery])

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of documentationCache.entries()) {
        if (!isCacheValid(entry)) {
          documentationCache.delete(key)
        }
      }
    }, 60000) // Clean every minute

    return () => clearInterval(cleanup)
  }, [])

  return {
    queryDocumentation,
    loading,
    error,
    clearCache,
    getCacheSize,
    getLastQuery
  }
}

/**
 * Convenience hook for common React documentation queries
 */
export function useReactDocumentation() {
  const context7 = useMCPContext7()

  const getComponentPatterns = useCallback(async (componentType: string) => {
    return context7.queryDocumentation({
      topic: `react ${componentType} component patterns`,
      library: 'react',
      tokens: 3000
    })
  }, [context7])

  const getAccessibilityGuidance = useCallback(async (componentType?: string) => {
    return context7.queryDocumentation({
      topic: `react accessibility aria implementation${componentType ? ` for ${componentType}` : ''}`,
      library: 'react',
      tokens: 4000
    })
  }, [context7])

  const getTypeScriptPatterns = useCallback(async (pattern: string) => {
    return context7.queryDocumentation({
      topic: `typescript ${pattern} interface design patterns`,
      library: 'react',
      tokens: 3000
    })
  }, [context7])

  return {
    ...context7,
    getComponentPatterns,
    getAccessibilityGuidance,
    getTypeScriptPatterns
  }
}