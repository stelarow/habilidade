-- Migration 003: Add exercises, quizzes, and lesson extensions
-- Created: 2025-07-13
-- Purpose: Extend lessons with exercises, quizzes, content, and file upload capabilities

-- Add new fields to lessons table
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS allows_file_upload BOOLEAN DEFAULT FALSE;

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    download_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, order_index),
    CONSTRAINT exercises_order_check CHECK (order_index >= 1)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    time_limit_minutes INTEGER DEFAULT NULL,
    attempts_allowed INTEGER DEFAULT 1,
    passing_score INTEGER DEFAULT 70,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT quizzes_time_limit_check CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0),
    CONSTRAINT quizzes_attempts_check CHECK (attempts_allowed > 0),
    CONSTRAINT quizzes_passing_score_check CHECK (passing_score >= 0 AND passing_score <= 100)
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(quiz_id, order_index),
    CONSTRAINT quiz_questions_correct_answer_check CHECK (correct_answer >= 0),
    CONSTRAINT quiz_questions_points_check CHECK (points > 0),
    CONSTRAINT quiz_questions_order_check CHECK (order_index >= 1),
    CONSTRAINT quiz_questions_options_check CHECK (jsonb_array_length(options) >= 2)
);

-- Create lesson submissions table (for student file uploads)
CREATE TABLE IF NOT EXISTS public.lesson_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lesson_id, user_id),
    CONSTRAINT lesson_submissions_file_size_check CHECK (file_size > 0)
);

-- Create quiz attempts table (for tracking student quiz attempts)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT quiz_attempts_score_check CHECK (score >= 0),
    CONSTRAINT quiz_attempts_total_points_check CHECK (total_points > 0),
    CONSTRAINT quiz_attempts_attempt_number_check CHECK (attempt_number > 0),
    CONSTRAINT quiz_attempts_time_spent_check CHECK (time_spent_minutes IS NULL OR time_spent_minutes >= 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercises_order_index ON public.exercises(order_index);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order_index ON public.quiz_questions(order_index);
CREATE INDEX IF NOT EXISTS idx_lesson_submissions_lesson_id ON public.lesson_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_submissions_user_id ON public.lesson_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_submissions_status ON public.lesson_submissions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_exercises_updated_at 
    BEFORE UPDATE ON public.exercises 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at 
    BEFORE UPDATE ON public.quizzes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON public.quiz_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_submissions_updated_at 
    BEFORE UPDATE ON public.lesson_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Exercises policies
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by enrolled users or admins"
    ON public.exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            JOIN public.courses c ON l.course_id = c.id
            JOIN public.enrollments e ON c.id = e.course_id
            WHERE l.id = lesson_id 
            AND (e.user_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor')))
        )
    );

CREATE POLICY "Exercises are manageable by admins and instructors"
    ON public.exercises FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

-- Quizzes policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quizzes are viewable by enrolled users or admins"
    ON public.quizzes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            JOIN public.courses c ON l.course_id = c.id
            JOIN public.enrollments e ON c.id = e.course_id
            WHERE l.id = lesson_id 
            AND (e.user_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor')))
        )
    );

CREATE POLICY "Quizzes are manageable by admins and instructors"
    ON public.quizzes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

-- Quiz questions policies
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by enrolled users or admins"
    ON public.quiz_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.lessons l ON q.lesson_id = l.id
            JOIN public.courses c ON l.course_id = c.id
            JOIN public.enrollments e ON c.id = e.course_id
            WHERE q.id = quiz_id 
            AND (e.user_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'instructor')))
        )
    );

CREATE POLICY "Quiz questions are manageable by admins and instructors"
    ON public.quiz_questions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

-- Lesson submissions policies
ALTER TABLE public.lesson_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions and admins can view all"
    ON public.lesson_submissions FOR SELECT
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

CREATE POLICY "Users can create their own submissions"
    ON public.lesson_submissions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own submissions, admins can update all"
    ON public.lesson_submissions FOR UPDATE
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

-- Quiz attempts policies
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts and admins can view all"
    ON public.quiz_attempts FOR SELECT
    USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'instructor')
        )
    );

CREATE POLICY "Users can create their own quiz attempts"
    ON public.quiz_attempts FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON public.exercises TO authenticated;
GRANT ALL ON public.quizzes TO authenticated;
GRANT ALL ON public.quiz_questions TO authenticated;
GRANT ALL ON public.lesson_submissions TO authenticated;
GRANT ALL ON public.quiz_attempts TO authenticated;

-- Create helper function to get next exercise order index
CREATE OR REPLACE FUNCTION public.get_next_exercise_order(lesson_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_order INTEGER;
BEGIN
    SELECT COALESCE(MAX(order_index), 0) + 1
    INTO next_order
    FROM public.exercises
    WHERE lesson_id = lesson_uuid;
    
    RETURN next_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get next lesson order index for a course
CREATE OR REPLACE FUNCTION public.get_next_lesson_order(course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_order INTEGER;
BEGIN
    SELECT COALESCE(MAX(order_index), 0) + 1
    INTO next_order
    FROM public.lessons
    WHERE course_id = course_uuid;
    
    RETURN next_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get next quiz question order index
CREATE OR REPLACE FUNCTION public.get_next_question_order(quiz_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_order INTEGER;
BEGIN
    SELECT COALESCE(MAX(order_index), 0) + 1
    INTO next_order
    FROM public.quiz_questions
    WHERE quiz_id = quiz_uuid;
    
    RETURN next_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION public.get_next_exercise_order(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_next_lesson_order(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_next_question_order(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.exercises IS 'Exercises associated with lessons, including downloadable files and instructions';
COMMENT ON TABLE public.quizzes IS 'Quizzes for lessons with configurable settings and time limits';
COMMENT ON TABLE public.quiz_questions IS 'Questions for quizzes with multiple choice options and correct answers';
COMMENT ON TABLE public.lesson_submissions IS 'File submissions from students for lesson assignments';
COMMENT ON TABLE public.quiz_attempts IS 'Records of student quiz attempts with scores and completion status';

COMMENT ON COLUMN public.lessons.content IS 'Rich text content for lesson materials and handouts';
COMMENT ON COLUMN public.lessons.allows_file_upload IS 'Whether students can upload files for this lesson';