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
    postCount: 5,
    color: '#EF4444'
  },
  {
    id: 6,
    name: 'Arquitetura',
    slug: 'arquitetura',
    description: 'Design arquitetônico e projetos de construção',
    postCount: 5,
    color: '#06B6D4'
  }
];

const mockPosts = [
  {
    id: 108,
    title: '10 Extensões SketchUp Essenciais que Todo Arquiteto Deve Conhecer',
    slug: '10-extensoes-sketchup-arquitetos',
    excerpt: 'Descubra as 10 extensões mais poderosas do SketchUp que revolucionarão seu workflow arquitetônico. De renderização profissional com Enscape até modelagem avançada com ferramentas especializadas.',
    content: `
      <div class="article-content space-y-8">

        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">O SketchUp é uma das ferramentas de design mais acessíveis e flexíveis disponíveis no mercado. Suas capacidades avançadas em <strong>modelagem 3D</strong> oferecem uma plataforma sólida para ideias de construção, paisagismo e design de interiores. A arquitetura, o design e a construção utilizam amplamente este programa de modelagem 3D devido à sua facilidade de uso e versatilidade.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/sketchup-hero-extensions.webp" alt="10 extensões SketchUp essenciais para arquitetos" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Interface do SketchUp com extensões profissionais instaladas</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">No entanto, para profissionais que lidam com grandes projetos arquitetônicos, as ferramentas básicas do SketchUp podem se tornar insuficientes para lidar com a complexidade de estruturas elaboradas. É aqui que as <strong>extensões do SketchUp</strong> entram em cena. Estas são funcionalidades adicionais que modificam a funcionalidade padrão do software, tornando-o mais dinâmico, flexível e adequado às suas necessidades específicas.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">O Que São Extensões do SketchUp?</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Add-ons ou plugins são ferramentas extras projetadas para funcionar dentro da interface do SketchUp. Eles adicionam funcionalidades completamente novas ou automatizam processos, ajudando designers a economizar muito tempo. Seja renderizando estruturas complexas ou detalhando acabamentos finos, as extensões do SketchUp têm tudo o que você precisa.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">💡 Por Que Usar Extensões?</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Produtividade:</strong> Automatizam tarefas repetitivas e complexas</li>
              <li><strong>Precisão:</strong> Oferecem ferramentas especializadas para detalhamento</li>
              <li><strong>Qualidade:</strong> Melhoram significativamente o resultado final</li>
              <li><strong>Eficiência:</strong> Reduzem o tempo gasto em tarefas manuais</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">De fato, elas se tornaram uma parte tão integral da arquitetura contemporânea que trazem ao designer uma melhoria substancial no fluxo de trabalho e na qualidade do design. Uma grande variedade dessas extensões ajuda a reduzir esforços desnecessários e melhorar a eficiência do projeto.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">1. Enscape - Renderização em Tempo Real</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/enscape-sketchup-render.webp" alt="Renderização profissional com Enscape no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Exemplo de renderização arquitetônica criada com Enscape</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>Enscape</strong> é considerado uma das melhores e mais utilizadas extensões de renderização no SketchUp. Esta extensão é extremamente útil para apresentações, pois ajuda a produzir renders foto-realísticos impressionantes. O Enscape permite aos usuários renderizar modelos com iluminação, sombreamento e texturas adequadas.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">✨ Principais Recursos</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Renderização em tempo real</li>
                <li>• Realidade virtual integrada</li>
                <li>• Materiais e iluminação avançados</li>
                <li>• Interface intuitiva</li>
                <li>• Compatibilidade com SketchUp</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">🎯 Ideal Para</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Apresentações para clientes</li>
                <li>• Visualização de projetos</li>
                <li>• Marketing imobiliário</li>
                <li>• Aprovação de projetos</li>
                <li>• Walkthroughs virtuais</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">É mais adequado para destacar projetos de alta qualidade, mesmo antes do início da construção. Esta extensão pode ser encontrada no Extension Warehouse do SketchUp ou no site da Enscape. Uma vez instalado, o Enscape aprimora o fluxo de trabalho existente, oferecendo mais opções de renderização com configurações avançadas de luz, materiais e ambiente.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">2. 1001Bit Tools - Elementos Arquitetônicos</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/1001bit-tools-sketchup.webp" alt="Interface do 1001Bit Tools no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Ferramentas especializadas para elementos arquitetônicos</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Sendo uma extensão arquitetônica, o <strong>1001bit Tools</strong> ajuda o usuário a detalhar seus designs e também criar projetos com muitas repetições, como escadas, janelas e vigas. Possui vários recursos que ajudam a acelerar o processo de criação desses elementos arquitetônicos.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">🏗️ Elementos Que Você Pode Criar</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Escadas complexas</li>
                <li>• Sistemas de janelas</li>
                <li>• Estruturas de telhado</li>
                <li>• Elementos de fachada</li>
              </ul>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Vigas estruturais</li>
                <li>• Corrimãos e guarda-corpos</li>
                <li>• Elementos decorativos</li>
                <li>• Componentes modulares</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Esta extensão se torna vital para arquitetos que trabalham em soluções de design complicadas. Pode ser encontrada no SketchUp Extension Warehouse. A extensão é muito boa para arquitetos que estão com pressa, pois detalhes podem ser facilmente obtidos e anexados com precisão em questão de segundos.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">3. Profile Builder 3 - Modelagem Paramétrica</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/profile-builder-3-sketchup.webp" alt="Profile Builder 3 em ação no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Criação de perfis complexos com Profile Builder 3</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>Profile Builder 3</strong> é uma extensão avançada que permite aos usuários personalizar montagens paramétricas e perfis inteligentes, o que é importante para detalhamento arquitetônico e outros componentes estruturais. O aplicativo pode extrudar formas ao longo de uma curva para criar vigas estruturais, corrimãos e outros recursos arquitetônicos.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">⚙️ Funcionalidades</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Perfis paramétricos</li>
                <li>• Extrusão ao longo de caminhos</li>
                <li>• Componentes inteligentes</li>
                <li>• Modificação dinâmica</li>
                <li>• Biblioteca de perfis</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">🔧 Aplicações</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Estruturas metálicas</li>
                <li>• Molduras e acabamentos</li>
                <li>• Sistemas de vedação</li>
                <li>• Elementos curvos</li>
                <li>• Detalhamento técnico</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Você pode baixar o Profile Builder 3 no SketchUp Extension Warehouse, e ele ajudará os usuários a criar elementos repetitivos no design de maneira mais rápida. A beleza desta ferramenta está em seu recurso paramétrico que permite modificações rápidas, aprimorando o fluxo de trabalho e mantendo a uniformidade no design.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">4. Curic Section - Cortes Avançados</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/curic-section-sketchup.webp" alt="Curic Section criando cortes no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Criação de cortes técnicos precisos com Curic Section</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>Curic Section</strong> é uma ferramenta sofisticada de corte de seção especificamente construída para o SketchUp. Esta extensão permite ao usuário fazer cortes de seção abrangentes que podem ser personalizados e atualizados imediatamente de acordo com as necessidades do arquiteto.</p>
          
          <div class="article-highlight bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6 my-6">
            <h4 class="text-orange-300 font-semibold mb-3">📐 Recursos de Corte Avançados</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Cortes dinâmicos:</strong> Atualizações automáticas quando o modelo muda</li>
              <li><strong>Múltiplos planos:</strong> Vários cortes simultâneos</li>
              <li><strong>Customização visual:</strong> Controle total sobre a aparência</li>
              <li><strong>Exportação técnica:</strong> Ideal para pranchas de projeto</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Pode ser encontrado no Extension Warehouse e permite aos usuários trabalhar nos modelos de maneira que facilite a navegação dentro de seus modelos sem dificuldade. É especialmente benéfico durante a geração de desenhos de construção ou ao tentar transmitir o layout espacial para um cliente.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">5. Artisan - Modelagem Orgânica</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/artisan-sketchup-organic.webp" alt="Modelagem orgânica com Artisan no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Criação de formas orgânicas e terrenos com Artisan</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A extensão <strong>Artisan</strong> foca principalmente na modelagem orgânica, com a possibilidade de criar terrenos, suavizar superfícies e formar geometrias complexas. É uma prática vitalícia para arquitetos paisagistas, designers de interiores e qualquer projeto em que curvas suaves são necessárias.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">🌿 Modelagem Orgânica</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Escultura de terrenos</li>
                <li>• Suavização de superfícies</li>
                <li>• Formas fluidas</li>
                <li>• Topografia complexa</li>
                <li>• Elementos naturais</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">🎨 Ferramentas de Escultura</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Pincel de modelagem</li>
                <li>• Ferramenta de suavização</li>
                <li>• Escultura por vértices</li>
                <li>• Subdivisão de malha</li>
                <li>• Controle de densidade</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Lançado no SketchUp Extension Warehouse, o Artisan revoluciona o processo de lidar com geometrias complexas para arquitetos, fornecendo várias ferramentas de escultura para construção mais fácil de formas livres. Esta extensão é muito vantajosa para modelagem de terrenos ou para projetar interiores complicados.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">6. S4U Slice - Cortes Precisos</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/s4u-slice-sketchup.webp" alt="S4U Slice cortando geometrias no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Ferramenta S4U Slice para cortes precisos em geometrias</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>S4U Slice</strong> é uma extensão prática pela qual arquitetos podem facilmente definir, gerenciar e manipular objetos de corte ao trabalhar no SketchUp. Com este componente adicional instalado, os usuários têm a chance de cortar através da geometria com muita precisão; portanto, é adequado para cortes limpos ao lidar com muitas formas geométricas combinadas e não relacionadas.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">✂️ Capacidades de Corte</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Cortes múltiplos:</strong> Vários objetos simultaneamente</li>
              <li><strong>Precisão extrema:</strong> Controle total sobre os cortes</li>
              <li><strong>Preservação de dados:</strong> Mantém propriedades dos objetos</li>
              <li><strong>Interface intuitiva:</strong> Fácil de usar e aprender</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Esta extensão está disponível no SketchUp Extension Warehouse. O S4U Slice promove produtividade entre arquitetos, permitindo-lhes cortar modelos detalhados em seções, facilitando assim modificações ou apresentações.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">7. JointPushPull - Push/Pull Avançado</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/jointpushpull-sketchup.webp" alt="JointPushPull em ação no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Extensão JointPushPull para superfícies complexas</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>JointPushPull</strong> é uma versão aprimorada da ferramenta ideal de Push/Pull no SketchUp, que também permite a aplicação de push e pull em superfícies curvas. Esta é realmente uma melhoria forte para arquitetos que lidam com estruturas menos geométricas ou não-retilíneas.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">🔄 Funcionalidades Avançadas</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Push/Pull em superfícies curvas</li>
                <li>• Múltiplas faces simultâneas</li>
                <li>• Operações em lote</li>
                <li>• Preservação de curvatura</li>
                <li>• Controle de espessura</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">🏗️ Aplicações Práticas</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Estruturas curvilíneas</li>
                <li>• Elementos de fachada</li>
                <li>• Formas arquitetônicas complexas</li>
                <li>• Detalhamento de superfícies</li>
                <li>• Modelagem paramétrica</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Disponível no SketchUcation Warehouse, o JointPushPull melhora a ferramenta Push/Pull padrão, fornecendo uma opção que permite aos usuários push/pull mais de uma superfície ao mesmo tempo, particularmente as curvas. Esta extensão aprimora o fluxo de trabalho em projetos que envolvem formas curvas e são complexos no design.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">8. CleanUp³ - Otimização de Modelos</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/cleanup-sketchup.webp" alt="Interface do CleanUp³ no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Otimização e limpeza de modelos com CleanUp³</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>CleanUp³</strong> é um programa fácil de usar, mas poderoso, que otimiza e limpa modelos do SketchUp. Esta extensão permite aos usuários realizar uma limpeza do modelo, remover superfícies sobrepostas e combinar faces que estão no mesmo plano, resultando em um modelo muito mais eficiente.</p>
          
          <div class="article-highlight bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-6 my-6">
            <h4 class="text-emerald-300 font-semibold mb-3">🧹 Otimizações Automáticas</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Remove duplicatas:</strong> Elimina geometrias redundantes</li>      
              <li><strong>Combina faces:</strong> Unifica superfícies coplanares</li>
              <li><strong>Limpa componentes:</strong> Remove definições não utilizadas</li>
              <li><strong>Otimiza performance:</strong> Melhora velocidade de renderização</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O CleanUp³ pode ser baixado do Extension Warehouse, sendo benéfico para arquitetos que projetam estruturas complexas porque reduz as chances de travamentos e ajuda a organizar o trabalho. Ao garantir modelos limpos e organizados, previne travamentos e lentidão, promovendo um fluxo de trabalho mais suave.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">9. FredoScale - Transformações Avançadas</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/fredoscale-sketchup.webp" alt="FredoScale transformando objetos no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Transformações complexas com FredoScale</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>FredoScale</strong> é uma extensão multifuncional que melhora os recursos de escala integrados do SketchUp. Alguns dos recursos incluem inclinar, esticar, dobrar e torcer objetos. Esta ferramenta particular é útil para arquitetos envolvidos em designs mais artísticos onde escala não padrão é necessária para projetos de vanguarda.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">🎯 Transformações</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Escala não uniforme</li>
                <li>• Torção e dobramento</li>
                <li>• Inclinação controlada</li>
                <li>• Estiramento direcional</li>
                <li>• Transformações complexas</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">✨ Casos de Uso</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Arquitetura paramétrica</li>
                <li>• Formas não convencionais</li>
                <li>• Elementos curvos</li>
                <li>• Design experimental</li>
                <li>• Geometrias complexas</li>
              </ul>
            </div>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Esta extensão está disponível no SketchUcation Warehouse. Com o FredoScale, no entanto, a criação de formas distintivas e formas não mais apresenta um desafio, pois permite recursos de manipulação avançada dos objetos. Melhora a efetividade do fluxo de trabalho cortando as horas gastas em modificações.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">10. Skimp - Importação Otimizada</h2>
          
          <div class="article-image mb-6">
            <img src="/images/blog/10-extensoes-sketchup-arquitetos/skimp-sketchup.webp" alt="Skimp importando modelos complexos no SketchUp" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Importação inteligente de modelos com alta densidade</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O <strong>Skimp</strong> é uma extensão usada para importar modelos de alta densidade e reduzir a geometria sem comprometer a qualidade. É de grande utilidade ao trabalhar com modelos complexos ou modelos que são muito pesados para o SketchUp gerenciar, mesmo se importados.</p>
          
          <div class="article-highlight bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 my-6">
            <h4 class="text-indigo-300 font-semibold mb-3">📥 Otimização Inteligente</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Redução automática:</strong> Diminui polígonos mantendo qualidade</li>
              <li><strong>Preservação de detalhes:</strong> Mantém características importantes</li>
              <li><strong>Performance melhorada:</strong> Modelos mais leves e rápidos</li>
              <li><strong>Controle de qualidade:</strong> Ajustes personalizáveis</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Disponível no SketchUp Extension Warehouse, o Skimp permite que designers importem modelos 3D detalhados sem inchar o tamanho do arquivo do modelo 3D. Esta ferramenta ajuda a diminuir o tempo de atraso associado a modelos de alta densidade para que os designers possam se concentrar em seu trabalho sem qualquer interrupção do sistema.</p>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Como Instalar e Configurar as Extensões</h2>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">📋 Passo a Passo da Instalação</h4>
            <ol class="space-y-3 text-zinc-300">
              <li><strong>1. Extension Warehouse:</strong> Acesse Window > Extension Warehouse no SketchUp</li>
              <li><strong>2. Busca e seleção:</strong> Procure pela extensão desejada</li>
              <li><strong>3. Instalação:</strong> Clique em "Install" e aguarde o download</li>
              <li><strong>4. Ativação:</strong> Reinicie o SketchUp para ativar a extensão</li>
              <li><strong>5. Configuração:</strong> Acesse Extensions > [Nome da Extensão] para configurar</li>
            </ol>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">✅ Dicas de Configuração</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Configure shortcuts personalizados</li>
                <li>• Organize as ferramentas na toolbar</li>
                <li>• Ajuste configurações de performance</li>
                <li>• Faça backup das configurações</li>
                <li>• Teste em modelos pequenos primeiro</li>
              </ul>
            </div>
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">⚠️ Cuidados Importantes</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• Verifique compatibilidade da versão</li>
                <li>• Mantenha extensions atualizadas</li>
                <li>• Monitore impacto na performance</li>
                <li>• Desinstale extensões não utilizadas</li>
                <li>• Faça backup antes de atualizações</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Workflow Otimizado com Extensões</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A combinação inteligente dessas extensões pode transformar completamente seu processo de trabalho arquitetônico. Aqui está uma sugestão de workflow otimizado:</p>
          
          <div class="bg-gradient-to-r from-gray-800/50 to-zinc-800/50 rounded-lg p-6 mb-8">
            <h4 class="text-white font-semibold mb-4">🔄 Workflow Recomendado</h4>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <span class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h5 class="text-blue-300 font-semibold">Modelagem Base</h5>
                  <p class="text-zinc-300 text-sm">Use 1001Bit Tools e Profile Builder 3 para criar elementos estruturais</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h5 class="text-green-300 font-semibold">Detalhamento</h5>
                  <p class="text-zinc-300 text-sm">Utilize Artisan para elementos orgânicos e JointPushPull para formas complexas</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h5 class="text-yellow-300 font-semibold">Refinamento</h5>
                  <p class="text-zinc-300 text-sm">Use S4U Slice e FredoScale para ajustes e transformações precisas</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <h5 class="text-purple-300 font-semibold">Otimização</h5>
                  <p class="text-zinc-300 text-sm">Execute CleanUp³ para otimizar performance e Skimp para modelos importados</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <span class="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <h5 class="text-red-300 font-semibold">Apresentação</h5>
                  <p class="text-zinc-300 text-sm">Finalize com Curic Section para cortes técnicos e Enscape para renderização</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão: Potencialize Seu SketchUp</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Estas 10 extensões representam o que há de melhor em termos de produtividade e qualidade para arquitetos que utilizam o SketchUp. Cada uma delas aborda necessidades específicas do processo de design arquitetônico, desde a modelagem inicial até a apresentação final dos projetos.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">🚀 Principais Benefícios</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Produtividade aumentada:</strong> Automatização de tarefas repetitivas</li>
              <li><strong>Qualidade superior:</strong> Ferramentas especializadas para cada necessidade</li>
              <li><strong>Workflow otimizado:</strong> Processos mais eficientes e integrados</li>
              <li><strong>Resultados profissionais:</strong> Apresentações de nível comercial</li>
            </ul>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">O investimento no aprendizado dessas ferramentas se traduz diretamente em projetos mais impressionantes, prazos cumpridos e clientes satisfeitos. No mundo competitivo da arquitetura, ter o conjunto certo de ferramentas pode fazer toda a diferença entre um projeto comum e um projeto extraordinário.</p>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Lembre-se de que a maestria dessas extensões vem com a prática. Comece instalando uma ou duas extensões por vez, explore suas funcionalidades em projetos menores e gradualmente incorpore-as ao seu workflow principal. Com o tempo, você descobrirá combinações poderosas que transformarão completamente sua maneira de trabalhar com o SketchUp.</p>
        </div>

        <div class="article-section mt-12">
          <div class="bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-2xl border border-cyan-500/20 overflow-hidden">
            <div class="p-8">
              <div class="flex items-start space-x-6">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Domine o SketchUp do Básico ao Profissional
                  </h3>
                  <p className="text-zinc-300 mb-6 leading-relaxed">
                    Quer ir além das extensões e se tornar um verdadeiro especialista em projetos 3D? Nosso curso de <strong>Projetista 3D</strong> ensina desde os fundamentos do SketchUp até técnicas avançadas de modelagem e renderização com Enscape.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-zinc-300 text-sm">SketchUp completo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-zinc-300 text-sm">Renderização Enscape</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-zinc-300 text-sm">Projetos práticos</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="https://wa.me/5511999999999?text=Olá! Vi o artigo sobre extensões SketchUp e gostaria de saber mais sobre o curso de Projetista 3D."
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      Falar com Especialista
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center justify-center px-6 py-3 border border-cyan-500/50 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-200"
                    >
                      Ver Grade Curricular
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: { id: 6, name: 'Arquitetura', slug: 'arquitetura', color: '#06B6D4' },
    featuredImage: '/images/blog/10-extensoes-sketchup-arquitetos/sketchup-hero-extensions.webp',
    featured_image_url: '/images/blog/10-extensoes-sketchup-arquitetos/sketchup-hero-extensions.webp',
    publishedAt: '2025-01-01T10:00:00.000Z',
    readingTime: 10,
    tags: ['SketchUp', 'Extensões', 'Arquitetura', 'Modelagem 3D', 'Enscape', 'Workflow', 'Produtividade'],
    views: 0,
    likes: 0
  },
  {
    id: 102,
    title: '10 Dicas de Especialistas para Fazer Suas Renderizações Enscape Se Destacarem',
    slug: '10-dicas-especialistas-renderizacoes-enscape-destaque',
    excerpt: 'Descubra as 10 dicas mais valiosas de especialistas em visualização arquitetônica para transformar suas renderizações Enscape de básicas em extraordinárias. Técnicas profissionais de sombras, materiais, composição e iluminação.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">No mundo competitivo da visualização arquitetônica, a diferença entre uma renderização amadora e profissional pode determinar o sucesso de um projeto. O Enscape revolucionou o setor ao oferecer renderização em tempo real sem a complexidade de softwares tradicionais, mas para maximizar seu potencial, você precisa ir além do básico.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/enscape-dicas-especialista-renderizacao/enscape-hero-render-exterior.jpg" alt="10 dicas de especialistas para renderizações Enscape" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Renderização exterior profissional: resultado de técnicas avançadas bem aplicadas</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">1. Sombras e Reflexões: A Base da Profundidade Visual</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Sombras e reflexões trabalham em conjunto para criar profundidade e realismo convincentes. Não são apenas efeitos visuais—são elementos narrativos que guiam o olhar e criam atmosfera.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">🌟 Estratégias Avançadas de Sombreamento</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Árvores e vegetação:</strong> Coloque estrategicamente para criar sombras interessantes no primeiro plano</li>
              <li><strong>Elementos arquitetônicos:</strong> Use paredes, pergolados e marquises como molduras naturais</li>
              <li><strong>Intensidade solar:</strong> Ajuste entre 3.0-4.0 para exteriores</li>
              <li><strong>Ângulo do sol:</strong> 45°-135° para sombras dinâmicas e interessantes</li>
            </ul>
          </div>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-dicas-especialista-renderizacao/interior-kitchen-living.jpg" alt="Cozinha e sala integradas modernas" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Uso estratégico de luz natural e sombras interiores</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">2. Otimização de Modelo: Performance Encontra Qualidade</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">A otimização eficiente permite renderizações rápidas sem sacrificar qualidade visual. A chave está em saber onde investir polígonos e onde economizar.</p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-green-300 font-semibold mb-3">⚡ Fase de Composição</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Use proxy objects para vegetação complexa</li>
                <li>• Aplique materiais simples temporários</li>
                <li>• Mantenha texturas em 1K-2K durante testes</li>
                <li>• Desative layers desnecessários</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-purple-300 font-semibold mb-3">🎯 Renderização Final</h4>
              <ul class="space-y-2 text-zinc-300">
                <li>• Substitua proxies por assets detalhados</li>
                <li>• Upgrade texturas para 2K-4K onde necessário</li>
                <li>• Mantenha objetos de fundo em baixa resolução</li>
                <li>• Execute limpeza geral do modelo</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">3. Composição Fotográfica: Guiando o Olhar do Cliente</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Grandes renderizações seguem os mesmos princípios da fotografia profissional. Composição não é acidente—é planejamento estratégico para contar uma história visual.</p>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-dicas-especialista-renderizacao/modern-living-room.jpg" alt="Sala de estar moderna" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Composição usando regra dos terços e enquadramento natural</p>
          </div>
          
          <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6 my-6">
            <h4 class="text-blue-300 font-semibold mb-3">📸 Princípios Compositivos Essenciais</h4>
            <ul class="space-y-2 text-zinc-300">
              <li><strong>Regra dos Terços:</strong> Posicione elementos importantes nas intersecções da grade 3x3</li>
              <li><strong>Linhas Condutoras:</strong> Use estradas, bordas arquitetônicas e elementos paisagísticos</li>
              <li><strong>Enquadramento Natural:</strong> Vegetação e estruturas como molduras orgânicas</li>
              <li><strong>Storytelling Visual:</strong> Cada renderização deve contar uma história</li>
            </ul>
          </div>
        </div>

        <div class="article-section">
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-dicas-especialista-renderizacao/modern-chair-detail.jpg" alt="Detalhe de mobiliário moderno" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Detalhamento preciso em elementos de destaque</p>
          </div>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Este artigo apresenta apenas as primeiras 3 das 10 técnicas essenciais. Outras dicas incluem configuração de materiais PBR, uso estratégico da biblioteca de assets, ajustes de câmera, iluminação interior, skyboxes HDRI, animações cinematográficas e recursos de IA.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">🎓 Domine Todas as Técnicas Profissionais</h4>
            <p class="text-zinc-300 mb-4">Quer aprender todas as 10 técnicas avançadas de renderização e se tornar um especialista em visualização arquitetônica?</p>
            <p class="text-zinc-300">Nosso curso <strong>Projetista 3D</strong> ensina essas e muitas outras técnicas profissionais usadas por escritórios de arquitetura renomados.</p>
          </div>
        </div>
        
      </div>
    `,
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: { id: 6, name: 'Arquitetura', slug: 'arquitetura', color: '#06B6D4' },
    featuredImage: '/images/blog/enscape-dicas-especialista-renderizacao/enscape-hero-render-exterior.jpg',
    featured_image_url: '/images/blog/enscape-dicas-especialista-renderizacao/enscape-hero-render-exterior.jpg',
    publishedAt: '2025-07-31T16:00:00.000Z',
    readingTime: 12,
    tags: ['enscape', 'renderização', 'visualização-arquitetônica', 'sketchup', 'materiais', 'iluminação', 'composição', 'otimização'],
    views: 0,
    likes: 0
  },
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
  },
  {
    id: 107,
    title: 'Configurações Profissionais do Enscape: Dominando a Renderização em Tempo Real',
    slug: 'enscape-configuracoes-profissionais-renderizacao-tempo-real',
    excerpt: 'Transforme suas renderizações do Enscape de amadoras para profissionais. Aprenda as configurações essenciais que eliminam resultados frustrantes e garantem visualizações arquitetônicas impecáveis em todos os projetos.',
    content: `
      <div class="article-content space-y-8">
        
        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6 text-lg">Você já abriu o SketchUp, iniciou o Enscape, visualizou o resultado e se sentiu completamente decepcionado? Em vez de uma imagem impressionante e fotorrealística, você obtém algo que parece sem vida, desbotado ou superexposto.</p>
          
          <div class="article-image mb-8">
            <img src="/images/blog/enscape-configuracoes-profissionais/enscape-hero-render.jpg" alt="Renderização moderna de loft com configurações profissionais do Enscape" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">O resultado que você quer: renderizações profissionais e fotorrealísticas</p>
          </div>
        </div>

        <div class="article-section">
          <p class="text-zinc-300 leading-relaxed mb-6">Muitos usuários do SketchUp confiam nas configurações automáticas padrão, esperando resultados profissionais—apenas para se frustrarem com iluminação inconsistente, sombras artificiais e materiais irreais.</p>
          
          <div class="article-highlight bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6 my-6">
            <h4 class="text-red-300 font-semibold mb-3">🚫 O Erro Número 1 Que Prejudica Suas Renderizações</h4>
            <p class="text-zinc-300 mb-3">A maioria dos usuários comete o erro de confiar na <strong>exposição automática</strong> e configurações globais sem ajustá-las para seu projeto específico.</p>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Imagens superexpostas ou subexpostas</strong> que carecem de equilíbrio</li>
              <li>• <strong>Iluminação inconsistente</strong> conforme você move a câmera</li>
              <li>• <strong>Materiais planos e sem vida</strong> que não se destacam</li>
              <li>• <strong>Horas extras ajustando configurações manualmente</strong> a cada projeto</li>
            </ul>
          </div>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-configuracoes-profissionais/comparison-before-after.jpg" alt="Comparação entre renderização superexposta vs. adequadamente ajustada" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Comparação entre uma renderização superexposta vs. uma adequadamente ajustada para mostrar por que as configurações padrão falham</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">O Segredo para Renderizações Profissionais: Presets Personalizados</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Se você quer imagens impecáveis e fotorrealísticas, precisa criar seus próprios presets do Enscape que eliminam a adivinhação.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">⚙️ 1. Desative a Exposição Automática</h4>
            <p class="text-zinc-300 mb-3">A exposição automática ajusta o brilho dinamicamente conforme você move a câmera—causando iluminação inconsistente entre diferentes visualizações. Desativá-la permite controle total sobre o equilíbrio de luz e sombra.</p>
            
            <div class="bg-zinc-800/30 rounded-lg p-4 mt-4">
              <h5 class="text-white font-semibold mb-2">Configurações Recomendadas:</h5>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• <strong>Auto Exposure:</strong> OFF</li>
                <li>• <strong>Exposure Value:</strong> 0.0 - 2.0 (ajuste conforme necessário)</li>
                <li>• <strong>White Balance:</strong> 6500K (luz do dia natural)</li>
                <li>• <strong>Brightness:</strong> -0.5 a 0.5</li>
                <li>• <strong>Contrast:</strong> 0.1 a 0.3</li>
              </ul>
            </div>
          </div>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-configuracoes-profissionais/settings-panel-manual.jpg" alt="Painel de configurações do Enscape mostrando exposição automática desativada" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">O painel de configurações do Enscape, mostrando exposição automática desativada e configurações manuais em uso</p>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">2. Configure Presets Separados para Interior e Exterior</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Uma ótima renderização não serve para tudo. Interiores precisam de luzes artificiais cuidadosamente posicionadas e exposição controlada, enquanto exteriores requerem configurações equilibradas de sol, céu e reflexão.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">🏠 Configurações para Interior</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• <strong>Sun Intensity:</strong> 1.0 - 2.0 (reduzido)</li>
                <li>• <strong>Sky Brightness:</strong> 0.5 - 1.0</li>
                <li>• <strong>Artificial Light Intensity:</strong> 1.5 - 3.0</li>
                <li>• <strong>Global Illumination:</strong> Medium/High</li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">🌅 Configurações para Exterior</h4>
              <ul class="space-y-2 text-zinc-300 text-sm">
                <li>• <strong>Sun Intensity:</strong> 3.0 - 4.0</li>
                <li>• <strong>Sky Brightness:</strong> 1.0 - 1.5</li>
                <li>• <strong>Horizon Height:</strong> 0.0</li>
                <li>• <strong>Sun Azimuth:</strong> 45° - 135°</li>
                <li>• <strong>Sun Altitude:</strong> 30° - 60°</li>
              </ul>
            </div>
          </div>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-configuracoes-profissionais/interior-settings-panel.jpg" alt="Configurações visuais ideais para renderização de interiores no Enscape" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Configurações visuais ideais para renderização de interiores</p>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">3. Use Fundos HDRI Personalizados</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Em vez de confiar nas configurações padrão do céu, carregar um HDRI personalizado fornece reflexões mais precisas e iluminação global. Este passo sozinho pode elevar instantaneamente a qualidade da sua renderização.</p>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">🎨 Criando HDRI Personalizado para Interiores</h4>
            <p class="text-zinc-300 mb-3">Para interiores, use um gradiente HDRI personalizado que dá o efeito de um set/estúdio fotográfico. Desta forma, o sol não é a força motriz das configurações.</p>
            
            <div class="bg-zinc-800/30 rounded-lg p-4 mt-4">
              <h5 class="text-white font-semibold mb-2">Tutorial Rápido:</h5>
              <ol class="space-y-1 text-zinc-300 text-sm">
                <li>1. Crie novo documento 2048x1024px no Photoshop</li>
                <li>2. Use ferramenta Gradiente (preto para branco)</li>
                <li>3. Aplique gradiente linear de baixo para cima</li>
                <li>4. Salve como arquivo .hdr ou .exr</li>
                <li>5. Importe no Enscape via configurações de Environment</li>
              </ol>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="article-image">
              <img src="/images/blog/enscape-configuracoes-profissionais/custom-hdri-gradient.jpg" alt="Gradiente criado no Photoshop que vai do preto ao branco" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Esta imagem gradiente com proporção 2:1 criada no Photoshop</p>
            </div>
            <div class="article-image">
              <img src="/images/blog/enscape-configuracoes-profissionais/hdri-skybox-settings.jpg" alt="HDRI personalizado para renderização de interiores" class="w-full rounded-lg shadow-lg" />
              <p class="text-zinc-400 text-sm mt-2 text-center italic">Uso do gradiente HDRI e balanceamento do brilho do Skybox</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">4. Domine a Iluminação Artificial</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Para renderizações interiores, ajustar luzes esféricas, spots e luzes lineares permite controlar ambiente e realismo sem depender apenas da luz solar.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-cyan-300 font-semibold mb-3">💡 Tipos de Luz e Aplicações</h4>
              <ul class="space-y-3 text-zinc-300">
                <li><strong class="text-white">Sphere Lights:</strong> Iluminação geral (1.5-3.0 intensity, 2700K-3000K)</li>
                <li><strong class="text-white">Spot Lights:</strong> Destaque de objetos (2.0-5.0 intensity, 30°-60° ângulo)</li>  
                <li><strong class="text-white">Line Light:</strong> Iluminação indireta e fitas LED (1.0-2.0 intensity)</li>
                <li><strong class="text-white">Omni Lights:</strong> Apenas para efeito e drama (use com moderação)</li>
              </ul>
            </div>
            
            <div class="bg-zinc-800/30 rounded-lg p-6">
              <h4 class="text-orange-300 font-semibold mb-3">⚡ Dica Profissional</h4>
              <p class="text-zinc-300 mb-3">Use tape lighting para iluminação ambiente sutil, e limite Omni lights às áreas necessárias para evitar sobre-iluminação irrealista.</p>
              <p class="text-zinc-300"><strong>Regra de ouro:</strong> Menos é mais quando se trata de iluminação artificial.</p>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h3 class="text-xl font-semibold text-white mb-4">5. Exportação em Lote para Eficiência</h3>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Uma vez criados seus presets de interior e exterior, você pode aplicá-los eficientemente em múltiplas visualizações usando o recurso de renderização em lote do Enscape.</p>
          
          <div class="article-highlight bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 my-6">
            <h4 class="text-green-300 font-semibold mb-3">🚀 Workflow de Exportação Profissional</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Organize suas cenas:</strong> Nomeie como 1, 2, 3, etc. para fácil seleção</li>
              <li>• <strong>Agrupe por tipo:</strong> Interiores primeiro, depois exteriores</li>
              <li>• <strong>Vincule presets:</strong> À primeira cena de cada grupo</li>
              <li>• <strong>Configure resolução:</strong> 1920x1080 (Full HD) ou 3840x2160 (4K)</li>
              <li>• <strong>Defina qualidade:</strong> High ou Ultra para apresentações</li>
            </ul>
          </div>
          
          <div class="article-image mb-6">
            <img src="/images/blog/enscape-configuracoes-profissionais/batch-export-scenes.jpg" alt="Exemplo de nomeação de cenas numeradas para exportação em lote" class="w-full rounded-lg shadow-lg" />
            <p class="text-zinc-400 text-sm mt-2 text-center italic">Normalmente nomeio minhas cenas como 1,2,3 etc. para poder facilmente selecionar as imagens que quero exportar em lote</p>
          </div>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">⏱️ Como a Renderização em Lote Economiza Tempo</h4>
            <p class="text-zinc-300 mb-3">Em vez de ajustar manualmente as configurações para cada cena, a renderização em lote permite aplicar seus presets uma vez e processar rapidamente múltiplas imagens de uma só vez.</p>
            <p class="text-zinc-300">Isso não apenas mantém a consistência da iluminação, mas também acelera os fluxos de trabalho de produção para arquitetos e designers trabalhando com prazos apertados.</p>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Resolução de Problemas Comuns</h2>
          
          <div class="space-y-6">
            <div class="article-highlight bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
              <h4 class="text-red-300 font-semibold mb-3">❌ Problema: Renderização Muito Escura ou Clara</h4>
              <p class="text-zinc-300 mb-3"><strong>Sintomas:</strong> Imagens consistentemente sub ou superexpostas, perda de detalhes em sombras ou highlights, cores desbotadas</p>
              <p class="text-zinc-300 mb-2"><strong>Soluções:</strong></p>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• Ajuste Exposure Value: +0.5 a +2.0 para clarear, -0.5 a -2.0 para escurecer</li>
                <li>• Verifique configurações de HDRI: Skybox Brightness entre 0.5-1.5</li>
                <li>• Balance luzes artificiais: Reduza intensidade se muito brilhante</li>
                <li>• Use Tone Mapping: Auto ou ACES para melhor range dinâmico</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h4 class="text-yellow-300 font-semibold mb-3">❌ Problema: Materiais Parecem Artificiais</h4>
              <p class="text-zinc-300 mb-3"><strong>Sintomas:</strong> Superfícies muito brilhantes ou foscos demais, falta de variação nos materiais, reflexões irreais</p>
              <p class="text-zinc-300 mb-2"><strong>Soluções:</strong></p>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• Ajuste Roughness: 0.1-0.3 para materiais brilhantes, 0.7-0.9 para foscos</li>
                <li>• Configure Metallic values: 0.0 para não-metais, 1.0 para metais puros</li>
                <li>• Use Normal Maps: Para adicionar detalhes de superfície</li>
                <li>• Varie propriedades: Evite materiais uniformes demais</li>
              </ul>
            </div>
            
            <div class="article-highlight bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h4 class="text-blue-300 font-semibold mb-3">❌ Problema: Sombras Muito Duras ou Suaves</h4>
              <p class="text-zinc-300 mb-3"><strong>Sintomas:</strong> Sombras com bordas muito definidas ou inexistentes/muito suaves, transições irreais entre luz e sombra</p>
              <p class="text-zinc-300 mb-2"><strong>Soluções:</strong></p>
              <ul class="space-y-1 text-zinc-300 text-sm">
                <li>• Ajuste Sun Size: Valores maiores (0.5-2.0) para sombras mais suaves</li>
                <li>• Configure Cloud Coverage: 0.3-0.7 para difusão natural</li>
                <li>• Use múltiplas fontes de luz: Para preencher sombras duras</li>
                <li>• Ajuste Global Illumination: Medium/High para melhor distribuição</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="article-section">
          <h2 class="text-2xl font-bold text-white mb-6">Conclusão: Elevando Suas Renderizações ao Próximo Nível</h2>
          
          <p class="text-zinc-300 leading-relaxed mb-6">Criar renderizações impecáveis com o Enscape requer ir além das configurações padrão e abraçar presets personalizados. Assumir o controle da iluminação, exposição e configurações de renderização resulta em saídas consistentemente de alta qualidade.</p>
          
          <div class="article-highlight bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
            <h4 class="text-cyan-300 font-semibold mb-3">🎯 Principais Aprendizados</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• <strong>Desative a exposição automática</strong> para controle total</li>
              <li>• <strong>Crie presets específicos</strong> para interior e exterior</li>
              <li>• <strong>Use HDRIs personalizados</strong> para iluminação realista</li>
              <li>• <strong>Domine a iluminação artificial</strong> para interiores convincentes</li>
              <li>• <strong>Implemente workflows de lote</strong> para eficiência profissional</li>
            </ul>
          </div>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">🚀 Para Estudantes de Arquitetura da Escola Habilidade</h4>
            <p class="text-zinc-300 mb-3">Dominar essas técnicas no Enscape prepara vocês para o mercado profissional, onde a visualização arquitetônica é competência fundamental.</p>
            
            <p class="text-zinc-300 mb-3"><strong>Vantagens Competitivas:</strong></p>
            <ul class="space-y-1 text-zinc-300 text-sm">
              <li>• <strong>Portfolio impressionante:</strong> Renderizações de nível profissional</li>
              <li>• <strong>Eficiência comprovada:</strong> Entregas rápidas e consistentes</li>
              <li>• <strong>Versatilidade técnica:</strong> Domínio de ferramentas atuais</li>
              <li>• <strong>Visão comercial:</strong> Compreensão do impacto visual nos negócios</li>
            </ul>
          </div>
          
          <div class="bg-zinc-800/30 rounded-lg p-6 mb-6">
            <h4 class="text-white font-semibold mb-3">🎓 Próximos Passos Recomendados</h4>
            <ul class="space-y-2 text-zinc-300">
              <li>• Pratique os exercícios propostos sistematicamente</li>
              <li>• Crie sua biblioteca de presets personalizados</li>
              <li>• Experimente diferentes estilos de renderização</li>
              <li>• Documente seu processo para construir metodologia própria</li>
              <li>• Compartilhe resultados para obter feedback da comunidade</li>
              <li>• Mantenha-se atualizado com novas versões e recursos</li>
            </ul>
          </div>
          
          <div class="article-highlight bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 my-6">
            <h4 class="text-purple-300 font-semibold mb-3">💡 Lembre-se</h4>
            <p class="text-zinc-300 mb-3">A excelência em renderização não vem apenas do software—vem da compreensão de luz, composição, e narrativa visual. O Enscape é sua ferramenta; sua visão criativa é o que transforma pixels em arquitetura inspiradora.</p>
            <p class="text-zinc-300 italic">"A renderização perfeita não acontece por acaso. Ela é resultado de configurações precisas, compreensão técnica e visão artística trabalhando em harmonia."</p>
          </div>
        </div>

      </div>
    `,
    author: {
      id: 1,
      name: 'Escola Habilidade',
      bio: 'Especialistas em educação tecnológica e visualização arquitetônica',
      avatar: '/images/avatars/escola-logo.png',
      social: {
        linkedin: 'https://linkedin.com/company/escola-habilidade',
        instagram: 'https://instagram.com/escolahabilidade'
      }
    },
    category: {
      id: 6,
      name: 'Arquitetura',
      slug: 'arquitetura',
      color: '#06B6D4'
    },
    publishedAt: '2025-07-31T10:00:00.000Z',
    updatedAt: '2025-07-31T10:00:00.000Z',
    readingTime: 15,
    featured: true,
    featured_image_url: '/images/blog/enscape-configuracoes-profissionais/enscape-hero-render.jpg',
    seo: {
      title: 'Configurações Profissionais do Enscape: Dominando a Renderização em Tempo Real | Escola Habilidade',
      description: 'Transforme suas renderizações do Enscape de amadoras para profissionais. Aprenda as configurações essenciais que eliminam resultados frustrantes e garantem visualizações arquitetônicas impecáveis.',
      keywords: ['enscape', 'sketchup', 'renderização', 'visualização-arquitetônica', '3d', 'profissional', 'configurações', 'hdri', 'iluminação'],
      canonical_url: '/blog/enscape-configuracoes-profissionais-renderizacao-tempo-real',
      og_image: '/images/blog/enscape-configuracoes-profissionais/enscape-hero-render.jpg'
    },
    tags: ['enscape', 'sketchup', 'renderização', 'visualização-arquitetônica', '3d', 'profissional', 'configurações'],
    views: 0,
    likes: 0
  }
];

export { mockCategories, mockPosts };
export default { categories: mockCategories, posts: mockPosts };