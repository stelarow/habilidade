# Tutorial: Script de Extração de Posters dos Vídeos

## 📋 Visão Geral
Script automatizado para extrair frames dos vídeos da seção "Casos de Sucesso" e usar como posters, eliminando o efeito de "carregando" infinito quando os vídeos estão pausados.

## 🚀 Como Usar

### Pré-requisitos
```bash
# Instalar ffmpeg (necessário)
sudo apt-get install ffmpeg  # Linux/WSL
# ou
winget install ffmpeg        # Windows
```

### Execução
```bash
# Executar o script
node scripts/extract-video-posters.js
```

## ⚙️ Como Funciona

### 1. **Detecção Automática**
- Lista todos os vídeos dos casos de sucesso
- Detecta automaticamente a duração de cada vídeo

### 2. **Extração Inteligente**
- **Frame escolhido:** 2 segundos antes do final
- **Motivo:** Mostra o resultado final/conclusão do projeto
- **Fallback:** Se vídeo < 3s, usa segundo 1

### 3. **Geração de Arquivos**
```
public/assets/projetista-3d/cases/
├── carol-orofino/
│   └── video externo-poster.jpg    ← Gerado automaticamente
├── debora-chiquetti/
│   ├── animacao-sala-poster.jpg
│   └── animacao-painel-poster.jpg
└── patricia-ricardo-moveis/
    ├── video-salao-beleza-poster.jpg
    ├── video-cozinha-poster.jpg
    └── video-sala-poster.jpg
```

## 📋 Quando Usar

### ✅ **Execute o script quando:**
- Adicionar novos vídeos aos casos de sucesso
- Substituir vídeos existentes
- Problemas visuais com posters atuais

### ⚠️ **Arquivos afetados:**
Após executar, atualize manualmente:
- `ProjetistaSuccessCases.jsx` - Adicionar propriedade `poster` nos novos vídeos
- Fazer commit dos novos posters gerados

## 🔧 Configuração

### Adicionar novo vídeo:
1. **Adicione na lista do script:**
```javascript
const videos = [
  // Novo vídeo
  'pasta-aluno/nome-video.mp4',
  // ... outros vídeos
];
```

2. **Execute o script:**
```bash
node scripts/extract-video-posters.js
```

3. **Atualize o componente:**
```jsx
{ 
  type: "video", 
  src: "/assets/projetista-3d/cases/pasta-aluno/nome-video.mp4",
  poster: "/assets/projetista-3d/cases/pasta-aluno/nome-video-poster.jpg", // ← Adicione esta linha
  title: "Título do Projeto" 
}
```

## 🎯 Benefícios
- ✅ Elimina efeito "carregando" infinito
- ✅ Mostra preview atrativo do resultado final
- ✅ Melhora experiência do usuário
- ✅ Processo automatizado e rápido

---
**Dica:** O script é seguro para executar múltiplas vezes - sobrescreve posters existentes automaticamente.