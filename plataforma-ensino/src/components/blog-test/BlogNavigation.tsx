'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BlogNavigationProps {
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function BlogNavigation({
  breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Artigo', href: '#', current: true }
  ],
  className = ''
}: BlogNavigationProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index === 0 && (
              <Home className="w-4 h-4 text-muted-foreground mr-2" />
            )}
            
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
            
            {item.current ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-normal text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={item.href}>
                  {item.name}
                </a>
              </Button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}