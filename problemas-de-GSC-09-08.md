# Análise GSC - Problemas de Indexação SketchUp vs Informática
**Data:** 09/08/2025  
**Período Analisado:** 28-90 dias  
**Domínio:** sc-domain:escolahabilidade.com  

## 🔍 **Resumo Executivo**

**PROBLEMA CRÍTICO IDENTIFICADO:** O site possui conteúdo extenso e de qualidade sobre SketchUp, mas está COMPLETAMENTE INVISÍVEL no Google Search Console, enquanto informática aparece com performance ruim.

## 📊 **Dados Google Search Console**

### SketchUp - Status Crítico ❌
- **Impressions:** 0 (zero dados nos últimos 90 dias)
- **Clicks:** 0 
- **Queries encontradas:** Nenhuma
- **Páginas indexadas:** Não aparecem no GSC

### Informática - Status Problemático ⚠️
- **Página:** `/cursos/informatica` - Posição 39.0, 2 impressões, 0 clicks
- **Query:** "aulas de informática" - Posição 2.0, 1 impressão, 0% CTR
- **Query:** "curso de informática básica" - Posição 4.0, 1 impressão, 0% CTR

## 🔍 **Análise de Conteúdo Existente**

### SketchUp - Conteúdo Rico Não Indexado
**Página Principal:** `/cursos/sketchup-enscape`
- ✅ 56 horas de conteúdo estruturado
- ✅ 28 aulas práticas detalhadas
- ✅ 6 projetos completos
- ✅ Depoimentos de alunos
- ✅ Empresas parceiras regionais
- ✅ Grade curricular completa

**Blog Posts SketchUp (11+ artigos):**
1. `o-que-e-sketchup-guia-completo-modelagem-3d-2025`
2. `historia-sketchup-software-arquitetura`
3. `design-espacos-varejo-sketchup-pro`
4. `sketchup-arquitetura-paisagistica`
5. `sketchup-workflows-avancados-arquitetura-paisagistica`
6. `como-usar-sketchup-para-design-conceitual-arquitetonico`
7. `dominando-shape-bender-curvando-geometrias-sketchup`
8. `como-apresentar-projetos-design-interior-sketchup`
9. `acelerando-workflow-grey-boxing-sketchup`
10. `10-extensoes-sketchup-arquitetos`
11. `editor-materiais-sketchup-realismo-enscape`
12. `guia-completo-enscape-sketchup-iniciantes`

**Páginas Locais com SketchUp:**
- CursosFlorianopolis.jsx: "curso sketchup florianópolis"
- CursosSaoJose.jsx: "curso sketchup são josé" 
- CursosPalhoca.jsx: "curso sketchup palhoça"

## 🚨 **Problema Arquitetural Identificado**

### Discrepância de Layout
```javascript
// SketchUp usa layout diferenciado:
{
  path: '/cursos/sketchup-enscape',
  element: <CourseLayout />,  // ← PROBLEMA
}

// Outras páginas usam layout padrão:
{
  path: '/',
  element: <Layout />,  // ← Funcionando no GSC
}
```

**HIPÓTESE PRINCIPAL:** CourseLayout não possui configuração SEO adequada comparado ao Layout padrão.

## 🔍 **Problemas Identificados por Prioridade**

### 🔴 **Prioridade Crítica**

#### 1. Invisibilidade Total do SketchUp
- **Sintoma:** Zero dados no GSC para qualquer termo SketchUp
- **Causa Provável:** Problemas arquiteturais de indexação
- **Impacto:** Nicho principal do negócio invisível no Google

#### 2. Discrepância Arquitetural
- **Sintoma:** Layout diferente para SketchUp vs outras páginas
- **Causa Provável:** CourseLayout sem configuração SEO
- **Impacto:** Problemas de crawling e indexação

### 🟡 **Prioridade Alta**

