# 12 - Guia de Testes

## Objetivo
Validar que todas as funcionalidades permanecem operacionais após otimizações.

## Checklist de Funcionalidades Críticas

### 1. Blog
- [ ] Listar artigos na página `/blog`
- [ ] Clicar em um artigo e visualizar conteúdo completo
- [ ] Navegação entre artigos (próximo/anterior)
- [ ] Compartilhamento social funciona
- [ ] Tabela de conteúdos navega corretamente
- [ ] Syntax highlighting em código
- [ ] Imagens carregam corretamente
- [ ] Formulário de contato rápido abre

### 2. Teste Vocacional (`/teste-vocacional`)
- [ ] Página carrega sem erros
- [ ] Perguntas são exibidas
- [ ] Navegação entre perguntas funciona
- [ ] Cálculo de resultado funciona
- [ ] Geração de PDF funciona
- [ ] Download do resultado funciona
- [ ] Compartilhamento funciona

### 3. Homepage
- [ ] Hero section carrega
- [ ] Animações funcionam (se não reduzidas)
- [ ] Carrossel de cursos funciona
- [ ] Depoimentos carregam
- [ ] Links de navegação funcionam
- [ ] CTA buttons funcionam
- [ ] WhatsApp float button funciona

### 4. Páginas de Cursos
- [ ] Informações do curso carregam
- [ ] Background animado carrega (ou fallback)
- [ ] Currículo expandível funciona
- [ ] Formulário de contato funciona
- [ ] Galeria de projetos funciona
- [ ] Vídeos embed funcionam

### 5. Formulários
- [ ] EmailJS envia emails
- [ ] Validação de campos funciona
- [ ] Mensagens de erro/sucesso aparecem
- [ ] Upload de imagens funciona
- [ ] Fallback WhatsApp funciona

## Testes de Performance

### Lighthouse
```bash
# Build de produção
npm run build:production

# Servir localmente
npm run preview

# Em outra aba, rodar Lighthouse
npm run perf:audit
```

### Métricas Alvo
- Performance: ≥ 85
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: 100

### Core Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Testes de Console

### Verificar Erros
```javascript
// Adicionar temporariamente no App.jsx
useEffect(() => {
  // Capturar todos os erros
  window.addEventListener('error', (e) => {
    console.error('❌ Erro capturado:', e.message, e);
  });
  
  // Capturar promises rejeitadas
  window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rejeitada:', e.reason);
  });
  
  // Log de componentes críticos carregados
  console.log('✅ App carregado');
}, []);
```

### Verificar Dependências Críticas
```javascript
// No console do browser
console.log('Marked:', typeof marked);
console.log('Highlight.js:', typeof hljs);
console.log('EmailJS:', typeof emailjs);
console.log('Html2Canvas:', typeof html2canvas);
console.log('jsPDF:', typeof jspdf);
```

## Testes de Rede

### Simular Conexão Lenta
1. Abrir DevTools
2. Network tab
3. Throttling: "Slow 3G"
4. Verificar:
   - Página carrega em < 10s
   - Conteúdo crítico aparece primeiro
   - Sem timeout de recursos

### Verificar Chunks
1. Network tab
2. Filtrar por JS
3. Verificar tamanhos:
   - Nenhum chunk > 500KB
   - Bundle inicial < 200KB
   - Total < 1.5MB

## Testes Manuais por Dispositivo

### Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Tablet iPad

## Script de Teste Automatizado
```bash
#!/bin/bash
# test-build.sh

echo "🔨 Building..."
npm run build:production

echo "🚀 Starting preview..."
npm run preview &
SERVER_PID=$!

sleep 5

echo "🧪 Running tests..."
# Testar URLs principais
curl -s http://localhost:4173 > /dev/null && echo "✅ Home OK" || echo "❌ Home FAILED"
curl -s http://localhost:4173/blog > /dev/null && echo "✅ Blog OK" || echo "❌ Blog FAILED"
curl -s http://localhost:4173/teste-vocacional > /dev/null && echo "✅ Teste OK" || echo "❌ Teste FAILED"

echo "🛑 Stopping server..."
kill $SERVER_PID

echo "✨ Test complete!"
```

## Rollback Imediato Se:
1. Qualquer página não carrega
2. Erros no console em produção
3. Funcionalidade crítica quebrada
4. Performance score < 70
5. EmailJS não funciona