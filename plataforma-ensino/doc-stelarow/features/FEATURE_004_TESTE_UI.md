# FEATURE_004_TESTE_UI - Interface de Teste para P�ginas P�blicas do Blog

## Funcionalidade: Interface de Teste para Valida��o Visual do Blog

### Descri��o:
Desenvolver uma interface de teste (UI test page) para valida��o visual das p�ginas p�blicas do blog Stelarow, permitindo que os desenvolvedores criem prot�tipos visuais das telas sem implementar funcionalidades reais. Esta feature foca exclusivamente na apar�ncia, layout e componentes de UI utilizando dados mock/est�ticos para valida��o do design system antes da implementa��o das funcionalidades completas.

### Contexto T�cnico:
- **Baseado em**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (EPIC 2: VISUALIZA��O P�BLICA E JORNADA DO UTILIZADOR)
- **Arquitetura**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/ARCHITECTURE.md` (Componentes UI e Design System)  
- **Tecnologias**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI
- **Objetivo**: Apenas apar�ncia visual - sem integra��o com banco de dados ou funcionalidades reais

### Configura��o do Tema Shadcn/UI:
Esta feature deve utilizar o **tema VIOLET** do Shadcn/UI para total consist�ncia com a identidade Habilidade:
- **Alinhamento de cores**: Primary (#d400ff) ≈ violet-500, Accent (#a000ff) ≈ violet-600
- **Configura��o necess�ria**: baseColor: "violet" no components.json
- **Aplica��o**: Todos os componentes de teste devem demonstrar o tema violet em a��o
- **Valida��o visual**: Confirmar que as cores dos componentes est�o alinhadas com a paleta Habilidade

### Tarefas:

#### 1. **Criar estrutura base de p�ginas de teste para o blog**
* **Caminho do arquivo**: `src/app/test-blog/page.tsx`
* **Descri��o**: P�gina principal de navega��o para todos os testes visuais do blog
* **Responsabilidades**:
  - Lista todas as p�ginas de teste dispon�veis
  - Links de navega��o para cada componente de teste
  - Layout consistent com o design system Stelarow
* **Tecnologias**: Next.js App Router, TypeScript, Tailwind CSS
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/ARCHITECTURE.md` (Se��o Design System Consistency)
* **MCPs/Ferramentas**: `Context7` (para padr�es Next.js)
* **Dura��o Estimada**: 3 horas

#### 2. **Implementar p�gina de teste para listagem de artigos com dados mock**
* **Caminho do arquivo**: `src/app/test-blog/listagem/page.tsx`
* **Descri��o**: Interface visual da p�gina principal do blog (`/blog`) com dados est�ticos
* **Responsabilidades**:
  - Exibir lista paginada de artigos mock
  - Implementar ArticleCard component visual
  - Mostrar diferentes estados (carregando, vazio, com conte�do)
  - Validar responsividade mobile/desktop
* **Componentes Shadcn/UI**: Card, Avatar, Badge, Separator, Button, Skeleton
* **Dados Mock**: 15-20 artigos fict�cios com categorias, autores e imagens
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI components
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Cen�rio "P�gina principal do blog")
* **Instru��o Shadcn/UI**: Utilizar componentes Card, Badge, Avatar do Shadcn/UI conforme documenta��o. **Tema VIOLET**: Aplicar baseColor "violet" para demonstrar consist�ncia com identidade Habilidade
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server** para documenta��o de componentes
* **Dura��o Estimada**: 6 horas

#### 3. **Desenvolver p�gina de teste para visualiza��o individual de artigo**
* **Caminho do arquivo**: `src/app/test-blog/artigo/page.tsx`
* **Descri��o**: Interface visual da p�gina de artigo individual (`/blog/[slug]`) 
* **Responsabilidades**:
  - Layout completo do artigo com header, conte�do e footer
  - Componente ArticleHeader com t�tulo, autor, data, categorias
  - Renderiza��o de conte�do Markdown simulado
  - Se��o de CTA (Call-to-Action) visual
  - Breadcrumbs de navega��o
* **Componentes Shadcn/UI**: Card, Badge, Avatar, Separator, Breadcrumb, Button
* **Dados Mock**: Artigo completo fict�cio com markdown, imagens, autor, categorias
* **Tecnologias**: Next.js, TypeScript, componentes Shadcn/UI
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Cen�rio "Visualiza��o de artigo publicado")
* **Instru��o Shadcn/UI**: Implementar Breadcrumb, Card e Badge conforme padr�es da documenta��o. **Tema VIOLET**: Usar cores violet-500/600 para elementos de navega��o e destaque
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 8 horas

#### 4. **Criar componente de teste para sistema de busca e filtros**
* **Caminho do arquivo**: `src/app/test-blog/busca/page.tsx`
* **Descri��o**: Interface visual do sistema de pesquisa de artigos
* **Responsabilidades**:
  - Campo de busca com �cone e placeholder
  - Filtros por categoria usando dropdown
  - Resultados de busca com highlighting visual
  - Estados vazios ("Nenhum resultado encontrado")
  - Pagination component visual
