# Epic List

Epic 1: Fundação e Gestão de Conteúdo: Estabelecer a estrutura da base de dados, a interface de autoria e as funcionalidades básicas de gestão de conteúdo para que os administradores e instrutores possam criar e organizar os artigos.

Epic 2: Visualização Pública e Jornada do Utilizador: Construir a parte pública do blog, permitindo que os visitantes leiam, pesquisem e naveguem pelos artigos, e criar a jornada de conversão para a plataforma de cursos.

## Epic 1: Fundação e Gestão de Conteúdo
Epic Goal: Entregar um sistema de gestão de conteúdo (CMS) funcional e integrado ao painel da Stelarow, permitindo que a equipe interna crie, edite e organize todos os artigos do blog de forma eficiente e estruturada, preparando o terreno para o lançamento público.

### Story 1.1: Configuração do Schema do Blog no Supabase
As a administradora da plataforma,
I want que as tabelas necessárias para o blog (artigos, categorias, tags, etc.) sejam criadas na base de dados do Supabase,
so that possamos armazenar e gerir o conteúdo de forma estruturada.

Acceptance Criteria:

Uma tabela posts é criada com colunas para id, title, slug, content (formato texto/markdown), author_id (FK para users), status (ex: draft, published), published_at, main_image_url, seo_title, seo_description.

Uma tabela categories é criada com colunas para id, name, slug.

Uma tabela tags é criada com colunas para id, name, slug.

Tabelas de junção (posts_categories, posts_tags) são criadas para gerir as relações muitos-para-muitos.

As políticas de Row Level Security (RLS) do Supabase são configuradas para permitir que apenas utilizadores autenticados com o papel admin ou instructor possam escrever (insert, update, delete) nas tabelas, mas todos possam ler (select) os artigos publicados.

### Story 1.2: Interface de Criação e Edição de Artigos
As a autora de conteúdo,
I want uma interface intuitiva no painel da Stelarow para criar e editar artigos de blog,
so that eu possa produzir conteúdo de forma eficiente.

Acceptance Criteria:

Existe uma nova secção "Blog" no painel de administração da Stelarow.

Nessa secção, existe um formulário para criar um novo artigo que contém campos para Título, Conteúdo (usando um editor Markdown), Slug (auto-gerado a partir do título, mas editável), Título de SEO e Descrição de SEO.

O formulário permite associar o artigo a uma ou mais Categorias e Tags existentes.

É possível salvar um artigo como draft (rascunho) ou published (publicado).

Ao editar um artigo existente, todos os campos são pré-preenchidos com os dados atuais.

### Story 1.3: Gestão de Mídia
As a autora de conteúdo,
I want poder fazer o upload de uma imagem de destaque para o artigo e inserir imagens no corpo do texto,
so that meus artigos sejam visualmente atraentes.

Acceptance Criteria:

No formulário de edição de artigo, existe um campo para fazer o upload de uma imagem principal (main_image).

As imagens são enviadas para um bucket específico do blog no Supabase Storage.

A interface do editor Markdown fornece uma maneira de fazer o upload de uma imagem e inserir o URL correspondente no corpo do texto.

A URL da imagem principal é salva na tabela posts.

## Epic 2: Visualização Pública e Jornada do Utilizador
Epic Goal: Lançar a face pública do blog, garantindo que os artigos sejam apresentados de forma otimizada para SEO e para a experiência do leitor em todos os dispositivos. O objetivo final é criar uma jornada fluída que transforme leitores em leads qualificados para os cursos da Stelarow.

### Story 2.1: Página de Visualização do Artigo
As a visitante do site,
I want ler um artigo de blog numa página limpa, responsiva e de carregamento rápido,
so that eu possa consumir o conteúdo sem distrações.

Acceptance Criteria:

Acessar uma URL como /blog/[slug] exibe o artigo correspondente.

A página exibe o título do artigo, a imagem de destaque, o nome do autor, a data de publicação e o conteúdo formatado em Markdown.

A página é renderizada no servidor (SSR/SSG) para otimização de SEO e performance.

As meta tags de SEO (título e descrição) são preenchidas dinamicamente com os dados do artigo.

A página é totalmente responsiva e legível em dispositivos móveis, tablets e desktops.

### Story 2.2: Listagem de Artigos e Navegação
As a visitante do site,
I want ver uma lista de todos os artigos publicados e navegar por eles,
so that eu possa descobrir novos conteúdos de interesse.

Acceptance Criteria:

Uma página /blog exibe uma lista paginada de todos os artigos publicados, ordenados do mais recente para o mais antigo.

Cada item na lista mostra a imagem de destaque, o título, um breve resumo e a categoria principal do artigo.

Clicar num item da lista leva para a página de visualização completa do artigo (Story 2.1).

Existem páginas de listagem para cada categoria (ex: /blog/categoria/[slug]) e tag (ex: /blog/tag/[slug]) que exibem os artigos correspondentes.

### Story 2.3: Funcionalidade de Pesquisa Interna
As a visitante do site,
I want poder pesquisar por palavras-chave no blog,
so that eu encontre rapidamente artigos sobre os tópicos que me interessam.

Acceptance Criteria:

Existe um campo de busca visível no layout do blog.

Ao submeter uma pesquisa, o sistema retorna uma página de resultados com uma lista de artigos cujo título ou conteúdo corresponda ao termo pesquisado.

Se nenhum resultado for encontrado, uma mensagem informativa é exibida.

A funcionalidade de pesquisa é implementada utilizando os recursos do Supabase (ex: Full-Text Search).

### Story 2.4: Integração de CTAs (Call-to-Actions)
As a administradora de marketing,
I want que os artigos do blog contenham CTAs contextuais que direcionem os leitores para os cursos relevantes,
so that possamos converter o tráfego do blog em leads para a plataforma.

Acceptance Criteria:

Ao final de cada artigo, um componente de CTA é exibido.

O CTA pode ser configurado no painel de autoria para apontar para um curso específico da plataforma Stelarow.

O componente de CTA exibe o nome do curso, uma breve descrição e um link direto para a página do curso.

Se nenhum CTA específico for definido, um CTA genérico para a página principal de cursos é exibido.