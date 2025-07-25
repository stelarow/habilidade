# API Design and Integration

## API Integration Strategy
**API Integration Strategy:** Extend existing `/api/` structure with new routes for scheduling features
**Authentication:** Use existing Supabase Auth middleware, admin-only routes protected
**Versioning:** No versioning needed - new endpoints only, no breaking changes

## New API Endpoints

### Holidays API

#### GET /api/holidays
**Purpose:** Retrieve holidays for date calculations and admin display
**Authentication:** Public read access, admin write access

**Request Query Parameters:**
```typescript
interface HolidaysQuery {
  year?: number;
  month?: number;
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
  isNational?: boolean;
}
```

**Response:**
```typescript
interface HolidaysResponse {
  holidays: Holiday[];
  total: number;
  year?: number;
}

interface Holiday {
  id: string;
  date: string; // ISO date
  name: string;
  year: number;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}
```

**Example Request:**
```http
GET /api/holidays?year=2025&month=3
```

**Example Response:**
```json
{
  "holidays": [
    {
      "id": "uuid-example",
      "date": "2025-03-03",
      "name": "Carnaval",
      "year": 2025,
      "is_national": true,
      "created_at": "2025-01-22T10:00:00Z",
      "updated_at": "2025-01-22T10:00:00Z"
    }
  ],
  "total": 1,
  "year": 2025
}
```

#### POST /api/holidays
**Purpose:** Create new holiday (Admin only)
**Authentication:** Admin role required

**Request Body:**
```typescript
interface CreateHolidayRequest {
  date: string; // ISO date
  name: string;
  year: number;
  is_national?: boolean;
}
```

#### PUT /api/holidays/[id]
**Purpose:** Update existing holiday (Admin only)
**Authentication:** Admin role required

#### DELETE /api/holidays/[id]
**Purpose:** Delete holiday (Admin only)
**Authentication:** Admin role required

### Teachers Availability API

#### GET /api/teachers/[id]/availability
**Purpose:** Get available time slots for specific teacher
**Authentication:** Public read access for active availability

**Request Query Parameters:**
```typescript
interface AvailabilityQuery {
  startDate: string; // ISO date
  endDate: string;   // ISO date
  dayOfWeek?: number; // 0-6
  includeHolidays?: boolean;
}
```

**Response:**
```typescript
interface AvailabilityResponse {
  teacherId: string;
  availability: DayAvailability[];
  holidays: Holiday[];
}

interface DayAvailability {
  date: string; // ISO date
  dayOfWeek: number;
  isHoliday: boolean;
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  maxStudents: number;
  availableSpots: number;
  isActive: boolean;
}
```

**Example Request:**
```http
GET /api/teachers/teacher-uuid/availability?startDate=2025-02-01&endDate=2025-02-28
```

**Example Response:**
```json
{
  "teacherId": "teacher-uuid",
  "availability": [
    {
      "date": "2025-02-03",
      "dayOfWeek": 1,
      "isHoliday": false,
      "timeSlots": [
        {
          "id": "slot-uuid",
          "startTime": "09:00",
          "endTime": "10:00",
          "maxStudents": 10,
          "availableSpots": 8,
          "isActive": true
        }
      ]
    }
  ],
  "holidays": []
}
```

#### POST /api/teachers/[id]/availability
**Purpose:** Create teacher availability slot (Teacher/Admin only)
**Authentication:** Teacher owns record or Admin role

**Request Body:**
```typescript
interface CreateAvailabilityRequest {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  maxStudents: number;
  isActive?: boolean;
}
```

#### PUT /api/teachers/[id]/availability/[slotId]
**Purpose:** Update availability slot (Teacher/Admin only)

#### DELETE /api/teachers/[id]/availability/[slotId]
**Purpose:** Delete availability slot (Teacher/Admin only)

### Course End Date Calculation API

#### POST /api/calculate-end-date
**Purpose:** Calculate course completion date considering holidays and teacher availability
**Authentication:** Authenticated users only

