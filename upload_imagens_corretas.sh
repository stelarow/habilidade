#!/bin/bash

# URLs das imagens reais do artigo original
images=(
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-58.jpeg|estilo-moderno-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-41.jpeg|estilo-contemporaneo-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-48.jpeg|estilo-minimalista-sala-tv.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-44.jpeg|estilo-maximalista-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-43.jpeg|estilo-brutalista-ambiente.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-51.jpeg|estilo-industrial-sala-tv.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-52.jpeg|estilo-escandinavo-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-59.jpeg|estilo-rustico-churrasqueira.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-42.jpeg|estilo-provencal-cozinha.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-53.jpeg|estilo-shabby-chic-jantar.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-40.jpeg|estilo-boho-chic-ambiente.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-45.jpeg|estilo-retro-cozinha.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-56.jpeg|estilo-vintage-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-55.jpeg|estilo-tropical-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-50.jpeg|estilo-nautico-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-57.jpeg|estilo-oriental-quarto.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-54.jpeg|estilo-organico-sala.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-49.jpeg|estilo-romantico-quarto.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-60.jpeg|estilo-pop-art-quarto.jpg"
    "https://blog.archtrends.com/wp-content/uploads/2024/09/image-47.jpeg|estilo-ecletico-ambiente.jpg"
)

API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw"

echo "Iniciando download e upload das imagens corretas..."

for image_info in "${images[@]}"; do
    IFS='|' read -r url filename <<< "$image_info"
    echo "Processando: $filename"
    
    # Download da imagem
    curl -s -o "/tmp/$filename" "$url"
    
    if [ $? -eq 0 ] && [ -s "/tmp/$filename" ]; then
        echo "✓ Download concluído: $filename"
        
        # Upload para Supabase
        response=$(curl -X POST "https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/imagens-blog/$filename" \
          -H "apikey: $API_KEY" \
          -H "Authorization: Bearer $API_KEY" \
          -H "Content-Type: image/jpeg" \
          --data-binary "@/tmp/$filename" -s)
        
        if [[ $response == *"Key"* ]]; then
            echo "✓ Upload concluído: $filename"
        else
            echo "✗ Erro no upload: $filename - $response"
        fi
        
        # Limpar arquivo temporário
        rm -f "/tmp/$filename"
    else
        echo "✗ Erro no download: $filename"
    fi
    
    sleep 1
done

echo "Processo concluído! Testando uma imagem..."
curl -I "https://vfpdyllwquaturpcifpl.supabase.co/storage/v1/object/public/imagens-blog/estilo-moderno-sala.jpg" 2>/dev/null | head -1