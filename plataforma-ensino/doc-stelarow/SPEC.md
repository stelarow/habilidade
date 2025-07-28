# ESPECIFICA��O GHERKIN - BLOG INTEGRADO STELAROW

## Funcionalidade: Sistema de Gerenciamento de Blog Integrado
**Contexto**: Como parte da plataforma educacional Stelarow, precisamos de um blog nativo integrado para aumentar o tr�fego org�nico qualificado, gerar leads educativos e melhorar a autoridade de dom�nio. O blog deve ser constru�do com Next.js 14, TypeScript e Supabase, compartilhando a arquitetura e componentes da plataforma principal.

---

## EPIC 1: FUNDA��O E GEST�O DE CONTE�DO

### Funcionalidade: Configura��o do Schema do Blog no Supabase
**Contexto**: Estabelecer a estrutura de dados necess�ria para armazenar e gerenciar todo o conte�do do blog de forma organizada e segura.

**Cen�rio**: Cria��o das tabelas principais do blog
* **Dado** que sou um administrador da plataforma
* **Quando** acesso a base de dados do Supabase
* **Ent�o** devo encontrar uma tabela "posts" com colunas id, title, slug, content, author_id, status, published_at, main_image_url, seo_title, seo_description
* **E** devo encontrar uma tabela "categories" com colunas id, name, slug
* **E** devo encontrar uma tabela "tags" com colunas id, name, slug
* **E** devo encontrar tabelas de jun��o "posts_categories" e "posts_tags" para rela��es muitos-para-muitos

**Cen�rio**: Configura��o de pol�ticas de seguran�a RLS
* **Dado** que as tabelas do blog foram criadas
* **Quando** configuro as pol�ticas de Row Level Security
* **Ent�o** apenas utilizadores com papel "admin" ou "instructor" devem poder inserir, atualizar ou excluir registros
* **E** todos os utilizadores devem poder ler artigos com status "published"
* **E** apenas autores e administradores devem poder ver artigos com status "draft"

### Funcionalidade: Interface de Cria��o e Edi��o de Artigos
**Contexto**: Fornecer uma interface intuitiva para autores de conte�do criarem e editarem artigos diretamente no painel da plataforma Stelarow.

**Cen�rio**: Acesso � se��o de blog no painel administrativo
* **Dado** que sou um utilizador autenticado com papel "instructor" ou "admin"
* **Quando** acesso o painel de administra��o da Stelarow
* **Ent�o** devo ver uma nova se��o chamada "Blog"
* **E** devo poder navegar para esta se��o

**Cen�rio**: Cria��o de novo artigo
* **Dado** que estou na se��o "Blog" do painel administrativo
* **Quando** clico em "Criar Novo Artigo"
* **Ent�o** devo ver um formul�rio com campos para T�tulo, Conte�do (editor Markdown), Slug, T�tulo de SEO e Descri��o de SEO
* **E** devo poder associar o artigo a categorias e tags existentes
* **E** devo poder salvar como "draft" ou "published"
* **E** o slug deve ser auto-gerado a partir do t�tulo, mas edit�vel

**Cen�rio**: Edi��o de artigo existente
* **Dado** que existe um artigo no sistema
* **Quando** clico em "Editar" no artigo
* **Ent�o** o formul�rio deve ser pr�-preenchido com todos os dados atuais do artigo
* **E** devo poder modificar qualquer campo
* **E** devo poder alterar o status entre "draft" e "published"

**Cen�rio**: Valida��o de campos obrigat�rios
* **Dado** que estou criando ou editando um artigo
* **Quando** tento salvar sem preencher o campo "T�tulo"
* **Ent�o** devo ver uma mensagem de erro indicando que o t�tulo � obrigat�rio
* **E** o artigo n�o deve ser salvo

### Funcionalidade: Gest�o de M�dia
**Contexto**: Permitir upload e inser��o de imagens nos artigos para torn�-los visualmente atraentes e engajantes.

**Cen�rio**: Upload de imagem principal do artigo
* **Dado** que estou criando ou editando um artigo
* **Quando** clico no campo de "Imagem Principal"
* **Ent�o** devo poder selecionar e fazer upload de uma imagem
* **E** a imagem deve ser armazenada no bucket espec�fico do blog no Supabase Storage
* **E** a URL da imagem deve ser salva no campo main_image_url da tabela posts

**Cen�rio**: Inser��o de imagens no corpo do texto
* **Dado** que estou editando o conte�do de um artigo no editor Markdown
* **Quando** uso a funcionalidade de inserir imagem
* **Ent�o** devo poder fazer upload de uma imagem
* **E** a URL da imagem deve ser automaticamente inserida no formato Markdown no conte�do
* **E** a imagem deve ser vis�vel na pr�via do editor

