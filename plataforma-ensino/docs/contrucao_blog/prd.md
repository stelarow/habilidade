Product Requirements Document (PRD): Blog Integrado Stelarow
Autor: John (BMad-PM)
Status: Versão 1.0 - Aprovado para Design e Arquitetura
Data: 26/07/2024

Change Log
Data	Versão	Descrição	Autor
2024-07-26	1.0	Versão inicial baseada no escopo do projeto.	John (BMad-PM)

Exportar para as Planilhas
1. Goals and Background Context
Goals
Aumentar o tráfego orgânico qualificado para a plataforma Stelarow.

Gerar leads qualificados para os cursos através de conteúdo educativo.

Melhorar a autoridade de domínio (DA) da Stelarow, posicionando-a como uma referência em seu nicho.

Reduzir o Custo de Aquisição de Clientes (CAC) ao longo do tempo.

Aumentar o engajamento do utilizador (tempo de permanência, cliques em CTAs) e diminuir a taxa de rejeição.

Background Context
A Stelarow necessita de uma estratégia robusta para aquisição de utilizadores e reconhecimento de marca através de canais orgânicos. A ausência de um pilar de marketing de conteúdo, como um blog, limita a capacidade de capturar tráfego de pesquisa qualificado, educar o público sobre o ecossistema de tecnologias e carreiras relacionadas aos cursos e, finalmente, converter esse interesse em matrículas.

A solução é a criação de um blog nativamente integrado à plataforma Stelarow, que servirá como um hub de conhecimento. Ele será construído sobre a mesma base tecnológica (Next.js 14, TypeScript, Supabase) e dentro do mesmo monorepo do projeto principal para garantir máxima sinergia, consistência de código, compartilhamento de componentes e uma experiência de utilizador e de autoria unificada.

2. Requirements
Functional
FR1: O sistema deve fornecer uma interface de autoria para criar, editar, publicar e despublicar artigos de blog.

FR2: Os artigos devem suportar formatação de texto rica através de Markdown, incluindo títulos, listas, links e blocos de código.

FR3: O sistema deve permitir o upload e a inserção de imagens e outras mídias nos artigos.

FR4: Os artigos publicados devem ser visíveis publicamente em páginas web responsivas e otimizadas para leitura.

FR5: O sistema deve permitir a organização de artigos através de um sistema de Categorias e Tags.

FR6: Devem existir páginas de listagem que exibam todos os artigos pertencentes a uma Categoria ou Tag específica.

FR7: O sistema deve fornecer uma funcionalidade de pesquisa interna que retorne uma lista de artigos relevantes para um termo de busca.

FR8: Os artigos devem incluir campos para metadados de SEO (meta-título, meta-descrição, slug editável) e implementar schema markup para rich snippets.

FR9: Os artigos devem poder conter "Call-to-Actions" (CTAs) contextuais que direcionem os leitores para os cursos relevantes na plataforma principal.

FR10: Utilizadores com os papéis de "instrutor" ou "administrador" na plataforma principal devem ter permissão para aceder à interface de autoria do blog usando a mesma sessão de login.

Non-Functional
NFR1: O blog deve ser construído usando a stack tecnológica definida: Next.js 14, TypeScript e Supabase.

NFR2: O código do blog deve residir dentro do monorepo existente da plataforma Stelarow.

NFR3: O tempo de First Contentful Paint (FCP) para as páginas de artigos deve ser inferior a 2 segundos em conexões de banda larga.

NFR4: A interface do blog deve ser totalmente responsiva, adaptando-se a desktops, tablets e dispositivos móveis.

NFR5: O sistema de autenticação e autorização deve ser o mesmo da plataforma Stelarow, utilizando a instância do Supabase existente.

NFR6: As políticas de segurança da plataforma principal devem ser aplicadas ao blog (validação de entrada, proteção contra XSS, etc.).

3. User Interface Design Goals
Overall UX Vision: A experiência deve ser limpa, rápida e focada na legibilidade, integrando-se de forma transparente ao design da plataforma Stelarow para criar uma jornada de utilizador coesa e sem interrupções.

Core Screens and Views:

