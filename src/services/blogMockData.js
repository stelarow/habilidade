// Temporary mock data for blog functionality
// This will be replaced with actual API calls once endpoints are implemented

const mockCategories = [
  {
    id: 1,
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Artigos sobre tecnologia e inovação',
    postCount: 5,
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
    postCount: 12,
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
    postCount: 1,
    color: '#06B6D4'
  }
];

const mockPosts = [
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
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">🎯 Próximos Passos com a Escola Habilidade</h4>
            <p class="text-zinc-300">Na Escola Habilidade, oferecemos cursos práticos que aceleram seu aprendizado. Conheça nossos programas e dê o próximo passo na sua carreira em tecnologia.</p>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[3], // Programação
    featuredImage: '/assets/blog/programacao-2024.jpg',
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
    publishedAt: '2025-01-30T09:00:00.000Z',
    readingTime: 8,
    tags: ['design', 'arquitetura', 'sustentabilidade', 'sketchup', 'urbanismo'],
    views: 0,
    likes: 0
  }
];

export { mockCategories, mockPosts };
export default { categories: mockCategories, posts: mockPosts };