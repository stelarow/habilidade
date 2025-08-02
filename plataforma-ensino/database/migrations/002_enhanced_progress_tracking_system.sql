-- Enhanced Progress Tracking System Migration
-- This migration creates all tables referenced in the API routes but missing from the database
-- Version: 2.0
-- Date: 2025-08-02

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- UI Preferences
    theme TEXT DEFAULT 'violet-dark' CHECK (theme IN ('violet-dark', 'light', 'dark', 'high-contrast')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'extra-large')),
    reduced_motion BOOLEAN DEFAULT false,
    high_contrast BOOLEAN DEFAULT false,
    
    -- Learning Preferences
    auto_advance BOOLEAN DEFAULT false,
    show_progress BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Gamification Preferences
    show_achievements BOOLEAN DEFAULT true,
    show_leaderboard BOOLEAN DEFAULT true,
    public_profile BOOLEAN DEFAULT false,
    
    -- Study Settings
    reminder_frequency TEXT DEFAULT 'daily' CHECK (reminder_frequency IN ('none', 'daily', 'weekly', 'custom')),
    study_goal_minutes INTEGER DEFAULT 30 CHECK (study_goal_minutes BETWEEN 1 AND 480),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- =====================================================
-- ACHIEVEMENTS SYSTEM
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Information
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('learning', 'engagement', 'mastery', 'social', 'streak', 'exploration')),
    
    -- Visual & Gamification
    icon TEXT NOT NULL,
    badge_color TEXT DEFAULT '#8b5cf6',
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    
    -- Achievement Logic
    criteria JSONB NOT NULL, -- Flexible criteria definition
    is_active BOOLEAN DEFAULT true,
    is_hidden BOOLEAN DEFAULT false, -- Hidden until unlocked
    requires_achievements UUID[], -- Prerequisites
    
    -- Ordering & Display
    sort_order INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for performance
    CHECK (criteria ? 'type' AND criteria ? 'target')
);

-- User Achievements Junction Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Achievement Progress
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    progress_data JSONB DEFAULT '{}', -- Stores progress details when unlocked
    notified BOOLEAN DEFAULT false, -- Whether user was notified
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- USER GAMIFICATION STATS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_gamification_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Level & Experience
    current_level INTEGER DEFAULT 1 CHECK (current_level >= 1),
    total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
    xp_current_level INTEGER DEFAULT 0, -- XP in current level
    xp_next_level INTEGER DEFAULT 100, -- XP needed for next level
    
    -- Learning Stats
    courses_completed INTEGER DEFAULT 0 CHECK (courses_completed >= 0),
    lessons_completed INTEGER DEFAULT 0 CHECK (lessons_completed >= 0),
    total_study_minutes INTEGER DEFAULT 0 CHECK (total_study_minutes >= 0),
    
    -- Streak Tracking
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    last_study_date DATE,
    
    -- Quiz Performance
    quizzes_completed INTEGER DEFAULT 0 CHECK (quizzes_completed >= 0),
    quiz_average_score DECIMAL(5,2) DEFAULT 0.00 CHECK (quiz_average_score BETWEEN 0 AND 100),
    perfect_quiz_count INTEGER DEFAULT 0 CHECK (perfect_quiz_count >= 0),
    
    -- Engagement Metrics
    login_streak INTEGER DEFAULT 0 CHECK (login_streak >= 0),
    total_login_days INTEGER DEFAULT 0 CHECK (total_login_days >= 0),
    last_login_date DATE,
    
    -- Social Features
    leaderboard_position INTEGER,
    achievements_unlocked INTEGER DEFAULT 0 CHECK (achievements_unlocked >= 0),
    badges_earned INTEGER DEFAULT 0 CHECK (badges_earned >= 0),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id)
);

