// Temporary mock data for blog functionality
// This will be replaced with actual API calls once endpoints are implemented

const mockCategories = [
  {
    id: 1,
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Artigos sobre tecnologia e inovação',
    postCount: 7,
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'Educação',
    slug: 'educacao',
    description: 'Conteúdos educacionais e metodologias',
    postCount: 8,
    color: '#10B981'
  },
  {
    id: 3,
    name: 'Carreira',
    slug: 'carreira',
    description: 'Dicas para desenvolvimento profissional',
    postCount: 6,
    color: '#F59E0B'
  },
  {
    id: 4,
    name: 'Programação',
    slug: 'programacao',
    description: 'Tutoriais e conceitos de programação',
    postCount: 13,
    color: '#8B5CF6'
  },
  {
    id: 5,
    name: 'Design',
    slug: 'design',
    description: 'Tendências e técnicas de design',
    postCount: 4,
    color: '#EF4444'
  },
  {
    id: 6,
    name: 'Arquitetura',
    slug: 'arquitetura',
    description: 'Design arquitetônico e projetos de construção',
    postCount: 2,
    color: '#06B6D4'
  }
];

const mockPosts = [
  {
    id: 101,
    title: 'Como Construir seu Primeiro Agente de IA (+Template de Workflow Gratuito)',
    slug: 'como-construir-seu-primeiro-agente-ia-n8n',
    excerpt: 'Guia passo a passo para construir agentes de IA com três abordagens práticas: programação do zero, frameworks como LangChain ou ferramentas no-code como n8n para automação inteligente.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Imagine construir um assistente que pode pesquisar tópicos online, resumir as descobertas e salvá-las diretamente no seu Notion - automaticamente. Esse é o tipo de automação inteligente que os agentes de IA tornam possível.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/agente-ia-n8n/n8n-ai-agent-hero.jpg" alt="Como construir agentes de IA com n8n" class="w-full rounded-lg shadow-lg" />
          </div>
        </div>

        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6">Mas aqui está o verdadeiro desafio: fazer com que uma IA aja de forma confiável no mundo real - interagindo com APIs, fazendo scraping de sites, atualizando bancos de dados. Como você conecta o raciocínio da IA com as ferramentas que ela precisa para executar tarefas reais?</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">🤖 Três Abordagens para Construir Agentes de IA</h4>
            <ul class="space-y-2">
              <li><span class="text-cyan-300 font-semibold">Do zero:</span> <span class="text-zinc-300">Controle total, mas alta complexidade</span></li>
              <li><span class="text-cyan-300 font-semibold">Com frameworks:</span> <span class="text-zinc-300">LangChain, CrewAI para flexibilidade</span></li>
              <li><span class="text-cyan-300 font-semibold">Com n8n:</span> <span class="text-zinc-300">Visual, rápido e pronto para produção</span></li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Componentes Fundamentais de Agentes de IA</h2>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🔍 Percepção</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Comandos de texto do usuário</li>
                <li>• Eventos de outros sistemas</li>
                <li>• Dados de APIs e websites</li>
                <li>• Conteúdo de documentos</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">🧠 Tomada de Decisão</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• LLMs (GPT, Gemini, Claude)</li>
                <li>• Sistemas baseados em regras</li>
                <li>• Modelos de ML</li>
                <li>• Planejamento de tarefas</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">⚡ Ação</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Chamadas de API</li>
                <li>• Execução de workflows</li>
                <li>• Atualização de bancos de dados</li>
                <li>• Controle de dispositivos</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">💾 Memória</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Contexto de conversas</li>
                <li>• Preferências do usuário</li>
                <li>• Bases de conhecimento (RAG)</li>
                <li>• Aprendizado contínuo</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Tutorial Prático: Agente de Pesquisa com n8n</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Vamos construir um agente de pesquisa prático que faz scraping da web e salva o resumo para nós - automaticamente!</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/agente-ia-n8n/n8n-research-agent-workflow.png" alt="Workflow do agente de pesquisa n8n" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Workflow do agente de pesquisa que vamos construir</p>
          </div>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">📋 Pré-requisitos</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• Instância n8n (Cloud ou auto-hospedada)</li>
              <li>• Acesso ao Browserless para web scraping</li>
              <li>• Chave da API do Google AI (Gemini)</li>
              <li>• Webhook do Discord para notificações</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-bold text-white mb-4">Passo 1: Configure o Gatilho</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Todo workflow do n8n começa com um nó de gatilho. Para nosso agente, usamos o <strong>Chat Trigger</strong> que permite interação via mensagens.</p>
          
          <div class="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <p class="text-zinc-300"><strong>Dica:</strong> Você também pode usar Webhook Trigger para integrações customizadas ou Slack Trigger para comandos do Slack.</p>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-bold text-white mb-4">Passo 2: Configure o Núcleo do Agente</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O coração do workflow é o <strong>AI Agent node</strong>, que orquestra a comunicação entre o gatilho, o LLM e as ferramentas.</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/agente-ia-n8n/ai-agent-node-config.png" alt="Configuração do nó AI Agent" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Configuração do nó AI Agent no n8n</p>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-bold text-white mb-4">Passo 3: Defina Instruções do Agente</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Configure o modelo Gemini e defina as instruções do sistema para orientar o comportamento do agente.</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/agente-ia-n8n/google-gemini-llm-config.png" alt="Configuração do LLM Google Gemini" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Configuração do Google Gemini como modelo de linguagem</p>
          </div>
          
          <div class="bg-zinc-800/50 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">📝 Exemplo de System Message</h4>
            <code class="text-green-300 text-sm">
              Você é um agente de pesquisa inteligente. Sua tarefa é:<br/>
              1. Fazer scraping do website usando a ferramenta website_scraper<br/>
              2. Resumir o conteúdo em português<br/>
              3. Salvar no Notion usando save_to_notion<br/>
              4. Notificar via Discord quando concluído
            </code>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-bold text-white mb-4">Passo 4: Ferramentas do Agente</h3>
          
          <h4 class="text-lg font-semibold text-white mb-3">Ferramenta de Web Scraping</h4>
          <p class="text-zinc-300 leading-relaxed mb-4">Configure o HTTP Request Tool para fazer scraping usando Browserless:</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/agente-ia-n8n/browserless-scraping-tool.png" alt="Configuração da ferramenta de web scraping" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Configuração do Browserless para web scraping</p>
          </div>
          
          <h4 class="text-lg font-semibold text-white mb-3 mt-8">Ferramenta Notion</h4>
          <p class="text-zinc-300 leading-relaxed mb-4">Configure a integração com Notion para salvar os resultados da pesquisa automaticamente.</p>
          
          <h4 class="text-lg font-semibold text-white mb-3 mt-8">Notificações Discord</h4>
          <p class="text-zinc-300 leading-relaxed mb-4">Configure notificações para acompanhar o progresso do agente em tempo real.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Exercícios Práticos</h2>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">🟢 Iniciante</h4>
              <h5 class="text-white font-medium mb-2">Personalizando o Agente</h5>
              <p class="text-zinc-300 text-sm mb-3">Tempo: 20 min</p>
              <ul class="text-zinc-300 text-sm space-y-1">
                <li>• Adicionar análise de sentimento</li>
                <li>• Incluir resumo executivo</li>
                <li>• Categorização automática</li>
              </ul>
            </div>
            
            <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">🟡 Intermediário</h4>
              <h5 class="text-white font-medium mb-2">Multi-Plataforma</h5>
              <p class="text-zinc-300 text-sm mb-3">Tempo: 45 min</p>
              <ul class="text-zinc-300 text-sm space-y-1">
                <li>• Integração Google Sheets</li>
                <li>• Relatórios por email</li>
                <li>• Posts no LinkedIn</li>
              </ul>
            </div>
            
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">🔴 Avançado</h4>
              <h5 class="text-white font-medium mb-2">Monitoramento</h5>
              <p class="text-zinc-300 text-sm mb-3">Tempo: 60 min</p>
              <ul class="text-zinc-300 text-sm space-y-1">
                <li>• Monitorar RSS feeds</li>
                <li>• Filtros por palavra-chave</li>
                <li>• Boletim automatizado</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Os agentes de IA representam uma evolução natural da automação, permitindo sistemas que não apenas executam tarefas, mas tomam decisões inteligentes sobre como executá-las.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Com o n8n, você pode construir agentes poderosos sem a complexidade da programação tradicional, focando na lógica de negócio e na integração de ferramentas.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">🚀 Próximos Passos</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• Experimente com diferentes LLMs (OpenAI, Claude, etc.)</li>
              <li>• Construa agentes para casos de uso específicos</li>
              <li>• Explore a comunidade n8n para inspiração</li>
              <li>• Implemente monitoramento e logs avançados</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed">A automação inteligente está apenas começando. Com as ferramentas certas e o conhecimento adequado, você pode criar soluções que revolucionam a forma como trabalha e cria valor.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: { id: 4, name: 'Programação', slug: 'programacao', color: '#8B5CF6' },
    featuredImage: '/images/blog/agente-ia-n8n/n8n-ai-agent-hero.jpg',
    featured_image_url: '/images/blog/agente-ia-n8n/n8n-ai-agent-hero.jpg',
    publishedAt: '2025-07-31T14:30:00.000Z',
    readingTime: 16,
    tags: ['ia', 'automacao', 'n8n', 'agentes-ia', 'workflow', 'tutorial', 'gemini', 'no-code'],
    views: 0,
    likes: 0
  },
  {
    id: 100,
    title: '5 Maneiras de Maximizar Vistas Magníficas para Casas Personalizadas',
    slug: 'cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas',
    excerpt: 'Aprenda cinco dicas de design da MGA Architecture para criar casas de alto padrão que otimizam vistas impressionantes da natureza. Descubra como posicionamento estratégico, estruturas adequadas e plantas inovadoras transformam projetos.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Aprenda cinco dicas de design de especialistas da MGA Architecture para criar casas de alto padrão que otimizam vistas impressionantes da natureza.</p>
          
          <div class="article-image mb-8">
            <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_1.jpg" alt="Fotografia de uma sala de estar com vista para um corpo d'água" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Imagem cortesia da MGA Architecture. Fotógrafo: Trent Bell</p>
          </div>
        </div>

        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6">Os melhores designers residenciais projetam com as vistas em mente, criando casas que não são apenas espaços habitáveis, mas pontos de observação para o exterior. Cada escolha de design deve estar enraizada no que as pessoas que vivem no espaço irão experimentar e como funciona para suas necessidades diárias.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A MGA Architecture, um estúdio de design de Boston, Massachusetts, se destaca em otimizar vistas impressionantes para seus clientes. A empresa acredita que todo espaço merece beleza e propósito e tem dedicado mais de 20 anos a enriquecer a vida diária das pessoas através de design significativo.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">🏠 Navegação Rápida</h4>
            <ul class="space-y-2">
              <li><a href="#section1" class="text-zinc-300 hover:text-cyan-300 transition-colors">1. Posicionamento estratégico no terreno</a></li>
              <li><a href="#section2" class="text-zinc-300 hover:text-cyan-300 transition-colors">2. Escolha estruturas que suportem janelas grandes</a></li>
              <li><a href="#section3" class="text-zinc-300 hover:text-cyan-300 transition-colors">3. Projete plantas baixas inovadoras</a></li>
              <li><a href="#section4" class="text-zinc-300 hover:text-cyan-300 transition-colors">4. Sequencie as vistas para uma revelação gradual</a></li>
              <li><a href="#section5" class="text-zinc-300 hover:text-cyan-300 transition-colors">5. Integre espaços internos e externos</a></li>
            </ul>
          </div>
        </div>

        <div class="article-section" id="section1">
          <h2 class="text-2xl font-bold text-white mb-6">1. Posicionamento estratégico no terreno</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Determinar a localização e orientação perfeitas de uma casa maximiza as vistas que os moradores podem desfrutar. A MGA posiciona cuidadosamente cada habitação em um local específico no terreno.</p>
          
          <div class="article-image mb-6">
            <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_2.jpg" alt="Vista aérea dos muitos edifícios da residência Governor's Island" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Vista aérea dos edifícios da residência Governor's Island, estrategicamente posicionados</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O complexo residencial que projetaram na Ilha do Governador, Gilford, NH, é uma ilustração principal deste conceito. Este projeto, posicionado em uma península, oferece aos ocupantes um luxo raro — testemunhar o amanhecer e o pôr do sol sobre o Lago Winnipesaukee.</p>
          
          <div class="article-image mb-6">
            <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_3.png" alt="Modelo SketchUp do complexo" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Modelo SketchUp mostra o planejamento detalhado. Imagem cortesia da MGA</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A MGA usou o SketchUp para criar o projeto conceitual do local, importando dados do Google Maps para o software de modelagem 3D para melhor compreender a topografia e as sombras. Usando esses dados, posicionaram as estruturas de modo que cada uma proporcionasse linhas de visão claras.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_4.png" alt="Modelo SketchUp da vista da casa principal" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Modelo SketchUp da vista principal</p>
            </div>
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_5.jpg" alt="Foto da casa principal" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Resultado final construído</p>
            </div>
          </div>
          
          <div class="article-quote bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-l-4 border-purple-500 p-6 my-6">
            <blockquote class="text-zinc-300 leading-relaxed italic mb-4">
              "Usamos o SketchUp para descobrir como todos os materiais de uma casa funcionarão juntos. Isso torna o processo de desenho no AutoCAD muito fácil. Não usamos Revit porque é muito desajeitado para nossos detalhes personalizados – o SketchUp é intuitivo."
            </blockquote>
            <cite class="text-zinc-400 text-sm">— Marcus Gleysteen, RA, Sócio Responsável da MGA</cite>
          </div>
        </div>

        <div class="article-section" id="section2">
          <h2 class="text-2xl font-bold text-white mb-6">2. Escolha estruturas que suportem janelas grandes</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Ter vastas extensões de janelas é a melhor maneira de maximizar belas vistas, mas janelas grandes podem ser desafiadoras de suportar estruturalmente. A equipe da MGA conhece bem esse problema, pois muitos de seus projetos estão em zonas de terremotos e furacões.</p>
          
          <div class="article-image mb-6">
            <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_7.jpg" alt="Vista do gramado da Lake Point House" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Vista externa da Lake Point House. Fotógrafo: Joshua McHugh</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Eles usam estruturas de aço em vez de madeira para essas condições. O vidro deve resistir a força horizontal pesada, e a natureza flexível da madeira faria o vidro sofrer tensão, flexionar e eventualmente quebrar.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_9.jpg" alt="A estrutura de aço é recuada das janelas" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Estrutura de aço recuada das janelas</p>
            </div>
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_10.jpg" alt="Modelo SketchUp correspondente" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Modelo SketchUp correspondente</p>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A estrutura de aço da Lake Point House permite vistas panorâmicas da orla e incorpora colunas de aço esteticamente no design geral. Em vez de envolver as colunas de aço na montagem, a MGA conscientemente escolheu fazer esculturas das colunas.</p>
          
          <div class="article-image mb-6">
            <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_11.jpg" alt="Vista da sala de estar da Lake Point House" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Interior com vistas panorâmicas. Fotógrafo: Joshua McHugh</p>
          </div>
        </div>

        <div class="article-section" id="section3">
          <h2 class="text-2xl font-bold text-white mb-6">3. Projete plantas baixas inovadoras</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O design inovador de plantas baixas é fundamental para maximizar as vistas. Isso envolve posicionar estrategicamente os cômodos principais — como salas de estar, cozinhas e quartos master — voltados para as melhores vistas.</p>
          
          <div class="article-tips bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6 my-6">
            <h4 class="text-emerald-300 font-semibold mb-4">✨ Estratégias de Layout</h4>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Cozinhas abertas:</strong> Conectadas às salas de estar para vistas contínuas</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Grandes aberturas:</strong> Entre cômodos para fluxo visual</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Escadas estratégicas:</strong> Posicionadas para não bloquear vistas</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Múltiplos níveis:</strong> Criando diferentes perspectivas da paisagem</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="article-section" id="section4">
          <h2 class="text-2xl font-bold text-white mb-6">4. Sequencie as vistas para uma revelação gradual</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_13.jpg" alt="Vista exterior mostrando sequenciamento" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Sequenciamento de vistas na arquitetura</p>
            </div>
            <div class="article-image">
              <img src="/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_14.jpg" alt="Detalhe arquitetônico" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Detalhes que guiam o olhar</p>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Uma das técnicas mais sofisticadas no design de casas com vistas impressionantes é o sequenciamento cuidadoso das vistas. Em vez de revelar toda a vista de uma vez, designers experientes criam uma jornada visual que se desdobra gradualmente.</p>
          
          <div class="article-tips bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-4">🎭 Técnicas de Revelação</h4>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Vistas parciais:</strong> Vislumbres da paisagem através de aberturas estratégicas</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Revelação progressiva:</strong> Cada cômodo revela mais da vista total</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Pontos focais múltiplos:</strong> Diferentes aspectos da vista em cada área</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Transições dramáticas:</strong> Momentos de revelação completa para impacto emocional</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="article-section" id="section5">
          <h2 class="text-2xl font-bold text-white mb-6">5. Integre espaços internos e externos</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A integração perfeita entre espaços internos e externos é crucial para maximizar vistas magníficas. Esta não é apenas uma questão estética, mas uma estratégia funcional que expande visualmente o espaço habitável.</p>
          
          <div class="article-tips bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-4">🌿 Técnicas de Integração</h4>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Portas de vidro floor-to-ceiling:</strong> Transições perfeitas quando abertas</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Materiais contínuos:</strong> Mesmos pisos e cores dentro e fora</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Terraços estratégicos:</strong> Extensões naturais dos espaços internos</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Paisagismo coordenado:</strong> Complementando vistas naturais existentes</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Maximizar vistas magníficas em casas personalizadas requer uma abordagem holística que considera localização, estrutura, layout, sequenciamento e integração de espaços. Os especialistas da MGA demonstram que com planejamento cuidadoso e uso inteligente de ferramentas como o SketchUp, é possível criar casas que não apenas habitamos, mas que nos conectam profundamente com a beleza natural ao nosso redor.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Cada projeto é único, mas estes cinco princípios fornecem uma base sólida para qualquer um que deseje criar espaços que celebrem e otimizem as vistas disponíveis. O investimento em um design considerado resulta em casas que proporcionam prazer visual duradouro e uma conexão mais profunda com o ambiente natural.</p>
          
          <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6 my-6">
            <h4 class="text-orange-300 font-semibold mb-3">🏗️ Aprenda Design Arquitetônico</h4>
            <p class="text-zinc-300 mb-4">Interessado em dominar essas técnicas? Na Escola Habilidade, oferecemos cursos especializados em:</p>
            <ul class="space-y-2">
              <li class="text-zinc-300">• SketchUp para Arquitetura e Design</li>
              <li class="text-zinc-300">• Modelagem 3D e Visualização Arquitetônica</li>
              <li class="text-zinc-300">• Design Sustentável e Bioclimático</li>
              <li class="text-zinc-300">• Paisagismo e Integração com o Ambiente</li>
            </ul>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Equipe Escola Habilidade', avatar: '/assets/avatars/escola-habilidade.jpg' },
    category: { id: 6, name: 'Arquitetura', slug: 'arquitetura', color: '#06B6D4' },
    featuredImage: '/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_1.jpg',
    featured_image_url: '/assets/blog/five-ways-magnificent-views/2024_687205183_five_ways_to_1.jpg',
    publishedAt: '2025-07-31T10:00:00.000Z',
    readingTime: 12,
    tags: ['arquitetura', 'design', 'sketchup', 'casas-personalizadas', 'vistas', 'construção', 'paisagismo'],
    views: 0,
    likes: 0
  },
  {
    id: 1,
    title: 'Como Começar na Programação em 2024',
    slug: 'como-comecar-programacao-2024',
    excerpt: 'Guia completo para iniciantes que querem entrar no mundo da programação.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">A programação é uma das habilidades mais valiosas no mercado atual</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Neste guia, você aprenderá os primeiros passos para se tornar um programador, desde escolher sua primeira linguagem até conseguir seu primeiro emprego na área.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">1. Escolhendo sua primeira linguagem de programação</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Para iniciantes, recomendamos começar com uma das seguintes linguagens:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Python</strong> - Sintaxe simples e versatilidade para web, dados e automação</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">JavaScript</strong> - Essencial para desenvolvimento web e cada vez mais usado em outras áreas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Java</strong> - Linguagem robusta, muito usada em empresas e com boa demanda no mercado</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">2. Recursos gratuitos para aprender</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Existem muitos recursos gratuitos disponíveis:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">freeCodeCamp</strong> - Cursos completos e gratuitos</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Codecademy</strong> - Plataforma interativa de aprendizado</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">MDN Web Docs</strong> - Documentação completa para desenvolvimento web</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">YouTube</strong> - Canais como Curso em Vídeo, DevMedia</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">3. Prática é fundamental</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">A melhor forma de aprender programação é praticando. Comece com projetos simples:</p>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed">Calculadora básica</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed">Lista de tarefas (To-Do List)</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed">Jogo da velha</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed">Sistema de cadastro simples</span>
            </li>
          </ol>
        </div>

        <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
          <h4 class="text-blue-300 font-semibold mb-3">💡 Dica Importante</h4>
          <p class="text-zinc-300">Não tenha medo de errar! Os erros são parte fundamental do aprendizado em programação. Cada bug que você resolve te torna um programador mais experiente.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">4. Construindo um portfólio</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Um portfólio sólido é essencial para conseguir oportunidades. Crie uma conta no GitHub e publique seus projetos. Inclua:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Código bem documentado</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">README explicativo</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Projetos que demonstrem diferentes habilidades</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Contribuições para projetos open source</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">5. Networking e comunidade</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Participar de comunidades é crucial para o crescimento profissional:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Grupos no Discord e Slack</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Meetups locais</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Conferences e eventos online</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">LinkedIn para conexões profissionais</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">6. Preparando-se para o mercado de trabalho</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Quando se sentir confortável com os conceitos básicos:</p>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed">Estude estruturas de dados e algoritmos</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed">Aprenda sobre versionamento com Git</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed">Entenda conceitos de banco de dados</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed">Pratique entrevistas técnicas</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed">Considere fazer estágios ou trabalhos freelance</span>
            </li>
          </ol>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Conclusão</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">A jornada na programação requer dedicação e prática constante, mas as oportunidades são enormes. Comece hoje mesmo e seja consistente nos estudos. Lembre-se: todo programador experiente já foi um iniciante.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[3], // Programação
    featuredImage: '/assets/blog/programacao-2024.jpg',
    featured_image_url: '/assets/blog/programacao-2024.jpg',
    publishedAt: '2024-01-15T10:00:00.000Z',
    readingTime: 8,
    tags: ['programação', 'iniciantes', 'carreira'],
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: 'Design Thinking na Educação Tecnológica',
    slug: 'design-thinking-educacao-tecnologica',
    excerpt: 'Como aplicar metodologias de design para melhorar o aprendizado.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">O Design Thinking revoluciona a forma como aprendemos e ensinamos tecnologia</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Esta metodologia cria experiências mais envolventes e eficazes, colocando o aluno no centro do processo educacional.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">O que é Design Thinking?</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Design Thinking é uma abordagem centrada no ser humano para inovação que integra as necessidades das pessoas, as possibilidades da tecnologia e os requisitos para o sucesso.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6 mt-8">Implementação do Design Thinking na Educação</h2>
          <h3 class="text-xl font-semibold text-white mb-4">Os 5 estágios do Design Thinking na educação</h3>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">1. Empatizar</h4>
              <p class="text-zinc-300">Compreender profundamente as necessidades, dificuldades e motivações dos estudantes.</p>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">2. Definir</h4>
              <p class="text-zinc-300">Sintetizar as observações em uma declaração clara do problema a ser resolvido.</p>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">3. Idealizar</h4>
              <p class="text-zinc-300">Gerar uma ampla gama de ideias criativas e soluções potenciais.</p>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">4. Prototipar</h4>
              <p class="text-zinc-300">Criar versões experimentais de soluções para testar hipóteses.</p>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">5. Testar</h4>
              <p class="text-zinc-300">Avaliar os protótipos com usuários reais e refinar com base no feedback.</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Aplicações práticas na educação tecnológica</h3>
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Desenvolvimento de currículos mais envolventes</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Criação de interfaces de aprendizado intuitivas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Métodos de avaliação mais humanizados</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Ambientes de aprendizado colaborativo</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Benefícios observados</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Instituições que implementaram Design Thinking relatam:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Maior engajamento dos estudantes</strong> - Aumento significativo na participação ativa</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Redução nas taxas de evasão</strong> - Estudantes se sentem mais conectados</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Melhoria na retenção de conhecimento</strong> - Aprendizado mais duradouro</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Desenvolvimento de soft skills</strong> - Competências socioemocionais</span>
            </li>
          </ul>
        </div>

        <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
          <h4 class="text-green-300 font-semibold mb-3">🎯 Design Thinking na Escola Habilidade</h4>
          <p class="text-zinc-300">Aplicamos metodologias de Design Thinking em nossos cursos para criar experiências de aprendizado mais engajantes e eficazes. Venha descobrir como essa abordagem pode transformar sua jornada educacional.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[1], // Educação
    featuredImage: '/assets/blog/design-thinking.jpg',
    featured_image_url: '/assets/blog/design-thinking.jpg',
    publishedAt: '2024-01-10T14:30:00.000Z',
    readingTime: 6,
    tags: ['design thinking', 'educação', 'metodologia'],
    views: 892,
    likes: 67
  },
  {
    id: 3,
    title: 'Tendências Tecnológicas para 2024',
    slug: 'tendencias-tecnologicas-2024',
    excerpt: 'As principais tecnologias que vão dominar o mercado este ano.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">As tecnologias que estão moldando o futuro digital</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Inteligência Artificial, Machine Learning, blockchain e outras tecnologias estão revolucionando a forma como vivemos e trabalhamos.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">1. Inteligência Artificial Generativa</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">2024 marca o ano da democratização da IA. Ferramentas como ChatGPT, Claude e Gemini estão transformando:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Produção de conteúdo</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Desenvolvimento de software</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Atendimento ao cliente</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Análise de dados</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">2. Computação Edge</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O processamento mais próximo do usuário final oferece:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Menor latência</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Maior privacidade dos dados</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Redução no consumo de banda</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Melhor performance em IoT</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">3. Desenvolvimento Low-Code/No-Code</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Plataformas que permitem criar aplicações sem programação tradicional:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Democratização do desenvolvimento</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Agilidade na prototipagem</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Redução de custos</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Foco na lógica de negócio</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">4. Blockchain e Web3</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Além de criptomoedas, blockchain oferece:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Contratos inteligentes</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Supply chain transparente</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Identidade digital descentralizada</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">NFTs e ativos digitais</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">5. Computação Quântica</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Embora ainda emergente, promete revolucionar:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Criptografia</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Simulações complexas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Inteligência artificial</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Pesquisa farmacêutica</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Impacto no mercado de trabalho</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Essas tendências criam oportunidades em:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Especialistas em IA e Machine Learning</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Desenvolvedores de aplicações edge</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Arquitetos de soluções blockchain</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Cientistas de dados quânticos</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Como se preparar</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Para profissionais de tecnologia:</p>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed">Mantenha-se atualizado com cursos online</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed">Pratique com projetos pessoais</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed">Participe de comunidades técnicas</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed">Desenvolva soft skills</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed">Considere certificações relevantes</span>
            </li>
          </ol>
        </div>

        <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
          <h4 class="text-blue-300 font-semibold mb-3">🚀 Esteja Preparado para o Futuro</h4>
          <p class="text-zinc-300">Na Escola Habilidade, mantemos nossos cursos sempre atualizados com as últimas tendências tecnológicas. Prepare-se para o futuro digital com conhecimento prático e aplicável no mercado.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[0], // Tecnologia
    featuredImage: '/assets/blog/tendencias-2024.jpg',
    featured_image_url: '/assets/blog/tendencias-2024.jpg',
    publishedAt: '2024-01-05T09:15:00.000Z',
    readingTime: 10,
    tags: ['tecnologia', 'tendências', 'futuro'],
    views: 2104,
    likes: 156
  },
  {
    id: 4,
    title: 'Construindo uma Carreira Sólida em Tech',
    slug: 'construindo-carreira-solida-tech',
    excerpt: 'Estratégias essenciais para desenvolver uma carreira de sucesso na área tecnológica.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">O mercado de tecnologia oferece inúmeras oportunidades</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Saiba como se posicionar e crescer profissionalmente em uma das áreas mais dinâmicas do mercado atual.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">1. Definindo seu caminho</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">A área de tecnologia oferece diversos caminhos:</p>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">Desenvolvimento</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Frontend (React, Vue, Angular)</li>
                <li class="text-zinc-300 leading-relaxed">• Backend (Node, Python, Java)</li>
                <li class="text-zinc-300 leading-relaxed">• Mobile (React Native, Flutter)</li>
                <li class="text-zinc-300 leading-relaxed">• Full Stack</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">Dados</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Data Science</li>
                <li class="text-zinc-300 leading-relaxed">• Data Engineering</li>
                <li class="text-zinc-300 leading-relaxed">• Business Intelligence</li>
                <li class="text-zinc-300 leading-relaxed">• Machine Learning Engineer</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">Infraestrutura</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• DevOps</li>
                <li class="text-zinc-300 leading-relaxed">• Cloud Engineer</li>
                <li class="text-zinc-300 leading-relaxed">• Site Reliability Engineer</li>
                <li class="text-zinc-300 leading-relaxed">• Cybersecurity</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">2. Desenvolvendo habilidades técnicas</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Competências fundamentais independente da área:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Versionamento com Git</strong> - Controle de versão é essencial</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Metodologias ágeis</strong> - Scrum, Kanban e outras</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Testes automatizados</strong> - Garantia de qualidade</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Arquitetura de software</strong> - Design patterns e estruturas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Bancos de dados</strong> - SQL e NoSQL</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">3. Soft skills essenciais</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Habilidades comportamentais são diferenciais:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Comunicação clara e objetiva</strong> - Explicar conceitos técnicos</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Trabalho em equipe</strong> - Colaboração eficaz</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Resolução de problemas</strong> - Pensamento crítico</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Aprendizado contínuo</strong> - Adaptabilidade</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Gestão de tempo</strong> - Organização e produtividade</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">4. Construindo um portfólio impressionante</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Seu portfólio deve demonstrar:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Projetos completos e funcionais</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Código limpo e bem documentado</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Diversidade de tecnologias</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Evolução ao longo do tempo</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Contribuições open source</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">5. Networking estratégico</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Construa relacionamentos profissionais através de:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">LinkedIn ativo e otimizado</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Participação em eventos tech</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Contribuições para comunidades</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Mentoria (dar e receber)</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Palestras e workshops</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">6. Planejamento de carreira</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Estabeleça metas claras:</p>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed">Defina onde quer estar em 1, 3 e 5 anos</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed">Identifique gaps de conhecimento</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed">Crie um plano de estudos estruturado</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed">Busque feedback regular</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed">Ajuste o plano conforme necessário</span>
            </li>
          </ol>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">7. Negociação salarial</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Dicas para negociar melhor:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Pesquise salários de mercado</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Documente suas conquistas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Prepare argumentos baseados em valor</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Considere benefícios além do salário</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Pratique a negociação</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Conclusão</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Uma carreira sólida em tech requer planejamento, dedicação e adaptabilidade. O mercado está em constante evolução, mas as oportunidades são abundantes para quem se prepara adequadamente.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">💼 Acelere sua Carreira Tech</h4>
            <p class="text-zinc-300">Na Escola Habilidade, oferecemos programas focados no desenvolvimento de carreira em tecnologia. Desde habilidades técnicas até preparação para entrevistas e networking estratégico.</p>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[2], // Carreira
    featuredImage: '/assets/blog/carreira-tech.jpg',
    featured_image_url: '/assets/blog/carreira-tech.jpg',
    publishedAt: '2023-12-28T16:45:00.000Z',
    readingTime: 7,
    tags: ['carreira', 'tecnologia', 'crescimento'],
    views: 1567,
    likes: 98
  },
  {
    id: 5,
    title: 'Princípios Fundamentais de UX/UI Design',
    slug: 'principios-fundamentais-ux-ui-design',
    excerpt: 'Entenda os conceitos básicos que todo designer deve conhecer.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">UX/UI Design vai muito além de fazer interfaces bonitas</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Conheça os princípios que criam experiências memoráveis e funcionais para os usuários.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Diferença entre UX e UI</h3>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">UX Design (User Experience)</h4>
              <p class="text-zinc-300 mb-3">Foca na experiência completa do usuário:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Pesquisa de usuário</li>
                <li class="text-zinc-300 leading-relaxed">• Arquitetura da informação</li>
                <li class="text-zinc-300 leading-relaxed">• Wireframes e protótipos</li>
                <li class="text-zinc-300 leading-relaxed">• Testes de usabilidade</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">UI Design (User Interface)</h4>
              <p class="text-zinc-300 mb-3">Concentra-se nos elementos visuais:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Layout e composição</li>
                <li class="text-zinc-300 leading-relaxed">• Tipografia</li>
                <li class="text-zinc-300 leading-relaxed">• Cores e contrastes</li>
                <li class="text-zinc-300 leading-relaxed">• Iconografia</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Princípios fundamentais de UX</h3>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">1. Usabilidade</h4>
              <p class="text-zinc-300 mb-3">A interface deve ser:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Fácil de aprender</li>
                <li class="text-zinc-300 leading-relaxed">• Eficiente de usar</li>
                <li class="text-zinc-300 leading-relaxed">• Fácil de lembrar</li>
                <li class="text-zinc-300 leading-relaxed">• Livre de erros</li>
                <li class="text-zinc-300 leading-relaxed">• Satisfatória de usar</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">2. Acessibilidade</h4>
              <p class="text-zinc-300 mb-3">Design inclusivo para todos os usuários:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Contraste adequado de cores</li>
                <li class="text-zinc-300 leading-relaxed">• Navegação por teclado</li>
                <li class="text-zinc-300 leading-relaxed">• Textos alternativos para imagens</li>
                <li class="text-zinc-300 leading-relaxed">• Tamanhos de fonte legíveis</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">3. Consistência</h4>
              <p class="text-zinc-300 mb-3">Manter padrões ao longo da experiência:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Visual consistency (cores, tipografia)</li>
                <li class="text-zinc-300 leading-relaxed">• Functional consistency (comportamentos)</li>
                <li class="text-zinc-300 leading-relaxed">• External consistency (padrões do mercado)</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Princípios fundamentais de UI</h3>
          
          <div class="flex flex-col gap-4">
            <div>
              <h4 class="text-lg font-medium text-white mb-2">1. Hierarquia Visual</h4>
              <p class="text-zinc-300 leading-relaxed mb-3">Guiar o olhar do usuário:</p>
              <ul class="space-y-2 mb-4">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Tamanho e peso da tipografia</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Cores e contrastes</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Espaçamento e proximidade</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Posicionamento estratégico</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">2. Lei de Fitts</h4>
              <p class="text-zinc-300 leading-relaxed mb-3">Elementos mais usados devem ser:</p>
              <ul class="space-y-2 mb-4">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Maiores</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Mais próximos</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Fáceis de acertar</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">3. Regra dos 8px</h4>
              <p class="text-zinc-300 leading-relaxed mb-3">Sistema de grid baseado em múltiplos de 8:</p>
              <ul class="space-y-2 mb-4">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Consistência visual</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Alinhamento perfeito</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Escalabilidade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Processo de Design</h3>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Research</strong> - Entender usuários e contexto</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Define</strong> - Definir problemas e objetivos</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Ideate</strong> - Gerar soluções criativas</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Prototype</strong> - Criar versões testáveis</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-blue-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Test</strong> - Validar com usuários reais</span>
            </li>
          </ol>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Ferramentas essenciais</h3>
          
          <div class="flex flex-col gap-4">
            <div>
              <h4 class="text-lg font-medium text-white mb-2">Design</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Figma</li>
                <li class="text-zinc-300 leading-relaxed">• Adobe XD</li>
                <li class="text-zinc-300 leading-relaxed">• Sketch</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">Prototipagem</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• InVision</li>
                <li class="text-zinc-300 leading-relaxed">• Principle</li>
                <li class="text-zinc-300 leading-relaxed">• Framer</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">Pesquisa</h4>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Hotjar</li>
                <li class="text-zinc-300 leading-relaxed">• Google Analytics</li>
                <li class="text-zinc-300 leading-relaxed">• Maze</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Tendências atuais</h3>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Dark mode</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Microinterações</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Design system</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Voice interfaces</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">AR/VR experiences</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Como começar na área</h3>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed">Estude os fundamentos de design</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed">Pratique com projetos pessoais</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed">Construa um portfólio diversificado</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed">Busque feedback da comunidade</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed">Mantenha-se atualizado com tendências</span>
            </li>
          </ol>
        </div>

        <div class="article-highlight bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg p-6 my-6">
          <h4 class="text-pink-300 font-semibold mb-3">🎨 Design que Transforma</h4>
          <p class="text-zinc-300">Na Escola Habilidade, ensinamos UX/UI Design com foco prático e projetos reais. Desenvolva habilidades que criam experiências digitais memoráveis e centradas no usuário.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[4], // Design
    featuredImage: '/assets/blog/ux-ui-design.jpg',
    featured_image_url: '/assets/blog/ux-ui-design.jpg',
    publishedAt: '2023-12-20T11:20:00.000Z',
    readingTime: 9,
    tags: ['design', 'ux', 'ui', 'interface'],
    views: 934,
    likes: 72
  },
  {
    id: 6,
    title: 'JavaScript Moderno: ES2024 e Suas Novidades',
    slug: 'javascript-moderno-es2024-novidades',
    excerpt: 'Explore as mais recentes funcionalidades do JavaScript e como usá-las.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">O JavaScript continua evoluindo</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Descubra as novidades do ES2024 e como elas podem melhorar seu código e produtividade.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Principais novidades do ES2024</h3>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">1. Array.prototype.with()</h4>
              <p class="text-zinc-300 mb-3">Método imutável para modificar arrays:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">const arr = [1, 2, 3, 4, 5];
const newArr = arr.with(2, 'three');
console.log(newArr); // [1, 2, 'three', 4, 5]
console.log(arr); // [1, 2, 3, 4, 5] (original inalterado)</code></pre>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">2. toSorted(), toReversed(), toSpliced()</h4>
              <p class="text-zinc-300 mb-3">Versões imutáveis dos métodos clássicos:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">const numbers = [3, 1, 4, 1, 5];

// Versões mutáveis (antigas)
numbers.sort(); // modifica o array original

// Versões imutáveis (novas)
const sorted = numbers.toSorted(); // retorna novo array
const reversed = numbers.toReversed(); // retorna novo array</code></pre>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">3. Array.prototype.findLast() e findLastIndex()</h4>
              <p class="text-zinc-300 mb-3">Busca elementos a partir do final do array:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true }
];