Página de listagem principal do blog (Homepage do Blog).

Página de visualização do artigo (Detalhe do Artigo).

Página de resultados de pesquisa.

Página de listagem por Categoria/Tag.

Interface de Autoria (Painel de Administração para criar/editar artigos).

Accessibility: O design deve seguir as diretrizes WCAG 2.1 nível AA.

Branding: O blog deve utilizar o design system, a paleta de cores, a tipografia e os componentes existentes da plataforma Stelarow.

Target Device and Platforms: Web Responsivo (desktop, tablet, mobile).

4. Technical Assumptions
Repository Structure: Monorepo.

Service Architecture: Módulo monolítico (blog) dentro de uma arquitetura de monorepo, compartilhando utilitários e tipos com os outros módulos (plataforma, marketing-site).

Testing Requirements: A estratégia de testes deve incluir testes unitários para a lógica de negócio e componentes, e testes de integração para as interações com a base de dados e APIs.

Additional Technical Assumptions and Requests:

Linguagem/Framework: Next.js 14 com App Router, TypeScript.

Base de Dados/Autenticação: Supabase (instância existente).

Hosting/Infrastructure: Vercel.

5. Epic List
Epic 1: Fundação e Gestão de Conteúdo: Estabelecer a estrutura da base de dados, a interface de autoria e as funcionalidades básicas de gestão de conteúdo para que os administradores e instrutores possam criar e organizar os artigos.

Epic 2: Visualização Pública e Jornada do Utilizador: Construir a parte pública do blog, permitindo que os visitantes leiam, pesquisem e naveguem pelos artigos, e criar a jornada de conversão para a plataforma de cursos.

Epic 1: Fundação e Gestão de Conteúdo
Epic Goal: Entregar um sistema de gestão de conteúdo (CMS) funcional e integrado ao painel da Stelarow, permitindo que a equipe interna crie, edite e organize todos os artigos do blog de forma eficiente e estruturada, preparando o terreno para o lançamento público.

Story 1.1: Configuração do Schema do Blog no Supabase
As a administradora da plataforma,
I want que as tabelas necessárias para o blog (artigos, categorias, tags, etc.) sejam criadas na base de dados do Supabase,
so that possamos armazenar e gerir o conteúdo de forma estruturada.

Acceptance Criteria:

Uma tabela posts é criada com colunas para id, title, slug, content (formato texto/markdown), author_id (FK para users), status (ex: draft, published), published_at, main_image_url, seo_title, seo_description.

Uma tabela categories é criada com colunas para id, name, slug.

Uma tabela tags é criada com colunas para id, name, slug.

Tabelas de junção (posts_categories, posts_tags) são criadas para gerir as relações muitos-para-muitos.

As políticas de Row Level Security (RLS) do Supabase são configuradas para permitir que apenas utilizadores autenticados com o papel admin ou instructor possam escrever (insert, update, delete) nas tabelas, mas todos possam ler (select) os artigos publicados.

Story 1.2: Interface de Criação e Edição de Artigos
As a autora de conteúdo,
I want uma interface intuitiva no painel da Stelarow para criar e editar artigos de blog,
so that eu possa produzir conteúdo de forma eficiente.

Acceptance Criteria:

Existe uma nova secção "Blog" no painel de administração da Stelarow.

Nessa secção, existe um formulário para criar um novo artigo que contém campos para Título, Conteúdo (usando um editor Markdown), Slug (auto-gerado a partir do título, mas editável), Título de SEO e Descrição de SEO.

O formulário permite associar o artigo a uma ou mais Categorias e Tags existentes.

É possível salvar um artigo como draft (rascunho) ou published (publicado).

Ao editar um artigo existente, todos os campos são pré-preenchidos com os dados atuais.

Story 1.3: Gestão de Mídia
As a autora de conteúdo,
I want poder fazer o upload de uma imagem de destaque para o artigo e inserir imagens no corpo do texto,
so that meus artigos sejam visualmente atraentes.

Acceptance Criteria:

No formulário de edição de artigo, existe um campo para fazer o upload de uma imagem principal (main_image).

