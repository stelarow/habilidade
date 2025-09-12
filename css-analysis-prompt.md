# Análise do Warning CSS - Prompt para IA

## Contexto do Problema

Durante o build de produção do projeto React (Vite + TailwindCSS), está ocorrendo o seguinte warning de sintaxe CSS no minificador esbuild:

```
▲ [WARNING] Expected ")" to end URL token [css-syntax-error]
    <stdin>:1:21100:
      1 │ ... img[data-webp]{content:url(attr(data-webp))}img[srcset]{height:...
        ╵                                    ^

  The unbalanced "(" is here:
    <stdin>:1:21095:
      1 │ ....webp img[data-webp]{content:url(attr(data-webp))}img[srcset]{he...
        ╵                                    ^
```

## Código Problemático Atual

**Arquivo:** `src/styles/optimized-images.css` (linhas 43-48)

```css
/* Suporte a WebP com fallback - Usando background-image ao invés de content */
.webp img[data-webp] {
  background-image: attr(data-webp url);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
```

## Histórico de Tentativas

1. **Versão original (problemática):**
   ```css
   .webp img[data-webp] {
     content: url(attr(data-webp));
   }
   ```

2. **Primeira correção tentada:**
   ```css
   .webp img[data-webp] {
     background-image: attr(data-webp url);
     background-size: contain;
     background-repeat: no-repeat;
     background-position: center;
   }
   ```

## Informações Técnicas

- **Minificador:** esbuild (via Vite 7.0.6)
- **Projeto:** React 19 + Vite + TailwindCSS 4
- **Objetivo:** Implementar fallback para WebP em browsers que não suportam
- **Build:** O build completa com sucesso, mas gera warning que gostaríamos de eliminar

## Análise Necessária

Por favor, analise:

1. **Por que a sintaxe `attr(data-webp url)` está causando warning no esbuild?**
2. **Qual é a sintaxe correta e compatível com minificadores modernos?**
3. **A função `attr()` é suportada dentro de `background-image` ou `url()`?**
4. **Existem alternativas CSS puras para implementar WebP fallback?**
5. **Seria melhor remover esta regra e implementar via JavaScript?**

## Contexto de Uso

Este CSS faz parte de um sistema de otimização de imagens que:
- Detecta suporte a WebP via classe `.webp` no `<html>`
- Usa atributo `data-webp` nas tags `<img>` com URLs WebP
- Deve fazer fallback para formato original se WebP não for suportado

## Objetivo

Eliminar o warning CSS mantendo funcionalidade, ou determinar se esta abordagem deve ser substituída por uma solução JavaScript.