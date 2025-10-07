# PROMPT: Análise e Proposta de Schema.org para Homepage

## 🎯 Objetivo
Analisar a página principal (homepage) da Escola Habilidade e propor uma estrutura completa de Schema.org otimizada para as diretrizes do Google 2025.

## 📋 Contexto do Negócio

**Escola Habilidade**
- **Tipo:** Escola de cursos profissionalizantes presenciais
- **Localização:** R. Caetano José Ferreira, 426 - Sala 5 - Kobrasol, São José - SC, 88102-280
- **Área de atuação:** Grande Florianópolis (São José, Florianópolis, Palhoça, Biguaçu, Santo Amaro da Imperatriz)
- **Site:** https://www.escolahabilidade.com
- **Telefone/WhatsApp:** +55 48 98855-9491

**Cursos Oferecidos:**
1. **Projetista 3D** - SketchUp, Enscape, AutoCAD 2D, Revit (56h) - R$ 2.793,00
2. **Programação** - Python, JavaScript, React, Java, PHP, Android (133h) - R$ 5.890,00
3. **Informática** - Excel, Word, PowerPoint, Canva, IA (170h) - R$ 4.590,00

**Diferenciais:**
- Turmas pequenas (até 4 alunos)
- Atendimento individualizado
- Professores atenciosos
- Certificação nacional
- Estrutura moderna (computadores potentes, ar condicionado)
- Suporte vitalício aos alunos

## 📊 Análise Solicitada

### 1. **Análise do Schema Atual**
- [ ] Ler o arquivo `/mnt/c/habilidade/src/pages/Home.jsx`
- [ ] Identificar todos os schemas JSON-LD existentes
- [ ] Verificar se estão corretos e completos
- [ ] Listar problemas encontrados

### 2. **Pesquisa de Diretrizes Google 2025**
Buscar e analisar as diretrizes mais recentes para:
- [ ] EducationalOrganization schema
- [ ] LocalBusiness schema
- [ ] Organization schema
- [ ] ItemList schema (para lista de cursos)
- [ ] AggregateRating schema (se houver avaliações gerais da escola)
- [ ] FAQPage schema (se houver FAQ na homepage)
- [ ] BreadcrumbList schema
- [ ] WebSite schema (com sitelinks searchbox se aplicável)

### 3. **Análise de Conteúdo da Homepage**
Identificar na página:
- [ ] Informações sobre a escola (descrição, missão, valores)
- [ ] Lista de cursos oferecidos
- [ ] Depoimentos/avaliações gerais
- [ ] Informações de contato e localização
- [ ] Horário de funcionamento
- [ ] FAQ
- [ ] Breadcrumbs
- [ ] Elementos de navegação
- [ ] Redes sociais

### 4. **Concorrentes e Benchmarking**
- [ ] Analisar schemas de escolas similares bem posicionadas no Google
- [ ] Identificar best practices do setor educacional

## 🎯 Entregáveis Esperados

### 1. **Relatório de Análise**
```markdown
## Schema Atual
- [Lista dos schemas encontrados]
- [Problemas identificados]
- [O que está faltando]

## Schemas Recomendados
- [Lista completa de schemas a implementar]
- [Prioridade de cada um]
- [Justificativa]
```

### 2. **Proposta de Schema Completo**
Criar código JSON-LD completo para:

