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

### 2.2. Baixar e Preparar as Imagens

1.  **Baixe** todas as imagens do artigo original
2.  **Otimize** as imagens para a web (use TinyPNG, Squoosh ou similar)
3.  **Renomeie** os arquivos com nomes descritivos em `kebab-case`
4.  **Organize** por temas quando necessário

### 2.3. Upload para o Supabase Storage

**Método Automatizado (Recomendado) - Via Script:**

Crie um script para automatizar o download e upload das imagens:

```bash
#!/bin/bash

# Configurações do Supabase
PROJECT_URL="https://vfpdyllwquaturpcifpl.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw"
BUCKET="imagens-blog"
TEMP_DIR="/tmp/blog-images"

# Criar diretório temporário
mkdir -p "$TEMP_DIR"

# Função para fazer upload de imagem
upload_image() {
    local file_path="$1"
    local file_name="$2"
    
    if [ ! -f "$file_path" ]; then
        echo "Arquivo não encontrado: $file_path"
        return 1
    fi
    
    echo "Fazendo upload de: $file_name"
    
    response=$(curl -s -X POST \
        "$PROJECT_URL/storage/v1/object/$BUCKET/$file_name" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$file_path")
    
    if echo "$response" | grep -q "error"; then
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

# Baixar imagens do artigo original
curl -L "URL_DA_IMAGEM_ORIGINAL" -o "$TEMP_DIR/nome-da-imagem.jpg"

# Fazer upload
upload_image "$TEMP_DIR/nome-da-imagem.jpg" "nome-da-imagem.jpg"
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

## Passo 4: Troubleshooting e Validação

### 4.1. Problemas Comuns e Soluções

#### 🚨 **ERRO: "Algo deu errado ao carregar os artigos"**

**Causa:** Caracteres especiais problemáticos no conteúdo do artigo.

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

- [ ] **Imagens**: Todas acessíveis via Supabase Storage
- [ ] **Conteúdo**: Sem caracteres especiais problemáticos  
- [ ] **Aspas**: Apenas aspas retas (`'` `"`)
- [ ] **Emojis**: Substituídos por texto descritivo
- [ ] **URLs**: Todas as imagens usam URLs completas do Supabase
- [ ] **Estrutura**: Todos os campos obrigatórios preenchidos
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

## Resumo do Processo

1.  **Prepare o texto:** Defina título, slug, resumo, conteúdo e metadados de SEO.
2.  **Limpe o conteúdo:** Execute script de limpeza para remover caracteres problemáticos.
3.  **Prepare as imagens:** Faça upload automatizado para o Supabase Storage.
4.  **Valide os dados:** Verifique se não há caracteres problemáticos.
5.  **Execute a inserção:** Adicione os novos registros às tabelas do Supabase.
6.  **Teste o artigo:** Verifique se carrega corretamente no frontend.

Seguindo estes passos, o novo artigo será publicado corretamente no blog **sem erros de carregamento**.
