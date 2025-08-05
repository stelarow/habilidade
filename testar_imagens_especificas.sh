#!/bin/bash

echo "=== Testando imagens específicas mencionadas pelo usuário ==="
echo

BASE_URL="https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog"

# Imagens que o usuário mencionou como problemáticas
echo "Testando imagens que causaram erro 'Imagem não encontrada':"
echo

# Mapeamento das descrições para nomes de arquivos prováveis
declare -A image_map=(
    ["Casa moderna com linhas limpas"]="estilo-moderno-casa-horizonte.jpg"
    ["Área de churrasqueira rústica"]="estilo-rustico-churrasqueira.jpg"
    ["Ambiente contemporâneo"]="estilo-contemporaneo-familia-borba.jpg"
    ["Sala industrial"]="estilo-industrial-cobertura.jpg"
    ["Ambiente minimalista"]="estilo-minimalista-lareira-sobrado.jpg"
)

for description in "${!image_map[@]}"; do
    image="${image_map[$description]}"
    url="${BASE_URL}/${image}"
    
    echo "Testando: $description"
    echo "Arquivo: $image"
    echo -n "Status: "
    
    # Usar timeout mais curto para diagnóstico rápido
    if timeout 8s curl -I --silent --max-time 8 "$url" | head -1 | grep -q "200"; then
        echo "✓ ACESSÍVEL"
    else
        echo "✗ PROBLEMA DE ACESSO"
    fi
    echo "---"
done

echo
echo "=== Teste de conectividade geral ==="
echo -n "Testando conectividade com Supabase: "
if timeout 5s curl -I --silent --max-time 5 "https://vfpdyllwquaturpcifpl.supabase.co" | head -1 | grep -q "200\|404"; then
    echo "✓ Conectando"
else
    echo "✗ Problema de conectividade"
fi