# Diretrizes para Testes de Build e Linting

## Configuração de Timeout

**IMPORTANTE**: Todos os comandos de build, lint e testes devem ser executados com timeout mínimo de 10 minutos.

### Comandos Críticos que Precisam de Timeout Estendido:

- `npm run build` - Timeout mínimo: 10 minutos
- `npm run build:optimize` - Timeout mínimo: 12 minutos  
- `npm run lint` - Timeout mínimo: 5 minutos
- `npm test` - Timeout mínimo: 8 minutos
- `npx vite-react-ssg build` - Timeout mínimo: 10 minutos

### Exemplo de Uso Correto:

```bash
# ❌ Incorreto - pode interromper build
npm run build

# ✅ Correto - com timeout adequado
timeout 600 npm run build  # 10 minutos

# ✅ Alternativa usando parâmetro timeout do Bash tool
Bash(command="npm run build", timeout=600000)  # 10 minutos em ms
```

### Contexto do Projeto:

Este projeto usa:
- Vite 7 com SSG (Static Site Generation)
- React 19
- Build otimizado com análise de bundle
- Múltiplas etapas: client build, SSR build, asset optimization

O processo de build completo pode levar vários minutos devido à:
- Transformação de 6997+ módulos
- Geração de sitemap
- Renderização SSR de 26 páginas
- Otimização de assets
- Análise de bundle

### Monitoramento de Performance:

- Builds normais: ~2-4 minutos
- Builds com problemas: podem levar 8-10 minutos
- Timeout prematuros causam falsos positivos em debugging