-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled', 'expired');

-- Users table (extends Supabase auth.users)
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

-- Categories table
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

-- Instructors table
CREATE TABLE public.instructors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    expertise TEXT[],
    social_links JSONB DEFAULT '{}'::jsonb,
    rating NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT instructors_rating_check CHECK (rating >= 0 AND rating <= 5)
);

-- Courses table
CREATE TABLE public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    video_preview_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    duration_minutes INTEGER DEFAULT 0,
    level course_level DEFAULT 'beginner',
    requirements TEXT[],
    what_you_learn TEXT[],
    background_theme TEXT DEFAULT 'default',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT courses_price_check CHECK (price >= 0),
    CONSTRAINT courses_duration_check CHECK (duration_minutes >= 0)
);

-- Lessons table
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
    transcript TEXT,
    is_preview BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, order_index),
    UNIQUE(course_id, slug),
    CONSTRAINT lessons_duration_check CHECK (video_duration >= 0),
    CONSTRAINT lessons_order_check CHECK (order_index >= 0)
);

-- Enrollments table
CREATE TABLE public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    access_until TIMESTAMP WITH TIME ZONE,
    status enrollment_status DEFAULT 'active',
    progress_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id),
    CONSTRAINT enrollments_progress_check CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Progress table
CREATE TABLE public.progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    last_position INTEGER DEFAULT 0,
    watch_time INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id),
    CONSTRAINT progress_position_check CHECK (last_position >= 0),
    CONSTRAINT progress_watch_time_check CHECK (watch_time >= 0)
);

-- Certificates table
CREATE TABLE public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    certificate_url TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verification_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    comment TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id),
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5)
);

-- Admin settings table
CREATE TABLE public.admin_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_courses_category_id ON public.courses(category_id);
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_courses_is_published ON public.courses(is_published);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order_index ON public.lessons(order_index);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_lesson_id ON public.progress(lesson_id);
CREATE INDEX idx_progress_enrollment_id ON public.progress(enrollment_id);
CREATE INDEX idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, slug, description, color_theme, icon, background_type) VALUES
('Inteligência Artificial', 'inteligencia-artificial', 'Cursos sobre IA, Machine Learning e Deep Learning', '#22d3ee', 'brain', 'ia'),
('Design Gráfico', 'design-grafico', 'Cursos de design visual, branding e criação', '#f472b6', 'palette', 'design'),
('Programação', 'programacao', 'Cursos de desenvolvimento de software e programação', '#4ade80', 'code', 'programacao'),
('Marketing Digital', 'marketing-digital', 'Cursos sobre marketing online e estratégias digitais', '#a78bfa', 'megaphone', 'marketing'),
('Modelagem 3D', 'modelagem-3d', 'Cursos de modelagem e animação 3D', '#f97316', 'cube', '3d'),
('Edição de Vídeo', 'edicao-video', 'Cursos de edição e produção audiovisual', '#f87171', 'film', 'video'),
('Administração', 'administracao', 'Cursos de gestão e administração empresarial', '#60a5fa', 'briefcase', 'administracao'),
('Business Intelligence', 'business-intelligence', 'Cursos de análise de dados e BI', '#34d399', 'chart-bar', 'bi'),
('Informática', 'informatica', 'Cursos básicos de informática e tecnologia', '#fbbf24', 'desktop-computer', 'informatica');

