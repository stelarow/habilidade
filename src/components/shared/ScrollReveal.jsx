import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Wrapper component para animações de scroll compatível com SSG
 * Usando classes CSS para performance otimizada
 */
export const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  style = {},
  ...props
}) => {
  const [ref, isVisible, hasAnimated] = useScrollAnimation({
    threshold,
    once: triggerOnce,
    delay: delay * 1000 // Converter para ms
  });

  // Classes de animação baseadas no tipo
  const animationClasses = {
    'fade-up': 'scroll-reveal fade-up',
    'slide-left': 'scroll-reveal slide-left',
    'slide-right': 'scroll-reveal slide-right',
    'zoom-in': 'scroll-reveal zoom-in'
  };

  // Classe de delay
  const delayClass = delay > 0 ? `delay-${Math.min(Math.round(delay * 100), 500)}` : '';

  const baseClasses = animationClasses[animation] || 'scroll-reveal fade-up';
  const visibleClass = isVisible ? 'reveal' : '';
  const finalClasses = `${baseClasses} ${delayClass} ${visibleClass} ${className}`.trim();

  return (
    <div
      ref={ref}
      className={finalClasses}
      style={{
        transitionDuration: `${duration}s`,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Component especializado para hero sections
 */
export const HeroReveal = ({ children, type = 'title', className = '', ...props }) => {
  const [ref, isVisible, hasAnimated] = useScrollAnimation({
    threshold: 0.1,
    once: true
  });

  const typeClasses = {
    title: 'hero-title-reveal',
    subtitle: 'hero-subtitle-reveal',
    cta: 'hero-cta-reveal'
  };

  const baseClass = typeClasses[type] || 'hero-title-reveal';
  const visibleClass = isVisible ? 'reveal' : '';
  const finalClasses = `${baseClass} ${visibleClass} ${className}`.trim();

  return (
    <div ref={ref} className={finalClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Component para grid de cards com stagger effect
 */
export const CardGridReveal = ({
  children,
  staggerDelay = 0.1,
  className = '',
  itemClassName = '',
  ...props
}) => {
  const [containerRef, isVisible, hasAnimated] = useScrollAnimation({
    threshold: 0.1,
    once: true
  });

  return (
    <div ref={containerRef} className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`card-grid-item ${isVisible ? 'reveal' : ''} ${itemClassName}`}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}s` : '0s'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * HOC para adicionar animação de scroll a qualquer componente
 */
export const withScrollReveal = (WrappedComponent, animationConfig = {}) => {
  return React.forwardRef((props, ref) => {
    const {
      animation = 'fade-up',
      delay = 0,
      threshold = 0.1,
      triggerOnce = true,
      ...restConfig
    } = animationConfig;

    return (
      <ScrollReveal
        animation={animation}
        delay={delay}
        threshold={threshold}
        triggerOnce={triggerOnce}
        {...restConfig}
      >
        <WrappedComponent ref={ref} {...props} />
      </ScrollReveal>
    );
  });
};

export default ScrollReveal;