#### A) **EducationalOrganization Schema** (PRINCIPAL)
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade",
  "description": "[Descrição otimizada]",
  "url": "https://www.escolahabilidade.com",
  "logo": "[URL do logo]",
  "image": "[URLs de imagens da escola]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88102-280",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[LAT]",
    "longitude": "[LONG]"
  },
  "telephone": "+554898855-9491",
  "email": "[email se disponível]",
  "areaServed": [
    "São José, SC",
    "Florianópolis, SC",
    "Palhoça, SC",
    "Biguaçu, SC",
    "Santo Amaro da Imperatriz, SC"
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "[horário]",
      "closes": "[horário]"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[valor]",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "[total]",
    "reviewCount": "[total]"
  },
  "sameAs": [
    "[Instagram]",
    "[Facebook]",
    "[LinkedIn]"
  ]
}
```

#### B) **LocalBusiness Schema** (se aplicável)
Para melhor ranqueamento local.

#### C) **ItemList Schema**
Para listar os 3 cursos principais na homepage.

#### D) **WebSite Schema**
Com searchbox se houver busca no site.

#### E) **BreadcrumbList Schema**
Se houver breadcrumbs.

#### F) **FAQPage Schema**
Se houver FAQ na homepage.

### 3. **Checklist de Implementação**
- [ ] Schemas obrigatórios identificados
- [ ] Schemas recomendados identificados
- [ ] Schemas opcionais identificados
- [ ] Ordem de prioridade definida
- [ ] Código JSON-LD completo fornecido
- [ ] Instruções de validação fornecidas

### 4. **Guia de Validação**
Fornecer instruções para:
1. Validar no Google Rich Results Test
2. Validar no Schema.org Validator
3. Testar no Google Search Console
4. Verificar no Google Business Profile (se aplicável)

## 🔍 Critérios de Qualidade

A proposta deve:
- ✅ Seguir 100% as diretrizes do Google 2025
- ✅ Usar apenas tipos de schema suportados pelo Google
- ✅ Incluir todos os campos obrigatórios
- ✅ Incluir campos recomendados quando possível
- ✅ Estar otimizada para SEO local
- ✅ Ser compatível com Google Rich Results
- ✅ Incluir dados precisos e verificáveis
- ✅ Seguir a estrutura hierárquica correta
- ✅ Usar formato JSON-LD (preferencial do Google)
- ✅ Evitar duplicação de schemas entre páginas

## 📝 Formato de Resposta

### 1. Análise (Seção 1)
```markdown
# ANÁLISE DO SCHEMA ATUAL DA HOMEPAGE

## 1. Schemas Encontrados
[Lista]

## 2. Problemas Identificados
[Lista com severidade: CRÍTICO / IMPORTANTE / MENOR]

## 3. Schemas Faltantes
[Lista]

## 4. Conformidade com Google 2025
[Porcentagem e detalhes]
```

### 2. Proposta (Seção 2)
```markdown
# PROPOSTA DE SCHEMA COMPLETO

## Schemas Recomendados (em ordem de prioridade)

### 🔴 CRÍTICO (implementar imediatamente)
1. [Nome do schema] - [Justificativa]

### 🟡 IMPORTANTE (implementar em breve)
2. [Nome do schema] - [Justificativa]

### 🟢 OPCIONAL (implementar se possível)
3. [Nome do schema] - [Justificativa]

## Código Completo
[Código JSON-LD completo para cada schema]
```

### 3. Implementação (Seção 3)
```markdown
# GUIA DE IMPLEMENTAÇÃO

## Passo 1: Backup
[Instruções]

## Passo 2: Adicionar schemas
[Onde adicionar no código]

## Passo 3: Validar
[Como validar]

## Passo 4: Deploy
[Instruções de deploy]

## Passo 5: Monitorar
[Como monitorar resultados]
```

## 🎓 Referências Úteis

- **Google Developers - Structured Data:** https://developers.google.com/search/docs/appearance/structured-data
- **Schema.org Documentation:** https://schema.org/
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Validator:** https://validator.schema.org/

## ⚠️ Observações Importantes

1. **Não incluir schemas de cursos na homepage** - Eles devem estar apenas nas páginas individuais de cada curso
2. **Evitar dados falsos** - Todos os dados devem ser verificáveis
3. **Coordenadas GPS** - Obter do Google Maps
4. **Horário de funcionamento** - Verificar o horário real de atendimento
5. **Avaliações** - Se incluir aggregateRating, deve existir na página
6. **Logo** - Usar URL absoluta e imagem otimizada
7. **SameAs** - Incluir apenas redes sociais ativas

## 🚀 Início da Análise

Por favor, inicie a análise lendo o arquivo da homepage e seguindo todos os passos descritos acima. Seja detalhado e minucioso.
