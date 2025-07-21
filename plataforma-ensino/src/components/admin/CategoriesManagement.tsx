'use client'

import { useState } from 'react'
import { Category, User } from '@/types'
import { UserProfile } from '@/lib/auth/session'
import { createClient } from '@/lib/supabase/client'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface CategoriesManagementProps {
  categories: Category[]
  currentUser: User | UserProfile | null
}

export function CategoriesManagement({ categories: initialCategories, currentUser }: CategoriesManagementProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color_theme: '#d400ff',
    icon: '',
    background_type: 'default'
  })

  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name,
          slug,
          description: formData.description,
          color_theme: formData.color_theme,
          icon: formData.icon,
          background_type: formData.background_type
        }])
        .select()

      if (error) throw error

      setCategories([...categories, data[0]])
      setShowCreateModal(false)
      resetForm()
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Erro ao criar categoria')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    setLoading(true)

    try {
      // First, check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Authentication error:', authError)
        alert('Erro de autenticação. Por favor, faça login novamente.')
        setLoading(false)
        return
      }

      console.log('Updating category with user:', user.id)
      console.log('Category data:', { ...formData, id: selectedCategory.id })

      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      // Check if the new slug/name would conflict with existing categories
      if (slug !== selectedCategory.slug || formData.name !== selectedCategory.name) {
        const { data: existingCategories, error: checkError } = await supabase
          .from('categories')
          .select('id, name, slug')
          .or(`name.ilike.${formData.name},slug.eq.${slug}`)
          .neq('id', selectedCategory.id)

        if (checkError) {
          console.error('Error checking existing categories:', checkError)
        } else if (existingCategories && existingCategories.length > 0) {
          alert('Uma categoria com este nome ou slug já existe.')
          setLoading(false)
          return
        }
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          slug,
          description: formData.description,
          color_theme: formData.color_theme,
          icon: formData.icon,
          background_type: formData.background_type
        })
        .eq('id', selectedCategory.id)
        .select()

      if (error) {
        console.error('Supabase update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        // Provide more specific error messages
        if (error.code === '42501') {
          alert('Erro de permissão: Você não tem permissão para editar categorias.')
        } else if (error.code === '23505') {
          alert('Erro: Uma categoria com este nome ou slug já existe.')
        } else {
          alert(`Erro ao atualizar categoria: ${error.message}`)
        }
        
        throw error
      }

      if (!data || data.length === 0) {
        console.error('No data returned from update')
        alert('Erro: Nenhum dado retornado após a atualização.')
        return
      }

      console.log('Category updated successfully:', data[0])

      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? data[0] : cat
      ))
      setShowEditModal(false)
      resetForm()
      
      // Show success message
      alert('Categoria atualizada com sucesso!')
    } catch (error: any) {
      console.error('Error updating category:', error)
      // Error already handled above with specific messages
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id)

      if (error) throw error

      setCategories(categories.filter(cat => cat.id !== selectedCategory.id))
      setShowDeleteModal(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erro ao deletar categoria')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color_theme: '#d400ff',
      icon: '',
      background_type: 'default'
    })
    setSelectedCategory(null)
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      color_theme: category.color_theme,
      icon: category.icon || '',
      background_type: category.background_type
    })
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciamento de Categorias</h1>
          <p className="text-gray-400">Organize os cursos por categorias</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color_theme }}
                >
                  <TagIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.slug}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(category)
                    setShowDeleteModal(true)
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tema: {category.background_type}</span>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color_theme }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Nova Categoria</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cor do Tema</label>
                <input
                  type="color"
                  value={formData.color_theme}
                  onChange={(e) => setFormData({...formData, color_theme: e.target.value})}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Editar Categoria</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cor do Tema</label>
                <input
                  type="color"
                  value={formData.color_theme}
                  onChange={(e) => setFormData({...formData, color_theme: e.target.value})}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir a categoria <strong>{selectedCategory.name}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}