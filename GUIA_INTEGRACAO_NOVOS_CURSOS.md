# 📚 Guia Completo: Integração de Novos Pacotes de Cursos

> **Documento de Referência Oficial** - Siga este guia SEMPRE que adicionar novos cursos ao site.

## 🎯 Visão Geral

Este guia garante uma integração COMPLETA de novos cursos, incluindo:
- ✅ **Dados estruturados** conforme schema
- ✅ **Cards de apresentação** na página inicial
- ✅ **Páginas individuais** estruturadas
- ✅ **Backgrounds únicos** animados
- ✅ **SEO otimizado** com metadados
- ✅ **Sistema de busca** integrado
- ✅ **Navegação responsiva** (desktop e mobile)

---

## 📋 Checklist de Integração

### ☐ 1. Dados do Curso
- [ ] Adicionar objeto do curso em `src/data/coursesData.js`
- [ ] Validar estrutura com `src/data/coursesSchema.js`
- [ ] Configurar cores temáticas
- [ ] Definir metadados SEO completos

### ☐ 2. Background Único
- [ ] Criar componente de background em `src/components/backgrounds/`
- [ ] Atualizar `src/types/backgrounds.js`
- [ ] Configurar lazy loading em `src/components/CourseBackground.jsx`

### ☐ 3. Cards de Apresentação
- [ ] Adicionar entrada em `src/components/Courses.jsx`
- [ ] Definir ícone, cores e gradientes

### ☐ 4. Navegação
- [ ] Verificar menu automático (baseado em dados)
- [ ] Testar busca integrada

### ☐ 5. Testes Finais
- [ ] Página individual funcional
- [ ] SEO configurado
- [ ] Background renderizando
- [ ] Card na homepage
- [ ] Busca funcionando

---

## 🔧 Implementação Detalhada

### 1️⃣ DADOS DO CURSO (`src/data/coursesData.js`)

Adicione um novo objeto seguindo EXATAMENTE esta estrutura:

