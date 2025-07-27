
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types';
import { notFound } from 'next/navigation';

interface PreviewPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  const supabase = createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !post) {
    return null;
  }

  return post;
}

export default async function PreviewPostPage({ params }: PreviewPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
