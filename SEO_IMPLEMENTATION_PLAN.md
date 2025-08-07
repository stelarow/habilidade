# 🚀 PLANO SEO OPTIMIZADO PARA IAs - ESCOLA HABILIDADE

**Versão**: 2.0 | **Data**: Janeiro 2025  
**Baseline DataForSEO**: Ranqueando posição 70+ para "curso projetista" (1300 buscas/mês)  
**Meta**: 500+ cliques orgânicos em 90 dias via estratégia de blog content  

## 📊 DADOS REAIS (DataForSEO MCP)
- **"curso projetista"**: 1300 vol/mês | Pos. 71 | ETV: 2.73  
- **"curso de projetista"**: 720 vol/mês | Pos. 68 | ETV: 1.512  
- **"curso manutenção"**: 170 vol/mês | Pos. 87 | ETV: 0.357  

## ✅ FASE 1: TECHNICAL SEO - IMPLEMENTADA

**Status**: ✅ COMPLETA (Janeiro 2025)  
- JSON-LD schemas (LocalBusiness + FAQ)  
- 3 páginas SEO local criadas  
- Sitemap automático configurado  
- Performance otimizada (async/defer)

### 🎯 IMPLEMENTAÇÕES REALIZADAS

### ✅ 1.1 JSON-LD Structured Data - IMPLEMENTADO
**Local**: `index.html`  
**Schemas**: FAQ (rich snippets) + LocalBusiness Enhanced + Area Served (3 cidades)  
**Status**: Esperando indexação para rich snippets (7-14 dias)

### ✅ 1.2 Meta Tags - OTIMIZADOS  
**Title**: 119→60 chars "Escola Habilidade - Cursos em Florianópolis e São José"  
**H1**: "Habilidade em IA" → "Cursos Profissionalizantes em Florianópolis e Região"  
**Files**: `index.html`, `src/pages/Home.jsx`, `src/components/Hero.jsx`

### ✅ 1.3 Performance - OTIMIZADO
**Scripts**: Google Analytics com async/defer implementado  
**Core Web Vitals**: Carregamento não-bloqueante configurado

### ✅ 1.4 Robots.txt - SIMPLIFICADO
**Status**: Complexidade removida, foco em indexação total
```
User-agent: *
Allow: /
Sitemap: https://www.escolahabilidade.com/sitemap.xml
```

### ✅ 1.5 Páginas Locais SEO - CRIADAS
**3 páginas implementadas**:
- `/cursos-florianopolis` - Schema EducationalOrganization completo
- `/cursos-sao-jose` - Target: "escola técnica são josé" (10 searches/month)  
- `/cursos-palhoca` - Foco proximidade e transporte público
- ✅ **Routing**: Configurado em `src/routes.jsx`
- ✅ **Sitemap**: Auto-geração atualizada

### 📊 RESUMO EXECUTIVO PHASE 1
**Ferramentas MCP Utilizadas**: ✅ Serena, GSC, Firecrawl, DataForSEO, Supabase  
**Commit**: `f8c5b07` - feat: implementa SEO Phase 1 completa  
**Deploy**: Automático via Netlify  
**Monitoramento**: GSC tracking ativo  
**Próximo Check**: 7 dias (rich snippets) / 30 dias (performance completa)

---

## 🎯 FASE 2: ESTRATÉGIA DE BLOG - NOVO APPROACH

**Mudança Estratégica**: Artigos de blog em vez de páginas estáticas  
**Motivo**: Blog já configurado com SSG, sitemap automático e sistema SEO robusto  
**Infraestrutura**: 16+ artigos publicados, sistema de categorias implementado  

### 📝 ARTIGOS HIGH-IMPACT PARA CRIAR

#### A. `/blog/curso-projetista-3d-florianopolis`
```yaml
title: "Curso de Projetista 3D em Florianópolis: Guia Completo 2025"
target_keywords: ["curso projetista florianópolis", "sketchup florianópolis"]  
volume_potencial: 1300+ buscas/mês
content_length: 1500+ palavras
cta_unico: Card curso projetista (final da página)
schema: Article + LocalBusiness
```