const lastActive = users.findLast(user => user.active);
console.log(lastActive); // { id: 3, active: true }</code></pre>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">4. Object.groupBy()</h4>
              <p class="text-zinc-300 mb-3">Agrupa elementos de array por critério:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">const products = [
  { name: 'Laptop', category: 'Electronics' },
  { name: 'Shirt', category: 'Clothing' },
  { name: 'Phone', category: 'Electronics' }
];

const grouped = Object.groupBy(products, item => item.category);
console.log(grouped);
// {
//   Electronics: [{ name: 'Laptop', category: 'Electronics' }, ...],
//   Clothing: [{ name: 'Shirt', category: 'Clothing' }]
// }</code></pre>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Melhorias em Pattern Matching</h3>
          
          <div class="article-highlight bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
            <h4 class="text-indigo-300 font-semibold mb-3">Switch Expressions</h4>
            <p class="text-zinc-300 mb-3">Sintaxe mais concisa para switch:</p>
            <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">const getDayType = (day) => switch (day) {
  case 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' => 'Weekday'
  case 'Saturday', 'Sunday' => 'Weekend'
  default => 'Invalid day'
};</code></pre>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Async/Await Enhancements</h3>
          
          <div class="article-highlight bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg p-6">
            <h4 class="text-teal-300 font-semibold mb-3">Top-level await</h4>
            <p class="text-zinc-300 mb-3">Uso de await no nível superior dos módulos:</p>
            <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">// Agora é possível fazer isso diretamente em módulos
