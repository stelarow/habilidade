# Guia Completo para Criação de Aulas - Plataforma Habilidade

> **IMPORTANTE**: Este documento deve ser consultado SEMPRE antes de criar ou modificar aulas na plataforma.

## Índice
1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Materiais da Aula](#materiais-da-aula)
4. [Canva Embeds](#canva-embeds)
5. [Processo de Criação](#processo-de-criação)
6. [Validações e Boas Práticas](#validações-e-boas-práticas)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Troubleshooting](#troubleshooting)

## Visão Geral do Sistema

A plataforma Habilidade utiliza um sistema modular para gerenciamento de aulas com as seguintes características:

- **Banco de Dados**: PostgreSQL com Supabase
- **Frontend**: Next.js 14 com TypeScript
- **Autenticação**: Supabase Auth
- **Armazenamento**: JSONB para dados flexíveis

### Arquitetura de Aulas

```
Curso (courses)
  └── Aula (lessons)
       ├── Conteúdo (content)
       ├── Vídeo (video_url)
       ├── Materiais (materials) - JSONB
       │    ├── PDFs
       │    ├── Canva Embeds
       │    ├── Links
       │    └── Downloads
       ├── Exercícios (exercises)
       └── Quiz (quizzes)
```

## Estrutura de Dados

### Tabela: lessons

```sql
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    video_duration INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    materials JSONB DEFAULT '[]'::jsonb,
    content TEXT,
    allows_file_upload BOOLEAN DEFAULT FALSE,
    transcript TEXT,
    is_preview BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, order_index),
    UNIQUE(course_id, slug)
);
```

### Campos Importantes

- **slug**: URL amigável, deve ser única por curso, usar kebab-case
- **order_index**: Ordem da aula no curso (começar em 1)
- **materials**: Array JSONB com todos os materiais
- **content**: HTML do conteúdo da aula (sem iframes duplicados!)
- **is_preview**: Se a aula é gratuita para preview
- **is_published**: Se a aula está visível para alunos

## Materiais da Aula

O campo `materials` é um array JSONB que suporta diferentes tipos de materiais:

### Estrutura Base de Material

```typescript
interface Material {
  id: string              // UUID único
  type: string           // 'pdf' | 'video' | 'canva' | 'link' | 'download'
  title: string          // Título do material
  description?: string   // Descrição opcional
  url: string           // URL do recurso
  order?: number        // Ordem de exibição
}
```

### Tipos de Materiais

1. **PDF**
```json
{
  "id": "uuid",
  "type": "pdf",
  "title": "Apostila da Aula",
  "description": "Material complementar em PDF",
  "url": "https://storage.exemplo.com/arquivo.pdf",
  "order": 1
}
```

2. **Canva** (Veja seção detalhada abaixo)
```json
{
  "id": "uuid",
  "type": "canva",
  "title": "Apresentação Visual",
  "description": "Slides da aula",
  "url": "https://www.canva.com/design/ID/view?embed",
  "author": "Nome do Autor",
  "authorUrl": "https://...",
  "embedType": "iframe",
  "order": 2
}
```

3. **Link Externo**
```json
{
  "id": "uuid",
  "type": "link",
  "title": "Artigo Recomendado",
  "url": "https://exemplo.com/artigo",
  "order": 3
}
```

## Canva Embeds

### ⚠️ IMPORTANTE: Nunca Hardcode URLs do Canva!

Todas as apresentações Canva devem ser armazenadas no campo `materials` da aula.

### Como Adicionar Canva Embed

1. **Obter o Link de Compartilhamento**
   - No Canva, clique em "Compartilhar"
   - Selecione "Mais" > "Incorporar"
   - Copie o link (ex: `https://www.canva.com/design/DAGuqW8uqiw/...`)

2. **Formatar para Embed**
   - Adicione `?embed` ao final da URL se não existir
   - URL final: `https://www.canva.com/design/DAGuqW8uqiw/.../view?embed`

3. **Estrutura no Banco**
```json
{
  "id": "c83578a8-c50f-4875-a8e5-a1e6a99f7eb0",
  "type": "canva",
  "title": "Apresentação Básica Minimalista",
  "description": "Material visual da aula",
  "url": "https://www.canva.com/design/DAGuqW8uqiw/_HxYFw6YjdkL93523L-55w/view?embed",
  "author": "Maria Eduarda",
  "authorUrl": "https://www.canva.com/design/DAGuqW8uqiw/...?utm_content=...",
  "embedType": "iframe",
  "order": 1
}
```

### Componentes Relacionados

- `LessonPageIntegration.tsx`: Extrai Canva materials automaticamente
- `CanvaEmbed.tsx`: Renderiza o iframe do Canva
- `CanvaMaterialManager.tsx`: Interface admin para gerenciar

## Processo de Criação

### 1. Criar a Estrutura da Aula

```sql
INSERT INTO public.lessons (
    course_id,
    title,
    slug,
    description,
    video_url,
    video_duration,
    order_index,
    materials,
    content,
    is_preview,
    is_published
) VALUES (
    'course-uuid',
    'Título da Aula',
    'titulo-da-aula',
    'Descrição detalhada da aula',
    'https://youtube.com/watch?v=...',
    1800, -- duração em segundos
    1,    -- ordem no curso
    '[]'::jsonb, -- materials vazio inicialmente
    '<h2>Conteúdo da Aula</h2><p>...</p>', -- HTML sem iframes!
    false,
    false
);
```

### 2. Adicionar Materiais

```sql
-- Adicionar Canva Embed
UPDATE public.lessons 
SET materials = materials || jsonb_build_array(
    jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'canva',
        'title', 'Apresentação da Aula',
        'description', 'Slides visuais do conteúdo',
        'url', 'https://www.canva.com/design/ID/view?embed',
        'author', 'Professor Nome',
        'embedType', 'iframe',
        'order', 1
    )
)
WHERE id = 'lesson-uuid';
```

### 3. Adicionar Exercícios

```sql
INSERT INTO public.exercises (
    lesson_id,
    title,
    description,
    instructions,
    type,
    order_index
) VALUES (
    'lesson-uuid',
    'Exercício Prático',
    'Aplique os conceitos aprendidos',
    '<p>Instruções detalhadas...</p>',
    'code', -- ou 'text', 'file_upload'
    1
);
```

### 4. Adicionar Quiz

```sql
INSERT INTO public.quizzes (
    lesson_id,
    title,
    description,
    passing_score,
    time_limit,
    randomize_questions
) VALUES (
    'lesson-uuid',
    'Quiz de Fixação',
    'Teste seus conhecimentos',
    70, -- pontuação mínima
    1800, -- 30 minutos
    true
);
```

## Validações e Boas Práticas

### ✅ SEMPRE Fazer

1. **Slugs Únicos**: Verificar se o slug não existe no curso
```sql
SELECT COUNT(*) FROM lessons 
WHERE course_id = 'X' AND slug = 'novo-slug';
```

2. **Order Index Sequencial**: Verificar próximo índice disponível
```sql
SELECT COALESCE(MAX(order_index), 0) + 1 
FROM lessons WHERE course_id = 'X';
```

3. **Materials como Array**: Sempre inicializar como array vazio
```sql
materials = '[]'::jsonb
```

4. **IDs Únicos**: Usar `gen_random_uuid()` para materials

### ❌ NUNCA Fazer

1. **Hardcode Canva URLs** no código TypeScript
2. **Duplicar iframes** no content e materials
3. **Esquecer embedType** para Canva materials
4. **Usar HTML no campo description** (apenas texto)
5. **Publicar sem revisar** (is_published = true direto)

## Exemplos Práticos

### Exemplo 1: Aula de Marketing Digital com Canva

```sql
-- 1. Criar a aula
INSERT INTO public.lessons (
    course_id,
    title,
    slug,
    description,
    video_url,
    video_duration,
    order_index,
    materials,
    content,
    is_preview,
    is_published
) VALUES (
    (SELECT id FROM courses WHERE slug = 'marketing-digital'),
    'Estratégias de Conteúdo',
    'estrategias-de-conteudo',
    'Aprenda a criar conteúdo que converte',
    'https://youtube.com/watch?v=abc123',
    2400,
    2,
    '[]'::jsonb,
    '<h2>Estratégias de Conteúdo</h2>
    <p>Nesta aula vamos explorar...</p>
    <h3>Tópicos Abordados</h3>
    <ul>
        <li>Planejamento de conteúdo</li>
        <li>Calendário editorial</li>
        <li>Métricas de sucesso</li>
    </ul>',
    false,
    false
) RETURNING id;

-- 2. Adicionar Canva
UPDATE public.lessons 
SET materials = jsonb_build_array(
    jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'canva',
        'title', 'Templates de Calendário Editorial',
        'description', 'Modelos práticos para organizar seu conteúdo',
        'url', 'https://www.canva.com/design/DAF123/view?embed',
        'author', 'Equipe Habilidade',
        'embedType', 'iframe',
        'order', 1
    )
)
WHERE slug = 'estrategias-de-conteudo';
```

### Exemplo 2: Múltiplos Materiais

```sql
UPDATE public.lessons 
SET materials = jsonb_build_array(
    -- Canva Presentation
    jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'canva',
        'title', 'Slides da Aula',
        'url', 'https://www.canva.com/design/DAF123/view?embed',
        'embedType', 'iframe',
        'order', 1
    ),
    -- PDF Download
    jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'pdf',
        'title', 'Apostila Complementar',
        'description', 'Material de apoio em PDF',
        'url', '/downloads/apostila-aula-2.pdf',
        'order', 2
    ),
    -- External Link
    jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'link',
        'title', 'Artigo Recomendado',
        'url', 'https://blog.exemplo.com/artigo',
        'order', 3
    )
)
WHERE id = 'lesson-uuid';
```

## Troubleshooting

### Problema: Iframe Duplicado

**Sintoma**: Dois Canva iframes aparecem na página

**Solução**: 
1. Remover iframe do campo `content`
2. Adicionar apenas em `materials`
3. Verificar se não há hardcode em `LessonPageIntegration.tsx`

### Problema: Canva não Carrega

**Verificar**:
1. URL termina com `?embed`
2. Material tem `embedType: 'iframe'`
3. `type: 'canva'` está correto

### Problema: Materials não Salvam

**Verificar**:
1. JSONB está válido
2. IDs são únicos
3. Estrutura segue o schema

## Checklist Final

Antes de publicar uma aula, verifique:

- [ ] Slug é único no curso
- [ ] Order index está correto
- [ ] Video URL é válido
- [ ] Materials está como array JSONB
- [ ] Canva embeds estão em materials (não no content)
- [ ] Conteúdo HTML está bem formatado
- [ ] Exercícios foram adicionados (se aplicável)
- [ ] Quiz foi configurado (se aplicável)
- [ ] is_published está false (revisar antes de publicar)

## Componentes do Sistema

### Frontend
- `/src/components/lesson/LessonPageIntegration.tsx` - Integração principal
- `/src/components/lesson/CanvaEmbed.tsx` - Renderiza Canva
- `/src/components/admin/CanvaMaterialManager.tsx` - Gerencia materials
- `/src/types/materials.ts` - TypeScript interfaces

### Banco de Dados
- `public.lessons` - Tabela principal
- `public.exercises` - Exercícios
- `public.quizzes` - Quizzes
- `public.quiz_questions` - Perguntas do quiz

---

**Última Atualização**: Dezembro 2024
**Versão**: 1.0
**Mantido por**: Equipe Desenvolvimento Habilidade