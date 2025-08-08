# Plano de Correção - Página SketchUp+Enscape Lenta

## 🚨 Diagnóstico do Problema

### Sintomas Relatados
- Página nunca termina de carregar
- Extremamente lenta para exibir conteúdo
- Usuário percebe que "nunca carrega"

### Root Cause Identificado
**Loop infinito de requisições duplicadas de imagens** - A mesma imagem sendo solicitada centenas de vezes.

## 📊 Evidências Coletadas

### Playwright Network Analysis
```
[GET] https://www.escolahabilidade.com/assets/cursos/sketchup-enscape/project-2.jpeg => [200] (147x)
[GET] https://www.escolahabilidade.com/assets/cursos/sketchup-enscape/l5v_ub2GBPsN8c9qczmU6.jpeg => [200] (147x)
[GET] https://www.escolahabilidade.com/assets/cursos/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp => [200] (147x)
[GET] https://www.escolahabilidade.com/assets/cursos/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif => [200] (147x)
```

### Arquivos Problemáticos Identificados
1. **`src/pages/curso-sketch-up-enscape.jsx`** - Componente principal
2. **`src/constants/curso-sketchup-enscape.js`** - Dados das empresas
3. **Seção empresas** (linha ~537-600) - Renderização triplicada

### Dados Duplicados
- `COMPANIES_DATA` sendo renderizado **3 vezes** no HTML
- Cada renderização carrega as mesmas 13 imagens de logos
- Total: **~39 imagens** sendo carregadas múltiplas vezes simultaneamente

## 🎯 Plano de Correção

### FASE 1: Correções Críticas (Imediato)

#### 1.1 Corrigir Seção Empresas Duplicada
**Arquivo:** `src/pages/curso-sketch-up-enscape.jsx` (linha ~537-600)

**Problema:** Seção renderizada 3x com os mesmos dados
```jsx
// ANTES (PROBLEMÁTICO)
{/* Seção aparece 3 vezes */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
  {COMPANIES_DATA.map((company, index) => (
    <motion.div key={index}>
      <img src={company.logo} alt={company.name} />
    </motion.div>
  ))}
</div>
```

**Solução:**
```jsx
// DEPOIS (CORRIGIDO)
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
  {COMPANIES_DATA.slice(0, 12).map((company, index) => (
    <motion.div key={`${company.name}-${index}`}>
      <LazyImage src={company.logo} alt={company.name} />
    </motion.div>
  ))}
</div>
```

#### 1.2 Implementar Componente Lazy Loading
**Criar:** `src/components/shared/LazyImage.jsx`

```jsx
import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, onLoad, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loaded && !error) {
          setLoaded(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [loaded, error]);

  return (
    <div ref={imgRef} className={className}>
      {loaded ? (
        <img 
          src={src} 
          alt={alt} 
          loading="lazy"
          onLoad={onLoad}
          onError={() => setError(true)}
          {...props}
        />
      ) : (
        <div 
          className="animate-pulse bg-gray-300 w-full h-full rounded"
          style={{ minHeight: '100px' }}
        />
      )}
    </div>
  );
};

export default LazyImage;
```

### FASE 2: Otimizações de Performance

#### 2.1 Memoizar Componentes
```jsx
// src/pages/curso-sketch-up-enscape.jsx
import { memo, useMemo, useCallback } from 'react';

// Componente seção empresas
const CompaniesSection = memo(() => {
  const companies = useMemo(() => COMPANIES_DATA.slice(0, 12), []);
  
  return (
    <section className="py-20 bg-gray-900">
      {/* conteúdo */}
    </section>
  );
});

CompaniesSection.displayName = 'CompaniesSection';
```

#### 2.2 Otimizar Framer Motion
```jsx
// Reduzir animações simultâneas
const prefersReducedMotion = useReducedMotion();

const containerVariants = prefersReducedMotion ? {} : {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    duration: 0.3, // Reduzido de 0.8s
    staggerChildren: 0.05 // Reduzido de 0.1s
  }
};

const itemVariants = prefersReducedMotion ? {} : {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2 } // Reduzido
};
```

