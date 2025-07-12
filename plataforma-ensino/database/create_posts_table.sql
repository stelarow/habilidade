
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  author_id uuid REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ,
  status TEXT CHECK (status IN ('draft', 'in_review', 'published')) DEFAULT 'draft',
  excerpt TEXT,
  featured_image_url TEXT,
  version INT DEFAULT 1,
  metadata JSONB,
  tags TEXT[]
);

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT USING (status = 'published');

-- This policy allows admins (with 'service_role' or a custom 'admin' role) to manage all posts.
-- You would need to set up custom claims for the 'admin' role.
CREATE POLICY "Admins can manage all posts" ON posts
  FOR ALL USING (auth.role() = 'service_role');

-- This policy allows authors to manage their own posts, but they can't publish them directly.
CREATE POLICY "Authors can manage their own posts" ON posts
    FOR ALL
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id AND status IN ('draft', 'in_review'));
