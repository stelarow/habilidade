# Guia: Como Adicionar Novos Artigos ao Blog

Este documento descreve o processo para adicionar novos artigos ao blog da Escola Habilidade.

## Arquitetura e Fonte de Dados

Antes de começar, é crucial entender como o blog funciona.

**A fonte de verdade para todos os artigos do blog é um banco de dados Supabase.** O site carrega o conteúdo diretamente do banco de dados, e não de arquivos locais.

Você encontrará um diretório `blog-posts/` no projeto que contém arquivos `.md`. Estes arquivos são considerados **legado** e **não são utilizados** pelo site ao vivo. Não edite ou adicione arquivos a este diretório esperando que eles apareçam no blog.

O processo correto envolve preparar o conteúdo e as imagens localmente e, em seguida, inserir os dados no banco de dados Supabase. Este guia detalha os passos necessários.

## Passo 1: Preparar o Conteúdo do Artigo

A primeira fase é reunir e formatar todo o texto do artigo.

### 1.1. Estrutura Principal

Reúna as seguintes informações:

-   **Título:** O título principal do artigo.
    -   *Exemplo:* `Por que o Enscape é Essencial para Visualização Arquitetônica: 5 Razões Definitivas`
-   **Slug:** A versão do título para o URL. Deve ser em letras minúsculas, com palavras separadas por hífens (`-`).
    -   *Exemplo:* `por-que-enscape-essencial-visualizacao-arquitetonica`
-   **Resumo (Excerpt):** Um parágrafo curto (150-160 caracteres) que resume o artigo. Usado nos cards do blog e para SEO.
    -   *Exemplo:* `A visualização em tempo real está se tornando indispensável para arquitetos. Explore 5 razões pelas quais uma ferramenta como o Enscape pode aprimorar seu fluxo de trabalho, desde a iteração rápida do design até a colaboração com clientes.`
-   **Conteúdo Principal:** O corpo do artigo, formatado em Markdown.
    -   *Exemplo:* (O conteúdo completo do artigo sobre Enscape em formato Markdown)

### 1.2. Metadados para SEO

Prepare também os metadados para otimização de busca:

-   **Título SEO (SEO Title):** Um título otimizado para os motores de busca (geralmente até 60 caracteres).
    -   *Exemplo:* `Enscape para Visualização Arquitetônica | 5 Razões Essenciais`
-   **Descrição SEO (SEO Description):** A meta-descrição que aparecerá nos resultados de busca (150-160 caracteres).
    -   *Exemplo:* `Descubra por que o Enscape é uma ferramenta essencial para a visualização arquitetônica. Melhore seu design, colabore com clientes e crie apresentações incríveis.`

### 1.3. Informações de Contexto

-   **Categoria:** A categoria principal do artigo.
    -   *Exemplo:* `Arquitetura`
-   **Curso para CTA:** O `slug` do curso que será promovido no Call-to-Action (CTA) no final do artigo.
    -   *Exemplo:* `projetista-3d` (assumindo que este seja o curso de SketchUp + Enscape)

## Passo 2: Gerenciar as Imagens

Todas as imagens do artigo devem ser salvas localmente no projeto.

### 2.1. Criar o Diretório

Crie uma nova pasta dentro de `public/images/blog/`. O nome da pasta deve ser o mesmo `slug` que você definiu no Passo 1.

-   *Exemplo:* `public/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/`

### 2.2. Baixar e Otimizar as Imagens

1.  **Baixe** todas as imagens do artigo original.
2.  **Otimize** as imagens para a web para garantir que elas carreguem rapidamente. Ferramentas como TinyPNG ou Squoosh podem ser usadas.
3.  **Renomeie** os arquivos de imagem para nomes descritivos em `kebab-case`. Isso é bom para o SEO.
4.  **Salve** as imagens otimizadas no diretório que você criou.

-   *Exemplo de imagens para o artigo sobre Enscape:*
    -   `public/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/hero-enscape-visualizacao.jpg`
    -   `public/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/interior-cafeteria-render.jpg`
    -   `public/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/spaceport-america-viewport-studio.jpg`

### 2.3. Definir a Imagem de Destaque (Featured Image)

Anote o caminho completo para a imagem principal do artigo. Este caminho será usado no banco de dados.

-   *Exemplo:* `/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/hero-enscape-visualizacao.jpg`

## Passo 3: Inserir os Dados no Banco de Dados

Este é o passo final. Depois de preparar o conteúdo e as imagens, você precisa inserir os dados no banco de dados Supabase.

**Atenção:** Este processo pode exigir acesso direto ao painel do Supabase para executar uma inserção na tabela `blog_posts`.

### 3.1. Preparar o Objeto do Post

Reúna todas as informações dos passos anteriores em um único objeto de dados. Abaixo está um modelo de como os dados devem ser estruturados, usando o artigo do Enscape como exemplo.

```json
{
  "title": "Por que o Enscape é Essencial para Visualização Arquitetônica: 5 Razões Definitivas",
  "slug": "por-que-enscape-essencial-visualizacao-arquitetonica",
  "excerpt": "A visualização em tempo real está se tornando indispensável para arquitetos. Explore 5 razões pelas quais uma ferramenta como o Enscape pode aprimorar seu fluxo de trabalho, desde a iteração rápida do design até a colaboração com clientes.",
  "content": "[O CONTEÚDO COMPLETO DO ARTIGO EM MARKDOWN VAI AQUI]",
  "status": "published",
  "image_url": "/images/blog/por-que-enscape-essencial-visualizacao-arquitetonica/hero-enscape-visualizacao.jpg",
  "seo_title": "Enscape para Visualização Arquitetônica | 5 Razões Essenciais",
  "seo_description": "Descubra por que o Enscape é uma ferramenta essencial para a visualização arquitetônica. Melhore seu design, colabore com clientes e crie apresentações incríveis.",
  "author_id": "UUID_DO_AUTOR_AQUI",
  "category_id": "UUID_DA_CATEGORIA_ARQUITETURA_AQUI",
  "published_at": "YYYY-MM-DDTHH:MM:SSZ"
}
```

### 3.2. IDs Importantes

-   `author_id`: Você precisará obter o UUID do autor (por exemplo, "Escola Habilidade") da tabela `blog_authors` no Supabase.
-   `category_id`: Você precisará obter o UUID da categoria (por exemplo, "Arquitetura") da tabela `blog_categories` no Supabase.
-   `published_at`: Use a data e hora atuais no formato ISO 8601.

### 3.3. Inserção do CTA do Curso

Após inserir o post e obter seu novo `id`, você também precisará criar uma entrada na tabela `blog_course_ctas` para associar o artigo ao curso correto.

```json
{
  "post_id": "UUID_DO_NOVO_POST_AQUI",
  "course_slug": "projetista-3d"
}
```

## Resumo do Processo

1.  **Prepare o texto:** Defina título, slug, resumo, conteúdo e metadados de SEO.
2.  **Prepare as imagens:** Crie a pasta e salve as imagens otimizadas.
3.  **Prepare os dados:** Monte o objeto JSON com todas as informações.
4.  **Execute a inserção:** Adicione os novos registros às tabelas `blog_posts` e `blog_course_ctas` no Supabase.

Seguindo estes passos, o novo artigo será publicado corretamente no blog.
