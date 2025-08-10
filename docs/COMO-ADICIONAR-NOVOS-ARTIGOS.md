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

### ⚠️ **IMPORTANTE - Formatação de Conteúdo**

Para evitar erros de carregamento no frontend, **SEMPRE** siga estas regras ao escrever o conteúdo:

#### ❌ **Caracteres Problemáticos a EVITAR:**
- **Aspas tipográficas curvas**: `'` `'` `"` `"` 
- **Emojis**: `😉` `💡` `🚀` `✅` etc.
- **Travessões especiais**: `—` (em dash)
- **Aspas duplas especiais**: `«` `»`

#### ✅ **Caracteres SEGUROS para usar:**
- **Aspas normais**: `'` `"` (aspas retas)
- **Texto descritivo**: `[DICA]` `[IMPORTANTE]` `[NOTA]`
- **Hífens normais**: `-`
- **Aspas simples**: `'` (aspas retas simples)

#### 🔧 **Exemplo de Correção:**
```markdown
❌ ERRADO:
> 💡 Dica: Use 'aspas especiais' para destacar—isso pode causar erro.

✅ CORRETO:
> [DICA]: Use 'aspas normais' para destacar - isso funciona perfeitamente.
```

#### 📝 **Validação de Conteúdo:**
Antes de inserir no banco, **sempre verifique** se o conteúdo:
1. ✅ Usa apenas aspas retas (`'` `"`)
2. ✅ Não contém emojis
3. ✅ Usa hífens normais (`-`) ao invés de travessões (`—`)
4. ✅ Substitui emojis por texto: `💡 → [DICA]`, `✅ → [OK]`, `❌ → [ERRO]`

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

**IMPORTANTE:** As imagens do blog são armazenadas no Supabase Storage, não no sistema de arquivos local. O diretório `public/images/blog/` é apenas para desenvolvimento local.

### 2.1. Sistema de Armazenamento

O blog utiliza o **Supabase Storage** para servir as imagens:

- **Bucket:** `imagens-blog` (público)
- **URL Base:** `https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/`
- **Formatos aceitos:** JPG, PNG, GIF, WebP
- **Tamanho máximo:** 50MB por arquivo

### 2.2. **CRÍTICO: Extrair TODAS as Imagens do Artigo Original**

**⚠️ ATENÇÃO:** Esta é a parte mais crítica para garantir que o artigo tenha todas as imagens funcionando corretamente.

#### 2.2.1. Identificar Todas as Imagens

**SEMPRE** use o Firecrawl MCP para fazer scraping completo do artigo original:

```javascript
// 1. Scrape completo com markdown + links para identificar imagens
mcp__firecrawl__firecrawl_scrape({
  url: "URL_DO_ARTIGO_ORIGINAL",
  formats: ["markdown", "links"],
  onlyMainContent: true
})
```

**Procure por todas essas possíveis imagens:**
- 🖼️ **Hero image** (imagem principal do artigo)
- 📷 **Imagens de interface** (screenshots de software)
- 🎯 **Imagens explicativas** (diagramas, exemplos)
- 👤 **Foto do autor** (se disponível)
- 📊 **Gráficos e infográficos**
- 🔧 **Capturas de tela de ferramentas**
- 📱 **Imagens de exemplo/resultado**

#### 2.2.2. Extrair URLs de Imagens do Conteúdo Scrapado

Procure por padrões como:
- `![alt text](URL_DA_IMAGEM)`
- `https://blog.site.com/hubfs/...`
- `https://images.site.com/...`
- URLs com extensões `.jpg`, `.png`, `.webp`, `.gif`

**Exemplo de URLs encontradas no artigo Enscape:**
```
https://blog.enscape3d.com/hubfs/Interior%20rendering%20modern%20living%20room.jpg
https://blog.enscape3d.com/hubfs/2022/Blog/Getting%20started%20in%20Enscape%20copy.jpg
https://blog.enscape3d.com/hubfs/2024/Blog/The%20Enscape%20toolbar%20in%20SketchUp.png
https://blog.enscape3d.com/hubfs/2022/Blog/Side%20by%20side%20view%20of%20Enscape%20and%20SketchUp.jpg
```

