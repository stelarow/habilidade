# Tutorial: Como Criar uma Página de Curso

Este documento serve como guia completo para criar páginas de cursos seguindo o padrão estabelecido pela página **Projetista 3D**, que serve como modelo de referência para todas as demais páginas de cursos da Escola Habilidade.

## 📋 Visão Geral da Arquitetura

A página de curso segue uma estrutura modular composta por:
- **13 componentes principais** organizados sequencialmente
- **Sistema de lazy loading** para otimização de performance
- **Background animado específico** para cada curso
- **SEO completo** com meta tags e schema.org
- **Sistema de assets otimizados** (imagens, vídeos, posters)

## 🏗️ Estrutura de Arquivos

### Localização dos Arquivos Principais
```
src/
├── pages/courses/[NomeCurso].jsx           # Página principal do curso
├── components/course/[nome-curso]/         # Componentes específicos
├── components/backgrounds/[Nome]Background.jsx # Background animado
├── data/coursesData.js                     # Dados do curso
├── data/whatsappTemplates.js              # Templates WhatsApp
└── assets/[nome-curso]/                   # Assets do curso
```

### Estrutura de Assets
```
public/assets/[nome-curso]/
├── hero/
│   └── hero-bg-new.jpg                    # Imagem de fundo do hero
├── cases/                                 # Cases de sucesso
│   ├── [aluno-nome]/
│   │   ├── imagem1.png
│   │   ├── video.mp4
│   │   └── video-poster.jpg              # Poster gerado automaticamente
└── imagens-projeto/                       # Portfolio do curso
```

## 🧩 Componentes Obrigatórios

### 1. Página Principal (`[NomeCurso].jsx`)
```jsx
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Rocket } from 'lucide-react';

// Importações dos componentes específicos
import [NomeCurso]HeroSection from '../../components/course/[nome-curso]/[NomeCurso]HeroSection';
import [NomeCurso]PortfolioSection from '../../components/course/[nome-curso]/[NomeCurso]PortfolioSection';
// ... outros imports

const [NomeCurso]New = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* SEO e Meta Tags - OBRIGATÓRIO */}
      <Helmet>
        <title>[Título SEO Completo] | [Localização] | Escola Habilidade</title>
        <meta name="description" content="[Descrição otimizada para SEO]" />
        <meta name="keywords" content="[palavras-chave separadas por vírgula]" />
        
        {/* Open Graph - OBRIGATÓRIO */}
        <meta property="og:title" content="[Título para redes sociais]" />
        <meta property="og:description" content="[Descrição para redes sociais]" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Schema.org para Curso - OBRIGATÓRIO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "[Nome do Curso Completo]",
            "description": "[Descrição detalhada]",
            // ... estrutura completa do schema
          })}
        </script>
      </Helmet>

      {/* Seções obrigatórias na ordem */}
      <[NomeCurso]HeroSection />
      <[NomeCurso]PortfolioSection />
      <[NomeCurso]SuccessCases />
      <[NomeCurso]TransformationPromise />
      <[NomeCurso]PainSolution />
      <[NomeCurso]Curriculum />
      <[NomeCurso]Testimonials />
      
      {/* Empresas Parceiras */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <TrustedCompanies 
          variant="course"
          courseSlug="[slug-do-curso]"
          title="Empresas que confiam na Escola Habilidade"
          subtitle="Profissionais de empresas regionais já se capacitaram conosco"
          theme="dark"
        />
      </section>
      
      <[NomeCurso]Guarantee />
      <[NomeCurso]Investment />
      <[NomeCurso]FAQ />
      <[NomeCurso]FloatingCTA />
      
      {/* CTA Final - Estrutura padronizada */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-purple-500/20 via-zinc-950 to-cyan-400/20 relative overflow-hidden">
        {/* ... estrutura completa do CTA final */}
      </section>
    </main>
  );
};

export default [NomeCurso]New;
```

