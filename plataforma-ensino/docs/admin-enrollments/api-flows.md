# Admin Enrollments API Flows Documentation

## API Endpoints Overview

The admin enrollments system provides a comprehensive REST API for managing student enrollments, progress tracking, and related operations.

## Core API Endpoints

### 1. Enrollment Management

#### GET /api/admin/enrollments
**Purpose**: Retrieve paginated list of enrollments with filtering capabilities.

**Authentication**: Requires admin role

**Query Parameters**:
```typescript
{
  page?: number        // Default: 1
  limit?: number       // Default: 10, Max: 100
  search?: string      // Search in user name, email, course title
  status?: 'active' | 'completed' | 'cancelled' | 'expired'
  course_id?: string   // Filter by specific course
  user_id?: string     // Filter by specific user
}
```

**Response Format**:
```typescript
{
  data: EnrollmentWithPopulated[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasMore: boolean
  }
}

interface EnrollmentWithPopulated {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed_at?: string
  access_until?: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  modality: 'online' | 'in-person'
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
    slug: string
    thumbnail_url?: string
    duration_minutes: number
    category: {
      name: string
      color_theme: string
    }
    instructor: {
      id: string
      user: {
        full_name: string
      }
    }
  }
}
```

**Example Request**:
```bash
GET /api/admin/enrollments?page=1&limit=20&status=active&search=maria
```

---

#### POST /api/admin/enrollments
**Purpose**: Create new enrollment (supports both enhanced and legacy formats).

**Authentication**: Requires admin role

**Request Body (Enhanced Format - Preferred)**:
```typescript
{
  student_id: string,           // UUID of the student
  course_id: string,            // UUID of the course
  start_date: string,           // Format: YYYY-MM-DD
  modality: 'online' | 'in-person',
  schedules?: Array<{
    instructor_id: string,      // users.id (NOT instructors.id)
    day_of_week: number,        // 1=Monday, 7=Sunday
    start_time: string,         // Format: HH:MM:SS
    end_time: string           // Format: HH:MM:SS
  }>
}
```

**Request Body (Legacy Format - Backward Compatibility)**:
```typescript
{
  user_id: string,
  course_id: string,
  teacher_id?: string,
  access_until?: string,
  status?: 'active' | 'completed' | 'cancelled' | 'expired',
  is_in_person: boolean,
  has_two_classes_per_week: boolean,
  schedule_slot_1?: string,    // Format: "userId:day:HH:MM-HH:MM"
  schedule_slot_2?: string
}
```

**Response Format**:
```typescript
{
  data: {
    ...EnrollmentWithPopulated,
    schedules: Array<{
      id: string,
      enrollment_id: string,
      instructor_id: string,
      day_of_week: number,
      start_time: string,
      end_time: string,
      created_at: string
    }>
  },
  message: string
}
```

**Example Request (Enhanced)**:
```bash
POST /api/admin/enrollments
Content-Type: application/json

{
  "student_id": "123e4567-e89b-12d3-a456-426614174000",
  "course_id": "987fcdeb-51a2-43d1-b123-123456789abc",
  "start_date": "2025-01-28",
  "modality": "in-person",
  "schedules": [
    {
      "instructor_id": "355f9ed5-c838-4c66-8671-2cfbf87121fa",
      "day_of_week": 1,
      "start_time": "09:00:00",
      "end_time": "10:00:00"
    }
  ]
}
```

---

#### PUT /api/admin/enrollments/[id]
**Purpose**: Update existing enrollment.

**Authentication**: Requires admin role

**Request Body**:
```typescript
{
  status?: 'active' | 'completed' | 'cancelled' | 'expired',
  access_until?: string,
  completed_at?: string,
  progress_percentage?: number
}
```

---

#### DELETE /api/admin/enrollments/[id]
**Purpose**: Remove enrollment and associated schedules.

**Authentication**: Requires admin role

**Response**: 204 No Content on success

---

### 2. Progress Management

#### GET /api/admin/progress
**Purpose**: Retrieve progress data for specific enrollment.

**Query Parameters**:
```typescript
{
  enrollment_id: string,  // Required
  user_id?: string       // Optional filter
}
```

**Response Format**:
```typescript
{
  data: Array<{
    lesson: {
      id: string,
      title: string,
      description: string,
      order_index: number,
      video_duration: number
    },
    progress: {
      id?: string,
      user_id: string,
      lesson_id: string,
      enrollment_id: string,
      completed: boolean,
      last_position: number,
      watch_time: number,
      completed_at?: string,
      created_at?: string,
      updated_at?: string
    }
  }>
}
```

---

#### POST /api/admin/progress
**Purpose**: Update or create lesson progress.

**Request Body**:
```typescript
{
  user_id: string,
  lesson_id: string,
  enrollment_id: string,
  completed: boolean,
  last_position?: number,
  watch_time?: number,
  completed_at?: string
}
```

---