**Request Body:**
```typescript
interface CalculateEndDateRequest {
  startDate: string; // ISO date
  courseHours: number;
  weeklyClasses: number;
  teacherId: string;
  excludeHolidays?: boolean;
}
```

**Response:**
```typescript
interface CalculateEndDateResponse {
  endDate: string; // ISO date
  totalWeeks: number;
  holidaysExcluded: string[]; // ISO dates
  actualClassDays: number;
  schedule: ClassSchedule[];
}

interface ClassSchedule {
  date: string; // ISO date
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  duration: number; // minutes
}
```

**Example Request:**
```http
POST /api/calculate-end-date
Content-Type: application/json

{
  "startDate": "2025-02-03",
  "courseHours": 40,
  "weeklyClasses": 2,
  "teacherId": "teacher-uuid"
}
```

**Example Response:**
```json
{
  "endDate": "2025-04-28",
  "totalWeeks": 11,
  "holidaysExcluded": ["2025-03-03", "2025-03-04", "2025-04-18"],
  "actualClassDays": 20,
  "schedule": [
    {
      "date": "2025-02-03",
      "startTime": "09:00",
      "endTime": "11:00",
      "duration": 120
    }
  ]
}
```

## API Error Handling

### Standard Error Response Format
```typescript
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

### Common Error Codes
- `TEACHER_NOT_FOUND` - Teacher ID not found
- `NO_AVAILABILITY` - Teacher has no available time slots
- `HOLIDAY_CONFLICT` - Requested date conflicts with holiday
- `INVALID_DATE_RANGE` - Start date after end date
- `CAPACITY_EXCEEDED` - Time slot at maximum capacity
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `VALIDATION_ERROR` - Request data validation failed

### HTTP Status Codes
- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate holiday)
- `500 Internal Server Error` - Server error

## API Authentication & Authorization

### Authentication Flow
1. **Client Authentication**: Use existing Supabase Auth JWT tokens
2. **Token Validation**: Middleware validates JWT and extracts user info
3. **Role Extraction**: User role determined from JWT claims
4. **Permission Check**: Endpoint-specific permission validation

### Permission Matrix
| Endpoint | Public | Student | Teacher | Admin |
|----------|--------|---------|---------|-------|
| GET /api/holidays | ✅ | ✅ | ✅ | ✅ |
| POST /api/holidays | ❌ | ❌ | ❌ | ✅ |
| GET /api/teachers/{id}/availability | ✅ | ✅ | ✅ | ✅ |
| POST /api/teachers/{id}/availability | ❌ | ❌ | Own only | ✅ |
| POST /api/calculate-end-date | ❌ | ✅ | ✅ | ✅ |

### Rate Limiting
- **Public Endpoints**: 100 requests/hour per IP
- **Authenticated Endpoints**: 1000 requests/hour per user
- **Admin Endpoints**: 5000 requests/hour per admin
- **Calculation Endpoints**: 50 requests/minute per user (expensive operations)

## Integration with Existing Systems

### Middleware Integration
```typescript
// Use existing authentication middleware
import { authMiddleware } from '@/lib/middleware/auth';
import { adminOnlyMiddleware } from '@/lib/middleware/admin';

// Apply to new scheduling endpoints
export default authMiddleware(adminOnlyMiddleware(holidayHandler));
```

### Database Client Integration
```typescript
// Use existing Supabase client patterns
import { createServerClient } from '@/lib/supabase/server';
import { createBrowserClient } from '@/lib/supabase/client';

// Consistent error handling
import { handleApiError } from '@/lib/utils/error-handling';
```

### Logging and Monitoring
```typescript
// Integrate with existing Sentry error tracking
import { captureException } from '@sentry/nextjs';

// Use existing logging patterns
import { logger } from '@/lib/utils/logger';
```

## API Testing Strategy

### Unit Tests
- Request validation testing
- Response format testing
- Error handling testing
- Authentication/authorization testing

### Integration Tests
- Database integration testing
- Supabase client integration
- Middleware chain testing
- End-to-end API flow testing

### Performance Tests
- Load testing for availability queries
- Stress testing for date calculations
- Concurrent user testing
- Database query performance testing