### 2. Hero Section (`[NomeCurso]HeroSection.jsx`)
**Estrutura obrigatória:**
```jsx
const [NomeCurso]HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Image - OBRIGATÓRIO */}
      <div className="absolute inset-0">
        <img 
          src="/assets/[nome-curso]/hero/hero-bg-new.jpg"
          alt="[Nome do Curso] Background"
          className="w-full h-full object-cover filter blur-[0.5px]"
        />
        {/* Overlays para legibilidade - OBRIGATÓRIO */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/40_70%)]" />
      </div>

      {/* Elementos animados de fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Conteúdo do Hero */}
      {/* ... */}
    </section>
  );
};
```

### 3. Portfolio Section (`[NomeCurso]PortfolioSection.jsx`)
**Padrão de estrutura de dados:**
```jsx
const portfolioItems = [
  {
    id: 1,
    title: "Título do Projeto",
    category: "Categoria",
    src: "/assets/[nome-curso]/imagens-projeto/imagem.png",
    alt: "Descrição da imagem"
  },
  // ...
];
```

### 4. Success Cases (`[NomeCurso]SuccessCases.jsx`)
**Estrutura de dados obrigatória:**
```jsx
const successCases = [
  {
    id: 1,
    studentName: "Nome do Aluno",
    studentTitle: "Profissão/Título",
    studentImage: "/assets/[nome-curso]/cases/[aluno]/foto.jpg",
    description: "Breve descrição do sucesso",
    portfolio: [
      { 
        type: "image", 
        src: "/assets/[nome-curso]/cases/[aluno]/projeto.png", 
        title: "Título do Projeto" 
      },
      { 
        type: "video", 
        src: "/assets/[nome-curso]/cases/[aluno]/video.mp4", 
        poster: "/assets/[nome-curso]/cases/[aluno]/video-poster.jpg", 
        title: "Título do Vídeo" 
      }
    ]
  }
];
```

## 🎨 Padrões de Design e Estilização

### Cores e Gradientes Padrão
```jsx
// Gradientes principais
const gradients = {
  primary: "bg-gradient-to-r from-purple-500 to-cyan-400",
  secondary: "bg-gradient-to-br from-purple-500/20 via-zinc-950 to-cyan-400/20",
  text: "bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent"
};

// Classes de background padrão
const backgrounds = {
  dark: "bg-zinc-950 text-white",
  darker: "bg-zinc-900",
  gradient: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
};
```

### Componentes de UI Reutilizáveis
```jsx
// Botão CTA padrão
const CTAButton = ({ children, className = "" }) => (
  <button className={`group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 ${className}`}>
    {children}
  </button>
);
```

### Responsividade Obrigatória
```jsx
// Classes de responsividade padrão
const responsive = {
  container: "px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
  title: "text-3xl md:text-5xl lg:text-6xl font-bold",
  subtitle: "text-lg md:text-xl lg:text-2xl",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
};
```

## 📊 Configuração de Dados

### 1. coursesData.js
```javascript
{
  // ID único do curso
  id: '[nome-curso]-001',
  
  // Slug para URLs (deve corresponder ao nome da pasta)
  slug: '[nome-curso]',
  
  // Informações básicas
  title: 'Título Completo do Curso',
  shortDescription: 'Descrição curta para cards',
  fullDescription: 'Descrição completa detalhada',
  
  // SEO
  metaTitle: 'Título otimizado para SEO',
  metaDescription: 'Meta description otimizada',
  keywords: ['palavra1', 'palavra2', 'palavra3'],
  ogImage: '/og-images/[nome-curso].jpg',
  
  // Dados do curso
  duration: '56 horas',
  format: 'Presencial',
  maxStudents: 4,
  certification: 'Certificado Nacional',
  
  // Preços
  price: 2793.00,
  installments: 12,
  
  // Grade curricular
  curriculum: {
    modules: [
      {
        title: 'Módulo 1: [Nome]',
        lessons: [
          { title: 'Aula 1: [Título]', duration: '2h' },
          // ...
        ]
      }
    ]
  },
  
  // Localização e disponibilidade
  location: 'São José SC',
  available: true,
  nextClass: '2024-XX-XX'
}
```