```javascript
const novoCurso = {
  // ===== INFORMAÇÕES BÁSICAS (OBRIGATÓRIO) =====
  basicInfo: {
    id: 'curso-slug-001',           // ID único
    title: 'Nome do Curso',         // Título completo
    slug: 'curso-slug',             // URL slug (só letras, números, hífens)
    shortDescription: 'Descrição curta para cards (máx 120 chars)',
    longDescription: 'Descrição detalhada para página do curso e SEO',
    category: 'Categoria',          // Ex: 'Tecnologia', 'Design & Criação'
    level: 'Iniciante',             // 'Iniciante', 'Intermediário', 'Avançado'
    duration: 'X horas',            // Duração total
    certificate: true,              // Se oferece certificado
    active: true,                   // Se está ativo no site
  },

  // ===== MATERIAL DIDÁTICO =====
  materials: {
    included: true,                 // Se material está incluso
    description: 'Descrição do material incluso',
    details: [
      'Detalhe 1 do material',
      'Detalhe 2 do material',
    ]
  },

  // ===== MODALIDADES DE ENSINO =====
  modalities: {
    presencial: {
      available: true,              // Se tem modalidade presencial
      description: 'Descrição da modalidade presencial'
    },
    online: {
      available: true,              // Se tem modalidade online
      description: 'Descrição da modalidade online'
    }
  },

  // ===== CURRÍCULO COMPLETO (OBRIGATÓRIO) =====
  curriculum: [
    {
      id: 1,
      title: 'Nome do Módulo',
      description: 'Descrição do que será aprendido',
      duration: 'X horas',
      lessons: [
        { 
          id: 1, 
          title: 'Nome da Aula', 
          duration: '90 min', 
          type: 'video'           // 'video', 'text', 'exercise', 'project'
        },
        // ... mais aulas
      ],
    },
    // ... mais módulos
  ],

  // ===== SEÇÕES ESPECIAIS =====
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',           // Nome do ícone Phosphor
        title: 'Benefício 1',
        description: 'Descrição do benefício'
      },
      // ... mais benefícios (máx 3)
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Passo 1',
        description: 'Descrição do que acontece neste passo',
        icon: 'House'               // Nome do ícone Phosphor
      },
      // ... mais passos (máx 4)
    ]
  },

  // ===== O QUE SERÁ APRENDIDO =====
  whatYouWillLearn: [
    'Habilidade específica 1',
    'Habilidade específica 2',
    // ... máximo 10 itens
  ],

  // ===== REQUISITOS =====
  requirements: [
    'Requisito técnico 1',
    'Requisito técnico 2',
    // ... máximo 5 itens
  ],

  // ===== INVESTIMENTO (OBRIGATÓRIO) =====
  investment: {
    originalPrice: 997,             // Preço original
    currentPrice: 597,              // Preço atual com desconto
    discount: 40,                   // Percentual de desconto
    installments: {
      max: 12,                      // Máximo de parcelas
      value: 59.70,                 // Valor da parcela
    },
    paymentMethods: [               // Formas de pagamento
      'Cartão de crédito', 
      'PIX', 
      'Boleto bancário'
    ],
  },

  // ===== INSTRUTOR (OBRIGATÓRIO) =====
  instructor: {
    name: 'Nome do Instrutor ou Equipe',
    bio: 'Biografia profissional completa',
    photo: '/instructors/nome-instrutor.jpg',
    experience: '10+ anos',
    credentials: [
      'Certificação 1',
      'Certificação 2',
      // ... credenciais relevantes
    ],
  },

  // ===== DEPOIMENTOS (OBRIGATÓRIO) =====
  testimonials: [
    {
      id: 1,
      name: 'Nome do Aluno',
      role: 'Profissão Atual',
      photo: '/testimonials/nome-aluno.jpg',
      rating: 5,                    // 1 a 5 estrelas
      text: 'Depoimento completo do aluno',
      result: 'Resultado alcançado'  // Opcional
    },
    // ... mínimo 3 depoimentos
  ],

  // ===== FAQ (OBRIGATÓRIO) =====
  faq: [
    {
      id: 1,
      question: 'Pergunta frequente 1?',
      answer: 'Resposta detalhada e útil'
    },
    // ... mínimo 4 perguntas
  ],

  // ===== CORES TEMÁTICAS (OBRIGATÓRIO) =====
  themeColors: {
    primary: '#3B82F6',            // Cor primária (hex)
    secondary: '#8B5CF6',          // Cor secundária (hex)
    accent: '#06B6D4',             // Cor de destaque (hex)
    gradient: {
      from: '#3B82F6',             // Início do gradiente
      to: '#8B5CF6',               // Fim do gradiente
    },
  },

  // ===== SEO METADATA (OBRIGATÓRIO) =====
  seoMeta: {
    title: 'Título SEO Otimizado - Escola Habilidade',
    description: 'Meta descrição otimizada para SEO (máx 160 chars)',
    keywords: [                     // Palavras-chave relevantes
      'palavra-chave-1',
      'palavra-chave-2',
    ],
    ogImage: '/og-images/curso-slug.jpg',
    ogType: 'website',
  },
};

// ===== ADICIONAR À EXPORTAÇÃO =====
// No final do arquivo, adicione à constante de exportação:
const COURSES_DATA = [
  informatica,
  designGrafico,
  // ... outros cursos existentes
  novoCurso,                      // ⬅️ ADICIONE AQUI
];

export default COURSES_DATA;
```

### 2️⃣ BACKGROUND ÚNICO

#### A) Criar componente (`src/components/backgrounds/NomeCursoBackground.jsx`)

```javascript
import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de [Nome do Curso]
 * Conceito: [Descreva o conceito visual]
 */
const NomeCursoBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  // ... refs necessários

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Configurações de animação
    particleCount: Math.min(performanceConfig?.particleCount || 20, 15),
    animationSpeed: performanceConfig?.staticFallback ? 0 : 1,
    
    // Cores do tema
    colors: {
      primary: '#RRGGBB',    // ⬅️ Use as cores do themeColors
      secondary: '#RRGGBB',  
      accent: '#RRGGBB',
      // ... outras cores
    }
  }), [performanceConfig]);

  // Classes de elementos animados
  class ElementoAnimado {
    constructor(canvas) {
      // Inicialização do elemento
    }

    update() {
      // Lógica de atualização
    }

    draw(ctx) {
      // Lógica de desenho
    }
  }

  // Loop de animação
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos animados
    
    if (config.animationSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Setup do canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (deviceCapabilities?.pixelRatio || 1);
      canvas.height = rect.height * (deviceCapabilities?.pixelRatio || 1);
      
      const ctx = canvas.getContext('2d');
      ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, deviceCapabilities]);

  // Fallback estático para performance baixa
  if (performanceConfig?.staticFallback) {
    return (
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 50%, ${config.colors.accent} 100%)`
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 1
      }}
      aria-hidden="true"
    />
  );
};

