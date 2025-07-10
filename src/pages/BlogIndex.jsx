
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Placeholder for the API URL
const API_URL = 'http://localhost:3001'; // Replace with your actual platform URL

const PostCard = ({ post }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <Link to={`/blog/${post.slug}`}>
      {post.featured_image_url && (
        <img src={post.featured_image_url} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-4">{post.excerpt}</p>
        <span className="text-sm text-gray-500">{new Date(post.published_at).toLocaleDateString()}</span>
      </div>
    </Link>
  </div>
);

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // We will fetch only published posts from the API
        // The API needs to be adjusted to filter by status='published' for the public route
        const response = await fetch(`${API_URL}/api/posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // Assuming the API returns { posts: [...] }
        setPosts(data.posts.filter(p => p.status === 'published'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center p-10">Loading posts...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
