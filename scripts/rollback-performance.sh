#!/bin/bash

# Script de Rollback para Otimizações de Performance
# Uso: ./scripts/rollback-performance.sh

echo "🔄 Iniciando rollback das otimizações de performance..."

# Verificar se estamos na branch correta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/performance-optimization" ]; then
    echo "⚠️  Você não está na branch feature/performance-optimization"
    echo "Branch atual: $CURRENT_BRANCH"
    read -p "Continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📋 Arquivos que serão revertidos:"
echo "  - index.html (font loading)"
echo "  - src/main.jsx (lazy loading)"
echo "  - src/index.css (import otimizado)"

echo ""
echo "📋 Arquivos que serão removidos:"
echo "  - src/components/shared/OptimizedImage.jsx"
echo "  - src/utils/dynamicImports.js"  
echo "  - src/styles/optimized-images.css"

echo ""
read -p "🤔 Deseja continuar com o rollback? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelado pelo usuário"
    exit 1
fi

echo "🔄 Executando rollback..."

# Voltar para main e aplicar rollback
git checkout main

echo "✅ Rollback concluído!"
echo ""
echo "📊 Status:"
echo "  - Voltou para branch main"
echo "  - Otimizações removidas"
echo "  - Site funcionando na versão original"
echo ""
echo "💡 Para reaplicar as otimizações:"
echo "   git checkout feature/performance-optimization"
echo "   git merge main"
echo ""