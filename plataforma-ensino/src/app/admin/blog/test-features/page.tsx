import { requireAdmin } from '@/lib/auth/session'
import { ThemeTest } from '@/components/ui/theme-test'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering for admin pages that use server-side Supabase client
export const dynamic = 'force-dynamic'

const implementedFeatures = [
  {
    id: 1,
    title: 'Configurar Shadcn/ui com tema violet',
    status: 'completed',
    description: 'Tema configurado com cores da Escola Habilidade',
    testPath: '/admin/blog/test-features',
    completedItems: [
      'components.json criado',
      'Variáveis CSS configuradas',
      'Componentes base instalados (input, textarea, select, dialog, form, tabs)',
      'Integração com design system existente',
      'Componente de teste criado'
    ]
  },
  {
    id: 2,
    title: 'Estrutura de navegação admin para blog',
    status: 'completed',
    description: 'Sidebar especializada e breadcrumbs dinâmicos',
    testPath: '/admin/blog',
    completedItems: [
      'BlogAdminSidebar com navegação específica',
      'BlogBreadcrumbs dinâmicos por rota',
      'BlogStatsBar com métricas em tempo real',
      'Layout responsivo implementado',
      'Estatísticas rápidas integradas'
    ]
  },
  {
    id: 3,
    title: 'Dashboard do blog',
    status: 'completed', 
    description: 'Dashboard informativo com métricas e ações rápidas',
    testPath: '/admin/blog',
    completedItems: [
      'Cards de métricas principais (posts, visualizações, conversão)',
      'Tabela de posts mais populares',
      'Ações rápidas (criar post, gerenciar categorias)',
      'Auto-refresh a cada 30 segundos',
      'Estados de loading bem tratados'
    ]
  },
  {
    id: 4,
    title: 'CRUD de categorias de blog',
    status: 'completed',
    description: 'Gerenciamento completo de categorias com validação',
    testPath: '/admin/blog/categories',
    completedItems: [
      'Listagem de categorias com contagem de posts',
      'Formulário de criação/edição com validação Zod',
      'Seletor de cor para categorias',
      'Modal de confirmação para exclusão',
      'Validação de slugs únicos em tempo real'
    ]
  },
  {
    id: 5,
    title: 'Editor de posts principal (PostEditor)',
    status: 'completed',
    description: 'Editor rico com 4 abas (Conteúdo, SEO, CTA, Configurações)',
    testPath: '/admin/blog/posts/new',
    completedItems: [
      'Editor com 4 abas: Conteúdo, SEO, Call-to-Action, Configurações',
      'Integração com React Hook Form e validação Zod',
      'Contadores de caracteres em tempo real',
      'Auto-geração de slug a partir do título',
      'Contagem de palavras e tempo de leitura estimado',
      'Controles de CTA contextual com seleção de curso',
      'Seletor de data/hora para agendamento',
      'Switches para opções (destaque, comentários)',
      'Preview em tempo real integrado'
    ]
  },
  {
    id: 6,
    title: 'Sistema de upload e gerenciamento de mídia',
    status: 'completed',
    description: 'Upload drag-and-drop com integração Supabase Storage',
    testPath: '/admin/blog/media',
    completedItems: [
      'Interface drag-and-drop para upload',
      'Validação de tipos e tamanhos de arquivo',
      'Redimensionamento automático (thumbnail, medium, large)',
      'Galeria de arquivos com preview',
      'Sistema de alt-text para acessibilidade',
      'Integração com Supabase Storage preparada',
      'Progresso de upload em tempo real',
      'Gerenciamento de metadados de arquivo',
      'Copy-to-clipboard para URLs'
    ]
  },
  {
    id: 7,
    title: 'Páginas de gerenciamento de posts',
    status: 'pending',
    description: 'Listagem, criação e edição de posts',
    testPath: '/admin/blog/posts',
    completedItems: []
  },
  {
    id: 8,
    title: 'Sistema de preview e agendamento',
    status: 'completed',
    description: 'Preview fiel e agendamento de posts',
    testPath: '/admin/blog/scheduling',
    completedItems: [
      'Preview responsivo com simulação mobile/tablet/desktop',
      'Renderização fiel ao layout do site principal',
      'Preview SEO com meta tags e estruturação',
      'Sistema de agendamento com calendário',
      'Controles de publicação imediata vs agendada',
      'Histórico de ações de publicação',
      'Alertas para posts agendados próximos',
      'Estados visuais claros para cada status',
      'Validação de datas futuras para agendamento'
    ]
  }
]

export default async function TestFeaturesPage() {
  await requireAdmin()

  const completedCount = implementedFeatures.filter(f => f.status === 'completed').length
  const inProgressCount = implementedFeatures.filter(f => f.status === 'in-progress').length
  const pendingCount = implementedFeatures.filter(f => f.status === 'pending').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 border-green-500/20">Concluído</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">Em Progresso</Badge>
      default:
        return <Badge variant="secondary">Pendente</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Status de Implementação - Feature 2</h1>
        <p className="text-muted-foreground mt-2">
          Painel Administrativo de Blog na Plataforma - Progresso atual
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              de 8 tarefas totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Em Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              tarefas iniciadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              aguardando implementação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tarefas Implementadas</h2>
        
        {implementedFeatures.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(feature.status)}
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(feature.status)}
                  {feature.status !== 'pending' && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={feature.testPath}>
                        Testar
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {feature.completedItems.length > 0 && (
              <CardContent>
                <h4 className="text-sm font-medium mb-2">Itens Implementados:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {feature.completedItems.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Theme Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Teste do Tema Shadcn/ui</CardTitle>
          <CardDescription>
            Validação da configuração do tema violet com cores da Escola Habilidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeTest />
        </CardContent>
      </Card>
    </div>
  )
}