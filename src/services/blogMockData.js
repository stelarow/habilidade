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
<h2>A programação é uma das habilidades mais valiosas no mercado atual</h2>

<p>Neste guia, você aprenderá os primeiros passos para se tornar um programador, desde escolher sua primeira linguagem até conseguir seu primeiro emprego na área.</p>

<h3>1. Escolhendo sua primeira linguagem de programação</h3>

<p>Para iniciantes, recomendamos começar com uma das seguintes linguagens:</p>

<ul>
<li><strong>Python</strong> - Sintaxe simples e versatilidade para web, dados e automação</li>
<li><strong>JavaScript</strong> - Essencial para desenvolvimento web e cada vez mais usado em outras áreas</li>
<li><strong>Java</strong> - Linguagem robusta, muito usada em empresas e com boa demanda no mercado</li>
</ul>

<h3>2. Recursos gratuitos para aprender</h3>

<p>Existem muitos recursos gratuitos disponíveis:</p>

<ul>
<li>freeCodeCamp - Cursos completos e gratuitos</li>
<li>Codecademy - Plataforma interativa de aprendizado</li>
<li>MDN Web Docs - Documentação completa para desenvolvimento web</li>
<li>YouTube - Canais como Curso em Vídeo, DevMedia</li>
</ul>

<h3>3. Prática é fundamental</h3>

<p>A melhor forma de aprender programação é praticando. Comece com projetos simples:</p>

<ol>
<li>Calculadora básica</li>
<li>Lista de tarefas (To-Do List)</li>
<li>Jogo da velha</li>
<li>Sistema de cadastro simples</li>
</ol>

<h3>4. Construindo um portfólio</h3>

<p>Um portfólio sólido é essencial para conseguir oportunidades. Crie uma conta no GitHub e publique seus projetos. Inclua:</p>

<ul>
<li>Código bem documentado</li>
<li>README explicativo</li>
<li>Projetos que demonstrem diferentes habilidades</li>
<li>Contribuições para projetos open source</li>
</ul>

<h3>5. Networking e comunidade</h3>

<p>Participar de comunidades é crucial para o crescimento profissional:</p>

<ul>
<li>Grupos no Discord e Slack</li>
<li>Meetups locais</li>
<li>Conferences e eventos online</li>
<li>LinkedIn para conexões profissionais</li>
</ul>

<h3>6. Preparando-se para o mercado de trabalho</h3>

<p>Quando se sentir confortável com os conceitos básicos:</p>

<ol>
<li>Estude estruturas de dados e algoritmos</li>
<li>Aprenda sobre versionamento com Git</li>
<li>Entenda conceitos de banco de dados</li>
<li>Pratique entrevistas técnicas</li>
<li>Considere fazer estágios ou trabalhos freelance</li>
</ol>

<h3>Conclusão</h3>

<p>A jornada na programação requer dedicação e prática constante, mas as oportunidades são enormes. Comece hoje mesmo e seja consistente nos estudos. Lembre-se: todo programador experiente já foi um iniciante.</p>

<p>Na Escola Habilidade, oferecemos cursos práticos que aceleram seu aprendizado. Conheça nossos programas e dê o próximo passo na sua carreira em tecnologia.</p>
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
  }
];

export { mockCategories, mockPosts };
export default { categories: mockCategories, posts: mockPosts };