const data = await fetch('/api/data');
const result = await data.json();

export { result };</code></pre>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Novos operadores</h3>
          
          <div class="article-highlight bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-lg p-6">
            <h4 class="text-rose-300 font-semibold mb-3">Pipeline Operator (|>)</h4>
            <p class="text-zinc-300 mb-3">Melhora a legibilidade de operações encadeadas:</p>
            <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto"><code class="text-zinc-300">// Ao invés de:
const result = doSomething(transform(validate(input)));

// Agora podemos escrever:
const result = input
  |> validate
  |> transform
  |> doSomething;</code></pre>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Melhorias em Performance</h3>
          
          <div class="flex flex-col gap-4">
            <div>
              <h4 class="text-lg font-medium text-white mb-2">1. Shared Memory</h4>
              <p class="text-zinc-300 leading-relaxed mb-3">SharedArrayBuffer para comunicação entre workers:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="text-zinc-300">// Worker principal
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

// Worker secundário pode acessar os mesmos dados
worker.postMessage(sharedBuffer);</code></pre>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">2. Temporal API</h4>
              <p class="text-zinc-300 leading-relaxed mb-3">Nova API para trabalhar com datas e tempo:</p>
              <pre class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="text-zinc-300">// API mais intuitiva que Date
const now = Temporal.Now.plainDateTimeISO();
const birthday = Temporal.PlainDate.from('1990-05-15');
const age = now.toPlainDate().since(birthday).years;</code></pre>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Ferramentas e Ecossistema</h3>
          
          <div class="flex flex-col gap-4">
            <div>
              <h4 class="text-lg font-medium text-white mb-2">Vite 5.0</h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Build ainda mais rápido</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Melhor suporte para monorepos</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Tree-shaking aprimorado</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-lg font-medium text-white mb-2">Node.js 20+</h4>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">V8 atualizado</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Performance melhorada</span>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span class="text-zinc-300 leading-relaxed">Novos módulos built-in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Boas práticas modernas</h3>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Use métodos imutáveis</strong> quando possível</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Prefira const/let</strong> ao invés de var</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Utilize destructuring</strong> para código mais limpo</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Implemente error boundaries</strong> adequadamente</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-orange-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Otimize bundles</strong> com tree-shaking</span>
            </li>
          </ol>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Como se manter atualizado</h3>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Siga as propostas TC39</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Teste features em ambiente de desenvolvimento</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Participe de comunidades JavaScript</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Contribua para projetos open source</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Assista talks e conferências</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Conclusão</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O ES2024 traz melhorias significativas para a produtividade e qualidade do código JavaScript. Adotar essas novidades gradualmente pode tornar seu código mais moderno, limpo e eficiente.</p>
          
          <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg p-6 my-6">
            <h4 class="text-orange-300 font-semibold mb-3">⚡ JavaScript do Futuro, Hoje</h4>
            <p class="text-zinc-300">Na Escola Habilidade, ensinamos as mais recentes funcionalidades do JavaScript com aplicação prática. Mantenha-se na vanguarda do desenvolvimento web moderno.</p>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[3], // Programação
    featuredImage: '/assets/blog/javascript-es2024.jpg',
    featured_image_url: '/assets/blog/javascript-es2024.jpg',
    publishedAt: '2023-12-15T13:10:00.000Z',
    readingTime: 12,
    tags: ['javascript', 'es2024', 'programação', 'web'],
    views: 1823,
    likes: 134
  },
  {
    id: 7,
    title: 'Espaços Pequenos, Futuros Grandes: O Desafio Design Sprint 2025',
    slug: 'espacos-pequenos-futuros-grandes-design-sprint-2025',
    excerpt: 'Como 500 metros quadrados podem revolucionar nossa compreensão de arquitetura sustentável e focada na comunidade para 2050.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-4 mt-0">O futuro da arquitetura urbana está em espaços pequenos com grande impacto social</h2>
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">O SketchUp Design Sprint Challenge 2025 marcou um momento significativo na história do software, celebrando seu 25º aniversário com um desafio inovador: projetar 500 metros quadrados para 2050 que criem um impacto social positivo.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">O Desafio: 500 metros quadrados de impacto</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O espaço urbano limitado será um desafio determinante pelos próximos anos. Os participantes foram convidados a inovar dentro de apenas 500 metros quadrados, demonstrando como essa área compacta pode gerar um impacto profundo.</p>
          <p class="text-zinc-300 leading-relaxed mb-4">O grande desafio? Eles tiveram apenas 60 minutos para criar seus projetos, testando verdadeiramente sua criatividade e habilidades técnicas sob pressão.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">A comunidade criativa do SketchUp</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Em verdadeiro espírito SketchUp, o desafio convidou a comunidade criativa a envisionear o ano de 2050 e projetar espaços (interiores/exteriores ou paisagismo) que tenham impacto social positivo para atender às necessidades ambientais, comunitárias ou de acessibilidade do futuro.</p>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">O projeto vencedor: vivendo melhor, juntos</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Raphaël Craverio, estudante de arquitetura da LISAA Paris, conquistou o primeiro lugar com seu projeto criativo e focado na comunidade. Seu design aborda uma questão fundamental: e se nossas cidades futuras pudessem ajudar as pessoas a viverem melhor juntas?</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">Características inovadoras do projeto</h4>
            <p class="text-zinc-300 mb-3">Inspirado pelo modelo arquitetônico fornecido "Exterior", este design transforma a experiência urbana ao promover interação perfeita entre quem está dentro e fora do edifício:</p>
            <ul class="space-y-3">
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Térreo aberto:</strong> Cria calçadas mais amplas e acessíveis - característica crucial para acessibilidade universal e cidades cada vez mais densas de 2050</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Reposicionamento inteligente:</strong> As colunas arquitetônicas originais foram reposicionadas para melhorar o fluxo de pedestres</span>
              </li>
              <li class="flex items-start">
                <span class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Mobilidade sustentável:</strong> Ciclovias dedicadas refletem a crescente importância do ciclismo no transporte urbano</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Integração com a natureza</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">A natureza é central ao design, com elementos estratégicos que fazem a diferença:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Árvores estratégicas:</strong> Fornece sombra essencial no verão e permite a passagem da luz solar no inverno quando as folhas caem</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Bancos integrados:</strong> Aninhados sob as árvores, convidam moradores a pausar, descansar e se conectar com a natureza</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Jardim suspenso:</strong> Um jardim compartilhado no telhado capacita os moradores a cultivar sua própria comida</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Tecnologia adaptável</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O design incorpora soluções tecnológicas inovadoras:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Painéis de teto móveis:</strong> Os painéis de madeira distintos do edifício giram para otimizar a luz solar, adaptando-se às mudanças diárias e sazonais</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Marcações no solo:</strong> Códigos de cores sutis delimitam zonas para pedestres e ciclistas, garantindo harmonia com elementos naturais</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Lições para o design educacional</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Este projeto oferece insights valiosos para educadores e designers:</p>
          
          <div class="flex flex-col gap-4">
            <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">1. Pensamento sistêmico</h4>
              <p class="text-zinc-300 mb-3">O projeto demonstra como pequenos espaços podem gerar grandes impactos quando pensamos de forma integrada sobre:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Fluxos urbanos</li>
                <li class="text-zinc-300 leading-relaxed">• Sustentabilidade ambiental</li>
                <li class="text-zinc-300 leading-relaxed">• Interação social</li>
                <li class="text-zinc-300 leading-relaxed">• Acessibilidade universal</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">2. Design centrado no usuário</h4>
              <p class="text-zinc-300 mb-3">Cada elemento foi pensado considerando:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Necessidades dos moradores</li>
                <li class="text-zinc-300 leading-relaxed">• Fluxo de pedestres</li>
                <li class="text-zinc-300 leading-relaxed">• Ciclistas urbanos</li>
                <li class="text-zinc-300 leading-relaxed">• Pessoas com mobilidade reduzida</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-lg p-6">
              <h4 class="text-teal-300 font-semibold mb-3">3. Sustentabilidade integrada</h4>
              <p class="text-zinc-300 mb-3">O projeto mostra como sustentabilidade pode ser:</p>
              <ul class="space-y-2">
                <li class="text-zinc-300 leading-relaxed">• Esteticamente atraente</li>
                <li class="text-zinc-300 leading-relaxed">• Funcionalmente eficiente</li>
                <li class="text-zinc-300 leading-relaxed">• Socialmente inclusiva</li>
                <li class="text-zinc-300 leading-relaxed">• Economicamente viável</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Aplicações no ensino de design</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Projetos como este podem inspirar exercícios educacionais:</p>
          
          <ol class="space-y-3 mb-6 counter-reset: list-counter">
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Desafios de tempo limitado:</strong> Estimulam criatividade sob pressão</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Restrições claras:</strong> 500m² força soluções inovadoras</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Impacto social:</strong> Conecta design com responsabilidade social</span>
            </li>
            <li class="flex items-start counter-increment: list-counter">
              <span class="bg-pink-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Visão de futuro:</strong> Desenvolve pensamento prospectivo</span>
            </li>
          </ol>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Ferramentas digitais no design</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O SketchUp continua sendo uma ferramenta fundamental para:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Prototipagem rápida de ideias</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Visualização 3D intuitiva</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Comunicação eficaz de conceitos</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed">Iteração ágil de projetos</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">O futuro das cidades</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">Este projeto oferece uma visão esperançosa para cidades futuras:</p>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Mais verdes:</strong> Integração natural estratégica</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Mais pacíficas:</strong> Espaços de contemplação e descanso</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Mais conectadas:</strong> Facilitando interações humanas autênticas</span>
            </li>
            <li class="flex items-start">
              <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span class="text-zinc-300 leading-relaxed"><strong class="text-white">Mais inclusivas:</strong> Acessibilidade como prioridade de design</span>
            </li>
          </ul>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">Conclusão: pequenos espaços, grandes possibilidades</h3>
          <p class="text-zinc-300 leading-relaxed mb-4">O Design Sprint Challenge 2025 demonstra que limitações podem impulsionar inovação. Em apenas 500 metros quadrados e 60 minutos, Raphaël Craverio criou uma visão transformadora para o futuro urbano.</p>
          <p class="text-zinc-300 leading-relaxed mb-4">Este projeto inspira educadores, designers e urbanistas a repensarem como pequenos espaços podem gerar grandes mudanças sociais. Na Escola Habilidade, acreditamos que projetos como este são fundamentais para formar profissionais capazes de criar soluções inovadoras para os desafios urbanos do futuro.</p>
          <p class="text-zinc-300 leading-relaxed mb-4">Para designers e arquitetos em formação, este exemplo demonstra como criatividade, sustentabilidade e responsabilidade social podem convergir em soluções elegantes e impactantes. O futuro das nossas cidades depende dessa nova geração de pensadores sistêmicos.</p>
          
          <div class="article-highlight bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-lg p-6 my-6">
            <h4 class="text-pink-300 font-semibold mb-3">🏗️ Construindo o Futuro</h4>
            <p class="text-zinc-300">Na Escola Habilidade, preparamos designers e arquitetos para enfrentar os desafios urbanos do futuro. Aprenda design thinking, sustentabilidade e tecnologias emergentes em nossos cursos especializados.</p>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[4], // Design
    featuredImage: '/assets/blog/design-sprint-2025.svg',
    featured_image_url: '/assets/blog/design-sprint-2025.svg',
    publishedAt: '2025-01-30T09:00:00.000Z',
    readingTime: 8,
    tags: ['design', 'arquitetura', 'sustentabilidade', 'sketchup', 'urbanismo'],
    views: 0,
    likes: 0
  },
  {
    id: 101,
    title: 'Dominando o Shape Bender: Curvando Geometrias no SketchUp',
    slug: 'dominando-shape-bender-curvando-geometrias-sketchup',
    excerpt: 'Aprenda a usar a extensão Shape Bender para transformar geometrias retas em curvas complexas no SketchUp. Tutorial completo com dicas profissionais e exercícios práticos para arquitetos e designers.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Descubra como usar a poderosa extensão Shape Bender para transformar geometrias retas em curvas impressionantes no SketchUp. Este tutorial completo abrange desde a instalação até técnicas avançadas.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/shape-bender/shape-bender-hero.jpg" alt="Extensão Shape Bender no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">A extensão Shape Bender permite criar geometrias curvas complexas a partir de formas retas</p>
          </div>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">📋 Objetivos de Aprendizagem</h4>
            <ul class="space-y-2">
              <li class="text-zinc-300">• Instalar e configurar a extensão Shape Bender</li>
              <li class="text-zinc-300">• Compreender os conceitos de linha base e linha de curvatura</li>
              <li class="text-zinc-300">• Aplicar técnicas de curvatura em projetos arquitetônicos</li>
              <li class="text-zinc-300">• Dominar dicas profissionais para resultados otimizados</li>
              <li class="text-zinc-300">• Resolver problemas comuns durante o processo</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">O que é o Shape Bender?</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Desenhar uma linha reta no SketchUp é muito simples. Mas e se você precisar curvar essa linha, ou talvez uma forma mais complexa, em uma curva específica? É aí que entra o <strong class="text-white">Shape Bender</strong>, uma extensão do SketchUp que pode rapidamente transformar geometrias retas em curvas complexas.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Chris Fullmer, o criador do Shape Bender, originalmente construiu esta ferramenta para resolver um problema que encontrou enquanto projetava uma paisagem. Ele modelou uma parede de pedra curva para a entrada frontal de um edifício de escritórios e queria modelar o nome do cliente em sinalização seguindo a curvatura da formação rochosa, mas não conseguiu encontrar uma maneira simples de fazê-lo.</p>
          
          <div class="article-quote bg-zinc-800/50 border-l-4 border-cyan-500 p-6 my-6">
            <p class="text-zinc-300 italic mb-4">"Chris criou sua própria extensão para resolver o problema – isso é ser proativo! Com sua capacidade incomparável de transformar geometrias retas em curvas requintadas, esta extensão se tornou uma ferramenta inestimável para uma ampla gama de designers arquitetônicos."</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Como Funciona o Shape Bender</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O que o Shape Bender faz é bastante direto: ele pega qualquer objeto 3D em seu modelo e o estica ao longo de um caminho pré-desenhado que você seleciona. Veja os exemplos a seguir:</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/shape-bender/shape-bender-text-example.jpg" alt="Exemplo de texto curvado com Shape Bender" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">O texto azul reto é o modelo original e o texto amarelo curvado é o resultado da operação do Shape Bender</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="article-image">
              <img src="/images/blog/shape-bender/shape-bender-spiral-path.jpg" alt="Caminho de curvatura em espiral 3D" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">O caminho de curvatura (à esquerda) é uma espiral 3D</p>
            </div>
            <div class="article-image">
              <img src="/images/blog/shape-bender/shape-bender-curved-result.jpg" alt="Resultado da aplicação do Shape Bender" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Resultado final após a aplicação da curvatura</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Primeiros Passos com o Shape Bender</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Pronto para curvar a realidade com seus designs? Acesse o Extension Warehouse do SketchUp e <a href="https://extensions.sketchup.com/extension/8a4d10ff-40f3-4885-b8ba-1dac2b941885/clf-shape-bender" class="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener">baixe a extensão Shape Bender</a>.</p>
          
          <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6 my-6">
            <h4 class="text-orange-300 font-semibold mb-3">⚡ Pré-requisitos</h4>
            <ul class="space-y-2">
              <li class="text-zinc-300">• SketchUp instalado (versão Pro ou Make)</li>
              <li class="text-zinc-300">• Conexão com internet para download da extensão</li>
              <li class="text-zinc-300">• Conhecimento básico de ferramentas do SketchUp</li>
              <li class="text-zinc-300">• Objeto 3D convertido em grupo ou componente</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Guia Passo a Passo</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Para dominar esta ferramenta, você precisa lembrar de dois elementos essenciais: a <strong class="text-white">"linha base"</strong> e a <strong class="text-white">"linha de curvatura"</strong>. A "linha base" é sua linha reta, definindo o tamanho e posição original da sua forma. A "linha de curvatura" é a curva que você quer que sua forma adote.</p>
          
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Prepare o Objeto</h4>
                <p class="text-zinc-300">Certifique-se de que o objeto que você quer curvar seja um grupo ou um componente.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Alinhe ao Eixo Vermelho</h4>
                <p class="text-zinc-300">Rotacione o objeto (se necessário) para que fique alinhado longitudinalmente ao longo do eixo vermelho.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Desenhe a Linha Base</h4>
                <p class="text-zinc-300">Use a ferramenta Linha para desenhar uma aresta reta paralela ao comprimento da forma que você quer curvar, garantindo que esteja paralela ao eixo vermelho.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Crie o Caminho Curvo</h4>
                <p class="text-zinc-300">Desenhe uma aresta curva que representa o caminho de curvatura para sua nova forma.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Selecione o Objeto</h4>
                <p class="text-zinc-300">Selecione o grupo ou componente que você quer curvar.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">6</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Ative a Ferramenta</h4>
                <p class="text-zinc-300">Escolha Plugins > Chris Fullmer Tools > Shape Bender para ativar a ferramenta.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">7</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Selecione as Linhas</h4>
                <p class="text-zinc-300">Clique uma vez na aresta reta que você desenhou no Passo 3, depois clique uma vez na curva que você criou no Passo 4.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">8</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Visualize o Resultado</h4>
                <p class="text-zinc-300">Revise através da visualização verde para ver o que você está prestes a obter. Se a forma parecer invertida, pressione a seta Para Cima no teclado para reverter a direção.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 bg-cyan-500 text-black rounded-full flex items-center justify-center font-bold">9</div>
              <div>
                <h4 class="text-white font-semibold mb-2">Finalize a Transformação</h4>
                <p class="text-zinc-300">Quando a visualização estiver como você imagina, pressione Enter para finalizar a transformação.</p>
              </div>
            </div>
          </div>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">🎥 Recurso Adicional</h4>
            <p class="text-zinc-300">Siga o <a href="https://www.youtube.com/watch?v=tGHTIOMm_34" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener">vídeo instrucional de Chris</a> sobre como fazer uma rampa ou estrada curva para mais prática.</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Dicas Profissionais para Dominar o Shape Bender</h2>
          
          <h3 class="text-xl font-semibold text-white mb-4">1. A Localização é Importante</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Preste atenção à localização da aresta reta alinhada ao eixo vermelho que você desenha em relação ao objeto que planeja curvar. Ela atua como o ponto de origem para a operação. Se você quer que a linha central do seu objeto curvado siga o caminho de curvatura precisamente, desenhe a aresta reta bem através do centro do objeto original.</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/shape-bender/shape-bender-position-examples.jpg" alt="Exemplos de posicionamento da linha base" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Note as diferentes posições da linha vermelha em relação ao cone azul original nos três exemplos. Onde você posiciona a linha reta afeta o resultado da operação de curvatura</p>
          </div>
          
          <h3 class="text-xl font-semibold text-white mb-4">2. O Comprimento da Linha Reta Importa</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O comprimento afeta como o objeto que você está tentando curvar se estica ou encolhe quando você o curva. Se você quer que ele se estique, faça sua linha reta mais curta que a curva. Se você quer que ele encolha, inverta isso. Faça ambas as linhas com aproximadamente o mesmo comprimento para evitar esticamento ou encolhimento.</p>
          
          <h3 class="text-xl font-semibold text-white mb-4">3. Início e Fim Importam</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Desenhe seu caminho de curvatura para que seus pontos de início e fim estejam em lugares diferentes ao longo do eixo vermelho.</p>
          
          <h3 class="text-xl font-semibold text-white mb-4">4. Solde Seu Caminho de Curvatura</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A aresta que você designa como caminho de curvatura precisa ser contínua; ela não pode ser feita de mais de um segmento. Para colar múltiplos segmentos juntos, use o comando <strong class="text-white">Weld Edges</strong> no SketchUp.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">💡 Dica Avançada</h4>
            <p class="text-zinc-300">Para projetos complexos, experimente usar múltiplas operações de Shape Bender em sequência. Você pode curvar um objeto em uma direção, depois aplicar outra curvatura perpendicular para criar formas tridimensionais complexas.</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Exercícios Práticos</h2>
          
          <div class="space-y-6">
            <div class="bg-zinc-800/50 rounded-lg p-6">
              <h4 class="text-white font-semibold mb-3">Exercício 1: Texto Curvo Básico</h4>
              <p class="text-zinc-300 mb-4"><strong>Objetivo:</strong> Criar texto 3D que segue uma curva suave</p>
              <p class="text-zinc-300 mb-4"><strong>Passos:</strong></p>
              <ol class="list-decimal list-inside space-y-2 text-zinc-300 mb-4">
                <li>Crie um texto 3D usando a ferramenta Texto do SketchUp</li>
                <li>Converta o texto em grupo</li>
                <li>Desenhe uma linha reta paralela ao texto</li>
                <li>Crie uma curva suave usando a ferramenta Arco</li>
                <li>Aplique o Shape Bender</li>
              </ol>
              <p class="text-zinc-300"><strong>Tempo estimado:</strong> 15 minutos</p>
            </div>
            
            <div class="bg-zinc-800/50 rounded-lg p-6">
              <h4 class="text-white font-semibold mb-3">Exercício 2: Corrimão Curvo</h4>
              <p class="text-zinc-300 mb-4"><strong>Objetivo:</strong> Modelar um corrimão que segue uma escada curva</p>
              <p class="text-zinc-300 mb-4"><strong>Desafio:</strong> Criar um perfil de corrimão complexo e aplicá-lo a uma trajetória helicoidal</p>
              <p class="text-zinc-300"><strong>Tempo estimado:</strong> 30 minutos</p>
            </div>
            
            <div class="bg-zinc-800/50 rounded-lg p-6">
              <h4 class="text-white font-semibold mb-3">Exercício 3: Moldura Arquitetônica</h4>
              <p class="text-zinc-300 mb-4"><strong>Objetivo:</strong> Criar molduras decorativas que seguem arcos arquitectônicos</p>
              <p class="text-zinc-300 mb-4"><strong>Aplicação prática:</strong> Elementos decorativos para fachadas de edifícios</p>
              <p class="text-zinc-300"><strong>Tempo estimado:</strong> 45 minutos</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Resolução de Problemas Comuns</h2>
          
          <div class="space-y-6">
            <div class="border border-zinc-700 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">❌ Problema: Objeto fica distorcido</h4>
              <p class="text-zinc-300 mb-2"><strong>Solução:</strong></p>
              <ul class="list-disc list-inside space-y-1 text-zinc-300">
                <li>Verifique se o objeto está alinhado com o eixo vermelho</li>
                <li>Confirme se a linha base está paralela ao objeto</li>
                <li>Ajuste o comprimento da linha base em relação à curva</li>
              </ul>
            </div>
            
            <div class="border border-zinc-700 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">❌ Problema: Direção da curvatura está invertida</h4>
              <p class="text-zinc-300 mb-2"><strong>Solução:</strong></p>
              <ul class="list-disc list-inside space-y-1 text-zinc-300">
                <li>Use a seta Para Cima durante a visualização</li>
                <li>Ou redesenhe a curva na direção oposta</li>
              </ul>
            </div>
            
            <div class="border border-zinc-700 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">❌ Problema: Ferramenta não funciona</h4>
              <p class="text-zinc-300 mb-2"><strong>Solução:</strong></p>
              <ul class="list-disc list-inside space-y-1 text-zinc-300">
                <li>Certifique-se de que o objeto é um grupo ou componente</li>
                <li>Verifique se a curva é uma aresta contínua (use Weld se necessário)</li>
                <li>Reinicie o SketchUp se a extensão não responder</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Aplicações Profissionais</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O Shape Bender é especialmente útil para arquitetos e designers que trabalham com:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🏗️ Arquitetura</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Fachadas curvas com elementos repetitivos</li>
                <li>• Corrimãos e guarda-corpos</li>
                <li>• Molduras e ornamentos</li>
                <li>• Estruturas de cobertura curvas</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🎨 Design</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Sinalização e letreiros curvos</li>
                <li>• Mobiliário com formas orgânicas</li>
                <li>• Elementos decorativos</li>
                <li>• Paisagismo e jardins</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão: Criatividade Através da Curvatura</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Criado especificamente para o SketchUp, a extensão Shape Bender é sobre transformar e ajustar objetos geométricos ao longo de uma linha ou caminho curvo personalizado. É sua ferramenta de escultura digital, permitindo que você molde seus designs como argila.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Para estudantes de arquitetura e design da Escola Habilidade, dominar o Shape Bender abre possibilidades criativas infinitas. Esta ferramenta permite que você vá além das limitações das geometrias retas, criando formas orgânicas e elementos curvos que tornam seus projetos únicos e impressionantes.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">🎓 Próximos Passos</h4>
            <p class="text-zinc-300 mb-4">Continue sua jornada de aprendizado em modelagem 3D:</p>
            <ul class="space-y-2 text-zinc-300">
              <li>• Pratique com os exercícios propostos</li>
              <li>• Experimente com diferentes tipos de curvas</li>
              <li>• Combine Shape Bender com outras extensões</li>
              <li>• Documente seus projetos para construir um portfólio</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-4">Saia por aí e comece a curvar as regras. Você nunca sabe que maravilhas criativas pode descobrir quando domina as ferramentas certas para expressar sua visão arquitetônica.</p>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: { id: 6, name: 'Arquitetura', slug: 'arquitetura', color: '#06B6D4' },
    featuredImage: '/images/blog/shape-bender/shape-bender-hero.jpg',
    featured_image_url: '/images/blog/shape-bender/shape-bender-hero.jpg',
    publishedAt: '2025-01-31T10:00:00.000Z',
    readingTime: 12,
    tags: ['sketchup', 'arquitetura', 'design', 'modelagem-3d', 'shape-bender', 'tutorial', 'extensões'],
    views: 0,
    likes: 0
  },
  {
    id: 102,
    title: 'Gemini CLI: Seu Agente de IA Open Source no Terminal',
    slug: 'gemini-cli-agente-ia-open-source-terminal',
    excerpt: 'Descubra o Gemini CLI do Google: uma ferramenta gratuita e open source que traz o poder do Gemini 2.5 Pro diretamente para o seu terminal. Perfeito para desenvolvedores, com acesso ilimitado e capacidades avançadas.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Para desenvolvedores, a interface de linha de comando (CLI) não é apenas uma ferramenta; é casa. A eficiência, ubiquidade e portabilidade do terminal o tornam o utilitário preferido para realizar trabalho. E conforme a dependência dos desenvolvedores no terminal perdura, também cresce a demanda por assistência integrada de IA.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/gemini-cli/gemini-cli-hero.webp" alt="Gemini CLI - Agente de IA Open Source" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center">Gemini CLI: Traga o poder do Gemini 2.5 Pro diretamente para seu terminal</p>
          </div>
        </div>

        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6">É por isso que o Google está introduzindo o <strong>Gemini CLI</strong>, um agente de IA open source que traz o poder do Gemini diretamente para o seu terminal. Ele fornece acesso leve ao Gemini, oferecendo o caminho mais direto do seu prompt para o modelo. Embora excele na programação, o Gemini CLI foi construído para fazer muito mais.</p>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">🚀 Características Principais do Gemini CLI</h4>
            <ul class="space-y-2">
              <li><span class="text-blue-300 font-semibold">Gratuito e Open Source:</span> <span class="text-zinc-300">Apache 2.0, código inspecionável</span></li>
              <li><span class="text-blue-300 font-semibold">Acesso ao Gemini 2.5 Pro:</span> <span class="text-zinc-300">1 milhão de tokens de contexto</span></li>
              <li><span class="text-blue-300 font-semibold">Limites Generosos:</span> <span class="text-zinc-300">60 requisições/min, 1.000/dia - GRÁTIS</span></li>
              <li><span class="text-blue-300 font-semibold">Extensível:</span> <span class="text-zinc-300">Suporte MCP e extensões personalizadas</span></li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Por Que o Gemini CLI É Revolucionário?</h2>
          
          <div class="article-image mb-8">
            <img src="/images/blog/gemini-cli/gemini-cli-demo.gif" alt="Demonstração do Gemini CLI em ação" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center">Gemini CLI pode ser usado para uma ampla variedade de tarefas, incluindo criação de conteúdo e automação</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O Gemini CLI representa uma evolução fundamental na experiência de linha de comando, permitindo que você escreva código, depure problemas e otimize seu fluxo de trabalho usando linguagem natural. É um utilitário local versátil que você pode usar para uma ampla gama de tarefas:</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">💻 Desenvolvimento</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Geração e modificação de código</li>
                <li>• Depuração inteligente</li>
                <li>• Manipulação de arquivos</li>
                <li>• Execução de comandos</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">🔍 Pesquisa e Conteúdo</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Pesquisa com Google Search</li>
                <li>• Geração de conteúdo</li>
                <li>• Resolução de problemas</li>
                <li>• Gerenciamento de tarefas</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Limites de Uso Incomparáveis</h2>
          
          <div class="article-image mb-8">
            <img src="/images/blog/gemini-cli/gemini-cli-infographic.webp" alt="Infográfico dos limites do Gemini CLI" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center">Gemini CLI oferece os maiores limites de uso gratuito da indústria</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Para usar o Gemini CLI gratuitamente, basta fazer login com uma conta pessoal do Google para obter uma licença gratuita do Gemini Code Assist. Essa licença gratuita dá acesso ao Gemini 2.5 Pro e sua enorme janela de contexto de 1 milhão de tokens.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">💎 Limites de Uso Gratuito</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <p class="text-zinc-300"><span class="text-green-300 font-bold">60</span> requisições por minuto</p>
                <p class="text-zinc-300"><span class="text-green-300 font-bold">1.000</span> requisições por dia</p>
              </div>
              <div>
                <p class="text-zinc-300"><span class="text-green-300 font-bold">1M</span> tokens de contexto</p>
                <p class="text-zinc-300"><span class="text-green-300 font-bold">Gemini 2.5 Pro</span> - modelo mais avançado</p>
              </div>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Capacidades Avançadas</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O poder do Gemini CLI vem de ferramentas integradas que permitem:</p>
          
          <div class="space-y-4 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🌐 Fundamentação com Google Search</h4>
              <p class="text-zinc-300">Busque páginas web e forneça contexto externo em tempo real para o modelo, mantendo suas respostas atualizadas e precisas.</p>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">🔧 Extensibilidade</h4>
              <p class="text-zinc-300">Suporte integrado para Model Context Protocol (MCP) ou extensões empacotadas para expandir as capacidades do Gemini CLI.</p>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-pink-300 font-semibold mb-3">⚙️ Personalização</h4>
              <p class="text-zinc-300">Customize prompts e instruções para adaptar o Gemini às suas necessidades e fluxos de trabalho específicos.</p>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-violet-300 font-semibold mb-3">🤖 Automação</h4>
              <p class="text-zinc-300">Automatize tarefas e integre com fluxos de trabalho existentes invocando o Gemini CLI de forma não-interativa em seus scripts.</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Open Source e Extensível</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Como o Gemini CLI é totalmente <strong>open source (Apache 2.0)</strong>, desenvolvedores podem inspecionar o código para entender como funciona e verificar suas implicações de segurança. O Google espera (e acolhe!) uma comunidade global de desenvolvedores para contribuir com este projeto:</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 class="text-blue-300 font-semibold mb-3">🔍 Transparência</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Código totalmente inspecionável</li>
                <li>• Verificação de segurança</li>
                <li>• Licença Apache 2.0</li>
              </ul>
            </div>
            
            <div>
              <h4 class="text-green-300 font-semibold mb-3">🤝 Comunidade</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Reporte bugs no GitHub</li>
                <li>• Sugira funcionalidades</li>
                <li>• Contribua com melhorias</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Integração com Gemini Code Assist</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O Gemini CLI compartilha a mesma tecnologia com o <strong>Gemini Code Assist</strong>, o assistente de codificação de IA do Google para estudantes, hobbistas e desenvolvedores profissionais. No VS Code, você pode colocar qualquer prompt na janela de chat usando o modo agente, e o Code Assist trabalhará incansavelmente em seu nome.</p>
          
          <div class="article-highlight bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-lg p-6 my-6">
            <h4 class="text-indigo-300 font-semibold mb-3">🔗 Sincronização Perfeita</h4>
            <p class="text-zinc-300">Trabalhe no terminal com Gemini CLI e no VS Code com Gemini Code Assist - ambos usando a mesma tecnologia subjacente para uma experiência consistente.</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Como Começar com o Gemini CLI</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Começar é surpreendentemente simples. Tudo que você precisa é de um endereço de email para ter o Gemini praticamente ilimitado no seu terminal:</p>
          
          <div class="bg-zinc-900/50 rounded-lg p-6 mb-8">
            <h4 class="text-cyan-300 font-semibold mb-4">💻 Instalação Rápida</h4>
            <pre class="bg-zinc-800 rounded p-4 overflow-x-auto"><code class="text-green-400">
# Instalar via npm (requer Node.js)
npm install -g @google/gemini-cli

# Ou baixar diretamente do GitHub
git clone https://github.com/google-gemini/gemini-cli
cd gemini-cli
npm install
npm run build

# Fazer login com sua conta Google
gemini-cli auth login

# Começar a usar!
gemini-cli "Como posso otimizar este código Python?"
            </code></pre>
          </div>
          
          <div class="article-warning bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6 my-6">
            <h4 class="text-yellow-300 font-semibold mb-3">⚡ Dica de Produtividade</h4>
            <p class="text-zinc-300">Configure um alias para o Gemini CLI em seu .bashrc ou .zshrc para acesso ainda mais rápido:</p>
            <pre class="bg-zinc-800 rounded p-2 mt-2 text-green-400"><code>alias gemi="gemini-cli"</code></pre>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Casos de Uso Práticos para Desenvolvedores</h2>
          
          <div class="space-y-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">🐛 Depuração Inteligente</h4>
              <p class="text-zinc-300 mb-3">Analise logs de erro e obtenha sugestões de correção:</p>
              <pre class="bg-zinc-900 rounded p-3 text-green-400 text-sm"><code>gemini-cli "Analise este erro: $(cat error.log)"</code></pre>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">📝 Geração de Código</h4>
              <p class="text-zinc-300 mb-3">Crie funções, classes ou scripts completos:</p>
              <pre class="bg-zinc-900 rounded p-3 text-green-400 text-sm"><code>gemini-cli "Crie uma função Python para validar CPF"</code></pre>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">🔍 Análise de Código</h4>
              <p class="text-zinc-300 mb-3">Revise e melhore código existente:</p>
              <pre class="bg-zinc-900 rounded p-3 text-green-400 text-sm"><code>gemini-cli "Revise este código: $(cat script.py)"</code></pre>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">📚 Documentação</h4>
              <p class="text-zinc-300 mb-3">Gere documentação automaticamente:</p>
              <pre class="bg-zinc-900 rounded p-3 text-green-400 text-sm"><code>gemini-cli "Crie documentação README para este projeto"</code></pre>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">O Futuro da Programação com IA</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O Gemini CLI representa mais do que apenas uma ferramenta; é um vislumbre do futuro da programação onde a colaboração homem-IA acontece naturalmente no ambiente que os desenvolvedores já conhecem e amam - o terminal.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">🔮 Impacto Educacional</h4>
            <p class="text-zinc-300">Para estudantes e novos programadores, o Gemini CLI oferece:</p>
            <ul class="space-y-2 mt-3">
              <li><span class="text-purple-300">•</span> Aprendizado interativo com feedback instantâneo</li>
              <li><span class="text-purple-300">•</span> Explicações detalhadas de conceitos complexos</li>
              <li><span class="text-purple-300">•</span> Prática guiada com projetos reais</li>
              <li><span class="text-purple-300">•</span> Acesso gratuito a tecnologia de ponta</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O lançamento do Gemini CLI marca um momento significativo na evolução das ferramentas de desenvolvimento. Ao tornar a IA avançada acessível, gratuita e integrada ao ambiente natural do desenvolvedor, o Google está democratizando o acesso a capacidades que antes eram exclusivas de grandes corporações.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Com seus limites generosos, natureza open source e integração perfeita com fluxos de trabalho existentes, o Gemini CLI não é apenas uma ferramenta - é um companheiro de programação que pode transformar como aprendemos, criamos e inovamos com código.</p>
          
          <div class="article-cta bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center mt-8">
            <h3 class="text-2xl font-bold text-white mb-4">Pronto para Revolucionar seu Fluxo de Trabalho?</h3>
            <p class="text-blue-100 mb-6">Experimente o Gemini CLI hoje mesmo e descubra o futuro da programação assistida por IA.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://github.com/google-gemini/gemini-cli" target="_blank" rel="noopener noreferrer" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                🚀 Começar Agora
              </a>
              <a href="https://github.com/google-gemini/gemini-cli/blob/main/README.md" target="_blank" rel="noopener noreferrer" class="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                📖 Ver Documentação
              </a>
            </div>
          </div>
        </div>

      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: { id: 1, name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6' },
    featuredImage: '/images/blog/gemini-cli/gemini-cli-hero.webp',
    featured_image_url: '/images/blog/gemini-cli/gemini-cli-hero.webp',
    publishedAt: '2025-01-31T14:00:00.000Z',
    readingTime: 15,
    tags: ['gemini-cli', 'ia', 'google', 'open-source', 'terminal', 'desenvolvimento', 'automacao', 'cli'],
    views: 0,
    likes: 0
  },
  {
    id: 106,
    title: 'Novidades no Excel (Julho 2025): Recursos que Vão Revolucionar Sua Produtividade',
    slug: 'novidades-excel-julho-2025',
    excerpt: 'Descubra as últimas atualizações do Microsoft Excel para julho de 2025, incluindo Versões de Compatibilidade, Atualização Automática de Tabelas Dinâmicas, nova interface Get Data e melhorias multiplataforma.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Bem-vindos à atualização de julho de 2025! Este mês, o Microsoft Excel apresenta diversos recursos novos que aprimoram a produtividade dos usuários e a colaboração entre plataformas.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/excel-julho-2025/compatibility-version.jpg" alt="Sistema de Versões de Compatibilidade do Excel" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Sistema de Versões de Compatibilidade permite controle preciso sobre comportamentos de cálculo</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Principais Atualizações de Julho 2025</h2>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">🚀 Recursos Multiplataforma</h4>
            <ul class="space-y-2">
              <li><span class="text-blue-300 font-semibold">Excel para Windows, Mac e Web:</span> <span class="text-zinc-300">Versões de Compatibilidade</span></li>
              <li><span class="text-green-300 font-semibold">Windows e Mac:</span> <span class="text-zinc-300">Atualização Automática de Tabelas Dinâmicas</span></li>
              <li><span class="text-purple-300 font-semibold">Windows:</span> <span class="text-zinc-300">Nova interface Get Data e catálogo OneLake</span></li>
              <li><span class="text-cyan-300 font-semibold">Mac:</span> <span class="text-zinc-300">Visualização lado a lado</span></li>
              <li><span class="text-yellow-300 font-semibold">Web:</span> <span class="text-zinc-300">Power Query para fontes autenticadas</span></li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Versões de Compatibilidade: Controle Total</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">As Versões de Compatibilidade são configuradas por pasta de trabalho individual. A <strong>Versão 1</strong> reflete o comportamento histórico de cálculo, enquanto a <strong>Versão 2</strong> contém melhorias nas funções de texto.</p>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">💡 Benefícios Práticos</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Estabilidade:</strong> Projetos existentes mantêm comportamento consistente</li>
              <li>• <strong>Flexibilidade:</strong> Novos projetos podem aproveitar melhorias</li>
              <li>• <strong>Controle:</strong> Usuários decidem quando migrar versões</li>
              <li>• <strong>Compatibilidade:</strong> Trabalho colaborativo sem conflitos</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Atualização Automática de Tabelas Dinâmicas</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/excel-julho-2025/pivottable-auto-refresh.jpg" alt="Atualização Automática de Tabelas Dinâmicas" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Com a Atualização Automática, suas Tabelas Dinâmicas se mantêm sempre atualizadas em tempo real</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Com a Atualização Automática, você não precisa mais atualizar manualmente suas Tabelas Dinâmicas. Qualquer atualização no intervalo de origem é instantaneamente refletida na Tabela Dinâmica.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">⚡ Cenários de Uso Práticos</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h5 class="text-white font-semibold mb-2">Para Estudantes:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Análise de dados em tempo real</li>
                  <li>• Acompanhamento de projetos</li>
                  <li>• Dashboards acadêmicos</li>
                </ul>
              </div>
              <div>
                <h5 class="text-white font-semibold mb-2">Para Profissionais:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Relatórios executivos automáticos</li>
                  <li>• Monitoramento de KPIs</li>
                  <li>• Análises colaborativas dinâmicas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Nova Interface Get Data</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/excel-julho-2025/get-data-dialog.jpg" alt="Nova Interface Get Data" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">A nova interface Get Data oferece busca inteligente e recomendações personalizadas</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A nova interface Get Data para Power Query integra busca e recomendações em um layout simplificado, oferecendo também acesso direto aos dados do OneLake do Fabric.</p>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">🎯 Benefícios para Analistas</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h5 class="text-blue-300 font-semibold mb-2">Busca Inteligente:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Localização rápida de fontes</li>
                  <li>• Sugestões contextuais</li>
                  <li>• Interface intuitiva</li>
                </ul>
              </div>
              <div>
                <h5 class="text-green-300 font-semibold mb-2">Integração OneLake:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Dados organizacionais</li>
                  <li>• Qualidade garantida</li>
                  <li>• Colaboração aprimorada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Visualização Lado a Lado no Mac</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/excel-julho-2025/side-by-side-view.jpg" alt="Visualização Lado a Lado no Mac" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Compare planilhas lado a lado com rolagem sincronizada, igual ao Excel Windows</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Agora você pode comparar rapidamente planilhas na mesma pasta de trabalho ou em pastas diferentes, visualizando-as lado a lado com rolagem síncrona.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">📊 Casos de Uso Educacionais</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h5 class="text-white font-semibold mb-2">Para Estudantes:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Comparação de versões</li>
                  <li>• Análise histórica vs. atual</li>
                  <li>• Verificação de fórmulas</li>
                </ul>
              </div>
              <div>
                <h5 class="text-white font-semibold mb-2">Para Professores:</h5>
                <ul class="space-y-1 text-zinc-300 text-sm">
                  <li>• Correção comparativa</li>
                  <li>• Demonstração de diferenças</li>
                  <li>• Análise de progresso</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Power Query na Web</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/excel-julho-2025/power-query-web.jpg" alt="Power Query na Web" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Atualize consultas Power Query com fontes autenticadas diretamente na web</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Agora você pode atualizar consultas Power Query que obtêm dados de fontes autenticadas, com múltiplos métodos de autenticação disponíveis.</p>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">🔐 Métodos de Autenticação</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Anônimo:</strong> Para fontes públicas</li>
              <li>• <strong>Usuário e senha:</strong> Credenciais específicas</li>
              <li>• <strong>Conta organizacional:</strong> Integração com Azure AD</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Exercícios Práticos</h2>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🔧 Exercício 1: Versões de Compatibilidade</h4>
              <p class="text-zinc-300 text-sm mb-3"><strong>Objetivo:</strong> Compreender e configurar versões</p>
              <p class="text-zinc-300 text-sm mb-3"><strong>Tempo:</strong> 20 minutos</p>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• Verificar versão atual</li>
                <li>• Testar funções em ambas versões</li>
                <li>• Comparar resultados</li>
                <li>• Definir versão apropriada</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">📊 Exercício 2: Tabela Dinâmica Auto Refresh</h4>
              <p class="text-zinc-300 text-sm mb-3"><strong>Objetivo:</strong> Implementar atualização automática</p>
              <p class="text-zinc-300 text-sm mb-3"><strong>Tempo:</strong> 25 minutos</p>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• Preparar dados de vendas</li>
                <li>• Configurar Tabela Dinâmica</li>
                <li>• Ativar atualização automática</li>
                <li>• Validar funcionamento</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Impacto na Análise de Dados</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">As atualizações de julho 2025 representam um salto significativo na capacidade analítica, oferecendo automação inteligente, colaboração aprimorada e fluxos de trabalho mais eficientes.</p>
          
          <div class="article-highlight bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/20 rounded-lg p-6 my-6">
            <h4 class="text-yellow-300 font-semibold mb-3">🎓 Para Estudantes da Escola Habilidade</h4>
            <p class="text-zinc-300 mb-3">Essas funcionalidades preparam vocês para o mercado de trabalho atual:</p>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Vantagem Competitiva:</strong> Diferenciação no mercado</li>
              <li>• <strong>Eficiência Profissional:</strong> Automação de tarefas</li>
              <li>• <strong>Colaboração Moderna:</strong> Ferramentas atuais</li>
              <li>• <strong>Base Sólida:</strong> Fundação para ferramentas avançadas</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">As atualizações de julho 2025 consolidam o Excel como ferramenta essencial para análise de dados moderna. Com automação inteligente, compatibilidade aprimorada e recursos multiplataforma, profissionais e estudantes têm agora acesso a capacidades que anteriormente exigiam ferramentas especializadas.</p>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">🚀 Próximos Passos Recomendados</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• Pratique regularmente com os exercícios propostos</li>
              <li>• Explore todas as funcionalidades apresentadas</li>
              <li>• Documente seu aprendizado e descobertas</li>
              <li>• Compartilhe conhecimento com colegas</li>
              <li>• Mantenha-se atualizado com mudanças mensais</li>
            </ul>
          </div>
        </div>

      </div>
    `,
    author: {
      id: 1,
      name: 'Escola Habilidade',
      bio: 'Especialistas em educação tecnológica',
      avatar: '/images/avatars/escola-logo.png',
      social: {
        linkedin: 'https://linkedin.com/company/escola-habilidade',
        instagram: 'https://instagram.com/escolahabilidade'
      }
    },
    category: {
      id: 1,
      name: 'Tecnologia',
      slug: 'tecnologia',
      color: '#3B82F6'
    },
    publishedAt: '2025-07-31T10:00:00.000Z',
    updatedAt: '2025-07-31T10:00:00.000Z',
    readingTime: 10,
    featured: true,
    featured_image_url: '/images/blog/excel-julho-2025/compatibility-version.jpg',
    seo: {
      title: 'Novidades no Excel (Julho 2025): Recursos que Vão Revolucionar Sua Produtividade | Escola Habilidade',
      description: 'Descubra as últimas atualizações do Microsoft Excel para julho de 2025, incluindo Versões de Compatibilidade, Atualização Automática de Tabelas Dinâmicas, nova interface Get Data e melhorias multiplataforma.',
      keywords: ['excel', 'microsoft', 'produtividade', 'power-query', 'pivottable', 'automação', 'análise-dados', 'versões-compatibilidade', 'onelake'],
      canonical_url: '/blog/novidades-excel-julho-2025',
      og_image: '/images/blog/excel-julho-2025/compatibility-version.jpg'
    },
    tags: ['excel', 'microsoft', 'produtividade', 'power-query', 'pivottable', 'automação', 'análise-dados', 'versões-compatibilidade'],
    views: 0,
    likes: 0
  }
];

export { mockCategories, mockPosts };
export default { categories: mockCategories, posts: mockPosts };