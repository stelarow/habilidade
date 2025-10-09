# Prompt: Debug Schemas Course - Campo Description Ausente

## Contexto do Problema

O Google Search Console está reportando 5 erros críticos em schemas Course:
```
❌ Marketing Digital - O campo "description" não foi encontrado
❌ Inteligência Artificial - O campo "description" não foi encontrado
❌ Informática - O campo "description" não foi encontrado
❌ Programação - O campo "description" não foi encontrado
❌ Design Gráfico - O campo "description" não foi encontrado
```

**URL de teste:** https://www.escolahabilidade.com/cursos/marketing-digital

## Tentativas de Correção Já Realizadas

### ✅ Commit 24fb91d (2025-10-08)
- Adicionou campo `description` em páginas locais (CursosFlorianopolis.jsx)
- Não resolveu o problema das páginas principais

### ✅ Commit 8efa819 (2025-10-08)
- Adicionou schemas Course inline com Helmet em:
  - `src/pages/courses/MarketingDigital.jsx`
  - `src/pages/courses/InteligenciaArtificial.jsx`
  - `src/pages/courses/DesignGrafico.jsx`
- **Problema persiste após deploy**

## Arquitetura Atual

### 1. Páginas Afetadas (5 cursos)
```
src/pages/courses/
├── MarketingDigital.jsx      ⚠️ Usa CoursePage + schema inline
├── InteligenciaArtificial.jsx ⚠️ Usa CoursePage + schema inline
├── DesignGrafico.jsx          ⚠️ Usa CoursePage + schema inline
├── Informatica.jsx            ✅ Schema inline direto (197KB HTML)
└── Programacao.jsx            → ProgramacaoNova2.jsx ✅ Schema inline
```

### 2. Geração de Schema - Múltiplas Fontes

#### A) Schema via CoursePage (src/pages/CoursePage.jsx)
```javascript
// Linha 215-238
<Head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structuredData) }}
  />
</Head>
```

#### B) Schema inline via Helmet (adicionado recentemente)
```javascript
// MarketingDigital.jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(courseSchema)}
  </script>
</Helmet>
```

#### C) Gerador de metadata (src/utils/courseHelpers.js)
```javascript
// Linha 137-296
export function generateCourseMetadata(courseData) {
  // ...
  structuredData: {
    '@type': 'Course',
    'name': safeCourse.basicInfo.title,
    'description': safeCourse.basicInfo.longDescription, // ← Deveria incluir
    // ...
  }
}
```

### 3. SSG (Static Site Generation)
- Build: `vite-react-ssg`
- Routes: `src/routes.jsx`
- Informatica.jsx renderiza 197KB+ de HTML com schema completo
- Outras páginas podem estar gerando HTML incompleto

## Diagnóstico Necessário

### Passo 1: Verificar HTML Gerado no Build
```bash
npm run build:production
ls -lh dist/cursos/marketing-digital/index.html
cat dist/cursos/marketing-digital/index.html | grep -A 20 '"@type": "Course"'
```

**Perguntas críticas:**
1. O schema inline do Helmet está sendo renderizado no HTML estático?
2. Existem schemas duplicados (CoursePage + inline)?
3. O campo `description` está presente no HTML final?

### Passo 2: Comparar Informatica.jsx (Funciona) vs MarketingDigital.jsx (Falha)

**Informatica.jsx (✅ FUNCIONA):**
```javascript
// Schema direto no componente, sem CoursePage
const courseSchema = { /* schema completo */ };

return (
  <main>
    <Helmet>...</Helmet>
    <script type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
    {/* Componentes próprios, sem CoursePage */}
  </main>
);
```

**MarketingDigital.jsx (❌ FALHA):**
```javascript
// Schema inline + CoursePage
return (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(courseSchema)}
      </script>
    </Helmet>
    <CoursePage slug="marketing-digital" /> {/* ← Pode estar gerando schema duplicado SEM description */}
  </>
);
```

### Passo 3: Verificar coursesData.js
```bash
grep -A 5 "slug: 'marketing-digital'" src/data/coursesData.js
grep -A 5 "longDescription:" src/data/coursesData.js | grep -A 1 "marketing"
```

**Confirmar que `longDescription` existe para todos os 5 cursos.**

## Soluções Propostas

### Opção A: Refatorar para Padrão Informatica.jsx (RECOMENDADO)
1. Remover uso de `<CoursePage>` em MarketingDigital, IA e DesignGrafico
2. Criar componentes dedicados seguindo o padrão de Informatica.jsx
3. Schema inline direto com `dangerouslySetInnerHTML`
4. Garante controle total sobre HTML gerado

