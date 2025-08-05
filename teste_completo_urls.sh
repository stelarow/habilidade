#!/bin/bash

echo "=== TESTE COMPLETO DE DEPURAÇÃO DAS URLs ==="
echo

BASE_URL="https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog"

# URLs problemáticas mencionadas pelo usuário
urls=(
    "estilo-moderno-casa-horizonte.jpg|Casa moderna com linhas limpas"
    "estilo-rustico-churrasqueira.jpg|Área de churrasqueira rústica"
    "estilo-contemporaneo-familia-borba.jpg|Ambiente contemporâneo"
    "estilo-industrial-cobertura.jpg|Sala industrial"
    "estilo-minimalista-lareira-sobrado.jpg|Ambiente minimalista"
    "estilos-decoracao-principal.jpeg|Imagem principal"
)

for item in "${urls[@]}"; do
    IFS='|' read -r filename description <<< "$item"
    url="${BASE_URL}/${filename}"
    
    echo "=== Testando: $description ==="
    echo "Arquivo: $filename"
    echo "URL: $url"
    echo
    
    # Teste 1: Status HTTP
    echo "📊 Status HTTP:"
    response=$(curl -I --silent --max-time 10 "$url" | head -1)
    echo "$response"
    
    # Teste 2: Headers completos
    echo "📋 Headers importantes:"
    curl -I --silent --max-time 10 "$url" | grep -E "(Content-Type|Content-Length|Cache-Control|ETag)" || echo "Headers não encontrados"
    
    # Teste 3: Teste de conectividade
    echo "🔗 Conectividade:"
    if curl --output /dev/null --silent --head --fail --max-time 10 "$url"; then
        echo "✅ URL acessível"
    else
        echo "❌ URL com problema"
    fi
    
    # Teste 4: Tamanho do arquivo
    echo "📏 Tamanho:"
    size=$(curl -sI --max-time 10 "$url" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
    if [ -n "$size" ]; then
        echo "Tamanho: $size bytes"
    else
        echo "Tamanho não detectado"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
done

echo "=== TESTE DE URL CODIFICADA ==="
# Testar se há algum problema de encoding
test_url="${BASE_URL}/estilo-moderno-casa-horizonte.jpg"
echo "URL original: $test_url"
echo "URL codificada: $(printf '%s\n' "$test_url" | sed 's/ /%20/g')"

# Teste final com wget para ver se há diferença
echo
echo "=== TESTE COM WGET ==="
if wget --spider --quiet --timeout=10 "$test_url" 2>/dev/null; then
    echo "✅ wget: URL acessível"
else
    echo "❌ wget: URL com problema"
fi