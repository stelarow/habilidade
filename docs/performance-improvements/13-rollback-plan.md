# 13 - Plano de Rollback

## Objetivo
Procedimento para reverter mudanças rapidamente se houver problemas em produção.

## Níveis de Rollback

### Nível 1: Rollback Parcial
Reverter apenas a mudança problemática mantendo outras otimizações.

### Nível 2: Rollback Completo
Voltar para versão 4675010 (funcional).

### Nível 3: Rollback de Emergência
Deploy imediato da última versão estável conhecida.

## Procedimentos de Rollback

### 1. Identificar o Problema

#### Sintomas Críticos (Rollback Imediato)
- [ ] Página em branco
- [ ] Erro 500/404 em rotas principais
- [ ] EmailJS não funcionando
- [ ] Blog posts não carregando
- [ ] Teste vocacional quebrado

#### Sintomas Moderados (Avaliar)
- [ ] Performance degradada (mas funcional)
- [ ] Animações não funcionando
- [ ] Warnings no console
- [ ] Layout quebrado em dispositivo específico

### 2. Rollback por Componente

#### Vite Config
```bash
# Reverter vite.config.js
git checkout 4675010 -- vite.config.js
npm run build:production
git add vite.config.js
git commit -m "fix: reverter vite config para versão estável"
git push
```

#### Lazy Components
```bash
# Reverter lazy loading
git checkout 4675010 -- src/components/LazyComponents.jsx
git checkout 4675010 -- src/components/LazyBackgrounds.jsx
npm run build:production
```

#### Package.json
```bash
# Reverter dependências se necessário
git checkout 4675010 -- package.json package-lock.json
npm install
npm run build:production
```

### 3. Rollback Completo

```bash
# Voltar para commit funcional
git checkout 4675010

# Criar branch de hotfix
git checkout -b hotfix/rollback-performance

# Build e teste
npm install
npm run build:production
npm run preview

# Se tudo OK, fazer merge
git checkout main
git merge hotfix/rollback-performance
git push
```

### 4. Rollback de Emergência (Netlify)

#### Via Netlify Dashboard
1. Acessar Netlify Dashboard
2. Site Settings > Deploys
3. Encontrar último deploy funcional
4. "Publish deploy" no deploy anterior

#### Via Netlify CLI
```bash
# Listar deploys
netlify deploy --list

# Reverter para deploy específico
netlify deploy --prod --build-id=<deploy-id>
```

## Checkpoints de Validação

### Antes de Cada Deploy
- [ ] Build local sem erros
- [ ] Preview local testado
- [ ] Console sem erros críticos
- [ ] Funcionalidades principais testadas

### Após Deploy
- [ ] Verificar site em produção imediatamente
- [ ] Testar funcionalidades críticas
- [ ] Monitorar por 30 minutos
- [ ] Verificar Analytics/Error tracking

## Comunicação

### Template de Incidente
```markdown
## 🚨 Incidente de Performance

**Hora:** [HH:MM]
**Problema:** [Descrição breve]
**Impacto:** [Usuários afetados]
**Ação:** [Rollback iniciado/completo]
**Status:** [Resolvido/Em andamento]
```

## Backup de Configurações

### Configurações Funcionais Salvas
```javascript
// vite.config.js - VERSÃO ESTÁVEL
export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Configuração mínima funcional
      }
    },
    minify: 'esbuild', // Mais seguro que terser
    sourcemap: false
  }
});
```

## Prevenção de Problemas Futuros

### Checklist Pré-Otimização
1. [ ] Backup do commit atual
2. [ ] Branch separada para mudanças
3. [ ] Testes incrementais
4. [ ] Deploy em staging primeiro (se disponível)
5. [ ] Monitoramento ativo pós-deploy

### Ferramentas de Monitoramento
- Netlify Analytics
- Browser Console
- Lighthouse CI
- User reports via WhatsApp/Email

## Contatos de Emergência

- **Developer**: [Seu contato]
- **Netlify Support**: support@netlify.com
- **Status Page**: netlify.statuspage.io

## Comandos Rápidos

```bash
# Verificar último commit funcional
git log --oneline | grep "funcional\|stable\|working"

# Build limpo
npm run clean && npm install && npm run build:production

# Verificar diferenças
git diff 4675010 HEAD -- vite.config.js

# Deploy direto (emergência)
npm run build:production && netlify deploy --prod --dir=dist
```

## Lições Aprendidas
Documentar aqui problemas encontrados e soluções para referência futura:

1. **[Data]**: [Problema] → [Solução]
2. **[Data]**: [Problema] → [Solução]