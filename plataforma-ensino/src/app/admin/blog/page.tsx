
import { requireAdmin } from '@/lib/auth/server-side-protection'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Post {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

export default async function BlogAdminPage() {
  const { user: currentUser, profile } = await requireAdmin()
  console.log(`[ADMIN-BLOG] Access authorized for admin: ${profile.email}`)

  const supabase = createClient()
  
  // Get posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Erro ao carregar posts</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Link href="/admin/blog/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          New Post
        </Link>
      </div>
      <div className="bg-white shadow-md rounded my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Created At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {(posts || []).map((post) => (
              <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {post.title}
                </td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
