'use client'

import { useState } from 'react'
import { User } from '@/types'
import { createClient } from '../../../lib/supabase/client'
import { 
  MagnifyingGlassIcon,
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

interface Certificate {
  id: string
  user_id: string
  course_id: string
  certificate_number: string
  issued_at: string
  pdf_url?: string
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

interface CertificatesManagementProps {
  certificates: Certificate[]
  currentUser: User | null
}

export function CertificatesManagement({ certificates: initialCertificates, currentUser }: CertificatesManagementProps) {
  const [certificates, setCertificates] = useState(initialCertificates)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = searchTerm === '' || 
      certificate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleRegenerateCertificate = async (certificateId: string) => {
    setLoading(true)
    
    try {
      // Here you would implement certificate regeneration logic
      // For now, we'll just update the timestamp
      const { error } = await supabase
        .from('certificates')
        .update({ issued_at: new Date().toISOString() })
        .eq('id', certificateId)

      if (error) throw error

      setCertificates(certificates.map(cert => 
        cert.id === certificateId 
          ? { ...cert, issued_at: new Date().toISOString() }
          : cert
      ))
      
      alert('Certificado regenerado com sucesso!')
    } catch (error) {
      console.error('Error regenerating certificate:', error)
      alert('Erro ao regenerar certificado')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCertificate = async (certificate: Certificate) => {
    if (!certificate.pdf_url) {
      alert('PDF do certificado não disponível')
      return
    }

    try {
      const response = await fetch(certificate.pdf_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificado-${certificate.certificate_number}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading certificate:', error)
      alert('Erro ao baixar certificado')
    }
  }

  const formatCertificateNumber = (number: string) => {
    return number.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gerenciamento de Certificados</h1>
        <p className="text-gray-400">Gerencie os certificados de conclusão dos cursos</p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por estudante, curso ou número do certificado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Total de Certificados</p>
          <p className="text-2xl font-bold text-white">{certificates.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Emitidos Este Mês</p>
          <p className="text-2xl font-bold text-green-400">
            {certificates.filter(c => 
              new Date(c.issued_at).getMonth() === new Date().getMonth() &&
              new Date(c.issued_at).getFullYear() === new Date().getFullYear()
            ).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Cursos Únicos</p>
          <p className="text-2xl font-bold text-purple-400">
            {new Set(certificates.map(c => c.course_id)).size}
          </p>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-750">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estudante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Número do Certificado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Data de Emissão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCertificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover"
                          src={certificate.user.avatar_url || '/api/placeholder/40/40'} 
                          alt={certificate.user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{certificate.user.name}</div>
                        <div className="text-sm text-gray-400">{certificate.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded object-cover"
                          src={certificate.course.thumbnail_url || '/api/placeholder/40/40'} 
                          alt={certificate.course.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{certificate.course.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-sm text-gray-300 font-mono">
                        {formatCertificateNumber(certificate.certificate_number)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-300">
                        {new Date(certificate.issued_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadCertificate(certificate)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Baixar certificado"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleRegenerateCertificate(certificate.id)}
                        disabled={loading}
                        className="text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                        title="Regenerar certificado"
                      >
                        <DocumentIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCertificates.length === 0 && (
        <div className="text-center py-8">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum certificado encontrado</p>
        </div>
      )}
    </div>
  )
}