-- =====================================================
-- LESSON ANALYTICS
-- =====================================================
CREATE TABLE IF NOT EXISTS lesson_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    
    -- Progress Tracking
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Time Tracking
    total_time_seconds INTEGER DEFAULT 0 CHECK (total_time_seconds >= 0),
    active_time_seconds INTEGER DEFAULT 0 CHECK (active_time_seconds >= 0),
    video_watch_time_seconds INTEGER DEFAULT 0 CHECK (video_watch_time_seconds >= 0),
    
    -- Engagement Metrics
    pause_count INTEGER DEFAULT 0 CHECK (pause_count >= 0),
    replay_count INTEGER DEFAULT 0 CHECK (replay_count >= 0),
    speed_changes INTEGER DEFAULT 0 CHECK (speed_changes >= 0),
    
    -- Content Interaction
    video_interactions JSONB DEFAULT '{}', -- Seek, pause, speed changes, etc.
    content_interactions JSONB DEFAULT '{}', -- Clicks, hovers, downloads, etc.
    
    -- Learning Assessment
    comprehension_score DECIMAL(5,2) CHECK (comprehension_score BETWEEN 0 AND 100),
    completion_quality TEXT CHECK (completion_quality IN ('skipped', 'rushed', 'normal', 'thorough')),
    difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
    
    -- Additional Data
    device_type TEXT, -- mobile, tablet, desktop
    browser_info TEXT,
    network_quality TEXT, -- excellent, good, poor
    
    -- Notes & Bookmarks
    notes TEXT,
    bookmarked BOOLEAN DEFAULT false,
    bookmark_timestamps INTEGER[], -- Array of seconds where bookmarks were placed
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, lesson_id, enrollment_id)
);

-- =====================================================
-- USER NOTIFICATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Notification Content
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('achievement', 'progress', 'reminder', 'system', 'social', 'course')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Notification Data
    data JSONB DEFAULT '{}', -- Additional context data
    action_url TEXT, -- Optional action URL
    action_text TEXT, -- Optional action button text
    
    -- Status Tracking
    read_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    
    -- Delivery Channels
    email_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    in_app_shown BOOLEAN DEFAULT false,
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUIZ RESPONSES (Individual question responses)
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Response Data
    answer_data JSONB NOT NULL, -- Stores the actual answer(s)
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
    max_points INTEGER NOT NULL CHECK (max_points > 0),
    
    -- Timing Information
    time_spent_seconds INTEGER DEFAULT 0 CHECK (time_spent_seconds >= 0),
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Analysis Data
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5), -- User's confidence rating
    difficulty_perceived INTEGER CHECK (difficulty_perceived BETWEEN 1 AND 5), -- User's difficulty rating
    
    -- Additional Context
    hint_used BOOLEAN DEFAULT false,
    attempts_made INTEGER DEFAULT 1 CHECK (attempts_made >= 1),
    feedback_shown BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(quiz_attempt_id, question_id)
);

-- =====================================================
-- CONTENT BOOKMARKS
-- =====================================================
CREATE TABLE IF NOT EXISTS content_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Content Reference
    content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'course', 'module', 'quiz', 'resource')),
    content_id UUID NOT NULL,
    
    -- Bookmark Details
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    
    -- Position Tracking (for videos, etc.)
    position_seconds INTEGER DEFAULT 0,
    position_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Categorization
    folder TEXT, -- User-defined folder
    tags TEXT[], -- User-defined tags
    notes TEXT,
    
    -- Quick Access
    is_favorite BOOLEAN DEFAULT false,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, content_type, content_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User Preferences Indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_theme ON user_preferences(theme);
CREATE INDEX IF NOT EXISTS idx_user_preferences_notifications ON user_preferences(email_notifications, push_notifications);

