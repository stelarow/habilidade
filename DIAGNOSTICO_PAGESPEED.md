# 📊 Diagnóstico PageSpeed Insights - Escola Habilidade

## 🎯 Resultados Gerais
- **Desktop**: 100 pontos de desempenho
- **Mobile**: 97 pontos de desempenho

---

## 📱 Diagnóstico

### Reduza o JavaScript não usado Possível economia de 66 KiB
Para diminuir o consumo de bytes da atividade da rede, reduza o JavaScript não usado e adie o carregamento de scripts até que eles sejam necessários. Aprenda a reduzir o JavaScript não usado.LCPFCP
URL
Tamanho da transferência
Possível economia
GitHub utility Própria
131,2 KiB	66,0 KiB
…assets/index-DdBGh_od.js(stelarow.github.io)
131,2 KiB
66,0 KiB

### Minimize o trabalho da thread principal 3,2 s
Considere diminuir o tempo gasto na análise, compilação e execução de JS. Você vai perceber que a entrega de payloads JS menores ajuda a fazer isso. Aprenda a minimizar o trabalho da linha de execução principal.TBT
Categoria
Tempo gasto
Script Evaluation
1.217 ms
Other
979 ms
Style & Layout
494 ms
Rendering
475 ms
Garbage Collection
12 ms
Parse HTML & CSS
4 ms
Script Parsing & Compilation
1 ms

### Disponibilize recursos estáticos com uma política de cache eficiente 2 recursos encontrados
Um cache com ciclo de vida longo pode acelerar visitas repetidas à sua página. Saiba mais sobre as políticas de cache eficientes.
URL
Cache TTL
Tamanho da transferência
GitHub utility Própria
148 KiB
…assets/index-DdBGh_od.js(stelarow.github.io)
10 min
132 KiB
…assets/index-BQxk9C8B.css(stelarow.github.io)
10 min
16 KiB

### Elimine recursos que impedem a renderização Possível economia de 0 ms
Recursos estão bloqueando a first paint da sua página. Inclua JS/CSS crítico inline e adie todos os JS/estilos não críticos. Aprenda a eliminar recursos de bloqueio de renderização.LCPFCP
URL
Tamanho da transferência
Possível economia
GitHub utility Própria
16,1 KiB	300 ms
…assets/index-BQxk9C8B.css(stelarow.github.io)
16,1 KiB
300 ms
Google Fonts cdn 
1,3 KiB	780 ms
/css2?family=Montserrat:wght@400;600;700&display=swap(fonts.googleapis.com)
1,3 KiB
780 ms

### Evite DOM de tamanho excessivo 1.033 elementos
Um DOM grande aumenta o uso da memória, causa cálculos de estilo mais longos e produz reflows de layout dispendiosos. Aprenda a evitar um DOM com um tamanho grande demais.TBT
Estatística
Elemento
Valor
Total de elementos DOM
1.033
Profundidade máxima de DOM
div.w-full > div.absolute > div.w-4 > div.w-1.5
<div class="w-1.5 h-1.5 bg-blue-400 rounded-full">
16
Máximo de elementos filhos
div.App > main#main-content > section.relative > div.absolute
<div class="absolute inset-0 pointer-events-none " aria-hidden="true">
25

### Evite grandes mudanças no layout 15 trocas de layout encontradas
Essas são as maiores trocas de layout observadas na página. Cada item da tabela representa uma única troca de layout e mostra o elemento que mais mudou. Abaixo de cada item estão as possíveis causas para a troca de layout. Algumas dessas trocas podem não ser incluídas no valor da métrica de CLS devido ao janelamento. Aprenda a melhorar o CLSCLS
Elemento
Pontuação da troca de layout
main#main-content > section.relative > div.absolute > span.star
<span class="star block absolute rounded-full bg-fuchsia-500/80" style="left: 18.2588%; top: 69.7753%; width: 2.99172px; height: 2.99172px;">
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000
0,000

### Evitar tarefas longas da linha de execução principal 3 tarefas longas encontradas
Lista as tarefas mais longas na linha de execução principal. Útil para identificar os piores contribuidores para a latência de entrada. Aprenda a evitar tarefas mais longas da linha de execução principalTBT
URL
Horário de início
Duração
GitHub utility Própria
207 ms
…assets/index-DdBGh_od.js(stelarow.github.io)
2.116 ms
84 ms
/habilidade/(stelarow.github.io)
788 ms
69 ms
…assets/index-DdBGh_od.js(stelarow.github.io)
2.200 ms
54 ms