#### 2.2.3. Preparar Imagens para Upload

1.  **Baixe** todas as imagens identificadas
2.  **Renomeie** com nomes descritivos em `kebab-case` relacionados ao artigo
3.  **Otimize** para web se necessário
4.  **Organize** por função (hero, interface, examples, etc.)

**Exemplo de nomenclatura correta:**
```bash
# Artigo: "Guia Enscape SketchUp"
guia-enscape-sketchup-hero.jpg           # Imagem principal
enscape-getting-started.jpg              # Interface inicial
enscape-toolbar-sketchup.png            # Toolbar
enscape-side-by-side.jpg                 # Comparativo
enscape-help-menu.jpg                    # Menu ajuda
enscape-view-management.jpg              # Gerenciamento
```

### 2.3. Upload para o Supabase Storage

### 2.3. **SCRIPT AUTOMATIZADO para Download e Upload de Imagens**

**⚠️ MÉTODO RECOMENDADO:** Use este script melhorado para automatizar todo o processo:

#### 2.3.1. Script Completo Atualizado

```bash
#!/bin/bash

# Configurações do Supabase
PROJECT_URL="https://vfpdyllwquaturpcifpl.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw"
BUCKET="imagens-blog"
TEMP_DIR="/tmp/blog-images"

# Criar diretório temporário
mkdir -p "$TEMP_DIR"

# Função MELHORADA para fazer upload de imagem
upload_image() {
    local file_path="$1"
    local file_name="$2"
    
    if [ ! -f "$file_path" ]; then
        echo "Arquivo não encontrado: $file_path"
        return 1
    fi
    
    echo "Fazendo upload de: $file_name"
    
    # Detectar tipo de arquivo automaticamente
    file_ext="${file_name##*.}"
    case "$file_ext" in
        jpg|jpeg) content_type="image/jpeg" ;;
        png) content_type="image/png" ;;
        webp) content_type="image/webp" ;;
        gif) content_type="image/gif" ;;
        *) content_type="image/jpeg" ;;
    esac
    
    response=$(curl -s -X POST \
        "$PROJECT_URL/storage/v1/object/$BUCKET/$file_name" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: $content_type" \
        --data-binary "@$file_path")
    
    if echo "$response" | grep -q '"error"'; then
        if echo "$response" | grep -q "409"; then
            echo "Arquivo já existe: $file_name"
            return 0
        else
            echo "Erro no upload: $response"
            return 1
        fi
    else
        echo "Upload realizado com sucesso: $file_name"
        return 0
    fi
}

# Baixar e fazer upload de TODAS as imagens encontradas
# SUBSTITUA as URLs pelas imagens reais encontradas no seu artigo

echo "=== Baixando imagem principal (hero) ==="
curl -L "URL_DA_HERO_IMAGE" -o "$TEMP_DIR/seu-artigo-hero.jpg"
upload_image "$TEMP_DIR/seu-artigo-hero.jpg" "seu-artigo-hero.jpg"

echo "=== Baixando demais imagens ==="
# Adicione todas as imagens encontradas no scraping
curl -L "URL_IMAGEM_2" -o "$TEMP_DIR/nome-descritivo-2.jpg"
upload_image "$TEMP_DIR/nome-descritivo-2.jpg" "nome-descritivo-2.jpg"

# Continue para todas as imagens...

echo "============================"
echo "Download e upload de imagens completos!"
echo "============================"
```

#### 2.3.2. Exemplo Prático Real - Artigo Enscape

**Script usado para o artigo "Guia Enscape SketchUp":**

