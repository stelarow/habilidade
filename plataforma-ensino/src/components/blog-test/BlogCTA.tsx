'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen } from 'lucide-react';

interface BlogCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  courseSlug?: string;
  className?: string;
}

export function BlogCTA({
  title = 'Quer aprender mais sobre este tema?',
  description = 'Explore nossos cursos completos e desenvolva suas habilidades profissionais.',
  buttonText = 'Ver Cursos',
  courseSlug = 'design-grafico-completo',
  className = ''
}: BlogCTAProps) {
  return (
    <Card className={`bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20 ${className}`}>
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold gradient-text">
              {title}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              size="lg"
              className="gradient-button group"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}