### 2. whatsappTemplates.js
```javascript
export const courseTemplates = {
  '[nome-curso]': {
    message: 'Mensagem específica do curso adaptada ao público-alvo',
    relatedKeywords: ['palavra1', 'palavra2', 'palavra3']
  }
};
```

### 3. Background Animado
```javascript
// src/components/backgrounds/[Nome]Background.jsx
import { useEffect, useRef } from 'react';

const [Nome]Background = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Implementação da animação específica do curso
    // Usar cores e elementos relacionados ao tema do curso
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
};

export default [Nome]Background;
```

## 🔧 Configurações Adicionais Obrigatórias

### 1. Registro do Background (LazyBackgrounds.jsx)
```javascript
const backgrounds = {
  // ...
  '[nome-curso]': lazy(() => import('./backgrounds/[Nome]Background.jsx')),
};
```

### 2. Configuração de Cores (CourseBackground.jsx)
```javascript
const courseGradients = {
  // ...
  '[nome-curso]': 'linear-gradient(135deg, #COR1 0%, #COR2 50%, #COR3 100%)',
};
```

### 3. Rota no Sistema (routes.jsx)
```javascript
{
  path: 'cursos/[nome-curso]',
  component: lazy(() => import('./pages/courses/[NomeCurso]'))
}
```

### 4. Ícones e Labels (lessonIcons.js e lessonLabels.js)
```javascript
// lessonIcons.js
'[nome-curso]': {
  default: IconeDefault,
  // mapeamento específico por tipo de aula
},

// lessonLabels.js  
'[nome-curso]': {
  'pratica': 'Aula Prática',
  'teoria': 'Aula Teórica',
  // outros labels específicos
}
```

## 🖼️ Gerenciamento de Assets

### Estrutura Obrigatória de Pastas
```
public/assets/[nome-curso]/
├── hero/
│   └── hero-bg-new.jpg              # 1920x1080 mínimo
├── cases/
│   └── [nome-aluno]/
│       ├── *.png/*.jpg              # Projetos do aluno
│       ├── *.mp4                    # Vídeos demonstração
│       └── *-poster.jpg             # Posters automáticos
├── imagens-projeto/
│   └── *.png/*.jpg                  # Portfolio do curso
└── icons/
    └── course-icon.svg              # Ícone do curso
```

### Scripts de Otimização
```bash
# Scripts disponíveis para otimização
npm run optimize-assets              # Otimização geral
node scripts/extract-video-posters.js  # Geração de posters
node scripts/optimize-[nome]-assets.js  # Script específico do curso
```

### Padrões de Nomenclatura
- **Imagens**: `kebab-case.jpg/png`
- **Vídeos**: `kebab-case.mp4`  
- **Posters**: `nome-video-poster.jpg`
- **Pastas**: `kebab-case` (minúsculas com hífens)

## ✅ Checklist de Implementação

### Fase 1: Preparação
- [ ] Definir slug do curso (kebab-case)
- [ ] Criar estrutura de pastas em `/assets/[nome-curso]/`
- [ ] Otimizar e organizar todas as imagens
- [ ] Gerar posters para todos os vídeos
- [ ] Definir paleta de cores específica

### Fase 2: Configuração de Dados
- [ ] Adicionar entrada em `coursesData.js`
- [ ] Configurar template WhatsApp em `whatsappTemplates.js`
- [ ] Adicionar ícones em `lessonIcons.js`
- [ ] Adicionar labels em `lessonLabels.js`
- [ ] Configurar gradiente em `CourseBackground.jsx`

