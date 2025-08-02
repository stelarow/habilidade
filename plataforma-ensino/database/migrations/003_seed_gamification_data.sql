-- Seed Gamification Data Migration
-- This migration seeds the database with default achievements and initial configurations
-- Version: 1.0
-- Date: 2025-08-02

-- =====================================================
-- ADDITIONAL ACHIEVEMENTS SEED DATA
-- =====================================================

-- Insert additional advanced achievements
INSERT INTO achievements (name, description, category, icon, badge_color, rarity, points, criteria, sort_order, is_hidden) VALUES

-- Advanced Learning Achievements
('Maratona de Conhecimento', 'Complete 200 lições', 'learning', '🏃‍♂️', '#fbbf24', 'rare', 1000, '{"type": "lessons_completed", "target": 200}', 20, false),
('Enciclopédia Viva', 'Complete 500 lições', 'learning', '📚', '#f59e0b', 'epic', 2500, '{"type": "lessons_completed", "target": 500}', 21, true),
('Mestre Supremo', 'Complete 1000 lições', 'learning', '👑', '#d97706', 'legendary', 5000, '{"type": "lessons_completed", "target": 1000}', 22, true),

-- Master Course Achievements
('Coletor de Diplomas', 'Complete 20 cursos', 'mastery', '🏅', '#10b981', 'rare', 1200, '{"type": "courses_completed", "target": 20}', 23, false),
('Universidade Pessoal', 'Complete 50 cursos', 'mastery', '🎓', '#059669', 'epic', 3000, '{"type": "courses_completed", "target": 50}', 24, true),

-- Legendary Streak Achievements
('Ano de Dedicação', 'Estude por 365 dias consecutivos', 'streak', '🌟', '#8b5cf6', 'legendary', 10000, '{"type": "streak_days", "target": 365}', 25, true),
('Imortal do Aprendizado', 'Estude por 500 dias consecutivos', 'streak', '⚡', '#7c3aed', 'legendary', 15000, '{"type": "streak_days", "target": 500}', 26, true),

-- Elite Quiz Achievements
('Mestre dos Quizzes', 'Obtenha 100% em 50 quizzes', 'mastery', '🎯', '#ef4444', 'epic', 1500, '{"type": "quiz_perfect_score", "target": 50}', 27, false),
('Infalível', 'Obtenha 100% em 100 quizzes', 'mastery', '💎', '#dc2626', 'legendary', 3000, '{"type": "quiz_perfect_score", "target": 100}', 28, true),
('Cérebro Supremo', 'Mantenha média de 95% em quizzes (mínimo 50)', 'mastery', '🧠', '#b91c1c', 'legendary', 2000, '{"type": "quiz_average_score", "target": 95, "minimum_quizzes": 50}', 29, true),

-- Extreme Study Time
('Dedicação Total', 'Estude por 500 horas', 'engagement', '⏰', '#0ea5e9', 'epic', 2000, '{"type": "total_study_hours", "target": 500}', 30, false),
('Vida de Estudos', 'Estude por 1000 horas', 'engagement', '📖', '#0284c7', 'legendary', 5000, '{"type": "total_study_hours", "target": 1000}', 31, true),

-- Level Mastery
('Ascensão', 'Alcance o nível 25', 'progression', '🚀', '#06b6d4', 'rare', 800, '{"type": "user_level", "target": 25}', 32, false),
('Lenda Viva', 'Alcance o nível 50', 'progression', '👑', '#0891b2', 'epic', 2000, '{"type": "user_level", "target": 50}', 33, true),
('Deus do Conhecimento', 'Alcance o nível 100', 'progression', '🌟', '#0e7490', 'legendary', 10000, '{"type": "user_level", "target": 100}', 34, true),

-- Social Achievements
('Mentor', 'Ajude 10 colegas (futura implementação)', 'social', '🤝', '#10b981', 'common', 100, '{"type": "help_given", "target": 10}', 35, true),
('Colaborador', 'Participe de 50 discussões (futura implementação)', 'social', '💬', '#059669', 'rare', 300, '{"type": "discussions_participated", "target": 50}', 36, true),