#### 3. Performance Ruim - Informática
- **Sintoma:** Posição 39, CTR 0% mesmo em posições 2-4
- **Causa Provável:** Title/Meta description não otimizados
- **Impacto:** Baixa conversão de impressões

#### 4. Duplicação de Domínio
- **Sintoma:** www vs não-www dividindo tráfego
- **Impact:** Diluição de autoridade

## 🔧 **Plano de Ação Detalhado**

### **Fase 1: Auditoria Técnica Crítica (Urgente)**

#### 1.1 Verificar Indexação SketchUp
```bash
# Testes de indexação
site:escolahabilidade.com/cursos/sketchup-enscape
site:escolahabilidade.com "sketchup"
```

#### 1.2 Comparar Configurações Layout
- [ ] Analisar head section CourseLayout vs Layout
- [ ] Verificar meta tags (title, description, og:tags)
- [ ] Confirmar presença no sitemap.xml
- [ ] Verificar robots.txt

#### 1.3 Testar Renderização
- [ ] Google PageSpeed Insights
- [ ] Mobile-Friendly Test
- [ ] Rich Results Test

### **Fase 2: Correções Técnicas (Esta Semana)**

#### 2.1 Padronização SEO
```javascript
// Garantir que CourseLayout tenha:
- Meta title otimizada
- Meta description 
- Open Graph tags
- Schema markup
- Canonical URLs
```

#### 2.2 Otimização Informática
```html
<!-- Título otimizado -->
<title>Curso de Informática Básica - Florianópolis SC | Escola Habilidade</title>

<!-- Meta description melhorada -->
<meta name="description" content="Curso de Informática Básica em Florianópolis. Aulas práticas de Windows, Office e Internet. Certificado reconhecido. Matrículas abertas!">
```

### **Fase 3: Estratégia de Conteúdo (Próxima Semana)**

#### 3.1 Link Building Interno
- [ ] Conectar blog posts SketchUp à página principal
- [ ] Otimizar anchor texts
- [ ] Criar hub de conteúdo SketchUp

#### 3.2 Landing Pages Locais
- [ ] `/curso-sketchup-florianopolis`
- [ ] `/curso-sketchup-sao-jose`
- [ ] `/curso-sketchup-palhoca`

## 📋 **Checklist de Verificação**

### SEO Técnico
- [ ] CourseLayout possui meta tags completas
- [ ] Página SketchUp está no sitemap.xml
- [ ] URLs canonicalizadas (www vs não-www)
- [ ] Schema markup implementado
- [ ] Mobile responsivo funcionando

### Conteúdo
- [ ] H1/H2 otimizados com keywords locais
- [ ] Meta descriptions com CTA
- [ ] Images com alt text otimizado
- [ ] Internal linking strategy

### Monitoramento
- [ ] Google Search Console configurado
- [ ] Google Analytics eventos configurados
- [ ] Tracking de conversões implementado

## 🎯 **Métricas de Sucesso**

### Metas 30 dias:
- SketchUp aparecer no GSC com pelo menos 10 impressões
- Informática sair da posição 39 para posição <20
- CTR geral aumentar para >3%

### Metas 90 dias:
- SketchUp: 100+ impressões mensais
- Informática: Posição top 10 para terms locais
- CTR geral >5%

## 📞 **Próximos Passos**

1. **Auditoria técnica CourseLayout** (hoje)
2. **Teste de indexação manual** (hoje) 
3. **Correções técnicas críticas** (esta semana)
4. **Re-submeter para indexação** (esta semana)
5. **Monitorar GSC por mudanças** (contínuo)

---

**Conclusão:** O site tem excelente conteúdo sobre SketchUp mas problemas arquiteturais impedem sua indexação. A correção da discrepância de layouts deve ser prioridade absoluta.

**Status:** 🔴 Crítico - Requer ação imediata  
**Responsável:** Equipe técnica + SEO  
**Revisão:** Semanal até resolução