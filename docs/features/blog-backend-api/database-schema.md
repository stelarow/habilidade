# Database Schema - Blog Backend API

## Overview

O schema do banco de dados do Blog Backend API foi projetado para oferecer performance, flexibilidade e segurança. Utiliza PostgreSQL com recursos avançados como Row Level Security (RLS), índices otimizados, triggers automáticos e funções personalizadas.

### Características Principais

- **PostgreSQL 15+**: Database engine com recursos modernos
- **Row Level Security**: Controle granular de acesso
- **Índices Otimizados**: Performance superior em queries
- **Triggers Automáticos**: Manutenção automática de dados
- **Full-Text Search**: Busca em português otimizada
- **Constraints Robustas**: Integridade de dados garantida

## Estrutura de Tabelas

### 1. blog_categories

Armazena as categorias do blog com validação de slug e tema de cores.

```sql
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color_theme TEXT NOT NULL DEFAULT '#d400ff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT blog_categories_slug_check CHECK (slug ~* '^[a-z0-9-]+$')
);
```

#### Campos

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identificador único |
| `name` | TEXT | NOT NULL, UNIQUE | Nome da categoria |
| `slug` | TEXT | NOT NULL, UNIQUE, CHECK | Slug para URLs (a-z, 0-9, -) |
| `description` | TEXT | NULLABLE | Descrição da categoria |
| `color_theme` | TEXT | NOT NULL, DEFAULT '#d400ff' | Cor tema em hexadecimal |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Data de atualização |

#### Índices
```sql
-- Busca por slug (único)
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug 
    ON public.blog_categories(slug);
```

#### Dados Padrão
```sql
INSERT INTO public.blog_categories (name, slug, description, color_theme) VALUES
    ('Tecnologia', 'tecnologia', 'Artigos sobre tecnologia e inovação', '#d400ff'),
    ('Design', 'design', 'Dicas e tendências de design', '#00c4ff'),
    ('Educação', 'educacao', 'Conteúdo educacional e metodologias', '#a000ff'),
    ('Carreira', 'carreira', 'Desenvolvimento profissional e carreira', '#ff6600'),
    ('Mercado', 'mercado', 'Análises e tendências de mercado', '#00ff88')
ON CONFLICT (slug) DO NOTHING;
```

### 2. blog_posts

Tabela principal que armazena o conteúdo dos posts com controle de workflow.

```sql
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT blog_posts_status_check CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT blog_posts_slug_check CHECK (slug ~* '^[a-z0-9-]+$'),
    CONSTRAINT blog_posts_view_count_check CHECK (view_count >= 0)
);
```

#### Campos

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `title` | TEXT | NOT NULL | Título do post |
| `slug` | TEXT | NOT NULL, UNIQUE, CHECK | Slug único para URL |
| `excerpt` | TEXT | NULLABLE | Resumo/descrição breve |
| `content` | TEXT | NOT NULL | Conteúdo completo (Markdown) |
| `status` | TEXT | NOT NULL, CHECK | Status: draft, published, archived |
| `featured_image` | TEXT | NULLABLE | URL da imagem destacada |
| `seo_title` | TEXT | NULLABLE | Título otimizado para SEO |
| `seo_description` | TEXT | NULLABLE | Descrição otimizada para SEO |
| `author_id` | UUID | FK users(id), NOT NULL | Autor do post |
| `category_id` | UUID | FK blog_categories(id) | Categoria do post |
| `view_count` | INTEGER | DEFAULT 0, CHECK >= 0 | Contador de visualizações |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Data de atualização |
| `published_at` | TIMESTAMPTZ | NULLABLE | Data de publicação |

#### Workflow de Status
- **draft**: Post em elaboração, visível apenas para autor/admin
- **published**: Post publicado, visível publicamente (se published_at <= now())
- **archived**: Post arquivado, não visível publicamente

