#!/usr/bin/env python3
"""
Script para fazer download das imagens do artigo SketchUp sobre vistas magníficas
"""
import os
import requests
from urllib.parse import urlparse, unquote
import time

def download_image(url, folder="images"):
    """Download uma imagem da URL especificada"""
    try:
        # Criar pasta se não existir
        os.makedirs(folder, exist_ok=True)
        
        # Fazer request da imagem
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()
        
        # Extrair nome do arquivo da URL
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        # Se não conseguir extrair nome, usar timestamp
        if not filename or '.' not in filename:
            filename = f"image_{int(time.time())}.jpg"
        
        # Decodificar URL encoding
        filename = unquote(filename)
        
        # Limitar nome do arquivo
        if len(filename) > 100:
            ext = filename.split('.')[-1] if '.' in filename else 'jpg'
            filename = f"image_{int(time.time())}.{ext}"
        
        filepath = os.path.join(folder, filename)
        
        # Salvar arquivo
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✓ Downloaded: {filename}")
        return filepath
        
    except Exception as e:
        print(f"✗ Error downloading {url}: {str(e)}")
        return None

def main():
    """Função principal"""
    # URLs das imagens principais do artigo (removendo duplicatas)
    image_urls = [
        # Imagem hero/principal do artigo
        "https://images.ctfassets.net/jnzexz4x7lkk/1RUgtCYco8axVEBFrl3g4C/116bf26da4393919022e0f85e9eed183/2024_687205183_five_ways_to_1.jpg",
        
        # Imagens técnicas do SketchUp
        "https://images.ctfassets.net/jnzexz4x7lkk/Nfp6v8sJ8Ye1fjm9BlpFO/100f575bc5cc421d2801c886cdecf1d4/2024_687205183_five_ways_to_3.png",
        "https://images.ctfassets.net/jnzexz4x7lkk/7riRmWLfLp8eUERZKmrlLO/92f90e5d681731c09d48b5ee1342d16f/2024_687205183_five_ways_to_2.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/107tcaosliLBqP47r6bUq0/415b69259ec4e6228c9fbb39a21b300f/2024_687205183_five_ways_to_1.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/3bz9XFCOAAF1X8vVl1KIhj/058a088a5abece87a870b03419eba406/2024_687205183_five_ways_to_4.png",
        "https://images.ctfassets.net/jnzexz4x7lkk/5fijj0GK0j3pN9c4PWBIjK/18d0745314b03591ad2bf83b6aabf48a/2024_687205183_five_ways_to_6.png",
        "https://images.ctfassets.net/jnzexz4x7lkk/p7L8EU1IMj6G3i94tPdPI/e8327448f1f631b65d4c226be295f928/2024_687205183_five_ways_to_5.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/hzkzrmRpMFnacNRyNOmFX/7920af1f1e7c6c90f9457d33eba97592/2024_687205183_five_ways_to_8.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/13eTDYT20YYDIsDOSeGKEa/736ef5f8e17798c3ca6f81f93a6bb221/2024_687205183_five_ways_to_7.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/5L2GOMspFK3PsuyPsp2ya0/75d91ed651706690e2abf5cc27abd467/2024_687205183_five_ways_to_10.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/9eXmw6AGHL0UzMg7opTyy/6186744599857a8145af0b7486b12863/2024_687205183_five_ways_to_9.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/4JSg83NkK1M8RM7AKRem7I/2314eb1b8072a6ece52b6598fce95615/2024_687205183_five_ways_to_12.png",
        "https://images.ctfassets.net/jnzexz4x7lkk/7rt26FEvVqdAt0lCEynWye/9b35630ad0b6b7d8c7809baf6d7b8bfd/2024_687205183_five_ways_to_11.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/6jqwhRQvOrNXUO9LPS3dck/f96cc723cd11dc47433c2dcfc5e70c7d/2024_687205183_five_ways_to_14.jpg",
        "https://images.ctfassets.net/jnzexz4x7lkk/4Ysq1PhH9ZjGPovFVTnFuM/302f80a93e7dde0bbffe4c7d04754796/2024_687205183_five_ways_to_13.jpg"
    ]
    
    print(f"Fazendo download de {len(image_urls)} imagens...")
    print("=" * 50)
    
    downloaded = 0
    failed = 0
    
    for i, url in enumerate(image_urls, 1):
        print(f"[{i}/{len(image_urls)}] Downloading: {os.path.basename(url)}")
        
        if download_image(url):
            downloaded += 1
        else:
            failed += 1
        
        # Pausa pequena entre downloads
        time.sleep(0.5)
    
    print("=" * 50)
    print(f"Download concluído!")
    print(f"✓ Sucesso: {downloaded} imagens")
    print(f"✗ Falhas: {failed} imagens")
    print(f"📁 Pasta de destino: ./images/")

if __name__ == "__main__":
    main()