-- Special Milestone Achievements
('Primeiro Ano', 'Complete 1 ano de estudos consecutivos', 'milestone', '🎂', '#f59e0b', 'epic', 3650, '{"type": "streak_days", "target": 365}', 37, true),
('Velocista', 'Complete 10 lições em um dia', 'engagement', '⚡', '#eab308', 'rare', 200, '{"type": "daily_lessons", "target": 10}', 38, true),

-- Exploration Achievements
('Explorador', 'Acesse 5 categorias diferentes de cursos', 'exploration', '🗺️', '#8b5cf6', 'common', 50, '{"type": "categories_explored", "target": 5}', 39, false),
('Aventureiro', 'Acesse 10 categorias diferentes de cursos', 'exploration', '🎒', '#7c3aed', 'rare', 150, '{"type": "categories_explored", "target": 10}', 40, false);

-- =====================================================
-- NOTIFICATION TEMPLATES
-- =====================================================

-- Create notification templates for common scenarios
INSERT INTO user_notifications (user_id, title, message, type, priority, data, expires_at) 
SELECT 
    '00000000-0000-0000-0000-000000000000'::uuid, -- Template UUID (will be replaced in app)
    'Bem-vindo à Plataforma!',
    'Comece sua jornada de aprendizado e desbloqueie suas primeiras conquistas!',
    'system',
    'normal',
    '{"template": "welcome", "action_url": "/dashboard", "action_text": "Começar"}',
    NOW() + INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM user_notifications WHERE data->>'template' = 'welcome');

-- =====================================================
-- DEFAULT USER PREFERENCES
-- =====================================================

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (
        user_id,
        theme,
        font_size,
        reduced_motion,
        high_contrast,
        auto_advance,
        show_progress,
        email_notifications,
        push_notifications,
        show_achievements,
        show_leaderboard,
        public_profile,
        reminder_frequency,
        study_goal_minutes
    ) VALUES (
        NEW.id,
        'violet-dark',
        'medium',
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        false,
        'daily',
        30
    ) ON CONFLICT (user_id) DO NOTHING;
    
    -- Also create default gamification stats
    INSERT INTO user_gamification_stats (
        user_id,
        current_level,
        total_xp,
        xp_current_level,
        xp_next_level
    ) VALUES (
        NEW.id,
        1,
        0,
        0,
        100
    ) ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set up new users
DROP TRIGGER IF EXISTS setup_new_user_defaults ON auth.users;
CREATE TRIGGER setup_new_user_defaults
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_user_preferences();

-- =====================================================
-- ACHIEVEMENT PROGRESS CALCULATION HELPERS
-- =====================================================

-- Function to get user's achievement progress summary
CREATE OR REPLACE FUNCTION get_user_achievement_progress(p_user_id UUID)
RETURNS TABLE(
    category TEXT,
    total_achievements INTEGER,
    unlocked_achievements INTEGER,
    completion_percentage DECIMAL,
    total_points_available INTEGER,
    points_earned INTEGER,
    next_achievement_name TEXT,
    next_achievement_progress DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH category_stats AS (
        SELECT 
            a.category,
            COUNT(*) as total,
            COUNT(ua.id) as unlocked,
            SUM(a.points) as max_points,
            SUM(CASE WHEN ua.id IS NOT NULL THEN a.points ELSE 0 END) as earned_points
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = p_user_id
        WHERE a.is_active = true
        GROUP BY a.category
    ),
    next_achievements AS (
        SELECT DISTINCT ON (a.category)
            a.category,
            a.name as next_name,
            -- Calculate progress for next achievement
            CASE a.criteria->>'type'
                WHEN 'lessons_completed' THEN 
                    LEAST(100, (SELECT COALESCE(COUNT(*), 0) FROM progress WHERE user_id = p_user_id AND completed = true) * 100.0 / (a.criteria->>'target')::INTEGER)
                WHEN 'courses_completed' THEN 
                    LEAST(100, (SELECT COALESCE(courses_completed, 0) FROM user_gamification_stats WHERE user_id = p_user_id) * 100.0 / (a.criteria->>'target')::INTEGER)
                WHEN 'streak_days' THEN 
                    LEAST(100, (SELECT COALESCE(current_streak, 0) FROM user_gamification_stats WHERE user_id = p_user_id) * 100.0 / (a.criteria->>'target')::INTEGER)
                ELSE 0
            END as progress_pct
        FROM achievements a
        WHERE a.is_active = true
        AND a.id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id)
        ORDER BY a.category, a.sort_order
    )
    SELECT 
        cs.category,
        cs.total::INTEGER,
        cs.unlocked::INTEGER,
        ROUND((cs.unlocked * 100.0 / cs.total), 2) as completion_percentage,
        cs.max_points::INTEGER,
        cs.earned_points::INTEGER,
        na.next_name,
        ROUND(na.progress_pct, 2) as next_achievement_progress
    FROM category_stats cs
    LEFT JOIN next_achievements na ON cs.category = na.category
    ORDER BY cs.category;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- LEADERBOARD FUNCTIONS
