# Video Player Components - Guia Completo

## 📋 Visão Geral

Esta implementação fornece uma solução completa de video player baseada em ReactPlayer, seguindo as melhores práticas de **performance**, **acessibilidade** e **segurança** para a plataforma de ensino Habilidade.

## 🚀 Componentes Disponíveis

### 1. `ReactVideoPlayer`
Componente base com recursos essenciais:
- ✅ Sanitização de URL com DOMPurify
- ✅ Suporte a legendas/captions
- ✅ Controles avançados via refs
- ✅ Tratamento de erros
- ✅ Estados de loading

### 2. `VideoPlayerWrapper`
Wrapper responsivo com:
- ✅ Aspect ratio configurável (16/9, 4/3, etc.)
- ✅ Layout responsivo
- ✅ Estilização com Tailwind CSS

### 3. `LazyVideoPlayer`
Otimização de performance:
- ✅ Lazy loading com Next.js dynamic imports
- ✅ Skeleton loading
- ✅ Carregamento sob demanda

### 4. `AccessibleVideoPlayer`
Recursos de acessibilidade:
- ✅ Atalhos de teclado
- ✅ Suporte a transcrições
- ✅ Salvamento automático de progresso
- ✅ Navegação por teclado
- ✅ ARIA labels

### 5. `LessonVideoPlayer`
Integração com a plataforma:
- ✅ Integração com Supabase
- ✅ Tracking de progresso
- ✅ Sistema de aulas
- ✅ Dados de matrícula

## 📦 Instalação

```bash
npm install react-player dompurify
npm install --save-dev @types/dompurify
```

## 🎯 Uso Básico

### Player Simples
```tsx
import { ReactVideoPlayer } from '@/components/ui'

<ReactVideoPlayer
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  controls={true}
  className="aspect-video"
/>
```

### Player Responsivo
```tsx
import { VideoPlayerWrapper } from '@/components/ui'

<VideoPlayerWrapper
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  aspectRatio="16/9"
  light={true}
  controls={true}
/>
```

### Player com Lazy Loading
```tsx
import { LazyVideoPlayer } from '@/components/ui'

<LazyVideoPlayer
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  light={true}
  controls={true}
  enableLazyLoading={true}
/>
```

### Player Acessível
```tsx
import { AccessibleVideoPlayer } from '@/components/ui'

<AccessibleVideoPlayer
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  title="Título do Vídeo"
  description="Descrição do vídeo"
  transcript="Transcrição completa..."
  keyboardShortcuts={true}
  accessibilityControls={true}
  autoSaveProgress={true}
  progressSaveKey="video-unique-id"
/>
```

### Integração com Plataforma
```tsx
import { LessonVideoPlayer } from '@/components/course'

<LessonVideoPlayer
  lesson={lessonData}
  enrollmentId="enrollment-123"
  userId="user-456"
  onProgress={(progress) => console.log('Progress:', progress)}
  onComplete={() => console.log('Lesson completed!')}
  autoplay={false}
/>
```

## 🎛️ Controles Avançados

### Usando Refs
```tsx
import { useRef } from 'react'
import { ReactVideoPlayer, VideoPlayerRef } from '@/components/ui'

const MyComponent = () => {
  const playerRef = useRef<VideoPlayerRef>(null)

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds')
    }
  }

  return (
    <div>
      <ReactVideoPlayer
        ref={playerRef}
        url="https://example.com/video.mp4"
        controls={true}
      />
      <button onClick={() => handleSeek(30)}>
        Pular para 30s
      </button>
    </div>
  )
}
```

### Métodos Disponíveis via Ref
- `getCurrentTime()`: Tempo atual em segundos
- `getDuration()`: Duração total do vídeo
- `getSecondsLoaded()`: Segundos carregados
- `seekTo(amount, type)`: Navegar para posição específica
- `getInternalPlayer()`: Acessar player interno

## 🔧 Configurações

### Atalhos de Teclado (AccessibleVideoPlayer)
- **Espaço/K**: Play/Pausa
- **← →**: Voltar/Avançar 10 segundos
- **↑ ↓**: Volume +/-
- **F**: Tela cheia
- **M**: Mute/Unmute
- **C**: Mostrar/Ocultar transcrição

### Configuração de Legendas
```tsx
const videoTracks = [
  {
    kind: 'subtitles',
    src: '/path/to/subtitles.vtt',
    srcLang: 'pt-BR',
    label: 'Português',
    default: true
  },
  {
    kind: 'captions',
    src: '/path/to/captions.vtt',
    srcLang: 'en',
    label: 'English'
  }
]

<ReactVideoPlayer
  url="https://example.com/video.mp4"
  tracks={videoTracks}
  controls={true}
/>
```

## 🚀 Otimizações de Performance

