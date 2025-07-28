'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface BlogHeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showNavigation?: boolean;
  className?: string;
}

export function BlogHeader({
  title = 'Blog Escola Habilidade',
  subtitle = 'Conhecimento que transforma vidas',
  showSearch = true,
  showNavigation = true,
  className = ''
}: BlogHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'Todos os Posts', href: '#', active: true },
    { name: 'Design Gráfico', href: '#' },
    { name: 'Marketing Digital', href: '#' },
    { name: 'Desenvolvimento', href: '#' },
    { name: 'Empreendedorismo', href: '#' },
    { name: 'Produtividade', href: '#' }
  ];

  return (
    <header className={`relative bg-gradient-to-br from-background via-background to-muted border-b border-border/50 ${className}`}>
      {/* Hero Section */}
      <div className="container-custom px-6 py-12 md:py-16">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <Badge variant="secondary" className="px-3 py-1">
              Blog
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {showSearch && (
            <div className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="border-t border-border/30 bg-background/80 backdrop-blur-sm">
          <div className="container-custom px-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center py-4">
              <div className="flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={item.active ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-9 px-4 text-sm ${
                      item.active 
                        ? 'gradient-button' 
                        : 'hover:text-primary hover:bg-muted/50'
                    }`}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Categorias
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="h-8 w-8 p-0"
                >
                  {isMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {isMenuOpen && (
                <div className="mt-4 space-y-2 pb-4 border-b border-border/30">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.name}
                      variant={item.active ? 'default' : 'ghost'}
                      size="sm"
                      className={`w-full justify-start h-9 ${
                        item.active 
                          ? 'gradient-button' 
                          : 'hover:text-primary hover:bg-muted/50'
                      }`}
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-secondary/5 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-accent/5 rounded-full blur-xl" />
      </div>
    </header>
  );
}