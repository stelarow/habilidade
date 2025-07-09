# Guia de Implementação de Player de Vídeo com ReactPlayer

## 1. Introdução

Este guia detalha a implementação de uma solução de vídeo robusta, performática e acessível para o projeto, utilizando **ReactPlayer** e alinhada às melhores práticas da documentação oficial.

O foco é ir além do básico, abordando tópicos críticos como **performance, controle avançado, acessibilidade e segurança** para garantir uma experiência de usuário de alta qualidade e um código manutenível.

## 2. Instalação

Adicione o ReactPlayer e as dependências de segurança recomendadas ao projeto:

```bash
# Com npm
npm install react-player dompurify

# Com yarn
yarn add react-player dompurify
```

## 3. Implementação Essencial

Esta é a base para um player de vídeo seguro e responsivo.

### 3.1. Componente `VideoPlayer`

```jsx
// components/VideoPlayer.jsx
import React, { forwardRef } from 'react';
import ReactPlayer from 'react-player/lazy';
import DOMPurify from 'dompurify';

const VideoPlayer = forwardRef(({ url, tracks = [], ...props }, ref) => {
  const sanitizedUrl = DOMPurify.sanitize(url);

  return (
    <div className='player-wrapper' aria-label="Player de vídeo">
      <ReactPlayer
        ref={ref}
        className='react-player'
        url={sanitizedUrl}
        width='100%'
        height='100%'
        controls={true}
        playsInline={true} // Essencial para uma boa experiência no iOS
        {...props}
      >
        {/* Adiciona legendas de forma declarativa */}
        {tracks.map((track, index) => (
          <track key={index} {...track} />
        ))}
      </ReactPlayer>
    </div>
  );
});

export default VideoPlayer;
```

### 3.2. Estilização Responsiva

Utilize `aspect-ratio` para um layout moderno e que evita *layout shift*.

```css
/* styles/VideoPlayer.css */
.player-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9; /* Proporção 16:9 */
}

.react-player {
  width: 100% !important;
  height: 100% !important;
}
```

## 4. Performance: Otimize o Carregamento

### 4.1. Carregamento Sob Demanda (Lazy Loading)

**Recomendado para a maioria dos casos.** Carrega o player apenas quando o componente é necessário, utilizando `next/dynamic` ou `React.lazy`.

```jsx
// pages/minha-pagina.js
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false, // O player só será renderizado no client-side
});
```

### 4.2. Modo Leve (`light` prop)

**Excelente para performance.** Renderiza apenas uma miniatura (thumbnail) e só carrega o player completo quando o usuário clica.

```jsx
// Carrega a thumbnail automaticamente da URL (YouTube, Vimeo, etc.)
<VideoPlayer light={true} url='...' />

// Ou especifica uma imagem customizada
<VideoPlayer light='/caminho/para/thumbnail.jpg' url='...' />
```

### 4.3. Importação de Player Único

Se o projeto utilizar **apenas um tipo de vídeo** (ex: somente YouTube), importe o player específico para reduzir o tamanho do *bundle*.

```jsx
// No topo do seu componente de player
import ReactPlayer from 'react-player/youtube';
```

## 5. Funcionalidades e Controle

### 5.1. Autoplay

Navegadores modernos exigem que o vídeo esteja sem som (`muted`) para o autoplay funcionar. Sempre inclua a prop `controls` para que o usuário possa reativar o som.

```jsx
<VideoPlayer url='...' playing={true} muted={true} controls={true} />
```

### 5.2. Acessibilidade (A11y)

*   **Legendas Declarativas:** Forneça legendas utilizando o padrão de elementos `<track>`, que é mais limpo e semântico.

    ```jsx
    const videoTracks = [
      { kind: 'subtitles', src: 'legenda.vtt', srcLang: 'pt', default: true }
    ];
    <VideoPlayer url='...' tracks={videoTracks} />
    ```
*   **Checklist de Acessibilidade:** Mantenha o checklist para garantir a qualidade em pre-merge (navegação por teclado, rótulos ARIA, contraste).

### 5.3. Controle Avançado com `ref`

Utilize `ref` para acessar métodos da instância do player, como `seekTo`.

```jsx
const PlayerPage = () => {
  const playerRef = useRef(null);

  const handleSeek = () => {
    // Avança o vídeo para 10 segundos
    if (playerRef.current) {
      playerRef.current.seekTo(10, 'seconds');
    }
  };

  return (
    <div>
      <VideoPlayer ref={playerRef} url='...' />
      <button onClick={handleSeek}>Avançar para 10s</button>
    </div>
  );
};
```

## 6. Segurança, Testes e Manutenção

As seções sobre **Segurança** (sanitização de URL com DOMPurify), **Testes e Monitoramento** (React Testing Library, Sentry) e **Manutenção/Alternativas** do guia anterior continuam válidas e devem ser seguidas.

## 7. Próximos Passos Sugeridos

1.  **Refatorar** o componente `VideoPlayer` para adotar a estrutura com `forwardRef` e o `aspect-ratio` no CSS.
2.  **Implementar** uma estratégia de otimização de performance (Lazy Loading ou Light Mode) como padrão.
3.  **Adicionar** o padrão de legendas declarativas onde for aplicável.
4.  **Utilizar** `ref` para criar funcionalidades de controle customizadas, se necessário.
