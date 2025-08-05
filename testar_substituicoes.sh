#!/bin/bash

echo "=== TESTANDO IMAGENS SUBSTITUÍDAS ==="
echo

BASE_URL="https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog"

# Imagens que foram usadas como substituição
substituted_images=(
    "estilo-moderno-sala.jpg"
    "estilo-escandinavo-sala.jpg"
    "estilo-shabby-chic-jantar.jpg"
    "estilo-boho-chic-ambiente.jpg"
    "estilo-retro-cozinha.jpg"
    "estilo-vintage-sala.jpg"
    "estilo-tropical-sala.jpg"
    "estilo-nautico-sala.jpg"
    "estilo-oriental-quarto.jpg"
    "estilo-organico-sala.jpg"
    "estilo-romantico-quarto.jpg"
    "estilo-pop-art-quarto.jpg"
    "estilo-ecletico-ambiente.jpg"
)

echo "🔄 Testando imagens substituídas..."

all_working=true
for img in "${substituted_images[@]}"; do
    url="$BASE_URL/$img"
    size=$(curl -sI --max-time 8 "$url" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
    
    if [ -z "$size" ] || [ "$size" = "0" ]; then
        echo "❌ $img: ${size:-'unknown'} bytes"
        all_working=false
    else
        echo "✅ $img: $size bytes"
    fi
done

echo
if [ "$all_working" = true ]; then
    echo "🎉 TODAS AS IMAGENS SUBSTITUÍDAS ESTÃO FUNCIONANDO!"
else
    echo "⚠️  Algumas imagens substituídas ainda têm problemas."
fi

echo
echo "🔍 Verificando se ainda restam imagens problemáticas no artigo..."

# Imagens que não foram substituídas (casos especiais)
remaining_issues=(
    "estilo-rustico-churrasqueira.jpg"
    "estilo-provencal-cozinha.jpg"
)

for img in "${remaining_issues[@]}"; do
    url="$BASE_URL/$img"
    size=$(curl -sI --max-time 8 "$url" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
    
    if [ -z "$size" ] || [ "$size" = "0" ]; then
        echo "❌ AINDA CORROMPIDA: $img"
    else
        echo "✅ FUNCIONANDO: $img ($size bytes)"
    fi
done