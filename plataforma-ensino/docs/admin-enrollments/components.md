# Admin Enrollments Components Documentation

## Component Hierarchy & Relationships

This document provides a detailed breakdown of all components in the admin enrollments system, their relationships, props, and key functionality.

## Component Tree Structure

```
📁 /admin/enrollments/page.tsx
└── 📦 EnrollmentsManagementLazy
    └── 📦 EnrollmentsManagement
        ├── 📊 StatsCards
        ├── 🔍 SearchAndFilters
        ├── 📋 EnrollmentsTable
        │   ├── 👤 UserCell
        │   ├── 📚 CourseCell
        │   ├── 📈 ProgressCell
        │   └── ⚙️ ActionsCell
        ├── 📝 EnrollmentForm (Modal)
        │   ├── 👥 UserSelector
        │   ├── 🎓 CourseSelector
        │   └── 📅 SchedulingSection
        │       ├── 👨‍🏫 TeacherSelector
        │       └── 🗓️ SimplifiedWeeklySchedule
        └── 📊 ProgressModal
            └── 📚 LessonProgressList
```

## Core Components

### 1. EnrollmentsManagement (Main Container)

**File**: `/src/components/admin/EnrollmentsManagement.tsx`

**Purpose**: Primary container component that manages the entire enrollments interface.

#### Props Interface
```typescript
interface EnrollmentsManagementProps {
  enrollments: EnrollmentWithPopulated[]
  currentUser: User | UserProfile | null
}

interface EnrollmentWithPopulated {
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
  user: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  course: {
    id: string
    title: string
    thumbnail_url?: string
  }
}
```

#### Key State
```typescript
const [enrollments, setEnrollments] = useState(initialEnrollments)
const [searchTerm, setSearchTerm] = useState('')
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')
const [loading, setLoading] = useState(false)
const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)
const [enrollmentFormMode, setEnrollmentFormMode] = useState<'create' | 'remove'>('create')
const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithPopulated | null>(null)
const [showProgressModal, setShowProgressModal] = useState(false)
const [progressData, setProgressData] = useState<any[]>([])
```

#### Key Methods
- `handleStatusChange()`: Updates enrollment status
- `handleAddEnrollment()`: Opens form in create mode
- `handleRemoveEnrollment()`: Opens form in remove mode
- `handleEnrollmentSubmit()`: Processes form submission
- `handleManageProgress()`: Opens progress management modal
- `handleToggleLessonComplete()`: Updates individual lesson progress

#### UI Sections
1. **Header**: Title and "Add Enrollment" button
2. **Filters**: Search input and status filter dropdown
3. **Stats Cards**: Summary statistics (total, active, completed, cancelled)
4. **Table**: Main enrollments list with actions
5. **Modals**: Enrollment form and progress management

---

### 2. EnrollmentForm (Modal Interface)

**File**: `/src/components/admin/EnrollmentForm.tsx`

**Purpose**: Modal form for creating and editing enrollments with support for both online and in-person courses.

#### Props Interface
```typescript
interface EnrollmentFormProps {
  onSubmit: (enrollmentData: any) => Promise<void>
  onCancel: () => void
  loading: boolean
  mode: 'create' | 'remove'
  existingEnrollment?: Enrollment | null
}
```

#### Form Data Structure
```typescript
interface EnhancedEnrollmentFormData {
  user_id: string
  course_id: string
  teacher_id: string
  access_until: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  is_in_person: boolean
  has_two_classes_per_week: boolean
  schedule_slot_1: string
  schedule_slot_2: string
}
```

#### Key Features
- **Dual Mode**: Create or remove enrollments
- **Dynamic Validation**: Real-time form validation with Zod
- **Search Integration**: Debounced user/course search
- **Conditional Rendering**: In-person scheduling appears only when needed
- **Preview Mode**: Schedule selection without auto-submission
- **Enhanced Error Handling**: Toast notifications with detailed messages

#### Form Sections
1. **User Selection**: Searchable user picker with avatar display
2. **Course Selection**: Searchable course picker with thumbnails
3. **Access Control**: Optional access expiration date
4. **Status Management**: Enrollment status dropdown
5. **In-Person Options**: Conditional scheduling section

---

### 3. SchedulingSection (In-Person Enrollment)

**File**: `/src/components/scheduling/SchedulingSection.tsx`

**Purpose**: Handles complex scheduling interface for in-person course enrollments.

#### Props Interface
```typescript
interface SchedulingSectionProps {
  isVisible: boolean
  selectedCourse?: Course
  teacherId: string
  hasTwoClassesPerWeek: boolean
  previewMode?: boolean
  onTeacherChange: (teacherUserId: string) => void
  onTwoClassesChange: (checked: boolean) => void
  onLocalSelectionChange?: (selectedSlots: string[], formattedSlots: { slot1: string; slot2: string }) => void
  onSlotSelect?: (slot1: string, slot2: string) => void
}
```

#### Key Features
- **Teacher Selection**: Integration with TeacherSelector component
- **Schedule Visualization**: Weekly calendar with available time slots
- **Dual Class Support**: Option for two classes per week
- **Preview Mode**: Non-destructive slot selection
- **Validation Feedback**: Real-time validation status indicators

#### Conditional Logic
```typescript
// Only visible when in-person is selected
{isVisible && (
  <div className="space-y-4">
    <TeacherSelector />
    {teacherId && (
      <SimplifiedWeeklySchedule />
    )}
  </div>
)}
```

---

### 4. TeacherSelector (Instructor Selection)

**File**: `/src/components/enrollment/TeacherSelector.tsx`

**Purpose**: Advanced teacher selection component with course-specific filtering and availability checking.

