'use client';

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  className?: string;
  position?: 'top' | 'bottom';
}

export function ReadingProgress({ className = '', position = 'top' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress);
    
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  const baseClasses = position === 'top' 
    ? 'fixed top-0 left-0 right-0 z-50 h-1'
    : 'fixed bottom-0 left-0 right-0 z-50 h-1';

  return (
    <div className={`${baseClasses} ${className}`}>
      <Progress 
        value={progress} 
        className="h-full rounded-none bg-background/20 border-none"
      />
    </div>
  );
}