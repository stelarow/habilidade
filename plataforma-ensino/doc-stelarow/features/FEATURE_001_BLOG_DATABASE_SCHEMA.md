# FEATURE_001: Configuração do Schema do Blog no Supabase

## Descrição:
Estabelecer a estrutura de dados necessária para armazenar e gerenciar todo o conteúdo do blog de forma organizada e segura, conforme especificado no sistema de blog integrado da plataforma Stelarow.

## Contexto de Referência:
- **SPEC.md**: Seção "EPIC 1: FUNDAÇÃO E GESTÃO DE CONTEÚDO" - Funcionalidade: Configuração do Schema do Blog no Supabase
- **ARCHITECTURE.md**: Seção "Modelagem de Dados Supabase" - Schema completo do banco de dados e políticas de segurança RLS

## Tarefas:

### 1. **Criar tabelas principais do sistema de blog no Supabase**
   * **Caminho de implementação**: `database/migrations/001_create_blog_schema.sql`
   * **Descrição**: Implementar todas as tabelas principais: posts, categories, tags e tabelas de junção
   * **Campos específicos**:
     - Tabela `posts`: id, title, slug, content, excerpt, author_id, status, published_at, main_image_url, seo_title, seo_description, cta_course_id, cta_custom_text, cta_enabled, view_count, created_at, updated_at
     - Tabela `categories`: id, name, slug, description, color, created_at
     - Tabela `tags`: id, name, slug, created_at
     - Tabelas de junção: `posts_categories` e `posts_tags`
   * **Tecnologias**: PostgreSQL via Supabase
   * **Contexto**: `ARCHITECTURE.md` (Modelagem de Dados Supabase, linhas 84-158)
   * **MCPs/Ferramentas**: `Supabase MCP` (para criação e execução de schemas)
   * **Critérios de Aceitação**:
     - Todas as tabelas devem ser criadas com os campos especificados
     - Relacionamentos foreign key implementados corretamente
     - Constraints CHECK para validação de status
     - UUIDs como chaves primárias
   * **Duração Estimada**: 4 horas

### 2. **Implementar índices de performance para consultas otimizadas**
   * **Caminho de implementação**: `database/migrations/002_create_blog_indexes.sql`
   * **Descrição**: Criar índices para otimizar consultas frequentes
   * **Índices específicos**:
     - `idx_posts_status_published_at`: Para listagem de posts por status e data
     - `idx_posts_author_id`: Para busca por autor  
     - `idx_posts_slug`: Para busca por slug
     - `idx_categories_slug` e `idx_tags_slug`: Para filtros de categoria e tag
   * **Tecnologias**: PostgreSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 140-145)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Todos os índices criados conforme especificação
     - Performance de consulta melhorada demonstrável
   * **Duração Estimada**: 2 horas

### 3. **Configurar triggers para campos de timestamp automático**
   * **Caminho de implementação**: `database/migrations/003_create_blog_triggers.sql`
   * **Descrição**: Implementar função e trigger para atualização automática do campo `updated_at`
   * **Funcionalidade**: Trigger `update_posts_updated_at` que executa antes de UPDATE na tabela posts
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 147-157)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Função `update_updated_at_column()` criada
     - Trigger aplicado na tabela posts
     - Campo updated_at atualizado automaticamente em modifications
   * **Duração Estimada**: 3 horas

### 4. **Implementar políticas de Row Level Security (RLS)**
   * **Caminho de implementação**: `database/migrations/004_create_blog_rls_policies.sql`
   * **Descrição**: Configurar políticas de segurança baseadas em roles de usuário
   * **Políticas específicas**:
     - Leitura pública de posts com status "published"
     - Autores podem ver seus próprios posts (qualquer status)
     - Admins e instrutores podem ver todos os posts
     - Restrições de INSERT/UPDATE/DELETE baseadas em roles
   * **Tecnologias**: PostgreSQL RLS
   * **Contexto**: `SPEC.md` (linhas 21-26) e `ARCHITECTURE.md` (linhas 160-227)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - RLS habilitado em todas as tabelas do blog
     - Políticas implementadas conforme matriz de permissões
     - Testes de acesso validados para diferentes roles
   * **Duração Estimada**: 6 horas

### 5. **Criar função para incremento de views dos artigos**
   * **Caminho de implementação**: `database/functions/increment_view_count.sql`
   * **Descrição**: Implementar stored procedure para incrementar contador de visualizações
   * **Funcionalidade**: Função `increment_view_count(article_id UUID)` que incrementa view_count atomicamente
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 1131-1135)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Função criada e testada
     - Incremento atômico sem condições de corrida
     - Tratamento de erros implementado
   * **Duração Estimada**: 2 horas

### 6. **Criar funções de manutenção e estatísticas**
   * **Caminho de implementação**: `database/functions/blog_maintenance.sql`
   * **Descrição**: Implementar funções para limpeza e estatísticas do blog
   * **Funções específicas**:
     - `cleanup_old_drafts()`: Remove drafts abandonados após 30 dias
     - `get_blog_stats()`: Retorna estatísticas gerais do blog
   * **Tecnologias**: PL/pgSQL
   * **Contexto**: `ARCHITECTURE.md` (linhas 1623-1653)
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Ambas as funções implementadas e testadas
     - Lógica de limpeza segura implementada
     - Estatísticas precisas retornadas
   * **Duração Estimada**: 4 horas

### 7. **Configurar buckets de storage para mídia do blog**
   * **Caminho de implementação**: `database/storage/blog_storage_setup.sql`
   * **Descrição**: Configurar Supabase Storage para imagens do blog
   * **Configurações**:
     - Bucket "blog-images" para imagens principais
     - Bucket "blog-content" para imagens do conteúdo
     - Políticas de acesso para upload e visualização
   * **Tecnologias**: Supabase Storage
   * **Contexto**: `SPEC.md` (linhas 58-79) - Gestão de Mídia
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Buckets criados com configurações adequadas
     - Políticas de upload para usuarios autorizados
     - Acesso público para leitura de imagens
   * **Duração Estimada**: 3 horas

### 8. **Validar schema com dados de teste**
   * **Caminho de implementação**: `database/seeds/blog_test_data.sql`
   * **Descrição**: Inserir dados de teste para validar integridade do schema
   * **Dados de teste**:
     - 3 categorias de exemplo
     - 10 tags variadas
     - 5 artigos de teste com diferentes status
     - Associações de categorias e tags
   * **Tecnologias**: SQL
   * **MCPs/Ferramentas**: `Supabase MCP`
   * **Critérios de Aceitação**:
     - Dados inseridos sem violação de constraints
     - Relacionamentos funcionando corretamente
     - Políticas RLS validadas com dados de teste
   * **Duração Estimada**: 3 horas

## Critérios de Aceitação Gerais:
- [ ] Todas as tabelas criadas conforme especificação
- [ ] Índices implementados para performance otimizada
- [ ] Políticas RLS configuradas e testadas
- [ ] Triggers e funções funcionando corretamente
- [ ] Storage configurado para mídia
- [ ] Schema validado com dados de teste
- [ ] Documentação de migração atualizada

## Dependências:
- Sistema de autenticação da plataforma Stelarow já implementado
- Tabela `user_profiles` existente com campo `role`
- Tabela `courses` existente para referência de CTAs

## Estimativa Total: 27 horas

## Notas de Implementação:
- Utilizar Sequential Thinking para planejamento detalhado das migrações
- Testar cada migração em ambiente de desenvolvimento antes da produção
- Documentar todas as alterações no schema para futuras referências
- Validar performance das consultas após implementação dos índices