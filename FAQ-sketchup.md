# FAQ - SketchUp + Enscape - Plano de Implementação

## Perguntas e Respostas

### 1. Qual a vantagem de aprender SketchUp e Enscape juntos?
**Resposta:** O diferencial é o nosso workflow integrado. Você aprende na prática como o SketchUp e o Enscape trabalham juntos em projetos reais, economizando tempo e garantindo o conhecimento para criar renders fotorrealísticos de forma profissional e eficiente.

### 2. Como funciona a renderização com Enscape?
**Resposta:** O Enscape renderiza seus projetos do SketchUp em tempo real, transformando horas de espera em segundos. No curso, você aprende a criar renderizações ultra realistas, vídeos, imagens 360° e a usar óculos de realidade virtual para apresentações imersivas e impactantes.

### 3. Preciso saber outro software 3D para fazer o curso de SketchUp?
**Resposta:** Não é necessário. O SketchUp é uma das ferramentas 3D mais intuitivas do mercado. Nosso curso começa do zero e, em 56 horas de aula, você estará criando projetos arquitetônicos completos e detalhados.

### 4. Quanto ganha um projetista 3D em Santa Catarina?
**Resposta:** Em Santa Catarina, projetistas 3D têm uma faixa salarial de R$ 2.500 a R$ 6.000. Dominando SketchUp e Enscape, freelancers na região costumam cobrar entre R$ 150 e R$ 300 por imagem renderizada. Nosso curso te prepara para aproveitar essa demanda.

### 5. Existe um curso de SketchUp com certificado em Florianópolis?
**Resposta:** Sim! Nossa escola em São José (na Grande Florianópolis) oferece um curso presencial de SketchUp + Enscape com certificado reconhecido nacionalmente. Somos a única escola em Santa Catarina com esta formação completa.

### 6. Posso trabalhar como freelancer após o curso?
**Resposta:** Absolutamente! O curso ensina todo o processo, desde a modelagem no SketchUp até a precificação dos seus projetos renderizados. Muitos de nossos alunos começam a captar trabalhos como freelancer ainda durante as aulas, aproveitando o mercado aquecido em SC.

### 7. O que está incluído no curso de SketchUp e Enscape?
**Resposta:** O curso inclui aulas 100% práticas, material didático completo com apostila de 380 páginas, certificado nacional, suporte pós-curso e acesso aos softwares SketchUp Pro e Enscape em sala de aula.

## Passo a passo para Implementação

### Arquivo a modificar:
- `src/pages/curso-sketch-up-enscape.jsx`

### Localização do componente FAQ:
- **Linhas:** 1096-1185
- **Componente:** `const FAQ = memo(() => { ... });`

### Etapas de implementação:

#### 1. Localizar o array `faqItems` (linhas 1099-1124)
```javascript
const faqItems = [
  // Array atual com 6 perguntas antigas
];
```

#### 2. Substituir completamente o array `faqItems`
Substituir todo o conteúdo do array pelas 7 novas perguntas formatadas assim:
```javascript
const faqItems = [
  {
    question: "Qual a vantagem de aprender SketchUp e Enscape juntos?",
    answer: "O diferencial é o nosso workflow integrado. Você aprende na prática como o SketchUp e o Enscape trabalham juntos em projetos reais, economizando tempo e garantindo o conhecimento para criar renders fotorrealísticos de forma profissional e eficiente."
  },
  {
    question: "Como funciona a renderização com Enscape?",
    answer: "O Enscape renderiza seus projetos do SketchUp em tempo real, transformando horas de espera em segundos. No curso, você aprende a criar renderizações ultra realistas, vídeos, imagens 360° e a usar óculos de realidade virtual para apresentações imersivas e impactantes."
  },
  // ... continuar com as outras 5 perguntas
];
```

#### 3. Verificar se o componente está sendo renderizado
- Verificar se `<FAQ />` está sendo chamado no componente principal `CursoSketchUpEnscape` (linha 1340)
- Confirmar que não há erros de importação ou sintaxe

#### 4. Verificar dependências
- Confirmar que `CaretDown` está importado do `@phosphor-icons/react`
- Verificar se `motion` do `framer-motion` está importado
- Confirmar se `useState` e `memo` do React estão importados

#### 5. Testar localmente
```bash
npm run dev
```
- Acessar `/cursos/sketchup-enscape`
- Verificar se a seção FAQ aparece
- Testar a funcionalidade de expandir/colapsar cada pergunta

#### 6. Build de produção
```bash
npm run build:production
```
- Verificar se não há erros no build

### Estrutura mantida:
- Animações com Framer Motion
- Estado `openItem` para controlar expansão
- Estilização TailwindCSS
- Responsividade
- Acessibilidade

### Observações importantes:
- O componente FAQ já existe e está estruturado corretamente
- Apenas o conteúdo das perguntas precisa ser substituído
- Manter toda a lógica de interação existente
- O componente já está sendo chamado na página principal