As imagens são enviadas para um bucket específico do blog no Supabase Storage.

A interface do editor Markdown fornece uma maneira de fazer o upload de uma imagem e inserir o URL correspondente no corpo do texto.

A URL da imagem principal é salva na tabela posts.

Epic 2: Visualização Pública e Jornada do Utilizador
Epic Goal: Lançar a face pública do blog, garantindo que os artigos sejam apresentados de forma otimizada para SEO e para a experiência do leitor em todos os dispositivos. O objetivo final é criar uma jornada fluida que transforme leitores em leads qualificados para os cursos da Stelarow.

Story 2.1: Página de Visualização do Artigo
As a visitante do site,
I want ler um artigo de blog numa página limpa, responsiva e de carregamento rápido,
so that eu possa consumir o conteúdo sem distrações.

Acceptance Criteria:

Acessar uma URL como /blog/[slug] exibe o artigo correspondente.

A página exibe o título do artigo, a imagem de destaque, o nome do autor, a data de publicação e o conteúdo formatado em Markdown.

A página é renderizada no servidor (SSR/SSG) para otimização de SEO e performance.

As meta tags de SEO (título e descrição) são preenchidas dinamicamente com os dados do artigo.

A página é totalmente responsiva e legível em dispositivos móveis, tablets e desktops.

Story 2.2: Listagem de Artigos e Navegação
As a visitante do site,
I want ver uma lista de todos os artigos publicados e navegar por eles,
so that eu possa descobrir novos conteúdos de interesse.

Acceptance Criteria:

Uma página /blog exibe uma lista paginada de todos os artigos publicados, ordenados do mais recente para o mais antigo.

Cada item na lista mostra a imagem de destaque, o título, um breve resumo e a categoria principal do artigo.

Clicar num item da lista leva para a página de visualização completa do artigo (Story 2.1).

Existem páginas de listagem para cada categoria (ex: /blog/categoria/[slug]) e tag (ex: /blog/tag/[slug]) que exibem os artigos correspondentes.

Story 2.3: Funcionalidade de Pesquisa Interna
As a visitante do site,
I want poder pesquisar por palavras-chave no blog,
so that eu encontre rapidamente artigos sobre os tópicos que me interessam.

Acceptance Criteria:

Existe um campo de busca visível no layout do blog.

Ao submeter uma pesquisa, o sistema retorna uma página de resultados com uma lista de artigos cujo título ou conteúdo corresponda ao termo pesquisado.

Se nenhum resultado for encontrado, uma mensagem informativa é exibida.

A funcionalidade de pesquisa é implementada utilizando os recursos do Supabase (ex: Full-Text Search).

Story 2.4: Integração de CTAs (Call-to-Actions)
As a administradora de marketing,
I want que os artigos do blog contenham CTAs contextuais que direcionem os leitores para os cursos relevantes,
so that possamos converter o tráfego do blog em leads para a plataforma.

Acceptance Criteria:

Ao final de cada artigo, um componente de CTA é exibido.

O CTA pode ser configurado no painel de autoria para apontar para um curso específico da plataforma Stelarow.

O componente de CTA exibe o nome do curso, uma breve descrição e um link direto para a página do curso.

Se nenhum CTA específico for definido, um CTA genérico para a página principal de cursos é exibido.

6. Checklist Results Report
Este relatório será preenchido pelo agente PM após a execução da tarefa execute-checklist com o pm-checklist para validar a completude e qualidade deste PRD.

7. Next Steps
UX Expert Prompt
"A primeira versão do PRD para o Blog Integrado está completa. Por favor, revise as seções User Interface Design Goals e Epic Details para criar o UI/UX Specification (front-end-spec-tmpl). O foco é garantir que a experiência do utilizador seja coesa com a plataforma existente e otimizada para leitura e conversão."

Architect Prompt
"O PRD para o Blog Integrado está definido. Por favor, utilize este documento como base para criar o Fullstack Architecture Document (fullstack-architecture-tmpl). O desafio principal é garantir uma integração perfeita e segura com a infraestrutura e o monorepo existentes da Stelarow, conforme detalhado nas seções Technical Assumptions e Requirements."