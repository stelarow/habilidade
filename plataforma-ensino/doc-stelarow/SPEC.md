# ESPECIFICAÇÃO GHERKIN - BLOG INTEGRADO STELAROW

## Funcionalidade: Sistema de Gerenciamento de Blog Integrado
**Contexto**: Como parte da plataforma educacional Stelarow, precisamos de um blog nativo integrado para aumentar o tráfego orgânico qualificado, gerar leads educativos e melhorar a autoridade de domínio. O blog deve ser construído com Next.js 14, TypeScript e Supabase, compartilhando a arquitetura e componentes da plataforma principal.

---

## EPIC 1: FUNDAÇÃO E GESTÃO DE CONTEÚDO

### Funcionalidade: Configuração do Schema do Blog no Supabase
**Contexto**: Estabelecer a estrutura de dados necessária para armazenar e gerenciar todo o conteúdo do blog de forma organizada e segura.

**Cenário**: Criação das tabelas principais do blog
* **Dado** que sou um administrador da plataforma
* **Quando** acesso a base de dados do Supabase
* **Então** devo encontrar uma tabela "posts" com colunas id, title, slug, content, author_id, status, published_at, main_image_url, seo_title, seo_description
* **E** devo encontrar uma tabela "categories" com colunas id, name, slug
* **E** devo encontrar uma tabela "tags" com colunas id, name, slug
* **E** devo encontrar tabelas de junção "posts_categories" e "posts_tags" para relações muitos-para-muitos

**Cenário**: Configuração de políticas de segurança RLS
* **Dado** que as tabelas do blog foram criadas
* **Quando** configuro as políticas de Row Level Security
* **Então** apenas utilizadores com papel "admin" ou "instructor" devem poder inserir, atualizar ou excluir registros
* **E** todos os utilizadores devem poder ler artigos com status "published"
* **E** apenas autores e administradores devem poder ver artigos com status "draft"

### Funcionalidade: Interface de Criação e Edição de Artigos
**Contexto**: Fornecer uma interface intuitiva para autores de conteúdo criarem e editarem artigos diretamente no painel da plataforma Stelarow.

**Cenário**: Acesso à seção de blog no painel administrativo
* **Dado** que sou um utilizador autenticado com papel "instructor" ou "admin"
* **Quando** acesso o painel de administração da Stelarow
* **Então** devo ver uma nova seção chamada "Blog"
* **E** devo poder navegar para esta seção

**Cenário**: Criação de novo artigo
* **Dado** que estou na seção "Blog" do painel administrativo
* **Quando** clico em "Criar Novo Artigo"
* **Então** devo ver um formulário com campos para Título, Conteúdo (editor Markdown), Slug, Título de SEO e Descrição de SEO
* **E** devo poder associar o artigo a categorias e tags existentes
* **E** devo poder salvar como "draft" ou "published"
* **E** o slug deve ser auto-gerado a partir do título, mas editável

**Cenário**: Edição de artigo existente
* **Dado** que existe um artigo no sistema
* **Quando** clico em "Editar" no artigo
* **Então** o formulário deve ser pré-preenchido com todos os dados atuais do artigo
* **E** devo poder modificar qualquer campo
* **E** devo poder alterar o status entre "draft" e "published"

**Cenário**: Validação de campos obrigatórios
* **Dado** que estou criando ou editando um artigo
* **Quando** tento salvar sem preencher o campo "Título"
* **Então** devo ver uma mensagem de erro indicando que o título é obrigatório
* **E** o artigo não deve ser salvo

### Funcionalidade: Gestão de Mídia
**Contexto**: Permitir upload e inserção de imagens nos artigos para torná-los visualmente atraentes e engajantes.

**Cenário**: Upload de imagem principal do artigo
* **Dado** que estou criando ou editando um artigo
* **Quando** clico no campo de "Imagem Principal"
* **Então** devo poder selecionar e fazer upload de uma imagem
* **E** a imagem deve ser armazenada no bucket específico do blog no Supabase Storage
* **E** a URL da imagem deve ser salva no campo main_image_url da tabela posts

**Cenário**: Inserção de imagens no corpo do texto
* **Dado** que estou editando o conteúdo de um artigo no editor Markdown
* **Quando** uso a funcionalidade de inserir imagem
* **Então** devo poder fazer upload de uma imagem
* **E** a URL da imagem deve ser automaticamente inserida no formato Markdown no conteúdo
* **E** a imagem deve ser visível na prévia do editor

