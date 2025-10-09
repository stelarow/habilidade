# Prompt para Auditoria SEO em Produção - Escola Habilidade

## 🎯 Objetivo

Auditar TODAS as meta tags SEO (Open Graph e Twitter Cards) do site **www.escolahabilidade.com** em produção, verificando duplicações e tags faltando.

---

## 📋 Contexto

Acabamos de identificar problemas de SEO no site:
1. **Meta description faltando** em todas as páginas
2. **Duplicação de meta tags OG/Twitter** em 6 páginas de cursos
3. Necessário validar o site em produção para confirmar os problemas

**Relatório Local:** O arquivo `RELATORIO-AUDITORIA-SEO.md` contém a análise detalhada do build local.

---

## 🌐 URLs para Auditar

### 1. Página Principal (1 URL)
- https://www.escolahabilidade.com/

### 2. Páginas de Cursos (10 URLs - PRIORITÁRIAS)
- https://www.escolahabilidade.com/cursos/informatica
- https://www.escolahabilidade.com/cursos/projetista-3d
- https://www.escolahabilidade.com/cursos/design-grafico
- https://www.escolahabilidade.com/cursos/programacao
- https://www.escolahabilidade.com/cursos/marketing-digital
- https://www.escolahabilidade.com/cursos/inteligencia-artificial
- https://www.escolahabilidade.com/cursos/administracao
- https://www.escolahabilidade.com/cursos/excel-avancado-business-intelligence
- https://www.escolahabilidade.com/cursos/edicao-video
- https://www.escolahabilidade.com/cursos/sketchup-enscape

### 3. Páginas Locais - SEO Local (3 URLs)
- https://www.escolahabilidade.com/cursos-florianopolis
- https://www.escolahabilidade.com/cursos-sao-jose
- https://www.escolahabilidade.com/cursos-palhoca

### 4. Páginas Institucionais (3 URLs)
- https://www.escolahabilidade.com/contato
- https://www.escolahabilidade.com/blog
- https://www.escolahabilidade.com/teste-vocacional

**Total:** 17 páginas

---

## 🔍 Checklist de Verificação por Página

Para cada URL, verificar a presença e quantidade das seguintes meta tags:

### Meta Tags Básicas
- [ ] `<title>` - deve ter exatamente 1
- [ ] `<meta name="description">` - deve ter exatamente 1
- [ ] `<meta name="keywords">` - 0 ou 1 (opcional)
- [ ] `<link rel="canonical">` - deve ter exatamente 1

### Open Graph Tags
- [ ] `<meta property="og:title">` - deve ter exatamente 1
- [ ] `<meta property="og:description">` - deve ter exatamente 1
- [ ] `<meta property="og:url">` - deve ter exatamente 1
- [ ] `<meta property="og:image">` - deve ter exatamente 1
- [ ] `<meta property="og:type">` - deve ter exatamente 1
- [ ] `<meta property="og:locale">` - deve ter exatamente 1
- [ ] `<meta property="og:site_name">` - deve ter exatamente 1

### Twitter Card Tags
- [ ] `<meta name="twitter:card">` - deve ter exatamente 1
- [ ] `<meta name="twitter:title">` - deve ter exatamente 1
- [ ] `<meta name="twitter:description">` - deve ter exatamente 1
- [ ] `<meta name="twitter:image">` - deve ter exatamente 1
- [ ] `<meta name="twitter:site">` - 0 ou 1 (opcional)

---

## 📊 Formato do Relatório Esperado

Gerar um relatório no seguinte formato:

```markdown
# Auditoria SEO em Produção - www.escolahabilidade.com
Data: [DATA ATUAL]
Total de páginas: 17

## 📊 Resumo Executivo

- Páginas sem problemas: X
- Páginas com duplicação: X
- Páginas com tags faltando: X
- Páginas com erros: X

## 🚨 Páginas com Problemas

### [URL da página]

**Status:** ❌ PROBLEMA / ⚠️ WARNING / ✅ OK

**Duplicações encontradas:**
- `og:title`: 2 ocorrências ❌
- `og:url`: 2 ocorrências ❌

**Tags faltando:**
- `meta description`: 0 ocorrências ❌
- `og:locale`: 0 ocorrências ⚠️

**Valores encontrados:**
- `og:title`: "Valor 1" (linha X)
- `og:title`: "Valor 2" (linha Y)
- `og:url`: "https://..."

**Screenshot/Print:** [se possível]

---

## ✅ Páginas OK

- [URL 1] - Todas as tags presentes e únicas
- [URL 2] - Todas as tags presentes e únicas

---

## 📈 Comparação com Análise Local

| Problema | Local (dist/) | Produção | Status |
|----------|---------------|----------|--------|
| Meta description faltando | 17 páginas | X páginas | [igual/diferente] |
| Duplicação OG/Twitter | 6 páginas | X páginas | [igual/diferente] |

**Conclusão:** [O build em produção está igual/diferente do local]

---

## 🎯 Recomendações

1. [Ação específica baseada nos resultados]
2. [Outra ação]

---

## 🔗 Validação Externa

Testar as páginas problemáticas em:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

**Resultados:**
- [URL teste 1]: [resultado]
- [URL teste 2]: [resultado]
```

---

## 🛠️ Método de Análise

### Opção 1: Usar ferramentas MCP disponíveis

