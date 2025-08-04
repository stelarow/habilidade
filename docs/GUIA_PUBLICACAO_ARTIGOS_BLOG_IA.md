# Guia Completo: Publicação de Artigos no Blog por IA

## Visão Geral

Este documento detalha o processo completo para que uma IA publique artigos no blog da Escola Habilidade, incluindo gerenciamento de imagens, estrutura de dados, e todos os passos necessários.

## Arquitetura do Sistema

### 1. Estrutura de Dados (Supabase)

#### Tabelas Principais

**blog_posts**
```sql
- id: UUID (primary key)
- title: TEXT NOT NULL
- slug: TEXT NOT NULL UNIQUE (formato: kebab-case)
- excerpt: TEXT (resumo de 150-160 caracteres)
- content: TEXT NOT NULL (conteúdo em Markdown)
- status: TEXT ('draft', 'published', 'archived')
- featured_image: TEXT (URL da imagem de capa)
- image_url: TEXT (campo alternativo para imagem)
- seo_title: TEXT
- seo_description: TEXT
- author_id: UUID (referência para users)
- category_id: UUID (referência para blog_categories)
- view_count: INTEGER DEFAULT 0
- published_at: TIMESTAMP WITH TIME ZONE
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

**blog_categories**
```sql
- id: UUID (primary key)
- name: TEXT NOT NULL UNIQUE
- slug: TEXT NOT NULL UNIQUE
- description: TEXT
- color_theme: TEXT DEFAULT '#d400ff'
```

**blog_course_ctas**
```sql
- id: UUID (primary key)
- post_id: UUID (referência para blog_posts)
- course_id: UUID (referência para courses)
- course_name: TEXT NOT NULL
- course_slug: TEXT NOT NULL
```

### 2. Sistema de Arquivos

#### Estrutura de Diretórios

```
/mnt/c/Habilidade/
├── blog-posts/           # Arquivos .md dos artigos
│   ├── artigo-slug.md
│   └── ...
├── public/
│   └── images/
│       └── blog/         # Imagens dos artigos
│           └── artigo-slug/
│               ├── hero-image.jpg
│               ├── image-1.jpg
│               └── ...
└── src/
    ├── services/
    │   └── supabaseBlogAPI.js
    └── components/
        └── blog/
```

## Processo Passo a Passo para Publicação

### Passo 1: Preparação do Conteúdo

1. **Criar arquivo Markdown**
   ```bash
   touch /mnt/c/Habilidade/blog-posts/titulo-do-artigo.md
   ```

2. **Estrutura do arquivo .md**
   ```markdown
   # Título do Artigo

   **Publicado em:** DD de Mês de YYYY  
   **Tempo de leitura:** X minutos  
   **Categoria:** Nome da Categoria  
   **Tags:** tag1, tag2, tag3  
   **CTA Course:** slug-do-curso  
   **Featured Image URL:** /images/blog/titulo-do-artigo/hero-image.jpg

   ## Resumo

   [Resumo de 150-160 caracteres para SEO e cards]

   ---

   ## Objetivos de Aprendizagem

   - Objetivo 1
   - Objetivo 2
   - ...

   ---

   [Conteúdo principal do artigo...]
   ```

### Passo 2: Processamento de Imagens

1. **Criar diretório de imagens**
   ```bash
   mkdir -p /mnt/c/Habilidade/public/images/blog/titulo-do-artigo/
   ```

2. **Processar e otimizar imagens**
   - Formatos aceitos: JPG, PNG, WebP, SVG
   - Resolução recomendada: 1200x630px para hero image
   - Compressão: 80-85% de qualidade
   - Nomeação: kebab-case descritivo

3. **Copiar imagens para o diretório**
   ```bash
   cp origem.jpg /mnt/c/Habilidade/public/images/blog/titulo-do-artigo/hero-image.jpg
   ```

### Passo 3: Validação de Dados

1. **Verificar slug único**
   - Formato: lowercase, separado por hífens
   - Exemplo: `como-criar-agente-ia-n8n`

2. **Validar categoria**
   - Verificar se existe no banco
   - Categorias comuns: Tecnologia, Programação, Arquitetura, Design, Educação

3. **Validar curso para CTA**
   - Verificar slug do curso existe
   - Exemplos: `projetista-3d`, `excel-completo`

### Passo 4: Inserção no Banco de Dados

1. **Preparar dados para inserção**
   ```javascript
   const novoArtigo = {
     title: "Título do Artigo",
     slug: "titulo-do-artigo",
     excerpt: "Resumo de 150-160 caracteres...",
     content: "[Conteúdo completo em Markdown]",
     status: "published",
     featured_image: "/images/blog/titulo-do-artigo/hero-image.jpg",
     image_url: "/images/blog/titulo-do-artigo/hero-image.jpg",
     seo_title: "Título SEO - Escola Habilidade",
     seo_description: "Descrição SEO completa...",
     author_id: "[UUID do autor]",
     category_id: "[UUID da categoria]",
     published_at: new Date().toISOString()
   };
   ```

2. **Inserir via Supabase (exemplo SQL)**
   ```sql
   INSERT INTO blog_posts (
     title, slug, excerpt, content, status,
     featured_image, image_url, seo_title, seo_description,
     author_id, category_id, published_at
   ) VALUES (
     'Título do Artigo',
     'titulo-do-artigo',
     'Resumo...',
     'Conteúdo...',
     'published',
     '/images/blog/titulo-do-artigo/hero-image.jpg',
     '/images/blog/titulo-do-artigo/hero-image.jpg',
     'Título SEO',
     'Descrição SEO',
     '[author_uuid]',
     '[category_uuid]',
     NOW()
   );
   ```

3. **Adicionar CTA do curso**
   ```sql
   INSERT INTO blog_course_ctas (
     post_id, course_id, course_name, course_slug
   ) VALUES (
     '[post_uuid]',
     '[course_uuid]',
     'Nome do Curso',
     'slug-do-curso'
   );
   ```

### Passo 5: Sistema de Imagens no Frontend

O sistema frontend busca imagens em ordem de prioridade:

1. `post.featured_image_url`
2. `post.featuredImage.url` (se objeto)
3. `post.featuredImage` (se string)
4. `post.imageUrl`

Se nenhuma imagem for encontrada, um placeholder é exibido baseado na categoria.

### Passo 6: Verificação Final

1. **Testar renderização do artigo**
   - Acessar: `http://localhost:5173/blog/titulo-do-artigo`
   - Verificar imagens carregando
   - Confirmar CTA do curso aparecendo

