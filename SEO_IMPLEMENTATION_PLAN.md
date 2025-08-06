# 🚀 PLANO DE IMPLEMENTAÇÃO SEO - ESCOLA HABILIDADE

**Data**: Agosto 2025  
**Objetivo**: Aumentar tráfego orgânico de 2 para 500+ cliques/mês em 90 dias  
**Foco Geográfico**: Grande Florianópolis (Florianópolis, São José, Palhoça)

---

## ✅ FASE 1: CORREÇÕES TÉCNICAS URGENTES - CONCLUÍDA

**Status**: ✅ **IMPLEMENTADA** - Janeiro 2025  
**GSC Baseline**: 2 clicks, 34 impressões (CTR 5.88%, Posição 65.4)  
**Expectativa**: 100+ clicks em 30 dias através de technical foundation + local SEO

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

## 📝 FASE 2: CRIAÇÃO DE CONTEÚDO SEO (Semanas 2-4) - PENDENTE

### 2.1 Páginas de Cursos Localizadas

#### A. Página: /cursos/projetista-3d-florianopolis
**Title**: Curso de Projetista 3D em Florianópolis | Escola Habilidade  
**H1**: Curso de Projetista 3D em Florianópolis  
**Meta Description**: Aprenda SketchUp, AutoCAD e renderização 3D em Florianópolis. Curso presencial com certificado. Turmas abertas no Centro e Continente.  
**Conteúdo mínimo**: 800 palavras focadas em:
- "curso projetista florianópolis"
- "curso sketchup florianópolis"
- "curso autocad florianópolis"
- "curso 3d florianópolis"

#### B. Página: /cursos/informatica-sao-jose
**Title**: Curso de Informática em São José SC | Kobrasol  
**H1**: Curso de Informática Completo em São José  
**Meta Description**: Curso de informática do básico ao avançado em São José, Kobrasol. Excel, Word, Internet. Certificado incluso.  
**Keywords alvo**:
- "curso informática são josé sc"
- "curso excel kobrasol"
- "informática básica são josé"

#### C. Página: /cursos/marketing-digital-palhoca
**Title**: Curso de Marketing Digital em Palhoça | Escola Habilidade  
**H1**: Marketing Digital e Redes Sociais em Palhoça  
**Meta Description**: Aprenda marketing digital, Google Ads e redes sociais em Palhoça. Aulas práticas e certificado reconhecido.  
**Keywords alvo**:
- "curso marketing digital palhoça"
- "curso redes sociais palhoça"
- "marketing digital grande florianópolis"

### 2.2 Páginas de Comparação (Competir com LBK)

#### A. /blog/melhor-escola-cursos-florianopolis
**Title**: Melhor Escola de Cursos em Florianópolis: Guia 2025  
**Conteúdo**: Comparação objetiva entre escolas locais  
**Estrutura**:
1. Introdução (150 palavras)
2. Escola Habilidade - Diferenciais
3. Outras opções em Florianópolis
4. Tabela comparativa de preços e cursos
5. Depoimentos de alunos
6. Conclusão com CTA

#### B. /blog/curso-projetista-ou-arquitetura
**Title**: Curso de Projetista ou Arquitetura: Qual Escolher?  
**Keywords**:
- "diferença projetista arquiteto"
- "curso projetista vale a pena"
- "projetista 3d salário"

### 2.3 Glossário Técnico (Estratégia LBK)

Criar 50 páginas de glossário, uma para cada termo:

#### Estrutura de cada página:
- URL: /glossario/[termo]
- Title: O que é [Termo] - Guia Completo | Escola Habilidade
- H1: O que é [Termo]?
- Conteúdo: 500+ palavras
- Schema: DefinedTerm

#### Lista de termos prioritários:
1. **SketchUp** - o que é sketchup
2. **AutoCAD** - o que é autocad
3. **Revit** - o que é revit
4. **BIM** - o que é bim arquitetura
5. **Renderização 3D** - o que é renderização
6. **V-Ray** - o que é vray
7. **Enscape** - o que é enscape
8. **Lumion** - o que é lumion
9. **Projeto Executivo** - o que é projeto executivo
10. **Planta Baixa** - o que é planta baixa
11. **Corte Arquitetônico** - o que é corte arquitetônico
12. **Maquete Eletrônica** - o que é maquete eletrônica
13. **Design Thinking** - o que é design thinking
14. **UX Design** - o que é ux design
15. **UI Design** - o que é ui design
16. **Prototipagem** - o que é prototipagem
17. **Marketing Digital** - o que é marketing digital
18. **SEO** - o que é seo
19. **Google Ads** - o que é google ads
20. **Python** - o que é python programação

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

## 📅 CRONOGRAMA DE EXECUÇÃO

### ✅ Semana 1 - CONCLUÍDA (Janeiro 2025)
- [x] Implementar todos os schemas JSON-LD
- [x] Corrigir meta tags duplicadas  
- [x] Otimizar title tags
- [x] Criar 3 páginas locais SEO
- [x] Simplificar robots.txt
- [x] Otimizar performance (async/defer)

### Semana 2
- [ ] Criar 3 páginas localizadas (Floripa, SJ, Palhoça)
- [ ] Otimizar página do curso projetista
- [ ] Adicionar conteúdo na homepage

### Semana 3
- [ ] Criar 10 páginas de glossário
- [ ] Publicar 2 artigos de blog
- [ ] Cadastrar em 5 diretórios

### Semana 4
- [ ] Criar mais 10 páginas de glossário
- [ ] Implementar melhorias de performance
- [ ] Iniciar link building

### Mês 2
- [ ] Completar 50 páginas de glossário
- [ ] 10 guest posts publicados
- [ ] Análise e ajustes baseados em dados

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

## 🛠️ FERRAMENTAS NECESSÁRIAS

1. **Google Search Console** - Já configurado
2. **Google Analytics 4** - Implementar
3. **Google Tag Manager** - Para tracking
4. **Schema Markup Generator** - Para criar schemas
5. **Screaming Frog** - Para auditoria técnica

---

## 📌 OBSERVAÇÕES IMPORTANTES

1. **NÃO EDITAR** sitemap.xml manualmente (gerado automaticamente)
2. **Sempre testar** schemas no Google Rich Results Test
3. **Monitorar** Core Web Vitals semanalmente
4. **Documentar** todas as mudanças realizadas
5. **Backup** antes de grandes alterações

---

**Documento criado para implementação por qualquer desenvolvedor ou agente de IA**  
**Última atualização**: Agosto 2025  
**Responsável**: SEO Team - Escola Habilidade