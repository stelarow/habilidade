# FEATURE_002: Interface de Cria��o e Edi��o de Artigos

## Descri��o:
Fornecer uma interface intuitiva para autores de conte�do criarem e editarem artigos diretamente no painel da plataforma Stelarow, utilizando componentes Shadcn/UI e integrando com o sistema de autentica��o existente.

## Contexto de Refer�ncia:
- **SPEC.md**: Se��o "Interface de Cria��o e Edi��o de Artigos" (linhas 28-57)
- **ARCHITECTURE.md**: Se��es "Estrutura de Diret�rios" (linhas 14-80), "Gerenciamento de Estado" (linhas 230-329), "Componentes UI e Design System" (linhas 406-947)

## Configura��o do Tema Shadcn/UI:
Esta feature utiliza o **tema VIOLET** do Shadcn/UI, que mant�m consist�ncia com a identidade visual da Habilidade:
- **Primary da Habilidade**: #d400ff (muito pr�ximo ao violet-500: 258.3 89.5% 66.3%)
- **Accent da Habilidade**: #a000ff (pr�ximo ao violet-600: 262.1 83.3% 57.8%)
- **Configura��o**: baseColor deve ser "violet" no components.json
- **CSS Variables**: As vari�veis do tema violet ser�o automaticamente aplicadas aos componentes

## Tarefas:

### 1. **Criar se��o Blog no painel administrativo**
   * **Caminho de implementa��o**: `src/app/admin/blog/page.tsx`
   * **Descri��o**: Implementar dashboard principal do blog no painel administrativo
   * **Funcionalidades**:
     - Lista de artigos com filtros por status (published, draft)
     - A��es r�pidas: criar, editar, visualizar, excluir
     - Estat�sticas b�sicas (total de posts, views, drafts)
   * **Tecnologias**: Next.js 14, TypeScript, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 31-35), `ARCHITECTURE.md` (linhas 32-38)
   * **MCPs/Ferramentas**: `Context7` (padr�es Next.js), instruir sobre utiliza��o de componentes `shadcn/ui` (DataTable, Card, Badge)
   * **Instru��o Shadcn/ui**: Copiar componentes `DataTable`, `Card`, `Badge`, `Button` da documenta��o shadcn/ui e adapt�-los no diret�rio `src/components/ui/`. **Importante**: Usar tema VIOLET (baseColor: "violet") para manter consist�ncia com as cores da Habilidade
   * **Crit�rios de Aceita��o**:
     - Se��o "Blog" vis�vel no menu administrativo
     - Lista paginada de artigos funcionando
     - Filtros de status operacionais
     - A��es de navega��o implementadas
   * **Dura��o Estimada**: 6 horas

### 2. **Implementar formul�rio de cria��o de artigo**
   * **Caminho de implementa��o**: `src/app/admin/blog/novo/page.tsx`
   * **Descri��o**: Criar p�gina e formul�rio para novo artigo com valida��o
   * **Campos do formul�rio**:
     - T�tulo (obrigat�rio)
     - Slug (auto-gerado, edit�vel)
     - Conte�do (editor Markdown)
     - Excerpt (resumo)
     - Imagem principal
     - T�tulo SEO e Descri��o SEO
     - Categorias (sele��o m�ltipla)
     - Tags (entrada de texto com sugest�es)
     - Status (draft/published)
     - CTA personalizado
   * **Tecnologias**: React Hook Form, Zod, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 37-43), `ARCHITECTURE.md` (linhas 41-52)
   * **MCPs/Ferramentas**: `Context7` (padr�es de valida��o)
   * **Instru��o Shadcn/ui**: Copiar componentes `Form`, `Input`, `Textarea`, `Select`, `Tabs`, `Button` da documenta��o shadcn/ui e adapt�-los conforme necess�rio. **Tema**: Utilizar configura��o VIOLET para manter consist�ncia visual
   * **Crit�rios de Aceita��o**:
     - Formul�rio completo com todos os campos
     - Valida��o client-side funcionando
     - Auto-gera��o de slug baseada no t�tulo
     - Preview do artigo em tempo real
   * **Dura��o Estimada**: 8 horas

### 3. **Desenvolver editor Markdown com preview**
   * **Caminho de implementa��o**: `src/components/blog/ArticleEditor.tsx`
   * **Descri��o**: Implementar editor avan�ado com preview em tempo real
   * **Funcionalidades**:
     - Editor de c�digo Markdown com syntax highlighting
     - Preview renderizado em tempo real
     - Barra de ferramentas com a��es comuns (negrito, it�lico, links, imagens)
     - Suporte a inser��o de imagens via upload
     - Auto-save de rascunhos
   * **Tecnologias**: CodeMirror, Markdown parser, Shadcn/UI
   * **Contexto**: `ARCHITECTURE.md` (linhas 693-729)
   * **MCPs/Ferramentas**: `Context7` (integra��o de bibliotecas)
   * **Instru��o Shadcn/ui**: Utilizar componentes `Tabs`, `Button`, `Separator`, `Toolbar` para a interface do editor. **Tema VIOLET**: Aplicar automaticamente com baseColor "violet"
   * **Crit�rios de Aceita��o**:
     - Editor funcional com syntax highlighting
     - Preview atualizado em tempo real
     - Toolbar com a��es b�sicas
     - Upload de imagens integrado
   * **Dura��o Estimada**: 10 horas

