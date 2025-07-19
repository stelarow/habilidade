# PDF Viewer - Correção de Espaços em Branco

## 📋 Resumo do Problema

O PDF viewer está exibindo um grande espaço em branco (3x-4x o tamanho do conteúdo) após o conteúdo real do PDF. Este problema ocorre repetidamente mesmo após correções anteriores.

### 🔍 Causa Raiz Identificada
- **Container Height**: 2262px 
- **Canvas Height**: 1131px
- **Ratio**: 2:1 (container tem exatamente o dobro da altura do canvas)
- **CSS Conflitante**: Estilos globais forçando `height: auto !important` no canvas
- **Container Fixo**: `min-h-[600px]` mantém altura mínima independente do conteúdo

---

## ✅ TASK 1: Backup dos Arquivos Atuais

**Objetivo**: Criar backup antes das modificações

```bash
# Executar na pasta do projeto
cp src/components/lesson/PDFSection.tsx src/components/lesson/PDFSection.tsx.backup
cp src/components/lesson/PDFSectionWrapper.tsx src/components/lesson/PDFSectionWrapper.tsx.backup
```

**Validação**: 
- [ ] Arquivos .backup criados
- [ ] Backup contém código original

---

## ✅ TASK 2: Remover CSS Global Conflitante

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar e REMOVER completamente** as linhas 237-252:
```jsx
<style jsx global>{`
  .react-pdf__Page {
    margin: 0 auto !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  }
  .react-pdf__Page__canvas {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
  }
  .react-pdf__Document {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
`}</style>
```

**Resultado Esperado**: CSS global removido, sem conflitos com props do react-pdf

**Validação**:
- [ ] Bloco `<style jsx global>` completamente removido
- [ ] Não há mais `!important` forçando estilos do PDF

---

## ✅ TASK 3: Corrigir Container CSS

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar linha 316** e modificar:

**ANTES**:
```jsx
<div 
  ref={pdfSectionRef}
  className="relative bg-muted rounded-lg min-h-[600px] mb-4 overflow-auto flex items-start justify-center"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
```

**DEPOIS**:
```jsx
<div 
  ref={pdfSectionRef}
  className="relative bg-muted rounded-lg mb-4 overflow-auto flex items-start justify-center"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
```

**Mudança**: Remover `min-h-[600px]` para permitir altura dinâmica

**Validação**:
- [ ] `min-h-[600px]` removido
- [ ] Container pode ajustar altura dinamicamente

---

## ✅ TASK 4: Otimizar Props do react-pdf

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar linha 361** e modificar o componente `Page`:

**ANTES**:
```jsx
<Page
  pageNumber={currentPage}
  scale={scale}
  width={pageWidth}
  onClick={handlePageClick}
  className="shadow-lg max-w-full mx-auto"
  loading={
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  }
  renderTextLayer={false}
  renderAnnotationLayer={true}
/>
```

**DEPOIS**:
```jsx
<Page
  pageNumber={currentPage}
  width={pageWidth}
  onClick={handlePageClick}
  className="shadow-lg max-w-full mx-auto"
  loading={
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  }
  renderTextLayer={false}
  renderAnnotationLayer={true}
/>
```

**Mudança**: Remover prop `scale={scale}` para evitar conflito com `width`

**Validação**:
- [ ] Prop `scale` removida do componente Page
- [ ] Apenas `width` é usado para dimensionamento

---

## ✅ TASK 5: Ajustar Zoom Controls

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Problema**: Com a remoção do `scale`, os controles de zoom não funcionarão.

**Localizar linhas 172-178** e modificar:

**ANTES**:
```jsx
const zoomIn = () => {
  setScale(prev => Math.min(prev + 0.2, 2.0))
}

const zoomOut = () => {
  setScale(prev => Math.max(prev - 0.2, 0.5))
}
```

**DEPOIS**:
```jsx
const zoomIn = () => {
  setPageWidth(prev => Math.min(prev + 100, 1200))
}

const zoomOut = () => {
  setPageWidth(prev => Math.max(prev - 100, 400))
}
```

**Mudança**: Usar `pageWidth` para zoom em vez de `scale`

**Validação**:
- [ ] Zoom controla `pageWidth` em vez de `scale`
- [ ] Limites mínimo (400px) e máximo (1200px) definidos

---

## ✅ TASK 6: Atualizar Display de Zoom

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar linha 291** e modificar:

**ANTES**:
```jsx
<span className="text-sm">{Math.round(scale * 100)}%</span>
```

**DEPOIS**:
```jsx
<span className="text-sm">{Math.round((pageWidth / 800) * 100)}%</span>
```

**Mudança**: Calcular porcentagem baseada em `pageWidth` (800px = 100%)

**Validação**:
- [ ] Display de zoom atualizado
- [ ] Porcentagem baseada em pageWidth

---

## ✅ TASK 7: Corrigir Fullscreen Mode

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar linha 516** no modo fullscreen e modificar:

**ANTES**:
```jsx
<Page
  pageNumber={currentPage}
  scale={scale}
  width={Math.min(pageWidth * 1.5, window.innerWidth - 100)}
  onClick={handlePageClick}
  className="shadow-lg max-w-full mx-auto"
  loading={
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
  }
  renderTextLayer={false}
  renderAnnotationLayer={true}
/>
```

**DEPOIS**:
```jsx
<Page
  pageNumber={currentPage}
  width={Math.min(pageWidth * 1.5, window.innerWidth - 100)}
  onClick={handlePageClick}
  className="shadow-lg max-w-full mx-auto"
  loading={
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
  }
  renderTextLayer={false}
  renderAnnotationLayer={true}
/>
```

**Mudança**: Remover `scale={scale}` também do modo fullscreen

**Validação**:
- [ ] Prop `scale` removida do fullscreen
- [ ] Apenas `width` usado para dimensionamento

---

## ✅ TASK 8: Atualizar Zoom Controls Fullscreen

**Arquivo**: `src/components/lesson/PDFSection.tsx`

**Localizar linha 573** e modificar:

**ANTES**:
```jsx
<span className="text-sm px-2">{Math.round(scale * 100)}%</span>
```

**DEPOIS**:
```jsx
<span className="text-sm px-2">{Math.round((pageWidth / 800) * 100)}%</span>
```

**Validação**:
- [ ] Display de zoom no fullscreen atualizado
- [ ] Cálculo consistente com modo normal

---

## ✅ TASK 9: Testar Correções

**Executar**:
```bash
npm run build
```

**Navegar para**: `https://plataformahabilidade.netlify.app/course/teste-de-curso/lesson/aqui-o-titulo`

**Validações de Teste**:
- [ ] PDF carrega sem espaços em branco excessivos
- [ ] Container tem altura igual ao conteúdo do PDF
- [ ] Controles de zoom funcionam (aumenta/diminui pageWidth)
- [ ] Fullscreen mode funciona corretamente
- [ ] Navegação entre páginas mantém dimensionamento correto

---

## ✅ TASK 10: Verificação de Qualidade

**CSS Debug** (temporário para teste):
```css
/* Adicionar temporariamente para debug */
.react-pdf__Page {
  border: 2px solid red !important;
}
.react-pdf__Document {
  border: 2px solid blue !important;
}
```

**Validações Finais**:
- [ ] Container PDF (azul) tem altura igual ao conteúdo
- [ ] Page PDF (vermelho) não tem espaço extra
- [ ] Ratio container:canvas próximo de 1:1
- [ ] Zoom funciona alterando largura, não escala

**Remover CSS debug após validação**

---

## 🎯 Resultado Esperado

Após todas as tasks:
- ✅ PDF sem espaços em branco excessivos
- ✅ Container com altura dinâmica (fit-content)
- ✅ Zoom funcional via pageWidth
- ✅ Modo fullscreen corrigido
- ✅ Problema não retorna após deployments

---

## 🚨 Rollback Plan

Se algo der errado:
```bash
# Restaurar backups
cp src/components/lesson/PDFSection.tsx.backup src/components/lesson/PDFSection.tsx
cp src/components/lesson/PDFSectionWrapper.tsx.backup src/components/lesson/PDFSectionWrapper.tsx
```

---

## 📝 Notas Técnicas

**Por que este fix resolve definitivamente**:
1. Remove conflitos CSS entre estilos globais e props react-pdf
2. Permite que react-pdf gerencie suas próprias dimensões
3. Usa apenas `width` prop para dimensionamento (padrão react-pdf)
4. Container ajusta automaticamente à altura do conteúdo
5. Zoom baseado em width é mais estável que scale

**Versão react-pdf**: 10.0.1 (compatível com essas mudanças)