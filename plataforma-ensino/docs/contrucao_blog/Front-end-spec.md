# UI/UX Specification: Stelarow Integrated Blog

**Autor:** BMad-UX (UX Expert)
**Status:** Versão 1.0 - Pronto para Arquitetura de Frontend
**Baseado em:** `docs/prd.md`

---

### 1. Visão Geral e Filosofia de Design

Esta especificação detalha a interface e a experiência do utilizador para o novo blog da Stelarow. O design seguirá três princípios fundamentais:
* **Consistência de Marca:** A UI do blog será uma extensão natural da plataforma Stelarow existente, utilizando o mesmo design system, paleta de cores, tipografia e componentes para criar uma experiência unificada.
* **Foco no Conteúdo:** O design será minimalista e limpo, garantindo que o conteúdo seja o protagonista. A legibilidade e a velocidade de carregamento são prioridades máximas para otimizar a experiência de leitura.
* **Jornada Orientada à Conversão:** Cada elemento de design será intencionalmente projetado para guiar o utilizador desde a descoberta do artigo até a consideração de um curso, utilizando CTAs claros e contextuais.

### 2. Fluxo do Utilizador Principal (User Flow)

O fluxo principal antecipado para um novo utilizador é o seguinte:

1.  **Descoberta (Entrada):** O utilizador encontra um artigo do blog através de um motor de busca (ex: Google) ou de um link partilhado.
2.  **Página do Artigo:** Aterra diretamente na página do artigo. A página carrega rapidamente (FCP < 2s) e apresenta o conteúdo de forma clara e legível em qualquer dispositivo.
3.  **Engajamento e Conversão:**
    * Durante a leitura, o utilizador encontra um **CTA contextual** (ex: "Gostou deste artigo sobre Next.js? Conheça nosso curso completo!").
    * Ao final do artigo, encontra uma seção de **"Cursos Relacionados"** e uma lista de **"Artigos Semelhantes"**.
4.  **Navegação para a Plataforma:** Ao clicar em um CTA ou curso, o utilizador é levado diretamente para a página do curso correspondente na plataforma principal, completando a jornada de conversão.

### 3. Wireframes (Descrição Estrutural)

#### 3.1. Página Inicial do Blog (`/blog`)

* **Header:** Header global da Stelarow (consistente com a plataforma).
* **Secção Principal:** Um artigo em destaque (o mais recente ou um fixado manualmente).
* **Grid de Artigos:** Uma lista paginada de artigos em formato de cartão (`ArticleCard`), mostrando imagem, título, resumo e categorias/tags.
* **Barra Lateral (Desktop) / Seção (Mobile):**
    * Componente de Pesquisa (`SearchBar`).
    * Lista de Categorias para filtro.
    * CTA para a newsletter principal.
* **Footer:** Footer global da Stelarow.

#### 3.2. Página do Artigo (`/blog/[slug]`)

* **Header:** Header global.
* **Título do Artigo:** Título `H1` grande e claro.
* **Metadados:** Nome do autor, data de publicação, tempo de leitura estimado.
* **Imagem de Destaque:** Imagem principal do artigo.
* **Corpo do Conteúdo:** Renderização do Markdown, com estilos para parágrafos, listas, código (`<code>`), citações (`<blockquote>`), etc. Otimizado para legibilidade.
* **CTAs Embutidos:** Componentes de CTA estrategicamente posicionados dentro do corpo do artigo.
* **Botões de Partilha Social:** Ícones para partilhar em redes sociais.
* **Secção de Cursos Relacionados:** Cards de cursos da plataforma principal, filtrados por relevância com o tema do artigo.
* **Secção de Artigos Semelhantes:** Grid de `ArticleCard` de outros posts.
* **Footer:** Footer global.

#### 3.3. Interface de Criação/Edição (`/admin/blog/new` ou `/admin/blog/edit/[id]`)

* **Acesso:** Protegido por autenticação (papéis de `instrutor` e `administrador`).
* **Layout:** Interface de formulário simples e funcional.
* **Campos de Formulário:**
    * `Título` (input de texto).
    * `Slug` (input de texto, com geração automática a partir do título).
    * `Resumo` (textarea).
    * `Imagem de Destaque` (componente de upload de imagem).
    * **Editor Markdown (`MarkdownEditor`):** Área principal para escrever o conteúdo, com preview em tempo real.
    * **Configurações de SEO:** Campos para `Meta Title` e `Meta Description`.
    * **Categorias e Tags:** Seletor múltiplo ou campo de input para adicionar taxonomias.
    * **Status:** Dropdown para selecionar `Rascunho` ou `Publicado`.
* **Ações:** Botões para `Salvar Rascunho` e `Publicar`.

### 4. Componentes Reutilizáveis

Os seguintes componentes de UI devem ser criados ou adaptados do design system existente:

* **`ArticleCard`:** Componente para exibir um resumo do artigo na página inicial e listagens.
    * Props: `imageUrl`, `title`, `excerpt`, `tags`, `slug`.
* **`SearchBar`:** Campo de input para pesquisa.
    * Props: `onSearch`.
* **`TagPill`:** Componente visual para exibir uma categoria ou tag.
    * Props: `label`, `url`.
* **`CtaSection`:** Bloco de chamada para ação para ser usado nos artigos.
    * Props: `title`, `text`, `buttonLabel`, `buttonUrl`.
* **`MarkdownEditor`:** Editor de texto para a área de administração.
* **`ImageUploader`:** Componente para upload e gestão de imagens.

### 5. Acessibilidade (WCAG)

Toda a interface deve seguir as diretrizes WCAG 2.1 nível AA, incluindo:
* Contraste de cores adequado.
* Uso de atributos `alt` em todas as imagens.
* Navegação por teclado completa.
* Uso de semântica HTML correta (tags `main`, `article`, `nav`, `aside`).

---