# PROMPT: Continuação de Otimização de Performance

## 📋 CONTEXTO DO PROJETO

Este é o site **Escola Habilidade** (www.escolahabilidade.com), um site educacional construído com:
- **Frontend:** React 19 + Vite 7 + TailwindCSS 4
- **Routing:** React Router v6 com SSG via `vite-react-ssg`
- **Deploy:** Netlify com build automático
- **Analytics:** Google Tag Manager (GTM) com lazy loading

**Diretório de trabalho:** `/mnt/c/habilidade`

---

## 🎯 OBJETIVO

Continuar implementando os fixes de performance restantes (Fix #3, #4 e #6) para melhorar ainda mais o LCP, que atualmente está em **438ms** (já atingimos a meta de <500ms, mas podemos chegar a <300ms).

---

## ✅ FIXES JÁ IMPLEMENTADOS (NÃO REFAZER)

### **Fix #1: Forced Reflow - CONCLUÍDO** ✅
**Commit:** `ac8ab95`
**Arquivo:** `scripts/inject-critical-css.js:192`

**Mudança:**
```javascript
// ANTES (❌ causava 145ms de forced reflow)
var isMobile = window.innerWidth <= 768;

// DEPOIS (✅ sem reflow)
var isMobile = window.matchMedia('(max-width: 768px)').matches;
```

**Resultado:** -145ms de forced reflow eliminados

---

### **Fix #2: Duplicação de Font Preloads - CONCLUÍDO** ✅
**Commit:** `db95201`
**Arquivo:** `scripts/inject-critical-css.js`

**Mudança:** Removida função `preloadCriticalResources()` que duplicava preloads já existentes no `index.html`.

**Antes:** Fontes preloaded 2x (index.html + script dinâmico)
**Depois:** Fontes preloaded 1x (apenas index.html)

**Resultado:** Eliminada duplicação de requisições HTTP

---

### **Fix #5: FOUC Prevention - CONCLUÍDO** ✅ 🏆
**Commit:** `905e611`
**Arquivo:** `scripts/inject-critical-css.js`

**Mudança:** Removida toda a função `generateFOUCPrevention()` e classes CSS `.fouc-prevent` e `.fouc-ready`.

**Antes:**
- Script bloqueava renderização aplicando `opacity:0; visibility:hidden` no `<html>`
- Esperava DOMContentLoaded + requestAnimationFrame
- Render delay: 899ms (96.7% do LCP)

**Depois:**
- Conteúdo visível imediatamente
- Render delay: 348ms (79.4% do LCP)

**Resultado:** **-551ms no render delay**, LCP melhorou de 930ms → 438ms (-53%)

---

## 📊 MÉTRICAS ATUAIS (PRODUÇÃO)

| Métrica | Inicial | Atual | Melhoria |
|---------|---------|-------|----------|
| **LCP** | 961ms | **438ms** | **-54%** ✅ |
| **Render Delay** | 932ms | **348ms** | **-63%** ✅ |
| **TTFB** | 29ms | 90ms | +61ms (variação) |
| **Forced Reflow** | 145ms | **0ms** | **-100%** ✅ |
| **CLS** | 0.00 | **0.00** | Perfeito ✅ |

**Status:** ✅ Core Web Vitals PASSED (LCP < 500ms)

---

## 🔧 FIXES PENDENTES (IMPLEMENTE ESTES)

### **Fix #3: CSS Carregado 3x - PENDENTE** ⏳

**Problema Identificado:**
O arquivo `app-BiM4Gnh2.css` é carregado 3 vezes durante o page load:
```
app-BiM4Gnh2.css GET [304]  - 1ª vez
app-BiM4Gnh2.css GET [304]  - 2ª vez
app-BiM4Gnh2.css GET [304]  - 3ª vez
```

**Causa Raiz:**
O script `inject-critical-css.js` está:
1. Encontrando CSS links existentes
2. Removendo eles
3. Recriando como `<link rel="preload" as="style">`
4. Browser já havia baixado antes → múltiplos 304s

**Localização:** `scripts/inject-critical-css.js:279-393`

**Solução Recomendada:**
Simplificar estratégia de CSS loading:
- **Opção A:** Remover toda a lógica de async CSS loader e deixar CSS carregar normalmente
- **Opção B:** Manter apenas critical CSS inline, remover async loader
- **Opção C:** Usar apenas `<link rel="stylesheet" media="print" onload="this.media='all'">` no HTML estático

**Código problemático:**
```javascript
// Linhas 280-393 em inject-critical-css.js
// Step 1: Remove ALL existing CSS links to prevent duplication
console.log(`🧹 Removing existing CSS links to prevent duplication...`);

// Find all CSS links for logging
const existingCssLinks = html.match(/<link[^>]*(?:rel="stylesheet"|href="[^"]*\.css")[^>]*>/gi) || [];
console.log(`🔍 Found ${existingCssLinks.length} existing CSS links to process`);

// Remove ALL CSS stylesheet links (any order of attributes)
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/gi, '');
// ... etc
```

**Impacto Estimado:** -50ms no LCP, menos overhead de rede

---

### **Fix #4: LazyAnalyticsLoader Não É Lazy - PENDENTE** ⏳ 🔴 CRÍTICO

**Problema Identificado:**
O "LazyAnalyticsLoader" carrega GTM após apenas 3 segundos, **sempre**, bloqueando o main thread.

**Evidências do DevTools:**
- LazyAnalyticsLoader: **1,115ms** no critical path
- Google Tag Manager: **422.6 KB** transferidos
- Main thread bloqueado: **166ms**

**Localização:** `src/services/LazyAnalyticsLoader.js:82-88`

**Código Problemático:**
```javascript
setupFallbackTimeout() {
  setTimeout(() => {
    if (!this.isLoaded) {
      this.loadAnalytics(); // ❌ Carrega SEMPRE após 3 segundos
    }
  }, this.loadTimeout); // 3000ms
}
```

**Soluções Recomendadas:**

**Opção A (Conservadora):** Aumentar timeout
```javascript
this.loadTimeout = 10000; // Aumentar de 3s para 10s
```

**Opção B (Recomendada):** Carregar APENAS após interação
```javascript
setupFallbackTimeout() {
  // Remover completamente o timeout fallback
  // Analytics só carrega se usuário interagir
  // Se não interagir = não precisa de analytics
}
```

**Opção C (Avançada):** Usar Partytown para rodar GTM em Web Worker
- Requer instalação: `npm install @builder.io/partytown`
- Configuração mais complexa mas melhor performance

**Impacto Estimado:** -100~166ms no main thread, -422KB carregados antecipadamente

---

### **Fix #6: Scripts Inline Bloqueantes - PENDENTE** ⏳

**Problema Identificado:**
O script `inject-critical-css.js` injeta **~170 linhas** de JavaScript inline no `<head>`:
- Bloqueia HTML parsing
- Executa antes do conteúdo renderizar
- Contribui para o render delay de 348ms

**Localização:** `scripts/inject-critical-css.js:84-228` (função `generateAsyncCSSLoader()`)

**Código Problemático:**
```javascript
// Inject async loader before closing body
html = html.replace('</body>', `${asyncLoader}\n</body>`);
```

Esse script é injetado no `<head>`, bloqueando parsing.

**Solução Recomendada:**

**Opção A:** Mover para final do `<body>` com `defer`
```javascript
// Em vez de injetar no <head>
html = html.replace(
  /<\/body>/i,
  `<script defer>${asyncLoader}</script>\n</body>`
);
```

**Opção B:** Usar `<script type="module">` (defer automático)
```javascript
html = html.replace(
  /<\/body>/i,
  `<script type="module">${asyncLoader}</script>\n</body>`
);
```

**Opção C (Mais radical):** Remover async CSS loader completamente
- Simplificar e deixar CSS carregar normalmente
- Critical CSS inline já está sendo injetado
- Async CSS pode não estar adicionando valor

**Impacto Estimado:** -50~100ms no render delay

---

## 🎯 META FINAL

**Alvo:** LCP < 300ms (atualmente 438ms)

**Ganhos esperados com fixes restantes:**
- Fix #3 (CSS 3x): -50ms → 388ms
- Fix #4 (LazyAnalytics): -100ms → 288ms
- Fix #6 (Scripts inline): -50ms → 238ms

**LCP Final Estimado:** **~238ms** (75% melhor que inicial!)

---

## 📝 INSTRUÇÕES PARA EXECUÇÃO

### **Passo 1: Analisar o Problema**
Para cada fix, primeiro confirme o problema em produção:

```bash
# Usar Chrome DevTools MCP para performance trace
mcp__chrome-devtools__navigate_page("https://www.escolahabilidade.com")
mcp__chrome-devtools__performance_start_trace(reload=true, autoStop=true)
mcp__chrome-devtools__performance_analyze_insight("NetworkDependencyTree") # Para Fix #3
mcp__chrome-devtools__performance_analyze_insight("ThirdParties") # Para Fix #4
```

### **Passo 2: Implementar o Fix**

1. Ler o arquivo relevante:
```bash
Read(file_path="/mnt/c/habilidade/scripts/inject-critical-css.js")
# ou
Read(file_path="/mnt/c/habilidade/src/services/LazyAnalyticsLoader.js")
```

2. Fazer as mudanças usando Edit tool

3. Verificar mudanças:
```bash
git diff <arquivo>
```

### **Passo 3: Commit e Push**

```bash
git add <arquivo>
git commit -m "perf: <descrição do fix>

<detalhes do problema>
<solução implementada>
<impacto esperado>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
"
git push
```

### **Passo 4: Testar em Produção**

Aguardar deploy do Netlify (~2-3 min) e testar:

```bash
mcp__chrome-devtools__navigate_page("https://www.escolahabilidade.com")
mcp__chrome-devtools__performance_start_trace(reload=true, autoStop=true)
```

Verificar se LCP melhorou conforme esperado.

---

## 🔍 ARQUIVOS IMPORTANTES

### **Arquivos de Performance:**
- `scripts/inject-critical-css.js` - Script post-build que injeta CSS crítico (Fix #3, #6)
- `src/services/LazyAnalyticsLoader.js` - Analytics lazy loader (Fix #4)
- `src/main.jsx` - Entry point que carrega LazyAnalytics
- `index.html` - Template HTML base
- `vite.config.js` - Configuração do build

### **Arquivos de Config:**
- `.claude/settings.local.json` - Config do Claude (não commitar)
- `package.json` - Scripts de build
- `netlify.toml` - Config de deploy (se existir)

---

## ⚠️ AVISOS IMPORTANTES

### **NÃO FAZER:**
1. ❌ **NÃO refazer Fix #1, #2 ou #5** - já estão implementados e funcionando
2. ❌ **NÃO remover `font-display: swap`** - previne FOIT
3. ❌ **NÃO commitar arquivos** `.claude/settings.local.json` ou `.serena/cache/`
4. ❌ **NÃO fazer force push** para main/master
5. ❌ **NÃO rodar build** sem antes verificar se há espaço em disco

### **SEMPRE FAZER:**
1. ✅ Testar em **produção** (https://www.escolahabilidade.com) após deploy
2. ✅ Usar Chrome DevTools para medir performance **antes e depois**
3. ✅ Criar commits descritivos com contexto completo
4. ✅ Verificar que LCP não **piora** após mudanças
5. ✅ Manter CLS em 0.00 (não introduzir layout shifts)

---

## 📊 COMANDOS ÚTEIS

### **Build e Deploy:**
```bash
npm run build:production    # Build de produção
npm run preview            # Preview local em :4173
git push                   # Deploy automático via Netlify
```

### **Testing Performance:**
```bash
# Testar local
npm run build:production && npm run preview
# Abrir http://192.168.2.140:4173/ no DevTools

# Testar produção
# Abrir https://www.escolahabilidade.com no DevTools
```

### **Git Status:**
```bash
git status                 # Ver mudanças
git diff <arquivo>         # Ver diff específico
git log --oneline -5       # Ver commits recentes
```

---

## 🎓 LIÇÕES APRENDIDAS

1. **FOUC Prevention foi o maior gargalo** (Fix #5 = -53% no LCP)
2. **Otimizações prematuras podem prejudicar** (async CSS loader pode estar causando mais mal que bem)
3. **Simplicidade > Complexidade** para performance
4. **Medir sempre** antes e depois de cada fix
5. **font-display: swap** é suficiente para prevenir FOIT

---

## 📈 HISTÓRICO DE PERFORMANCE

| Data | Fix | LCP | Render Delay | Commit |
|------|-----|-----|--------------|--------|
| Baseline | - | 961ms | 932ms | - |
| 2025-10-04 | Fix #1 | 930ms | 899ms | `ac8ab95` |
| 2025-10-04 | Fix #2 | 930ms | 899ms | `db95201` |
| 2025-10-04 | **Fix #5** | **438ms** | **348ms** | `905e611` |
| TBD | Fix #3 | ~388ms | ~298ms | - |
| TBD | Fix #4 | ~288ms | ~198ms | - |
| TBD | Fix #6 | ~238ms | ~148ms | - |

---

## ✨ COMEÇE POR AQUI

**Prioridade de implementação:**

1. **Fix #4 (LazyAnalytics)** - Maior impacto imediato (-100ms)
2. **Fix #6 (Scripts inline)** - Médio impacto (-50ms)
3. **Fix #3 (CSS 3x)** - Menor impacto mas importante (-50ms)

**Comando inicial:**
```bash
# Verificar estado atual
git status
git log --oneline -5

# Testar performance atual em produção
# Usar Chrome DevTools MCP conforme instruções acima
```

**Boa sorte! 🚀**

---

## 📞 INFORMAÇÕES ADICIONAIS

- **Repo:** GitHub stelarow/habilidade
- **Produção:** https://www.escolahabilidade.com
- **Deploy:** Netlify (automático no push para main)
- **Browser de teste:** Chrome com DevTools (via MCP)

**Última atualização:** 2025-10-04
**Última pessoa que trabalhou nisso:** Claude (via Claude Code)
