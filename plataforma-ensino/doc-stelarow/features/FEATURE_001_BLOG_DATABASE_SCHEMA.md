# FEATURE_001: Configura��o do Schema do Blog no Supabase

## Descri��o:
Estabelecer a estrutura de dados necess�ria para armazenar e gerenciar todo o conte�do do blog de forma organizada e segura, conforme especificado no sistema de blog integrado da plataforma Stelarow.

## Contexto de Refer�ncia:
- **SPEC.md**: Se��o "EPIC 1: FUNDA��O E GEST�O DE CONTE�DO" - Funcionalidade: Configura��o do Schema do Blog no Supabase
- **ARCHITECTURE.md**: Se��o "Modelagem de Dados Supabase" - Schema completo do banco de dados e pol�ticas de seguran�a RLS

## Tarefas:

### 1. **Criar tabelas principais do sistema de blog no Supabase**
   * **Caminho de implementa��o**: `database/migrations/001_create_blog_schema.sql`
   * **Descri��o**: Implementar todas as tabelas principais: posts, categories, tags e tabelas de jun��o
   * **Campos espec�ficos**:
     - Tabela `posts`: id, title, slug, content, excerpt, author_id, status, published_at, main_image_url, seo_title, seo_description, cta_course_id, cta_custom_text, cta_enabled, view_count, created_at, updated_at
     - Tabela `categories`: id, name, slug, description, color, created_at
     - Tabela `tags`: id, name, slug, created_at
     - Tabelas de jun��o: `posts_categories` e `posts_tags`
   * **Tecnologias**: PostgreSQL via Supabase
   * **Contexto**: `ARCHITECTURE.md` (Modelagem de Dados Supabase, linhas 84-158)
   * **MCPs/Ferramentas**: `Supabase MCP` (para cria��o e execu��o de schemas)
   * **Crit�rios de Aceita��o**:
     - Todas as tabelas devem ser criadas com os campos especificados
     - Relacionamentos foreign key implementados corretamente
     - Constraints CHECK para valida��o de status
     - UUIDs como chaves prim�rias
   * **Dura��o Estimada**: 4 horas

### 2. **Implementar �ndices de performance para consultas otimizadas**
   * **Caminho de implementa��o**: `database/migrations/002_create_blog_indexes.sql`
   * **Descri��o**: Criar �ndices para otimizar consultas frequentes
   * **�ndices espec�ficos**:
     - `idx_posts_status_published_at`: Para listagem de posts por status e data
     - `idx_posts_author_id`: Para busca por autor  
     - `idx_posts_slug`: Para busca por slug
     - `idx_categories_slug` e `idx_tags_slug`: Para filtros de categoria e tag
   * **Tecnologias**: PostgreSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 140-145)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Todos os �ndices criados conforme especifica��o
     - Performance de consulta melhorada demonstr�vel
   * **Dura��o Estimada**: 2 horas

### 3. **Configurar triggers para campos de timestamp autom�tico**
   * **Caminho de implementa��o**: `database/migrations/003_create_blog_triggers.sql`
   * **Descri��o**: Implementar fun��o e trigger para atualiza��o autom�tica do campo `updated_at`
   * **Funcionalidade**: Trigger `update_posts_updated_at` que executa antes de UPDATE na tabela posts
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 147-157)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Fun��o `update_updated_at_column()` criada
     - Trigger aplicado na tabela posts
     - Campo updated_at atualizado automaticamente em modifications
   * **Dura��o Estimada**: 3 horas

### 4. **Implementar pol�ticas de Row Level Security (RLS)**
   * **Caminho de implementa��o**: `database/migrations/004_create_blog_rls_policies.sql`
   * **Descri��o**: Configurar pol�ticas de seguran�a baseadas em roles de usu�rio
   * **Pol�ticas espec�ficas**:
     - Leitura p�blica de posts com status "published"
     - Autores podem ver seus pr�prios posts (qualquer status)
     - Admins e instrutores podem ver todos os posts
     - Restri��es de INSERT/UPDATE/DELETE baseadas em roles
   * **Tecnologias**: PostgreSQL RLS
   * **Contexto**: `SPEC.md` (linhas 21-26) e `ARCHITECTURE.md` (linhas 160-227)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - RLS habilitado em todas as tabelas do blog
     - Pol�ticas implementadas conforme matriz de permiss�es
     - Testes de acesso validados para diferentes roles
   * **Dura��o Estimada**: 6 horas

