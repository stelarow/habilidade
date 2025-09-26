import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Badge } from "../../ui/badge"
import { ScrollArea } from "../../ui/scroll-area"
import { BookOpen, Code, PencilSimple, Rocket, Book, Brain, Coffee, Database, DeviceMobile, Robot } from "@phosphor-icons/react"

export function FrameworksSection() {
  const curriculum = [
    {
      id: 1,
      title: 'Lógica de Programação',
      description: 'Fundamentos lógicos para qualquer linguagem de programação',
      duration: '21 horas',
      color: 'bg-blue-500',
      icon: <Brain size={16} className="text-blue-500" />,
      lessons: [
        { id: 1, title: 'Introdução à Programação', duration: '90 min', type: 'theory' },
        { id: 2, title: 'Variáveis, constantes e tipos de dados', duration: '90 min', type: 'theory' },
        { id: 3, title: 'Primeiro programa (Algoritmos)', duration: '90 min', type: 'practice' },
        { id: 4, title: 'Tipos de operadores', duration: '90 min', type: 'theory' },
        { id: 5, title: 'Estrutura de decisão – Parte 1', duration: '90 min', type: 'theory' },
        { id: 6, title: 'Estrutura de decisão – Parte 2', duration: '90 min', type: 'practice' },
        { id: 7, title: 'Estrutura de repetição – Parte 1', duration: '90 min', type: 'theory' },
        { id: 8, title: 'Estrutura de repetição – Parte 2', duration: '90 min', type: 'practice' },
        { id: 9, title: 'Manipulação de vetores', duration: '90 min', type: 'practice' },
        { id: 10, title: 'Manipulação de matrizes', duration: '90 min', type: 'practice' },
        { id: 11, title: 'Funções e procedimentos', duration: '90 min', type: 'theory' },
        { id: 12, title: 'Modularização', duration: '90 min', type: 'theory' },
        { id: 13, title: 'Prática 1 (exercícios integrados)', duration: '90 min', type: 'exercise' },
        { id: 14, title: 'Prática 2 (projeto final)', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Python',
      description: 'Python do básico ao avançado para desenvolvimento profissional',
      duration: '24 horas',
      color: 'bg-yellow-500',
      icon: <Code size={16} className="text-yellow-500" />,
      lessons: [
        { id: 15, title: 'Iniciando no Python', duration: '90 min', type: 'theory' },
        { id: 16, title: 'Primeiros passos com Python', duration: '90 min', type: 'practice' },
        { id: 17, title: 'If, Else e Elif (Estruturas de decisão)', duration: '90 min', type: 'practice' },
        { id: 18, title: 'Loops (Estruturas de repetição)', duration: '90 min', type: 'practice' },
        { id: 19, title: 'Listas', duration: '90 min', type: 'practice' },
        { id: 20, title: 'Strings', duration: '90 min', type: 'practice' },
        { id: 21, title: 'Funções', duration: '90 min', type: 'theory' },
        { id: 22, title: 'Lidando com erros', duration: '90 min', type: 'practice' },
        { id: 23, title: 'Módulos e pacotes', duration: '90 min', type: 'theory' },
        { id: 24, title: 'Objetos (introdução à OOP)', duration: '90 min', type: 'theory' },
        { id: 25, title: 'Dicionários', duration: '90 min', type: 'practice' },
        { id: 26, title: 'Arquivos', duration: '90 min', type: 'practice' },
        { id: 27, title: 'Bibliotecas externas', duration: '90 min', type: 'theory' },
        { id: 28, title: 'Data e hora', duration: '90 min', type: 'practice' },
        { id: 29, title: 'Expressões regulares', duration: '90 min', type: 'theory' },
        { id: 30, title: 'Projeto final', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Java',
      description: 'Java para aplicações robustas e empresariais',
      duration: '24 horas',
      color: 'bg-red-500',
      icon: <Coffee size={16} className="text-red-500" />,
      lessons: [
        { id: 31, title: 'Introdução ao Java', duration: '90 min', type: 'theory' },
        { id: 32, title: 'Interface, componentes e variáveis', duration: '90 min', type: 'practice' },
        { id: 33, title: 'Operadores matemáticos, relacionais e controle de fluxo', duration: '90 min', type: 'theory' },
        { id: 34, title: 'Estrutura de repetição (For e While)', duration: '90 min', type: 'practice' },
        { id: 35, title: 'Manipulação de Strings', duration: '90 min', type: 'practice' },
        { id: 36, title: 'Variáveis compostas', duration: '90 min', type: 'practice' },
        { id: 37, title: 'Orientação a Objetos: Introdução', duration: '90 min', type: 'theory' },
        { id: 38, title: 'Projeto sem Orientação a Objetos (comparativo)', duration: '90 min', type: 'project' },
        { id: 39, title: 'Orientação a Objetos: Classes', duration: '90 min', type: 'theory' },
        { id: 40, title: 'Orientação a Objetos: Métodos', duration: '90 min', type: 'theory' },
        { id: 41, title: 'Orientação a Objetos: Métodos II', duration: '90 min', type: 'practice' },
        { id: 42, title: 'Encapsulamento', duration: '90 min', type: 'theory' },
        { id: 43, title: 'OOP: Vetor, Laço e Lista', duration: '90 min', type: 'practice' },
        { id: 44, title: 'Herança', duration: '90 min', type: 'theory' },
        { id: 45, title: 'Sobreposição e Interface Gráfica I', duration: '90 min', type: 'practice' },
        { id: 46, title: 'Interface Gráfica II', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'PHP & MySQL',
      description: 'PHP para desenvolvimento web e sistemas dinâmicos',
      duration: '30 horas',
      color: 'bg-purple-500',
      icon: <Database size={16} className="text-purple-500" />,
      lessons: [
        { id: 47, title: 'Introdução ao PHP', duration: '90 min', type: 'theory' },
        { id: 48, title: 'Notepad++ e Conceitos Básicos de Programação', duration: '90 min', type: 'practice' },
        { id: 49, title: 'Operadores de Comparação, Lógicos e Estrutura Condicional', duration: '90 min', type: 'theory' },
        { id: 50, title: 'Estrutura Condicional e Estrutura de Repetição', duration: '90 min', type: 'practice' },
        { id: 51, title: 'Estrutura de Repetição, Strings e Funções', duration: '90 min', type: 'practice' },
        { id: 52, title: 'Variáveis Compostas', duration: '90 min', type: 'practice' },
        { id: 53, title: 'Hospedagem de Site (publicação)', duration: '90 min', type: 'practice' },
        { id: 54, title: 'Cookies e Sessões', duration: '90 min', type: 'theory' },
        { id: 55, title: 'Integração PHP com HTML', duration: '90 min', type: 'practice' },
        { id: 56, title: 'Banco de Dados – Parte 1', duration: '90 min', type: 'theory' },
        { id: 57, title: 'Banco de Dados – Parte 2', duration: '90 min', type: 'practice' },
        { id: 58, title: 'Projeto Etapa 1: Estrutura, Conexão, Exibir Categorias e Produtos', duration: '90 min', type: 'project' },
        { id: 59, title: 'Projeto Etapa 2: Detalhes do Produto e Área Administrativa', duration: '90 min', type: 'project' },
        { id: 60, title: 'Projeto Etapa 3: Excluir Categoria e Cadastrar Produtos', duration: '90 min', type: 'project' },
        { id: 61, title: 'Projeto Etapa 4: Editar e Atualizar Produtos', duration: '90 min', type: 'project' },
        { id: 62, title: 'Projeto Etapa 5: Excluir Produto e Área de Pedidos', duration: '90 min', type: 'project' },
        { id: 63, title: 'Projeto Etapa 6: Excluir Pedido e Cadastrar Cliente', duration: '90 min', type: 'project' },
        { id: 64, title: 'Projeto Etapa 7: Listar Pedidos dos Clientes', duration: '90 min', type: 'project' },
        { id: 65, title: 'Projeto Etapa 8: Editar e Atualizar (funcionalidades finais)', duration: '90 min', type: 'project' },
        { id: 66, title: 'Ativar/Desativar Cliente, Login e Hospedagem', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 5,
      title: 'Android Studio',
      description: 'Desenvolvimento de apps nativos para Android',
      duration: '24 horas',
      color: 'bg-green-500',
      icon: <DeviceMobile size={16} className="text-green-500" />,
      lessons: [
        { id: 67, title: 'Introdução ao Android Studio', duration: '90 min', type: 'theory' },
        { id: 68, title: 'Interface e componentes', duration: '90 min', type: 'practice' },
        { id: 69, title: 'Variáveis e tipos', duration: '90 min', type: 'theory' },
        { id: 70, title: 'Operadores matemáticos e estruturas condicionais', duration: '90 min', type: 'theory' },
        { id: 71, title: 'Estruturas condicionais, tratamento de texto e layout', duration: '90 min', type: 'practice' },
        { id: 72, title: 'Layout, Arrays e navegando entre telas (Activities)', duration: '90 min', type: 'practice' },
        { id: 73, title: 'Orientação a Objetos (Métodos, Classes e Herança)', duration: '90 min', type: 'theory' },
        { id: 74, title: 'Modificadores de acesso', duration: '90 min', type: 'theory' },
        { id: 75, title: 'XML e layout adaptável', duration: '90 min', type: 'practice' },
        { id: 76, title: 'Guidelines (Diretrizes de design)', duration: '90 min', type: 'theory' },
        { id: 77, title: 'Chain, GridLayout e Componentes de formulário', duration: '90 min', type: 'practice' },
        { id: 78, title: 'Componentes de formulário (continuação)', duration: '90 min', type: 'practice' },
        { id: 79, title: 'Mídia + Projeto "Cadastro de Clientes"', duration: '90 min', type: 'project' },
        { id: 80, title: 'Banco de Dados + Projeto "Cadastro de Clientes"', duration: '90 min', type: 'project' },
        { id: 81, title: 'Banco de Dados + Projeto "Cadastro de Clientes" (continuação)', duration: '90 min', type: 'project' },
        { id: 82, title: 'Projeto "Cadastro de Clientes" + Publicação na Google Play', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 6,
      title: 'Claude Code',
      description: 'Desenvolvimento assistido por Inteligência Artificial com Claude Code',
      duration: '15 horas',
      color: 'bg-teal-500',
      icon: <Robot size={16} className="text-teal-500" />,
      lessons: [
        { id: 83, title: 'Introdução ao Claude Code', duration: '90 min', type: 'theory' },
        { id: 84, title: 'Configuração e Primeiros Passos', duration: '90 min', type: 'practice' },
        { id: 85, title: 'IA Assistant para Programação', duration: '90 min', type: 'practice' },
        { id: 86, title: 'Geração Automática de Código', duration: '90 min', type: 'practice' },
        { id: 87, title: 'Debugging com IA', duration: '90 min', type: 'practice' },
        { id: 88, title: 'Refatoração Inteligente', duration: '90 min', type: 'practice' },
        { id: 89, title: 'Documentação Automatizada', duration: '90 min', type: 'theory' },
        { id: 90, title: 'Testes Unitários com IA', duration: '90 min', type: 'practice' },
        { id: 91, title: 'Otimização de Performance com IA', duration: '90 min', type: 'practice' },
        { id: 92, title: 'Projeto Final: App Completo com Claude Code', duration: '90 min', type: 'project' },
      ],
    }
  ]

  // Função para calcular estatísticas do módulo
  const getModuleStats = (lessons) => {
    const stats = {
      total: lessons.length,
      theory: lessons.filter(l => l.type === 'theory').length,
      practice: lessons.filter(l => l.type === 'practice').length,
      exercises: lessons.filter(l => l.type === 'exercise').length,
      projects: lessons.filter(l => l.type === 'project').length
    }
    return stats
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'theory': return <BookOpen className="w-4 h-4" />
      case 'practice': return <Code className="w-4 h-4" />
      case 'exercise': return <PencilSimple className="w-4 h-4" />
      case 'project': return <Rocket className="w-4 h-4" />
      default: return <Book className="w-4 h-4" />
    }
  }

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'theory': return 'secondary'
      case 'practice': return 'default'
      case 'exercise': return 'outline'
      case 'project': return 'destructive'
      default: return 'secondary'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'theory': return 'Teórica'
      case 'practice': return 'Prática'
      case 'exercise': return 'Exercício'
      case 'project': return 'Projeto'
      default: return 'Aula'
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-teal font-semibold mb-3 sm:mb-4 text-sm sm:text-base">GRADE CURRICULAR</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
            6 Módulos Completos de Programação
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Do zero ao programador: 133 horas de conteúdo prático e projetos reais
          </p>
        </div>

        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto p-1">
            {curriculum.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id.toString()} 
                className="text-xs sm:text-sm py-2 px-2 sm:px-3 data-[state=active]:bg-teal data-[state=active]:text-white"
              >
                <span className="hidden sm:inline mr-1">{module.icon}</span>
                <span className="truncate">{module.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {curriculum.map((module) => {
            const stats = getModuleStats(module.lessons)
            return (
              <TabsContent key={module.id} value={module.id.toString()} className="mt-6 sm:mt-8">
                <div className="bg-card border rounded-lg p-4 sm:p-6">
                  {/* Cabeçalho do Módulo */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${module.color} rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl`}>
                        {module.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold leading-tight">{module.title}</h3>
                        <p className="text-muted-foreground text-sm sm:text-base">{module.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="self-start sm:self-center whitespace-nowrap">
                      {module.duration}
                    </Badge>
                  </div>

                  {/* Cards de Estatísticas */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-teal">{stats.total}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Total de aulas</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-blue-600">{stats.theory}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Aulas teóricas</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-green-600">{stats.practice}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Aulas práticas</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-purple-600">{stats.projects}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Projetos</div>
                    </div>
                  </div>

                  {/* Lista de Aulas com ScrollArea */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Conteúdo programático:</h4>
                    <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="text-teal flex-shrink-0">
                                {getTypeIcon(lesson.type)}
                              </div>
                              <span className="text-xs sm:text-sm font-medium">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant={getTypeBadgeVariant(lesson.type)} className="text-xs">
                                {getTypeLabel(lesson.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>

        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-card border rounded-lg p-4 sm:p-6 inline-block w-full max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
              <span className="font-bold text-xl sm:text-2xl text-teal">133</span>
              <span className="text-muted-foreground text-sm sm:text-base">horas de curso</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Material didático incluso • Modalidades presencial e online
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}