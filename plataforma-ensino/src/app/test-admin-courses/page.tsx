// Teste isolado da página admin courses
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'

export default async function TestAdminCoursesPage() {
  console.log('[TEST-ADMIN-COURSES] 1. Iniciando página courses')
  
  const supabase = createClient()
  console.log('[TEST-ADMIN-COURSES] 2. Cliente Supabase criado')
  
  let currentUser = null
  let courses: any[] = []
  let categories: any[] = []
  let error = null

  try {
    console.log('[TEST-ADMIN-COURSES] 3. Chamando getCurrentUser...')
    currentUser = await getCurrentUser()
    console.log('[TEST-ADMIN-COURSES] 4. getCurrentUser retornou:', currentUser ? 'usuário encontrado' : 'usuário não encontrado')
    
    console.log('[TEST-ADMIN-COURSES] 5. Verificando permissões...')
    requirePermission(currentUser, 'admin.courses.view')
    console.log('[TEST-ADMIN-COURSES] 6. Permissões OK')

    console.log('[TEST-ADMIN-COURSES] 7. Buscando cursos e categorias...')
    
    // Parallel queries like the original admin page
    const [coursesResult, categoriesResult] = await Promise.all([
      supabase
        .from('courses')
        .select(`
          *,
          category:categories(name),
          instructor:instructors(user:users(full_name))
        `)
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('*')
        .order('name')
    ])

    if (coursesResult.error) {
      console.error('[TEST-ADMIN-COURSES] Erro ao buscar cursos:', coursesResult.error)
      error = coursesResult.error.message
    } else {
      courses = coursesResult.data || []
      console.log('[TEST-ADMIN-COURSES] 8. Cursos carregados:', courses.length)
    }

    if (categoriesResult.error) {
      console.error('[TEST-ADMIN-COURSES] Erro ao buscar categorias:', categoriesResult.error)
      if (!error) error = categoriesResult.error.message
    } else {
      categories = categoriesResult.data || []
      console.log('[TEST-ADMIN-COURSES] 9. Categorias carregadas:', categories.length)
    }
    
  } catch (err: any) {
    console.error('[TEST-ADMIN-COURSES] ERRO durante execução:', err)
    error = err.message
  }

  console.log('[TEST-ADMIN-COURSES] 10. Renderizando página')

  return (
    <div className="min-h-screen bg-orange-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📚 Teste Admin Courses</h1>
        
        {error ? (
          <div className="bg-red-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">❌ Erro Encontrado</h2>
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <div className="bg-green-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">✅ Teste Bem-sucedido</h2>
            <p className="text-green-200">
              Página courses carregada com sucesso. Queries paralelas funcionaram.
            </p>
            <div className="mt-4 text-sm text-green-300">
              <p>Usuário atual: {currentUser ? currentUser.email : 'Nenhum'}</p>
              <p>Cursos carregados: {courses.length}</p>
              <p>Categorias carregadas: {categories.length}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔍 Componentes Testados</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✅ createClient() do server.ts</li>
            <li>✅ getCurrentUser() do permissions.ts</li>
            <li>✅ requirePermission() para courses.view</li>
            <li>✅ Query na tabela courses com JOIN</li>
            <li>✅ Query na tabela categories</li>
            <li>✅ Promise.all() para queries paralelas</li>
          </ul>
        </div>

        {courses.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">📋 Cursos (Primeiros 3)</h2>
            <div className="space-y-3">
              {courses.slice(0, 3).map((course, index) => (
                <div key={course.id} className="bg-gray-700 p-4 rounded text-sm">
                  <div className="font-semibold">{course.title}</div>
                  <div className="text-gray-300">
                    Categoria: {course.category?.name || 'N/A'} | 
                    Status: {course.is_published ? 'Publicado' : 'Rascunho'} |
                    Preço: R$ {course.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}