```bash
#!/bin/bash
# Script real usado com sucesso

PROJECT_URL="https://vfpdyllwquaturpcifpl.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw"
BUCKET="imagens-blog"
TEMP_DIR="/tmp/enscape-images-fix"

# Hero image (CRÍTICA - sempre verifique se é a correta)
curl -L "https://blog.enscape3d.com/hubfs/Interior%20rendering%20modern%20living%20room.jpg" \
     -o "$TEMP_DIR/enscape-sketchup-hero.jpg"
upload_image "$TEMP_DIR/enscape-sketchup-hero.jpg" "enscape-sketchup-hero.jpg"

# Todas as demais imagens do artigo
curl -L "https://blog.enscape3d.com/hubfs/2022/Blog/Getting%20started%20in%20Enscape%20copy.jpg" \
     -o "$TEMP_DIR/enscape-getting-started.jpg"
upload_image "$TEMP_DIR/enscape-getting-started.jpg" "enscape-getting-started.jpg"

curl -L "https://blog.enscape3d.com/hubfs/2024/Blog/The%20Enscape%20toolbar%20in%20SketchUp.png" \
     -o "$TEMP_DIR/enscape-toolbar-sketchup.png"
upload_image "$TEMP_DIR/enscape-toolbar-sketchup.png" "enscape-toolbar-sketchup.png"

curl -L "https://blog.enscape3d.com/hubfs/2022/Blog/Side%20by%20side%20view%20of%20Enscape%20and%20SketchUp.jpg" \
     -o "$TEMP_DIR/enscape-side-by-side.jpg"
upload_image "$TEMP_DIR/enscape-side-by-side.jpg" "enscape-side-by-side.jpg"

curl -L "https://blog.enscape3d.com/hubfs/2022/Blog/Help%20menu%20in%20Enscape.jpg" \
     -o "$TEMP_DIR/enscape-help-menu.jpg"
upload_image "$TEMP_DIR/enscape-help-menu.jpg" "enscape-help-menu.jpg"

curl -L "https://blog.enscape3d.com/hubfs/2022/Blog/View%20management%20and%20creating%20views%20in%20Enscape.jpg" \
     -o "$TEMP_DIR/enscape-view-management.jpg"
upload_image "$TEMP_DIR/enscape-view-management.jpg" "enscape-view-management.jpg"

# Foto da autora (se disponível)
curl -L "https://blog.enscape3d.com/hubfs/2024/Blog/Gemma%20Headshot.jpg" \
     -o "$TEMP_DIR/gemma-da-silva.jpg"
upload_image "$TEMP_DIR/gemma-da-silva.jpg" "gemma-da-silva.jpg"
```

### 2.4. **CRÍTICO: Atualizar o Conteúdo do Artigo com as Imagens**

**⚠️ NÃO ESQUEÇA:** Depois de fazer upload de todas as imagens, você DEVE atualizar o conteúdo do artigo no banco de dados para referenciar as imagens corretas.

#### 2.4.1. Formato Correto das URLs de Imagem

**SEMPRE** use URLs completas do Supabase Storage no conteúdo Markdown:

```markdown
![Descrição da imagem](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/nome-da-imagem.jpg)
```

**Exemplo real do artigo Enscape:**
```markdown
![Renderização interior moderna com Enscape e SketchUp](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/enscape-sketchup-hero.jpg)

![Primeiros passos no Enscape](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/enscape-getting-started.jpg)

![Barra de ferramentas do Enscape no SketchUp](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/enscape-toolbar-sketchup.png)
```

#### 2.4.2. Atualizar Hero Image no Banco

**IMPORTANTE:** O campo `image_url` na tabela `blog_posts` deve conter APENAS o nome do arquivo (não a URL completa):