**Cenário**: Validação de tipos de arquivo
* **Dado** que estou fazendo upload de uma imagem
* **Quando** seleciono um arquivo que não é uma imagem válida (jpg, png, gif, webp)
* **Então** devo ver uma mensagem de erro
* **E** o upload não deve ser processado

---

## EPIC 2: VISUALIZAÇÃO PÚBLICA E JORNADA DO UTILIZADOR

### Funcionalidade: Página de Visualização do Artigo
**Contexto**: Apresentar os artigos de forma otimizada para SEO e experiência do leitor em todos os dispositivos.

**Cenário**: Visualização de artigo publicado
* **Dado** que existe um artigo com status "published"
* **Quando** acesso a URL "/blog/[slug]" do artigo
* **Então** devo ver o título do artigo, imagem de destaque, nome do autor, data de publicação e conteúdo formatado
* **E** a página deve ser renderizada no servidor (SSR/SSG) para otimização de SEO
* **E** as meta tags de SEO devem ser preenchidas dinamicamente com os dados do artigo

**Cenário**: Responsividade da página do artigo
* **Dado** que estou visualizando um artigo
* **Quando** acesso a página em dispositivos móveis, tablets ou desktop
* **Então** o layout deve se adaptar perfeitamente a cada tamanho de tela
* **E** o conteúdo deve permanecer legível e bem formatado
* **E** as imagens devem se redimensionar adequadamente

**Cenário**: Tentativa de acesso a artigo não publicado
* **Dado** que existe um artigo com status "draft"
* **Quando** um visitante não autenticado tenta acessar "/blog/[slug]" deste artigo
* **Então** deve retornar erro 404 (página não encontrada)
* **E** o artigo não deve ser indexado pelos motores de busca

### Funcionalidade: Listagem de Artigos e Navegação
**Contexto**: Permitir que visitantes descubram e naveguem pelo conteúdo do blog de forma intuitiva.

**Cenário**: Página principal do blog
* **Dado** que existem artigos publicados no sistema
* **Quando** acesso "/blog"
* **Então** devo ver uma lista paginada de artigos ordenados do mais recente para o mais antigo
* **E** cada item deve mostrar imagem de destaque, título, breve resumo e categoria principal
* **E** clicar em um item deve levar para a página completa do artigo

**Cenário**: Listagem por categoria
* **Dado** que existem artigos associados a uma categoria específica
* **Quando** acesso "/blog/categoria/[slug]"
* **Então** devo ver apenas artigos desta categoria
* **E** o título da página deve indicar claramente a categoria
* **E** deve haver breadcrumbs mostrando "Blog > [Nome da Categoria]"

**Cenário**: Listagem por tag
* **Dado** que existem artigos associados a uma tag específica
* **Quando** acesso "/blog/tag/[slug]"
* **Então** devo ver apenas artigos com esta tag
* **E** o título da página deve indicar claramente a tag
* **E** deve haver breadcrumbs mostrando "Blog > Tag: [Nome da Tag]"

**Cenário**: Paginação da listagem
* **Dado** que existem mais de 10 artigos publicados
* **Quando** acesso a página de listagem do blog
* **Então** devo ver apenas os 10 primeiros artigos
* **E** devo ver controles de paginação na parte inferior
* **E** devo poder navegar para próximas páginas

### Funcionalidade: Funcionalidade de Pesquisa Interna
**Contexto**: Permitir que visitantes encontrem rapidamente artigos sobre tópicos específicos de seu interesse.

**Cenário**: Pesquisa por palavra-chave
* **Dado** que estou na página do blog
* **Quando** insiro "JavaScript" no campo de busca e submeto
* **Então** devo ver uma página de resultados com artigos cujo título ou conteúdo contenha "JavaScript"
* **E** os resultados devem ser ordenados por relevância
* **E** cada resultado deve destacar onde a palavra-chave foi encontrada

**Cenário**: Pesquisa sem resultados
* **Dado** que estou realizando uma pesquisa
* **Quando** insiro uma palavra-chave que não existe em nenhum artigo
* **Então** devo ver uma mensagem informativa "Nenhum resultado encontrado para sua pesquisa"
* **E** devo ver sugestões de termos populares ou categorias disponíveis