### 5. **Criar fun��o para incremento de views dos artigos**
   * **Caminho de implementa��o**: `database/functions/increment_view_count.sql`
   * **Descri��o**: Implementar stored procedure para incrementar contador de visualiza��es
   * **Funcionalidade**: Fun��o `increment_view_count(article_id UUID)` que incrementa view_count atomicamente
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 1131-1135)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Fun��o criada e testada
     - Incremento at�mico sem condi��es de corrida
     - Tratamento de erros implementado
   * **Dura��o Estimada**: 2 horas

### 6. **Criar fun��es de manuten��o e estat�sticas**
   * **Caminho de implementa��o**: `database/functions/blog_maintenance.sql`
   * **Descri��o**: Implementar fun��es para limpeza e estat�sticas do blog
   * **Fun��es espec�ficas**:
     - `cleanup_old_drafts()`: Remove drafts abandonados ap�s 30 dias
     - `get_blog_stats()`: Retorna estat�sticas gerais do blog
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 1623-1653)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Ambas as fun��es implementadas e testadas
     - L�gica de limpeza segura implementada
     - Estat�sticas precisas retornadas
   * **Dura��o Estimada**: 4 horas

### 7. **Configurar buckets de storage para m�dia do blog**
   * **Caminho de implementa��o**: `database/storage/blog_storage_setup.sql`
   * **Descri��o**: Configurar Supabase Storage para imagens do blog
   * **Configura��es**:
     - Bucket "blog-images" para imagens principais
     - Bucket "blog-content" para imagens do conte�do
     - Pol�ticas de acesso para upload e visualiza��o
   * **Tecnologias**: Supabase Storage
   * **Contexto**: `SPEC.md` (linhas 58-79) - Gest�o de M�dia
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Buckets criados com configura��es adequadas
     - Pol�ticas de upload para usuarios autorizados
     - Acesso p�blico para leitura de imagens
   * **Dura��o Estimada**: 3 horas

### 8. **Validar schema com dados de teste**
   * **Caminho de implementa��o**: `database/seeds/blog_test_data.sql`
   * **Descri��o**: Inserir dados de teste para validar integridade do schema
   * **Dados de teste**:
     - 3 categorias de exemplo
     - 10 tags variadas
     - 5 artigos de teste com diferentes status
     - Associa��es de categorias e tags
   * **Tecnologias**: SQL
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Crit�rios de Aceita��o**:
     - Dados inseridos sem viola��o de constraints
     - Relacionamentos funcionando corretamente
     - Pol�ticas RLS validadas com dados de teste
   * **Dura��o Estimada**: 3 horas

## Crit�rios de Aceita��o Gerais:
- [ ] Todas as tabelas criadas conforme especifica��o
- [ ] �ndices implementados para performance otimizada
- [ ] Pol�ticas RLS configuradas e testadas
- [ ] Triggers e fun��es funcionando corretamente
- [ ] Storage configurado para m�dia
- [ ] Schema validado com dados de teste
- [ ] Documenta��o de migra��o atualizada

## Depend�ncias:
- Sistema de autentica��o da plataforma Stelarow j� implementado
- Tabela `user_profiles` existente com campo `role`
- Tabela `courses` existente para refer�ncia de CTAs

## Estimativa Total: 27 horas

## Notas de Implementa��o:
- Utilizar Sequential Thinking para planejamento detalhado das migra��es
- Testar cada migra��o em ambiente de desenvolvimento antes da produ��o
- Documentar todas as altera��es no schema para futuras refer�ncias
- Validar performance das consultas ap�s implementa��o dos �ndices