#### Props Interface
```typescript
interface TeacherSelectorProps {
  selectedCourse?: Course
  selectedTeacherId?: string
  onTeacherSelect: (teacher: Teacher | null) => void
  disabled?: boolean
}

interface Teacher {
  id: string        // instructors.id
  userId: string    // users.id (for schedule queries)
  name: string
  email: string
  avatar_url?: string
  expertise: string[]
  rating: number
}
```

#### Key Features
- **Course Filtering**: Shows only teachers qualified for selected course
- **Availability Integration**: Displays teacher availability status
- **Search Functionality**: Filter teachers by name or expertise
- **Visual Indicators**: Rating display and availability status
- **Expertise Matching**: Highlights teachers with relevant expertise

#### Data Flow
1. Receives selected course from parent
2. Fetches teachers from instructors table
3. Filters by course compatibility
4. Displays with availability status
5. Returns both instructor.id and user.id to parent

---

### 5. SimplifiedWeeklySchedule (Calendar Interface)

**File**: `/src/components/enrollment/SimplifiedWeeklySchedule.tsx`

**Purpose**: Interactive weekly calendar showing teacher availability and allowing time slot selection.

#### Props Interface
```typescript
interface SimplifiedWeeklyScheduleProps {
  teacherId: string          // instructors.id for availability queries
  teacherUserId: string      // users.id for schedule creation
  selectedSlots: string[]
  maxSlots?: number
  previewMode?: boolean
  onSlotSelect: (slots: string[]) => void
  onFormattedSlotsChange?: (formatted: { slot1: string; slot2: string }) => void
}
```

#### Key Features
- **Weekly Grid**: 7-day calendar with hourly time slots
- **Availability Display**: Visual indicators for available/unavailable times
- **Conflict Detection**: Prevents double-booking of time slots
- **Multi-Selection**: Support for single or double weekly sessions
- **Preview Mode**: Visual selection without immediate submission
- **Responsive Design**: Adapts to different screen sizes

#### Time Slot Format
```typescript
// Format: "teacherUserId:dayOfWeek:startTime-endTime"
// Example: "355f9ed5-c838-4c66-8671-2cfbf87121fa:1:09:00-10:00"
const slotFormat = `${teacherUserId}:${dayOfWeek}:${startTime}-${endTime}`
```

#### Visual States
- **Available**: Green background, clickable
- **Selected**: Blue background with checkmark
- **Unavailable**: Gray background, disabled
- **Conflicted**: Red background for scheduling conflicts

---

## Utility Components

### 6. UserSelector (Search Interface)

**Purpose**: Searchable dropdown for user selection with avatar display.

#### Features
- Debounced search (300ms delay)
- Avatar image display
- Email and name filtering
- Loading states
- Selected user display with removal option

### 7. CourseSelector (Search Interface)

**Purpose**: Searchable dropdown for course selection with thumbnail display.

#### Features
- Course title and slug search
- Thumbnail image display
- Published courses only
- Loading states
- Selected course display with removal option

### 8. ProgressModal (Management Interface)

**Purpose**: Modal interface for managing individual lesson progress.

#### Features
- Lesson list with completion status
- Individual lesson toggle controls
- Progress calculation updates
- Completion date tracking
- Watch time display

## Component Communication Patterns

### Parent-Child Communication

```typescript
// Parent to Child (Props)
<EnrollmentForm
  mode="create"
  loading={loading}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>

// Child to Parent (Callbacks)
const handleSubmit = (data) => {
  // Process enrollment data
  onSubmit(data)
}
```

### State Management Patterns

```typescript
// Local State (Component-specific)
const [localState, setLocalState] = useState(initialValue)

// Lifted State (Shared between siblings)
const [sharedState, setSharedState] = useState(initialValue)

// Form State (React Hook Form)
const { register, handleSubmit, formState: { errors } } = useForm()
```

### Error Handling Patterns

```typescript
// Form-level errors
const [errors, setErrors] = useState<Record<string, string>>({})

// API-level errors
try {
  await submitForm(data)
} catch (error) {
  handleApiError(error)
}

// Toast notifications
const { toastError, toastSuccess } = useToast()
```

## Performance Considerations

### Lazy Loading
- **EnrollmentsManagementLazy**: Loads main component on demand
- **Component Splitting**: Large components split with React.lazy()

### Debouncing
- **Search Inputs**: 300ms debounce for user/course search
- **Form Validation**: Debounced validation to reduce API calls

### Memoization
- **User Lists**: Memoized expensive user filtering operations
- **Course Data**: Cached course information for repeated access

### Optimization Strategies

```typescript
// Debounced search
useEffect(() => {
  const timeoutId = setTimeout(loadUsers, 300)
  return () => clearTimeout(timeoutId)
}, [searchTerm])

// Memoized components
const MemoizedUserCell = React.memo(UserCell)

// Optimistic updates
const handleStatusChange = async (id, status) => {
  // Update UI immediately
  updateLocalState(id, status)
  
  try {
    // Then sync with server
    await updateServer(id, status)
  } catch (error) {
    // Revert on error
    revertLocalState(id)
  }
}
```

## Testing Considerations

### Component Testing
- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user workflow testing

### Test Files Structure
```
__tests__/
├── components/
│   ├── EnrollmentForm.test.tsx
│   ├── TeacherSelector.test.tsx
│   └── SimplifiedWeeklySchedule.test.tsx
└── integration/
    ├── enrollment-flow.test.tsx
    └── enrollment-components.test.tsx
```

This component documentation provides a comprehensive understanding of the enrollment system's UI architecture, enabling developers to effectively maintain and extend the functionality.