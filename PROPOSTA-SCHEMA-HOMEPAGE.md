# PROPOSTA DE SCHEMA COMPLETO PARA HOMEPAGE

Data: 2025-10-07
Baseado em: Diretrizes Google 2025 + Schema.org
Arquivo alvo: `/mnt/c/habilidade/src/pages/Home.jsx`

---

## Schemas Recomendados (em ordem de prioridade)

### 🔴 CRÍTICO (implementar imediatamente)

#### 1. EducationalOrganization (ATUALIZAR)
**Status**: Já existe, precisa completar campos
**Justificativa**: Schema principal da homepage, define a organização nos resultados do Google
**Campos a adicionar**: logo, image, email, sameAs

#### 2. ItemList (NOVO)
**Status**: Não existe
**Justificativa**: Google usa ItemList para indexar listas de cursos e pode exibir como rich results
**Impacto**: Alto - permite que os 9 cursos sejam indexados na homepage

#### 3. FAQPage (NOVO)
**Status**: Não existe
**Justificativa**: 14 perguntas frequentes podem aparecer nos resultados de busca
**Impacto**: Alto - rich snippets com perguntas expandem a visibilidade SERP

---

### 🟡 IMPORTANTE (implementar em breve)

#### 4. BreadcrumbList (NOVO)
**Status**: Não existe
**Justificativa**: Ajuda na navegação e hierarquia do site nos resultados
**Impacto**: Médio - melhora UX nos resultados de busca

#### 5. LocalBusiness (NOVO - COMPLEMENTAR)
**Status**: Não existe na homepage (existe em páginas de cursos)
**Justificativa**: Reforça presença local para buscas tipo "escola são josé"
**Impacto**: Médio - SEO local para Grande Florianópolis

---

### 🟢 OPCIONAL (não implementar)

#### ❌ WebSite com Sitelinks Searchbox
**Status**: DEPRECIADO desde 31/07/2025
**Justificativa**: Google removeu este recurso
**Ação**: Não implementar

#### ❌ AggregateRating na Homepage
**Status**: Contra diretrizes Google 2025
**Justificativa**: Google não exibe reviews auto-servidos desde 2019
**Ação**: Manter apenas nas páginas de cursos individuais

---

## Código Completo