### 3. Supporting Endpoints

#### GET /api/calculate-end-date
**Purpose**: Calculate course end date based on start date and holidays.

**Query Parameters**:
```typescript
{
  start_date: string,     // Format: YYYY-MM-DD
  duration_weeks: number, // Course duration in weeks
  exclude_holidays?: boolean // Default: true
}
```

**Response Format**:
```typescript
{
  end_date: string,      // Format: YYYY-MM-DD
  total_days: number,
  working_days: number,
  holidays_excluded: Array<{
    date: string,
    name: string,
    type: string
  }>
}
```

---

## Data Flow Diagrams

### 1. Enrollment Creation Flow

```
┌─────────────┐    1. Form Submit    ┌─────────────┐    2. Validate    ┌─────────────┐
│ Admin UI    │─────────────────────▶│ API Route   │──────────────────▶│ Validation  │
│ (Form)      │                      │ POST /api/  │                   │ (Zod)       │
└─────────────┘                      │ admin/      │                   └─────────────┘
                                     │ enrollments │                           │
                                     └─────────────┘                           │
                                             │                                 │
                                             ▼                                 │
┌─────────────┐    5. Response       ┌─────────────┐    3. Business    ┌─────────────┐
│ Admin UI    │◀─────────────────────│ Database    │    Logic &        │ Business    │
│ (Updated)   │                      │ Operations  │    Auth Check     │ Logic       │
└─────────────┘                      └─────────────┘                   └─────────────┘
                                             ▲                                 │
                                             │                                 │
                                             └─────────────────────────────────┘
                                                      4. DB Operations
```

### 2. Progress Management Flow

```
┌─────────────┐    1. View Progress  ┌─────────────┐    2. Fetch Data   ┌─────────────┐
│ Admin       │─────────────────────▶│ Progress    │───────────────────▶│ Database    │
│ Interface   │                      │ Modal       │                    │ Queries     │
└─────────────┘                      └─────────────┘                    └─────────────┘
      │                                      │                                  │
      │                                      ▼                                  │
      │                              ┌─────────────┐    3. Join Tables  ┌─────────────┐
      │                              │ Lesson      │◀───────────────────│ lessons +   │
      │                              │ Progress    │                    │ progress    │
      │                              │ Display     │                    │ tables      │
      │                              └─────────────┘                    └─────────────┘
      │                                      │
      │    5. Update Progress                │
      └──────────────────────────────────────┘
                                             │
                                             ▼
                                     ┌─────────────┐    4. Calculate    ┌─────────────┐
                                     │ POST /api/  │    Progress %      │ Update      │
                                     │ admin/      │───────────────────▶│ Enrollment  │
                                     │ progress    │                    │ Percentage  │
                                     └─────────────┘                    └─────────────┘
```

### 3. In-Person Scheduling Flow

```
┌─────────────┐    1. Select Course  ┌─────────────┐    2. Filter       ┌─────────────┐
│ Enrollment  │─────────────────────▶│ Teacher     │    Teachers        │ Database    │
│ Form        │                      │ Selector    │───────────────────▶│ instructors │
└─────────────┘                      └─────────────┘                    │ table       │
      │                                      │                          └─────────────┘
      │                                      ▼                                  │
      │    4. Select Time Slots      ┌─────────────┐    3. Load         ┌─────────────┐
      └─────────────────────────────▶│ Weekly      │    Availability    │ teacher_    │
                                     │ Schedule    │◀───────────────────│ availability│
                                     │ Component   │                    │ table       │
                                     └─────────────┘                    └─────────────┘
                                             │
                                             ▼
                                     ┌─────────────┐    5. Create       ┌─────────────┐
                                     │ Form        │    Enrollment +    │ enrollments │
                                     │ Submission  │    Schedule        │ + student_  │
                                     │ (API Call)  │───────────────────▶│ schedules   │
                                     └─────────────┘                    │ tables      │
                                                                        └─────────────┘
```

## Error Handling Flows

### 1. Validation Error Flow

```
┌─────────────┐    Invalid Data      ┌─────────────┐    Zod Error       ┌─────────────┐
│ Client      │─────────────────────▶│ API Route   │───────────────────▶│ Error       │
│ Request     │                      │ Validation  │                    │ Response    │
└─────────────┘                      └─────────────┘                    └─────────────┘
      ▲                                                                          │
      │                                                                          ▼
┌─────────────┐    Display Errors     ┌─────────────┐    Format Errors   ┌─────────────┐
│ UI Error    │◀─────────────────────│ Client      │◀───────────────────│ 400 Bad     │
│ Display     │                      │ Error       │                    │ Request     │
└─────────────┘                      │ Handler     │                    └─────────────┘
                                     └─────────────┘
```

### 2. Business Logic Error Flow

