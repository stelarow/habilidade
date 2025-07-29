-- Blog System Database Schema
-- This extends the main schema with blog functionality

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color_theme TEXT NOT NULL DEFAULT '#d400ff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT blog_categories_slug_check CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT blog_posts_slug_check CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT blog_posts_view_count_check CHECK (view_count >= 0)
);

-- Blog Course CTAs Table (for promoting courses in blog posts)
CREATE TABLE IF NOT EXISTS public.blog_course_ctas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    course_name TEXT NOT NULL,
    course_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, course_id)
);

-- Indexes for Performance Optimization

-- Blog Posts Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at 
    ON public.blog_posts(status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
    ON public.blog_posts(slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status 
    ON public.blog_posts(category_id, status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_author 
    ON public.blog_posts(author_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count 
    ON public.blog_posts(view_count DESC);

-- Full-text search index (PostgreSQL specific)
CREATE INDEX IF NOT EXISTS idx_blog_posts_search 
    ON public.blog_posts USING gin(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content));

-- Blog Categories Indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug 
    ON public.blog_categories(slug);

-- Blog Course CTAs Indexes
CREATE INDEX IF NOT EXISTS idx_blog_course_ctas_post 
    ON public.blog_course_ctas(post_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all blog tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_course_ctas ENABLE ROW LEVEL SECURITY;

-- Blog Categories Policies
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage blog categories" ON public.blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
    );

-- Blog Posts Policies
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (
        status = 'published' 
        AND published_at IS NOT NULL 
        AND published_at <= NOW()
    );

CREATE POLICY "Authors can view their own blog posts" ON public.blog_posts
    FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Authors can manage their own blog posts" ON public.blog_posts
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Blog Course CTAs Policies
CREATE POLICY "Anyone can view blog course CTAs for published posts" ON public.blog_course_ctas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.blog_posts
            WHERE id = post_id 
            AND status = 'published' 
            AND published_at IS NOT NULL 
            AND published_at <= NOW()
        )
    );

CREATE POLICY "Authenticated users can manage blog course CTAs" ON public.blog_course_ctas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
    );

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER blog_categories_updated_at
    BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_blog_updated_at();

CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_blog_updated_at();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION public.generate_blog_slug(title_text TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Generate base slug from title
    base_slug := LOWER(TRIM(title_text));
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
    base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
    base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
    base_slug := TRIM(base_slug, '-');
    
    final_slug := base_slug;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate slug on insert
CREATE OR REPLACE FUNCTION public.auto_generate_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := public.generate_blog_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-generating slugs
CREATE TRIGGER blog_posts_auto_slug
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.auto_generate_blog_slug();

-- Function to update view count safely
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_posts 
    SET view_count = view_count + 1 
    WHERE slug = post_slug 
    AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default blog categories
INSERT INTO public.blog_categories (name, slug, description, color_theme) VALUES
    ('Tecnologia', 'tecnologia', 'Artigos sobre tecnologia e inovação', '#d400ff'),
    ('Design', 'design', 'Dicas e tendências de design', '#00c4ff'),
    ('Educação', 'educacao', 'Conteúdo educacional e metodologias', '#a000ff'),
    ('Carreira', 'carreira', 'Desenvolvimento profissional e carreira', '#ff6600'),
    ('Mercado', 'mercado', 'Análises e tendências de mercado', '#00ff88')
ON CONFLICT (slug) DO NOTHING;

-- Performance optimization views
CREATE OR REPLACE VIEW public.blog_posts_with_stats AS
SELECT 
    bp.*,
    bc.name AS category_name,
    bc.slug AS category_slug,
    bc.color_theme AS category_color,
    u.full_name AS author_name,
    u.avatar_url AS author_avatar,
    COUNT(bcc.id) AS course_ctas_count
FROM public.blog_posts bp
LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
LEFT JOIN public.users u ON bp.author_id = u.id
LEFT JOIN public.blog_course_ctas bcc ON bp.id = bcc.post_id
GROUP BY bp.id, bc.id, u.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.blog_course_ctas TO anon, authenticated;
GRANT SELECT ON public.blog_posts_with_stats TO anon, authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views(TEXT) TO anon, authenticated;