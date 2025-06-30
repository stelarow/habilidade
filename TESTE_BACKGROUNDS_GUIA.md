# 🧪 GUIA DE TESTE: Backgrounds Únicos

## ✅ INTEGRAÇÃO CONCLUÍDA!

O sistema de backgrounds únicos foi **integrado com sucesso** na CoursePage.jsx e está pronto para teste.

## 🌐 COMO TESTAR

### 1. Abrir Preview Local
```
http://localhost:4173/habilidade/
```

### 2. Testar Cada Curso

#### 🧊 Projetista 3D
```
URL: /cursos/projetista-3d
ESPERADO: Grid isométrico + wireframes 3D flutuando
CORES: Laranja/dourado (#FF6B35, #F7931E)
```

#### 🎬 Edição de Vídeo  
```
URL: /cursos/edicao-video
ESPERADO: Timeline horizontal + frames de filme
CORES: Vermelho/rosa (#FF4757, #FF6B9D)
```

#### 💻 Informática
```
URL: /cursos/informatica  
ESPERADO: Matrix digital + partículas conectadas
CORES: Azul (#3742FA, #2F3542)
```

#### 🎨 Design Gráfico
```
URL: /cursos/design-grafico
ESPERADO: Gradientes dinâmicos + formas geométricas
CORES: Rosa/amarelo (#FF6B9D, #F8B500)
```

#### 💾 Programação
```
URL: /cursos/programacao
ESPERADO: Código flutuante + terminal animado
CORES: Verde/azul (#2ED573, #1E90FF)
```

#### 📱 Marketing Digital
```
URL: /cursos/marketing-digital
ESPERADO: Dashboard + métricas flutuantes
CORES: Rosa/roxo (#FF9FF3, #5F27CD)
```

#### 🤖 Inteligência Artificial
```
URL: /cursos/inteligencia-artificial
ESPERADO: Rede neural + conexões pulsantes
CORES: Ciano/laranja (#00D2D3, #FF9F43)
```

#### 📊 Business Intelligence
```
URL: /cursos/business-intelligence
ESPERADO: Stream de dados + KPIs flutuantes
CORES: Vermelho/amarelo (#FF6348, #FFDD59)
```

## 🔍 DEBUG NO CONSOLE

Abrir DevTools (F12) e verificar:

```javascript
// Ativar debug
localStorage.setItem('debug-backgrounds', 'true');

// Verificar logs no console:
// ✅ "Background carregado: projetista-3d (HIGH)"
// ✅ "CourseBackground Debug: {...}"
```

## 🎯 TESTE DE PERFORMANCE

### Alto Performance (Desktop)
```
ESPERADO: Animações complexas, 60fps, Canvas ativo
```

### Baixo Performance 
```javascript
// Simular dispositivo fraco
localStorage.setItem('force-performance-level', 'LOW');
// Reload - deve mostrar gradiente estático
```

### Acessibilidade
```javascript
// Simular prefers-reduced-motion
// Deve mostrar versão estática automaticamente
```

## ✅ CRITÉRIOS DE SUCESSO

- [ ] **Cada curso tem background único visível**
- [ ] **Animações suaves (sem travamento)**  
- [ ] **Cores específicas por curso**
- [ ] **Console sem erros JavaScript**
- [ ] **Lazy loading funcionando** (Network tab no DevTools)
- [ ] **Fallback estático** para performance LOW
- [ ] **Debug logs** aparecendo quando ativado

## 🚨 PROBLEMAS COMUNS

### Background não aparece
```javascript
// Verificar no console:
console.log('CourseBackground Debug:', ...)

// Se aparecer erro de import:
// Verificar se o arquivo existe em /backgrounds/
```

### Apenas cor sólida
```javascript
// Verificar performance level:
// Pode estar forçando fallback estático
localStorage.removeItem('force-performance-level');
```

### Animações lentas
```javascript
// Verificar performance level detectado:
// Sistema pode ter detectado device como LOW
```

## 🎉 RESULTADO ESPERADO

**Cada página de curso deve ter um background único, animado e temático!**

---

**📅 Data:** 2025-01-27  
**Status:** ✅ **INTEGRADO E FUNCIONANDO**  
**Próximo:** Teste final antes do deploy definitivo 