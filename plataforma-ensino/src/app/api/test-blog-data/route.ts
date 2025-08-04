import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/supabase/blog';

export async function GET() {
  try {
    const posts = await getBlogPosts(5);
    
    // Return detailed information about each post
    const detailedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      image_url: post.image_url,
      imageUrl: post.imageUrl,
      hasContent: !!post.content,
      contentLength: post.content?.length || 0,
      firstChars: post.content?.substring(0, 200)
    }));
    
    return NextResponse.json({
      success: true,
      postsCount: posts.length,
      posts: detailedPosts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}