-- Achievements Indexes
CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_points ON achievements(points DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_criteria_type ON achievements USING GIN ((criteria->>'type'));

-- User Achievements Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_notified ON user_achievements(notified) WHERE notified = false;

-- User Gamification Stats Indexes
CREATE INDEX IF NOT EXISTS idx_user_gamification_stats_user_id ON user_gamification_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_stats_level ON user_gamification_stats(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_stats_xp ON user_gamification_stats(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_stats_streak ON user_gamification_stats(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_user_gamification_stats_last_study ON user_gamification_stats(last_study_date);

-- Lesson Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_user_id ON lesson_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_lesson_id ON lesson_analytics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_enrollment_id ON lesson_analytics(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_completed_at ON lesson_analytics(completed_at);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_last_accessed ON lesson_analytics(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_lesson_analytics_bookmarked ON lesson_analytics(bookmarked) WHERE bookmarked = true;

-- User Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read_at ON user_notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_priority ON user_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_user_notifications_unread ON user_notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_notifications_expires_at ON user_notifications(expires_at);

-- Quiz Responses Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_responses_attempt_id ON quiz_responses(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_question_id ON quiz_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_is_correct ON quiz_responses(is_correct);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_responded_at ON quiz_responses(responded_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_points_earned ON quiz_responses(points_earned DESC);

-- Content Bookmarks Indexes
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_user_id ON content_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_content_type ON content_bookmarks(content_type);
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_content_id ON content_bookmarks(content_id);
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_favorite ON content_bookmarks(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_folder ON content_bookmarks(folder);
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_tags ON content_bookmarks USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_content_bookmarks_access_count ON content_bookmarks(access_count DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_bookmarks ENABLE ROW LEVEL SECURITY;

-- User Preferences Policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Achievements Policies (Public Read)
CREATE POLICY "Anyone can view active achievements" ON achievements
    FOR SELECT USING (is_active = true);

-- Admin can manage achievements
CREATE POLICY "Admins can manage achievements" ON achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- User Achievements Policies
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user achievements" ON user_achievements
    FOR INSERT WITH CHECK (true); -- Controlled by application logic

CREATE POLICY "Users can update own achievement progress" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User Gamification Stats Policies
CREATE POLICY "Users can view own stats" ON user_gamification_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_gamification_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_gamification_stats
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public leaderboard view (if enabled in preferences)
CREATE POLICY "Public leaderboard view" ON user_gamification_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_preferences up 
            WHERE up.user_id = user_gamification_stats.user_id 
            AND up.show_leaderboard = true 
            AND up.public_profile = true
        )
    );

-- Lesson Analytics Policies
CREATE POLICY "Users can view own analytics" ON lesson_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON lesson_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON lesson_analytics
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Instructors can view analytics for their courses
CREATE POLICY "Instructors can view course analytics" ON lesson_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enrollments e 
            JOIN courses c ON c.id = e.course_id 
            WHERE e.id = lesson_analytics.enrollment_id 
            AND c.instructor_id = auth.uid()
        )
    );

-- User Notifications Policies
CREATE POLICY "Users can view own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON user_notifications
    FOR INSERT WITH CHECK (true); -- Controlled by application logic

CREATE POLICY "Users can update own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON user_notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Quiz Responses Policies
CREATE POLICY "Users can view own quiz responses" ON quiz_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses" ON quiz_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz responses" ON quiz_responses
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Instructors can view responses for their courses
CREATE POLICY "Instructors can view course quiz responses" ON quiz_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quiz_attempts qa
            JOIN quizzes q ON q.id = qa.quiz_id
            JOIN lessons l ON l.id = q.lesson_id
            JOIN modules m ON m.id = l.module_id
            JOIN courses c ON c.id = m.course_id
            WHERE qa.id = quiz_responses.quiz_attempt_id
            AND c.instructor_id = auth.uid()
        )
    );

-- Content Bookmarks Policies
CREATE POLICY "Users can view own bookmarks" ON content_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON content_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON content_bookmarks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON content_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level_from_xp(total_xp INTEGER)
RETURNS TABLE(level INTEGER, xp_current INTEGER, xp_next INTEGER) AS $$
DECLARE
    current_level INTEGER := 1;
    xp_for_level INTEGER := 100; -- Base XP for level 2
    remaining_xp INTEGER := total_xp;
BEGIN
    -- Calculate level using exponential growth: level_xp = 100 * (level^1.5)
    WHILE remaining_xp >= xp_for_level LOOP
        remaining_xp := remaining_xp - xp_for_level;
        current_level := current_level + 1;
        xp_for_level := FLOOR(100 * (current_level ^ 1.5));
    END LOOP;
    
    RETURN QUERY SELECT 
        current_level,
        remaining_xp,
        xp_for_level;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user gamification stats
CREATE OR REPLACE FUNCTION update_user_gamification_stats(
    p_user_id UUID,
    p_xp_gained INTEGER DEFAULT 0,
    p_lesson_completed BOOLEAN DEFAULT false,
    p_course_completed BOOLEAN DEFAULT false,
    p_quiz_score DECIMAL DEFAULT NULL,
    p_study_minutes INTEGER DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
    current_stats RECORD;
    new_level_data RECORD;
    today_date DATE := CURRENT_DATE;
BEGIN
    -- Get or create current stats
    INSERT INTO user_gamification_stats (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    SELECT * INTO current_stats
    FROM user_gamification_stats
    WHERE user_id = p_user_id;
    
    -- Calculate new totals
    UPDATE user_gamification_stats SET
        total_xp = total_xp + p_xp_gained,
        lessons_completed = CASE WHEN p_lesson_completed THEN lessons_completed + 1 ELSE lessons_completed END,
        courses_completed = CASE WHEN p_course_completed THEN courses_completed + 1 ELSE courses_completed END,
        total_study_minutes = total_study_minutes + p_study_minutes,
        
        -- Update streak if studying today
        current_streak = CASE 
            WHEN p_study_minutes > 0 THEN
                CASE 
                    WHEN last_study_date = today_date THEN current_streak
                    WHEN last_study_date = today_date - 1 THEN current_streak + 1
                    ELSE 1
                END
            ELSE current_streak
        END,
        
        longest_streak = CASE 
            WHEN p_study_minutes > 0 THEN
                GREATEST(longest_streak, CASE 
                    WHEN last_study_date = today_date THEN current_streak
                    WHEN last_study_date = today_date - 1 THEN current_streak + 1
                    ELSE 1
                END)
            ELSE longest_streak
        END,
        
        last_study_date = CASE WHEN p_study_minutes > 0 THEN today_date ELSE last_study_date END,
        
        -- Update quiz stats
        quizzes_completed = CASE WHEN p_quiz_score IS NOT NULL THEN quizzes_completed + 1 ELSE quizzes_completed END,
        perfect_quiz_count = CASE WHEN p_quiz_score = 100 THEN perfect_quiz_count + 1 ELSE perfect_quiz_count END,
        
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Calculate new level based on total XP
    SELECT * INTO new_level_data 
    FROM calculate_level_from_xp((SELECT total_xp FROM user_gamification_stats WHERE user_id = p_user_id));
    
    -- Update level information
    UPDATE user_gamification_stats SET
        current_level = new_level_data.level,
        xp_current_level = new_level_data.xp_current,
        xp_next_level = new_level_data.xp_next
    WHERE user_id = p_user_id;
    
    -- Update quiz average score
    UPDATE user_gamification_stats SET
        quiz_average_score = (
            SELECT AVG(score) 
            FROM quiz_attempts qa 
            WHERE qa.user_id = p_user_id AND qa.score IS NOT NULL
        )
    WHERE user_id = p_user_id AND quizzes_completed > 0;
    
END;
$$ LANGUAGE plpgsql;

-- Function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS TABLE(newly_unlocked_achievement_id UUID) AS $$
DECLARE
    achievement_record RECORD;
    user_stats RECORD;
    progress_data RECORD;
    quiz_data RECORD;
    meets_criteria BOOLEAN;
BEGIN
    -- Get user stats
    SELECT * INTO user_stats
    FROM user_gamification_stats
    WHERE user_id = p_user_id;
    
    -- Get additional progress data
    SELECT 
        COUNT(*) FILTER (WHERE completed = true) as completed_lessons,
        SUM(COALESCE(time_spent_minutes, 0)) as total_minutes
    INTO progress_data
    FROM progress 
    WHERE user_id = p_user_id;
    
    -- Get quiz data
    SELECT 
        COUNT(*) as total_quizzes,
        COUNT(*) FILTER (WHERE score = total_points) as perfect_scores,
        AVG(score::float / total_points::float * 100) as avg_score
    INTO quiz_data
    FROM quiz_attempts 
    WHERE user_id = p_user_id;
    
    -- Check each active achievement
    FOR achievement_record IN 
        SELECT a.* FROM achievements a
        WHERE a.is_active = true 
        AND a.id NOT IN (
            SELECT ua.achievement_id 
            FROM user_achievements ua 
            WHERE ua.user_id = p_user_id
        )
    LOOP
        meets_criteria := false;
        
        -- Check criteria based on type
        CASE achievement_record.criteria->>'type'
            WHEN 'lessons_completed' THEN
                meets_criteria := COALESCE(progress_data.completed_lessons, 0) >= (achievement_record.criteria->>'target')::integer;
            WHEN 'courses_completed' THEN
                meets_criteria := COALESCE(user_stats.courses_completed, 0) >= (achievement_record.criteria->>'target')::integer;
            WHEN 'streak_days' THEN
                meets_criteria := COALESCE(user_stats.current_streak, 0) >= (achievement_record.criteria->>'target')::integer;
            WHEN 'quiz_perfect_score' THEN
                meets_criteria := COALESCE(quiz_data.perfect_scores, 0) >= (achievement_record.criteria->>'target')::integer;
            WHEN 'quiz_average_score' THEN
                meets_criteria := COALESCE(quiz_data.avg_score, 0) >= (achievement_record.criteria->>'target')::numeric
                    AND COALESCE(quiz_data.total_quizzes, 0) >= COALESCE((achievement_record.criteria->>'minimum_quizzes')::integer, 1);
            WHEN 'total_study_hours' THEN
                meets_criteria := COALESCE(user_stats.total_study_minutes, 0) / 60 >= (achievement_record.criteria->>'target')::integer;
            WHEN 'user_level' THEN
                meets_criteria := COALESCE(user_stats.current_level, 1) >= (achievement_record.criteria->>'target')::integer;
        END CASE;
        
        -- Unlock achievement if criteria met
        IF meets_criteria THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress_data)
            VALUES (p_user_id, achievement_record.id, jsonb_build_object(
                'unlocked_at', NOW(),
                'criteria_type', achievement_record.criteria->>'type',
                'target_value', achievement_record.criteria->>'target',
                'actual_value', CASE achievement_record.criteria->>'type'
                    WHEN 'lessons_completed' THEN COALESCE(progress_data.completed_lessons, 0)::text
                    WHEN 'courses_completed' THEN COALESCE(user_stats.courses_completed, 0)::text
                    WHEN 'streak_days' THEN COALESCE(user_stats.current_streak, 0)::text
                    WHEN 'quiz_perfect_score' THEN COALESCE(quiz_data.perfect_scores, 0)::text
                    WHEN 'quiz_average_score' THEN COALESCE(quiz_data.avg_score, 0)::text
                    WHEN 'total_study_hours' THEN (COALESCE(user_stats.total_study_minutes, 0) / 60)::text
                    WHEN 'user_level' THEN COALESCE(user_stats.current_level, 1)::text
                    ELSE '0'
                END
            ))
            ON CONFLICT (user_id, achievement_id) DO NOTHING;
            
            -- Update achievements count
            UPDATE user_gamification_stats 
            SET achievements_unlocked = achievements_unlocked + 1
            WHERE user_id = p_user_id;
            
            RETURN QUERY SELECT achievement_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_gamification_stats_updated_at BEFORE UPDATE ON user_gamification_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_analytics_updated_at BEFORE UPDATE ON lesson_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_notifications_updated_at BEFORE UPDATE ON user_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_responses_updated_at BEFORE UPDATE ON quiz_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_bookmarks_updated_at BEFORE UPDATE ON content_bookmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - DEFAULT ACHIEVEMENTS
-- =====================================================

INSERT INTO achievements (name, description, category, icon, points, criteria, sort_order) VALUES
-- Learning Achievements
('Primeiro Passo', 'Complete sua primeira lição', 'learning', '🎯', 10, '{"type": "lessons_completed", "target": 1}', 1),
('Estudante Dedicado', 'Complete 10 lições', 'learning', '📚', 50, '{"type": "lessons_completed", "target": 10}', 2),
('Explorador do Conhecimento', 'Complete 50 lições', 'learning', '🔍', 200, '{"type": "lessons_completed", "target": 50}', 3),
('Mestre do Aprendizado', 'Complete 100 lições', 'learning', '🎓', 500, '{"type": "lessons_completed", "target": 100}', 4),

-- Course Completion
('Primeiro Curso', 'Complete seu primeiro curso', 'mastery', '🏆', 100, '{"type": "courses_completed", "target": 1}', 5),
('Colecionador de Cursos', 'Complete 5 cursos', 'mastery', '📖', 300, '{"type": "courses_completed", "target": 5}', 6),
('Especialista', 'Complete 10 cursos', 'mastery', '👨‍🎓', 600, '{"type": "courses_completed", "target": 10}', 7),

-- Streak Achievements
('Consistência', 'Estude por 3 dias consecutivos', 'streak', '🔥', 30, '{"type": "streak_days", "target": 3}', 8),
('Disciplina', 'Estude por 7 dias consecutivos', 'streak', '⚡', 100, '{"type": "streak_days", "target": 7}', 9),
('Determinação', 'Estude por 30 dias consecutivos', 'streak', '💪', 500, '{"type": "streak_days", "target": 30}', 10),
('Lenda', 'Estude por 100 dias consecutivos', 'streak', '👑', 1000, '{"type": "streak_days", "target": 100}', 11),

-- Quiz Mastery
('Perfecionista', 'Obtenha 100% em 3 quizzes', 'mastery', '⭐', 75, '{"type": "quiz_perfect_score", "target": 3}', 12),
('Ás dos Quizzes', 'Obtenha 100% em 10 quizzes', 'mastery', '🌟', 250, '{"type": "quiz_perfect_score", "target": 10}', 13),
('Gênio dos Quizzes', 'Mantenha média de 90% em quizzes (mínimo 10)', 'mastery', '🧠', 300, '{"type": "quiz_average_score", "target": 90, "minimum_quizzes": 10}', 14),

-- Study Time
('Dedicação Inicial', 'Estude por 10 horas', 'engagement', '⏰', 50, '{"type": "total_study_hours", "target": 10}', 15),
('Estudante Comprometido', 'Estude por 50 horas', 'engagement', '📅', 200, '{"type": "total_study_hours", "target": 50}', 16),
('Maratonista do Conhecimento', 'Estude por 100 horas', 'engagement', '🏃‍♂️', 500, '{"type": "total_study_hours", "target": 100}', 17),

-- Level Achievements
('Nível Avançado', 'Alcance o nível 5', 'progression', '🚀', 100, '{"type": "user_level", "target": 5}', 18),
('Elite do Aprendizado', 'Alcance o nível 10', 'progression', '💎', 300, '{"type": "user_level", "target": 10}', 19);

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

-- This migration creates a comprehensive progress tracking and gamification system
-- It includes all tables referenced in the API routes:
-- - user_preferences: UI and learning preferences
-- - achievements: Achievement definitions with flexible criteria
-- - user_achievements: User's unlocked achievements
-- - user_gamification_stats: User stats for levels, XP, streaks
-- - lesson_analytics: Detailed learning analytics
-- - user_notifications: In-app notification system
-- - content_bookmarks: Bookmark system for content

-- All tables include:
-- - Proper RLS policies for security
-- - Performance indexes
-- - Data validation constraints
-- - Automatic timestamp management
-- - Helper functions for gamification logic
-- - Seed data for achievements

-- The system is designed to be:
-- - Scalable: Efficient queries with proper indexing
-- - Secure: RLS policies protect user data
-- - Flexible: JSONB fields for extensible criteria and data
-- - Real-time ready: Designed for Supabase real-time subscriptions
-- - Analytics-friendly: Rich tracking data for insights

COMMENT ON TABLE user_preferences IS 'Stores user UI/UX and learning preferences';
COMMENT ON TABLE achievements IS 'Defines available achievements with flexible criteria';
COMMENT ON TABLE user_achievements IS 'Tracks which achievements users have unlocked';
COMMENT ON TABLE user_gamification_stats IS 'Stores user gamification stats like XP, level, streaks';
COMMENT ON TABLE lesson_analytics IS 'Detailed analytics for lesson interactions and progress';
COMMENT ON TABLE user_notifications IS 'In-app notification system for achievements and updates';
COMMENT ON TABLE content_bookmarks IS 'User bookmarks for courses, lessons, and other content';