-- =====================================================

-- Function to get global leaderboard
CREATE OR REPLACE FUNCTION get_global_leaderboard(p_limit INTEGER DEFAULT 10)
RETURNS TABLE(
    rank INTEGER,
    user_id UUID,
    full_name TEXT,
    avatar_url TEXT,
    current_level INTEGER,
    total_xp INTEGER,
    achievements_unlocked INTEGER,
    current_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_users AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY ugs.total_xp DESC, ugs.current_level DESC, ugs.achievements_unlocked DESC) as user_rank,
            ugs.user_id,
            u.full_name,
            u.avatar_url,
            ugs.current_level,
            ugs.total_xp,
            ugs.achievements_unlocked,
            ugs.current_streak
        FROM user_gamification_stats ugs
        JOIN users u ON u.id = ugs.user_id
        JOIN user_preferences up ON up.user_id = ugs.user_id
        WHERE up.show_leaderboard = true 
        AND up.public_profile = true
        ORDER BY ugs.total_xp DESC
        LIMIT p_limit
    )
    SELECT * FROM ranked_users;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's leaderboard position
CREATE OR REPLACE FUNCTION get_user_leaderboard_position(p_user_id UUID)
RETURNS TABLE(
    user_rank INTEGER,
    total_users INTEGER,
    percentile DECIMAL
) AS $$
DECLARE
    user_xp INTEGER;
    user_rank_val INTEGER;
    total_users_val INTEGER;
BEGIN
    -- Get user's XP
    SELECT total_xp INTO user_xp 
    FROM user_gamification_stats 
    WHERE user_id = p_user_id;
    
    -- Get user's rank
    SELECT COUNT(*) + 1 INTO user_rank_val
    FROM user_gamification_stats ugs
    JOIN user_preferences up ON up.user_id = ugs.user_id
    WHERE up.show_leaderboard = true 
    AND up.public_profile = true
    AND ugs.total_xp > user_xp;
    
    -- Get total users in leaderboard
    SELECT COUNT(*) INTO total_users_val
    FROM user_gamification_stats ugs
    JOIN user_preferences up ON up.user_id = ugs.user_id
    WHERE up.show_leaderboard = true 
    AND up.public_profile = true;
    
    RETURN QUERY SELECT 
        user_rank_val,
        total_users_val,
        ROUND((total_users_val - user_rank_val + 1) * 100.0 / total_users_val, 2) as percentile;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ANALYTICS HELPER FUNCTIONS
-- =====================================================

