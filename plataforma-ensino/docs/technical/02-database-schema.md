# Database Schema Documentation

## Overview

The Stelarow Habilidade platform uses Supabase PostgreSQL with Row Level Security (RLS) for data management. The schema is designed for educational content management with multi-role access control.

## Database Architecture

### Core Principles
- **Row Level Security (RLS)**: All tables implement fine-grained access control
- **Audit Trail**: Comprehensive tracking of data changes
- **Data Integrity**: Foreign key constraints and check constraints
- **Performance**: Strategic indexing and query optimization
- **Extensibility**: JSONB fields for flexible metadata storage

## Core Tables

### 1. Users Table
```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "notifications": true,
        "language": "pt-BR",
        "reduced_motion": false
    }'::jsonb,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

**TypeScript Definition:**
```typescript
export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'student' | 'instructor' | 'admin'
  created_at: string
  updated_at: string
  last_login?: string
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
    reduced_motion: boolean
  }
}
```

**RLS Policies:**
```sql
-- Users can see and update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can see all users
CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

### 2. Categories Table
```sql
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color_theme TEXT NOT NULL DEFAULT '#d400ff',
    icon TEXT,
    background_type TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Background Types:**
- `default`: Standard gradient background
- `tech`: Technology-focused styling
- `business`: Business/admin styling
- `creative`: Creative/design styling

### 3. Instructors Table
```sql
CREATE TABLE public.instructors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    expertise TEXT[],
    social_links JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    availability_status TEXT DEFAULT 'available',
    hourly_rate NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Social Links Structure:**
```typescript
interface SocialLinks {
  linkedin?: string
  twitter?: string
  github?: string
  website?: string
  youtube?: string
}
```

### 4. Courses Table
```sql
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    video_preview_url TEXT,
    category_id UUID REFERENCES public.categories(id),
    instructor_id UUID REFERENCES public.instructors(id),
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 0,
    level course_level DEFAULT 'beginner',
    requirements TEXT[],
    what_you_learn TEXT[],
    background_theme TEXT DEFAULT 'default',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Course Levels:**
- `beginner`: No prior experience required
- `intermediate`: Some experience recommended
- `advanced`: Significant experience required

### 5. Lessons Table
```sql
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    video_duration INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    materials JSONB DEFAULT '[]'::jsonb,
    content TEXT,
    allows_file_upload BOOLEAN DEFAULT false,
    transcript TEXT,
    is_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, slug),
    UNIQUE(course_id, order_index)
);
```

**Materials Structure:**
```typescript
interface Material {
  type: 'pdf' | 'link' | 'text' | 'image' | 'subtitle'
  title: string
  url?: string
  content?: string
  size?: number
}
```

### 6. Enrollments Table
```sql
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    access_until TIMESTAMP WITH TIME ZONE,
    status enrollment_status DEFAULT 'active',
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    modality TEXT DEFAULT 'online', -- 'online' or 'in-person'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);
```

### 7. Student Schedules Table (For In-Person Classes)
```sql
CREATE TABLE public.student_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES public.users(id),
    day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_time > start_time)
);
```

### 8. Progress Tracking Table
```sql
CREATE TABLE public.progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    last_position INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);
```

## Advanced Features Tables

### 9. Exercises Table
```sql
CREATE TABLE public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    download_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Quizzes Table
```sql
CREATE TABLE public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit_minutes INTEGER,
    attempts_allowed INTEGER DEFAULT 3,
    passing_score NUMERIC(5,2) DEFAULT 70.00,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 11. Quiz Questions Table
```sql
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    points NUMERIC(5,2) DEFAULT 1.00,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (correct_answer >= 0 AND correct_answer < array_length(options, 1))
);
```

### 12. Quiz Attempts Table
```sql
CREATE TABLE public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    total_points NUMERIC(5,2) NOT NULL,
    passed BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Blog System Tables

### 13. Posts Table
```sql
CREATE TABLE public.posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    author_id UUID REFERENCES public.users(id),
    category_id UUID REFERENCES public.categories(id),
    tags TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Scheduling System Tables

### 14. Holidays Table
```sql
CREATE TABLE public.holidays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'national' CHECK (type IN ('national', 'regional', 'institutional')),
    description TEXT,
    affects_scheduling BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 15. Teacher Availability Table
```sql
CREATE TABLE public.teacher_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 1 AND day_of_week <= 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    max_students INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_time > start_time)
);
```

## Monitoring & Audit Tables

### 16. Audit Logs Table
```sql
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES public.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
```

### 17. System Alerts Table
```sql
CREATE TABLE public.system_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('error', 'warning', 'info', 'success')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Database Functions

### 1. User Registration Trigger
```sql
-- Automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Progress Calculation Function
```sql
CREATE OR REPLACE FUNCTION calculate_enrollment_progress(enrollment_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage NUMERIC;
BEGIN
  -- Get total lessons for the course
  SELECT COUNT(*) INTO total_lessons
  FROM lessons l
  JOIN enrollments e ON l.course_id = e.course_id
  WHERE e.id = enrollment_uuid AND l.is_published = true;

  -- Get completed lessons for the user
  SELECT COUNT(*) INTO completed_lessons
  FROM progress p
  JOIN enrollments e ON p.enrollment_id = e.id
  WHERE e.id = enrollment_uuid AND p.completed = true;

  -- Calculate progress percentage
  IF total_lessons > 0 THEN
    progress_percentage := (completed_lessons::NUMERIC / total_lessons::NUMERIC) * 100;
  ELSE
    progress_percentage := 0;
  END IF;

  -- Update enrollment progress
  UPDATE enrollments 
  SET progress_percentage = progress_percentage,
      updated_at = NOW()
  WHERE id = enrollment_uuid;

  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Indexes and Performance

### Critical Indexes
```sql
-- Performance indexes
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, order_index);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX idx_posts_status_published ON posts(status, published_at) WHERE status = 'published';

-- Text search indexes
CREATE INDEX idx_courses_title_search ON courses USING gin(to_tsvector('portuguese', title));
CREATE INDEX idx_posts_content_search ON posts USING gin(to_tsvector('portuguese', title || ' ' || content));
```

## Data Migration Patterns

### Schema Updates
```sql
-- Example migration pattern
DO $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'preferences'
  ) THEN
    -- Add new column
    ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;
```

### Data Seeding
```sql
-- Seed categories
INSERT INTO categories (name, slug, color_theme, background_type) VALUES
  ('Programação', 'programacao', '#00d4aa', 'tech'),
  ('Design Gráfico', 'design-grafico', '#ff6b35', 'creative'),
  ('Marketing Digital', 'marketing-digital', '#4ecdc4', 'business')
ON CONFLICT (slug) DO NOTHING;
```

## Backup and Recovery

### Backup Strategy
1. **Automated Backups**: Supabase daily backups
2. **Point-in-Time Recovery**: Available for 7 days
3. **Manual Backups**: Before major migrations
4. **Data Export**: CSV/JSON export capabilities

### Recovery Procedures
```sql
-- Example recovery query
SELECT * FROM audit_logs 
WHERE table_name = 'users' 
  AND action = 'DELETE' 
  AND timestamp > NOW() - INTERVAL '1 hour';
```

## Troubleshooting Common Issues

### 1. RLS Policy Issues
```sql
-- Check effective policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';
```

### 2. Performance Issues
```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 3. Connection Issues
```sql
-- Check active connections
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';
```

This comprehensive database schema provides the foundation for all platform operations while maintaining data integrity, security, and performance.