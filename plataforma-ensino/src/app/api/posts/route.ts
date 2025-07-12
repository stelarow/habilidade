
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with dashes'),
  status: z.enum(['draft', 'in_review', 'published']).optional(),
  excerpt: z.string().optional(),
  featured_image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: posts, error } = await supabase.from('posts').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
  }

  const { title, content, slug, status, excerpt, featured_image_url, tags } = parsed.data;

  // Sanitize content
  const sanitizedContent = purify.sanitize(content);

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        content: sanitizedContent,
        slug,
        author_id: user.id,
        status: status || 'draft',
        excerpt,
        featured_image_url,
        tags,
        updated_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    // Handle potential slug conflict
    if (error.code === '23505') { // unique_violation
        return NextResponse.json({ error: 'This slug is already in use.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data[0] }, { status: 201 });
}
