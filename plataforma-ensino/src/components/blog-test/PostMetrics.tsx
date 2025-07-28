'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

interface PostMetricsProps {
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  readingTime?: number;
  engagementRate?: number;
  uniqueVisitors?: number;
  publishedDays?: number;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function PostMetrics({
  views = 1247,
  likes = 89,
  comments = 23,
  shares = 45,
  readingTime = 8,
  engagementRate = 12.5,
  uniqueVisitors = 892,
  publishedDays = 3,
  variant = 'default',
  className = ''
}: PostMetricsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const metrics = [
    {
      name: 'Visualizações',
      value: formatNumber(views),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      name: 'Curtidas',
      value: formatNumber(likes),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+8%'
    },
    {
      name: 'Comentários',
      value: formatNumber(comments),
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+15%'
    },
    {
      name: 'Compartilhamentos',
      value: formatNumber(shares),
      icon: Share2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%'
    }
  ];

  const additionalMetrics = [
    {
      name: 'Taxa de Engajamento',
      value: `${engagementRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Visitantes Únicos',
      value: formatNumber(uniqueVisitors),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Tempo de Leitura',
      value: `${readingTime}min`,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      name: 'Dias Publicado',
      value: publishedDays.toString(),
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{formatNumber(views)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{formatNumber(likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{formatNumber(comments)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{readingTime}min</span>
        </div>
      </div>
    );
  }

  // Detailed Variant
  if (variant === 'detailed') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Main Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <div key={metric.name} className="text-center">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {metric.change}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Métricas Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {additionalMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default Variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Métricas do Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className={`w-10 h-10 ${metric.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="text-xl font-bold text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.name}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Taxa de Engajamento: {engagementRate}%</span>
            <span>Publicado há {publishedDays} dias</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}