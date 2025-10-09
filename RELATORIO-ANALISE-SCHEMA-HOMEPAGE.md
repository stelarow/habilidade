# ANÁLISE DO SCHEMA ATUAL DA HOMEPAGE

Data: 2025-10-07
Arquivo analisado: `/mnt/c/habilidade/src/pages/Home.jsx`

---

## 1. Schemas Encontrados

### ✅ Schema Principal: EducationalOrganization

O schema está implementado corretamente através do componente `SEOHead` com os seguintes campos:

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade",
  "description": "Escola de cursos profissionalizantes em São José SC...",
  "url": "https://www.escolahabilidade.com",
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
  "openingHours": "Mo-Tu 08:00-20:00, We 08:00-22:00...",
  "areaServed": [
    {
      "@type": "City",
      "name": "São José",
      "@id": "https://www.wikidata.org/wiki/Q986378"
    },
    // ... outras cidades
  ]
}
```

---

## 2. Problemas Identificados

### 🔴 CRÍTICO

1. **Falta Logo da Escola**
   - Campo `logo` não está presente
   - Google recomenda fortemente este campo para Organization
   - Impacto: Prejudica a identidade visual nos resultados de busca

2. **Falta Image da Organização**
   - Campo `image` não está presente
   - Recomendado para melhor representação visual
   - Impacto: Menos atrativo nos resultados do Google

3. **Falta Email de Contato**
   - Campo `email` não está presente
   - Importante para contato profissional
   - Impacto: Menos informações de contato disponíveis

### 🟡 IMPORTANTE

4. **Falta ItemList para os Cursos**
   - **Problema**: A homepage lista 9 cursos mas não tem schema ItemList
   - **Componente**: `Courses.jsx` lista: Projetista, Edição de Vídeo, Informática, Design Gráfico, Programação, Marketing Digital, IA, BI, Administração
   - **Impacto**: Google não indexa a lista de cursos da homepage
   - **Solução**: Adicionar ItemList schema com todos os 9 cursos

5. **Falta FAQPage Schema**
   - **Problema**: FAQ está implementado em `FAQ.jsx` com 14 perguntas mas sem schema
   - **Componente**: `FAQ_DATA` array com perguntas frequentes
   - **Impacto**: Perguntas não aparecem como rich results
   - **Solução**: Adicionar FAQPage schema

6. **Falta SameAs (Redes Sociais)**
   - Campo `sameAs` não está presente
   - Links para Instagram, Facebook, etc. ajudam na validação da organização
   - Impacto: Menos sinais de autoridade para o Google

7. **Falta Slogan/Founding Date**
   - Campos opcionais mas úteis para identidade da marca
   - Impacto menor, mas adiciona credibilidade

### 🟢 MENOR

8. **OpeningHours poderia ser mais detalhado**
   - Formato atual está correto mas poderia incluir exceções (feriados, etc.)
   - Impacto mínimo

9. **AggregateRating não recomendado**
   - ⚠️ **ATENÇÃO**: Desde 2019, Google NÃO exibe reviews auto-servidos
   - Não incluir aggregateRating na homepage (apenas em páginas de cursos individuais)

---

## 3. Schemas Faltantes

### 🔴 CRÍTICO (implementar imediatamente)

1. **ItemList** - Lista dos 9 cursos oferecidos
2. **FAQPage** - 14 perguntas frequentes do `FAQ.jsx`

### 🟡 IMPORTANTE (implementar em breve)

3. **BreadcrumbList** - Estrutura de navegação da homepage
4. **LocalBusiness** - Complementar EducationalOrganization para SEO local

### 🟢 OPCIONAL (implementar se possível)

5. ~~**WebSite com Sitelinks Searchbox**~~ - ❌ **DEPRECIADO desde 31/07/2025**
   - Google removeu este recurso por baixo uso
   - Não implementar

---

## 4. Conformidade com Google 2025

### Pontuação: 65/100

#### ✅ Pontos Positivos:
- Schema EducationalOrganization está correto e específico
- Endereço completo e bem formatado
- Coordenadas GPS precisas
- Horário de funcionamento implementado
- AreaServed com estrutura de cidades (excelente!)
- Uso correto de JSON-LD (formato preferido do Google)

#### ❌ Pontos Negativos:
- Falta logo (campo recomendado)
- Falta image (campo recomendado)
- Falta email (campo recomendado)
- Falta sameAs (redes sociais)
- Falta ItemList para cursos
- Falta FAQPage schema
- Não tem BreadcrumbList

---

## 5. Análise de Componentes da Homepage

### Componentes que precisam de Schema:

1. **`<Courses />`** (src/components/Courses.jsx)
   - Lista 9 cursos: Projetista, Edição de Vídeo, Informática, Design Gráfico, Programação, Marketing Digital, IA, BI, Administração
   - **Precisa**: ItemList schema

2. **`<FAQ />`** (src/components/FAQ.jsx)
   - 14 perguntas frequentes em `FAQ_DATA`
   - **Precisa**: FAQPage schema

3. **`<Reviews />`** (src/components/Reviews.jsx)
   - Avaliações gerais da escola
   - **ATENÇÃO**: Não adicionar aggregateRating auto-servido (contra diretrizes Google 2025)

### Componentes que NÃO precisam de Schema adicional:

- `<Hero />` - Apenas visual
- `<HowItWorksSimple />` - Processo de ensino
- `<TrustedCompanies />` - Logos de empresas
- `<LatestBlogSection />` - Blog posts (têm schema próprio nas páginas)
- `<ContactForm />` - Formulário

---

## 6. Informações Faltantes para Completar Schemas

### Dados necessários:

1. **Email da escola**: _______________
2. **URL do logo**: `/logo-escola-habilidade.png` (já existe?)
3. **URLs de imagens da escola**: Fotos do espaço físico
4. **Redes sociais** (para sameAs):
   - Instagram: _______________
   - Facebook: _______________
   - LinkedIn: _______________
   - YouTube: _______________
5. **Data de fundação** (opcional): _______________
6. **Slogan** (opcional): _______________

---

## 7. Próximos Passos Recomendados

### Fase 1 - Crítico (próximas 24h):
1. ✅ Adicionar campos obrigatórios: logo, image, email
2. ✅ Implementar ItemList para os 9 cursos
3. ✅ Implementar FAQPage schema

### Fase 2 - Importante (próxima semana):
4. ✅ Adicionar sameAs com redes sociais
5. ✅ Implementar BreadcrumbList
6. ✅ Considerar LocalBusiness complementar

### Fase 3 - Validação:
7. ✅ Validar no Google Rich Results Test
8. ✅ Validar no Schema.org Validator
9. ✅ Testar no Google Search Console

---

## 8. Comparação com Páginas de Cursos

### Páginas que já têm schemas completos:

- ✅ **Projetista 3D**: Course, LocalBusiness, VideoObject, FAQPage, BreadcrumbList, Reviews (200)
- ✅ **Programação**: Course, LocalBusiness, FAQPage, BreadcrumbList, Reviews (6)
- ✅ **Informática**: Course, LocalBusiness, FAQPage, BreadcrumbList

### Diferença para Homepage:

A homepage precisa ser o "hub central" que conecta todas as páginas. Enquanto as páginas de cursos focam em schemas específicos (Course, VideoObject), a homepage deve ter:

1. **Organization schema robusto** (já tem, mas incompleto)
2. **ItemList apontando para os cursos** (FALTA)
3. **FAQPage geral** (FALTA)
4. **BreadcrumbList** (FALTA)

---

## Conclusão

A homepage tem uma **boa base** com EducationalOrganization implementado, mas precisa de **complementos críticos** (ItemList, FAQPage) e **campos recomendados** (logo, image, email, sameAs) para estar 100% otimizada para Google 2025.

**Prioridade**: Implementar ItemList e FAQPage IMEDIATAMENTE, pois são os schemas mais impactantes que estão faltando.