### Fase 3: Componentes
- [ ] Criar página principal `/pages/courses/[NomeCurso].jsx`
- [ ] Criar pasta `/components/course/[nome-curso]/`
- [ ] Implementar todos os 13 componentes obrigatórios:
  - [ ] HeroSection
  - [ ] PortfolioSection  
  - [ ] SuccessCases
  - [ ] TransformationPromise
  - [ ] PainSolution
  - [ ] Curriculum
  - [ ] Testimonials
  - [ ] Guarantee
  - [ ] Investment
  - [ ] FAQ
  - [ ] FloatingCTA
- [ ] Criar background animado `/backgrounds/[Nome]Background.jsx`
- [ ] Implementar VideoPlayer customizado se necessário

### Fase 4: Integração
- [ ] Registrar background em `LazyBackgrounds.jsx`
- [ ] Adicionar rota em `routes.jsx`
- [ ] Configurar lazy loading
- [ ] Testar responsividade mobile/desktop
- [ ] Validar todos os links e CTAs

### Fase 5: SEO e Otimização
- [ ] Configurar meta tags completas
- [ ] Implementar schema.org para curso
- [ ] Gerar imagem Open Graph
- [ ] Testar carregamento e performance
- [ ] Validar acessibilidade

### Fase 6: Testes Finais
- [ ] Testar todos os CTAs de WhatsApp
- [ ] Verificar exibição de vídeos e posters
- [ ] Validar responsividade em dispositivos reais
- [ ] Testar velocidade de carregamento
- [ ] Verificar SEO com ferramentas (Lighthouse, etc.)

## 🚀 Comandos de Desenvolvimento

### Comandos Essenciais
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build:production

# Testes
npm run test
npm run test:data          # Validação de dados dos cursos
npm run test:routes        # Validação de rotas

# Linting
npm run lint
```

### Comandos de Otimização
```bash
# Otimização de assets específicos
node scripts/optimize-[nome-curso]-assets.js

# Extração de posters de vídeo
node scripts/extract-video-posters.js