```sql
UPDATE blog_posts SET 
image_url = 'nome-da-hero-image.jpg',  -- SÓ O NOME DO ARQUIVO
content = 'CONTEUDO_ATUALIZADO_COM_TODAS_AS_IMAGENS'
WHERE slug = 'seu-artigo-slug';
```
```

**Método Manual (Painel Supabase):**

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Navegue para **Storage > imagens-blog**
3. Clique em **Upload** e selecione as imagens
4. Nomeie os arquivos seguindo o padrão: `[slug-do-artigo]-[descricao].jpg`

**Exemplos de nomenclatura:**
- `guia-enscape-sketchup-hero.jpg`
- `guia-enscape-interface-sketchup.jpg`
- `guia-enscape-renderizacao-tempo-real.jpg`
- `guia-enscape-editor-materiais.jpg`

### 2.4. Referenciando Imagens no Artigo

No conteúdo Markdown do artigo, use o formato completo da URL do Supabase Storage:

```markdown
![Descrição da imagem](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/nome-da-imagem.jpg)
```

**Exemplo:**
```markdown
![Guia completo Enscape para SketchUp](https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/guia-enscape-sketchup-hero.jpg)
```

### 2.5. Definir a Imagem de Destaque (Featured Image)

A imagem de destaque deve usar apenas o nome do arquivo, que será automaticamente prefixado com a URL base do Supabase Storage:

-   **Formato:** `nome-da-imagem.jpg`
-   **Exemplo:** `guia-enscape-sketchup-hero.jpg`

**NOTA:** Não inclua a URL completa no campo `image_url` da tabela `blog_posts` - use apenas o nome do arquivo.

### 2.6. Informações Técnicas do Supabase

**Configurações atuais do projeto:**
- **Project ID:** `vfpdyllwquaturpcifpl`
- **Project URL:** `https://vfpdyllwquaturpcifpl.supabase.co`
- **Bucket:** `imagens-blog` (público)
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw`

**API Endpoint para Upload:**
```
POST https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/imagens-blog/NOME_DO_ARQUIVO
Headers:
- Authorization: Bearer [ANON_KEY]
- Content-Type: image/jpeg
```

### 2.7. Exemplo Prático - Artigo Enscape

**Script completo usado para o artigo do Enscape:**

```bash
#!/bin/bash
# Salve como: upload-enscape-images.sh

PROJECT_URL="https://vfpdyllwquaturpcifpl.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw"
BUCKET="imagens-blog"
TEMP_DIR="/tmp/enscape-images"
mkdir -p "$TEMP_DIR"

# Função de upload
upload_image() {
    local file_path="$1"
    local file_name="$2"
    curl -s -X POST \
        "$PROJECT_URL/storage/v1/object/$BUCKET/$file_name" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file_path"
}

# Downloads das imagens
curl -L "https://blog.enscape3d.com/hubfs/Interior%20rendering%20modern%20living%20room.jpg" \
     -o "$TEMP_DIR/guia-enscape-sketchup-hero.jpg"

curl -L "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop" \
     -o "$TEMP_DIR/guia-enscape-renderizacao-tempo-real.jpg"

# Fazer uploads
upload_image "$TEMP_DIR/guia-enscape-sketchup-hero.jpg" "guia-enscape-sketchup-hero.jpg"
upload_image "$TEMP_DIR/guia-enscape-renderizacao-tempo-real.jpg" "guia-enscape-renderizacao-tempo-real.jpg"
```

**Como executar:**
```bash
chmod +x upload-enscape-images.sh
./upload-enscape-images.sh
```

### 2.8. Script de Limpeza de Conteúdo (OBRIGATÓRIO)

**SEMPRE execute este script antes de inserir o conteúdo no banco:**

```bash
#!/bin/bash
# Salve como: clean-content.sh

clean_content() {
    local content="$1"
    
    # Substituir aspas tipográficas por aspas normais
    content=$(echo "$content" | sed "s/'/'/g")
    content=$(echo "$content" | sed "s/'/'/g") 
    content=$(echo "$content" | sed "s/"/\"/g")
    content=$(echo "$content" | sed "s/"/\"/g")
    
    # Substituir emojis comuns por texto
    content=$(echo "$content" | sed "s/😉/:)/g")
    content=$(echo "$content" | sed "s/💡/[DICA]/g")
    content=$(echo "$content" | sed "s/✅/[OK]/g")
    content=$(echo "$content" | sed "s/❌/[ERRO]/g")
    content=$(echo "$content" | sed "s/🚀/[IMPORTANTE]/g")
    content=$(echo "$content" | sed "s/⚠️/[ATENCAO]/g")
    
    # Substituir travessões por hífens
    content=$(echo "$content" | sed "s/—/-/g")
    
    echo "$content"
}