* **Componentes Shadcn/UI**: Input, Command, Popover, Button, Badge, Card
* **Dados Mock**: Resultados de busca simulados, categorias fict�cias
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Funcionalidade de Pesquisa Interna)
* **Instru��o Shadcn/UI**: Usar Command component para busca conforme documenta��o Shadcn/UI. **Tema VIOLET**: Command com highlighting violet nos resultados de busca
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 5 horas

#### 5. **Implementar p�ginas de teste para listagem por categoria e tag**
* **Caminho do arquivo**: `src/app/test-blog/categoria/page.tsx` e `src/app/test-blog/tag/page.tsx`
* **Descri��o**: Interfaces visuais para listagem filtrada por categoria/tag
* **Responsabilidades**:
  - Layout espec�fico para categoria/tag com header contextual
  - Breadcrumbs indicando filtro ativo
  - Lista de artigos filtrados visualmente
  - Sidebar com outras categorias/tags dispon�veis
  - Pagination para navega��o
* **Componentes Shadcn/UI**: Card, Badge, Breadcrumb, Button, Separator
* **Dados Mock**: Artigos organizados por categorias e tags fict�cias
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Cen�rios "Listagem por categoria" e "Listagem por tag")
* **Instru��o Shadcn/UI**: Adaptar Card e Badge components para contexto de filtros. **Tema VIOLET**: Badges violet para categorias/tags ativas, variant ghost para inativas
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 6 horas

#### 6. **Desenvolver componentes de teste para CTAs (Call-to-Actions)**
* **Caminho do arquivo**: `src/app/test-blog/cta/page.tsx`
* **Descri��o**: Showcase visual dos diferentes tipos de CTA do blog
* **Responsabilidades**:
  - CTA espec�fico para curso (com dados do curso mock)
  - CTA gen�rico para p�gina de cursos
  - CTA desabilitado/oculto
  - Diferentes varia��es visuais e posicionamentos
  - Integra��o com design system Stelarow (cores gradient)
* **Componentes Shadcn/UI**: Card, Button, Badge
* **Componentes Custom**: GradientButton (reutilizar da plataforma)
* **Dados Mock**: Cursos fict�cios para CTAs espec�ficos
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI, componentes custom
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Integra��o de CTAs)
* **Instru��o Shadcn/UI**: Customizar Button component com variantes para CTAs. **Tema VIOLET**: Botões primary violet para CTAs principais, secondary para ações secundárias
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 4 horas

#### 7. **Criar biblioteca de dados mock para testes**
* **Caminho do arquivo**: `src/lib/test-data/blog-mock-data.ts`
* **Descri��o**: Centralize todos os dados fict�cios para testes do blog
* **Responsabilidades**:
  - Artigos mock com estrutura completa (t�tulo, conte�do, autor, categorias, tags)
  - Autores fict�cios com nomes e avatars
  - Categorias e tags organizadas
  - Cursos mock para CTAs
  - Fun��es helper para gerar dados aleat�rios
* **Estrutura de Dados**: Baseada nos tipos TypeScript do blog
* **Tecnologias**: TypeScript, faker.js (opcional)
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/ARCHITECTURE.md` (Modelagem de Dados)
* **MCPs/Ferramentas**: `Context7`
* **Dura��o Estimada**: 4 horas

#### 8. **Implementar componentes de teste para estados de loading e erro**
* **Caminho do arquivo**: `src/app/test-blog/estados/page.tsx`
* **Descri��o**: Showcase dos diferentes estados visuais (loading, erro, vazio)
* **Responsabilidades**:
  - Skeleton loaders para lista de artigos
  - Skeleton loader para artigo individual
  - Estados de erro com mensagens apropriadas
  - Estados vazios (sem artigos, busca sem resultados)
  - Error boundary visual
* **Componentes Shadcn/UI**: Skeleton, Alert, Card, Button
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/ARCHITECTURE.md` (Tratamento de Erros)
* **Instru��o Shadcn/UI**: Usar Skeleton e Alert components conforme padr�es. **Tema VIOLET**: Skeleton com tons violet suaves, Alert com variants violet para diferentes tipos
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 5 horas

#### 9. **Desenvolver p�gina de teste para responsividade e breakpoints**
* **Caminho do arquivo**: `src/app/test-blog/responsivo/page.tsx`
* **Descri��o**: P�gina para testar responsividade de todos os componentes do blog
* **Responsabilidades**:
  - Grid layouts em diferentes tamanhos de tela
  - Componentes que se adaptam de desktop para mobile
  - Typography scaling adequado
  - Navigation adapt�vel
  - Teste de imagens responsivas
