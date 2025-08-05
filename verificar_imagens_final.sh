#!/bin/bash

echo "=== Verificação Final das Imagens do Artigo ==="
echo "Testando acessibilidade das imagens no Supabase Storage..."
echo

BASE_URL="https://hnzdlujjpqfwpvmxbrui.supabase.co/storage/v1/object/public/blog-images"

# Lista das imagens que foram upadas
images=(
    "estilos-decoracao-capa.jpg"
    "estilo-moderno-sala.jpg"
    "estilo-contemporaneo-sala.jpg"
    "estilo-minimalista-sala-tv.jpg"
    "estilo-maximalista-sala.jpg"
    "estilo-brutalista-ambiente.jpg"
    "estilo-industrial-sala-tv.jpg"
    "estilo-escandinavo-sala.jpg"
    "estilo-rustico-churrasqueira.jpg"
    "estilo-provencal-cozinha.jpg"
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

success_count=0
error_count=0

for image in "${images[@]}"; do
    url="${BASE_URL}/${image}"
    echo -n "Testando: $image ... "
    
    if curl -I --silent --connect-timeout 10 "$url" | head -1 | grep -q "200 OK"; then
        echo "✓ OK"
        ((success_count++))
    else
        echo "✗ ERRO"
        ((error_count++))
    fi
done

echo
echo "=== Resultado ==="
echo "✓ Imagens acessíveis: $success_count"
echo "✗ Imagens com erro: $error_count"
echo "Total testado: ${#images[@]}"

if [ $error_count -eq 0 ]; then
    echo "🎉 Todas as imagens estão funcionando corretamente!"
else
    echo "⚠️  Algumas imagens precisam de atenção."
fi