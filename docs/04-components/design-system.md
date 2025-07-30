# 🎨 DESIGN SYSTEM - ESCOLA HABILIDADE

## 📋 VISÃO GERAL

O design system da Escola Habilidade utiliza uma abordagem unificada entre o marketing site (React/Vite + Tailwind) e a plataforma de ensino (Next.js + Shadcn/ui + Tailwind), mantendo consistência visual e funcional.

---

## 🎯 FILOSOFIA DE DESIGN

### Princípios Fundamentais
1. **Consistência**: Mesma linguagem visual em todos os touchpoints
2. **Acessibilidade**: WCAG 2.1 AA compliance
3. **Performance**: Componentes otimizados e lazy loading
4. **Escalabilidade**: Sistema modular e reutilizável
5. **Responsividade**: Mobile-first approach

---

## 🎨 IDENTIDADE VISUAL

### Paleta de Cores Principal
```css
:root {
  /* Brand Colors - Escola Habilidade */
  --habilidade-primary: #d400ff;    /* Roxo Principal */
  --habilidade-secondary: #00c4ff;  /* Azul Secundário */
  --habilidade-accent: #a000ff;     /* Roxo Accent */
  --habilidade-gradient: linear-gradient(135deg, #d400ff 0%, #a000ff 100%);
  
  /* Semantic Colors */
  --success: #10b981;               /* Verde Sucesso */
  --warning: #f59e0b;               /* Amarelo Aviso */
  --error: #ef4444;                 /* Vermelho Erro */
  --info: #3b82f6;                  /* Azul Informativo */
  
  /* Neutral Colors */
  --background: #ffffff;
  --background-secondary: #f8fafc;
  --foreground: #0f172a;
  --foreground-muted: #64748b;
  --muted: #f1f5f9;
  --border: #e2e8f0;
  --border-muted: #f1f5f9;
  
  /* Dark Mode */
  --dark-background: #0f172a;
  --dark-background-secondary: #1e293b;
  --dark-foreground: #f8fafc;
  --dark-muted: #334155;
  --dark-border: #334155;
}
```

### Variações de Cor por Contexto
```css
/* Marketing Site - Mais vibrante */
.marketing-theme {
  --primary: var(--habilidade-primary);
  --primary-hover: #b800d9;
  --primary-active: #9c00bf;
}

/* Learning Platform - Mais sutil */
.platform-theme {
  --primary: 262.1 83.3% 57.8%; /* HSL para Shadcn */
  --primary-foreground: 210 20% 98%;
  --ring: 262.1 83.3% 57.8%;
}
```

---

## 🔤 TIPOGRAFIA

### Font Stack
```css
/* Família Principal */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 
                       'Segoe UI', 'Habilvetica Neue', Arial, sans-serif;

/* Família Secundária (Headings) */
--font-family-heading: 'Inter', system-ui, sans-serif;

/* Família Monospace (Code) */
--font-family-mono: 'Fira Code', 'Cascadia Code', 'Monaco', 
                    'SF Mono', 'Consolas', monospace;
```

### Scale Tipográfica
```css
/* Font Sizes - Mobile First */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */

/* Font Weights */
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Aplicação Tipográfica
```css
/* Headings */
h1, .text-h1 { 
  font-size: clamp(2.25rem, 4vw, 3.75rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

h2, .text-h2 { 
  font-size: clamp(1.875rem, 3vw, 3rem);
  font-weight: 600;
  line-height: 1.3;
}

h3, .text-h3 { 
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 600;
  line-height: 1.3;
}

/* Body Text */
p, .text-body { 
  font-size: 1rem;
  line-height: 1.6;
  color: var(--foreground);
}

.text-lead { 
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--foreground-muted);
}

/* Small Text */
.text-caption { 
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--foreground-muted);
}
```

---

## 📐 SPACING SYSTEM

### Scale de Espaçamento
```css
/* Tailwind-based spacing scale */
--space-px: 1px;
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */

