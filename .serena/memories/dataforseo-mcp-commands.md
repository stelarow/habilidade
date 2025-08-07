# DataForSEO MCP Server - Comandos e Ferramentas

## Status da Instalação
- **Servidor**: DataForSEO MCP Server
- **Status**: ✓ Instalado e conectado
- **Localização**: `/mnt/c/Habilidade/dataforseo-mcp-server/run-server.js`
- **Escopo**: User (disponível em todos os projetos)

## Credenciais Configuradas
- **Login**: gekawa1878@efpaper.com
- **Password**: 41f48333ee5ced52
- **Autenticação**: Basic Auth (Base64)

## Ferramentas Disponíveis

### 1. dataforseo_serp_google_organic
**Descrição**: Busca orgânica do Google - Obtém resultados de pesquisa orgânica do Google
**Parâmetros**:
- `keyword` (string): Palavra-chave para pesquisar
- `location_code` (number): Código de localização (ex: 2076 para Brasil, 2840 para EUA)
- `language_code` (string): Código do idioma (ex: 'pt' para português, 'en' para inglês)

**Exemplo de uso**:
```
Analise os resultados SERP para "curso de programação" no Brasil
```

### 2. dataforseo_keywords_search_volume
**Descrição**: Volume de busca de palavras-chave - Obtém dados de volume de pesquisa mensal
**Parâmetros**:
- `keywords` (array): Lista de palavras-chave para analisar
- `location_code` (number): Código de localização
- `language_code` (string): Código do idioma

**Exemplo de uso**:
```
Qual o volume de busca para ["python curso", "javascript tutorial", "programação iniciante"] no Brasil?
```

### 3. dataforseo_domain_overview
**Descrição**: Visão geral de domínio - Análise completa de métricas de um domínio
**Parâmetros**:
- `target` (string): Domínio para analisar (ex: "example.com")
- `location_code` (number): Código de localização
- `language_code` (string): Código do idioma

**Exemplo de uso**:
```
Faça uma análise completa do domínio escolahabilidade.com
```

### 4. dataforseo_keyword_ideas
**Descrição**: Ideias de palavras-chave - Sugestões de palavras-chave relacionadas
**Parâmetros**:
- `keywords` (array): Palavras-chave sementes
- `location_code` (number): Código de localização
- `language_code` (string): Código do idioma
- `limit` (number): Número máximo de resultados (padrão: 100)

**Exemplo de uso**:
```
Sugira 50 palavras-chave relacionadas a "marketing digital" para o mercado brasileiro
```

### 5. dataforseo_locations
**Descrição**: Localizações disponíveis - Lista códigos de localização para usar nas pesquisas
**Parâmetros**:
- `country` (string): Código do país (ex: 'BR' para Brasil, 'US' para EUA)

**Exemplo de uso**:
```
Liste todas as localizações disponíveis para o Brasil
```

## Códigos de Localização Comuns
- **Brasil**: 2076
- **São Paulo, BR**: 20097
- **Rio de Janeiro, BR**: 20098
- **Estados Unidos**: 2840
- **Portugal**: 2620
- **Reino Unido**: 2826

## Códigos de Idioma Comuns
- **Português (BR)**: pt
- **Inglês**: en
- **Espanhol**: es
- **Francês**: fr
- **Alemão**: de

## Como Reinstalar (se necessário)
```bash
# Remover servidor existente
claude mcp remove dataforseo

# Adicionar novamente
claude mcp add dataforseo --env DATAFORSEO_LOGIN=gekawa1878@efpaper.com --env DATAFORSEO_PASSWORD=41f48333ee5ced52 --scope user -- node /mnt/c/Habilidade/dataforseo-mcp-server/run-server.js

# Verificar status
claude mcp list
```

## Notas Importantes
- O servidor está configurado no escopo "user", disponível em todos os projetos
- As credenciais estão configuradas como variáveis de ambiente
- O servidor usa autenticação Basic Auth com Base64
- Todos os endpoints usam a API v3 do DataForSEO
- Base URL: https://api.dataforseo.com/v3

## Casos de Uso Típicos
1. **Pesquisa de palavras-chave**: Identificar oportunidades de SEO
2. **Análise de concorrência**: Comparar domínios e rankings
3. **Monitoramento SERP**: Acompanhar posições nos resultados de busca
4. **Expansão de conteúdo**: Descobrir tópicos relacionados
5. **Análise de mercado**: Entender tendências de busca por região