#### B. `/blog/curso-informatica-sao-jose-kobrasol`
```yaml
title: "Curso de Informática em São José: Do Básico ao Avançado"
target_keywords: ["curso informática são josé", "informática kobrasol"]
content_length: 1200+ palavras
focus_local: Transporte público, proximidade, horários flexíveis
```

#### C. `/blog/curso-marketing-digital-palhoca`
```yaml
title: "Marketing Digital em Palhoça: Curso Prático com Certificado"
target_keywords: ["marketing digital palhoça", "redes sociais palhoça"]
content_length: 1200+ palavras
focus_diferencial: Prática com empresas locais
```

### 📊 CLUSTER DE ARTIGOS ESTRATÉGICOS

#### 🎯 Tier 1: Artigos Comerciais (Conversão Alta)
```yaml
/blog/melhor-curso-projetista-florianopolis:
  - volume: 1300/mês | dificuldade: média
  - intent: commercial
  - cta: Card Curso Projetista 3D

/blog/curso-sketchup-presencial-florianopolis:
  - volume: 400/mês | long-tail high-convert
  - competição: baixa vs online

/blog/quanto-custa-curso-projetista-florianopolis:
  - volume: 200/mês | high purchase intent
  - schema: FAQ + Pricing
```

#### 🔍 Tier 2: Artigos Informativos (Tráfego Volume)
```yaml
/blog/diferenca-projetista-arquiteto:
  - volume: 800/mês | informational
  - pipeline: projetista → arquitetura → curso

/blog/salario-projetista-3d-santa-catarina:
  - volume: 600/mês | career-focused
  - local angle: mercado SC

/blog/software-mais-usado-projetistas-brasil:
  - volume: 300/mês | tools comparison
  - naturally mentions: SketchUp, AutoCAD, Revit
```

#### 💡 Tier 3: Glossário Técnico (Long-tail SEO)
**Estratégia**: 20 artigos `/blog/o-que-e-[termo]`  
**Template Otimizado**:
```yaml
structure:
  h1: "O que é [Termo]: Guia Completo 2025"
  content: 800+ palavras
  schema: DefinedTerm + Article
  internal_links: 3-5 para cursos relacionados
  cta: Subtle mention + card final

priority_terms:
  - sketchup, autocad, revit (high volume)
  - rendering, bim, planta-baixa (medium)
  - v-ray, lumion, enscape (specific tools)
```

---

## 🎯 FASE 3: OTIMIZAÇÃO ON-PAGE (Semanas 3-4)

### 3.1 Otimizar Páginas Existentes

#### A. Homepage (/)
**Title atual**: Muito longo (119 chars)  
**Title novo**: Escola Habilidade - Cursos em Florianópolis e São José  
**H1 atual**: "Habilidade em Inteligência Artificial |"  
**H1 novo**: "Cursos Profissionalizantes em Florianópolis e Região"  

**Adicionar seção de texto** (300+ palavras):
```
A Escola Habilidade é referência em cursos profissionalizantes na Grande Florianópolis, 
atendendo alunos de Florianópolis, São José, Palhoça, Biguaçu e região. 
Com mais de 10 anos de experiência, oferecemos formação completa em:

- Projetista 3D e Arquitetônico (SketchUp, AutoCAD, Revit)
- Informática do Básico ao Avançado
- Marketing Digital e Redes Sociais
- Programação e Desenvolvimento
- Design Gráfico e Edição de Vídeo
- Inteligência Artificial e Automação

Nossa sede em São José (Kobrasol) conta com laboratórios modernos...
```

#### B. Página /cursos/projetista-3d
**Title atual**: Genérico  
**Title novo**: Curso de Projetista 3D - SketchUp e AutoCAD | 6 meses  
**H1 novo**: Curso Completo de Projetista 3D - Do Esboço ao Render  
**URL nova**: /cursos/projetista-3d (manter)  

