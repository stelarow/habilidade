import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

// Mock data - In production, this would come from server components fetching from Supabase
const mockMetrics = {
  totalPosts: 47,
  publishedPosts: 35,
  draftPosts: 8,
  archivedPosts: 4,
  totalViews: 12847,
  monthlyViews: 3245,
  avgEngagement: 67,
  totalCategories: 5,
  postsThisMonth: 8,
  conversionRate: 4.2
}

const viewsData = [
  { name: 'Jan', views: 2400 },
  { name: 'Fev', views: 1398 },
  { name: 'Mar', views: 9800 },
  { name: 'Abr', views: 3908 },
  { name: 'Mai', views: 4800 },
  { name: 'Jun', views: 3800 },
  { name: 'Jul', views: 4300 }
]

const topPosts = [
  { id: '1', title: 'Como Começar no Design Gráfico', views: 1847, category: 'Design', status: 'published' },
  { id: '2', title: 'Tendências de UX/UI para 2024', views: 1543, category: 'Tecnologia', status: 'published' },
  { id: '3', title: 'Marketing Digital para Iniciantes', views: 1298, category: 'Marketing', status: 'published' },
  { id: '4', title: 'Desenvolvimento Web com React', views: 1156, category: 'Tecnologia', status: 'published' },
  { id: '5', title: 'Fotografia para Redes Sociais', views: 987, category: 'Design', status: 'published' }
]

const categoryData = [
  { name: 'Tecnologia', value: 35, color: '#d400ff' },
  { name: 'Design', value: 28, color: '#00c4ff' },
  { name: 'Marketing', value: 20, color: '#a000ff' },
  { name: 'Educação', value: 12, color: '#ff6600' },
  { name: 'Outros', value: 5, color: '#00ff88' }
]

const recentPosts = [
  { id: '1', title: 'Nova funcionalidade do Figma', status: 'draft', updatedAt: '2024-01-29T10:30:00Z', category: 'Design' },
  { id: '2', title: 'Inteligência Artificial no Design', status: 'published', updatedAt: '2024-01-28T14:15:00Z', category: 'Tecnologia' },
  { id: '3', title: 'SEO para Blogs em 2024', status: 'draft', updatedAt: '2024-01-27T09:45:00Z', category: 'Marketing' },
  { id: '4', title: 'Paleta de Cores Minimalista', status: 'published', updatedAt: '2024-01-26T16:20:00Z', category: 'Design' }
]

function MetricCard({ title, value, description, trend, icon }: {
  title: string
  value: string | number
  description?: string
  trend?: { value: number; positive: boolean }
  icon?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <span className="text-2xl">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs flex items-center ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.positive ? '↗️' : '↘️'}</span>
            <span className="ml-1">{Math.abs(trend.value)}% desde o mês passado</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ title, description, href, icon, badge }: {
  title: string
  description: string
  href: string
  icon: string
  badge?: string
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{icon}</span>
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button className="w-full">Acessar</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function BlogDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Blog</h1>
          <p className="text-muted-foreground">
            Gerencie seu conteúdo e acompanhe as métricas do blog
          </p>
        </div>
        <Link href="/admin/blog/posts/new">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            ✨ Novo Post
          </Button>
        </Link>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Posts"
            value={mockMetrics.totalPosts}
            description={`${mockMetrics.publishedPosts} publicados, ${mockMetrics.draftPosts} rascunhos`}
            trend={{ value: 12, positive: true }}
            icon="📝"
          />
          <MetricCard
            title="Visualizações (Mês)"
            value={mockMetrics.monthlyViews.toLocaleString()}
            description={`${mockMetrics.totalViews.toLocaleString()} total`}
            trend={{ value: 8, positive: true }}
            icon="👁️"
          />
          <MetricCard
            title="Taxa de Engajamento"
            value={`${mockMetrics.avgEngagement}%`}
            description="Média dos últimos 30 dias"
            trend={{ value: 3, positive: true }}
            icon="💖"
          />
          <MetricCard
            title="Conversão CTA"
            value={`${mockMetrics.conversionRate}%`}
            description="Posts com call-to-action"
            trend={{ value: 0.5, positive: true }}
            icon="🎯"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visualizações ao Longo do Tempo</CardTitle>
              <CardDescription>Últimos 7 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#d400ff" 
                    strokeWidth={2}
                    dot={{ fill: '#d400ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
              <CardDescription>Porcentagem de posts por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Posts Mais Visualizados</CardTitle>
              <CardDescription>Top 5 posts do mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/blog/posts/${post.id}/edit`}>
                        <p className="text-sm font-medium truncate hover:text-purple-600">
                          {post.title}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.views.toLocaleString()} visualizações</span>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Posts Recentes</CardTitle>
                  <CardDescription>Últimas atualizações</CardDescription>
                </div>
                <Link href="/admin/blog/posts">
                  <Button variant="outline" size="sm">Ver Todos</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/blog/posts/${post.id}/edit`}>
                        <p className="text-sm font-medium truncate hover:text-purple-600">
                          {post.title}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.updatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className={post.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {post.status === 'published' ? '✅' : '📝'} {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <QuickActionCard
                title="Novo Post"
                description="Criar um novo post do blog"
                href="/admin/blog/posts/new"
                icon="✨"
              />
              <QuickActionCard
                title="Gerenciar Posts"
                description="Ver e editar posts existentes"
                href="/admin/blog/posts"
                icon="📝"
                badge={`${mockMetrics.totalPosts}`}
              />
              <QuickActionCard
                title="Categorias"
                description="Organizar categorias do blog"
                href="/admin/blog/categories"
                icon="🏷️"
                badge={`${mockMetrics.totalCategories}`}
              />
              <QuickActionCard
                title="Configurações"
                description="SEO e configurações gerais"
                href="/admin/blog/settings"
                icon="⚙️"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Performance</CardTitle>
            <CardDescription>Indicadores chave de desempenho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Meta de Posts (Mês)</span>
                <span>{mockMetrics.postsThisMonth}/10</span>
              </div>
              <Progress value={(mockMetrics.postsThisMonth / 10) * 100} className="h-2" />
            </div>
            
            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{mockMetrics.publishedPosts}</p>
                <p className="text-xs text-muted-foreground">Posts Publicados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{mockMetrics.draftPosts}</p>
                <p className="text-xs text-muted-foreground">Rascunhos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{mockMetrics.archivedPosts}</p>
                <p className="text-xs text-muted-foreground">Arquivados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}