### Evitar animações não compostas 21 elementos animados encontrados
Animações que não são compostas podem ficar instáveis e aumentar a CLS. Aprenda a evitar animações que não são compostasCLS
Elemento
Nome
div.relative > div.flex > a.btn-neon > ::before
<::before>
Propriedade CSS incompatível: background-position-x
borderFlow
Habilidade em
<span class="block text-6xl sm:text-8xl font-extrabold gradient-text animate-gradient m…">
Propriedade CSS incompatível: background-position-x
gradient
03
<div class="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-green-500/60 to-emerald-…">
Propriedade CSS incompatível: box-shadow
techPulse
DESTAQUE
<div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rou…">
Propriedade CSS incompatível: box-shadow
specialPulse
RS
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/60 to-cyan-400/60 fl…">
Propriedade CSS incompatível: box-shadow
techPulse
ACO
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500/60 to-teal-400/60 fl…">
Propriedade CSS incompatível: box-shadow
techPulse
LBD
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500/60 to-yellow-400/60…">
Propriedade CSS incompatível: box-shadow
techPulse
02
<div class="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-amber-500/60 to-yellow-4…">
Propriedade CSS incompatível: box-shadow
techPulseSpecial
H
<span class="font-extrabold text-2xl sm:text-4xl gradient-text animate-grad…">
Propriedade CSS incompatível: background-position-x
gradient
div.max-w-4xl > div.text-center > a.btn-neon > ::before
<::before>
Propriedade CSS incompatível: background-position-x
borderFlow
KRR
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/60 to-violet-400/6…">
Propriedade CSS incompatível: box-shadow
techPulse
div.bg-zinc-800/50 > form.space-y-6 > button.btn-neon > ::before
<::before>
Propriedade CSS incompatível: background-position-x
borderFlow
DESTAQUE
<div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rou…">
Propriedade CSS incompatível: box-shadow
specialPulse
DESTAQUE
<div class="bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rou…">
Propriedade CSS incompatível: box-shadow
specialPulse
EV
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500/60 to-rose-400/60 fl…">
Propriedade CSS incompatível: box-shadow
techPulse
JT
<div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500/60 to-emerald-400/6…">
Propriedade CSS incompatível: box-shadow
techPulse
04
<div class="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/60 to-pink-40…">
Propriedade CSS incompatível: box-shadow
techPulse
div.relative > div.flex > a.btn-neon > ::before
<::before>
Propriedade CSS incompatível: background-position-x
borderFlow
div.flex > div.mt-8 > a.btn-neon > ::before
<::before>
Propriedade CSS incompatível: background-position-x
borderFlow
Avaliações
<div class="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple…">
Propriedade CSS incompatível: box-shadow
techPulse
01
<div class="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/60 to-cyan-400/…">
Propriedade CSS incompatível: box-shadow
techPulse

### Evitar encadeamento de solicitações críticas 3 redes encontradas
As cadeias de solicitação críticas abaixo mostram quais recursos são carregados com prioridade alta. Diminua o tamanho das cadeias, reduza o tamanho do download de recursos ou adie o download de recursos desnecessários para melhorar o carregamento de página. Aprenda a evitar encadeamento de solicitações críticas.
Latência máxima do caminho crítico: 247,391 ms
Navegação inicial
/habilidade/(stelarow.github.io)
/css2?family=Montserrat:wght@400;600;700&display=swap(fonts.googleapis.com) - 9,006 ms, 1,33 KiB
…assets/index-DdBGh_od.js(stelarow.github.io) - 180,541 ms, 132,37 KiB
…assets/index-BQxk9C8B.css(stelarow.github.io) - 79,346 ms, 16,08 KiB

### Reduzir o uso de terceiros A linha de execução principal foi bloqueada por 0 ms pelo código de terceiros
Código de terceiros pode afetar significativamente a performance de carregamento. Limite o número de provedores terceirizados e carregue o código de terceiros depois que a página tiver sido carregada. Aprenda a minimizar o impacto de terceiros.TBT
Terceiros
Tamanho da transferência
Tempo de bloqueio da linha de execução principal
Google Fonts cdn 
1 KiB	0 ms
/css2?family=Montserrat:wght@400;600;700&display=swap(fonts.googleapis.com)
1 KiB
0 ms

### Elemento de Maior exibição de conteúdo 2.100 ms
Este é o maior elemento com conteúdo na janela de visualização. Saiba mais sobre o elemento Maior exibição de conteúdo.LCP
Elemento
Aprenda hoje as habilidades que vão liderar o mercado de amanhã.
<p class="text-zinc-300 text-sm md:text-base lg:text-lg text-center max-w-2xl mx-aut…">
Fase
% de LCP
Tempo
TTFB
29%
600 ms
Atraso no carregamento
0%
0 ms
Tempo de carregamento
0%
0 ms
Atraso na renderização
71%
1.500 ms

