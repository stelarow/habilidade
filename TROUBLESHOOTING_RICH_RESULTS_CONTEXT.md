# TROUBLESHOOTING: Google Rich Results - Structured Data Errors

## 🎯 PROBLEMA IDENTIFICADO
**Status**: Google Rich Results Test detecta 18 itens - 8 inválidos com 3 erros críticos cada

**Root Cause**: Structured data JSON-LD com schema incorreto nos cursos, NÃO são URLs 404

## 📊 SITUAÇÃO ATUAL

### ✅ Válidos (10 itens)
- Course list item: 8 válidos  
- Local Business: 1 válido
- Organization: 1 válido

### ❌ Inválidos (8 itens - Course info)
Todos os 8 cursos têm **3 erros críticos idênticos**:

| Curso | URL | Status |
|-------|-----|---------|
| Programação | `/cursos/programacao` | 3 erros |
| Design Gráfico | `/cursos/design-grafico` | 3 erros |
| Projetista 3D | `/cursos/projetista-3d` | 3 erros |
| Edição de Vídeo | `/cursos/edicao-video` | 3 erros |
| Marketing Digital | `/cursos/marketing-digital` | 3 erros |
| Inteligência Artificial | `/cursos/inteligencia-artificial` | 3 erros |
| Business Intelligence | `/cursos/business-intelligence` | 3 erros |
| Informática | `/cursos/informatica` | 3 erros |

## 🚨 ERROS CRÍTICOS (JSON-LD Schema)

### 1. Missing courseWorkload/courseSchedule
```
hasCourseInstance: "É preciso especificar 'courseWorkload' ou 'courseSchedule'"
```

### 2. Invalid courseMode Values  
```
courseMode: "OnlineEventAttendanceMode" → Valor de enumeração inválido
courseMode: "OfflineEventAttendanceMode" → Valor de enumeração inválido
```

### 3. Schema Structure Issues
- Formato incorreto de duração
- URLs schema.org malformadas

## 🔧 CORREÇÕES NECESSÁRIAS

**Local**: `src/utils/courseHelpers.js:140-155`

### Fix 1: courseMode URLs Completas
```javascript
// ❌ Atual
'courseMode': ['OnlineEventAttendanceMode', 'OfflineEventAttendanceMode']

// ✅ Correto  
'courseMode': ['https://schema.org/OnlineEventAttendanceMode', 'https://schema.org/OfflineEventAttendanceMode']
```

### Fix 2: Add courseWorkload
```javascript
// ✅ Adicionar
'courseWorkload': safeCourse.basicInfo.duration, // "56 horas" → "PT56H"
```

### Fix 3: courseSchedule Format
```javascript
// ✅ Corrigir formato ISO 8601
'courseSchedule': {
  '@type': 'Schedule',
  'duration': 'PT56H', // Formato ISO correto
  'repeatFrequency': 'P1M', // Mensal
  'scheduleTimezone': 'America/Sao_Paulo'
}
```

## 📋 CONTEXTO TÉCNICO

### React Error #418
- **Causa**: Hydration mismatch (Date.now(), typeof window)
- **Status**: Não impacta structured data 
- **Resolução**: Problema apenas em dev, produção funciona

### SEO Strategy  
- **Status**: Funcionando corretamente
- **Local SEO**: Páginas específicas para Florianópolis/São José/Palhoça
- **Keywords**: "curso sketchup florianópolis" etc direcionam para Projetista 3D
- **Não alterar**: Estratégia SEO está eficaz

## ⚡ NEXT ACTION
1. **Corrigir** structured data em `src/utils/courseHelpers.js`
2. **Testar** com Google Rich Results Test  
3. **Validar** 8 cursos sem erros críticos
4. **Monitorar** structured data no Search Console

## 🎯 OBJETIVO FINAL
- 0 erros críticos nos 8 cursos
- 18 itens válidos no Rich Results Test  
- Manter SEO strategy intacta
- Rich snippets funcionando no Google Search

---
*Última atualização: Aug 6, 2025 | Status: Aguardando implementação das correções*