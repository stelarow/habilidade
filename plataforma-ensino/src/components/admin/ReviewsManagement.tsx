'use client'

import { useState } from 'react'
import { User } from '@/types'
import { createClient } from '../../../lib/supabase/client'
import { 
  MagnifyingGlassIcon,
  StarIcon,
  EyeIcon,
  TrashIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Review {
  id: string
  user_id: string
  course_id: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  course: {
    id: string
    title: string
    thumbnail_url?: string
  }
}

interface ReviewsManagementProps {
  reviews: Review[]
  currentUser: User | null
}

export function ReviewsManagement({ reviews: initialReviews, currentUser }: ReviewsManagementProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all')
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const supabase = createClient()

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter)
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId)

      if (error) throw error

      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, status: newStatus as any }
          : review
      ))
    } catch (error) {
      console.error('Error updating review status:', error)
      alert('Erro ao atualizar status da avaliação')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedReview) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', selectedReview.id)

      if (error) throw error

      setReviews(reviews.filter(review => review.id !== selectedReview.id))
      setShowDeleteModal(false)
      setSelectedReview(null)
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Erro ao deletar avaliação')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600'
      case 'rejected':
        return 'bg-red-600'
      default:
        return 'bg-yellow-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Rejeitado'
      default:
        return 'Pendente'
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < rating ? (
        <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={index} className="h-4 w-4 text-gray-400" />
      )
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Avaliações</h1>
        <p className="text-gray-400">Modere as avaliações dos cursos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por estudante, curso ou comentário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value as any)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todas as Notas</option>
          <option value="5">5 Estrelas</option>
          <option value="4">4 Estrelas</option>
          <option value="3">3 Estrelas</option>
          <option value="2">2 Estrelas</option>
          <option value="1">1 Estrela</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total de Avaliações</p>
          <p className="text-2xl font-bold text-white">{reviews.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-400">
            {reviews.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Aprovadas</p>
          <p className="text-2xl font-bold text-green-400">
            {reviews.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Nota Média</p>
          <p className="text-2xl font-bold text-white">
            {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    className="h-10 w-10 rounded-full object-cover"
                    src={review.user.avatar_url || '/api/placeholder/40/40'} 
                    alt={review.user.name}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{review.user.name}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{review.course.title}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(review.status)}`}>
                      {getStatusText(review.status)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{review.comment}</p>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={review.status}
                    onChange={(e) => handleStatusChange(review.id, e.target.value)}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovar</option>
                    <option value="rejected">Rejeitar</option>
                  </select>
                  
                  <button
                    onClick={() => {
                      setSelectedReview(review)
                      setShowDeleteModal(true)
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhuma avaliação encontrada</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja excluir esta avaliação de <strong>{selectedReview.user.name}</strong>?
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