**Cenário**: Pesquisa com termo vazio
* **Dado** que estou no campo de busca
* **Quando** submeto uma pesquisa sem inserir nenhum termo
* **Então** devo ver uma mensagem solicitando que insira um termo de busca
* **E** a pesquisa não deve ser processada

### Funcionalidade: Integração de CTAs (Call-to-Actions)
**Contexto**: Converter tráfego do blog em leads qualificados direcionando leitores para cursos relevantes da plataforma.

**Cenário**: CTA específico no final do artigo
* **Dado** que um artigo foi configurado com um CTA para um curso específico
* **Quando** leio o artigo até o final
* **Então** devo ver um componente de CTA contextual
* **E** o CTA deve exibir nome do curso, breve descrição e link direto para a página do curso
* **E** o design deve ser consistente com a identidade visual da Stelarow

**Cenário**: CTA genérico quando não há CTA específico
* **Dado** que um artigo não possui CTA específico configurado
* **Quando** leio o artigo até o final
* **Então** devo ver um CTA genérico direcionando para a página principal de cursos
* **E** o CTA deve conter uma mensagem como "Explore nossos cursos" com link para "/cursos"

**Cenário**: Configuração de CTA no painel administrativo
* **Dado** que sou um autor editando um artigo
* **Quando** acesso a seção de CTA no formulário de edição
* **Então** devo poder selecionar um curso específico da lista de cursos disponíveis
* **E** devo poder customizar o texto de apresentação do CTA
* **E** devo poder desabilitar o CTA se necessário

---

## REQUISITOS TÉCNICOS E NÃO FUNCIONAIS

### Funcionalidade: Performance e Otimização
**Contexto**: Garantir que o blog tenha performance excelente para melhorar SEO e experiência do utilizador.

**Cenário**: Tempo de carregamento da página
* **Dado** que tenho uma conexão de banda larga estável
* **Quando** acesso qualquer página de artigo do blog
* **Então** o First Contentful Paint (FCP) deve ser inferior a 2 segundos
* **E** a página deve estar totalmente carregada em menos de 3 segundos

**Cenário**: Otimização para motores de busca
* **Dado** que publico um novo artigo
* **Quando** os motores de busca indexam o conteúdo
* **Então** as meta tags personalizadas devem ser detectadas corretamente
* **E** o schema markup deve estar implementado para rich snippets
* **E** as URLs devem ser SEO-friendly com slugs limpos

### Funcionalidade: Autenticação e Autorização Integrada
**Contexto**: Utilizar o mesmo sistema de autenticação da plataforma Stelarow para acesso ao painel de administração do blog.

**Cenário**: Acesso ao painel com sessão válida
* **Dado** que estou logado na plataforma Stelarow como "instructor"
* **Quando** navego para a seção Blog
* **Então** devo ter acesso total às funcionalidades de criação e edição
* **E** não devo precisar fazer login novamente

**Cenário**: Tentativa de acesso não autorizado
* **Dado** que sou um utilizador com papel "student"
* **Quando** tento acessar a seção Blog do painel administrativo
* **Então** devo ver uma mensagem de "Acesso Negado"
* **E** devo ser redirecionado para uma página apropriada

**Cenário**: Sessão expirada
* **Dado** que minha sessão de login expirou
* **Quando** tento realizar qualquer ação no painel do blog
* **Então** devo ser redirecionado para a página de login
* **E** após fazer login, devo retornar à página onde estava trabalhando

### Funcionalidade: Integração com Monorepo e Arquitetura
**Contexto**: Garantir que o blog seja perfeitamente integrado à arquitetura existente da plataforma Stelarow.

**Cenário**: Compartilhamento de componentes
* **Dado** que o blog está integrado ao monorepo
* **Quando** desenvolvo interfaces do blog
* **Então** devo poder reutilizar componentes existentes da plataforma (botões, cards, inputs)
* **E** o design system deve ser consistente entre blog e plataforma
* **E** as cores, tipografia e estilos devem ser idênticos

**Cenário**: Versionamento e deploy
* **Dado** que faço alterações no código do blog
* **Quando** faço commit no repositório
* **Então** as alterações devem ser deployadas junto com o resto da plataforma
* **E** o processo de CI/CD deve incluir testes específicos do blog
* **E** o blog deve manter a mesma versão da plataforma principal