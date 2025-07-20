# Instruções para Criação de Aulas - Template Reutilizável

## 🎯 **Como Funciona o Sistema**
Use o supabase mcp para incluir no banco de dados quando necessario.
A plataforma possui um **template de aula reutilizável** que renderiza automaticamente baseado nos dados fornecidos. 

**NÃO é necessário criar novas páginas** - apenas inserir dados no banco de dados.

### **Arquitetura do Template:**
```
page.tsx → LessonPageIntegration.tsx → LessonPageRedesigned.tsx
   ↓              ↓                        ↓
Busca dados → Adapta dados → Renderiza componentes automaticamente
```

### **Componentes que Carregam Automaticamente:**
- **VideoSection** - Se existe `video_url`
- **PDFSection** - Se existe PDF em `materials`
- **QuizSection** - Se existe quiz vinculado  
- **ExercisesSection** - Se existe exercício vinculado
- **CompletionSection** - Sempre presente

## 📋 **Informações Obrigatórias do Usuário**

### **1. Dados Básicos da Aula**
```yaml
# OBRIGATÓRIO
titulo: "Nome da aula"
descricao: "Descrição detalhada do que será aprendido"
course_id: "UUID do curso" # Obtido via busca por slug do curso
order_index: 1 # Posição sequencial na lista de aulas

# AUTO-GERADO (opcional fornecer)
slug: "nome-da-aula" # Gerado automaticamente do título se não fornecido
```

### **2. Conteúdo da Aula (pelo menos 1 tipo obrigatório)**

#### **Vídeo (opcional)**
```yaml
video:
  url: "https://storage.exemplo.com/video.mp4"
  duration: 1800 # em segundos
  thumbnail: "https://storage.exemplo.com/thumb.jpg" # opcional
```

#### **PDF/Materiais (opcional)**
```yaml
materials: # Array JSON
  - type: "pdf"
    title: "Material de Apoio"
    url: "https://storage.exemplo.com/material.pdf"
    downloadable: true
    size: 2048000 # em bytes
  - type: "link"
    title: "Documentação Extra"
    url: "https://docs.exemplo.com"
    description: "Link complementar"
```

#### **Conteúdo Texto (opcional)**
```yaml
content: |
  <h2>Conteúdo da Aula</h2>
  <p>Texto explicativo em HTML que complementa outros materiais.</p>
  <ul>
    <li>Tópico importante 1</li>
    <li>Tópico importante 2</li>
  </ul>
```

#### **Exercícios (tabela separada - opcional)**
```yaml
exercises: # Inseridos na tabela 'exercises'
  - title: "Exercício Prático 1"
    description: "Descrição do que deve ser feito"
    file_url: "https://storage.exemplo.com/exercicio.pdf" # opcional
    allows_upload: true
    upload_instructions: "Envie o arquivo em formato PDF"
    order_index: 1
```

#### **Quiz (tabela separada - opcional)**
```yaml
quiz: # Inserido na tabela 'quizzes'
  title: "Verificação de Conhecimento"
  description: "Teste seus conhecimentos sobre a aula"
  time_limit: 30 # minutos, null = sem limite
  attempts_allowed: 3
  passing_score: 70 # OBRIGATÓRIO: 70% mínimo (padrão do sistema)
  questions: # Array de questões
    - question: "Qual é a resposta correta?"
      type: "multiple_choice"
      options: ["A", "B", "C", "D"]
      correct_answer: 0 # índice da resposta correta
      points: 10

# ⚠️ REGRA DE CONCLUSÃO:
# - Se lesson tem quiz: user DEVE fazer 70%+ para concluir
# - Se lesson NÃO tem quiz: button "Concluir Aula" fica disponível imediatamente
```

## 🔧 **Processo de Criação para a IA**

### **Passo 1: Validar Dados**
- Verificar se pelo menos 1 tipo de conteúdo foi fornecido
- Gerar slug único se não fornecido
- Validar URLs de recursos

### **Passo 2: Inserir Aula Principal**
```sql
INSERT INTO public.lessons (
  course_id,
  title,
  slug,
  description,
  video_url,
  video_duration,
  order_index,
  content,
  materials,
  is_published
) VALUES (
  $1, -- course_id (obter via SELECT slug)
  $2, -- title
  $3, -- slug (gerado ou fornecido)
  $4, -- description
  $5, -- video_url (opcional)
  $6, -- video_duration (opcional)
  $7, -- order_index
  $8, -- content HTML (opcional)
  $9, -- materials JSON (opcional)
  true -- publicar automaticamente
);
```

### **Passo 3: Inserir Exercícios (se fornecidos)**
```sql
INSERT INTO public.exercises (
  lesson_id,
  title,
  description,
  file_url,
  allows_upload,
  upload_instructions,
  order_index
) VALUES ($1, $2, $3, $4, $5, $6, $7);
```