#### Índices Otimizados
```sql
-- Query principal da API (posts publicados ordenados por data)
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at 
    ON public.blog_posts(status, published_at DESC);

-- Busca por slug único
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug 
    ON public.blog_posts(slug);

-- Filtro por categoria
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status 
    ON public.blog_posts(category_id, status, published_at DESC);

-- Ordenação por autor
CREATE INDEX IF NOT EXISTS idx_blog_posts_author 
    ON public.blog_posts(author_id);

-- Ordenação por popularidade
CREATE INDEX IF NOT EXISTS idx_blog_posts_view_count 
    ON public.blog_posts(view_count DESC);

-- Busca full-text em português
CREATE INDEX IF NOT EXISTS idx_blog_posts_search 
    ON public.blog_posts USING gin(to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content));
```

### 3. blog_course_ctas

Relaciona posts com cursos para Call-to-Action contextual.

```sql
CREATE TABLE IF NOT EXISTS public.blog_course_ctas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    course_name TEXT NOT NULL,
    course_slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, course_id)
);
```

#### Campos

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `post_id` | UUID | FK blog_posts(id), NOT NULL | Post relacionado |
| `course_id` | UUID | FK courses(id), NOT NULL | Curso relacionado |
| `course_name` | TEXT | NOT NULL | Nome do curso (denormalizado) |
| `course_slug` | TEXT | NOT NULL | Slug do curso (denormalizado) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Data de criação |

#### Constraint Única
```sql
UNIQUE(post_id, course_id) -- Um post pode ter apenas um CTA por curso
```

#### Índices
```sql
-- Busca por post
CREATE INDEX IF NOT EXISTS idx_blog_course_ctas_post 
    ON public.blog_course_ctas(post_id);
```

#### Dados Denormalizados
Para performance da API, `course_name` e `course_slug` são denormalizados, evitando JOINs adicionais. Updates devem ser sincronizados via triggers ou jobs.

## Row Level Security (RLS)

### Políticas de Acesso

#### blog_categories
```sql
-- Leitura pública
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
    FOR SELECT USING (true);

-- Gerenciamento restrito
CREATE POLICY "Authenticated users can manage blog categories" ON public.blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
    );
```

#### blog_posts
```sql
-- Leitura pública apenas de posts publicados
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (
        status = 'published' 
        AND published_at IS NOT NULL 
        AND published_at <= NOW()
    );

-- Autores podem ver seus próprios posts
CREATE POLICY "Authors can view their own blog posts" ON public.blog_posts
    FOR SELECT USING (author_id = auth.uid());

-- Admins podem ver todos
CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Autores podem gerenciar seus posts
CREATE POLICY "Authors can manage their own blog posts" ON public.blog_posts
    FOR ALL USING (author_id = auth.uid());

-- Admins podem gerenciar todos
CREATE POLICY "Admins can manage all blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

#### blog_course_ctas
```sql
-- Leitura pública para posts publicados
CREATE POLICY "Anyone can view blog course CTAs for published posts" ON public.blog_course_ctas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.blog_posts
            WHERE id = post_id 
            AND status = 'published' 
            AND published_at IS NOT NULL 
            AND published_at <= NOW()
        )
    );

-- Gerenciamento restrito
CREATE POLICY "Authenticated users can manage blog course CTAs" ON public.blog_course_ctas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'instructor')
        )
    );
```

## Funções e Triggers

### 1. Atualização Automática de Timestamps

```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para as tabelas
CREATE TRIGGER blog_categories_updated_at
    BEFORE UPDATE ON public.blog_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_blog_updated_at();

CREATE TRIGGER blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.update_blog_updated_at();
```

### 2. Geração Automática de Slugs

```sql
-- Função para gerar slug único a partir do título
CREATE OR REPLACE FUNCTION public.generate_blog_slug(title_text TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Limpar e formatar o título
    base_slug := LOWER(TRIM(title_text));
    base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9\s-]', '', 'g');
    base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
    base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
    base_slug := TRIM(base_slug, '-');
    
    final_slug := base_slug;
    
    -- Garantir uniqueness
    WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-geração de slug
CREATE OR REPLACE FUNCTION public.auto_generate_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := public.generate_blog_slug(NEW.title);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_auto_slug
    BEFORE INSERT ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.auto_generate_blog_slug();
