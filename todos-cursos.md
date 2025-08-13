# Plano de Expansão de Cursos - Escola Habilidade

## 📋 Contexto da Análise SEO Realizada

### Estado Atual (Janeiro 2025)
- **9 cursos ativos** no sistema
- **Arquitetura modular completa** e pronta para expansão
- **SEO infraestrutura 85/100** - totalmente funcional
- **GSC Performance**: Baixo tráfego orgânico por falta de páginas específicas

### Oportunidade Identificada
**Alta demanda SEO não atendida:**
- AutoCAD: queries na posição #2-3 (sem página)
- After Effects: múltiplas variações de busca
- Excel: demanda por treinamento corporativo
- Ferramentas Adobe: Photoshop, Illustrator, Premiere

---

## 🏗️ Arquitetura Técnica Existente

### Sistema de Rotas
```javascript
// Localização: src/routes.jsx
// Padrão atual:
{
  path: 'cursos/[slug]',
  lazy: () => import('./pages/courses/[CourseName]')
}
```

### Estrutura de Componentes
```
src/pages/courses/
├── Informatica.jsx         → return <CoursePage slug="informatica" />
├── DesignGrafico.jsx       → return <CoursePage slug="design-grafico" />
├── [NovoNome].jsx          → return <CoursePage slug="novo-slug" />
```

### Sistema de Dados
```javascript
// Localização: src/data/coursesData.js
// Estrutura: COURSES_DATA array com 9 objetos de curso
export const COURSES_DATA = [
  informatica,           // Exemplo completo existente
  designGrafico,         // 5 módulos
  programacao,           // 6 módulos
  // ... mais 6 cursos
];
```

---

## 🎨 Consistência Visual e Design

### Princípios de Design Consistente
- **Layout Pattern**: Todas as páginas devem seguir a estrutura visual do `CoursePage.jsx`
- **Componente Base**: Usar exclusivamente `<CoursePage slug="..." />` 
- **Elementos Visuais**: Manter hierarquia, espaçamentos e tipografia consistentes
- **Paleta de Cores**: Seguir rigorosamente o `themeColors` por categoria
- **Responsividade**: Garantir comportamento idêntico em mobile/desktop

### Validação Visual Obrigatória
- [ ] Layout idêntico aos cursos existentes
- [ ] Cores da categoria aplicadas corretamente  
- [ ] Componentes UI reutilizados (não recriados)
- [ ] Espaçamentos e tipografia consistentes
- [ ] Comportamento mobile idêntico

### Referência Visual
- **Template Base**: `src/pages/CoursePage.jsx`
- **Exemplos Funcionais**: Cursos Informática, Design Gráfico, Programação
- **Sistema de Cores**: Definido em cada objeto de curso (`themeColors`)
- **Componentes UI**: Localizados em `src/components/shared/`

---

## 📚 Schema de Dados do Curso

### Estrutura Obrigatória
```javascript
const novoCurso = {
  basicInfo: {
    id: 'curso-001',                    // Único
    title: 'Nome do Curso',            
    slug: 'nome-curso',                 // URL amigável
    shortDescription: 'Descrição breve (140 chars)',
    longDescription: 'Descrição completa para SEO',
    category: 'Tecnologia',             // Categoria principal
    level: 'Iniciante',                 // Iniciante|Intermediário|Avançado
    duration: '40 horas',               // Formato: "X horas"
    certificate: true,
    active: true,
  },
  
  // Preços e investimento
  investment: {
    originalPrice: 997,
    currentPrice: 497,
    installments: { max: 12, value: 49.70 },
    paymentMethods: ['Cartão de crédito', 'Pix'],
  },
  
  // Dados do instrutor
  instructor: {
    name: 'Nome do Instrutor',
    bio: 'Biografia profissional',
    photo: '/images/instructors/foto.jpg',
    experience: '10 anos',
    credentials: ['Certificação Adobe', 'Experiência Mercado'],
  },
  
  // Currículo detalhado
  curriculum: [
    {
      id: 1,
      title: 'Módulo 1: Introdução',
      description: 'Fundamentos e conceitos básicos',
      duration: '8 horas',
      lessons: [
        { id: 1, title: 'Aula 1', duration: '90 min', type: 'video' },
        // ... mais aulas
      ],
    },
    // ... mais módulos
  ],
  
  // O que o aluno aprenderá
  whatYouWillLearn: [
    'Habilidade específica 1',
    'Competência técnica 2',
    'Aplicação prática 3',
  ],
  
  // Pré-requisitos
  requirements: [
    'Conhecimento básico de informática',
    'Acesso a computador',
  ],
  
  // Depoimentos
  testimonials: [
    {
      id: 1,
      name: 'Nome do Aluno',
      text: 'Depoimento sobre o curso',
      rating: 5,
      occupation: 'Profissão',
      photo: '/images/testimonials/foto.jpg',
    },
  ],
  
  // FAQ
  faq: [
    {
      id: 1,
      question: 'Pergunta frequente?',
      answer: 'Resposta detalhada.',
    },
  ],
  
  // Cores do tema
  themeColors: {
    primary: '#FF6B35',        // Cor principal
    secondary: '#F7931E',      // Cor secundária  
    accent: '#FFD23F',         // Cor de destaque
    gradient: { from: '#FF6B35', to: '#F7931E' },
  },
  
  // SEO Metadata
  seoMeta: {
    title: 'Curso [Nome] - Escola Habilidade | Certificado',
    description: 'Aprenda [tecnologia] do básico ao avançado. Curso presencial e online com certificado. Metodologia prática com instrutores especializados.',
    keywords: ['curso [nome]', 'treinamento [tecnologia]', 'certificação'],
    ogType: 'website',
    ogImage: '/images/courses/[slug]-og.jpg',
  },
};
```