### 1. Modo Light
```tsx
<ReactVideoPlayer
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  light={true} // Carrega apenas thumbnail
  controls={true}
/>
```

### 2. Lazy Loading
```tsx
<LazyVideoPlayer
  url="https://example.com/video.mp4"
  enableLazyLoading={true}
  light={true}
/>
```

### 3. Carregamento Específico
```tsx
// Para apenas YouTube
import ReactPlayer from 'react-player/youtube'

// Para apenas Vimeo
import ReactPlayer from 'react-player/vimeo'
```

### 4. Autoplay Otimizado
```tsx
<ReactVideoPlayer
  url="https://example.com/video.mp4"
  playing={true}
  muted={true} // Obrigatório para autoplay
  controls={true}
/>
```

## 🔒 Segurança

### Sanitização de URL
Todas as URLs são automaticamente sanitizadas com DOMPurify:
```tsx
// Interno do componente
const sanitizedUrl = DOMPurify.sanitize(url, { ALLOWED_TAGS: [] })
```

### Configuração de Providers
```tsx
<ReactVideoPlayer
  url="https://youtube.com/watch?v=abc123"
  config={{
    youtube: {
      playerVars: {
        showinfo: 1,
        modestbranding: 1,
        rel: 0 // Não mostrar vídeos relacionados
      }
    },
    vimeo: {
      playerOptions: {
        title: false,
        byline: false,
        portrait: false
      }
    }
  }}
/>
```

## 📊 Tracking de Progresso

### Salvamento Automático
```tsx
<AccessibleVideoPlayer
  url="https://example.com/video.mp4"
  autoSaveProgress={true}
  progressSaveKey="unique-video-id"
  onProgressSave={(progress) => {
    // Salvar no banco de dados
    console.log('Progress saved:', progress)
  }}
  onProgressLoad={async () => {
    // Carregar progresso salvo
    return { played: 0.5, playedSeconds: 150 }
  }}
/>
```

### Integração com Supabase
```tsx
<LessonVideoPlayer
  lesson={lessonData}
  enrollmentId="enrollment-123"
  userId="user-456"
  onProgress={(progress) => {
    // Progresso é automaticamente salvo no Supabase
  }}
  onComplete={() => {
    // Aula marcada como concluída
  }}
/>
```

## 🎨 Estilização

### CSS Classes Disponíveis
```css
.player-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
}

.react-player {
  width: 100% !important;
  height: 100% !important;
}
```

### Aspect Ratios Suportados
- `16/9` (padrão para vídeos)
- `4/3` (formato clássico)
- `1/1` (quadrado)
- `21/9` (ultrawide)
- Customizado: `"custom/ratio"`

## 🔧 Troubleshooting

### Problemas Comuns

1. **Autoplay não funciona**
   - Solução: Use `muted={true}` com `playing={true}`

2. **Vídeo não carrega no iOS**
   - Solução: Certifique-se de usar `playsInline={true}`

3. **Performance lenta**
   - Solução: Use `light={true}` e lazy loading

4. **Legendas não aparecem**
   - Solução: Verifique se o arquivo .vtt está acessível

## 📱 Responsividade

### Breakpoints Recomendados
```tsx
<VideoPlayerWrapper
  url="https://example.com/video.mp4"
  aspectRatio="16/9"
  maxWidth="800px" // Limita largura máxima
  responsive={true}
  className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4"
/>
```

## 🧪 Testes

### Exemplo de Teste
```tsx
import { render, screen } from '@testing-library/react'
import { ReactVideoPlayer } from '@/components/ui'

test('renders video player', () => {
  render(
    <ReactVideoPlayer
      url="https://example.com/video.mp4"
      aria-label="Test video"
    />
  )
  
  expect(screen.getByLabelText('Test video')).toBeInTheDocument()
})
```

## 📚 Recursos Adicionais

### Tipos TypeScript
```tsx
interface VideoPlayerProps {
  url: string
  tracks?: VideoTrack[]
  className?: string
  light?: boolean | string
  playing?: boolean
  controls?: boolean
  // ... mais props
}

interface VideoPlayerRef {
  getCurrentTime: () => number
  getDuration: () => number
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void
  // ... mais métodos
}
```

### Providers Suportados
- YouTube
- Vimeo
- Twitch
- SoundCloud
- Streamable
- Wistia
- Arquivos MP4/WebM locais
- HLS streams
- DASH streams

## 🔄 Migração

### Da implementação anterior
```tsx
// Antes
<VideoPlayer src="video.mp4" />

// Depois
<ReactVideoPlayer url="video.mp4" controls={true} />
```

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- [Documentação do ReactPlayer](https://github.com/cookpete/react-player)
- [Exemplos de uso](./VideoPlayerExamples.tsx)
- Código fonte dos componentes neste diretório