# Uso: clean_content "seu conteúdo aqui"
```

## Passo 3: Inserir os Dados no Banco de Dados

Este é o passo final. Depois de preparar o conteúdo e as imagens, você precisa inserir os dados no banco de dados Supabase.

### 3.0. Métodos de Acesso ao Banco

**Método 1 - Via MCP Tools (Recomendado para Claude Code):**
Use as ferramentas MCP do Supabase no Claude Code:

```javascript
// Listar IDs necessários
mcp__supabase__execute_sql({
  "project_id": "vfpdyllwquaturpcifpl",
  "query": "SELECT id, name FROM blog_authors;"
})

mcp__supabase__execute_sql({
  "project_id": "vfpdyllwquaturpcifpl", 
  "query": "SELECT id, name FROM blog_categories;"
})
```

**Método 2 - Via Painel Supabase:**
Acesse https://supabase.com/dashboard e execute queries diretamente no SQL Editor.

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

## Passo 4: Atualizar o Sistema de Rotas

### 4.0. Registrar o Novo Artigo no Sistema de Rotas (CRÍTICO)

**⚠️ ATENÇÃO: Este passo é OBRIGATÓRIO para que o artigo funcione no site!**

Após inserir o artigo no banco de dados Supabase, você **DEVE** adicionar o slug do novo artigo ao arquivo de rotas do sistema. Caso contrário, o artigo retornará erro 404 e "Algo deu errado ao carregar os artigos".

#### 4.0.1. Localizar o Arquivo de Rotas

O arquivo está localizado em: `/src/routes.jsx`

#### 4.0.2. Adicionar o Slug à Lista

Encontre o array `blogSlugs` (aproximadamente linha 27) e adicione o slug do novo artigo:

```javascript
const blogSlugs = [
  'guia-completo-21-estilos-decoracao-transformar-casa',
  'por-que-enscape-essencial-visualizacao-arquitetonica',
  'o-que-e-sketchup-guia-completo-modelagem-3d-2025',
  // ... outros slugs existentes ...
  'editor-materiais-sketchup-realismo-enscape',
  'guia-completo-enscape-sketchup-iniciantes',
  'SEU-NOVO-SLUG-AQUI'  // ← Adicione seu novo slug aqui
];
```

#### 4.0.3. Exemplo Prático

Se o slug do seu artigo é `por-que-enscape-essencial-visualizacao-arquitetonica`, adicione-o assim:

```javascript
const blogSlugs = [
  // ... slugs existentes ...
  'guia-completo-enscape-sketchup-iniciantes',
  'por-que-enscape-essencial-visualizacao-arquitetonica'  // ← Novo slug adicionado
];
```

#### 4.0.4. Por que Isso é Necessário?

O sistema usa **Static Site Generation (SSG)** para os artigos do blog. Isso significa que:

1. **Performance**: Os artigos são pré-gerados para carregar mais rápido
2. **SEO**: Motores de busca conseguem indexar melhor o conteúdo
3. **Roteamento**: React Router precisa saber quais slugs são válidos

**Sem adicionar o slug ao array `blogSlugs`:**
- ❌ Artigo retorna 404 "Not Found"  
- ❌ Aparece mensagem "Algo deu errado ao carregar os artigos"
- ❌ React Error #418 (hydration mismatch)

**Com o slug adicionado corretamente:**
- ✅ Artigo carrega normalmente
- ✅ SEO funciona perfeitamente
- ✅ Sem erros de hidratação

#### 4.0.5. Checklist Crítico

Antes de considerar o artigo publicado, **SEMPRE** verifique:

- [ ] **Artigo inserido** no banco Supabase
- [ ] **Imagens funcionando** no Storage
- [ ] **Slug adicionado** ao array `blogSlugs` em `/src/routes.jsx`
- [ ] **Build testado** localmente (`npm run dev`)
- [ ] **Deploy realizado** com as mudanças no routes.jsx

## Passo 5: Troubleshooting e Validação

### 4.1. Problemas Comuns e Soluções

#### 🚨 **ERRO: "Algo deu errado ao carregar os artigos"**

**Causas Possíveis:**

**1. CAUSA MAIS COMUM: Slug não adicionado ao sistema de rotas**
- Artigo existe no banco mas não está no array `blogSlugs` do `/src/routes.jsx`
- Resultado: 404 error e React Error #418

**Solução:**
```javascript
// Adicione o slug do artigo ao array blogSlugs em /src/routes.jsx
const blogSlugs = [
  // ... outros slugs ...
  'seu-novo-slug-aqui'
];
```

**2. Caracteres especiais problemáticos no conteúdo do artigo**

**Sintomas:**
- Outros artigos carregam normalmente
- Apenas o novo artigo apresenta erro
- Console do browser mostra erro de parsing JSON

**Solução:**
```sql
-- 1. Identificar o artigo problemático
SELECT title, LENGTH(content) as content_size 
FROM blog_posts 
WHERE published_at IS NOT NULL 
ORDER BY created_at DESC LIMIT 5;

