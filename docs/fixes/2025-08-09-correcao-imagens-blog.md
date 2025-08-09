# Correção: Imagens do Blog não Aparecendo

**Data:** 09/08/2025
**Artigo Afetado:** guia-completo-enscape-sketchup-iniciantes

## Problema Identificado

As imagens do artigo sobre Enscape SketchUp não estavam sendo exibidas, mostrando "Imagem não encontrada" no frontend.

## Causa Raiz

Havia dois problemas distintos:

### 1. Mapeamento de Campos (Resolvido no Código)
- **Frontend (BlogPostSSG):** Procurava por `featured_image` (snake_case)
- **Backend API:** Retornava `featuredImage` (camelCase)
- **Solução:** Atualizado BlogPostSSG.jsx para usar os campos corretos

### 2. URLs de Imagens no Conteúdo (Resolvido no Banco)
- **Problema:** Conteúdo do artigo usava caminhos locais (`/images/blog/...`)
- **Realidade:** Imagens estavam no Supabase Storage
- **Solução:** Atualizado conteúdo no banco para usar URLs do Supabase

## Correções Aplicadas

### Código (src/pages/BlogPostSSG.jsx)
```javascript
// Antes:
const seoImage = post.featured_image || 'default.png';

// Depois:
const seoImage = (post.featuredImage?.url || post.imageUrl) || 'default.png';
```

### Banco de Dados
```sql
-- Atualização das URLs das imagens no conteúdo
UPDATE blog_posts 
SET content = REPLACE(content, 
  '/images/blog/guia-completo-enscape-sketchup-iniciantes/',
  'https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/'
)
WHERE slug = 'guia-completo-enscape-sketchup-iniciantes';
```

## Imagens Corrigidas
1. `guia-completo-enscape-sketchup-iniciantes-hero.jpg` (imagem principal)
2. `guia-completo-enscape-sketchup-iniciantes-interface.jpg`
3. `guia-completo-enscape-sketchup-iniciantes-toolbar.png`
4. `guia-completo-enscape-sketchup-iniciantes-comparacao.jpg`

## Verificação
- ✅ URLs do Supabase Storage acessíveis (HTTP 200)
- ✅ Mapeamento de campos corrigido no frontend
- ✅ Conteúdo do banco atualizado com URLs corretas
- ✅ Cache limpo para garantir atualização

## Lições Aprendidas

1. **Sempre verificar o mapeamento de campos** entre API e frontend
2. **Usar URLs absolutas do storage** para imagens de blog
3. **Documentar o fluxo de upload de imagens** para evitar confusão futura
4. **Testar renderização de imagens** após publicação de artigos

## Próximos Passos Recomendados

1. Criar processo automatizado para upload de imagens no Supabase
2. Adicionar validação de URLs de imagens antes de publicar
3. Implementar fallback para imagens não encontradas
4. Considerar CDN para otimização de imagens

---

**Commit:** 89d5b30 - fix: corrigir mapeamento de campos de imagem no BlogPostSSG
**Deploy:** Netlify autodeploy após push