### Schema 1: EducationalOrganization (ATUALIZADO)

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade",
  "alternateName": "Habilidade Escola de Cursos Profissionalizantes",
  "description": "Escola de cursos profissionalizantes em São José SC, especializada em Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação, IA e Business Intelligence. Turmas pequenas, atendimento individualizado e certificação reconhecida.",
  "url": "https://www.escolahabilidade.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.escolahabilidade.com/logo-escola-habilidade.png",
    "width": 600,
    "height": 600
  },
  "image": [
    "https://www.escolahabilidade.com/logo-escola-habilidade.png",
    "https://www.escolahabilidade.com/assets/escola-fachada.jpg",
    "https://www.escolahabilidade.com/assets/sala-aula.jpg"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "addressCountry": "BR",
    "postalCode": "88102-280"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-27.5969",
    "longitude": "-48.6356"
  },
  "telephone": "+55 48 98855-9491",
  "email": "contato@escolahabilidade.com",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday"],
      "opens": "08:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday",
      "opens": "08:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "08:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "08:00",
      "closes": "17:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "12:00"
    }
  ],
  "areaServed": [
    {
      "@type": "City",
      "name": "São José",
      "containedInPlace": {
        "@type": "State",
        "name": "Santa Catarina"
      },
      "@id": "https://www.wikidata.org/wiki/Q986378"
    },
    {
      "@type": "City",
      "name": "Florianópolis",
      "containedInPlace": {
        "@type": "State",
        "name": "Santa Catarina"
      },
      "@id": "https://www.wikidata.org/wiki/Q25444"
    },
    {
      "@type": "City",
      "name": "Palhoça",
      "containedInPlace": {
        "@type": "State",
        "name": "Santa Catarina"
      },
      "@id": "https://www.wikidata.org/wiki/Q986369"
    },
    {
      "@type": "City",
      "name": "Biguaçu",
      "containedInPlace": {
        "@type": "State",
        "name": "Santa Catarina"
      }
    },
    {
      "@type": "City",
      "name": "Santo Amaro da Imperatriz",
      "containedInPlace": {
        "@type": "State",
        "name": "Santa Catarina"
      }
    }
  ],
  "sameAs": [
    "https://www.instagram.com/escolahabilidade",
    "https://www.facebook.com/escolahabilidade",
    "https://www.linkedin.com/company/escolahabilidade",
    "https://www.youtube.com/@escolahabilidade"
  ],
  "slogan": "Desenvolva suas habilidades. Transforme sua carreira.",
  "foundingDate": "2018",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": 8
  },
  "knowsAbout": [
    "SketchUp",
    "AutoCAD",
    "Revit",
    "Enscape",
    "Programação",
    "Python",
    "Java",
    "PHP",
    "Android",
    "Marketing Digital",
    "Design Gráfico",
    "Edição de Vídeo",
    "Business Intelligence",
    "Power BI",
    "Inteligência Artificial"
  ]
}
```

---

### Schema 2: ItemList - Lista de Cursos (NOVO)

**Importante**: Este schema lista os 9 cursos principais oferecidos pela escola.

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Cursos Profissionalizantes - Escola Habilidade",
  "description": "Lista completa de cursos oferecidos pela Escola Habilidade em São José SC",
  "numberOfItems": 9,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Curso de Projetista 3D",
      "url": "https://www.escolahabilidade.com/cursos/projetista-3d",
      "description": "SketchUp, Enscape, Renderização com IA, AutoCAD 2D, Revit, Projetos 3D"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Curso de Edição de Vídeo",
      "url": "https://www.escolahabilidade.com/cursos/edicao-video",
      "description": "Premiere, After Effects, DaVinci Resolve, Motion Graphics"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Curso de Informática Completo",
      "url": "https://www.escolahabilidade.com/cursos/informatica",
      "description": "Windows, Word, Excel (fundamental ao avançado), PowerPoint"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Curso de Design Gráfico",
      "url": "https://www.escolahabilidade.com/cursos/design-grafico",
      "description": "Photoshop, Illustrator, InDesign, Canva, Social Media"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Curso de Programação",
      "url": "https://www.escolahabilidade.com/cursos/programacao",
      "description": "Lógica, Python, Java, PHP, Android Studio, Desenvolvimento de Jogos"
    },
    {
      "@type": "ListItem",
      "position": 6,
      "name": "Curso de Marketing Digital",
      "url": "https://www.escolahabilidade.com/cursos/marketing-digital",
      "description": "Social Ads, SEO, Copywriting, Canva, Branding, Analytics"
    },
    {
      "@type": "ListItem",
      "position": 7,
      "name": "Curso de Inteligência Artificial",
      "url": "https://www.escolahabilidade.com/cursos/inteligencia-artificial",
      "description": "Cursor, Prompt Engineering, ChatGPT, Claude, IA aplicada"
    },
    {
      "@type": "ListItem",
      "position": 8,
      "name": "Curso de Business Intelligence",
      "url": "https://www.escolahabilidade.com/cursos/business-intelligence",
      "description": "Master Excel, Power BI, Dashboards, Storytelling de Dados"
    },
    {
      "@type": "ListItem",
      "position": 9,
      "name": "Curso de Administração",
      "url": "https://www.escolahabilidade.com/cursos/administracao",
      "description": "Office, Excel Avançado, DP, Matemática Financeira, Liderança"
    }
  ]
}
```

---

### Schema 3: FAQPage - Perguntas Frequentes (NOVO)