```

### 3. Incremento Seguro de View Count

```sql
-- Função para incrementar view count de forma segura
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blog_posts 
    SET view_count = view_count + 1 
    WHERE slug = post_slug 
    AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Views Otimizadas

### blog_posts_with_stats

View materializada para consultas complexas com estatísticas.

```sql
CREATE OR REPLACE VIEW public.blog_posts_with_stats AS
SELECT 
    bp.*,
    bc.name AS category_name,
    bc.slug AS category_slug,
    bc.color_theme AS category_color,
    u.full_name AS author_name,
    u.avatar_url AS author_avatar,
    COUNT(bcc.id) AS course_ctas_count
FROM public.blog_posts bp
LEFT JOIN public.blog_categories bc ON bp.category_id = bc.id
LEFT JOIN public.users u ON bp.author_id = u.id
LEFT JOIN public.blog_course_ctas bcc ON bp.id = bcc.post_id
GROUP BY bp.id, bc.id, u.id;
```

## Performance Optimization

### 1. Query Analysis

#### Posts Listing Query
```sql
-- Query principal da API otimizada
EXPLAIN ANALYZE
SELECT 
    bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
    bp.status, bp.featured_image, bp.seo_title, bp.seo_description,
    bp.author_id, bp.category_id, bp.view_count,
    bp.created_at, bp.updated_at, bp.published_at,
    u.id as author_id, u.full_name as author_name, u.avatar_url,
    bc.id as category_id, bc.name as category_name, bc.slug as category_slug, bc.color_theme,
    bcc.course_id, bcc.course_name, bcc.course_slug
FROM blog_posts bp
LEFT JOIN users u ON bp.author_id = u.id
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN blog_course_ctas bcc ON bp.id = bcc.post_id
WHERE bp.status = 'published'
    AND bp.published_at IS NOT NULL
    AND bp.published_at <= NOW()
ORDER BY bp.published_at DESC
LIMIT 10 OFFSET 0;
```

#### Performance Metrics
- **Expected Cost**: < 50 cost units
- **Execution Time**: < 5ms for 1000 posts
- **Index Usage**: All WHERE clauses should use indexes

### 2. Index Strategy

#### Compound Indexes
```sql
-- Índice composto para query principal
CREATE INDEX idx_blog_posts_published_query 
    ON blog_posts(status, published_at DESC) 
    WHERE status = 'published' AND published_at <= NOW();

-- Índice para filtro por categoria
CREATE INDEX idx_blog_posts_category_published 
    ON blog_posts(category_id, status, published_at DESC)
    WHERE status = 'published';
```

#### Partial Indexes
```sql
-- Índice apenas para posts publicados (menor tamanho)
CREATE INDEX idx_blog_posts_published_only 
    ON blog_posts(published_at DESC) 
    WHERE status = 'published' AND published_at IS NOT NULL;
```

### 3. Full-Text Search

#### Portuguese Configuration
```sql
-- Configuração específica para português
CREATE INDEX idx_blog_posts_search_pt 
    ON blog_posts USING gin(
        to_tsvector('portuguese', 
            COALESCE(title, '') || ' ' || 
            COALESCE(excerpt, '') || ' ' || 
            COALESCE(content, '')
        )
    );

-- Query de busca otimizada
SELECT *, ts_rank(
    to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content),
    plainto_tsquery('portuguese', 'design gráfico')
) as rank
FROM blog_posts 
WHERE to_tsvector('portuguese', title || ' ' || excerpt || ' ' || content) 
    @@ plainto_tsquery('portuguese', 'design gráfico')
    AND status = 'published'
ORDER BY rank DESC, published_at DESC;
```

## Monitoring e Maintenance

### 1. Statistics e Health Checks

```sql
-- Estatísticas das tabelas
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
    AND tablename LIKE 'blog_%'
ORDER BY tablename;

-- Tamanho das tabelas
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size,
    pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
    pg_size_pretty(pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass)) as index_size
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename LIKE 'blog_%'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
```

### 2. Performance Monitoring

