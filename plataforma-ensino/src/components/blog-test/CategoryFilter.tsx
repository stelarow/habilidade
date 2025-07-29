'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BlogCategory } from '@/lib/blog-mockdata';
import { Filter, X } from 'lucide-react';

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory?: string;
  onCategoryChange: (categorySlug: string | null) => void;
  showCounts?: boolean;
  variant?: 'default' | 'pills' | 'dropdown';
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  showCounts = true,
  variant = 'default',
  className = ''
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          variant={!selectedCategory ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className={`h-8 px-3 text-xs ${!selectedCategory ? 'gradient-button' : 'hover:text-primary'}`}
        >
          Todos
          {showCounts && (
            <span className="ml-1 opacity-70">
              ({categories.reduce((sum, cat) => sum + cat.count, 0)})
            </span>
          )}
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange(category.slug)}
            className={`h-8 px-3 text-xs ${
              selectedCategory === category.slug 
                ? 'gradient-button' 
                : 'hover:text-primary'
            }`}
          >
            {category.name}
            {showCounts && (
              <span className="ml-1 opacity-70">({category.count})</span>
            )}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 px-3 justify-between min-w-[140px] bg-card/50 backdrop-blur-sm border-border/50"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm">
              {selectedCategory 
                ? categories.find(cat => cat.slug === selectedCategory)?.name 
                : 'Todas as categorias'
              }
            </span>
          </div>
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-card border border-border/50 rounded-lg shadow-xl backdrop-blur-sm z-50">
            <div className="p-1">
              <button
                onClick={() => {
                  onCategoryChange(null);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors ${
                  !selectedCategory ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Todas as categorias</span>
                  {showCounts && (
                    <span className="text-xs opacity-70">
                      ({categories.reduce((sum, cat) => sum + cat.count, 0)})
                    </span>
                  )}
                </div>
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.slug);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors ${
                    selectedCategory === category.slug ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    {showCounts && (
                      <span className="text-xs opacity-70">({category.count})</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant - badges
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtrar por categoria:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            !selectedCategory 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'hover:bg-muted'
          }`}
          onClick={() => onCategoryChange(null)}
        >
          Todos
          {showCounts && (
            <span className="ml-1 opacity-70">
              ({categories.reduce((sum, cat) => sum + cat.count, 0)})
            </span>
          )}
        </Badge>
        
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.slug ? 'default' : 'secondary'}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedCategory === category.slug
                ? 'shadow-lg'
                : 'hover:bg-muted'
            }`}
            style={
              selectedCategory === category.slug
                ? { backgroundColor: category.color, color: '#ffffff' }
                : {}
            }
            onClick={() => onCategoryChange(category.slug)}
          >
            <div
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
            {showCounts && (
              <span className="ml-1 opacity-70">({category.count})</span>
            )}
          </Badge>
        ))}
      </div>
      
      {selectedCategory && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="w-3 h-3 mr-1" />
          Limpar filtro
        </Button>
      )}
    </div>
  );
}