**Importante**: Extrai as 14 perguntas do componente `FAQ.jsx`.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "Perguntas Frequentes - Escola Habilidade",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "A Escola Habilidade fica bem localizada em São José?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Estamos estrategicamente localizados no centro de São José, próximo ao Terminal Central, Shopping Pátio São José e fácil acesso pela BR-101. Nossa localização privilegiada permite chegada fácil por transporte público (várias linhas de ônibus) e oferece estacionamento gratuito para estudantes. Atendemos toda a Grande Florianópolis, especialmente São José, Palhoça e Biguaçu."
      }
    },
    {
      "@type": "Question",
      "name": "Vocês têm parcerias com empresas de São José e região?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Temos parcerias ativas com mais de 50 empresas da Grande Florianópolis, incluindo escritórios de arquitetura, agências de marketing, desenvolvedoras e empresas de tecnologia. Nossos alunos desenvolvem projetos reais durante o curso e muitos são contratados diretamente por empresas parceiras. Mantemos um programa de indicação profissional exclusivo."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a diferença entre curso técnico e curso profissionalizante na Escola Habilidade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossos cursos profissionalizantes são 100% focados na prática profissional. Diferente de cursos técnicos convencionais, investimos 80% do tempo em projetos reais e apenas 20% em teoria. Isso significa que você sai preparado para o mercado de trabalho desde o primeiro dia, com portfolio robusto e experiência prática que os empregadores valorizam."
      }
    },
    {
      "@type": "Question",
      "name": "Quais cursos a Escola Habilidade oferece?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oferecemos 6 cursos principais: Projetista (SketchUp/AutoCAD), Edição de Vídeo, Design Gráfico, Programação, Marketing Digital e BI/Inteligência Artificial. Todos são cursos práticos com projetos reais, certificação reconhecida pelo mercado e suporte para colocação profissional. Cada curso é personalizado conforme demanda do mercado regional."
      }
    },
    {
      "@type": "Question",
      "name": "Como é a metodologia de ensino da Escola Habilidade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossa metodologia única \"Prática Primeiro\" combina projetos reais com mentoria individualizada. Turmas pequenas (máximo 12 alunos), professores especialistas do mercado e 80% do tempo dedicado à prática. Você desenvolve portfolio profissional durante o curso e recebe orientação personalizada para sua área de interesse."
      }
    },
    {
      "@type": "Question",
      "name": "Por que a Escola Habilidade tem avaliação 5.0 estrelas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossa nota máxima reflete o compromisso com resultados reais: metodologia prática, acompanhamento individualizado e foco na preparação para o mercado de trabalho. Diferente de instituições grandes, priorizamos qualidade sobre quantidade, com turmas reduzidas e atenção personalizada a cada aluno."
      }
    },
    {
      "@type": "Question",
      "name": "A Escola Habilidade ajuda na colocação profissional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Oferecemos apoio através de nossa rede de empresas parceiras que conhecem a qualidade dos nossos alunos, programa de preparação para freelancers com projetos reais e orientação para desenvolvimento de carreira. Nosso foco é preparar você com as habilidades e portfolio que o mercado busca."
      }
    },
    {
      "@type": "Question",
      "name": "Qual curso tem mais chance de conseguir emprego rápido em São José?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossos cursos de Projetista (SketchUp + Enscape), Programação, Design Gráfico e Marketing Digital são os que mais colocam profissionais no mercado na Grande Florianópolis. Com metodologia 80% prática, você desenvolve portfolio real durante o curso. Estatisticamente, cursos técnicos como Desenvolvimento de Sistemas têm 76,7% de empregabilidade, mas nosso diferencial é a preparação específica para o mercado local."
      }
    },
    {
      "@type": "Question",
      "name": "A Escola Habilidade oferece cursos técnicos gratuitos como o SENAI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nossos cursos são investimento acessível com resultado superior ao ensino técnico tradicional. Diferente dos cursos gratuitos que priorizam teoria, oferecemos mentoria individualizada, turmas pequenas e projetos reais. O retorno do investimento acontece rapidamente através das oportunidades de trabalho e freelances que nossos alunos conseguem."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a diferença da Escola Habilidade para o SENAI e IFSC de São José?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enquanto instituições técnicas focam em certificação, priorizamos empregabilidade real. Turmas pequenas vs. turmas de 40+ alunos, professores do mercado vs. professores acadêmicos, projetos reais vs. exercícios teóricos. Nossos alunos começam a trabalhar antes mesmo de formar, diferente do modelo tradicional."
      }
    },
    {
      "@type": "Question",
      "name": "Por que escolher curso profissionalizante ao invés de curso técnico em São José?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cursos profissionalizantes são mais rápidos, práticos e alinhados com demandas reais das empresas. Não há burocracia de certificação técnica, permitindo atualização constante do conteúdo. Você aprende exatamente o que o mercado precisa, não grade curricular desatualizada de instituições técnicas."
      }
    },
    {
      "@type": "Question",
      "name": "Quais empresas de São José contratam alunos da Escola Habilidade?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Temos parcerias com escritórios de arquitetura do centro de São José, agências de marketing da região e empresas de tecnologia da Grande Florianópolis. Nossa localização estratégica próxima ao Terminal Central facilita o networking com empresas parceiras que conhecem a qualidade dos nossos alunos."
      }
    },
    {
      "@type": "Question",
      "name": "Como funciona o estacionamento para alunos no centro de Kobrasol?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Estamos localizados no centro de Kobrasol em uma rua estratégica paralela onde é possível estacionar tranquilamente. Temos vagas gratuitas na rua, incluindo frequentemente na frente da escola. Também somos facilmente acessíveis por transporte público, com várias linhas de ônibus que param próximo à escola."
      }
    },
    {
      "@type": "Question",
      "name": "Como faço para me matricular?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre em contato conosco pelo WhatsApp (48) 98855-9491 ou preencha o formulário de contato. Nossa equipe irá esclarecer todas as dúvidas e auxiliar com a matrícula."
      }
    }
  ]
}
```

---

### Schema 4: BreadcrumbList (NOVO)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.escolahabilidade.com"
    }
  ]
}
```