/* Layout spacing */
--space-section: clamp(4rem, 8vw, 8rem);
--space-container: clamp(1rem, 4vw, 2rem);
```

---

## 🖱️ COMPONENTES BASE

### Botões (Buttons)
```css
/* Base Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Button Variants */
.btn-primary {
  background: var(--habilidade-primary);
  color: white;
  
  &:hover {
    background: #b800d9;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(212, 0, 255, 0.3);
  }
}

.btn-secondary {
  background: var(--habilidade-secondary);
  color: white;
  
  &:hover {
    background: #0094cc;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 196, 255, 0.3);
  }
}

.btn-outline {
  background: transparent;
  border-color: var(--border);
  color: var(--foreground);
  
  &:hover {
    background: var(--muted);
    border-color: var(--primary);
  }
}

.btn-ghost {
  background: transparent;
  color: var(--foreground);
  
  &:hover {
    background: var(--muted);
  }
}

/* Button Sizes */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: 1.125rem;
}
```

### Cards
```css
.card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.card-header {
  margin-bottom: 1rem;
  
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 0.5rem;
  }
  
  .card-description {
    color: var(--foreground-muted);
    font-size: 0.875rem;
  }
}

.card-content {
  flex: 1;
}

.card-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-muted);
}
```

### Form Elements
```css
/* Input Base */
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(212, 0, 255, 0.1);
  }
  
  &::placeholder {
    color: var(--foreground-muted);
  }
  
  &:disabled {
    background: var(--muted);
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Textarea */
.textarea {
  @extend .input;
  min-height: 6rem;
  resize: vertical;
}

/* Select */
.select {
  @extend .input;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='6,9 12,15 18,9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Label */
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

/* Form Group */
.form-group {
  margin-bottom: 1rem;
  
  .form-error {
    color: var(--error);
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .form-hint {
    color: var(--foreground-muted);
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
}
```

---

## 📱 BREAKPOINTS E GRID

### Breakpoints Responsivos
```css
/* Mobile First Breakpoints */
:root {
  --breakpoint-sm: 640px;    /* Small devices */
  --breakpoint-md: 768px;    /* Medium devices */
  --breakpoint-lg: 1024px;   /* Large devices */
  --breakpoint-xl: 1280px;   /* Extra large */
  --breakpoint-2xl: 1536px;  /* 2x Extra large */
}

/* Media Query Mixins */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Container System
```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (min-width: 640px) {
    max-width: 640px;
    padding: 0 1.5rem;
  }
  
  @media (min-width: 768px) {
    max-width: 768px;
  }
  
  @media (min-width: 1024px) {
    max-width: 1024px;
    padding: 0 2rem;
  }
  
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
  
  @media (min-width: 1536px) {
    max-width: 1536px;
  }
}

/* Wider container for marketing content */
.container-wide {
  @extend .container;
  
  @media (min-width: 1280px) {
    max-width: 1400px;
  }
  
  @media (min-width: 1536px) {
    max-width: 1600px;
  }
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: 1rem;
  
  /* Common patterns */
  &.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  &.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  &.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  &.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  /* Responsive variants */
  @media (min-width: 768px) {
    &.md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    &.md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  }
  
  @media (min-width: 1024px) {
    &.lg\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
    &.lg\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  }
}

/* Flexbox utilities */
.flex {
  display: flex;
  
  &.flex-col { flex-direction: column; }
  &.flex-wrap { flex-wrap: wrap; }
  &.items-center { align-items: center; }
  &.justify-center { justify-content: center; }
  &.justify-between { justify-content: space-between; }
  &.gap-4 { gap: 1rem; }
  &.gap-6 { gap: 1.5rem; }
}
```

---

## 🎭 ESTADO E INTERAÇÕES

### Estados de Componentes
```css
/* Loading State */
.loading {
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    animation: loading-shimmer 1.5s infinite;
  }
}

@keyframes loading-shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--border) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Focus States */
.focus-ring {
  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}

/* Hover Animations */
.hover-lift {
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.hover-scale {
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
}

/* Active States */
.active {
  background: var(--primary);
  color: white;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## 🌙 DARK MODE

### Dark Mode Implementation
```css
/* Dark mode toggle */
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--dark-background);
    --background-secondary: var(--dark-background-secondary);
    --foreground: var(--dark-foreground);
    --muted: var(--dark-muted);
    --border: var(--dark-border);
  }
}

/* Manual dark mode class */
.dark {
  --background: var(--dark-background);
  --background-secondary: var(--dark-background-secondary);
  --foreground: var(--dark-foreground);
  --foreground-muted: #94a3b8;
  --muted: var(--dark-muted);
  --border: var(--dark-border);
  
  /* Adjust primary colors for dark mode */
  --habilidade-primary: #e879f9;
  --habilidade-secondary: #38bdf8;
}

/* Dark mode specific components */
.dark .card {
  background: var(--dark-background-secondary);
  border-color: var(--dark-border);
}

.dark .input {
  background: var(--dark-background-secondary);
  border-color: var(--dark-border);
  color: var(--dark-foreground);
}
```

---

## 🧩 COMPONENTES ESPECÍFICOS

### Marketing Site Components
```css
/* Hero Section */
.hero {
  background: linear-gradient(135deg, 
    var(--habilidade-primary) 0%, 
    var(--habilidade-accent) 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  
  .hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: clamp(1.125rem, 2vw, 1.5rem);
    opacity: 0.9;
    margin-bottom: 2rem;
  }
}

/* Course Card */
.course-card {
  @extend .card;
  overflow: hidden;
  
  .course-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  .course-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--success);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .course-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .original-price {
      text-decoration: line-through;
      color: var(--foreground-muted);
      font-size: 0.875rem;
    }
    
    .current-price {
      color: var(--success);
      font-weight: 700;
      font-size: 1.25rem;
    }
  }
}
```

### Platform Components
```css
/* Dashboard Stats */
.stats-card {
  @extend .card;
  text-align: center;
  
  .stats-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .stats-label {
    color: var(--foreground-muted);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

/* Progress Bar */
.progress {
  width: 100%;
  height: 0.75rem;
  background: var(--muted);
  border-radius: 9999px;
  overflow: hidden;
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, 
      var(--habilidade-primary), 
      var(--habilidade-secondary));
    border-radius: 9999px;
    transition: width 0.3s ease-in-out;
  }
}