### **Passo 4: Inserir Quiz (se fornecido)**
```sql
-- Inserir Quiz
INSERT INTO public.quizzes (
  lesson_id,
  title,
  description,
  time_limit,
  attempts_allowed,
  passing_score
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id;

-- Inserir Questões
INSERT INTO public.quiz_questions (
  quiz_id,
  question,
  type,
  options,
  correct_answer,
  points,
  order_index
) VALUES ($1, $2, $3, $4, $5, $6, $7);
```

## ✅ **Validações Obrigatórias**

### **Antes de Inserir:**
- [ ] Curso existe e está publicado
- [ ] Slug da aula é único dentro do curso
- [ ] Pelo menos 1 tipo de conteúdo fornecido
- [ ] URLs são válidas e acessíveis
- [ ] Order_index não conflita com aulas existentes

### **Sistema de Conclusão Simplificado:**
- **Regra ÚNICA**: Quiz com 70% de acerto OU aula sem quiz = pode concluir
- **Validação**: Ultra-simples, sem complexidade desnecessária
- **Redirecionamento**: Confiável com fallbacks automáticos
- **Performance**: Otimizado para evitar loops infinitos

### **Formatos Aceitos:**
- **Vídeos**: MP4, WebM, M3U8
- **PDFs**: Até 50MB
- **Imagens**: JPG, PNG, WebP (até 5MB)
- **Áudio**: MP3, WAV, OGG

## 🎯 **Exemplo Completo de Input do Usuário**

```yaml
# Dados mínimos para criar uma aula
titulo: "Introdução ao React - Componentes"
descricao: "Aprenda a criar e usar componentes React funcionais e com classes"
course_slug: "programacao-web" # Para encontrar course_id
order_index: 1

# Conteúdo (pelo menos 1)
video:
  url: "https://storage.empresa.com/react-componentes.mp4"
  duration: 2700 # 45 minutos
  
materials:
  - type: "pdf"
    title: "Guia de Componentes React"
    url: "https://storage.empresa.com/guia-react.pdf"
    downloadable: true

exercises:
  - title: "Criar Componente de Botão"
    description: "Implemente um componente Button reutilizável"
    allows_upload: true
    upload_instructions: "Envie o arquivo .jsx do componente"

quiz:
  title: "Quiz - Componentes React"
  time_limit: 15
  passing_score: 75
  questions:
    - question: "O que é um componente funcional?"
      type: "multiple_choice"
      options: ["Função que retorna JSX", "Classe React", "Hook", "State"]
      correct_answer: 0
      points: 25
```

## 🚀 **Resultado Final**

A IA deve:
1. **Validar** os dados fornecidos
2. **Inserir** na tabela `lessons` (principal)
3. **Inserir** exercícios/quiz se fornecidos
4. **Retornar** URL da aula: `/course/{course_slug}/lesson/{lesson_slug}`

O **template renderiza automaticamente** todos os componentes baseado nos dados inseridos.

### **🎯 Sistema de Conclusão Otimizado:**
- **Validação Ultra-Simples**: Apenas quiz 70%+ (se existir)
- **Redirecionamento Confiável**: window.location.href direto
- **Performance**: Sem loops infinitos, navegação imediata (1.5s)
- **Fallbacks**: Dashboard/Home automáticos se navegação falhar

## 📱 **Acesso à Aula Criada**

```
URL: https://plataforma.escolahabilidade.com.br/course/{course_slug}/lesson/{lesson_slug}
```

O template carregará automaticamente:
- Header com título e progresso
- VideoSection (se há vídeo) - ✅ **Progresso dinâmico Vimeo**
- PDFSection (se há PDF)
- QuizSection (se há quiz) - ✅ **Validação 70% mínimo**
- ExercisesSection (se há exercícios)
- CompletionSection (sempre) - ✅ **Redirecionamento otimizado**

## 🔧 **Melhorias Técnicas Implementadas (v2.1)**

### **Progresso de Vídeo:**
- ✅ Integração Vimeo Player API para iframe videos
- ✅ Timeupdate events para progresso em tempo real
- ✅ Duração dinâmica baseada no video atual

### **Sistema de Conclusão:**
- ✅ Validação ultra-simplificada (quiz 70% OU sem quiz)
- ✅ Redirecionamento confiável com window.location.href
- ✅ Fallbacks automáticos para Dashboard/Home
- ✅ Eliminação de loops infinitos de re-renderização
- ✅ Logs detalhados para debugging

### **Performance:**
- ✅ useEffect otimizado com dependências corretas
- ✅ Navegação imediata (1.5s) sem travamentos
- ✅ Animações finitas (sem repeat: Infinity)

---

**Template v2.1 - Sistema Otimizado | Validação simples + Redirecionamento confiável**