---

### Schema 5: LocalBusiness (COMPLEMENTAR - OPCIONAL)

**Nota**: Este schema complementa o EducationalOrganization para SEO local.

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Escola Habilidade",
  "image": "https://www.escolahabilidade.com/logo-escola-habilidade.png",
  "description": "Escola de cursos profissionalizantes em São José SC. Oferecemos cursos de Informática, SketchUp, AutoCAD, Revit, Programação, Marketing Digital e mais.",
  "@id": "https://www.escolahabilidade.com",
  "url": "https://www.escolahabilidade.com",
  "telephone": "+55 48 98855-9491",
  "priceRange": "R$ 399,90 - R$ 5.890,00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88102-280",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-27.5969",
    "longitude": "-48.6356"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday"],
      "opens": "08:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Wednesday",
      "opens": "08:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Thursday",
      "opens": "08:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "08:00",
      "closes": "17:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "12:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/escolahabilidade",
    "https://www.facebook.com/escolahabilidade",
    "https://www.linkedin.com/company/escolahabilidade",
    "https://www.youtube.com/@escolahabilidade"
  ]
}
```

---

## Dados Necessários para Implementação

### ⚠️ PREENCHER ANTES DE IMPLEMENTAR:

1. **Email da escola**: _________________
2. **URLs de redes sociais**:
   - Instagram: _________________
   - Facebook: _________________
   - LinkedIn: _________________
   - YouTube: _________________
3. **Imagens da escola**:
   - Logo (já existe): `/logo-escola-habilidade.png`
   - Fachada: _________________
   - Sala de aula: _________________
4. **Data de fundação**: _________________ (opcional)
5. **Número de funcionários**: _________________ (opcional)
6. **Slogan oficial**: _________________ (sugestão: "Desenvolva suas habilidades. Transforme sua carreira.")

---

## Implementação Técnica

### Opção 1: Modificar Home.jsx diretamente

```jsx
// src/pages/Home.jsx

function Home() {
  // Schema 1: EducationalOrganization (ATUALIZADO)
  const educationalOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    // ... código do Schema 1 acima
  };

  // Schema 2: ItemList (NOVO)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    // ... código do Schema 2 acima
  };

  // Schema 3: FAQPage (NOVO)
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // ... código do Schema 3 acima
  };

  // Schema 4: BreadcrumbList (NOVO)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // ... código do Schema 4 acima
  };

  return (
    <>
      <SEOHead
        title="Cursos em São José SC | Escola Habilidade"
        description="..."
        path="/"
        type="website"
        schemaData={educationalOrgSchema}
      />

      {/* Schemas adicionais renderizados fora do Helmet */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemListSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />

      <Hero />
      <Courses />
      {/* ... resto dos componentes */}
    </>
  );
}
```

### Opção 2: Modificar SEOHead.jsx para aceitar múltiplos schemas

```jsx
// src/components/shared/SEOHead.jsx