2. **Verificar SEO**
   - Meta tags corretas
   - Open Graph image
   - Structured data

## Exemplos Práticos

### Exemplo 1: Artigo sobre SketchUp

```markdown
# 10 Extensões SketchUp Essenciais para Arquitetos

**Publicado em:** 04 de Agosto de 2025  
**Tempo de leitura:** 15 minutos  
**Categoria:** Arquitetura  
**Tags:** sketchup, extensões, arquitetura, 3d-modeling, plugins  
**CTA Course:** projetista-3d  
**Featured Image URL:** /images/blog/10-extensoes-sketchup-arquitetos/hero-sketchup.jpg

## Resumo

Descubra as 10 extensões mais poderosas do SketchUp que todo arquiteto deve conhecer para otimizar seu workflow e criar projetos impressionantes.

---

[Conteúdo do artigo...]
```

### Exemplo 2: Upload de Imagem via API

```javascript
// Exemplo conceitual de upload para storage
async function uploadImageToStorage(imagePath, imageBuffer) {
  const { data, error } = await supabase.storage
    .from('blog-images')
    .upload(imagePath, imageBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  
  // Retorna URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(data.path);
    
  return publicUrl;
}
```

## Considerações Importantes

### 1. CTAs (Call-to-Actions)
- **Política**: Usar apenas o CTA do final (card do curso)
- **Evitar**: CTAs duplicados no meio do conteúdo
- **Formato**: Card visual com informações do curso

### 2. Otimização de Imagens
- Comprimir antes do upload
- Usar nomes descritivos
- Incluir alt text para acessibilidade
- Manter proporção 16:9 para hero images

### 3. SEO e Metadados
- Título: máximo 60 caracteres
- Descrição: 150-160 caracteres
- Usar palavras-chave relevantes
- Estruturar conteúdo com headings hierárquicos

### 4. Validações Obrigatórias
- Slug único e válido
- Categoria existente
- Curso válido para CTA
- Imagens no diretório correto
- Conteúdo em Markdown válido

## Checklist de Publicação

- [ ] Arquivo .md criado em `/blog-posts/`
- [ ] Diretório de imagens criado em `/public/images/blog/[slug]/`
- [ ] Todas as imagens processadas e otimizadas
- [ ] Metadados completos no cabeçalho do .md
- [ ] Slug único verificado
- [ ] Categoria validada no banco
- [ ] Curso para CTA validado
- [ ] Conteúdo revisado e formatado
- [ ] Inserção no banco de dados realizada
- [ ] CTA do curso adicionado
- [ ] Teste de renderização aprovado
- [ ] SEO e meta tags verificados

## Comandos Úteis

```bash
# Criar estrutura completa para novo artigo
mkdir -p /mnt/c/Habilidade/public/images/blog/novo-artigo/
touch /mnt/c/Habilidade/blog-posts/novo-artigo.md

# Verificar imagens
ls -la /mnt/c/Habilidade/public/images/blog/novo-artigo/

# Testar servidor local
cd /mnt/c/Habilidade && npm run dev
```

## Suporte e Troubleshooting

### Problemas Comuns

1. **Imagem não aparece**
   - Verificar caminho correto
   - Confirmar arquivo existe
   - Checar permissões

2. **Slug duplicado**
   - Usar variação do título
   - Adicionar data ou versão

3. **CTA não aparece**
   - Verificar curso existe
   - Confirmar relação na tabela `blog_course_ctas`

4. **Erro de codificação**
   - Salvar arquivos em UTF-8
   - Evitar caracteres especiais em nomes de arquivo

---

*Última atualização: Agosto 2025*