Se você tem acesso ao **Playwright MCP**:
```
1. Use `mcp__playwright__browser_navigate` para cada URL
2. Use `mcp__playwright__browser_snapshot` para capturar o DOM
3. Analise o HTML capturado para contar meta tags
4. Extraia valores das tags duplicadas
```

### Opção 2: Usar Firecrawl MCP

Se você tem acesso ao **Firecrawl MCP**:
```
1. Use `mcp__firecrawl__firecrawl_scrape` para cada URL
2. Analise o HTML retornado
3. Conte ocorrências de cada meta tag
4. Identifique duplicações e valores
```

### Opção 3: Usar WebFetch (fallback)

Se não tiver MCPs de navegação:
```
1. Use WebFetch para cada URL com prompt específico:
   "Extraia TODAS as meta tags do <head> desta página,
   incluindo: title, description, canonical, og:*, twitter:*.
   Liste cada tag encontrada com seu conteúdo completo."

2. Conte manualmente as ocorrências
3. Identifique duplicações
```

---

## 🎯 Páginas Prioritárias (se tempo limitado)

Se não puder auditar todas as 17 páginas, priorize estas 8:

**Alta Prioridade:**
1. https://www.escolahabilidade.com/ (home)
2. https://www.escolahabilidade.com/cursos/design-grafico (tem duplicação local)
3. https://www.escolahabilidade.com/cursos/informatica (foi corrigida, validar)
4. https://www.escolahabilidade.com/cursos/marketing-digital (tem duplicação local)

**Média Prioridade:**
5. https://www.escolahabilidade.com/cursos/projetista-3d
6. https://www.escolahabilidade.com/cursos-florianopolis
7. https://www.escolahabilidade.com/contato
8. https://www.escolahabilidade.com/blog

---

## 📝 Instruções Passo-a-Passo

### Passo 1: Preparação
- Leia o arquivo `RELATORIO-AUDITORIA-SEO.md` para entender os problemas esperados
- Escolha o método de análise (Playwright, Firecrawl ou WebFetch)

### Passo 2: Coleta de Dados
Para cada URL das 17 páginas:
1. Acesse a página em produção
2. Extraia o HTML do `<head>`
3. Conte ocorrências de cada meta tag
4. Anote valores de tags duplicadas
5. Identifique tags faltando

### Passo 3: Análise
- Compare resultados com o relatório local
- Identifique diferenças entre local e produção
- Classifique severidade dos problemas

### Passo 4: Relatório
- Gere relatório no formato especificado acima
- Salve como `RELATORIO-AUDITORIA-PRODUCAO.md`
- Inclua screenshots/prints se possível

### Passo 5: Validação Externa (opcional mas recomendado)
- Teste 3-5 páginas no Facebook Sharing Debugger
- Teste 3-5 páginas no Twitter Card Validator
- Documente warnings/erros encontrados

---

## 🎯 Critérios de Sucesso

Uma auditoria completa deve:
- ✅ Cobrir todas as 17 URLs listadas
- ✅ Verificar todas as meta tags do checklist
- ✅ Identificar e contar duplicações
- ✅ Identificar tags faltando
- ✅ Comparar com análise local
- ✅ Gerar relatório estruturado
- ✅ (Opcional) Validar em ferramentas externas

---

## ⚠️ Problemas Esperados (baseado na análise local)

Com base na auditoria local, espera-se encontrar em produção:

### Problema 1: Meta Description Faltando
- **Esperado:** TODAS as 17 páginas sem `<meta name="description">`
- **Impacto:** CRÍTICO para SEO
- **Validação:** Procurar por `<meta name="description"` no `<head>`

### Problema 2: Duplicação em 6 Páginas
- **Esperado:** Duplicação de og:*/twitter:* em:
  - `/cursos/design-grafico`
  - `/cursos/marketing-digital`
  - `/cursos/inteligencia-artificial`
  - `/cursos/administracao`
  - `/cursos/excel-avancado-business-intelligence`
  - `/cursos/edicao-video`

- **Como verificar:** Contar ocorrências de `property="og:title"` etc.

### Problema 3: Páginas OK (sem duplicação mas sem description)
- **Esperado:** 11 páginas sem duplicação:
  - `/cursos/informatica`
  - `/cursos/projetista-3d`
  - `/cursos/programacao`
  - `/cursos/sketchup-enscape`
  - Páginas locais (3)
  - Páginas institucionais (4)

---

## 🔗 Links de Referência

- **Relatório Local:** `RELATORIO-AUDITORIA-SEO.md`
- **Script de Auditoria Local:** `scripts/audit-meta-tags.sh`
- **CLAUDE.md:** Documentação do projeto
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Inspector:** https://www.linkedin.com/post-inspector/

---

## 💡 Dicas

1. **Use ferramentas programáticas** quando possível (Playwright/Firecrawl) para maior precisão
2. **Salve o HTML completo** de páginas problemáticas para análise futura
3. **Tire screenshots** de duplicações no Facebook/Twitter validators
4. **Compare linha por linha** com o relatório local
5. **Documente diferenças** entre local e produção (se houver)

---

## 📤 Entregáveis

1. **RELATORIO-AUDITORIA-PRODUCAO.md** - Relatório principal
2. **(Opcional) screenshots/** - Prints de problemas/validações
3. **(Opcional)** - Comparação lado-a-lado local vs produção

---

**Boa sorte com a auditoria! 🚀**

**Qualquer dúvida, consulte o `RELATORIO-AUDITORIA-SEO.md` ou `CLAUDE.md`**