/* Lesson Item */
.lesson-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: var(--primary);
    background: var(--background-secondary);
  }
  
  .lesson-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lesson-content {
    flex: 1;
    
    .lesson-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .lesson-duration {
      color: var(--foreground-muted);
      font-size: 0.875rem;
    }
  }
  
  .lesson-status {
    &.completed {
      color: var(--success);
    }
    
    &.in-progress {
      color: var(--warning);
    }
  }
}
```

---

## 📏 TOKENS DE DESIGN

### Shadow System
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  
  /* Colored shadows */
  --shadow-primary: 0 8px 25px rgba(212, 0, 255, 0.3);
  --shadow-secondary: 0 8px 25px rgba(0, 196, 255, 0.3);
}
```

### Border Radius System
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Z-Index Scale
```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### CSS Custom Properties
```css
/* Automatic theme switching */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border: #000000;
    --foreground: #000000;
    --background: #ffffff;
  }
}

/* Print styles */
@media print {
  * {
    color: black !important;
    background: white !important;
    box-shadow: none !important;
  }
}
```

### Utility Classes Generation
```javascript
// tailwind.config.js - Custom utilities
module.exports = {
  theme: {
    extend: {
      colors: {
        'habilidade': {
          primary: '#d400ff',
          secondary: '#00c4ff',
          accent: '#a000ff',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    }
  }
}
```

---

*Documentação atualizada em: 30/07/2025*