# Como Construir seu Primeiro Agente de IA (+Template de Workflow Gratuito)

**Publicado em:** 31 de Julho de 2025  
**Tempo de leitura:** 16 minutos  
**Categoria:** Programação  
**Tags:** ia, automacao, n8n, agentes-ia, workflow, tutorial, gemini, no-code

## Resumo

Guia passo a passo para construir agentes de IA com três abordagens práticas: programação do zero para controle total, uso de frameworks poderosos como LangChain ou LlamaIndex para desenvolvimento mais rápido, ou ferramentas no-code como n8n para prototipagem rápida e automação.

---

## Objetivos de Aprendizagem

- Compreender os componentes fundamentais de um agente de IA
- Conhecer três abordagens diferentes para construir agentes de IA
- Implementar um agente de pesquisa completo usando n8n
- Integrar ferramentas como scraping web, LLMs e notificações
- Aplicar boas práticas de automação e workflow design

---

## O que são Agentes de IA?

Imagine construir um assistente que pode pesquisar tópicos online, resumir as descobertas e salvá-las diretamente no seu Notion - automaticamente. Esse é o tipo de automação inteligente que os [agentes de IA](https://blog.n8n.io/ai-agents/) tornam possível.

Mas aqui está o verdadeiro desafio: fazer com que uma IA aja de forma confiável no mundo real - interagindo com APIs, fazendo scraping de sites, atualizando bancos de dados. Como você conecta o raciocínio da IA com as ferramentas que ela precisa para executar tarefas reais?

Neste guia, discutiremos três maneiras sólidas de construir agentes de IA:

- **Do zero** (se você está se sentindo corajoso)
- **Com frameworks** como LangChain e CrewAI (se você quer flexibilidade sem reinventar a roda)
- **Com n8n** (se você gosta de workflows visuais e quer construir agentes de IA rápidos e prontos para produção)

Vamos manter tudo prático, e no final, você terá um agente de IA funcionando que realmente faz coisas - não apenas pensa sobre elas.

---

## Entendendo os Fundamentos dos Agentes de IA

Antes de mergulhar na construção, vamos quebrar como um agente de IA funciona.

Em sua essência, um agente de IA atua como um sistema que age em nome de um usuário (ou programa) para alcançar um resultado específico, percebendo seu ambiente, tomando decisões e executando ações. Embora possam variar de chatbots simples a sistemas autônomos complexos, a maioria dos agentes de IA compartilha alguns componentes fundamentais:

### 1. Percepção

É a capacidade de coletar informações do seu ambiente. Este ambiente pode ser uma interface de chat, um banco de dados, uma página web ou até sensores físicos. As entradas podem incluir:

- Comandos de texto de um usuário (por exemplo, uma mensagem ou prompt)
- Eventos disparados por outros sistemas, como webhooks ou mensagens
- Informações recuperadas de sites ou APIs
- Conteúdo de documentos ou bancos de dados

### 2. Tomada de Decisão

Este é o "cérebro" do agente. Baseado em sua percepção (as informações coletadas) e seus objetivos programados, o agente decide o que fazer a seguir. Esta lógica central pode envolver:

- **Modelos de Linguagem Grande (LLMs)**: Agentes modernos frequentemente utilizam LLMs (como GPT, Gemini, Claude etc.) como seu motor de raciocínio principal para entender solicitações, formular planos e gerar respostas.
- **Sistemas Baseados em Regras**: Instruções simples como "se o cliente pedir reembolso, execute o workflow de reembolso."
- **Modelos de Machine Learning**: Algoritmos treinados para prever resultados ou classificar informações para guiar decisões.
- **Planejamento**: Quebrar um objetivo complexo (ex: "planejar uma viagem para Roma") em passos menores e gerenciáveis (pesquisar voos, encontrar hotéis, verificar requisitos de visto).

### 3. Ação

Uma vez que uma decisão é tomada, o agente precisa agir sobre ela. Isso envolve interagir com seu ambiente para executar os passos escolhidos. As ações podem ser diversas, como:

- Enviar uma mensagem de volta ao usuário
- Chamar uma API (como pesquisar na web ou postar em um canal do Discord)
- Executar um workflow (como um workflow do n8n!)
- Atualizar informações em um banco de dados
- Controlar um dispositivo físico

As ações são como o agente influencia seu ambiente para se aproximar de seu objetivo. A capacidade de usar várias ferramentas de agente de IA (como APIs ou workflows) é central para a eficácia de um agente.

Quando um agente usa um LLM para tomada de decisão, o LLM precisa de uma maneira estruturada de entender quais ações pode tomar e como executá-las. Isso é frequentemente alcançado através da definição de **Ferramentas** ou habilitação de **Chamada de Funções**. Esses mecanismos permitem que o LLM sinalize sua intenção de usar uma capacidade específica (como chamar uma API externa ou executar um workflow do n8n) e forneça os parâmetros necessários.

### 4. Memória

Agentes frequentemente precisam lembrar de interações passadas ou informações aprendidas para fornecer contexto para decisões futuras. A memória permite que um agente:

- Lembre de partes anteriores de uma conversa para manter contexto
- Armazene preferências do usuário (ex: "sempre use unidades métricas")
- Acesse bases de conhecimento externas (como documentos ou bancos de dados) para responder perguntas com precisão (frequentemente usando técnicas como Geração Aumentada por Recuperação ou RAG)
- Aprenda com experiências passadas para melhorar o desempenho futuro

Esses componentes trabalham juntos em um loop contínuo: o agente percebe seu ambiente, decide sobre uma ação baseada em seus objetivos e memória, e então executa essa ação, potencialmente mudando o ambiente e iniciando o ciclo novamente.

Entender esses blocos de construção básicos é o primeiro passo. A seguir, vamos ver as diferentes maneiras de realmente construir agentes de IA.

> **💡 Dica Educacional**  
> Interessado em ver agentes de IA em ação? Este artigo fornece [15 exemplos do mundo real de como agentes de IA](https://blog.n8n.io/ai-agents-examples/), particularmente aqueles construídos com n8n, estão automatizando tarefas como análise de dados, suporte ao cliente e muito mais!

---

## Como Criar Agentes de IA: 3 Abordagens Práticas

Então, como vamos realmente construir um agente de IA? Existem várias maneiras de abordar isso, cada uma com seu próprio conjunto de trade-offs em termos de flexibilidade, complexidade e velocidade de desenvolvimento.

Vamos ver três métodos comuns:

### 1. Construindo Agentes de IA do Zero

Aprender como construir um agente de IA do zero envolve codificar todos os componentes usando linguagens de programação como Python e potencialmente aproveitando bibliotecas específicas de IA/ML.

Esta abordagem oferece flexibilidade máxima e controle sobre todos os aspectos do comportamento do agente.

No entanto, requer expertise técnica significativa em áreas como engenharia de software, integração de API e potencialmente machine learning. Também demanda tempo e esforço consideráveis para construir, testar e manter todo o sistema.

Este caminho frequentemente responde à pergunta 'quanto custa construir um agente de IA?' com 'significativamente', devido ao tempo de desenvolvimento e expertise necessários. É frequentemente escolhido para projetos altamente especializados ou orientados à pesquisa onde as ferramentas existentes não atendem aos requisitos específicos.

### 2. Usando Frameworks Existentes para Construir Agentes de IA

Vários frameworks (como LangChain, LlamaIndex, Semantic Kernel ou Autogen) fornecem componentes pré-construídos e abstrações projetadas para criar agentes de IA. Esses frameworks oferecem blocos de construção para gerenciar prompts, conectar-se a LLMs, lidar com memória, definir ferramentas (ações) e orquestrar passos do agente. Eles aceleram significativamente o desenvolvimento comparado à construção do zero ao lidar com muito da complexidade subjacente.

No entanto, ainda requerem proficiência em codificação e um bom entendimento da arquitetura e conceitos do framework escolhido.

Esta abordagem equilibra flexibilidade e velocidade de desenvolvimento, adequada para equipes que querem desenvolvimento estruturado com alguma customização.

> **💡 Recursos Adicionais**  
> Compilamos [9 frameworks populares de agentes de IA](https://blog.n8n.io/ai-agent-frameworks/) - desde simplicidade drag-and-drop até configurações totalmente orientadas por código. Cada um oferece um nível diferente de controle, complexidade e customização.

### 3. Usando Ferramentas de Automação de Workflow

[Plataformas como n8n](https://n8n.io/ai/) fornecem um ambiente visual baseado em nós para construir agentes. Você conecta serviços como LLMs, APIs e bancos de dados como nós, definindo a lógica e ações do agente organizando e configurando esses nós em um workflow.

Esta abordagem reduz significativamente a barreira de entrada e acelera o desenvolvimento e prototipagem, mudando o foco da codificação complexa para design de workflow e integração de ferramentas.

É particularmente adequada para automatizar tarefas, construir rapidamente protótipos de agentes e integrar capacidades de IA em processos de negócio mais amplos.

---

## Como Construir um Agente de IA com n8n: Tutorial Passo a Passo

O n8n se destaca como uma escolha para construir agentes de IA porque equilibra exclusivamente flexibilidade de implementação com velocidade de entrega. Embora seja principalmente uma ferramenta de automação de workflow, permite a criação de agentes que podem chamar múltiplas ferramentas pré-construídas ou customizadas, integrar capacidades RAG para recuperação de conhecimento e conectar-se a várias interfaces de chat através de suas opções flexíveis de API e SDK.

Vamos construir um agente de pesquisa prático que faz scraping da web e salva o resumo para nós - automaticamente!

Como a funcionalidade principal dos agentes de IA é o uso de [ferramentas](https://docs.n8n.io/advanced-ai/examples/understand-tools/) como [requisições HTTP](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolhttprequest/) e a ferramenta Notion - este exemplo aproveita LLMs avançados como o recém-lançado Gemini 2.5 Pro, cuja chamada de ferramentas confiável e janela de contexto enorme tornam essas tarefas viáveis!

Aqui está uma imagem do que vamos construir usando n8n:

![Workflow do agente de pesquisa n8n](/images/blog/agente-ia-n8n/n8n-research-agent-workflow.png)
*Workflow do agente de pesquisa n8n*

### Pré-requisitos

Antes de começarmos a construir o workflow, certifique-se de ter o seguinte configurado:

- **Instância n8n:** Você precisa do n8n rodando. Pode ser uma [instância auto-hospedada](https://docs.n8n.io/hosting/) (ex: usando Docker) ou uma conta no [n8n Cloud](https://app.n8n.cloud/register).
- **Browserless:** Acesso a uma instância [Browserless](https://www.browserless.io/) é necessário para web scraping. Você pode usar o serviço em nuvem deles ou auto-hospedar sua própria instância (ex: usando Docker).
- **Chave da API do Google AI:** Obtenha uma chave de API do [Google AI Studio](https://aistudio.google.com/) para usar o modelo Gemini.
- **Discord:** Configure um [webhook do Discord ou conta de bot](https://docs.n8n.io/integrations/builtin/credentials/discord/) para enviar notificação quando a pesquisa estiver pronta.

### Passo 1: Configure o Gatilho

Todo workflow do n8n começa com um nó de gatilho. Este nó inicia o workflow quando um evento específico ocorre. Para nosso Agente de Pesquisa de IA, queremos que ele ative quando enviarmos uma mensagem contendo uma URL, tipicamente via interface de chat.

No canvas do n8n, clique no botão '+' para adicionar seu primeiro nó. Escolha um gatilho relevante para como você quer interagir com seu agente. Neste caso, podemos usar o [gatilho Chat](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger). Outros gatilhos comuns para esse caso de uso seriam o [gatilho Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), que cria uma URL única para a qual você pode enviar requisições HTTP de uma aplicação customizada ou outro serviço, ou o [gatilho Slack](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.slacktrigger) que escuta mensagens ou comandos no Slack.

### Passo 2: Configure o Núcleo do Agente

O coração do nosso workflow é o [nó AI Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent). Este nó atua como o orquestrador central, conectando o gatilho, o Modelo de Linguagem Grande (LLM) e as ferramentas que o agente pode usar.

![Configuração do nó AI Agent](/images/blog/agente-ia-n8n/ai-agent-node-config.png)
*Configuração do nó AI Agent*

Primeiro, adicione um nó AI Agent ao canvas e conecte a saída do seu nó de gatilho à entrada do nó AI Agent.

Nas configurações do nó AI Agent (veja imagem), certifique-se de que o dropdown **Agent** esteja definido como _Tools Agent_. Este tipo é projetado para agentes que precisam utilizar ferramentas específicas para realizar tarefas. Defina a **Fonte para Prompt (Mensagem do Usuário)** como _Nó de Gatilho de Chat Conectado_. Isso diz ao agente para usar a entrada do seu gatilho (ex: a mensagem de chat contendo a URL) como a solicitação do usuário. O campo de entrada específico pode variar dependendo da saída do seu nó de gatilho.

### Passo 3: Defina o Objetivo e Instruções do Agente

Aqui é onde você diz à IA o que você quer que ela faça e como ela deve usar suas ferramentas. Instruções claras são cruciais para o desempenho confiável do agente.

Adicione um [nó Google Gemini Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglegemini) (ou seu nó LLM preferido como OpenAI Chat Model, Anthropic Chat Model, etc.) e configure-o com suas credenciais (sua Chave da API do Google AI).

![Configuração do LLM Google Gemini](/images/blog/agente-ia-n8n/google-gemini-llm-config.png)
*Configuração do LLM Google Gemini*

Selecione o Modelo desejado (ex: gemini-2.5-pro) e conecte este nó LLM à entrada Chat Model do nó AI Agent.

![Configure o prompt do sistema](/images/blog/agente-ia-n8n/system-prompt-config.png)
*Configure o prompt do sistema*

No nó AI Agent, nos parâmetros, há um campo chamado **System Message** dentro da seção **Options**. Aqui é onde você fornece as instruções principais para o agente. Aqui você pode definir as instruções do agente. Para melhores resultados, a mensagem do sistema deve:

1. Declarar claramente a tarefa do agente
2. Instruir explicitamente o agente sobre quando e como usar cada ferramenta
3. Adicionar quaisquer restrições importantes como "Lembre-se de que você sempre tem que fazer scraping do site usando a ferramenta website_scraper.", "Não tente resumir sem fazer scraping!" etc.

> **💡 Dica Profissional**  
> Leia mais sobre usar [Ferramentas de IA no n8n](https://docs.n8n.io/advanced-ai/examples/understand-tools).

### Passo 4: Adicione a Ferramenta de Web Scraping

Agora configuramos as ferramentas reais que o agente pode usar. Primeiro, o web scraper usa Browserless. Como não há um nó Browserless dedicado, usamos o versátil [nó HTTP Request Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolhttprequest).

Adicione um nó HTTP Request Tool ao canvas e renomeie-o para _website_scraper_ (ou similar). Este nome deve corresponder ao nome da ferramenta usado na mensagem do sistema do AI Agent.

> **💡 Importante**  
> Escolha um nome claro e descrição para a ferramenta; isso melhora significativamente as chances do LLM usá-la corretamente.

![Configurando a ferramenta de web scraping Browserless usando o nó HTTP Tool](/images/blog/agente-ia-n8n/browserless-scraping-tool.png)
*Configurando a ferramenta de web scraping Browserless usando o nó HTTP Tool*

Configure o nó como na imagem acima:

- **Method**: _POST_
- **URL**: Digite seu endpoint da API Browserless para scraping de conteúdo
- **Authentication**: Configure se necessário pela sua configuração Browserless  
- **Body**: _Using JSON Below_
- **JSON**: Forneça o payload JSON que o Browserless espera. Use um placeholder para a URL que o agente fornecerá:

```json
{
  "url": "{url}",
  "gotoOptions": {
    "waitUntil": "networkidle0"
  }
}
```

- **Placeholder Definitions**: Defina os placeholders usados no corpo JSON.
  - Clique **Add Definition**
  - **Placeholder Name**: _url_ (deve corresponder ao nome do placeholder no corpo JSON e ao nome do parâmetro esperado pelo AI Agent)
  - **Description**: Forneça uma descrição clara para a IA (ex: "a URL do site para fazer scraping")
  - **Type**: _String_

Finalmente, conecte o nó HTTP Request Tool (website_scraper) à entrada Tool do nó AI Agent.

### Passo 5: Defina a Ferramenta Salvar no Notion

Em seguida, configure a ferramenta para salvar as informações coletadas e resumidas em seu banco de dados Notion.

![Configurando o nó Notion Tool](/images/blog/agente-ia-n8n/notion-tool-config.png)
*Configurando o nó Notion Tool*

Adicione um [nó Notion Tool](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.notion) ao canvas e renomeie-o para _save_to_notion_, novamente correspondendo ao nome da ferramenta da mensagem do sistema. Então, defina a **Tool Description** como _Manually_ e forneça uma descrição (ex: "save_to_notion: Esta ferramenta salva as informações no banco de dados Notion.").

Para autenticar no Notion, selecione suas credenciais da API Notion configuradas. **Resource** deve ser definido como _Database Page_ e **Operation** como _Create._

Selecione seu banco de dados Notion de destino (ex: "Knowledge Database"). Certifique-se de que a integração n8n tenha acesso a este banco de dados e que contenha as propriedades necessárias (Nome, URL, Descrição, Tags, etc., conforme definido na sua configuração). A seção **Properties** é onde você mapeia os dados gerados pelo AI Agent (baseado nos parâmetros definidos no Passo 3) para os campos do seu banco de dados Notion. Para cada propriedade (ex: "Title", "Description", "URL", "Tags", "Publication Date", "Icon"), use a expressão `{{ $fromAI('parameterName', 'Description', 'type') }}`. Substitua `parameterName` pelo nome exato do parâmetro que você definiu na mensagem do sistema do AI Agent. Exemplo para "Title": `{{ $fromAI('title', 'O título original do artigo', 'string') }}`.

Aqui está como este banco de dados Notion específico está estruturado:

![Estrutura do banco de dados Notion](/images/blog/agente-ia-n8n/notion-database-structure.png)
*Estrutura do banco de dados Notion*

![Configure os campos gerados por IA para a página do banco de dados Notion](/images/blog/agente-ia-n8n/ai-generated-fields-notion.png)
*Configure os campos gerados por IA para a página do banco de dados Notion*

Como um toque visual útil, vamos solicitar que o agente de IA selecione um emoji adequado para cada página:

![Use IA para escolher um emoji ícone para o artigo](/images/blog/agente-ia-n8n/emoji-icon-selection.png)
*Use IA para escolher um emoji ícone para o artigo*

### Passo 6: Defina a Ferramenta de Notificação Discord

Para garantir que o agente de IA possa reportar a conclusão de sua tarefa, vamos equipá-lo com uma ferramenta para enviar mensagens Discord. Isso permite que o próprio agente decida quando e como notificá-lo baseado em suas instruções e no resultado de suas tarefas.

![Configurando as notificações Discord do AI Agent](/images/blog/agente-ia-n8n/discord-notifications-config.png)
*Configurando as notificações Discord do AI Agent*

Adicione um nó Discord Tool, nomeie-o "discord_notification" e selecione suas credenciais Discord Webhook ou Bot. Selecione _Send a Message_ no dropdown **Operation**. Aqui vamos solicitar que o agente de IA crie a mensagem de notificação, por exemplo: `{{ $fromAI('Message', 'Confirmação de que a pesquisa foi feita junto com a URL para a página notion onde a pesquisa está agora disponível.', 'string') }}`. E opcionalmente no campo **Embeds**, podemos incorporar um link para uma notificação mais rica incluindo o título e URL para a página Notion recém-criada.

### Passo 7: Teste e Refine seu Agente de IA

> **💡 Dica Importante**  
> Construir agentes de IA é um processo iterativo. Testar completamente e refinar suas instruções são fundamentais para alcançar desempenho confiável.

Certifique-se de salvar o workflow e envie uma mensagem de chat contendo uma URL que você quer pesquisar. Observe a execução do workflow na UI do n8n verificando a entrada/saída de cada nó, especialmente o nó AI Agent, para ver como ele processa a solicitação e quais ferramentas decide chamar.

![Testando o agente de IA usando a UI do n8n](/images/blog/agente-ia-n8n/testing-ai-agent.png)
*Testando o agente de IA usando a UI do n8n*

Verifique que:
- O site foi coletado corretamente
- Uma nova página foi criada em seu banco de dados Notion com o conteúdo e resumo esperados  
- Você recebeu uma notificação no Discord

![Notificação Discord enviada pelo agente de IA](/images/blog/agente-ia-n8n/discord-notification.png)
*Notificação Discord enviada pelo agente de IA*

Se o agente não performar como esperado, verifique cada nó e saída da ferramenta, procurando por raciocínio ou quaisquer erros na chamada de ferramenta. Modifique as instruções na **System Message**, torne as instruções mais claras, adicione restrições ou refine as definições de parâmetros. Então salve e teste novamente até que o Agente de Pesquisa de IA execute confiavelmente as tarefas desejadas de scraping, resumo, salvamento e notificação.

---

## Exercícios Práticos

### Exercício 1: Personalizando o Agente
**Dificuldade:** Iniciante  
**Tempo Estimado:** 20 minutos

Modifique o agente para:
- Adicionar uma ferramenta de análise de sentimento
- Incluir um resumo executivo de 3 pontos
- Categorizar automaticamente o conteúdo por tópicos

### Exercício 2: Integração Multi-Plataforma
**Dificuldade:** Intermediário  
**Tempo Estimado:** 45 minutos

Expanda o agente para:
- Salvar também no Google Sheets
- Enviar por email um relatório formatado
- Postar um resumo no LinkedIn

### Exercício 3: Agente de Monitoramento
**Dificuldade:** Avançado  
**Tempo Estimado:** 60 minutos

Crie um agente que:
- Monitore RSS feeds de blogs técnicos
- Filtre por palavras-chave relevantes
- Compile um boletim semanal automaticamente

---

## Glossário Técnico

**Agente de IA**: Sistema autônomo que percebe seu ambiente, toma decisões e executa ações para alcançar objetivos específicos.

**LLM (Large Language Model)**: Modelo de inteligência artificial treinado em grandes quantidades de texto para entender e gerar linguagem natural.

**RAG (Retrieval-Augmented Generation)**: Técnica que combina recuperação de informações com geração de texto para respostas mais precisas.

**Workflow**: Sequência automatizada de tarefas e decisões que define como um processo é executado.

**API (Application Programming Interface)**: Conjunto de regras e protocolos que permite que diferentes softwares se comuniquem.

**Web Scraping**: Técnica para extrair dados de páginas web de forma automatizada.

**Webhook**: Método para uma aplicação fornecer informações em tempo real para outras aplicações.

**No-Code**: Abordagem de desenvolvimento que permite criar aplicações sem escrever código tradicional.

---

## Conclusão

Neste artigo, exploramos os componentes centrais de agentes de IA (como eles percebem, decidem, agem e lembram) e as principais maneiras de arquitetá-los: codificação do zero, uso de frameworks ou uso de ferramentas visuais como n8n.

Nosso exemplo de agente de pesquisa mostrou como o n8n torna direto criar agentes poderosos. Ao conectar LLMs com diferentes ferramentas visualmente, você pode construir sistemas que agem inteligentemente para você. A boa integração de ferramentas é vital para agentes, e o n8n torna isso fácil.

Os agentes de IA estão mudando rapidamente, oferecendo novas maneiras de automatizar tarefas e personalizar experiências. Esperamos que este guia tenha esclarecido os fundamentos e o encoraje a tentar construir seus próprios agentes com n8n.

### Crie seu Primeiro Agente de IA

Use o poder da flexibilidade do n8n para customizar cada passo

**[Template de Workflow Gratuito](https://n8n.io/workflows/3535-ai-agent-scrape-summarize-and-save-articles-to-notion-gemini-browserless/)**

## Próximos Passos

Agora que você tem um entendimento sólido de agentes de IA e como começar a construí-los com n8n, você pode experimentar com diferentes LLMs, tentar construir agentes para novos casos de uso e conectar-se com a comunidade n8n para compartilhar suas criações e aprender com outros!

Você também pode mergulhar mais fundo e explorar mais recursos da comunidade:

- Veja como outros estão construindo com n8n neste [vídeo do YouTube](https://www.youtube.com/watch?v=XVO3zsHdvio)
- Leia mais no blog n8n:
  - Aprenda sobre construir [workflows agnéticos de IA](https://blog.n8n.io/ai-agentic-workflows/)
  - Descubra mais sobre [automação de workflow de IA](https://blog.n8n.io/ai-workflow-automation/)
- Inspire-se ou encontre um ponto de partida navegando pelos [workflows de IA compartilhados pela comunidade n8n](https://n8n.io/workflows/categories/ai/)

Boa automação!

---

## Recursos Adicionais

### Templates e Exemplos
- [Template Oficial do Agente de Pesquisa](https://n8n.io/workflows/3535-ai-agent-scrape-summarize-and-save-articles-to-notion-gemini-browserless/)
- [Coleção de Workflows de IA](https://n8n.io/workflows/categories/ai/)
- [Documentação Oficial n8n](https://docs.n8n.io/advanced-ai/)

### Leitura Complementar
- [10 Melhores Agentes de IA que Realmente Funcionam](https://blog.n8n.io/best-ai-agents/)
- [7 Melhores Construtores de Agentes de IA](https://blog.n8n.io/best-ai-agent-builders/)
- [Análise de Sentimento de IA com n8n](https://blog.n8n.io/ai-sentiment-analysis/)

### Comunidade e Suporte  
- [Fórum da Comunidade n8n](https://community.n8n.io/)
- [GitHub do n8n](https://github.com/n8n-io/n8n)
- [Canal do Discord](https://discord.gg/n8n)

---

*Artigo traduzido e adaptado do blog oficial n8n para o contexto educacional brasileiro. Texto original por Mihai Farcas.*