-- Function to get detailed learning analytics for a user
CREATE OR REPLACE FUNCTION get_user_learning_analytics(
    p_user_id UUID,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    study_date DATE,
    lessons_completed INTEGER,
    total_study_minutes INTEGER,
    quizzes_taken INTEGER,
    average_quiz_score DECIMAL,
    xp_gained INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_progress AS (
        SELECT 
            DATE(la.completed_at) as study_date,
            COUNT(DISTINCT la.lesson_id) as lessons_completed,
            SUM(COALESCE(la.total_time_seconds, 0)) / 60 as total_study_minutes,
            0 as quizzes_taken,
            0::DECIMAL as average_quiz_score,
            COUNT(DISTINCT la.lesson_id) * 10 as xp_gained -- Approximate XP calculation
        FROM lesson_analytics la
        WHERE la.user_id = p_user_id
        AND la.completed_at >= CURRENT_DATE - INTERVAL '%s days' % p_days_back
        AND la.completed_at IS NOT NULL
        GROUP BY DATE(la.completed_at)
    ),
    daily_quizzes AS (
        SELECT 
            DATE(qa.completed_at) as study_date,
            0 as lessons_completed,
            0 as total_study_minutes,
            COUNT(*) as quizzes_taken,
            AVG(qa.score::DECIMAL / qa.total_points * 100) as average_quiz_score,
            SUM(CASE WHEN qa.passed THEN 20 ELSE 5 END) as xp_gained -- Approximate XP calculation
        FROM quiz_attempts qa
        WHERE qa.user_id = p_user_id
        AND qa.completed_at >= CURRENT_DATE - INTERVAL '%s days' % p_days_back
        AND qa.completed_at IS NOT NULL
        GROUP BY DATE(qa.completed_at)
    ),
    combined_data AS (
        SELECT * FROM daily_progress
        UNION ALL
        SELECT * FROM daily_quizzes
    )
    SELECT 
        cd.study_date,
        SUM(cd.lessons_completed)::INTEGER,
        SUM(cd.total_study_minutes)::INTEGER,
        SUM(cd.quizzes_taken)::INTEGER,
        CASE 
            WHEN SUM(cd.quizzes_taken) > 0 THEN
                ROUND(SUM(cd.average_quiz_score * cd.quizzes_taken) / SUM(cd.quizzes_taken), 2)
            ELSE 0::DECIMAL
        END as average_quiz_score,
        SUM(cd.xp_gained)::INTEGER
    FROM combined_data cd
    GROUP BY cd.study_date
    ORDER BY cd.study_date DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAINTENANCE FUNCTIONS
-- =====================================================

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete expired notifications
    DELETE FROM user_notifications 
    WHERE expires_at < NOW()
    AND read_at IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Delete old read notifications (older than 30 days)
    DELETE FROM user_notifications 
    WHERE read_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate all user stats (maintenance)
CREATE OR REPLACE FUNCTION recalculate_user_stats(p_user_id UUID DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- If specific user provided, process only that user
    IF p_user_id IS NOT NULL THEN
        PERFORM update_user_gamification_stats(p_user_id, 0, false, false, NULL, 0);
        PERFORM check_and_unlock_achievements(p_user_id);
        RETURN;
    END IF;
    
    -- Otherwise process all users
    FOR user_record IN SELECT DISTINCT user_id FROM user_gamification_stats
    LOOP
        PERFORM update_user_gamification_stats(user_record.user_id, 0, false, false, NULL, 0);
        PERFORM check_and_unlock_achievements(user_record.user_id);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

-- This migration adds:
-- 1. Extended achievement definitions with different rarities and hidden achievements
-- 2. Automatic user setup for new registrations
-- 3. Achievement progress calculation helpers
-- 4. Leaderboard functions with privacy controls
-- 5. Detailed learning analytics functions
-- 6. Maintenance and cleanup functions

-- The system now provides:
-- - Comprehensive gamification with 40+ achievements
-- - Real-time progress tracking and analytics
-- - Privacy-respecting leaderboards
-- - Automated user onboarding
-- - Performance optimization helpers
-- - Data maintenance utilities

COMMENT ON FUNCTION create_default_user_preferences() IS 'Automatically creates default preferences and stats for new users';
COMMENT ON FUNCTION get_user_achievement_progress(UUID) IS 'Returns detailed achievement progress by category for a user';
COMMENT ON FUNCTION get_global_leaderboard(INTEGER) IS 'Returns global leaderboard with privacy controls';
COMMENT ON FUNCTION get_user_leaderboard_position(UUID) IS 'Returns user rank and percentile in leaderboard';
COMMENT ON FUNCTION get_user_learning_analytics(UUID, INTEGER) IS 'Returns detailed daily learning analytics for a user';
COMMENT ON FUNCTION cleanup_old_notifications() IS 'Maintenance function to clean up old and expired notifications';
COMMENT ON FUNCTION recalculate_user_stats(UUID) IS 'Maintenance function to recalculate user statistics';