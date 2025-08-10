# PROMPT OTIMIZADO: Criação de Artigos para Blog - Escola Habilidade

## 🎯 OBJETIVO
Você deve criar um artigo completo para o blog da Escola Habilidade a partir de uma URL fornecida, seguindo RIGOROSAMENTE o processo documentado no guia oficial.

## 📋 INSTRUÇÕES CRÍTICAS

### ⚠️ REGRAS INEGOCIÁVEIS - NUNCA IGNORE:

1. **IMAGENS - PROCESSO REAL OBRIGATÓRIO:**
   - ✅ SEMPRE identificar imagens REAIS no conteúdo original
   - ✅ SEMPRE fazer download das imagens do site fonte
   - ✅ SEMPRE fazer upload real no Supabase Storage
   - ❌ NUNCA inventar nomes de imagens que não existem
   - ❌ NUNCA usar URLs de imagens fictícias

2. **FORMATAÇÃO - ESPAÇAMENTO OBRIGATÓRIO:**
   - ✅ Parágrafos curtos (máximo 4 linhas cada)
   - ✅ SEMPRE linha em branco após títulos
   - ✅ SEMPRE linha em branco após listas
   - ✅ SEMPRE linha em branco após imagens
   - ✅ DUAS linhas em branco entre seções principais

## 🔄 PROCESSO PASSO-A-PASSO

### PASSO 1: Extração e Análise
```
1. Use Firecrawl para extrair conteúdo da URL
2. Identifique TODAS as imagens presentes no HTML original
3. Liste as URLs reais das imagens
4. Analise a estrutura do conteúdo
```

### PASSO 2: Download e Upload de Imagens
```
1. Para cada imagem identificada:
   - Faça download da URL original
   - Teste se o download funcionou
   - Faça upload no Supabase Storage (bucket: imagens-blog)
   - Use padrão: [slug]-[descrição].jpg
   - Teste se a URL do Supabase funciona

2. Substitua URLs originais pelas URLs do Supabase no conteúdo
```

### PASSO 3: Formatação do Conteúdo
```
1. Estrutura OBRIGATÓRIA:
   # Título Principal
   [LINHA EM BRANCO]
   Parágrafo introdutório (máx 3 linhas)
   [LINHA EM BRANCO]
   
   ## Seção Principal
   [LINHA EM BRANCO]
   Conteúdo da seção (parágrafos de máx 4 linhas)
   [LINHA EM BRANCO]

2. Para listas:
   [LINHA EM BRANCO]
   - Item da lista
   - Item da lista
   [LINHA EM BRANCO]

3. Para imagens:
   [LINHA EM BRANCO]
   ![Descrição](URL_DO_SUPABASE)
   [LINHA EM BRANCO]
```

### PASSO 4: Validação PRÉ-PUBLICAÇÃO
```
1. Teste TODAS as URLs de imagens no navegador
2. Verifique espaçamento no markdown
3. Confirme que parágrafos não são muito longos
4. Valide que não há URLs fictícias
```

### PASSO 5: Inserção no Banco
```
1. Use MCP Supabase para inserir na tabela blog_posts
2. Preencha image_url e og_image com URLs reais do Supabase
3. Crie arquivo MD local como backup
```

## ✅ CHECKLIST DE VALIDAÇÃO

### ANTES DE PUBLICAR - VERIFICAR:
- [ ] ✅ Todas as imagens foram baixadas do site original
- [ ] ✅ Upload realizado no Supabase Storage
- [ ] ✅ TODAS as URLs de imagens testadas no navegador
- [ ] ✅ Formatação com espaçamento adequado
- [ ] ✅ Parágrafos curtos e legíveis
- [ ] ✅ Excerpt com 150-160 caracteres
- [ ] ✅ Título otimizado para SEO

## 🚨 ERROS CRÍTICOS A EVITAR

❌ **NUNCA FAÇA:**
- Inventar URLs de imagens que não existem
- Usar texto muito denso sem espaçamento
- Esquecer linha em branco após títulos
- Usar caminhos locais (/images/blog/)
- Publicar sem testar as URLs das imagens

✅ **SEMPRE FAÇA:**
- Download real das imagens do site original
- Upload real no Supabase Storage
- Teste todas as URLs antes de publicar
- Use formatação com espaçamento adequado
- Siga o checklist de validação

## 🎯 EXEMPLO DE EXECUÇÃO

```
Usuário: "Crie artigo da URL: https://exemplo.com/artigo"

VOCÊ DEVE:
1. Extrair conteúdo com Firecrawl
2. Identificar imagens: ["https://exemplo.com/img1.jpg", "https://exemplo.com/img2.png"]
3. Baixar cada imagem
4. Upload no Supabase Storage
5. Obter URLs: ["https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/artigo-img1.jpg"]
6. Criar conteúdo formatado corretamente
7. Testar todas as URLs
8. Inserir no banco
9. Criar arquivo MD backup
```

## 📚 RECURSOS DISPONÍVEIS

- **Guia completo:** `/mnt/c/habilidade/docs/GUIA_CRIACAO_ARTIGOS_BLOG_IA_2025.md`
- **Projeto Supabase:** `vfpdyllwquaturpcifpl`
- **Bucket de imagens:** `imagens-blog`
- **MCP Tools:** Firecrawl, Supabase, Serena

## 🎯 OBJETIVO FINAL

Criar um artigo completo, bem formatado, com imagens funcionais e pronto para ser consumido pelos usuários do blog da Escola Habilidade.

**LEMBRE-SE: A qualidade do artigo depende de seguir EXATAMENTE este processo. Não há atalhos!**