---

## 🎨 Sistema de Cores por Categoria

### Paletas Predefinidas
```javascript
// Design/Criativo
const designColors = {
  primary: '#FF6B35',
  secondary: '#F7931E', 
  accent: '#FFD23F',
  gradient: { from: '#FF6B35', to: '#F7931E' }
};

// Tecnologia/Programação
const techColors = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  accent: '#06B6D4',
  gradient: { from: '#3B82F6', to: '#8B5CF6' }
};

// Business/Gestão
const businessColors = {
  primary: '#10B981',
  secondary: '#059669',
  accent: '#34D399',
  gradient: { from: '#10B981', to: '#059669' }
};
```

---

## 🔧 Processo de Criação de Novo Curso

### Passo 1: Criar Componente de Página
```javascript
// Arquivo: src/pages/courses/[NomeCurso].jsx
import CoursePage from '../CoursePage';

export default function [NomeCurso]() {
  return <CoursePage slug="[slug-curso]" />;
}

export const Component = [NomeCurso];
```

### Passo 2: Adicionar Dados do Curso
```javascript
// Em: src/data/coursesData.js
// Adicionar objeto completo do curso seguindo schema acima
// Adicionar no array COURSES_DATA
```

### Passo 3: Configurar Rota
```javascript
// Em: src/routes.jsx
// Adicionar nova rota estática:
{
  path: 'cursos/[slug-curso]',
  lazy: () => import('./pages/courses/[NomeCurso]')
},
```

### Passo 4: Atualizar Sitemap
```javascript
// Em: src/utils/sitemapGenerator.js
// Adicionar slug no array COURSE_PAGES:
const COURSE_PAGES = [
  'informatica',
  'design-grafico',
  '[novo-slug]',  // ← Adicionar aqui
];
```

---

## 📊 Cursos Prioritários para Criação

### Prioridade Alta (ROI Imediato)
1. **AutoCAD** - Demanda alta no GSC (posição 2-3)
2. **Excel** - Treinamento corporativo
3. **After Effects** - Múltiplas queries ativas

### Prioridade Média (Expansão Estratégica)  
4. **Photoshop** - Separar do Design Gráfico
5. **Illustrator** - Design vetorial específico
6. **Python** - Separar da Programação
7. **PowerBI** - Separar do Business Intelligence

### Prioridade Baixa (Nicho)
8. **Premiere Pro** - Edição profissional
9. **JavaScript** - Web development
10. **Android/Java** - Mobile development

---

## 🎯 Templates de Conteúdo por Categoria

### Curso de Design (Adobe/Creative)
- **Módulos típicos:** Interface → Ferramentas → Projetos → Portfólio
- **Duração média:** 60-80 horas
- **Público:** Designers, publicitários, freelancers
- **Certificação:** Adobe ou equivalente

### Curso de Programação
- **Módulos típicos:** Lógica → Sintaxe → Projetos → Deploy
- **Duração média:** 120-160 horas  
- **Público:** Desenvolvedores, estudantes TI
- **Certificação:** Tecnologia específica

### Curso de Office/Produtividade
- **Módulos típicos:** Básico → Intermediário → Avançado → Automação
- **Duração média:** 40-60 horas
- **Público:** Profissionais, empresas
- **Certificação:** Microsoft ou equivalente

---

## 📈 SEO Automático Configurado

### Metadados Gerados Automaticamente
- **Title**: Otimizado para busca local + certificação
- **Description**: Foco em benefícios + modalidades
- **Keywords**: Termos principais + variações
- **Schema.org**: Curso estruturado para rich snippets

### OpenGraph Completo
- Imagens otimizadas por curso
- Dados estruturados para redes sociais
- Twitter Cards configurados

### Sitemap Automático
- Geração dinâmica incluindo novos cursos
- Prioridades baseadas em categoria
- Update frequency otimizado para SEO

---

## 🚀 Deploy e Validação

### Checklist Pré-Deploy
- [ ] Componente de página criado
- [ ] Dados completos em coursesData.js
- [ ] Rota configurada em routes.jsx
- [ ] Sitemap atualizado
- [ ] Imagens otimizadas (OG, instrutor, etc.)
- [ ] **Consistência visual validada** com cursos existentes

### Validação Pós-Deploy
- [ ] Página carrega sem erros
- [ ] SEO metadata correto (view source)
- [ ] Schema.org válido (Rich Results Test)
- [ ] Sitemap inclui nova URL
- [ ] GSC reconhece nova página

---

## 🔍 Monitoramento e Otimização

### KPIs para Acompanhar
- **Impressões GSC** por curso específico
- **CTR** das páginas individuais
- **Posicionamento** para keywords principais
- **Conversões** de leads por curso

### Otimizações Contínuas
- A/B testing de títulos SEO
- Expansão de long-tail keywords
- Atualização de conteúdo sazonal
- Link building interno entre cursos relacionados

---

## 📝 Notas para IA Desenvolvedora

### Arquivo de Referência Completo
- **Exemplo funcional:** `src/data/coursesData.js` → objeto `informatica`
- **Schema validation:** `src/data/coursesSchema.js`
- **SEO helpers:** `src/utils/courseHelpers.js`
- **Componente base:** `src/pages/CoursePage.jsx`

### Convenções do Projeto
- **Slugs:** sempre kebab-case (ex: `design-grafico`)
- **IDs:** formato curso-001, curso-002...
- **Imagens:** `/images/courses/[slug]/` 
- **Componentes:** PascalCase (ex: `AutoCAD.jsx`)

### Qualidade Obrigatória
- Validação automática via schema
- SEO metadata completo e único
- Pelo menos 3 módulos com aulas detalhadas
- Cores consistentes com categoria
- Responsividade total (mobile-first)