### Mais informações sobre o desempenho do seu aplicativo. Esses números não afetam diretamente o índice de desempenho.

### Auditorias aprovadas (25)
Mostrar

## 94 Acessibilidade
Essas verificações destacam oportunidades para melhorar a acessibilidade do seu app da Web. A detecção automática só detecta um subconjunto de problemas e não garante a acessibilidade do seu app da Web. Portanto, também recomendamos o teste manual.

### Contraste
As cores de primeiro e segundo plano não têm uma taxa de contraste suficiente.
Veja aqui oportunidades de melhorar a legibilidade do seu conteúdo.

### Navegação
Os elementos de título não aparecem em uma ordem sequencial descendente
Veja aqui oportunidades de melhorar a navegação por teclado no seu aplicativo.

### Outros itens para verificação manual (10)
Mostrar
Esses itens se referem a áreas que uma ferramenta de teste automatizada não pode cobrir. Saiba mais no nosso guia sobre como realizar uma avaliação de acessibilidade.

### Auditorias aprovadas (23)
Ocultar
Os atributos [aria-*] correspondem às próprias funções
O [aria-hidden="true"] não está presente no documento <body>
[role]s têm todos os atributos [aria-*] obrigatórios
Os atributos [aria-*] têm valores válidos
Os atributos [aria-*] são válidos e não contêm erros de ortografia
Os botões têm um nome acessível
[user-scalable="no"] não é usado no elemento <meta name="viewport">, e o atributo [maximum-scale] não é menor que 5.
Os atributos ARIA são usados conforme especificado para a função do elemento
Os elementos [aria-hidden="true"] não contêm descendentes focalizáveis
Os elementos usam apenas atributos ARIA permitidos
Os valores de [role] são válidos
O documento tem um elemento <title>
Os elementos <frame> ou <iframe> têm um título
O elemento <html> tem um atributo [lang]
O elemento <html> tem um valor válido para o atributo [lang]
Os elementos de formulário têm etiquetas associadas
Os links são distinguíveis sem depender da cor.
Os links têm um nome compreensível
Os elementos de <select> têm elementos de <label> associados.
As áreas de toque têm tamanho e espaçamento suficientes.
Links de salto são focalizáveis.
Usa papéis ARIA apenas em elementos compatíveis
As funções ARIA descontinuadas não foram usadas

### Não aplicável (32)
Ocultar
Valores de [accesskey] são exclusivos
Os elementos button, link e menuitem têm nomes acessíveis
Elementos com role="dialog" ou role="alertdialog" têm nomes acessíveis
Os campos de entrada ARIA têm nomes acessíveis
Os elementos ARIA meter têm nomes acessíveis
Os elementos ARIA progressbar têm nomes acessíveis
Elementos com uma [role] ARIA que exigem que os filhos contenham uma [role] específica têm todos os filhos obrigatórios
[role]s fazem parte do elemento pai obrigatório
Os elementos com o atributo role=text não têm descendentes focalizáveis
Os campos de alternância ARIA têm nomes acessíveis
Os elementos ARIA tooltip têm nomes acessíveis
Os elementos ARIA treeitem têm nomes acessíveis
A página contém um título, um link de salto ou uma região de ponto de referência
<dl>s contêm apenas os grupos <dt> e <dd>, elementos <script>, <template> ou <div> devidamente organizados
Os itens da lista de definição estão unidos em elementos <dl>
Os códigos ARIA são únicos
Nenhum campo de formulário tem vários rótulos
O elemento <html> tem um atributo [xml:lang] com o mesmo idioma base que o atributo [lang]
Os elementos de imagem têm atributos [alt]
Elementos de imagem não têm atributos [alt] que sejam texto redundante
Os botões de entrada têm texto compreensível
Os elementos <input type="image"> têm texto [alt]
As listas contêm somente elementos <li> e elementos compatíveis com script (<script> e <template>)
Itens de lista (<li>) estão contidos nos elementos pai <ul>, <ol> ou <menu>
O documento não usa <meta http-equiv="refresh">
Os elementos <object> têm texto alternativo
Nenhum elemento tem um valor de [tabindex] maior que 0
As tabelas têm conteúdo diferente no atributo de resumo e em <caption>
Células em um elemento <table> que usam o atributo [headers] referem-se às células na mesma tabela
Os elementos <th> e os elementos com [role="columnheader"/"rowheader"] têm as células de dados descritas
Os atributos [lang] têm um valor válido
Os elementos <video> contêm um elemento <track> com [kind="captions"]

