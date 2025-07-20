# 📝 Criação de Nova Aula - Input do Usuário

> **Preencha os campos abaixo com as informações da aula que deseja criar**
> 
> ⚠️ **IMPORTANTE**: Pelo menos 1 tipo de conteúdo (vídeo, PDF, texto ou quiz) é obrigatório

---

## 🎯 **Informações Básicas** (OBRIGATÓRIO)

```yaml
# DADOS PRINCIPAIS
titulo: ""
descricao: ""
course_slug: ""  # Ex: "programacao-web", "design-grafico"
order_index: 1   # Posição da aula no curso (1, 2, 3...)

# AUTO-GERADO (opcional)
slug: ""  # Deixe vazio para gerar automaticamente do título
```

---

## 📹 **Conteúdo de Vídeo** (opcional)

```yaml
# Se a aula tiver vídeo, preencha:
video:
  url: ""           # URL do vídeo (MP4, WebM, Vimeo, YouTube)
  duration: 0       # Duração em segundos (ex: 1800 = 30min)
  thumbnail: ""     # URL da thumbnail (opcional)
```

**Exemplo:**
```yaml
video:
  url: "https://storage.empresa.com/curso-react/aula-01.mp4"
  duration: 2700    # 45 minutos
  thumbnail: "https://storage.empresa.com/thumbs/aula-01.jpg"
```

---

## 📄 **Materiais/PDFs** (opcional)

```yaml
# Se a aula tiver materiais para download:
materials:
  - type: "pdf"
    title: ""
    url: ""
    downloadable: true
    size: 0          # em bytes (opcional)
    description: ""  # descrição opcional
    
  - type: "link"     # Link externo
    title: ""
    url: ""
    description: ""
```

**Exemplo:**
```yaml
materials:
  - type: "pdf"
    title: "Guia Completo de React Hooks"
    url: "https://storage.empresa.com/materiais/react-hooks-guide.pdf"
    downloadable: true
    size: 2048000
    description: "Material de apoio com exemplos práticos"
    
  - type: "link"
    title: "Documentação Oficial React"
    url: "https://react.dev/learn"
    description: "Referência oficial para aprofundamento"
```

---

## 📝 **Conteúdo Texto/HTML** (opcional)

```yaml
# Se a aula tiver conteúdo textual:
content: |
  <h2>Título da Seção</h2>
  <p>Explicação textual que complementa o vídeo.</p>
  <ul>
    <li>Ponto importante 1</li>
    <li>Ponto importante 2</li>
    <li>Ponto importante 3</li>
  </ul>
  
  <h3>Conceitos Chave</h3>
  <p>Texto explicativo adicional...</p>
```

---

## ✏️ **Exercícios Práticos** (opcional)

```yaml
# Se a aula tiver exercícios:
exercises:
  - title: ""
    description: ""
    file_url: ""              # PDF com instruções (opcional)
    allows_upload: true       # true/false
    upload_instructions: ""   # Instruções para envio
    order_index: 1
    
  - title: ""                 # Exercício adicional
    description: ""
    allows_upload: false      # Só visualização
    order_index: 2
```

**Exemplo:**
```yaml
exercises:
  - title: "Criar Componente de Card"
    description: "Implemente um componente Card reutilizável que aceite título, descrição e imagem como props"
    file_url: "https://storage.empresa.com/exercicios/card-component-specs.pdf"
    allows_upload: true
    upload_instructions: "Envie o arquivo .jsx/.tsx do componente criado"
    order_index: 1
    
  - title: "Leitura Complementar"
    description: "Leia o artigo sobre boas práticas em componentes React"
    allows_upload: false
    order_index: 2
```

---

## 🧠 **Quiz de Verificação** (opcional)

```yaml
# Se a aula tiver quiz:
quiz:
  title: ""
  description: ""
  time_limit: 30        # minutos (null = sem limite)
  attempts_allowed: 3   # tentativas permitidas
  passing_score: 70     # OBRIGATÓRIO: 70% mínimo
  
  questions:
    - question: ""
      type: "multiple_choice"
      options: ["", "", "", ""]
      correct_answer: 0   # índice da resposta correta (0, 1, 2, 3)
      points: 25
      
    - question: ""
      type: "multiple_choice" 
      options: ["", "", "", ""]
      correct_answer: 0
      points: 25
```

