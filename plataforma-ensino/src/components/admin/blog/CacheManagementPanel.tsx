/**
 * Cache Management Panel Component
 * Provides comprehensive cache monitoring and management interface
 */

'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  RefreshCw, 
  Trash2, 
  Database, 
  Activity, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Network,
  TrendingUp,
  BarChart3,
  Settings,
  Search,
  Filter
} from 'lucide-react'

// Types
interface CacheMetrics {
  hits: number
  misses: number
  sets: number
  invalidations: number
  errors: number
  hitRate: number
  averageResponseTime: number
  memoryUsage: number
  redisConnected: boolean
  lastUpdated: string
}

interface CacheEntry {
  key: string
  size: number
  ttl: number
  hits: number
  age: number
}

interface CacheInspection {
  memory: CacheEntry[]
  redis: Array<{
    key: string
    ttl: number
  }>
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  metrics: CacheMetrics
  issues: string[]
}

export default function CacheManagementPanel() {
  // State
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null)
  const [inspection, setInspection] = useState<CacheInspection | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'key' | 'size' | 'hits' | 'age'>('key')

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // Load initial data
  useEffect(() => {
    loadCacheData()
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadCacheData(false) // Silent refresh
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Load cache data
  const loadCacheData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      if (!showLoading) setRefreshing(true)

      // Load metrics, inspection, and health in parallel
      const [metricsRes, inspectionRes, healthRes] = await Promise.all([
        fetch('/api/admin/cache/metrics'),
        fetch('/api/admin/cache/inspect'),
        fetch('/api/admin/cache/health'),
      ])

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json()
        setMetrics(metricsData)
      }

      if (inspectionRes.ok) {
        const inspectionData = await inspectionRes.json()
        setInspection(inspectionData)
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json()
        setHealth(healthData)
      }

    } catch (error) {
      console.error('Failed to load cache data:', error)
    } finally {
      if (showLoading) setLoading(false)
      if (!showLoading) setRefreshing(false)
    }
  }

  // Clear cache
  const clearCache = async (pattern?: string) => {
    try {
      setClearing(true)

      const response = await fetch('/api/admin/cache/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern: pattern || '*' }),
      })

      if (response.ok) {
        await loadCacheData()
      } else {
        throw new Error('Failed to clear cache')
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    } finally {
      setClearing(false)
    }
  }

  // Invalidate specific pattern
  const invalidatePattern = async (pattern: string) => {
    try {
      const response = await fetch('/api/admin/cache/invalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pattern }),
      })

      if (response.ok) {
        await loadCacheData()
      }
    } catch (error) {
      console.error('Failed to invalidate pattern:', error)
    }
  }

  // Filter and sort cache entries
  const filteredEntries = inspection?.memory.filter(entry =>
    entry.key.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'size':
        return b.size - a.size
      case 'hits':
        return b.hits - a.hits
      case 'age':
        return b.age - a.age
      default:
        return a.key.localeCompare(b.key)
    }
  }) || []

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Carregando dados do cache...</span>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Health Status Alert */}
        {health && health.status !== 'healthy' && (
          <Alert variant={health.status === 'degraded' ? 'default' : 'destructive'}>
            {health.status === 'degraded' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <h4 className="text-sm font-medium">
              {health.status === 'degraded' ? 'Cache Degradado' : 'Cache com Problemas'}
            </h4>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2">
                {health.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => loadCacheData()}
              disabled={refreshing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>

            <Button
              onClick={() => clearCache()}
              disabled={clearing}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {clearing ? 'Limpando...' : 'Limpar Tudo'}
            </Button>
          </div>

          {/* Auto-refresh controls */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">Auto-refresh:</span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <span className="text-sm text-muted-foreground">
              {refreshInterval}s
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vis�o Geral</TabsTrigger>
            <TabsTrigger value="inspector">Inspetor</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="configuration">Configura��o</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.hitRate.toFixed(1)}%
                  </div>
                  <Progress 
                    value={metrics?.hitRate || 0} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hits</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.hits.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics?.misses.toLocaleString()} misses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.averageResponseTime.toFixed(1)}ms
                  </div>
                  <p className="text-xs text-muted-foreground">
                    M�dia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uso Mem�ria</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.memoryUsage}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Entradas ativas
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Status Redis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Conex�o:</span>
                    <Badge variant={metrics?.redisConnected ? 'default' : 'secondary'}>
                      {metrics?.redisConnected ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Entradas Redis:</span>
                    <span>{inspection?.redis.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Estat�sticas Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Sets:</span>
                    <span>{metrics?.sets.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Invalida��es:</span>
                    <span>{metrics?.invalidations.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Erros:</span>
                    <span className={metrics?.errors ? 'text-red-600' : ''}>
                      {metrics?.errors.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inspector Tab */}
          <TabsContent value="inspector" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar chaves de cache..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="key">Ordenar por Chave</option>
                <option value="size">Ordenar por Tamanho</option>
                <option value="hits">Ordenar por Hits</option>
                <option value="age">Ordenar por Idade</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => invalidatePattern('posts:*')}
              >
                Invalidar Posts
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => invalidatePattern('categories:*')}
              >
                Invalidar Categorias
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => invalidatePattern('sitemap:*')}
              >
                Invalidar Sitemap
              </Button>
            </div>

            {/* Cache Entries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Entradas no Cache ({filteredEntries.length})</CardTitle>
                <CardDescription>
                  Entradas ativas na mem�ria cache
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chave</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>TTL</TableHead>
                      <TableHead>Hits</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>A��es</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.slice(0, 50).map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {entry.key}
                        </TableCell>
                        <TableCell>{formatBytes(entry.size)}</TableCell>
                        <TableCell>{formatDuration(entry.ttl)}</TableCell>
                        <TableCell>{entry.hits}</TableCell>
                        <TableCell>{formatDuration(entry.age)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => invalidatePattern(entry.key)}
                          >
                            Invalidar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredEntries.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Mostrando 50 de {filteredEntries.length} entradas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  M�tricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {metrics?.hitRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Hit Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {metrics?.averageResponseTime.toFixed(1)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Tempo M�dio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {((metrics?.hits || 0) / ((metrics?.hits || 0) + (metrics?.misses || 0)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Efici�ncia</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Cache Hits</span>
                      <span>{metrics?.hits.toLocaleString()}</span>
                    </div>
                    <Progress value={metrics?.hitRate || 0} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Uso de Mem�ria</span>
                      <span>{metrics?.memoryUsage} entradas</span>
                    </div>
                    <Progress value={Math.min((metrics?.memoryUsage || 0) / 1000 * 100, 100)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configura��es do Cache
                </CardTitle>
                <CardDescription>
                  Configura��es e limites do sistema de cache
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">TTL Posts</label>
                    <p className="text-sm text-muted-foreground">5 minutos</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">TTL Post Individual</label>
                    <p className="text-sm text-muted-foreground">1 hora</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">TTL Categorias</label>
                    <p className="text-sm text-muted-foreground">24 horas</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">TTL Sitemap</label>
                    <p className="text-sm text-muted-foreground">6 horas</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Redis</h4>
                      <p className="text-sm text-muted-foreground">
                        Cache distribu�do para alta performance
                      </p>
                    </div>
                    <Badge variant={metrics?.redisConnected ? 'default' : 'secondary'}>
                      {metrics?.redisConnected ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Webhook Invalidation</h4>
                      <p className="text-sm text-muted-foreground">
                        Invalida��o autom�tica via webhooks
                      </p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Last Updated */}
        <div className="flex justify-center text-sm text-muted-foreground">
          �ltima atualiza��o: {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString('pt-BR') : 'N/A'}
        </div>
      </div>
    </TooltipProvider>
  )
}

// API endpoints for cache management (these would need to be implemented)
// /api/admin/cache/metrics - GET
// /api/admin/cache/inspect - GET  
// /api/admin/cache/health - GET
// /api/admin/cache/clear - POST
// /api/admin/cache/invalidate - POST