**Cen�rio**: Valida��o de tipos de arquivo
* **Dado** que estou fazendo upload de uma imagem
* **Quando** seleciono um arquivo que n�o � uma imagem v�lida (jpg, png, gif, webp)
* **Ent�o** devo ver uma mensagem de erro
* **E** o upload n�o deve ser processado

---

## EPIC 2: VISUALIZA��O P�BLICA E JORNADA DO UTILIZADOR

### Funcionalidade: P�gina de Visualiza��o do Artigo
**Contexto**: Apresentar os artigos de forma otimizada para SEO e experi�ncia do leitor em todos os dispositivos.

**Cen�rio**: Visualiza��o de artigo publicado
* **Dado** que existe um artigo com status "published"
* **Quando** acesso a URL "/blog/[slug]" do artigo
* **Ent�o** devo ver o t�tulo do artigo, imagem de destaque, nome do autor, data de publica��o e conte�do formatado
* **E** a p�gina deve ser renderizada no servidor (SSR/SSG) para otimiza��o de SEO
* **E** as meta tags de SEO devem ser preenchidas dinamicamente com os dados do artigo

**Cen�rio**: Responsividade da p�gina do artigo
* **Dado** que estou visualizando um artigo
* **Quando** acesso a p�gina em dispositivos m�veis, tablets ou desktop
* **Ent�o** o layout deve se adaptar perfeitamente a cada tamanho de tela
* **E** o conte�do deve permanecer leg�vel e bem formatado
* **E** as imagens devem se redimensionar adequadamente

**Cen�rio**: Tentativa de acesso a artigo n�o publicado
* **Dado** que existe um artigo com status "draft"
* **Quando** um visitante n�o autenticado tenta acessar "/blog/[slug]" deste artigo
* **Ent�o** deve retornar erro 404 (p�gina n�o encontrada)
* **E** o artigo n�o deve ser indexado pelos motores de busca

### Funcionalidade: Listagem de Artigos e Navega��o
**Contexto**: Permitir que visitantes descubram e naveguem pelo conte�do do blog de forma intuitiva.

**Cen�rio**: P�gina principal do blog
* **Dado** que existem artigos publicados no sistema
* **Quando** acesso "/blog"
* **Ent�o** devo ver uma lista paginada de artigos ordenados do mais recente para o mais antigo
* **E** cada item deve mostrar imagem de destaque, t�tulo, breve resumo e categoria principal
* **E** clicar em um item deve levar para a p�gina completa do artigo

**Cen�rio**: Listagem por categoria
* **Dado** que existem artigos associados a uma categoria espec�fica
* **Quando** acesso "/blog/categoria/[slug]"
* **Ent�o** devo ver apenas artigos desta categoria
* **E** o t�tulo da p�gina deve indicar claramente a categoria
* **E** deve haver breadcrumbs mostrando "Blog > [Nome da Categoria]"

**Cen�rio**: Listagem por tag
* **Dado** que existem artigos associados a uma tag espec�fica
* **Quando** acesso "/blog/tag/[slug]"
* **Ent�o** devo ver apenas artigos com esta tag
* **E** o t�tulo da p�gina deve indicar claramente a tag
* **E** deve haver breadcrumbs mostrando "Blog > Tag: [Nome da Tag]"

**Cen�rio**: Pagina��o da listagem
* **Dado** que existem mais de 10 artigos publicados
* **Quando** acesso a p�gina de listagem do blog
* **Ent�o** devo ver apenas os 10 primeiros artigos
* **E** devo ver controles de pagina��o na parte inferior
* **E** devo poder navegar para pr�ximas p�ginas

### Funcionalidade: Funcionalidade de Pesquisa Interna
**Contexto**: Permitir que visitantes encontrem rapidamente artigos sobre t�picos espec�ficos de seu interesse.

**Cen�rio**: Pesquisa por palavra-chave
* **Dado** que estou na p�gina do blog
* **Quando** insiro "JavaScript" no campo de busca e submeto
* **Ent�o** devo ver uma p�gina de resultados com artigos cujo t�tulo ou conte�do contenha "JavaScript"
* **E** os resultados devem ser ordenados por relev�ncia
* **E** cada resultado deve destacar onde a palavra-chave foi encontrada

**Cen�rio**: Pesquisa sem resultados
* **Dado** que estou realizando uma pesquisa
* **Quando** insiro uma palavra-chave que n�o existe em nenhum artigo
* **Ent�o** devo ver uma mensagem informativa "Nenhum resultado encontrado para sua pesquisa"
* **E** devo ver sugest�es de termos populares ou categorias dispon�veis