## 100 Práticas recomendadas
Garantia e segurança

### Conferir se a CSP é eficaz contra ataques de XSS
Uma Política de Segurança de Conteúdo (CSP) avançada reduz significativamente o risco de ataques de scripting em vários locais (XSS). Aprenda a usar uma CSP para evitar ataques de XSS
Descrição
Diretiva
Gravidade
Nenhuma CSP encontrada no modo restrito
Alto

### Usar uma política HSTS forte
A implantação do cabeçalho HSTS reduz significativamente o risco de downgrade de conexões HTTP e ataques de escuta não autorizada. Recomendamos fazer um lançamento em etapas, começando com uma diretiva max-age baixa. Saiba mais sobre como usar uma política HSTS forte
Descrição
Diretiva
Gravidade
Nenhuma diretiva `includeSubDomains` foi encontrada
includeSubDomains
Médio
Nenhuma diretiva `preload` foi encontrada
preload
Médio

### Garantir o isolamento adequado da origem com COOP
A Cross-Origin-Opener-Policy (COOP) pode ser usada para isolar a janela de nível superior de outros documentos, como pop-ups. Saiba mais sobre como implantar o cabeçalho COOP
Descrição
Diretiva
Gravidade
Nenhum cabeçalho COOP foi encontrado
Alto

### Mitigar clickjacking com XFO ou CSP
O cabeçalho X-Frame-Options (XFO) ou a diretiva frame-ancestors no cabeçalho Content-Security-Policy (CSP) controla onde uma página pode ser incorporada. Isso pode reduzir os ataques de clickjacking, bloqueando alguns ou todos os sites que incorporam a página. Saiba mais sobre como reduzir o clickjacking
Descrição
Gravidade
Nenhuma política de controle de frame foi encontrada
Alto

### Geral
Mapas de origem ausentes no JavaScript principal grande
Os mapas de origem traduzem códigos minificados para o código-fonte original. Isso ajuda os desenvolvedores na depuração durante a produção. Além disso, o Lighthouse pode fornecer mais insights. Implante mapas de origem para usar esses benefícios
URL
URL do mapa
GitHub utility Própria
…assets/index-DdBGh_od.js(stelarow.github.io)
Mapa de origem ausente do arquivo JavaScript grande

### Auditorias aprovadas (14)
Ocultar
Utiliza HTTPS
Evita APIs obsoletas
Evita cookies de terceiros
Permitir que os usuários colem dados nos campos de entrada
Evita o pedido da permissão de geolocalização no carregamento de página
Evita o pedido da permissão de notificação no carregamento de página
Exibe imagens com a proporção correta
Exibe imagens em resolução adequada
Há uma tag <meta name="viewport"> com width ou initial-scale
O documento usa tamanhos de fonte legíveis 100% do texto legível
A página tem o doctype HTML
Define corretamente o charset
Nenhum erro do navegador registrado no console
Nenhum problema no painel Issues do Chrome Devtools

### Não aplicável (2)
Ocultar
O tráfego HTTP é redirecionado para HTTPS
Bibliotecas JavaScript detectadas

## 100 SEO
Essas verificações garantem que sua página siga orientações básicas para otimização de mecanismos de pesquisa. Há muitos outros fatores não avaliados pelo Lighthouse que ainda podem afetar sua classificação na pesquisa, como a performance nas Core Web Vitals. Saiba mais sobre os Fundamentos da Pesquisa Google

### Outros itens para verificação manual (1)
Ocultar
Os dados estruturados são válidos
Execute estes validadores adicionais no seu site para verificar mais práticas recomendadas de SEO

### Auditorias aprovadas (7)
Ocultar
A página não está bloqueada para indexação
O documento tem um elemento <title>
O documento tem uma metadescrição
A página tem um código de status HTTP bem-sucedido
Os links têm texto descritivo
Os links são rastreáveis
O documento tem um hreflang válido

### Não aplicável (3)
Ocultar
robots.txt é válido
Se o arquivo robots.txt for inválido, talvez não seja possível aos rastreadores entender como você quer que seu site seja rastreado ou indexado. Saiba mais sobre o arquivo robots.txt
Os elementos de imagem têm atributos [alt]
O texto de elementos informativos precisa ser alternativo, breve e descritivo. Elementos decorativos podem ser ignorados com um atributo alternativo vazio. Saiba mais sobre o atributo alt
O documento tem um rel=canonical válido
Os links canônicos sugerem o URL a ser exibido nos resultados da pesquisa. Saiba mais sobre links canônicos

---

*Diagnóstico realizado em: Janeiro 2025*
*Ferramenta: Google PageSpeed Insights* 