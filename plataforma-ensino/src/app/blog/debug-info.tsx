'use client';

export function DebugInfo({ posts }: { posts: any[] }) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-500 rounded p-4 mb-8">
      <h3 className="text-yellow-400 font-bold mb-2">Debug Info</h3>
      <p className="text-yellow-300 text-sm">Total posts: {posts.length}</p>
      {posts.length > 0 && (
        <>
          <p className="text-yellow-300 text-sm">First post:</p>
          <ul className="text-yellow-200 text-xs ml-4">
            <li>Title: {posts[0].title}</li>
            <li>Has imageUrl: {posts[0].imageUrl ? 'YES' : 'NO'}</li>
            <li>imageUrl value: {posts[0].imageUrl || 'undefined'}</li>
            <li>Has image_url: {posts[0].image_url ? 'YES' : 'NO'}</li>
            <li>image_url value: {posts[0].image_url || 'undefined'}</li>
            <li>Has content: {posts[0].content ? 'YES' : 'NO'}</li>
          </ul>
        </>
      )}
    </div>
  );
}