#### 2.3 Implementar Cache de Imagens
**Criar:** `src/utils/imageCache.js`

```jsx
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.preloadedImages = new Set();
  }

  preload(urls) {
    urls.forEach(url => {
      if (!this.preloadedImages.has(url)) {
        const img = new Image();
        img.src = url;
        this.cache.set(url, img);
        this.preloadedImages.add(url);
      }
    });
  }

  get(url) {
    return this.cache.get(url);
  }
}

export const imageCache = new ImageCache();

// Uso no componente
useEffect(() => {
  const logoUrls = COMPANIES_DATA.slice(0, 12).map(company => company.logo);
  imageCache.preload(logoUrls);
}, []);
```

### FASE 3: Validação e Monitoramento

#### 3.1 Métricas para Validar Correção
- **Requisições de rede**: Máximo 1 por imagem
- **Tempo carregamento**: < 3s
- **Core Web Vitals**:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

#### 3.2 Comandos de Teste
```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build:production

# Análise de performance
npm run test:performance
```

## 📂 Estrutura de Arquivos Afetados

```
src/
├── pages/
│   └── curso-sketch-up-enscape.jsx ⚠️  (CRÍTICO - Loop infinito)
├── constants/
│   └── curso-sketchup-enscape.js ℹ️   (Dados duplicados)
├── components/shared/
│   └── LazyImage.jsx ➕              (NOVO - Criar)
└── utils/
    └── imageCache.js ➕              (NOVO - Criar)
```

## 🔧 Implementação Step-by-Step

### Passo 1: Backup e Análise
```bash
# Criar backup da página atual
cp src/pages/curso-sketch-up-enscape.jsx src/pages/curso-sketch-up-enscape.jsx.backup

# Executar análise inicial
npm run dev
# Abrir: http://localhost:3000/cursos/sketchup-enscape
# Abrir DevTools > Network para confirmar problema
```

### Passo 2: Correção Imediata
1. Implementar `LazyImage.jsx`
2. Corrigir seção empresas duplicada
3. Testar localmente

### Passo 3: Otimizações
1. Adicionar memoização
2. Otimizar animações Framer Motion
3. Implementar cache de imagens

### Passo 4: Validação
1. Testes de performance local
2. Build de produção
3. Deploy e teste em produção

## 🚦 Critérios de Sucesso

### ✅ Correção Bem-Sucedida Quando:
- [ ] **0 requisições duplicadas** (era 147+ por imagem)
- [ ] **Tempo carregamento < 3s** (era infinito)
- [ ] **Todas as imagens visíveis** (lazy loading funcional)
- [ ] **Animações suaves** sem travamentos
- [ ] **Core Web Vitals verdes** no Lighthouse

### ❌ Falha Se:
- [ ] Ainda existirem requisições duplicadas
- [ ] Página não carregar completamente
- [ ] Imagens não aparecerem (lazy loading falhou)
- [ ] Performance pior que antes

## 📞 Informações de Contexto

### URLs Importantes
- **Página problema**: https://www.escolahabilidade.com/cursos/sketchup-enscape
- **Repositório**: C:\habilidade\
- **Ambiente dev**: http://localhost:3000/cursos/sketchup-enscape

### Tecnologias Envolvidas
- **React 19** + Vite 7
- **Framer Motion** (animações)
- **TailwindCSS** (estilização)
- **Netlify** (deploy)

### Comandos Úteis
```bash
# Desenvolvimento
npm run dev

# Build otimizado
npm run build:optimize

# Análise bundle
npm run build:analyze

# Testes
npm run test
```

## 🎯 Resultado Final Esperado

Página SketchUp+Enscape carregando **rapidamente** e **completamente**, com todas as imagens visíveis e **zero requisições duplicadas**.

---

**Data de Criação:** Janeiro 2025  
**Status:** CRÍTICO - Implementação Imediata Necessária  
**Responsável:** Próximo desenvolvedor  
**Prioridade:** P0 - Impacta experiência do usuário