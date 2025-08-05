# Troubleshooting: Erro marked.js toLowerCase no Blog (v2)

## Problema
Todos os artigos do blog estão exibindo o erro:
```
An error occurred:
l.toLowerCase is not a function
Please report this to https://github.com/markedjs/marked.
```

## Contexto
- **URL Afetada**: https://www.escolahabilidade.com/blog/historia-sketchup-software-arquitetura (e todos outros artigos)
- **Ambiente**: Site principal (React + Vite), não a plataforma de ensino
- **Versão do marked.js**: 16.1.2
- **Arquivo responsável**: `src/utils/contentProcessor.js`

## Tentativas de Correção

### Tentativa #1 (Commit a7cd293)
- Mudou de `new marked.Renderer()` para objeto literal
- Mudou de `marked.setOptions()` para `marked.use()`
- **Resultado**: Build OK mas erro persistiu

### Tentativa #2 (Commit 869607c) 
- Reescreveu completamente o contentProcessor.js
- Estrutura correta para marked v16:
```javascript
marked.use({
  renderer: {
    heading(text, level) { ... },
    paragraph(text) { ... },
    // todos os métodos dentro do objeto renderer
  },
  breaks: true,
  gfm: true,
  pedantic: false,
  silent: true
});

// Highlight separado
marked.setOptions({
  highlight: function(code, lang) { ... }
});
```
- **Resultado**: Build OK, aguardando verificação no site

## Análise Técnica
O erro sugere que algo está tentando chamar `.toLowerCase()` em um valor que não é string. Possíveis causas:
1. Campo null/undefined sendo passado para o marked
2. Incompatibilidade na API do marked v16
3. Problema no conteúdo do artigo em si

## Próximas Ações se o Erro Persistir
1. Adicionar logs detalhados no processContent() para identificar o valor exato causando erro
2. Verificar se o conteúdo do banco tem algum campo null/undefined
3. Considerar downgrade do marked para v12 ou v11
4. Implementar processador markdown alternativo (remark, markdown-it)