export default React.memo(NomeCursoBackground);
```

#### B) Atualizar tipos (`src/types/backgrounds.js`)

```javascript
// Adicionar slug do novo curso
export const COURSE_SLUGS = {
  // ... slugs existentes
  NOVO_CURSO: 'curso-slug',        // ⬅️ ADICIONE AQUI
};

// Adicionar cores de fallback
export const COURSE_FALLBACK_COLORS = {
  // ... cores existentes
  [COURSE_SLUGS.NOVO_CURSO]: ['#RRGGBB', '#RRGGBB', '#RRGGBB'], // ⬅️ ADICIONE AQUI
};
```

#### C) Configurar lazy loading (`src/components/CourseBackground.jsx`)

```javascript
// Adicionar ao objeto backgrounds
const backgrounds = {
  // ... backgrounds existentes
  'curso-slug': lazy(() => 
    import('./backgrounds/NomeCursoBackground.jsx').then(module => ({ default: module.default }))
  ),
};

// Adicionar ao gradientes estáticos
const gradients = {
  // ... gradientes existentes
  'curso-slug': 'linear-gradient(135deg, #RRGGBB 0%, #RRGGBB 50%, #RRGGBB 100%)',
};
```

### 3️⃣ CARD NA HOMEPAGE (`src/components/Courses.jsx`)

```javascript
const COURSES = [
  // ... cursos existentes
  {
    title: 'Nome do Curso',
    slug: 'curso-slug',              // ⬅️ MESMO SLUG dos dados
    icon: IconName,                  // ⬅️ Ícone do Phosphor React
    desc: 'Descrição curta para o card...',
    textColor: 'text-blue-400',      // ⬅️ Cor do texto
    borderGradient: 'from-blue-500/60 to-indigo-400/60',  // ⬅️ Gradiente da borda
    hoverShadow: 'hover:shadow-[0_0_25px_#60a5faaa]',     // ⬅️ Sombra no hover
  },
];
```

**⚠️ IMPORTANTE**: 
- O `slug` deve ser IDÊNTICO ao definido em `basicInfo.slug`
- Importe o ícone: `import { IconName } from 'phosphor-react';`

### 4️⃣ NAVEGAÇÃO (AUTOMÁTICA)

A navegação é **automática** baseada nos dados em `coursesData.js`:
- ✅ Menu desktop (`MegaMenu.jsx`) - busca em `COURSES_DATA`
- ✅ Menu mobile (`MobileMegaMenu.jsx`) - busca em `COURSES_DATA`
- ✅ Sistema de busca - indexa automaticamente

**Nenhuma configuração adicional necessária!**

### 5️⃣ IMAGENS E ASSETS

Adicione as seguintes imagens:

```
public/
├── instructors/
│   └── nome-instrutor.jpg        # 400x400px, formato quadrado
├── testimonials/
│   ├── nome-aluno-1.jpg         # 150x150px, formato quadrado
│   ├── nome-aluno-2.jpg
│   └── nome-aluno-3.jpg
└── og-images/
    └── curso-slug.jpg           # 1200x630px, Open Graph
```

---

## 🎨 Guia de Cores e Temas

### Paleta Sugerida por Categoria

```css
/* Tecnologia */
--primary: #2196F3;    --secondary: #00BCD4;    --accent: #03DAC6;

/* Design & Criação */  
--primary: #FF6B9D;    --secondary: #C44569;    --accent: #F8B500;

/* Negócios */
--primary: #6366F1;    --secondary: #8B5CF6;    --accent: #A78BFA;

/* Produção */
--primary: #EF4444;    --secondary: #F97316;    --accent: #FCD34D;