# Limpeza e rebuild completo
npm run clean && npm install && npm run build
```

## 📱 Considerações de Responsividade

### Breakpoints Padrão
```javascript
// Tailwind breakpoints utilizados
const breakpoints = {
  sm: '640px',   // Tablet portrait
  md: '768px',   // Tablet landscape  
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Classes Responsivas Obrigatórias
```jsx
// Container responsivo padrão
<div className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

// Títulos responsivos
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">

// Grids responsivos
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Espaçamentos responsivos
<div className="space-y-8 md:space-y-12 lg:space-y-16">
```

## 🔍 SEO e Meta Tags

### Template de Meta Tags Obrigatórias
```jsx
<Helmet>
  {/* Título principal - máximo 60 caracteres */}
  <title>Curso [Nome] - [Tecnologias] | [Cidade] SC | Escola Habilidade</title>
  
  {/* Meta description - máximo 155 caracteres */}
  <meta name="description" content="Curso presencial completo de [tecnologias] em [cidade] SC. [horas] horas práticas, turmas pequenas, certificado nacional." />
  
  {/* Keywords - máximo 10 palavras relevantes */}
  <meta name="keywords" content="curso [tech], [tech2], [cidade] sc, presencial, certificado" />
  
  {/* Open Graph para redes sociais */}
  <meta property="og:title" content="Curso [Nome] - [Tecnologias] | [Cidade] SC" />
  <meta property="og:description" content="Único curso presencial completo em SC. [horas] horas práticas, certificado nacional." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:image" content="/og-images/[nome-curso].jpg" />
  
  {/* Schema.org estruturado */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Course",
      "name": "Curso [Nome Completo]",
      "description": "[Descrição detalhada do curso]",
      "provider": {
        "@type": "Organization",
        "name": "Escola Habilidade",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "[Cidade]",
          "addressRegion": "SC",
          "addressCountry": "BR"
        }
      },
      "courseMode": "onsite",
      "educationalCredentialAwarded": "Certificado Nacional de [X]h",
      "timeRequired": "PT[X]H",
      "offers": {
        "@type": "Offer",
        "price": "[PREÇO].00",
        "priceCurrency": "BRL"
      }
    })}
  </script>
</Helmet>
```

## 🎯 Boas Práticas e Convenções

### Nomenclatura de Arquivos e Componentes
- **Páginas**: `PascalCase.jsx` (ex: `Projetista3D.jsx`)
- **Componentes**: `PascalCase.jsx` (ex: `ProjetistaHeroSection.jsx`)  
- **Pastas**: `kebab-case` (ex: `projetista-3d/`)
- **Assets**: `kebab-case.ext` (ex: `hero-bg-new.jpg`)

### Estrutura de Código
```jsx
// 1. Imports (React, bibliotecas, componentes locais)
import React from 'react';
import { Helmet } from 'react-helmet-async';

// 2. Dados estáticos do componente
const staticData = [...];

// 3. Componente principal
const ComponentName = () => {
  // 4. Hooks e estado
  // 5. Funções auxiliares  
  // 6. Render
  return (
    // JSX estruturado e comentado
  );
};

// 7. Export default
export default ComponentName;
```

### Performance e Otimização
- **Lazy loading obrigatório** para todos os componentes de página
- **Otimização de imagens** antes do commit
- **Code splitting** por funcionalidade
- **Preload de recursos críticos**
- **Minificação de assets** em produção

### Acessibilidade
```jsx
// Atributos obrigatórios para acessibilidade
<img 
  src="/path/image.jpg" 
  alt="Descrição detalhada da imagem" 
  loading="lazy"
/>

<button 
  aria-label="Descrição da ação do botão"
  className="hover:focus:outline-none focus:ring-2 focus:ring-purple-500"
>

<section aria-labelledby="section-title">
  <h2 id="section-title">Título da Seção</h2>
```

## 🧪 Testes e Validação

### Testes Obrigatórios
```javascript
// Teste de renderização básica
describe('[NomeCurso] Page', () => {
  test('renders without crashing', () => {
    render(<[NomeCurso]New />);
  });
  
  test('displays correct SEO title', () => {
    render(<[NomeCurso]New />);
    expect(document.title).toContain('[Nome do Curso]');
  });
  
  test('loads all required components', () => {
    render(<[NomeCurso]New />);
    // Verificar presença de todos os 13 componentes
  });
});
```

### Validações de Build
```bash
# Validações automáticas no build
npm run test:data       # Valida estrutura de dados
npm run test:routes     # Valida todas as rotas
npm run lint           # Valida padrões de código
npm run build:production # Build de produção
```

## 📚 Recursos e Referências

### Documentação Técnica
- **React 19**: Hooks, Suspense, lazy loading
- **TailwindCSS**: Utility classes, responsividade
- **React Router**: Navegação e lazy loading
- **React Helmet**: SEO e meta tags

### Ferramentas de Desenvolvimento
- **Vite**: Build tool e dev server
- **ESLint**: Linting e padronização
- **Jest**: Testes unitários
- **Lighthouse**: Auditoria de performance e SEO

### Ferramentas de Otimização
- **Terser**: Minificação JavaScript
- **PostCSS**: Otimização CSS  
- **ImageOptim**: Otimização de imagens
- **FFmpeg**: Processamento de vídeos

---

## 🚨 Avisos Importantes

### ❌ O que NUNCA fazer:
- Modificar estrutura de dados sem atualizar todos os locais
- Fazer commit sem otimizar imagens
- Quebrar a sequência de componentes obrigatórios  
- Remover meta tags ou schema.org
- Usar caminhos absolutos para assets
- Ignorar responsividade mobile

### ✅ O que SEMPRE fazer:
- Testar em mobile e desktop antes do commit
- Validar todos os links e CTAs
- Otimizar imagens e gerar posters de vídeos
- Seguir exatamente a estrutura de 13 componentes
- Implementar SEO completo com schema.org
- Documentar qualquer desvio do padrão

---

**Este documento deve ser seguido rigorosamente para garantir consistência, qualidade e performance em todas as páginas de cursos da Escola Habilidade.**