### 4. **Implementar sistema de upload de imagens**
   * **Caminho de implementa��o**: `src/components/blog/ImageUploader.tsx`
   * **Descri��o**: Criar componente para upload e gest�o de imagens do blog
   * **Funcionalidades**:
     - Upload drag-and-drop de imagens
     - Valida��o de tipos de arquivo (jpg, png, gif, webp)
     - Preview das imagens carregadas
     - Integra��o com Supabase Storage
     - Inser��o autom�tica de URLs no conte�do Markdown
   * **Tecnologias**: Supabase Storage, React Dropzone, Shadcn/UI
   * **Contexto**: `SPEC.md` (linhas 61-79), `ARCHITECTURE.md` (linhas 51-52)
   * **MCPs/Ferramentas**: `Supabase MCP` (opera��es de storage), `Context7`
   * **Instru��o Shadcn/ui**: Utilizar componentes `Dialog`, `Button`, `Progress`, `Alert` para interface de upload. **Tema**: Configurar com VIOLET theme para consist�ncia
   * **Crit�rios de Aceita��o**:
     - Upload funcional com drag-and-drop
     - Valida��o de tipos implementada
     - Integra��o com Supabase Storage
     - URLs inseridas automaticamente no editor
   * **Dura��o Estimada**: 7 horas

### 5. **Criar p�gina de edi��o de artigo existente**  
   * **Caminho de implementa��o**: `src/app/admin/blog/editar/[id]/page.tsx`
   * **Descri��o**: Implementar p�gina para edi��o de artigos existentes
   * **Funcionalidades**:
     - Carregamento de dados do artigo por ID
     - Formul�rio pr�-preenchido com dados atuais
     - Suporte a altera��o de status (draft � published)
     - Hist�rico de altera��es (�ltima modifica��o)
     - Confirma��o antes de altera��es cr�ticas
   * **Tecnologias**: Next.js, React Hook Form, Zod
   * **Contexto**: `SPEC.md` (linhas 45-50)
   * **MCPs/Ferramentas**: `Context7`, `Supabase MCP`
   * **Instru��o Shadcn/ui**: Reutilizar componentes do formul�rio de cria��o, adicionar `AlertDialog` para confirma��es. **Tema VIOLET**: Manter consist�ncia com configura��o de cores
   * **Crit�rios de Aceita��o**:
     - Carregamento correto dos dados existentes
     - Formul�rio pr�-preenchido funcionando
     - Altera��o de status implementada
     - Confirma��es para a��es cr�ticas
   * **Dura��o Estimada**: 6 horas

### 6. **Implementar valida��o de campos obrigat�rios**
   * **Caminho de implementa��o**: `src/lib/blog/validation.ts`
   * **Descri��o**: Criar schemas Zod para valida��o completa dos dados do artigo
   * **Valida��es**:
     - T�tulo obrigat�rio (1-255 caracteres)
     - Slug �nico no sistema
     - Conte�do obrigat�rio
     - Status v�lido (draft/published/archived)
     - URLs de imagem v�lidas
     - SEO: t�tulo e descri��o com limites corretos
   * **Tecnologias**: Zod, TypeScript
   * **Contexto**: `SPEC.md` (linhas 52-56), `ARCHITECTURE.md` (linhas 1000-1032)
   * **MCPs/Ferramentas**: `Context7` (padr�es de valida��o)
   * **Crit�rios de Aceita��o**:
     - Schemas Zod completos implementados
     - Valida��o client-side e server-side
     - Mensagens de erro claras e traduzidas
     - Valida��o de unicidade de slug
   * **Dura��o Estimada**: 4 horas

### 7. **Criar API Routes para opera��es CRUD**
   * **Caminho de implementa��o**: `src/app/api/blog/articles/route.ts` e `src/app/api/blog/articles/[id]/route.ts`
   * **Descri��o**: Implementar endpoints para Create, Read, Update, Delete de artigos
   * **Endpoints**:
     - `GET /api/blog/articles` - Listar artigos com filtros
     - `POST /api/blog/articles` - Criar novo artigo
     - `GET /api/blog/articles/[id]` - Buscar artigo por ID
     - `PUT /api/blog/articles/[id]` - Atualizar artigo
     - `DELETE /api/blog/articles/[id]` - Excluir artigo
   * **Tecnologias**: Next.js API Routes, Supabase
   * **Contexto**: `ARCHITECTURE.md` (linhas 949-1158)
   * **MCPs/Ferramentas**: `Supabase MCP`, `Context7`
   * **Crit�rios de Aceita��o**:
     - Todos os endpoints implementados
     - Autentica��o e autoriza��o verificadas
     - Valida��o de dados nos endpoints
     - Tratamento de erros adequado
   * **Dura��o Estimada**: 8 horas

