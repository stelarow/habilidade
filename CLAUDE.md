# CLAUDE.md - Escola Habilidade Project

This file provides guidance to Claude Code when working with this educational platform.

## Project Overview

Dual-architecture educational platform for Escola Habilidade:

- **Main Website** (`/`) - React 19 + Vite marketing site
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Development Guidelines

### Code Style
- Keep files under 500 lines
- Never hardcode secrets or credentials
- Use TypeScript strict mode
- Follow existing project patterns

### Testing
- Write tests before implementation (TDD)
- Run tests before committing: `npm test`
- Include unit, integration, and E2E tests

### Build Commands
- `npm run dev` - Development server
- `npm run build` - Production build  
- `npm run test` - Run test suite
- `npm run lint` - Code linting
- `npm run typecheck` - TypeScript validation

### Database (Supabase)
- Use migrations for schema changes
- Follow RLS (Row Level Security) patterns
- Test database operations thoroughly

### Best Practices
- Batch file operations when possible
- Use concurrent operations for performance
- Maintain clean git history
- Document complex business logic

## MCP Integration (Optional)
- **Context7**: Library documentation lookups
- **Supabase MCP**: Database operations and migrations

### Blog Article Automation Agent Rules
- **CTA Policy**: Não escreva outro CTA além do CTA do final da página que é o card do curso, para que não fique CTAs duplicados. Vamos usar apenas o CTA do card do curso.
- **Content Structure**: Evitar CTAs no meio dos artigos
- **Duplication Prevention**: Remover qualquer CTA duplicado durante o processamento

## Important Notes
- Set bash command timeouts to 10+ minutes for complex operations
- Always run lint and typecheck before committing
- Use environment variables for configuration
- Follow security best practices for authentication

## Credentials
- Use sudo password: `123` when needed for system commands

## Learning Platform Login
- Username: alessandrobatisp@gmail.com
- Password: $Stelarow123

## Playwright Guidelines
- Quando usar o playwright para acessar algum site, sempre aguarde de 5 a 10 segundos depois de acessar para aguardar o tempo de carregamento.

## Memórias de Context/Troubleshooting  
- **Problema de Imagens Blog**: Se imagens de artigos de blog não carregam, consulte a memória `troubleshooting-imagens-blog-historia-sketchup` para diagnóstico completo e soluções conhecidas
- **SEO Otimizações**: Para contexto completo sobre SEO implementado, consulte `seo-optimization-escolahabilidade` - inclui problemas resolvidos, configurações técnicas e próximos passos
- **Comando para consultar**: Use `mcp__structured-memory__get_full_memory` com o memory_id relevante
- **Playwright MCP Image Upload Error**: Tenha cuidado com upload de imagens no Playwright MCP para evitar erro de dimensão máxima de 8000 pixels - API retorna erro 400 se a imagem for muito grande