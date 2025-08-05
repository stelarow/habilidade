import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../hooks/useBlogAPI';

const BlogTestPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState({
    slug: null,
    params: null,
    location: null,
    blogData: null,
    errors: [],
    logs: []
  });

  const addLog = (message, type = 'info') => {
    console.log(`[BlogTest ${type.toUpperCase()}]`, message);
    setDebugInfo(prev => ({
      ...prev,
      logs: [...prev.logs, { 
        timestamp: new Date().toISOString(), 
        message, 
        type 
      }]
    }));
  };

  // Test blog API hook - usePost is imported directly
  
  useEffect(() => {
    addLog('Component mounted');
    
    setDebugInfo(prev => ({
      ...prev,
      slug,
      params: { slug },
      location: window.location.href
    }));

    addLog(`Slug from useParams: ${slug}`);
    addLog(`Current location: ${window.location.href}`);
    
    // Test if we can access blog posts
    try {
      addLog('Testing blog API access...');
    } catch (error) {
      addLog(`Error testing blog API: ${error.message}`, 'error');
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, error.message]
      }));
    }
  }, [slug]);

  // Try to fetch post data if slug exists
  const { data, isLoading, isError, error } = slug ? usePost(slug) : { data: null, isLoading: false, isError: false, error: null };

  useEffect(() => {
    if (slug) {
      addLog(`Blog API hook status - Loading: ${isLoading}, Error: ${isError}`);
      
      if (data) {
        addLog(`Post data received: ${JSON.stringify(data, null, 2)}`);
        setDebugInfo(prev => ({
          ...prev,
          blogData: data
        }));
      }
      
      if (error) {
        addLog(`Blog API error: ${error.message}`, 'error');
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, error.message]
        }));
      }
    }
  }, [data, isLoading, isError, error, slug]);

  const testNavigation = () => {
    addLog('Testing navigation to blog post...');
    navigate('/blog/como-comecar-programacao-2024');
  };

  const testBlogIndex = () => {
    addLog('Testing navigation to blog index...');
    navigate('/blog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Blog Test & Debug Page</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current State */}
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Current State</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Slug:</strong> {debugInfo.slug || 'None'}</p>
              <p><strong>Location:</strong> {debugInfo.location}</p>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {isError ? 'Yes' : 'No'}</p>
              <p><strong>Has Data:</strong> {data ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Navigation Tests */}
          <div className="bg-zinc-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Navigation Tests</h2>
            <div className="space-y-3">
              <button 
                onClick={testBlogIndex}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                Test Blog Index
              </button>
              <button 
                onClick={testNavigation}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
              >
                Test Blog Post Navigation
              </button>
            </div>
          </div>
        </div>

        {/* Blog Data */}
        {debugInfo.blogData && (
          <div className="mt-8 bg-zinc-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-400">Blog Data</h2>
            <pre className="bg-zinc-900 p-4 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(debugInfo.blogData, null, 2)}
            </pre>
          </div>
        )}

        {/* Errors */}
        {debugInfo.errors.length > 0 && (
          <div className="mt-8 bg-red-900/30 p-6 rounded-lg border border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Errors</h2>
            <ul className="space-y-2">
              {debugInfo.errors.map((error, index) => (
                <li key={index} className="text-red-300 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Logs */}
        <div className="mt-8 bg-zinc-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">Debug Logs</h2>
          <div className="bg-zinc-900 p-4 rounded max-h-64 overflow-auto">
            {debugInfo.logs.map((log, index) => (
              <div key={index} className={`text-xs mb-1 ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'warn' ? 'text-yellow-400' : 
                'text-gray-300'
              }`}>
                <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Open browser console (F12) for additional debugging information
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

// Loader function for SSG
export function loader() {
  return null;
}

// Export both default and Component for vite-react-ssg compatibility
export default BlogTestPage;
export { BlogTestPage as Component };