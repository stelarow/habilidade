#!/bin/bash

echo "=== RE-UPLOAD DAS IMAGENS CORROMPIDAS ==="
echo "Fazendo re-upload das 15 imagens que estão com 0 bytes..."
echo

PROJECT_ID="vfpdyllwquaturpcifpl"
BUCKET="imagens-blog"

# Mapeamento das imagens corrompidas para suas URLs originais
declare -A image_urls=(
    ["estilo-moderno-casa-horizonte.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-58.jpeg"
    ["estilo-escandinavo-acolhedor.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-59.jpeg"
    ["estilo-rustico-churrasqueira.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-60.jpeg"
    ["estilo-provencal-cozinha.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-61.jpeg"
    ["estilo-shabby-chic-praia.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-62.jpeg"
    ["estilo-boho-chic-terralma.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-63.jpeg"
    ["estilo-retro-apartamento.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-64.jpeg"
    ["estilo-vintage-loja-luxo.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-65.jpeg"
    ["estilo-tropical-casa-rendada.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-66.jpeg"
    ["estilo-nautico-casa-mar.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-67.jpeg"
    ["estilo-oriental-camboinhas.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-68.jpeg"
    ["estilo-organico-casacor.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-69.jpeg"
    ["estilo-romantico-apartamento.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-70.jpeg"
    ["estilo-pop-art-loft.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-71.jpeg"
    ["estilo-ecletico-bilheteria.jpg"]="https://blog.archtrends.com/wp-content/uploads/2024/09/image-72.jpeg"
)

success_count=0
error_count=0

for filename in "${!image_urls[@]}"; do
    source_url="${image_urls[$filename]}"
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📥 Processando: $filename"
    echo "🔗 URL origem: $source_url"
    
    # Download da imagem
    echo "⬇️  Fazendo download..."
    if curl -L --max-time 30 --silent --output "$filename" "$source_url"; then
        file_size=$(stat -f%z "$filename" 2>/dev/null || stat -c%s "$filename" 2>/dev/null || echo "0")
        
        if [ "$file_size" -gt 1000 ]; then
            echo "✅ Download OK: $file_size bytes"
            
            # Upload para Supabase
            echo "⬆️  Fazendo upload para Supabase..."
            
            upload_response=$(curl -X POST \
                "https://$PROJECT_ID.supabase.co/storage/v1/object/$BUCKET/$filename" \
                -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
                -H "Content-Type: image/jpeg" \
                --data-binary "@$filename" \
                --silent \
                --max-time 60)
            
            if echo "$upload_response" | grep -q '"Key":\|"message":"The resource was created successfully"'; then
                echo "✅ Upload concluído: $filename"
                ((success_count++))
            else
                echo "❌ Erro no upload: $filename"
                echo "Resposta: $upload_response"
                ((error_count++))
            fi
        else
            echo "❌ Download falhou ou arquivo muito pequeno: $file_size bytes"
            ((error_count++))
        fi
        
        # Limpar arquivo local
        rm -f "$filename"
    else
        echo "❌ Erro no download de: $source_url"
        ((error_count++))
    fi
    
    echo
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 RESULTADO FINAL:"
echo "✅ Sucessos: $success_count"
echo "❌ Erros: $error_count"
echo "📊 Total: $((success_count + error_count))"

if [ $success_count -gt 0 ]; then
    echo
    echo "🔄 Testando algumas imagens re-uploadadas..."
    # Testar uma imagem aleatória
    test_url="https://$PROJECT_ID.supabase.co/storage/v1/object/public/$BUCKET/estilo-moderno-casa-horizonte.jpg"
    size=$(curl -sI --max-time 10 "$test_url" | grep -i content-length | cut -d' ' -f2 | tr -d '\r')
    echo "🧪 Teste estilo-moderno-casa-horizonte.jpg: ${size:-'0'} bytes"
fi