-- Insert default admin settings
INSERT INTO public.admin_settings (key, value, description) VALUES
('platform_name', '"Plataforma Habilidade"', 'Nome da plataforma'),
('platform_logo', '"/logo.png"', 'URL do logo da plataforma'),
('primary_color', '"#d400ff"', 'Cor primária da plataforma'),
('secondary_color', '"#00c4ff"', 'Cor secundária da plataforma'),
('accent_color', '"#a000ff"', 'Cor de destaque da plataforma'),
('enable_certificates', 'true', 'Habilitar certificados'),
('enable_reviews', 'true', 'Habilitar avaliações'),
('max_file_size', '104857600', 'Tamanho máximo de arquivo em bytes (100MB)'),
('video_quality_limit', '"720p"', 'Qualidade máxima de vídeo'),
('max_playback_speed', '2.0', 'Velocidade máxima de reprodução');

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Categories policies (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Instructors policies
CREATE POLICY "Anyone can view instructors" ON public.instructors
    FOR SELECT USING (true);

CREATE POLICY "Instructors can update their own profile" ON public.instructors
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage instructors" ON public.instructors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can view their own courses" ON public.courses
    FOR SELECT USING (
        instructor_id IN (
            SELECT id FROM public.instructors WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage their own courses" ON public.courses
    FOR ALL USING (
        instructor_id IN (
            SELECT id FROM public.instructors WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Lessons policies
CREATE POLICY "Users can view lessons from enrolled courses" ON public.lessons
    FOR SELECT USING (
        is_published = true AND (
            is_preview = true OR
            course_id IN (
                SELECT course_id FROM public.enrollments
                WHERE user_id = auth.uid() AND status = 'active'
            )
        )
    );

CREATE POLICY "Instructors can manage lessons in their courses" ON public.lessons
    FOR ALL USING (
        course_id IN (
            SELECT id FROM public.courses
            WHERE instructor_id IN (
                SELECT id FROM public.instructors WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Admins can manage all lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own enrollments" ON public.enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments" ON public.enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Progress policies
CREATE POLICY "Users can view their own progress" ON public.progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON public.progress
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON public.progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Certificates policies
CREATE POLICY "Users can view their own certificates" ON public.certificates
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can verify certificates" ON public.certificates
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage all certificates" ON public.certificates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view published reviews" ON public.reviews
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage their own reviews" ON public.reviews
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin settings policies
CREATE POLICY "Anyone can view admin settings" ON public.admin_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update enrollment progress
CREATE OR REPLACE FUNCTION public.update_enrollment_progress(enrollment_uuid UUID)
RETURNS VOID AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    new_progress INTEGER;
BEGIN
    -- Get total lessons count for the course
    SELECT COUNT(*) INTO total_lessons
    FROM public.lessons l
    JOIN public.enrollments e ON l.course_id = e.course_id
    WHERE e.id = enrollment_uuid AND l.is_published = true;

    -- Get completed lessons count
    SELECT COUNT(*) INTO completed_lessons
    FROM public.progress p
    JOIN public.lessons l ON p.lesson_id = l.id
    JOIN public.enrollments e ON p.enrollment_id = e.id
    WHERE e.id = enrollment_uuid AND p.completed = true;

    -- Calculate progress percentage
    IF total_lessons > 0 THEN
        new_progress := (completed_lessons * 100) / total_lessons;
    ELSE
        new_progress := 0;
    END IF;

    -- Update enrollment progress
    UPDATE public.enrollments
    SET progress_percentage = new_progress,
        completed_at = CASE WHEN new_progress = 100 THEN NOW() ELSE NULL END,
        status = CASE WHEN new_progress = 100 THEN 'completed' ELSE status END
    WHERE id = enrollment_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update enrollment progress when lesson progress changes
CREATE OR REPLACE FUNCTION public.handle_progress_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.update_enrollment_progress(NEW.enrollment_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_progress_update
    AFTER INSERT OR UPDATE ON public.progress
    FOR EACH ROW EXECUTE FUNCTION public.handle_progress_update();

-- Create function to generate certificate
CREATE OR REPLACE FUNCTION public.generate_certificate(
    user_uuid UUID,
    course_uuid UUID,
    enrollment_uuid UUID
)
RETURNS UUID AS $$
DECLARE
    certificate_id UUID;
    verification_code TEXT;
BEGIN
    -- Generate unique verification code
    verification_code := 'CERT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    -- Insert certificate
    INSERT INTO public.certificates (user_id, course_id, enrollment_id, verification_code)
    VALUES (user_uuid, course_uuid, enrollment_uuid, verification_code)
    RETURNING id INTO certificate_id;
    
    RETURN certificate_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for course statistics
CREATE VIEW public.course_stats AS
SELECT 
    c.id,
    c.title,
    c.slug,
    COUNT(DISTINCT e.id) as total_enrollments,
    COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) as completed_enrollments,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT r.id) as total_reviews,
    SUM(l.video_duration) as total_duration
FROM public.courses c
LEFT JOIN public.enrollments e ON c.id = e.course_id
LEFT JOIN public.reviews r ON c.id = r.course_id AND r.is_published = true
LEFT JOIN public.lessons l ON c.id = l.course_id AND l.is_published = true
GROUP BY c.id, c.title, c.slug;

-- Create view for user progress
CREATE VIEW public.user_course_progress AS
SELECT 
    u.id as user_id,
    u.full_name,
    c.id as course_id,
    c.title as course_title,
    c.slug as course_slug,
    e.enrolled_at,
    e.progress_percentage,
    e.status,
    COUNT(DISTINCT l.id) as total_lessons,
    COUNT(DISTINCT CASE WHEN p.completed = true THEN p.id END) as completed_lessons,
    SUM(p.watch_time) as total_watch_time
FROM public.users u
JOIN public.enrollments e ON u.id = e.user_id
JOIN public.courses c ON e.course_id = c.id
LEFT JOIN public.lessons l ON c.id = l.course_id AND l.is_published = true
LEFT JOIN public.progress p ON u.id = p.user_id AND l.id = p.lesson_id
GROUP BY u.id, u.full_name, c.id, c.title, c.slug, e.enrolled_at, e.progress_percentage, e.status;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres, authenticated, service_role;