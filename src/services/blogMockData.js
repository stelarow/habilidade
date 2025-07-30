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
  }
];

const mockPosts = [
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
<h2>O Design Thinking revoluciona a forma como aprendemos e ensinamos tecnologia</h2>

<p>Esta metodologia cria experiências mais envolventes e eficazes, colocando o aluno no centro do processo educacional.</p>

<h3>O que é Design Thinking?</h3>

<p>Design Thinking é uma abordagem centrada no ser humano para inovação que integra as necessidades das pessoas, as possibilidades da tecnologia e os requisitos para o sucesso.</p>

<h3>Os 5 estágios do Design Thinking na educação</h3>

<h4>1. Empatizar</h4>
<p>Compreender profundamente as necessidades, dificuldades e motivações dos estudantes.</p>

<h4>2. Definir</h4> 
<p>Sintetizar as observações em uma declaração clara do problema a ser resolvido.</p>

<h4>3. Idealizar</h4>
<p>Gerar uma ampla gama de ideias criativas e soluções potenciais.</p>

<h4>4. Prototipar</h4>
<p>Criar versões experimentais de soluções para testar hipóteses.</p>

<h4>5. Testar</h4>
<p>Avaliar os protótipos com usuários reais e refinar com base no feedback.</p>

<h3>Aplicações práticas na educação tecnológica</h3>

<ul>
<li>Desenvolvimento de currículos mais envolventes</li>
<li>Criação de interfaces de aprendizado intuitivas</li>
<li>Métodos de avaliação mais humanizados</li>
<li>Ambientes de aprendizado colaborativo</li>
</ul>

<h3>Benefícios observados</h3>

<p>Instituições que implementaram Design Thinking relatam:</p>

<ul>
<li>Maior engajamento dos estudantes</li>
<li>Redução nas taxas de evasão</li>
<li>Melhoria na retenção de conhecimento</li>
<li>Desenvolvimento de soft skills</li>
</ul>
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
<h2>As tecnologias que estão moldando o futuro digital</h2>

<p>Inteligência Artificial, Machine Learning, blockchain e outras tecnologias estão revolucionando a forma como vivemos e trabalhamos.</p>

<h3>1. Inteligência Artificial Generativa</h3>

<p>2024 marca o ano da democratização da IA. Ferramentas como ChatGPT, Claude e Gemini estão transformando:</p>

<ul>
<li>Produção de conteúdo</li>
<li>Desenvolvimento de software</li>
<li>Atendimento ao cliente</li>
<li>Análise de dados</li>
</ul>

<h3>2. Computação Edge</h3>

<p>O processamento mais próximo do usuário final oferece:</p>

<ul>
<li>Menor latência</li>
<li>Maior privacidade dos dados</li>
<li>Redução no consumo de banda</li>
<li>Melhor performance em IoT</li>
</ul>

<h3>3. Desenvolvimento Low-Code/No-Code</h3>

<p>Plataformas que permitem criar aplicações sem programação tradicional:</p>

<ul>
<li>Democratização do desenvolvimento</li>
<li>Agilidade na prototipagem</li>
<li>Redução de custos</li>
<li>Foco na lógica de negócio</li>
</ul>

<h3>4. Blockchain e Web3</h3>

<p>Além de criptomoedas, blockchain oferece:</p>

<ul>
<li>Contratos inteligentes</li>
<li>Supply chain transparente</li>
<li>Identidade digital descentralizada</li>
<li>NFTs e ativos digitais</li>
</ul>

<h3>5. Computação Quântica</h3>

<p>Embora ainda emergente, promete revolucionar:</p>

<ul>
<li>Criptografia</li>
<li>Simulações complexas</li>
<li>Inteligência artificial</li>
<li>Pesquisa farmacêutica</li>
</ul>

<h3>Impacto no mercado de trabalho</h3>

<p>Essas tendências criam oportunidades em:</p>

<ul>
<li>Especialistas em IA e Machine Learning</li>
<li>Desenvolvedores de aplicações edge</li>
<li>Arquitetos de soluções blockchain</li>
<li>Cientistas de dados quânticos</li>
</ul>

<h3>Como se preparar</h3>

<p>Para profissionais de tecnologia:</p>

<ol>
<li>Mantenha-se atualizado com cursos online</li>
<li>Pratique com projetos pessoais</li>
<li>Participe de comunidades técnicas</li>
<li>Desenvolva soft skills</li>
<li>Considere certificações relevantes</li>
</ol>
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
<h2>O mercado de tecnologia oferece inúmeras oportunidades</h2>

<p>Saiba como se posicionar e crescer profissionalmente em uma das áreas mais dinâmicas do mercado atual.</p>

<h3>1. Definindo seu caminho</h3>

<p>A área de tecnologia oferece diversos caminhos:</p>

<h4>Desenvolvimento</h4>
<ul>
<li>Frontend (React, Vue, Angular)</li>
<li>Backend (Node, Python, Java)</li>
<li>Mobile (React Native, Flutter)</li>
<li>Full Stack</li>
</ul>

<h4>Dados</h4>
<ul>
<li>Data Science</li>
<li>Data Engineering</li>
<li>Business Intelligence</li>
<li>Machine Learning Engineer</li>
</ul>

<h4>Infraestrutura</h4>
<ul>
<li>DevOps</li>
<li>Cloud Engineer</li>
<li>Site Reliability Engineer</li>
<li>Cybersecurity</li>
</ul>

<h3>2. Desenvolvendo habilidades técnicas</h3>

<p>Competências fundamentais independente da área:</p>

<ul>
<li>Versionamento com Git</li>
<li>Metodologias ágeis</li>
<li>Testes automatizados</li>
<li>Arquitetura de software</li>
<li>Bancos de dados</li>
</ul>

<h3>3. Soft skills essenciais</h3>

<p>Habilidades comportamentais são diferenciais:</p>

<ul>
<li>Comunicação clara e objetiva</li>
<li>Trabalho em equipe</li>
<li>Resolução de problemas</li>
<li>Aprendizado contínuo</li>
<li>Gestão de tempo</li>
</ul>

<h3>4. Construindo um portfólio impressionante</h3>

<p>Seu portfólio deve demonstrar:</p>

<ul>
<li>Projetos completos e funcionais</li>
<li>Código limpo e documentado</li>
<li>Diferentes tecnologias</li>
<li>Evolução ao longo do tempo</li>
<li>Contribuições open source</li>
</ul>

<h3>5. Networking estratégico</h3>

<p>Construa relacionamentos profissionais através de:</p>

<ul>
<li>LinkedIn ativo e otimizado</li>
<li>Participação em eventos tech</li>
<li>Contribuições para comunidades</li>
<li>Mentoria (dar e receber)</li>
<li>Palestras e workshops</li>
</ul>

<h3>6. Planejamento de carreira</h3>

<p>Estabeleça metas claras:</p>

<ol>
<li>Defina onde quer estar em 1, 3 e 5 anos</li>
<li>Identifique gaps de conhecimento</li>
<li>Crie um plano de estudos estruturado</li>
<li>Busque feedback regular</li>
<li>Ajuste o plano conforme necessário</li>
</ol>

<h3>7. Negociação salarial</h3>

<p>Dicas para negociar melhor:</p>

<ul>
<li>Pesquise salários de mercado</li>
<li>Documente suas conquistas</li>
<li>Prepare argumentos baseados em valor</li>
<li>Considere benefícios além do salário</li>
<li>Pratique a negociação</li>
</ul>

<h3>Conclusão</h3>

<p>Uma carreira sólida em tech requer planejamento, dedicação e adaptabilidade. O mercado está em constante evolução, mas as oportunidades são abundantes para quem se prepara adequadamente.</p>
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
<h2>UX/UI Design vai muito além de fazer interfaces bonitas</h2>

<p>Conheça os princípios que criam experiências memoráveis e funcionais para os usuários.</p>

<h3>Diferença entre UX e UI</h3>

<h4>UX Design (User Experience)</h4>
<p>Foca na experiência completa do usuário:</p>
<ul>
<li>Pesquisa de usuário</li>
<li>Arquitetura da informação</li>
<li>Wireframes e protótipos</li>
<li>Testes de usabilidade</li>
</ul>

<h4>UI Design (User Interface)</h4>
<p>Concentra-se nos elementos visuais:</p>
<ul>
<li>Layout e composição</li>
<li>Tipografia</li>
<li>Cores e contrastes</li>
<li>Iconografia</li>
</ul>

<h3>Princípios fundamentais de UX</h3>

<h4>1. Usabilidade</h4>
<p>A interface deve ser:</p>
<ul>
<li>Fácil de aprender</li>
<li>Eficiente de usar</li>
<li>Fácil de lembrar</li>
<li>Livre de erros</li>
<li>Satisfatória de usar</li>
</ul>

<h4>2. Acessibilidade</h4>
<p>Design inclusivo para todos os usuários:</p>
<ul>
<li>Contraste adequado de cores</li>
<li>Navegação por teclado</li>
<li>Textos alternativos para imagens</li>
<li>Tamanhos de fonte legíveis</li>
</ul>

<h4>3. Consistência</h4>
<p>Manter padrões ao longo da experiência:</p>
<ul>
<li>Visual consistency (cores, tipografia)</li>
<li>Functional consistency (comportamentos)</li>
<li>External consistency (padrões do mercado)</li>
</ul>

<h3>Princípios fundamentais de UI</h3>

<h4>1. Hierarquia Visual</h4>
<p>Guiar o olhar do usuário:</p>
<ul>
<li>Tamanho e peso da tipografia</li>
<li>Cores e contrastes</li>
<li>Espaçamento e proximidade</li>
<li>Posicionamento estratégico</li>
</ul>

<h4>2. Lei de Fitts</h4>
<p>Elementos mais usados devem ser:</p>
<ul>
<li>Maiores</li>
<li>Mais próximos</li>
<li>Fáceis de acertar</li>
</ul>

<h4>3. Regra dos 8px</h4>
<p>Sistema de grid baseado em múltiplos de 8:</p>
<ul>
<li>Consistência visual</li>
<li>Alinhamento perfeito</li>
<li>Escalabilidade</li>
</ul>

<h3>Processo de Design</h3>

<ol>
<li><strong>Research</strong> - Entender usuários e contexto</li>
<li><strong>Define</strong> - Definir problemas e objetivos</li>
<li><strong>Ideate</strong> - Gerar soluções criativas</li>
<li><strong>Prototype</strong> - Criar versões testáveis</li>
<li><strong>Test</strong> - Validar com usuários reais</li>
</ol>

<h3>Ferramentas essenciais</h3>

<h4>Design</h4>
<ul>
<li>Figma</li>
<li>Adobe XD</li>
<li>Sketch</li>
</ul>

<h4>Prototipagem</h4>
<ul>
<li>InVision</li>
<li>Principle</li>
<li>Framer</li>
</ul>

<h4>Pesquisa</h4>
<ul>
<li>Hotjar</li>
<li>Google Analytics</li>
<li>Maze</li>
</ul>

<h3>Tendências atuais</h3>

<ul>
<li>Dark mode</li>
<li>Microinterações</li>
<li>Design system</li>
<li>Voice interfaces</li>
<li>AR/VR experiences</li>
</ul>

<h3>Como começar na área</h3>

<ol>
<li>Estude os fundamentos de design</li>
<li>Pratique com projetos pessoais</li>
<li>Construa um portfólio diversificado</li>
<li>Busque feedback da comunidade</li>
<li>Mantenha-se atualizado com tendências</li>
</ol>
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
<h2>O JavaScript continua evoluindo</h2>

<p>Descubra as novidades do ES2024 e como elas podem melhorar seu código e produtividade.</p>

<h3>Principais novidades do ES2024</h3>

<h4>1. Array.prototype.with()</h4>
<p>Método imutável para modificar arrays:</p>

<pre><code>const arr = [1, 2, 3, 4, 5];
const newArr = arr.with(2, 'three');
console.log(newArr); // [1, 2, 'three', 4, 5]
console.log(arr); // [1, 2, 3, 4, 5] (original inalterado)</code></pre>

<h4>2. toSorted(), toReversed(), toSpliced()</h4>
<p>Versões imutáveis dos métodos clássicos:</p>

<pre><code>const numbers = [3, 1, 4, 1, 5];

// Versões mutáveis (antigas)
numbers.sort(); // modifica o array original

// Versões imutáveis (novas)
const sorted = numbers.toSorted(); // retorna novo array
const reversed = numbers.toReversed(); // retorna novo array</code></pre>

<h4>3. Array.prototype.findLast() e findLastIndex()</h4>
<p>Busca elementos a partir do final do array:</p>

<pre><code>const users = [
  { id: 1, active: true },
  { id: 2, active: false },
  { id: 3, active: true }
];

const lastActive = users.findLast(user => user.active);
console.log(lastActive); // { id: 3, active: true }</code></pre>

<h4>4. Object.groupBy()</h4>
<p>Agrupa elementos de array por critério:</p>

<pre><code>const products = [
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

<h3>Melhorias em Pattern Matching</h3>

<h4>Switch Expressions</h4>
<p>Sintaxe mais concisa para switch:</p>

<pre><code>const getDayType = (day) => switch (day) {
  case 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' => 'Weekday'
  case 'Saturday', 'Sunday' => 'Weekend'
  default => 'Invalid day'
};</code></pre>

<h3>Async/Await Enhancements</h3>

<h4>Top-level await</h4>
<p>Uso de await no nível superior dos módulos:</p>

<pre><code>// Agora é possível fazer isso diretamente em módulos
const data = await fetch('/api/data');
const result = await data.json();

export { result };</code></pre>

<h3>Novos operadores</h3>

<h4>Pipeline Operator (|>)</h4>
<p>Melhora a legibilidade de operações encadeadas:</p>

<pre><code>// Ao invés de:
const result = doSomething(transform(validate(input)));

// Agora podemos escrever:
const result = input
  |> validate
  |> transform
  |> doSomething;</code></pre>

<h3>Melhorias em Performance</h3>

<h4>1. Shared Memory</h4>
<p>SharedArrayBuffer para comunicação entre workers:</p>

<pre><code>// Worker principal
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);

// Worker secundário pode acessar os mesmos dados
worker.postMessage(sharedBuffer);</code></pre>

<h4>2. Temporal API</h4>
<p>Nova API para trabalhar com datas e tempo:</p>

<pre><code>// API mais intuitiva que Date
const now = Temporal.Now.plainDateTimeISO();
const birthday = Temporal.PlainDate.from('1990-05-15');
const age = now.toPlainDate().since(birthday).years;</code></pre>

<h3>Ferramentas e Ecossistema</h3>

<h4>Vite 5.0</h4>
<ul>
<li>Build ainda mais rápido</li>
<li>Melhor suporte para monorepos</li>
<li>Tree-shaking aprimorado</li>
</ul>

<h4>Node.js 20+</h4>
<ul>
<li>V8 atualizado</li>
<li>Performance melhorada</li>
<li>Novos módulos built-in</li>
</ul>

<h3>Boas práticas modernas</h3>

<ol>
<li><strong>Use métodos imutáveis</strong> quando possível</li>
<li><strong>Prefira const/let</strong> ao invés de var</li>
<li><strong>Utilize destructuring</strong> para código mais limpo</li>
<li><strong>Implemente error boundaries</strong> adequadamente</li>
<li><strong>Otimize bundles</strong> com tree-shaking</li>
</ol>

<h3>Como se manter atualizado</h3>

<ul>
<li>Siga as propostas TC39</li>
<li>Teste features em ambiente de desenvolvimento</li>
<li>Participe de comunidades JavaScript</li>
<li>Contribua para projetos open source</li>
<li>Assista talks e conferências</li>
</ul>

<h3>Conclusão</h3>

<p>O ES2024 traz melhorias significativas para a produtividade e qualidade do código JavaScript. Adotar essas novidades gradualmente pode tornar seu código mais moderno, limpo e eficiente.</p>
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
<h2>O futuro da arquitetura urbana está em espaços pequenos com grande impacto social</h2>

<p>O SketchUp Design Sprint Challenge 2025 marcou um momento significativo na história do software, celebrando seu 25º aniversário com um desafio inovador: projetar 500 metros quadrados para 2050 que criem um impacto social positivo.</p>

<h3>O Desafio: 500 metros quadrados de impacto</h3>

<p>O espaço urbano limitado será um desafio determinante pelos próximos anos. Os participantes foram convidados a inovar dentro de apenas 500 metros quadrados, demonstrando como essa área compacta pode gerar um impacto profundo.</p>

<p>O grande desafio? Eles tiveram apenas 60 minutos para criar seus projetos, testando verdadeiramente sua criatividade e habilidades técnicas sob pressão.</p>

<h3>A comunidade criativa do SketchUp</h3>

<p>Em verdadeiro espírito SketchUp, o desafio convidou a comunidade criativa a envisionear o ano de 2050 e projetar espaços (interiores/exteriores ou paisagismo) que tenham impacto social positivo para atender às necessidades ambientais, comunitárias ou de acessibilidade do futuro.</p>

<h3>O projeto vencedor: vivendo melhor, juntos</h3>

<p>Raphaël Craverio, estudante de arquitetura da LISAA Paris, conquistou o primeiro lugar com seu projeto criativo e focado na comunidade. Seu design aborda uma questão fundamental: e se nossas cidades futuras pudessem ajudar as pessoas a viverem melhor juntas?</p>

<h4>Características inovadoras do projeto</h4>

<p>Inspirado pelo modelo arquitetônico fornecido "Exterior", este design transforma a experiência urbana ao promover interação perfeita entre quem está dentro e fora do edifício:</p>

<ul>
<li><strong>Térreo aberto:</strong> Cria calçadas mais amplas e acessíveis - característica crucial para acessibilidade universal e cidades cada vez mais densas de 2050</li>
<li><strong>Reposicionamento inteligente:</strong> As colunas arquitetônicas originais foram reposicionadas para melhorar o fluxo de pedestres</li>
<li><strong>Mobilidade sustentável:</strong> Ciclovias dedicadas refletem a crescente importância do ciclismo no transporte urbano</li>
</ul>

<h3>Integração com a natureza</h3>

<p>A natureza é central ao design, com elementos estratégicos que fazem a diferença:</p>

<ul>
<li><strong>Árvores estratégicas:</strong> Fornece sombra essencial no verão e permite a passagem da luz solar no inverno quando as folhas caem</li>
<li><strong>Bancos integrados:</strong> Aninhados sob as árvores, convidam moradores a pausar, descansar e se conectar com a natureza</li>
<li><strong>Jardim suspenso:</strong> Um jardim compartilhado no telhado capacita os moradores a cultivar sua própria comida</li>
</ul>

<h3>Tecnologia adaptável</h3>

<p>O design incorpora soluções tecnológicas inovadoras:</p>

<ul>
<li><strong>Painéis de teto móveis:</strong> Os painéis de madeira distintos do edifício giram para otimizar a luz solar, adaptando-se às mudanças diárias e sazonais</li>
<li><strong>Marcações no solo:</strong> Códigos de cores sutis delimitam zonas para pedestres e ciclistas, garantindo harmonia com elementos naturais</li>
</ul>

<h3>Lições para o design educacional</h3>

<p>Este projeto oferece insights valiosos para educadores e designers:</p>

<h4>1. Pensamento sistêmico</h4>
<p>O projeto demonstra como pequenos espaços podem gerar grandes impactos quando pensamos de forma integrada sobre:</p>
<ul>
<li>Fluxos urbanos</li>
<li>Sustentabilidade ambiental</li>
<li>Interação social</li>
<li>Acessibilidade universal</li>
</ul>

<h4>2. Design centrado no usuário</h4>
<p>Cada elemento foi pensado considerando:</p>
<ul>
<li>Necessidades dos moradores</li>
<li>Fluxo de pedestres</li>
<li>Ciclistas urbanos</li>
<li>Pessoas com mobilidade reduzida</li>
</ul>

<h4>3. Sustentabilidade integrada</h4>
<p>O projeto mostra como sustentabilidade pode ser:</p>
<ul>
<li>Esteticamente atraente</li>
<li>Funcionalmente eficiente</li>
<li>Socialmente inclusiva</li>
<li>Economicamente viável</li>
</ul>

<h3>Aplicações no ensino de design</h3>

<p>Projetos como este podem inspirar exercícios educacionais:</p>

<ol>
<li><strong>Desafios de tempo limitado:</strong> Estimulam criatividade sob pressão</li>
<li><strong>Restrições claras:</strong> 500m² força soluções inovadoras</li>
<li><strong>Impacto social:</strong> Conecta design com responsabilidade social</li>
<li><strong>Visão de futuro:</strong> Desenvolve pensamento prospectivo</li>
</ol>

<h3>Ferramentas digitais no design</h3>

<p>O SketchUp continua sendo uma ferramenta fundamental para:</p>

<ul>
<li>Prototipagem rápida de ideias</li>
<li>Visualização 3D intuitiva</li>
<li>Comunicação eficaz de conceitos</li>
<li>Iteração ágil de projetos</li>
</ul>

<h3>O futuro das cidades</h3>

<p>Este projeto oferece uma visão esperançosa para cidades futuras:</p>

<ul>
<li><strong>Mais verdes:</strong> Integração natural estratégica</li>
<li><strong>Mais pacíficas:</strong> Espaços de contemplação e descanso</li>
<li><strong>Mais conectadas:</strong> Facilitando interações humanas autênticas</li>
<li><strong>Mais inclusivas:</strong> Acessibilidade como prioridade de design</li>
</ul>

<h3>Conclusão: pequenos espaços, grandes possibilidades</h3>

<p>O Design Sprint Challenge 2025 demonstra que limitações podem impulsionar inovação. Em apenas 500 metros quadrados e 60 minutos, Raphaël Craverio criou uma visão transformadora para o futuro urbano.</p>

<p>Este projeto inspira educadores, designers e urbanistas a repensarem como pequenos espaços podem gerar grandes mudanças sociais. Na Escola Habilidade, acreditamos que projetos como este são fundamentais para formar profissionais capazes de criar soluções inovadoras para os desafios urbanos do futuro.</p>

<p>Para designers e arquitetos em formação, este exemplo demonstra como criatividade, sustentabilidade e responsabilidade social podem convergir em soluções elegantes e impactantes. O futuro das nossas cidades depende dessa nova geração de pensadores sistêmicos.</p>
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