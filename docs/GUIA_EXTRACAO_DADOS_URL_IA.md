# Guia de Extração de Dados de URL pela IA

## Visão Geral

Este documento descreve o processo de extração de dados de URLs externas, incluindo conteúdo textual e imagens, para processamento automatizado pela IA.

## Processo de Extração

### 1. Validação e Análise Inicial da URL

#### 1.1 Validação da URL
```typescript
- Verificar se a URL é válida e acessível
- Detectar o tipo de conteúdo (HTML, JavaScript renderizado, etc.)
- Verificar se há proteções anti-scraping
- Avaliar a acessibilidade do conteúdo
```

#### 1.2 Detecção de Proteções
- **Cloudflare**: Detectar e contornar com proxy rotation
- **CAPTCHA**: Identificar necessidade de solução manual
- **JavaScript Rendering**: Usar automação de browser quando necessário
- **Rate Limiting**: Implementar delays apropriados
- **User-Agent Blocking**: Randomizar headers

### 2. Estratégias de Extração

#### 2.1 Hierarquia de Métodos
```
1. firecrawl_scrape (Primário)
   - Scraping avançado com suporte a JavaScript
   - Melhor para conteúdo dinâmico
   
2. webfetch_extraction (Secundário)
   - Extração HTML básica
   - Mais rápido para conteúdo estático
   
3. manual_parsing (Fallback)
   - Parsing customizado
   - Para casos especiais
```

#### 2.2 Conteúdo Dinâmico
Para sites com JavaScript pesado:
```typescript
- Usar Playwright/Puppeteer
- Aguardar carregamento completo (networkidle2)
- Detectar e processar infinite scroll
- Capturar conteúdo após execução do JS
```

### 3. Extração de Imagens

#### 3.1 Processo de Download
```typescript
const imageProcessing = {
  downloadTimeout: 30000,     // 30 segundos
  maxRetries: 3,             // 3 tentativas
  maxFileSize: 10485760,     // 10MB
  allowedFormats: ['jpg', 'png', 'webp', 'svg']
};
```

#### 3.2 Otimização de Imagens
- **Qualidade**: 85% (balanço entre qualidade e tamanho)
- **Dimensões Máximas**: 1200x800 pixels
- **Formato**: Conversão para WebP quando possível
- **Progressive Loading**: Habilitado
- **Metadata**: Removida para economia de espaço

#### 3.3 Geração de Variantes Responsivas
```
Tamanhos gerados:
- 320px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1200px (desktop large)
```

#### 3.4 Tratamento de Falhas
- **Imagem não disponível**: Usar placeholder
- **Timeout excedido**: Pular ou retry com delay
- **Formato não suportado**: Converter ou pular
- **Tamanho excedido**: Comprimir agressivamente

### 4. Análise de Qualidade do Conteúdo

#### 4.1 Métricas de Qualidade
```typescript
- Completude do conteúdo extraído
- Presença de elementos essenciais (título, corpo, etc.)
- Qualidade das imagens
- Estrutura hierárquica preservada
- Links e referências mantidos
```

#### 4.2 Detecção de Problemas
- Conteúdo truncado
- Imagens quebradas
- Encoding incorreto
- Estrutura malformada

### 5. Cache e Otimização

#### 5.1 Sistema de Cache
```typescript
contentCache: {
  url: string,
  content: ExtractedContent,
  timestamp: number,
  hash: string,
  expiresAt: number (24 horas)
}
```

#### 5.2 Verificação de Mudanças
- Gerar hash do conteúdo
- Comparar com cache existente
- Atualizar apenas se houver mudanças

### 6. Tratamento de Casos Especiais

#### 6.1 Sites com Infinite Scroll
```typescript
async handleInfiniteScroll(page) {
  let previousHeight = 0;
  let currentHeight = await page.evaluate('document.body.scrollHeight');
  
  while (currentHeight > previousHeight) {
    previousHeight = currentHeight;
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await page.waitForTimeout(2000);
    currentHeight = await page.evaluate('document.body.scrollHeight');
  }
}
```

#### 6.2 Conteúdo Paginado
- Detectar links de paginação
- Extrair todas as páginas relevantes
- Consolidar conteúdo em ordem

#### 6.3 Conteúdo Protegido por Login
- Identificar requirement de autenticação
- Notificar necessidade de credenciais
- Implementar automação de login se autorizado

### 7. Logging e Debugging

#### 7.1 Informações Registradas
```typescript
- URL processada
- Timestamp de início/fim
- Método de extração usado
- Quantidade de conteúdo extraído
- Número e tamanho de imagens
- Erros e warnings encontrados
- Performance metrics
```

#### 7.2 Debug Context
```typescript
debugContext: {
  sourceComplexity: 1-10,
  extractionDifficulty: 1-10,
  potentialIssues: string[],
  recommendedActions: string[]
}
```

### 8. Performance e Limites

#### 8.1 Limites de Processamento
- **Timeout máximo**: 2 minutos por URL
- **Memória máxima**: 500MB por processo
- **Tamanho máximo de conteúdo**: 10MB
- **Número máximo de imagens**: 50 por artigo

#### 8.2 Processamento em Lote
- Processar imagens em lotes de 5
- Limpar memória entre lotes
- Usar paralelização quando apropriado

### 9. Validação Final

#### 9.1 Checklist de Validação
- [ ] Conteúdo principal extraído completamente
- [ ] Todas as imagens relevantes processadas
- [ ] Estrutura do documento preservada
- [ ] Metadata extraída corretamente
- [ ] Sem conteúdo duplicado
- [ ] Encoding correto (UTF-8)

#### 9.2 Relatório de Extração
```typescript
extractionReport: {
  success: boolean,
  contentQuality: 0-100,
  imagesProcessed: number,
  warnings: string[],
  errors: string[],
  recommendations: string[]
}
```

## Considerações de Segurança

- Nunca executar JavaScript não confiável
- Validar todos os URLs antes do acesso
- Implementar rate limiting para evitar bloqueios
- Respeitar robots.txt quando aplicável
- Sanitizar conteúdo extraído antes do processamento

## Melhores Práticas

1. **Sempre ter fallbacks**: Se um método falha, tentar o próximo
2. **Logging detalhado**: Registrar cada passo para debugging
3. **Validação contínua**: Checar qualidade em cada etapa
4. **Otimização de recursos**: Liberar memória após cada operação
5. **Resiliência**: Continuar mesmo com falhas parciais