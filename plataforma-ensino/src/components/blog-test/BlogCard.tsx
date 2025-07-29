'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Eye, Heart, MessageCircle, User } from 'lucide-react';
import type { BlogPost } from '@/lib/blog-mockdata';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function BlogCard({ post, variant = 'default', className = '' }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (variant === 'featured') {
    return (
      <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden ${className}`}>
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge 
            className="absolute top-4 left-4 font-medium"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </Badge>
          {post.status === 'draft' && (
            <Badge variant="secondary" className="absolute top-4 right-4">
              Rascunho
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author.name}</span>
            <span>"</span>
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          
          <h3 className="text-xl font-bold gradient-text leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(post.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(post.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
            </div>
            
            <Button size="sm" className="gradient-button">
              Ler mais
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/30 backdrop-blur-sm ${className}`}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={post.image}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <Badge 
                className="text-xs mb-2"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </Badge>
              
              <h4 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors truncate-2">
                {post.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>"</span>
                  <span>{post.readingTime} min</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatNumber(post.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden ${className}`}>
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <Badge 
          className="absolute top-3 left-3 text-xs font-medium"
          style={{ backgroundColor: post.category.color }}
        >
          {post.category.name}
        </Badge>
        {post.status === 'draft' && (
          <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
            Rascunho
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-5 h-5 rounded-full"
          />
          <span>{post.author.name}</span>
          <span>"</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
        
        <h3 className="font-bold leading-tight group-hover:text-primary transition-colors truncate-2">
          {post.title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(post.views)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{formatNumber(post.likes)}</span>
            </div>
          </div>
          
          <Button size="sm" variant="ghost" className="text-xs px-2 h-7 hover:text-primary">
            Ler mais
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}