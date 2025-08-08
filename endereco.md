# Plano de Otimização SEO - Múltiplos Domínios
## Escola Habilidade - Consolidação de Domínios

### 📋 Situação Atual
- **Domínio Principal**: www.escolahabilidade.com
- **Domínio Secundário**: www.escolahabilidade.com.br
- **Status**: Configuração básica implementada, necessita verificação e otimização

### 🎯 Objetivo
Consolidar todo o tráfego e autoridade SEO no domínio principal `www.escolahabilidade.com`, seguindo as melhores práticas do Google para evitar penalizações por conteúdo duplicado.

---

## 🔍 Fase 1: Auditoria e Diagnóstico (1-2 dias)

### 1.1 Verificação de Redirects Atuais
- [x] Testar redirects existentes no `netlify.toml`:
  - `escolahabilidade.com` → `www.escolahabilidade.com` ✅ (301)
  - `escolahabilidade.com.br` → `www.escolahabilidade.com` ✅ (301)
- [x] Verificar se `www.escolahabilidade.com.br` também redireciona corretamente ❌ **PROBLEMA: retorna 200**
- [x] Testar redirects em diferentes páginas (não apenas homepage) ✅
- [x] Verificar códigos de status (devem ser 301, não 302) ✅

### 1.2 Auditoria DNS
- [ ] Verificar configuração DNS para ambos domínios (.com e .com.br)
- [ ] Confirmar apontamento correto para Netlify
- [ ] Verificar TTL dos registros DNS

### 1.3 Teste de URLs Canônicas
- [x] Verificar se todas as páginas têm canonical URLs corretas ✅ **CORRIGIDO** - Todas as páginas agora têm canonical correto
- [x] Testar em páginas principais: home, blog, cursos, páginas locais ✅ **TESTADO** - Script de teste criado
- [x] Verificar se canonical aponta sempre para versão www.escolahabilidade.com ✅

---

## ⚙️ Fase 2: Implementação e Otimização (2-3 dias)

### 2.1 Fortalecimento dos Redirects
- [x] Adicionar redirect explícito para `www.escolahabilidade.com.br` se necessário: ✅ **ADICIONADO**
```toml
[[redirects]]
  from = "https://www.escolahabilidade.com.br/*"
  to = "https://www.escolahabilidade.com/:splat"
  status = 301
  force = true
```

### 2.2 Otimização das URLs Canônicas
- [x] Verificar `generateCanonicalUrl()` em `src/utils/seoUtils.js` ✅ **VERIFICADO** - BASE_URL correto
- [x] Garantir que `BASE_URL` sempre aponte para www.escolahabilidade.com ✅ **CONFIRMADO**
- [x] Testar componente `SEOHead` para canonical correto ✅ **CORRIGIDO** - BlogLayout agora aceita path
- [x] Verificar canonical em páginas dinâmicas (blog posts) ✅ **CORRIGIDO** - BlogIndex atualizado

### 2.3 Configuração Google Search Console
- [ ] Adicionar ambos domínios no GSC:
  - www.escolahabilidade.com (principal)
  - www.escolahabilidade.com.br (para monitoramento)
- [ ] Configurar domínio preferencial como www.escolahabilidade.com
- [ ] Submeter sitemap apenas do domínio principal

---

## 🚀 Fase 3: Monitoramento e Validação (1-2 dias)

### 3.1 Testes Automatizados
- [x] Criar testes E2E para verificar redirects: ✅ **CRIADO** `src/tests/seo-redirects.test.js`
```javascript
// Exemplo de teste
test('Domain redirects work correctly', async () => {
  // Test .com.br redirects to .com
  // Verify canonical URLs are correct
});
```

### 3.2 Ferramentas de Validação
- [ ] Usar Google Search Console para verificar canonical URLs
- [ ] Testar com Lighthouse para SEO issues
- [ ] Verificar com ferramentas como Screaming Frog ou Sitebulb
- [ ] Validar com Google Rich Results Test

### 3.3 Monitoramento Contínuo
- [ ] Configurar alertas no GSC para problemas de canonical
- [ ] Monitorar métricas de tráfego orgânico
- [ ] Acompanhar indexação de ambos domínios

---

## 📊 Fase 4: Documentação e Melhores Práticas (1 dia)

### 4.1 Documentação Técnica
- [ ] Documentar configuração atual em `CLAUDE.md`
- [ ] Criar guia para futuros desenvolvedores
- [ ] Documentar processo de verificação de redirects

### 4.2 Boas Práticas para Futuro
- [ ] Protocolo para novos domínios/subdomínios
- [ ] Checklist para verificação SEO em deploys
- [ ] Processo para monitoramento mensal de canonical URLs

---

## 🔧 Comandos Úteis

### Verificação de Redirects
```bash
# Testar redirects manualmente
curl -I https://escolahabilidade.com.br
curl -I https://www.escolahabilidade.com.br
curl -I https://escolahabilidade.com

# Verificar canonical URLs
curl -s https://www.escolahabilidade.com | grep canonical
```

### Testes Locais
```bash
# Rodar testes E2E específicos para SEO
npm run test:e2e -- seo-redirects

# Build e verificação local
npm run build:production
npm run test:seo
```

---

## 📈 Métricas de Sucesso

### KPIs Principais
- [ ] **100%** dos redirects funcionando corretamente (código 301)
- [ ] **0** páginas com canonical URLs incorretas
- [ ] **Consolidação** de autoridade no domínio principal
- [ ] **Redução** de avisos no Google Search Console
- [ ] **Manutenção/melhoria** do ranking orgânico

### Ferramentas de Monitoramento
- Google Search Console
- Google Analytics 4
- Lighthouse CI
- Ferramentas de SEO (Ahrefs, SEMrush, ou similares)

---

## ⚠️ Pontos de Atenção

1. **Não remover domínio .com.br** - manter redirect ativo permanentemente
2. **Monitorar ranking** - verificar se não há perda temporária de posições
3. **Atualizar links internos** - garantir que apontem para domínio principal
4. **Comunicar mudança** - informar parceiros/links externos se necessário

---

## 📅 Cronograma Estimado

| Fase | Duração | Responsabilidade |
|------|---------|------------------|
| Auditoria | 1-2 dias | Desenvolvimento |
| Implementação | 2-3 dias | Desenvolvimento + DevOps |
| Monitoramento | 1-2 dias | SEO + QA |
| Documentação | 1 dia | Documentação |
| **Total** | **5-8 dias** | **Equipe completa** |

---

*Plano criado em: 07/08/2025*  
*Versão: 1.0*  
*Status: Aguardando aprovação*