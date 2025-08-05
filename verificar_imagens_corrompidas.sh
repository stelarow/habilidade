#!/bin/bash

echo "=== VERIFICANDO IMAGENS CORROMPIDAS (0 bytes) ==="
echo

BASE_URL="https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog"

# Todas as imagens do artigo
images=(
    "estilos-decoracao-principal.jpeg"
    "estilo-neoclassico-sala.jpg"
    "estilo-moderno-casa-horizonte.jpg"
    "estilo-contemporaneo-familia-borba.jpg"
    "estilo-minimalista-lareira-sobrado.jpg"
    "estilo-maximalista-casa-colorida.jpg"
    "estilo-brutalista-concreto.jpg"
    "estilo-industrial-cobertura.jpg"
    "estilo-escandinavo-acolhedor.jpg"
    "estilo-rustico-churrasqueira.jpg"
    "estilo-provencal-cozinha.jpg"
    "estilo-shabby-chic-praia.jpg"
    "estilo-boho-chic-terralma.jpg"
    "estilo-retro-apartamento.jpg"
    "estilo-vintage-loja-luxo.jpg"
    "estilo-tropical-casa-rendada.jpg"
    "estilo-nautico-casa-mar.jpg"
    "estilo-oriental-camboinhas.jpg"
    "estilo-organico-casacor.jpg"
    "estilo-romantico-apartamento.jpg"
    "estilo-pop-art-loft.jpg"
    "estilo-ecletico-bilheteria.jpg"
)

corrupted_images=()
working_images=()

for image in "${images[@]}"; do
    url="${BASE_URL}/${image}"
    
    # Pegar o tamanho do arquivo
    size=$(curl -sI --max-time 8 "$url" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
    
    if [ -z "$size" ] || [ "$size" = "0" ]; then
        echo "❌ CORROMPIDA: $image (${size:-'unknown'} bytes)"
        corrupted_images+=("$image")
    else
        echo "✅ OK: $image ($size bytes)"
        working_images+=("$image")
    fi
done

echo
echo "=== RESUMO ==="
echo "🎯 Imagens funcionando: ${#working_images[@]}"
echo "❌ Imagens corrompidas: ${#corrupted_images[@]}"
echo

if [ ${#corrupted_images[@]} -gt 0 ]; then
    echo "📋 IMAGENS QUE PRECISAM SER RE-UPLOADED:"
    printf '%s\n' "${corrupted_images[@]}"
fi