### 8. **Implementar gerenciamento de categorias e tags**
   * **Caminho de implementa��o**: `src/components/blog/CategoryManager.tsx` e `src/components/blog/TagEditor.tsx`
   * **Descri��o**: Criar interfaces para gest�o de categorias e tags
   * **Funcionalidades Categorias**:
     - Lista de categorias existentes
     - Cria��o de novas categorias
     - Edi��o de nome, slug e cor
     - Associa��o a artigos
   * **Funcionalidades Tags**:
     - Input com auto-complete para tags existentes
     - Cria��o de tags dinamicamente
     - Visualiza��o de tags associadas
   * **Tecnologias**: React, Shadcn/UI
   * **Contexto**: `ARCHITECTURE.md` (linhas 47-54)
   * **MCPs/Ferramentas**: `Context7`
   * **Instru��o Shadcn/ui**: Utilizar componentes `Command`, `Popover`, `Badge`, `Input` para interfaces de sele��o. **Tema VIOLET**: Cores violet-500/600 alinhadas com a identidade Habilidade
   * **Crit�rios de Aceita��o**:
     - Gest�o completa de categorias
     - Auto-complete de tags funcionando
     - Cria��o din�mica de tags
     - Associa��es salvas corretamente
   * **Dura��o Estimada**: 7 horas

### 9. **Implementar sistema de auto-save e recupera��o**
   * **Caminho de implementa��o**: `src/hooks/blog/useAutoSave.ts`
   * **Descri��o**: Criar hook para auto-salvamento de rascunhos
   * **Funcionalidades**:
     - Auto-save a cada 30 segundos de inatividade
     - Indicador visual de status (salvando, salvo, erro)
     - Recupera��o de sess�o anterior
     - Preven��o de perda de dados
   * **Tecnologias**: React Hooks, Local Storage, Debounce
   * **MCPs/Ferramentas**: `Context7` (padr�es de hooks)
   * **Crit�rios de Aceita��o**:
     - Auto-save funcionando automaticamente
     - Indicadores visuais implementados
     - Recupera��o de dados funcionando
     - Preven��o de conflitos de vers�o
   * **Dura��o Estimada**: 5 horas

### 10. **Implementar testes E2E para fluxos principais**
   * **Caminho de implementa��o**: `e2e/blog/article-management.spec.ts`
   * **Descri��o**: Criar testes automatizados para fluxos de cria��o e edi��o
   * **Cen�rios de teste**:
     - Cria��o completa de artigo
     - Edi��o de artigo existente
     - Upload de imagens
     - Valida��o de campos obrigat�rios
     - Altera��o de status (draft � published)
   * **Tecnologias**: Playwright, TypeScript
   * **Contexto**: `ARCHITECTURE.md` (linhas 1533-1561)
   * **MCPs/Ferramentas**: `Puppeteer MCP`
   * **Crit�rios de Aceita��o**:
     - Todos os cen�rios principais testados
     - Testes executando sem falhas
     - Cobertura dos fluxos cr�ticos
     - Integra��o com CI/CD
   * **Dura��o Estimada**: 6 horas

## Crit�rios de Aceita��o Gerais:
- [ ] Se��o Blog integrada ao painel administrativo
- [ ] Formul�rios de cria��o e edi��o funcionais
- [ ] Editor Markdown com preview implementado
- [ ] Sistema de upload de imagens operacional
- [ ] Valida��o completa de dados
- [ ] API Routes para CRUD implementadas
- [ ] Gest�o de categorias e tags funcionando
- [ ] Auto-save e recupera��o implementados
- [ ] Testes E2E cobrindo fluxos principais
- [ ] Interface responsiva e acess�vel

## Depend�ncias:
- FEATURE_001 (Schema do blog) implementada
- Sistema de autentica��o da plataforma funcionando
- Componentes Shadcn/UI dispon�veis no projeto
- Middleware de autentica��o configurado

## Estimativa Total: 67 horas

## Notas de Implementa��o:
- Seguir padr�es de design system da plataforma Stelarow
- Utilizar Sequential Thinking para planejamento de componentes complexos  
- Implementar tratamento de erros robusto em todas as opera��es
- Garantir acessibilidade com labels e navega��o por teclado
- Otimizar performance com lazy loading de componentes pesados