**Keywords para adicionar no conteúdo**:
- curso projetista (720 buscas/mês)
- curso de projetista (1300 buscas/mês)
- curso desenho projetista
- curso projetista 3d
- projetista curso online

### 3.2 Estrutura de URLs Otimizadas

#### URLs atuais para manter:
- /cursos/informatica ✅
- /cursos/projetista-3d ✅
- /cursos/design-grafico ✅
- /cursos/marketing-digital ✅

#### Criar redirects 301:
- /projeto/ → /cursos/projetista-3d
- /manutencao/ → /cursos/informatica

---

## 🔗 FASE 4: LINK BUILDING LOCAL (Mês 2)

### 4.1 Diretórios Locais

Cadastrar em:
1. **Google Meu Negócio** - Completo com fotos e posts
2. **Yelp Brasil**
3. **Apontador**
4. **GuiaMais**
5. **TeleListas**
6. **Solutudo** (SC)
7. **Tudo Região** (Florianópolis)
8. **Guia Floripa**
9. **Portal São José**
10. **Palhoça Online**

### 4.2 Parcerias Locais

#### Guest Posts em:
- Blog da ACIF (Associação Comercial Florianópolis)
- Portal Tech Floripa
- Startup SC
- Blog Sebrae SC

#### Temas para artigos:
1. "Como a tecnologia está transformando o mercado em Florianópolis"
2. "Profissões em alta em Santa Catarina para 2025"
3. "Por que São José é polo de educação tecnológica"

### 4.3 Citações e Menções

Buscar menções em:
- Grupos Facebook de Florianópolis
- LinkedIn - Grupos de profissionais SC
- Reddit r/florianopolis
- WhatsApp - Grupos de estudantes

---

## 📊 FASE 5: MONITORAMENTO E AJUSTES (Contínuo)

### 5.1 KPIs para Acompanhar

#### Métricas Semanais:
- **Google Search Console**:
  - Cliques (meta: 50 → 200 → 500)
  - Impressões (meta: 500 → 2000 → 5000)
  - CTR médio (meta: >5%)
  - Posição média (meta: <20)

#### Métricas Mensais:
- Keywords no Top 10 (meta: 5 → 15 → 30)
- Keywords no Top 100 (meta: 20 → 50 → 100)
- Páginas indexadas
- Backlinks ganhos

### 5.2 Ferramentas de Monitoramento

1. **Google Search Console** - Performance diária
2. **Google Analytics** - Comportamento usuário
3. **Google PageSpeed** - Core Web Vitals
4. **Ahrefs/SEMrush** - Backlinks e keywords
5. **Schema Validator** - Validar dados estruturados

---

## 🚀 QUICK WINS PARA IMPLEMENTAR HOJE

### Correções Imediatas (30 minutos):

1. **Reduzir title da homepage** para 60 caracteres
2. **Adicionar alt text** em todas imagens:
   ```html
   <img src="curso-sketchup.jpg" alt="Alunos aprendendo SketchUp em laboratório">
   ```

3. **Criar robots.txt**:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://www.escolahabilidade.com/sitemap.xml
   ```

4. **Adicionar canonical tags** em todas páginas:
   ```html
   <link rel="canonical" href="https://www.escolahabilidade.com/pagina-atual">
   ```

5. **Comprimir imagens** (usar TinyPNG)

---

## ⚡ CRONOGRAMA OPTIMIZADO (AI-Friendly)

### ✅ SPRINT 1 - IMPLEMENTADO (Janeiro 2025)
```yaml
technical_seo: ✅ COMPLETO
  - schemas: LocalBusiness + FAQ + Article
  - local_pages: 3 páginas (Floripa, SJ, Palhoça)
  - performance: async/defer configurado
  - sitemap: automático via SSG
