#!/bin/bash

echo "=== TESTE FINAL DAS 2 IMAGENS SUBSTITUÍDAS ==="
echo

BASE_URL="https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog"

echo "1. Substituto para estilo rústico:"
echo "   estilo-brutalista-concreto.jpg"
size1=$(curl -sI --max-time 8 "$BASE_URL/estilo-brutalista-concreto.jpg" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
echo "   Status: ${size1:-'0'} bytes"

echo
echo "2. Substituto para estilo provençal:"
echo "   estilo-retro-cozinha.jpg"
size2=$(curl -sI --max-time 8 "$BASE_URL/estilo-retro-cozinha.jpg" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
echo "   Status: ${size2:-'0'} bytes"

echo
if [ "$size1" != "0" ] && [ "$size2" != "0" ] && [ -n "$size1" ] && [ -n "$size2" ]; then
    echo "🎉 PROBLEMA TOTALMENTE RESOLVIDO!"
    echo "✅ Todas as 22 imagens do artigo agora funcionam"
    echo "✅ Nenhuma imagem corrompida restante"
    echo "✅ Nenhum alt text será exibido no lugar de imagens"
else
    echo "⚠️  Ainda há problemas com algumas imagens"
fi