* **Tecnologias**: Next.js, TypeScript, Tailwind CSS responsive classes
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/SPEC.md` (Cen�rio "Responsividade da p�gina do artigo")
* **MCPs/Ferramentas**: `Context7`
* **Dura��o Estimada**: 4 horas

#### 10. **Criar documenta��o visual dos componentes de teste**
* **Caminho do arquivo**: `src/app/test-blog/componentes/page.tsx`
* **Descri��o**: Storybook-like page para documentar todos os componentes visuais
* **Responsabilidades**:
  - Showcase de cada componente individual
  - Varia��es de estado de cada componente
  - C�digo de exemplo para cada componente
  - Guia de uso e boas pr�ticas visuais
  - Design tokens e paleta de cores
* **Componentes Shadcn/UI**: Tabs, Card, Button, Code
* **Tecnologias**: Next.js, TypeScript, Shadcn/UI
* **Contexto**: `/mnt/c/Habilidade/plataforma-ensino/doc-stelarow/ARCHITECTURE.md` (Design System Consistency)
* **Instru��o Shadcn/UI**: Usar Tabs component para organizar documenta��o. **Tema VIOLET**: Tabs com indicadores violet, conteúdo demonstrando paleta completa do tema
* **MCPs/Ferramentas**: `Context7`, **MCP Shadcn Server**
* **Dura��o Estimada**: 6 horas

### Crit�rios de Aceita��o:

#### Para cada tarefa:
-  **Apenas Visual**: Nenhuma integra��o com banco de dados ou APIs reais
-  **Dados Mock**: Todos os dados s�o est�ticos e fict�cios
-  **Design System**: Consistent com cores, tipografia e componentes Stelarow
-  **Responsivo**: Funciona em mobile, tablet e desktop
-  **Shadcn/UI**: Utiliza componentes da biblioteca conforme documenta��o
-  **TypeScript**: Tipagem completa sem uso de `any`
-  **Performance**: Carregamento r�pido sem depend�ncias desnecess�rias

#### Crit�rios Espec�ficos:
- **Navega��o**: Todas as p�ginas de teste acess�veis via `/test-blog/*`
- **Dados Consistentes**: Mock data realista e coerente entre p�ginas
- **Estados Visuais**: Loading, erro, vazio implementados visualmente
- **Interatividade B�sica**: Hover effects, click states, transi��es
- **Acessibilidade**: Contrast ratios, semantic HTML, keyboard navigation
- **SEO Ready**: Meta tags b�sicas mesmo sendo p�ginas de teste

### Observa��es Importantes:

1. **Foco Exclusivo em UI**: Esta feature n�o inclui:
   - Integra��o com Supabase
   - APIs funcionais
   - Sistema de autentica��o
   - Persist�ncia de dados
   - Valida��es de formul�rio reais

2. **Design System & Tema VIOLET**: Todos os componentes devem seguir:
   - **Cores da Habilidade**: Primary (#d400ff), Secondary (#00c4ff), Accent (#a000ff)
   - **Tema Shadcn/UI**: VIOLET (baseColor: "violet") para perfeita harmonia
   - **Mapeamento**: Primary → violet-500, Accent → violet-600
   - **Typography**: Montserrat font family
   - **Animations**: 4s gradient flow, hover effects consistentes
   - **Components**: Glass cards, corner cuts, neon buttons com cores violet

3. **Dados Mock**: Devem ser:
   - Realistas e profissionais
   - Relevantes para �rea educacional
   - Diversos em categorias (Tecnologia, Design, Educa��o, etc.)
   - Consistentes entre diferentes p�ginas de teste

4. **Configura��o do Tema VIOLET**:
   - **components.json**: Configurar `"baseColor": "violet"` antes de instalar componentes
   - **CSS Variables**: Verificar que as variáveis violet estão sendo aplicadas corretamente
   - **Validação Visual**: Confirmar alinhamento com #d400ff e #a000ff da Habilidade
   - **Documentação**: Demonstrar diferentes variants do tema nos componentes de teste

5. **Utiliza��o de MCPs**:
   - **MCP Shadcn Server**: SEMPRE consultar antes de implementar componentes
   - **Context7**: Para padr�es Next.js e TypeScript
   - **Sequential Thinking**: Para planejamento de layouts complexos

6. **Estrutura de Arquivos**:
   ```
   src/app/test-blog/
      page.tsx                    # �ndice de testes
      listagem/page.tsx          # Lista de artigos
      artigo/page.tsx            # Artigo individual  
      busca/page.tsx             # Sistema de busca
      categoria/page.tsx         # Listagem por categoria
      tag/page.tsx               # Listagem por tag
      cta/page.tsx               # Call-to-actions
      estados/page.tsx           # Loading/erro/vazio
      responsivo/page.tsx        # Testes responsivos
      componentes/page.tsx       # Documenta��o visual
   ```

### Resultado Esperado:
Ao final desta feature, teremos um conjunto completo de p�ginas de teste que permitir�o validar visualmente todo o design system do blog antes da implementa��o das funcionalidades reais, servindo como refer�ncia visual para os desenvolvedores e facilitando a aprova��o do design com stakeholders.