**Exemplo:**
```yaml
quiz:
  title: "Verificação - React Hooks"
  description: "Teste seus conhecimentos sobre useState e useEffect"
  time_limit: 15
  attempts_allowed: 3
  passing_score: 70
  
  questions:
    - question: "Qual hook é usado para gerenciar estado em componentes funcionais?"
      type: "multiple_choice"
      options: ["useState", "useEffect", "useContext", "useReducer"]
      correct_answer: 0
      points: 25
      
    - question: "Quando o useEffect é executado?"
      type: "multiple_choice"
      options: ["Antes da renderização", "Após a renderização", "Durante a renderização", "Nunca"]
      correct_answer: 1
      points: 25
      
    - question: "Como limpar um efeito no useEffect?"
      type: "multiple_choice"
      options: ["clearEffect()", "return function", "useCleanup()", "effect.clear()"]
      correct_answer: 1
      points: 25
      
    - question: "Qual é a sintaxe correta do useState?"
      type: "multiple_choice"
      options: ["useState(valor)", "const [state] = useState()", "const [state, setState] = useState()", "state = useState()"]
      correct_answer: 2
      points: 25
```

---

## ✅ **Checklist Final**

Antes de submeter, verifique:

- [ ] **Título** e **descrição** preenchidos
- [ ] **course_slug** correto (curso existe)
- [ ] **order_index** não conflita com aulas existentes
- [ ] **Pelo menos 1 conteúdo** fornecido (vídeo, PDF, texto ou quiz)
- [ ] **URLs** são válidas e acessíveis
- [ ] **Quiz** tem exatamente 70% como passing_score (se fornecido)
- [ ] **Questões** do quiz somam 100 pontos total

---

## 🚀 **Como Usar Este Arquivo**

1. **Preencha** as seções relevantes acima
2. **Remova** as seções que não usar (ex: se não tem vídeo, delete a seção video)
3. **Envie** o conteúdo preenchido para a IA
4. **Aguarde** a criação automática da aula
5. **Acesse** a aula em: `/course/{course_slug}/lesson/{lesson_slug}`

---

## 📋 **Exemplo Completo Preenchido**

```yaml
# DADOS PRINCIPAIS
titulo: "Introdução aos React Hooks"
descricao: "Aprenda a usar useState e useEffect para gerenciar estado e efeitos colaterais em componentes funcionais"
course_slug: "programacao-web"
order_index: 3

# VÍDEO
video:
  url: "https://storage.empresa.com/react-curso/aula-03-hooks.mp4"
  duration: 3600  # 1 hora
  
# MATERIAIS
materials:
  - type: "pdf"
    title: "Cheat Sheet - React Hooks"
    url: "https://storage.empresa.com/pdfs/react-hooks-cheatsheet.pdf"
    downloadable: true

# EXERCÍCIO
exercises:
  - title: "Contador com useState"
    description: "Crie um contador que incrementa e decrementa usando useState"
    allows_upload: true
    upload_instructions: "Envie o arquivo .jsx do componente"
    order_index: 1

# QUIZ
quiz:
  title: "Quiz - React Hooks Básicos"
  description: "Verifique seu entendimento sobre useState e useEffect"
  time_limit: 20
  attempts_allowed: 3
  passing_score: 70
  
  questions:
    - question: "Qual hook gerencia estado local?"
      type: "multiple_choice"
      options: ["useState", "useEffect", "useContext", "useReducer"]
      correct_answer: 0
      points: 50
      
    - question: "useEffect executa quando?"
      type: "multiple_choice"
      options: ["Antes da renderização", "Após a renderização", "Durante renderização", "Só na primeira vez"]
      correct_answer: 1
      points: 50
```

**Resultado:** Aula criada automaticamente com todos os componentes funcionais! ✨

---

*Template v2.1 - Sistema Otimizado | Conclusão: Quiz 70%+ OU sem quiz*