```sql
-- Queries mais lentas
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
WHERE query ILIKE '%blog_%'
ORDER BY mean_time DESC
LIMIT 10;

-- Índices não utilizados
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
    AND tablename LIKE 'blog_%'
    AND idx_tup_read = 0
ORDER BY pg_relation_size(indexname::regclass) DESC;
```

### 3. Maintenance Tasks

```sql
-- Vacuum e análise regulares
VACUUM ANALYZE blog_posts;
VACUUM ANALYZE blog_categories;
VACUUM ANALYZE blog_course_ctas;

-- Reindex para otimização
REINDEX INDEX CONCURRENTLY idx_blog_posts_status_published_at;
REINDEX INDEX CONCURRENTLY idx_blog_posts_search;

-- Estatísticas atualizadas
ANALYZE blog_posts;
ANALYZE blog_categories;
```

## Backup e Recovery

### 1. Backup Strategy

```bash
# Backup completo das tabelas de blog
pg_dump -h hostname -U username -d database \
    --table=blog_posts \
    --table=blog_categories \
    --table=blog_course_ctas \
    --data-only \
    --file=blog_backup_$(date +%Y%m%d).sql

# Backup apenas da estrutura
pg_dump -h hostname -U username -d database \
    --table=blog_posts \
    --table=blog_categories \
    --table=blog_course_ctas \
    --schema-only \
    --file=blog_schema_backup.sql
```

### 2. Point-in-Time Recovery

```sql
-- Verificar logs de transação
SELECT * FROM pg_stat_archiver;

-- Restore para timestamp específico
-- (via pg_basebackup + WAL files)
```

## Migration Scripts

### 1. Schema Updates

```sql
-- Exemplo: Adicionar campo novo
ALTER TABLE blog_posts 
ADD COLUMN reading_time INTEGER DEFAULT 0;

-- Atualizar dados existentes
UPDATE blog_posts 
SET reading_time = CEIL(ARRAY_LENGTH(STRING_TO_ARRAY(content, ' '), 1) / 200.0)
WHERE reading_time = 0;

-- Adicionar constraint
ALTER TABLE blog_posts 
ADD CONSTRAINT blog_posts_reading_time_check 
CHECK (reading_time >= 0);
```

### 2. Data Migrations

```sql
-- Script para migrar dados de sistema anterior
INSERT INTO blog_categories (name, slug, description, color_theme)
SELECT 
    old_name,
    LOWER(REGEXP_REPLACE(old_name, '[^a-zA-Z0-9]', '-', 'g')),
    old_description,
    COALESCE(old_color, '#d400ff')
FROM old_categories_table
ON CONFLICT (slug) DO NOTHING;

-- Migrar posts com validação
INSERT INTO blog_posts (
    title, slug, excerpt, content, status, 
    author_id, category_id, published_at
)
SELECT 
    op.title,
    public.generate_blog_slug(op.title),
    SUBSTRING(op.content FROM 1 FOR 200),
    op.content,
    CASE WHEN op.published = true THEN 'published' ELSE 'draft' END,
    u.id,
    bc.id,
    op.publish_date
FROM old_posts_table op
JOIN users u ON u.email = op.author_email
JOIN blog_categories bc ON bc.slug = LOWER(REGEXP_REPLACE(op.category, '[^a-zA-Z0-9]', '-', 'g'))
WHERE op.title IS NOT NULL 
    AND LENGTH(op.title) > 0
    AND LENGTH(op.content) > 10;
```

## Security Considerations

### 1. Data Protection

```sql
-- Auditoria de changes
CREATE TABLE blog_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger de auditoria
CREATE OR REPLACE FUNCTION blog_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO blog_audit_log (
        table_name, record_id, operation, 
        old_values, new_values, user_id
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### 2. Access Control

```sql
-- Função para verificar permissões
CREATE OR REPLACE FUNCTION can_manage_blog_post(post_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Admin pode tudo
    IF EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RETURN true;
    END IF;
    
    -- Autor pode gerenciar próprio post
    IF EXISTS (
        SELECT 1 FROM blog_posts 
        WHERE id = post_id AND author_id = auth.uid()
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Este schema foi otimizado para performance, segurança e escalabilidade, fornecendo uma base sólida para o Blog Backend API da Escola Habilidade.