```
┌─────────────┐    Valid Data        ┌─────────────┐    Check Rules     ┌─────────────┐
│ Client      │─────────────────────▶│ Business    │───────────────────▶│ Database    │
│ Request     │                      │ Logic       │                    │ Validation  │
└─────────────┘                      └─────────────┘                    └─────────────┘
                                             │                                  │
                                             ▼                                  │
                                     ┌─────────────┐    Constraint      ┌─────────────┐
                                     │ Rule        │    Violation       │ Database    │
                                     │ Violation   │◀───────────────────│ Error       │
                                     │ (e.g.,      │                    │ (e.g., FK   │
                                     │ duplicate)  │                    │ constraint) │
                                     └─────────────┘                    └─────────────┘
                                             │
                                             ▼
                                     ┌─────────────┐    Friendly        ┌─────────────┐
                                     │ Error       │    Error Message   │ Client      │
                                     │ Response    │───────────────────▶│ Error       │
                                     │ 400/409     │                    │ Display     │
                                     └─────────────┘                    └─────────────┘
```

## Authentication & Authorization Flow

### Admin Route Protection

```
┌─────────────┐    1. Request        ┌─────────────┐    2. Check        ┌─────────────┐
│ Client      │─────────────────────▶│ Middleware  │    Session         │ Supabase    │
│ Request     │                      │ (Admin      │───────────────────▶│ Auth        │
└─────────────┘                      │ Routes)     │                    └─────────────┘
                                     └─────────────┘                            │
                                             │                                  │
                                             ▼                                  │
┌─────────────┐    4. Response       ┌─────────────┐    3. Verify       ┌─────────────┐
│ Authorized  │◀─────────────────────│ API Route   │    Admin Role      │ User        │
│ Access      │                      │ Handler     │◀───────────────────│ Profile     │
└─────────────┘                      └─────────────┘                    └─────────────┘
      │                                      │
      │    5. Unauthorized Access            │
      ▼                                      ▼
┌─────────────┐                      ┌─────────────┐
│ 401/403     │                      │ requireAdmin│
│ Error       │                      │ () Helper   │
└─────────────┘                      └─────────────┘
```

## Database Transaction Patterns

### 1. Enrollment Creation with Schedules

```sql
BEGIN;

-- 1. Create enrollment
INSERT INTO enrollments (user_id, course_id, modality, status)
VALUES ($1, $2, $3, 'active')
RETURNING id;

-- 2. Create associated schedules (if in-person)
INSERT INTO student_schedules (enrollment_id, instructor_id, day_of_week, start_time, end_time)
VALUES ($1, $2, $3, $4, $5), ($1, $6, $7, $8, $9);

-- 3. Initialize progress records
INSERT INTO progress (user_id, lesson_id, enrollment_id, completed, last_position, watch_time)
SELECT $1, l.id, $2, false, 0, 0
FROM lessons l
WHERE l.course_id = $3 AND l.is_published = true;

COMMIT;
```

### 2. Rollback on Error

```typescript
// API Route Error Handling
try {
  const { data: enrollment } = await supabase
    .from('enrollments')
    .insert(enrollmentData)
    .select()
    .single()

  if (schedules.length > 0) {
    const { error: scheduleError } = await supabase
      .from('student_schedules')
      .insert(schedules)
    
    if (scheduleError) {
      // Rollback enrollment creation
      await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollment.id)
      
      throw scheduleError
    }
  }
} catch (error) {
  return NextResponse.json({ error: 'Transaction failed' }, { status: 500 })
}
```

## Performance Optimization Patterns

### 1. Efficient Queries with Joins

```sql
-- Single query to fetch enrollment with related data
SELECT 
  e.*,
  u.id as user_id, u.full_name, u.email, u.avatar_url,
  c.id as course_id, c.title, c.slug, c.thumbnail_url,
  cat.name as category_name, cat.color_theme,
  i.id as instructor_id, iu.full_name as instructor_name
FROM enrollments e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN courses c ON e.course_id = c.id
LEFT JOIN categories cat ON c.category_id = cat.id
LEFT JOIN instructors i ON c.instructor_id = i.id
LEFT JOIN users iu ON i.user_id = iu.id
WHERE e.status = 'active'
ORDER BY e.enrolled_at DESC;
```

### 2. Paginated Responses

```typescript
// API Route Pagination
const offset = (page - 1) * limit
const query = supabase
  .from('enrollments')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)
  .order('enrolled_at', { ascending: false })
```

### 3. Caching Strategy

```typescript
// Client-side caching for frequently accessed data
const useCachedData = (key: string, fetcher: () => Promise<any>) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const cached = localStorage.getItem(key)
    if (cached) {
      setData(JSON.parse(cached))
      setLoading(false)
    } else {
      fetcher().then(result => {
        setData(result)
        localStorage.setItem(key, JSON.stringify(result))
        setLoading(false)
      })
    }
  }, [key])
  
  return { data, loading }
}
```

This API documentation provides comprehensive guidance for understanding and working with the admin enrollments API, including data flows, error handling, and optimization patterns.