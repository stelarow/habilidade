'use client';

import { useEffect, useState } from 'react';

export default function TestBlogDebug() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/test-blog-data');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching test data:', error);
        setData({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div className="p-8 text-white">Loading...</div>;
  
  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Blog Debug Information</h1>
      
      <pre className="bg-zinc-900 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      
      {data?.posts && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Image Analysis</h2>
          {data.posts.map((post: any, index: number) => (
            <div key={index} className="mb-4 p-4 bg-zinc-900 rounded">
              <h3 className="font-bold">{post.title}</h3>
              <p>image_url from DB: {post.image_url || 'NULL'}</p>
              <p>imageUrl computed: {post.imageUrl || 'NULL'}</p>
              <p>Has content: {post.hasContent ? 'Yes' : 'No'}</p>
              <p>Content length: {post.contentLength}</p>
              
              {post.imageUrl && (
                <div className="mt-2">
                  <p className="text-sm text-zinc-400">Testing image load:</p>
                  <img 
                    src={post.imageUrl}
                    alt="Test"
                    className="w-32 h-20 object-cover mt-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.border = '2px solid red';
                      console.error('Image failed to load:', post.imageUrl);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', post.imageUrl);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}