const SEOHead = ({
  // ... props existentes
  itemListData = null,
  // ... outras props
}) => {
  // ... código existente

  // ItemList schema
  if (itemListData) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: itemListData.name,
      // ... resto do schema
    });
  }

  // ... resto do código
};
```

---

## Ordem de Implementação Recomendada

### Fase 1 - Dados (1 hora):
1. ✅ Coletar email, redes sociais, imagens
2. ✅ Validar URLs das imagens
3. ✅ Confirmar informações (slogan, data fundação)

### Fase 2 - Código (2 horas):
4. ✅ Atualizar EducationalOrganization com campos faltantes
5. ✅ Adicionar ItemList schema
6. ✅ Adicionar FAQPage schema
7. ✅ Adicionar BreadcrumbList schema

### Fase 3 - Validação (30 min):
8. ✅ Testar no Google Rich Results Test
9. ✅ Validar no Schema.org Validator
10. ✅ Verificar rendering no "Ver código-fonte"

### Fase 4 - Deploy (1 hora):
11. ✅ Build production
12. ✅ Deploy para produção
13. ✅ Submeter sitemap no Google Search Console
14. ✅ Monitorar Search Console por 7 dias

---

## Validação

### Ferramentas:

1. **Google Rich Results Test**
   URL: https://search.google.com/test/rich-results
   Usar para: Validar FAQPage, ItemList, EducationalOrganization

2. **Schema.org Validator**
   URL: https://validator.schema.org/
   Usar para: Validar sintaxe JSON-LD

3. **Google Search Console**
   Usar para: Monitorar indexação e rich results

### Checklist de Validação:

- [ ] Todos os schemas passam no Rich Results Test sem erros
- [ ] Todos os schemas passam no Schema Validator
- [ ] FAQ aparece no preview do Rich Results Test
- [ ] ItemList aparece no preview do Rich Results Test
- [ ] Código-fonte HTML contém todos os 4 schemas
- [ ] Não há schemas duplicados
- [ ] Todas as URLs são absolutas (https://www.escolahabilidade.com/...)
- [ ] Coordenadas GPS estão corretas
- [ ] Horários de funcionamento estão corretos
- [ ] Telefone está no formato internacional (+55)

---

## Monitoramento Pós-Deploy

### Primeiros 7 dias:
- Verificar Google Search Console > Enhancements > FAQ
- Verificar Google Search Console > Enhancements > Rich Results
- Monitorar tráfego orgânico para homepage

### Primeiros 30 dias:
- Analisar CTR da homepage nos resultados de busca
- Verificar se FAQs aparecem nos resultados
- Avaliar posicionamento para palavras-chave locais

---

## Notas Importantes

### ✅ Fazer:
- Usar JSON-LD (formato preferido do Google)
- Adicionar todos os schemas em uma única página (homepage)
- Manter dados consistentes com Google Business Profile
- Usar URLs absolutas em todos os schemas
- Validar antes de fazer deploy

### ❌ Não Fazer:
- Não adicionar aggregateRating auto-servido na homepage
- Não implementar WebSite com sitelinks searchbox (depreciado)
- Não duplicar schemas entre homepage e páginas de cursos
- Não usar dados falsos ou não verificáveis
- Não adicionar schema Course na homepage (apenas ItemList apontando para cursos)

---

## Conclusão

Esta proposta implementa **4 schemas principais** na homepage:

1. **EducationalOrganization** (atualizado) - Define a escola
2. **ItemList** (novo) - Lista os 9 cursos
3. **FAQPage** (novo) - 14 perguntas frequentes
4. **BreadcrumbList** (novo) - Navegação

**Impacto esperado**:
- ✅ Maior visibilidade nos resultados de busca
- ✅ Rich snippets com FAQs
- ✅ Melhor indexação dos cursos
- ✅ SEO local otimizado para Grande Florianópolis
- ✅ 100% conformidade com Google 2025

**Tempo total de implementação**: ~4 horas (incluindo validação e deploy)
