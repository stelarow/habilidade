# Tutorial: Adicionar Imagens na Página Informática Nova

## 📋 Visão Geral

Este tutorial explica como adicionar e atualizar imagens corretamente na página do curso Informática Nova para que apareçam em produção no site https://www.escolahabilidade.com/cursos/informatica-nova

## 🗂️ Estrutura de Pastas para Imagens

### Pasta Principal
```
public/assets/informatica-nova/
├── hero/                          # Imagens do hero/banner principal
├── imagens-projeto/              # Portfólio de projetos dos alunos
├── cases/                        # Cases de sucesso (fotos dos alunos)
├── depoimentos/                  # Imagens para depoimentos
├── metodologia/                  # Imagens da metodologia
└── transformacao/                # Imagens de transformação
```

### Pasta de Depoimentos
```
public/testimonials/              # Fotos para testimonials
└── leticia-mendes.jpg           # Exemplo de foto de depoimento
```

## 🎯 Tipos de Imagens e Onde Adicionar

### 1. Imagem do Hero/Banner Principal

**Local:** `public/assets/informatica-nova/hero/`

**Arquivo atual:** `hero-bg-new.webp`

**Como atualizar:**
1. Coloque a nova imagem na pasta `hero/`
2. Use formato WebP para melhor performance
3. Nomeie como `hero-bg-new.webp` ou atualize a referência no código

**Referência no código:**
```jsx
// Arquivo: src/components/course/informatica-nova/InformaticaNovaHeroSection.jsx
<img
  src="/assets/informatica-nova/hero/hero-bg-new.webp"
  alt="Curso de Informática Background"
  className="w-full h-full object-cover filter blur-[0.5px]"
/>
```

### 2. Portfólio de Projetos

**Local:** `public/assets/informatica-nova/imagens-projeto/`

**Imagens atuais:**
- `planilha-financeira.png`
- `apresentacao-corporativa.png`
- `documento-word.png`
- `design-canva.png`
- `dashboard-excel.png`
- `automacao-ia.png`
- `organizacao-windows.png`
- `logotipo-canva.png`
- `dashboard-excel-real.png`

**Como adicionar nova imagem:**
1. Coloque a imagem na pasta `imagens-projeto/`
2. Use formato PNG ou JPG
3. Nome descritivo relacionado ao tipo de projeto

**Referência no código:**
```jsx
// Arquivo: src/components/course/informatica-nova/InformaticaNovaPortfolioSection.jsx
const portfolioItems = [
  {
    id: 1,
    title: "Planilha Financeira Completa",
    category: "Excel Avançado",
    src: "/assets/informatica-nova/imagens-projeto/planilha-financeira.png",
    alt: "Planilha financeira completa com gráficos e dashboards"
  },
  // ... outros itens
];
```

### 3. Fotos de Depoimentos

**Local:** `public/testimonials/`

**Como adicionar:**
1. Coloque a foto na pasta `testimonials/`
2. Use formato JPG
3. Nome descritivo: `nome-sobrenome.jpg`

**Referência no código:**
```jsx
// Arquivo: src/components/course/informatica-nova/InformaticaNovaTestimonials.jsx
{
  name: 'Letícia Mendes',
  photo: '/testimonials/leticia-mendes.jpg',
  // ...
}
```

### 4. Cases de Sucesso

**Local:** `public/assets/informatica-nova/cases/[nome-do-aluno]/`

**Estrutura:**
```
public/assets/informatica-nova/cases/
├── leticia-mendes/
│   └── foto.jpg
├── mateus-oliveira/
│   └── foto.jpg
└── gabriela-costa-silva/
    └── foto.jpg
```

**Referência no código:**
```jsx
// Arquivo: src/components/course/informatica-nova/InformaticaNovaSuccessCases.jsx
{
  name: "Letícia Mendes",
  image: "/assets/informatica-nova/cases/leticia-mendes/foto.jpg",
  // ...
}
```

## 🔧 Processo Passo a Passo

