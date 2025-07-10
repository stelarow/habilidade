
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Placeholder for the API URL
const API_URL = 'http://localhost:3001'; // Replace with your actual platform URL

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // The API needs a new endpoint to get a post by slug
        const response = await fetch(`${API_URL}/api/posts/slug/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        // Assuming the API returns { post: {...} }
        if (data.post.status !== 'published') {
            throw new Error('Post not found');
        }
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) return <div className="text-center p-10">Loading post...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!post) return <div className="text-center p-10">Post not found.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <article className="prose lg:prose-xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-8">
          <span>Published on {new Date(post.published_at).toLocaleDateString()}</span>
        </div>
        {post.featured_image_url && (
          <img src={post.featured_image_url} alt={post.title} className="w-full rounded-lg mb-8" />
        )}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