**Cen�rio**: Pesquisa com termo vazio
* **Dado** que estou no campo de busca
* **Quando** submeto uma pesquisa sem inserir nenhum termo
* **Ent�o** devo ver uma mensagem solicitando que insira um termo de busca
* **E** a pesquisa n�o deve ser processada

### Funcionalidade: Integra��o de CTAs (Call-to-Actions)
**Contexto**: Converter tr�fego do blog em leads qualificados direcionando leitores para cursos relevantes da plataforma.

**Cen�rio**: CTA espec�fico no final do artigo
* **Dado** que um artigo foi configurado com um CTA para um curso espec�fico
* **Quando** leio o artigo at� o final
* **Ent�o** devo ver um componente de CTA contextual
* **E** o CTA deve exibir nome do curso, breve descri��o e link direto para a p�gina do curso
* **E** o design deve ser consistente com a identidade visual da Stelarow

**Cen�rio**: CTA gen�rico quando n�o h� CTA espec�fico
* **Dado** que um artigo n�o possui CTA espec�fico configurado
* **Quando** leio o artigo at� o final
* **Ent�o** devo ver um CTA gen�rico direcionando para a p�gina principal de cursos
* **E** o CTA deve conter uma mensagem como "Explore nossos cursos" com link para "/cursos"

**Cen�rio**: Configura��o de CTA no painel administrativo
* **Dado** que sou um autor editando um artigo
* **Quando** acesso a se��o de CTA no formul�rio de edi��o
* **Ent�o** devo poder selecionar um curso espec�fico da lista de cursos dispon�veis
* **E** devo poder customizar o texto de apresenta��o do CTA
* **E** devo poder desabilitar o CTA se necess�rio

---

## REQUISITOS T�CNICOS E N�O FUNCIONAIS

### Funcionalidade: Performance e Otimiza��o
**Contexto**: Garantir que o blog tenha performance excelente para melhorar SEO e experi�ncia do utilizador.

**Cen�rio**: Tempo de carregamento da p�gina
* **Dado** que tenho uma conex�o de banda larga est�vel
* **Quando** acesso qualquer p�gina de artigo do blog
* **Ent�o** o First Contentful Paint (FCP) deve ser inferior a 2 segundos
* **E** a p�gina deve estar totalmente carregada em menos de 3 segundos

**Cen�rio**: Otimiza��o para motores de busca
* **Dado** que publico um novo artigo
* **Quando** os motores de busca indexam o conte�do
* **Ent�o** as meta tags personalizadas devem ser detectadas corretamente
* **E** o schema markup deve estar implementado para rich snippets
* **E** as URLs devem ser SEO-friendly com slugs limpos

### Funcionalidade: Autentica��o e Autoriza��o Integrada
**Contexto**: Utilizar o mesmo sistema de autentica��o da plataforma Stelarow para acesso ao painel de administra��o do blog.

**Cen�rio**: Acesso ao painel com sess�o v�lida
* **Dado** que estou logado na plataforma Stelarow como "instructor"
* **Quando** navego para a se��o Blog
* **Ent�o** devo ter acesso total �s funcionalidades de cria��o e edi��o
* **E** n�o devo precisar fazer login novamente

**Cen�rio**: Tentativa de acesso n�o autorizado
* **Dado** que sou um utilizador com papel "student"
* **Quando** tento acessar a se��o Blog do painel administrativo
* **Ent�o** devo ver uma mensagem de "Acesso Negado"
* **E** devo ser redirecionado para uma p�gina apropriada

**Cen�rio**: Sess�o expirada
* **Dado** que minha sess�o de login expirou
* **Quando** tento realizar qualquer a��o no painel do blog
* **Ent�o** devo ser redirecionado para a p�gina de login
* **E** ap�s fazer login, devo retornar � p�gina onde estava trabalhando

### Funcionalidade: Integra��o com Monorepo e Arquitetura
**Contexto**: Garantir que o blog seja perfeitamente integrado � arquitetura existente da plataforma Stelarow.

**Cen�rio**: Compartilhamento de componentes
* **Dado** que o blog est� integrado ao monorepo
* **Quando** desenvolvo interfaces do blog
* **Ent�o** devo poder reutilizar componentes existentes da plataforma (bot�es, cards, inputs)
* **E** o design system deve ser consistente entre blog e plataforma
* **E** as cores, tipografia e estilos devem ser id�nticos

**Cen�rio**: Versionamento e deploy
* **Dado** que fa�o altera��es no c�digo do blog
* **Quando** fa�o commit no reposit�rio
* **Ent�o** as altera��es devem ser deployadas junto com o resto da plataforma
* **E** o processo de CI/CD deve incluir testes espec�ficos do blog
* **E** o blog deve manter a mesma vers�o da plataforma principal