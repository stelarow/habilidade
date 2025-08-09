# Plano de Melhoria - Formatação de Artigos do Blog

## Problema Identificado

Os artigos do blog da Escola Habilidade apresentam problemas significativos de formatação que afetam a legibilidade e experiência do usuário:

### Problemas Específicos Detectados

1. **Listas mal formatadas** - Falta de espaçamento adequado entre itens
2. **Texto colado sem quebras** - Ausência de espaçamento entre palavras e parágrafos
3. **Compressão visual** - Elementos visuais muito próximos sem respiração
4. **Hierarquia visual prejudicada** - Falta de separação clara entre seções

### Exemplos Problemáticos (guia-completo-enscape-sketchup-iniciantes)

#### ❌ Formato Atual Problemático:
```
Sistema Operacional
  : Windows 10 ou superior / macOS (versões compatíveis)
  Placa de Vídeo
  : NVIDIA, AMD ou Intel Arc A310 com pelo menos
  4GB de VRAM dedicada
```

#### ❌ Instruções Comprimidas:
```
Feche o SketchUp
  antes de executar o instalador
  Execute o arquivo baixado como administrador
  Siga as instruções na tela
```

## Estratégia de Correção

### Fase 1: Diagnóstico Automatizado
- **Ferramenta**: Playwright + Firecrawl para análise de páginas
- **Escopo**: Identificar todos os artigos com problemas de formatação
- **Critérios**: Detectar listas mal formatadas, textos sem espaçamento, hierarquia visual inadequada

### Fase 2: Padrões de Formatação
- **Definir**: Padrões CSS/HTML para listas, parágrafos, seções
- **Implementar**: Sistema de classes utilitárias para espaçamento consistente
- **Documentar**: Guia de estilo para futuros artigos

### Fase 3: Correção em Massa
- **Supabase**: Acessar banco de artigos via MCP
- **Ref**: Buscar documentação de melhores práticas
- **Serena**: Gerenciar arquivos e padrões de formatação

## Implementação Técnica

### 1. Análise de Dados (Supabase + Playwright)
```javascript
// Identificar artigos com problemas
SELECT id, slug, content 
FROM blog_articles 
WHERE content LIKE '%:%' 
   OR content LIKE '%antes de%'
   OR content NOT LIKE '%\n\n%';
```

### 2. Padrões de Correção

#### ✅ Listas Formatadas Corretamente:
```markdown
## Requisitos Mínimos

- **Sistema Operacional**: Windows 10 ou superior / macOS (versões compatíveis)

- **Placa de Vídeo**: NVIDIA, AMD ou Intel Arc A310 com pelo menos 4GB de VRAM dedicada

- **SketchUp**: Versões compatíveis (consulte documentação oficial)
```

#### ✅ Instruções com Respiração Visual:
```markdown
## Passos de Instalação

1. **Feche o SketchUp** antes de executar o instalador

2. **Execute o arquivo baixado** como administrador

3. **Siga as instruções** na tela de instalação
```

### 3. Classes CSS de Apoio
```css
/* Espaçamento para listas */
.blog-list li {
  margin-bottom: 1rem;
  line-height: 1.6;
}

/* Respiração entre seções */
.blog-section {
  margin-bottom: 2rem;
}

/* Hierarquia visual clara */
.blog-steps {
  counter-reset: step-counter;
}

.blog-steps li {
  counter-increment: step-counter;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}
```

## Cronograma de Execução

### Semana 1: Diagnóstico
- [ ] Análise completa via Playwright de todos os artigos
- [ ] Catalogação de problemas por tipo e severidade
- [ ] Priorização baseada em tráfego e impacto SEO

### Semana 2: Desenvolvimento de Padrões
- [ ] Criação de templates de formatação
- [ ] Implementação de classes CSS específicas
- [ ] Testes A/B com artigos corrigidos

### Semana 3: Correção em Massa
- [ ] Script automatizado de correção via Supabase MCP
- [ ] Aplicação de padrões em artigos prioritários
- [ ] Validação de mudanças via Playwright

### Semana 4: Refinamento e Documentação
- [ ] Ajustes baseados em feedback
- [ ] Documentação de guia de estilo
- [ ] Treinamento para criação de novos artigos

## Métricas de Sucesso

### Técnicas
- **Legibilidade**: Melhoria de 40% no score de legibilidade
- **Tempo na página**: Aumento de 25% no engagement
- **Taxa de rejeição**: Redução de 15%

### SEO
- **Core Web Vitals**: Melhoria no CLS (Cumulative Layout Shift)
- **Tempo de carregamento**: Otimização de renderização de texto
- **Experiência do usuário**: Melhoria nas métricas de usabilidade

## Ferramentas Utilizadas

### MCP Servers
- **Supabase**: Acesso direto ao banco de artigos
- **Ref**: Documentação de melhores práticas de formatação
- **Serena**: Gerenciamento de arquivos e templates
- **Firecrawl**: Análise automatizada de conteúdo web
- **Playwright**: Testes automatizados de renderização

### Tecnologias Complementares
- **TailwindCSS**: Classes utilitárias para formatação consistente
- **React**: Componentes de blog otimizados
- **Vite**: Build system com otimizações de CSS

## Próximos Passos

1. **Executar diagnóstico** completo usando Playwright
2. **Acessar Supabase** via MCP para identificar artigos problemáticos
3. **Implementar correções** seguindo os padrões definidos
4. **Validar mudanças** em ambiente de produção
5. **Monitorar métricas** de sucesso pós-implementação

## Observações Importantes

- **Backup**: Sempre fazer backup do conteúdo antes das alterações
- **SEO**: Preservar URLs e estrutura de headings existente
- **Performance**: Garantir que correções não impactem velocidade
- **Responsividade**: Testar formatação em diferentes dispositivos
- **Acessibilidade**: Manter ou melhorar padrões de acessibilidade

---

*Plano criado para correção sistemática dos problemas de formatação identificados no blog da Escola Habilidade*