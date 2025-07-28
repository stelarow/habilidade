# Agent Delegation Workflow Configuration

## Overview
This document defines the automatic delegation patterns between agents for efficient error resolution and mass corrections.

## Agent Hierarchy

```
coverage-analyzer (Primary Controller)
    ↓ delegates test implementation
coverage-test-writer (Implementation Agent) 
    ↓ auto-delegates build failures
build-error-solver (Specialist Agent)
```

## Delegation Triggers

### 1. Automatic Build Failure Delegation

**Trigger:** `npm run build` fails during validation
**Flow:** coverage-analyzer → coverage-test-writer → build-error-solver

**Message Template:**
```
> build-error-solver: O build falhou durante o processo de cobertura de testes. 
Erro reportado: [INSERIR_LOGS_COMPLETOS]

Por favor:
1. Execute npm run build para capturar logs atuais
2. Identifique TODAS as ocorrências do mesmo padrão de erro no codebase usando Grep
3. Corrija TODAS as instâncias encontradas usando Edit
4. Confirme que o build passa após as correções

Este é um caso de correção em massa - garanta que todos os erros similares sejam resolvidos de uma vez.
```

### 2. Mass Error Pattern Detection

**Trigger:** Multiple files with same error type detected
**Flow:** coverage-test-writer → build-error-solver

**Message Template:**
```
> build-error-solver: Detectei padrão de erro em massa durante implementação de testes.
Padrão identificado: [DESCREVER_PADRÃO]
Arquivos afetados: [LISTAR_ARQUIVOS]

Por favor corrija TODAS as ocorrências deste padrão no codebase usando Grep para detecção completa.
```

## Common Error Patterns for Mass Correction

### TypeScript Errors
- **Pattern:** `error.message` without type guards
- **Solution:** `error instanceof Error ? error.message : String(error)`
- **Search:** `grep -r "error.message" src/ --include="*.ts" --include="*.tsx"`

### Import Errors  
- **Pattern:** Missing `logError`, `logDebug` imports
- **Solution:** Add appropriate imports from utils
- **Search:** `grep -r "logError\|logDebug" src/ --include="*.ts" --include="*.tsx"`

### Type Compatibility
- **Pattern:** `File[]` vs `UploadedFile[]` mismatches
- **Solution:** Align interface definitions
- **Search:** `grep -r "onFilesUploaded\|UploadedFile\|File\[\]" src/ --include="*.ts" --include="*.tsx"`

### useEffect Dependencies
- **Pattern:** Missing dependencies in dependency arrays
- **Solution:** Add all referenced variables to dependency array
- **Search:** `grep -r "useEffect" src/ --include="*.ts" --include="*.tsx" -A 5`

## Command Timeouts

All npm commands MUST use 10-minute timeout:
- `npm run build` - 600000ms
- `npm run test` - 600000ms  
- `npm run lint` - 600000ms
- `npm run type-check` - 600000ms

## Validation Sequence

After build-error-solver completes:
1. `npm run build` - confirm build passes
2. `npm run lint` - verify linting rules
3. `npm run type-check` - validate TypeScript
4. Report success/failure to delegating agent

## Agent Interaction Protocol

### Successful Delegation
1. Delegating agent sends structured message
2. build-error-solver acknowledges and begins work
3. build-error-solver reports progress and completion
4. Delegating agent validates and continues workflow

### Failed Delegation
1. If build-error-solver cannot resolve, report specific blocker
2. Delegating agent may attempt manual resolution or escalate
3. Document unresolved patterns for future improvement

## Files Modified by This Configuration

- `/mnt/c/Habilidade/plataforma-ensino/.claude/agents/coverage-analyzer.md`
- `/mnt/c/Habilidade/plataforma-ensino/.claude/agents/coverage-test-writer`  
- `/mnt/c/Habilidade/plataforma-ensino/.claude/agents/build-error-solver.md`
- `/mnt/c/Habilidade/plataforma-ensino/.claude/agents/WORKFLOW_CONFIG.md` (this file)
- `/mnt/c/Habilidade/plataforma-ensino/.claude/agents/DELEGATION_TEST.md`

## Testing the Workflow

To test the complete delegation workflow:

```bash
# Trigger the full workflow from coverage-analyzer
> coverage-analyzer: Execute análise de cobertura com correção automática de build errors.

# Test specific delegation to build-error-solver
> build-error-solver: Analise e corrija erros de build. Execute npm run build e resolva todos os problemas usando detecção em massa com Grep.
```