/* Programação */
--primary: #22C55E;    --secondary: #16A34A;    --accent: #4ADE80;
```

### Gradientes Harmoniosos

```css
/* Gradientes testados e aprovados */
background: linear-gradient(135deg, #primary 0%, #secondary 50%, #accent 100%);
```

---

## 🔍 SEO e Metadados

### Estrutura do Título SEO

```
Curso de [Nome] - Escola Habilidade | [Principais Keywords]
```

### Meta Descrição (máx 160 chars)

```
Curso completo de [Nome]: [principais tópicos]. [Duração], [modalidades], [diferenciais]. [CTA].
```

### Keywords Estratégicas

- Nome do curso + variações
- Ferramentas/tecnologias ensinadas
- Nível do curso (iniciante, avançado)
- Modalidade (presencial, online)
- Certificação
- Nome da escola

**Exemplo**:
```javascript
keywords: [
  'curso design gráfico',
  'photoshop illustrator',
  'design profissional',
  'curso presencial florianópolis',
  'certificação design'
]
```

---

## ✅ Checklist de Testes

### Antes de Publicar

- [ ] **Página individual carrega** sem erros
- [ ] **Background único renderiza** corretamente
- [ ] **Card aparece na homepage** com estilo correto
- [ ] **Navegação funciona** (menu desktop e mobile)
- [ ] **Busca encontra o curso** pelos termos relevantes
- [ ] **SEO está configurado** (title, description, og:tags)
- [ ] **Dados validam** contra o schema
- [ ] **Formulário de contato** pré-seleciona o curso
- [ ] **Responsivo funciona** em mobile e desktop

### Comando de Validação

```bash
# Execute para validar os dados
npm run test:courses
```

---

## 📱 Responsividade

### Pontos de Quebra Automáticos

- **Mobile**: < 768px - Layout vertical, menu hambúrguer
- **Tablet**: 768px - 1024px - Grid 2 colunas  
- **Desktop**: > 1024px - Grid 3 colunas, mega menu

### Elementos que se Adaptam Automaticamente

- ✅ Cards de curso (grid responsivo)
- ✅ Menu de navegação (mega → hambúrguer)
- ✅ Background animado (performance adaptativa)
- ✅ Formulários (layout empilhado em mobile)

---

## 🚨 Problemas Comuns e Soluções

### ❌ Problema: Curso não aparece na busca
**✅ Solução**: Verificar se `basicInfo.active: true`

### ❌ Problema: Background não carrega
**✅ Solução**: 
1. Verificar se componente foi adicionado em `CourseBackground.jsx`
2. Confirmar que slug está em `COURSE_SLUGS`
3. Validar import lazy

### ❌ Problema: Página 404 no curso
**✅ Solução**: 
1. Verificar se slug na URL é idêntico ao `basicInfo.slug`
2. Confirmar que curso está em `COURSES_DATA`

### ❌ Problema: Card não aparece na homepage
**✅ Solução**: 
1. Verificar se foi adicionado ao array `COURSES` em `Courses.jsx`
2. Confirmar import do ícone

### ❌ Problema: Erros de validação
**✅ Solução**: 
1. Verificar estrutura contra `coursesSchema.js`
2. Confirmar campos obrigatórios
3. Validar tipos de dados

---

## 📚 Recursos Adicionais

### Ícones Disponíveis (Phosphor React)
- `BookOpen`, `Code`, `PenNib`, `Desktop`
- `Robot`, `ChartLine`, `FilmSlate`, `Cube`
- `Users`, `Trophy`, `Target`, `Lightning`
- [Catálogo completo](https://phosphoricons.com/)

### Ferramentas de Desenvolvimento
- **Validação**: Schema automático em `coursesSchema.js`
- **Background**: Sistema de performance adaptativa
- **SEO**: Metadados automáticos com schema.org
- **Busca**: Indexação automática de conteúdo

---

## 📞 Suporte

Dúvidas sobre a integração? Verifique:
1. ✅ Este guia foi seguido completamente
2. ✅ Todos os arquivos foram atualizados
3. ✅ Testes foram executados
4. ✅ Estrutura segue o schema definido

---

**📌 Versão do Guia**: 1.0  
**📅 Última Atualização**: Janeiro 2025  
**🔄 Compatível com**: React 19, Vite 6, Tailwind CSS 