-- 2. Limpar caracteres problemáticos
UPDATE blog_posts 
SET content = REPLACE(REPLACE(REPLACE(REPLACE(
    content, 
    ''', ''''), -- aspas tipográficas
    ''', ''''), -- aspas tipográficas  
    '😉', ':)'), -- emojis
    '💡', '[DICA]') -- emojis
WHERE slug = 'SEU-SLUG-AQUI';
```

#### 🔍 **Validação Pré-Inserção**

Antes de inserir qualquer artigo, **SEMPRE** execute esta verificação:

```sql
-- Verificar se há caracteres problemáticos
SELECT 
  title,
  CASE 
    WHEN content LIKE '%'%' OR content LIKE '%'%' THEN 'ASPAS_TIPOGRAFICAS'
    WHEN content LIKE '%😉%' OR content LIKE '%💡%' THEN 'EMOJIS'
    WHEN content LIKE '%—%' THEN 'TRAVESSAO'
    ELSE 'OK'
  END as validation_status
FROM blog_posts 
WHERE slug = 'SEU-SLUG-AQUI';
```

### 4.2. Checklist de Validação Final

Antes de considerar o artigo pronto, verifique:

- [ ] **Artigo no banco**: Inserido corretamente no Supabase
- [ ] **Slug no routes.jsx**: Adicionado ao array `blogSlugs` ⚠️ **CRÍTICO**
- [ ] **Imagens**: Todas acessíveis via Supabase Storage
- [ ] **Conteúdo**: Sem caracteres especiais problemáticos  
- [ ] **Aspas**: Apenas aspas retas (`'` `"`)
- [ ] **Emojis**: Substituídos por texto descritivo
- [ ] **URLs**: Todas as imagens usam URLs completas do Supabase
- [ ] **Estrutura**: Todos os campos obrigatórios preenchidos
- [ ] **Build local**: `npm run dev` executa sem erros
- [ ] **Teste**: Artigo carrega sem erros no frontend

### 4.3. Comandos de Emergência

**Se um artigo apresentar problemas após publicação:**

```sql
-- Ocultar temporariamente (remove published_at)
UPDATE blog_posts 
SET published_at = NULL 
WHERE slug = 'artigo-com-problema';

-- Restaurar após correção
UPDATE blog_posts 
SET published_at = NOW() 
WHERE slug = 'artigo-corrigido';
```

## Passo 5: Diretrizes de Formatação CSS para Agentes

### 5.1. ⚠️ **CRÍTICO: Evitar Problemas de Alinhamento de Texto**

**PROBLEMA COMUM:** Texto aparecendo desalinhado (empurrado para a direita) em listas com elementos em negrito.

**CAUSA RAIZ:** O CSS do blog foi otimizado para evitar quebras de linha inadequadas. Agentes devem seguir as diretrizes abaixo.

#### 5.1.1. Formatação Correta de Listas com Texto em Negrito

**✅ FORMATO CORRETO:**
```markdown
- **Alterando a resolução**: Vá para a aba Configurações Visuais (se não tem certeza de qual resolução usar, use a padrão, Full HD). Se precisar imprimir em uma escala maior, escolha Ultra HD ou valores mais altos.
- **Salvando em um local padrão**: Na aba Output, você pode configurar uma pasta padrão caso não queira ser solicitado a escolher um local toda vez.
```

**❌ FORMATO PROBLEMÁTICO:**
```markdown
- **Alterando a resolução
**: Vá para a aba Configurações Visuais...
- **Salvando em um local padrão
**: Na aba Output, você pode configurar...
```

#### 5.1.2. Regras para Elementos em Negrito em Listas

1. **NUNCA quebre linha** entre o texto em negrito e os dois pontos (`:`)
2. **SEMPRE mantenha** o texto em negrito e os dois pontos na mesma linha
3. **USE espaço simples** entre os dois pontos e o texto explicativo
4. **EVITE quebras de linha desnecessárias** dentro do texto em negrito

#### 5.1.3. Exemplos de Formatação Correta

**Para listas descritivas:**
```markdown
- **Nome da função**: Descrição detalhada da funcionalidade aqui.
- **Configuração importante**: Explicação sobre como configurar corretamente.
- **Dica valiosa**: Texto explicativo que pode ser longo e se estender por várias linhas sem problemas.
```

**Para listas numeradas:**
```markdown
1. **Primeiro passo**: Descrição completa do primeiro passo.
2. **Segundo passo**: Descrição completa do segundo passo.
3. **Terceiro passo**: Descrição completa do terceiro passo.
```

#### 5.1.4. Verificação de Qualidade

**ANTES DE FINALIZAR**, sempre verifique:
- [ ] Nenhum elemento `**texto**:` tem quebra de linha
- [ ] Todos os dois pontos estão colados ao texto em negrito
- [ ] Listas estão formatadas consistentemente
- [ ] Não há espaços extras ou caracteres invisíveis

### 5.2. CSS Atual Otimizado

O sistema atualmente utiliza CSS otimizado que:
- Remove `white-space: nowrap` de elementos strong em listas
- Permite quebra natural de texto longo
- Mantém alinhamento consistente à esquerda
- Funciona responsivamente em mobile

**NÃO modifique** o CSS unless instruído especificamente.

## Resumo do Processo

1.  **Prepare o texto:** Defina título, slug, resumo, conteúdo e metadados de SEO.
2.  **Limpe o conteúdo:** Execute script de limpeza para remover caracteres problemáticos.
3.  **Prepare as imagens:** Faça upload automatizado para o Supabase Storage.
4.  **Valide os dados:** Verifique se não há caracteres problemáticos.
5.  **Execute a inserção:** Adicione os novos registros às tabelas do Supabase.
6.  **⚠️ CRÍTICO - Atualize as rotas:** Adicione o slug ao array `blogSlugs` em `/src/routes.jsx`
7.  **⚠️ NOVO - Verifique formatação:** Confirme que listas com negrito seguem as diretrizes CSS.
8.  **Teste o artigo:** Verifique se carrega corretamente no frontend sem problemas de alinhamento.

Seguindo estes passos, o novo artigo será publicado corretamente no blog **sem erros de carregamento**.

## ⚠️ Aviso Importante para Agentes IA

**SE VOCÊ ESQUECEU DE ADICIONAR O SLUG AO ROUTES.JSX:**

O artigo existirá no banco de dados mas retornará erro 404 quando alguém tentar acessá-lo. Você DEVE:

1. Abrir `/src/routes.jsx`
2. Encontrar o array `blogSlugs`
3. Adicionar o slug do novo artigo
4. Fazer commit das mudanças

**Este é o erro mais comum ao publicar novos artigos!**