```

### 🎯 SPRINT 2 - BLOG CONTENT (Semanas 1-2)
**Prioridade**: Tier 1 (Artigos Comerciais)
```yaml
week_1:
  - [ ] /blog/curso-projetista-3d-florianopolis (1500 palavras)
  - [ ] /blog/curso-informatica-sao-jose-kobrasol (1200 palavras)
  - [ ] Sistema de internal linking automático

week_2:
  - [ ] /blog/melhor-curso-projetista-florianopolis (1800 palavras)
  - [ ] /blog/quanto-custa-curso-projetista-florianopolis (1000 palavras)
  - [ ] Schema FAQ implementado
```

### 📈 SPRINT 3 - SCALE CONTENT (Semanas 3-4)
**Prioridade**: Tier 2 + Tier 3 (Volume + Long-tail)
```yaml
week_3:
  - [ ] 5 artigos glossário (o-que-e-sketchup, autocad, etc)
  - [ ] /blog/diferenca-projetista-arquiteto
  - [ ] Implementar structured data para todos artigos

week_4:
  - [ ] 5 artigos glossário adicionais
  - [ ] /blog/salario-projetista-3d-santa-catarina
  - [ ] Otimizar internal linking entre artigos
```

### 🚀 SPRINT 4 - OPTIMIZATION (Mês 2)
```yaml
monitoring:
  - GSC: tracking keyword positions
  - DataForSEO MCP: competitor analysis
  - Core Web Vitals: performance check

scaling:
  - 10 artigos glossário adicionais
  - Guest posting: 3 artigos em blogs locais SC
  - Local directory submissions: 10 listagens
```

---

## 💰 RESULTADO ESPERADO

### Em 30 dias:
- 100+ cliques orgânicos
- 20+ keywords rankeando
- 5+ keywords no Top 10

### Em 60 dias:
- 300+ cliques orgânicos
- 50+ keywords rankeando
- 15+ keywords no Top 10

### Em 90 dias:
- 500+ cliques orgânicos
- 100+ keywords rankeando
- 30+ keywords no Top 10
- Superar Escola LBK em termos locais

---

## 🤖 FERRAMENTAS MCP INTEGRADAS

**Utilizadas neste plano**:
```yaml
dataforseo_mcp: ✅ Análise de keywords e posições reais
firecrawl_mcp: ✅ Scraping competitor research  
supabase_mcp: ✅ Database blog posts management
gsc_mcp: ✅ Search Console monitoring
playwright_mcp: ✅ Testing user experience flows
```

**Próximas integrações**:
- Structured Memory MCP: Salvar progresso e insights
- Sequential Thinking MCP: Content strategy decisions

## 📋 IMPLEMENTATION CHECKLIST (AI Agents)

### ✅ Como Executar Cada Sprint:

**Sprint 2 - Blog Content**:
```bash
# 1. Verificar estrutura blog existente
npm run test:blog

# 2. Usar agente criador-de-aula para artigos
# 3. Implementar schema Article em cada post
# 4. Testar internal linking automático
# 5. Validar CTA único (regra BLOG_AGENT_RULES.md)
```

**Sprint 3 - Scale Content**:
```bash
# 1. Template glossário optimizado
# 2. Batch creation: 5 artigos por semana
# 3. Schema DefinedTerm implementado
# 4. Internal linking matrix atualizada
```

**Sprint 4 - Monitoring**:
```bash
# 1. DataForSEO MCP: weekly keyword tracking
# 2. GSC MCP: performance monitoring  
# 3. Core Web Vitals: automated testing
```

---

## 🎯 RESULTADO PREDICTIVE (DataForSEO Based)

**30 dias**: 150+ cliques (base atual 2.73 ETV → 10x via content)  
**60 dias**: 350+ cliques (tier 2 articles indexando)  
**90 dias**: 500+ cliques (long-tail glossário + guest posts)  

---

**Versão**: 2.0 | **Optimizado para**: Claude Code, IAs, MCP Agents  
**Baseline**: DataForSEO real data | **Strategy**: Blog-first approach  
**Última atualização**: Janeiro 2025