**Arquivos a criar:**
```
src/pages/courses/
├── MarketingDigitalNovo.jsx (igual Informatica.jsx)
├── InteligenciaArtificialNovo.jsx
└── DesignGraficoNovo.jsx
```

### Opção B: Corrigir generateCourseMetadata
Se o problema for no gerador de metadata:

```javascript
// src/utils/courseHelpers.js - Linha 137
export function generateCourseMetadata(courseData) {
  const safeCourse = validateAndSanitizeCourse(courseData);

  // FORCE description mesmo se vazio
  const description = safeCourse.basicInfo.longDescription
    || safeCourse.basicInfo.shortDescription
    || `Curso de ${safeCourse.basicInfo.title}`;

  return {
    // ...
    structuredData: {
      '@type': 'Course',
      'name': safeCourse.basicInfo.title,
      'description': description, // ← GARANTIR que nunca seja null/undefined
      // ...
    }
  }
}
```

### Opção C: Remover Schema Duplicado
Se CoursePage está gerando schema sem description:

```javascript
// MarketingDigital.jsx
export default function MarketingDigital() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(courseSchema)}
        </script>
      </Helmet>
      <CoursePage
        slug="marketing-digital"
        disableStructuredData={true} // ← Adicionar prop para desabilitar schema do CoursePage
      />
    </>
  );
}
```

## Checklist de Investigação

```
[ ] 1. Verificar HTML gerado: dist/cursos/marketing-digital/index.html
[ ] 2. Procurar schemas duplicados no HTML
[ ] 3. Confirmar que field "description" existe no schema do HTML
[ ] 4. Testar HTML com Google Rich Results Test
[ ] 5. Comparar tamanho HTML: Informatica (197KB) vs Marketing (esperado ~100KB+)
[ ] 6. Verificar se CoursePage está sobrescrevendo schema inline
[ ] 7. Verificar ordem de renderização: Helmet vs CoursePage
[ ] 8. Confirmar que longDescription existe em coursesData.js
[ ] 9. Testar build local: npm run build:production && npm run preview
[ ] 10. Inspecionar código fonte da página em produção (View Source)
```

## Dados Importantes

### URLs Afetadas
```
https://www.escolahabilidade.com/cursos/marketing-digital
https://www.escolahabilidade.com/cursos/inteligencia-artificial
https://www.escolahabilidade.com/cursos/informatica
https://www.escolahabilidade.com/cursos/programacao
https://www.escolahabilidade.com/cursos/design-grafico
```

### Schemas Esperados
Todos os 5 schemas devem ter:
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de ...",
  "description": "Descrição completa do curso...", ← OBRIGATÓRIO
  "provider": {...},
  "url": "https://...",
  "courseMode": "Blended",
  "offers": {...}
}
```

### longDescription de coursesData.js (Linha ~1220, 1627, 465, 14, 830)
```javascript
// Marketing Digital
longDescription: 'Torne-se um especialista em Marketing Digital. Aprenda Marketing V2, Mídias Sociais...'

// Inteligência Artificial
longDescription: 'Curso completo de Inteligência Artificial. Aprenda IA Fundamentos, IA for Business...'

// Design Gráfico
longDescription: 'Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator...'

// Informática
longDescription: 'Domine a informática moderna com nosso curso mais completo...'

// Programação
longDescription: 'Curso completo de programação full-stack. Aprenda Lógica, Python, Java...'
```

## Ferramentas de Teste

1. **Google Rich Results Test:** https://search.google.com/test/rich-results
2. **Schema Markup Validator:** https://validator.schema.org/
3. **View Source:** `curl -s https://www.escolahabilidade.com/cursos/marketing-digital | grep -A 20 '"@type": "Course"'`

## Contexto Técnico

- **React:** 19
- **Vite:** 7
- **SSG:** vite-react-ssg
- **Helmet:** @dr.pogodin/react-helmet
- **Build command:** `npm run build:production`
- **Deploy:** Netlify (auto-deploy do main branch)

## Próximos Passos Sugeridos

1. ✅ **Investigar HTML gerado** - Ver se schema inline está no build
2. ⚠️ **Refatorar para padrão Informatica.jsx** - Solução mais confiável
3. 🔍 **Debug generateCourseMetadata** - Se schema está sendo sobrescrito
4. 🧪 **Testar com Google Rich Results** - Validar schema antes de deploy

---

**Data:** 2025-10-08
**Commits relevantes:** 24fb91d, 8efa819
**Status:** Problema persiste após 2 tentativas de correção