### Para Atualizar Imagem do Hero:

1. **Copiar a nova imagem:**
   ```bash
   cp "nova-imagem-hero.webp" public/assets/informatica-nova/hero/hero-bg-new.webp
   ```

2. **Se mudou o nome, atualizar o código:**
   ```jsx
   // Em InformaticaNovaHeroSection.jsx
   src="/assets/informatica-nova/hero/NOVO-NOME.webp"
   ```

### Para Adicionar Nova Imagem ao Portfólio:

1. **Copiar a imagem:**
   ```bash
   cp "projeto-excel-novo.png" public/assets/informatica-nova/imagens-projeto/projeto-excel-novo.png
   ```

2. **Adicionar ao array portfolioItems:**
   ```jsx
   // Em InformaticaNovaPortfolioSection.jsx
   {
     id: 10,
     title: "Novo Projeto Excel",
     category: "Excel Avançado",
     src: "/assets/informatica-nova/imagens-projeto/projeto-excel-novo.png",
     alt: "Descrição do novo projeto"
   }
   ```

### Para Adicionar Novo Depoimento:

1. **Copiar a foto:**
   ```bash
   cp "foto-joao.jpg" public/testimonials/joao-silva.jpg
   ```

2. **Adicionar ao array de testimonials:**
   ```jsx
   // Em InformaticaNovaTestimonials.jsx
   {
     name: 'João Silva',
     photo: '/testimonials/joao-silva.jpg',
     role: 'Estudante',
     testimonial: 'O curso mudou minha vida...'
   }
   ```

## 📤 Deploy para Produção

### 1. Verificar Status do Git
```bash
git status
```

### 2. Adicionar Arquivos
```bash
# Para imagens novas
git add public/assets/informatica-nova/
git add public/testimonials/

# Para código alterado
git add src/components/course/informatica-nova/
```

### 3. Fazer Commit
```bash
git commit -m "feat: adicionar novas imagens para página Informática Nova

- Nova imagem do hero: [descrição]
- Novos projetos no portfólio: [descrição]
- Novos depoimentos: [descrição]"
```

### 4. Push para Produção
```bash
git push
```

### 5. Verificar Deploy
- O Netlify fará o deploy automático
- Verificar em: https://www.escolahabilidade.com/cursos/informatica-nova

## ⚠️ Boas Práticas

### Formatos de Imagem
- **Hero:** WebP (melhor compressão)
- **Portfólio:** PNG ou JPG
- **Fotos de pessoas:** JPG
- **Ícones/Logos:** PNG ou SVG

### Tamanhos Recomendados
- **Hero:** 1920x1080px ou superior
- **Portfólio:** 800x600px
- **Fotos de depoimentos:** 400x400px (quadrada)
- **Cases:** 800x600px

### Nomenclatura
- Use nomes descritivos
- Sem espaços (use hífens ou underscores)
- Sem caracteres especiais
- Exemplo: `planilha-financeira-avancada.png`

### Otimização
- Comprima as imagens antes de adicionar
- Use ferramentas como TinyPNG ou Squoosh
- WebP quando possível para melhor performance

## 🔍 Verificação de Problemas

### Se a imagem não aparece:

1. **Verificar o caminho:**
   - Certifique-se que o caminho no código está correto
   - Verifique se a pasta e arquivo existem

2. **Verificar o nome do arquivo:**
   - Case-sensitive (maiúsculas/minúsculas importam)
   - Extensão correta (.jpg, .png, .webp)

3. **Verificar se foi commitado:**
   ```bash
   git status
   git log --oneline -5
   ```

4. **Verificar o deploy:**
   - Aguardar o deploy no Netlify (2-5 minutos)
   - Limpar cache do navegador (Ctrl+F5)

## 📞 Suporte

Se encontrar problemas:
1. Verificar este tutorial
2. Consultar os logs do Netlify
3. Verificar console do navegador (F12)
4. Contatar a equipe de desenvolvimento

---

**Última atualização:** 16/09/2025
**Versão:** 1.0