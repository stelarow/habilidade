'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Optimized Image component that wraps Next.js Image with performance enhancements
 * - Automatic WebP/AVIF format selection
 * - Responsive sizing
 * - Loading states
 * - Error handling
 * - Lazy loading by default
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? '100vw'
      : width && width > 640
        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        : '(max-width: 640px) 100vw, 50vw'
  )

  if (imageError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground border border-border rounded-lg",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-sm">Imagem não encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted animate-pulse rounded-lg z-10",
            fill ? "w-full h-full" : ""
          )}
          style={fill ? undefined : { width, height }}
        >
          <div className="text-muted-foreground">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={responsiveSizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  )
}

export default OptimizedImage