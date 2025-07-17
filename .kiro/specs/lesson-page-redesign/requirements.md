# Requirements Document

## Introduction

Esta especificação define a refatoração completa da página de aulas da plataforma de ensino, focando na melhoria da experiência do usuário através da remoção da sidebar, redesign do header com elementos de progresso integrados, melhoria da qualidade dos ícones, correção do player de vídeo e funcionalidade do questionário.

## Requirements

### Requirement 1

**User Story:** Como um estudante, eu quero uma interface de aula mais limpa e focada, para que eu possa me concentrar melhor no conteúdo sem distrações da sidebar.

#### Acceptance Criteria

1. WHEN o usuário acessa uma página de aula THEN o sistema SHALL remover completamente a sidebar atual
2. WHEN a sidebar for removida THEN o conteúdo principal SHALL ocupar toda a largura disponível da tela
3. WHEN o layout for reorganizado THEN todos os elementos da sidebar SHALL ser integrados ao header ou removidos conforme apropriado

### Requirement 2

**User Story:** Como um estudante, eu quero um header moderno e informativo baseado no design da página inicial, para que eu tenha acesso rápido às informações de progresso e navegação.

#### Acceptance Criteria

1. WHEN o usuário visualiza o header THEN o sistema SHALL exibir o logo da Escola Habilidade
2. WHEN o usuário visualiza o header THEN o sistema SHALL exibir um botão para sair da aula que retorna à página do curso
3. WHEN o usuário visualiza o header THEN o sistema SHALL exibir o progresso geral da aula em porcentagem
4. WHEN o usuário visualiza o header THEN o sistema SHALL exibir o progresso do tempo da aula (25 min padrão)
5. WHEN o usuário visualiza o header THEN o sistema SHALL exibir o progresso da leitura do PDF
6. WHEN o usuário visualiza o header THEN o sistema SHALL exibir o progresso do envio dos exercícios
7. WHEN o usuário visualiza o header THEN o sistema SHALL exibir a nota do teste (aprovado com no mínimo 70%)
8. WHEN todos os critérios de conclusão forem atendidos THEN o sistema SHALL mostrar o botão de concluir aula
9. WHEN o usuário faz scroll na página THEN o header SHALL acompanhar o movimento de scroll (não fixo no topo)
10. WHEN o header acompanha o scroll THEN o sistema SHALL manter o mesmo comportamento do header da página inicial da Escola Habilidade

### Requirement 3

**User Story:** Como um estudante, eu quero ícones de alta qualidade consistentes com o design da página inicial, para que a interface tenha uma aparência profissional e coesa.

#### Acceptance Criteria

1. WHEN o usuário visualiza ícones na página de aula THEN o sistema SHALL usar ícones da biblioteca Phosphor React com peso "duotone"
2. WHEN ícones forem exibidos THEN o sistema SHALL aplicar cores consistentes com a paleta da marca (#d400ff, #00c4ff, #a000ff)
3. WHEN ícones forem exibidos THEN o sistema SHALL usar tamanhos apropriados (16px, 20px, 24px, 32px) conforme o contexto
4. WHEN ícones forem usados THEN o sistema SHALL manter consistência visual com os ícones dos cards de cursos da página inicial
5. WHEN indicadores de progresso forem exibidos THEN as bordas ao redor dos ícones e porcentagens SHALL caber completamente dentro do header
6. WHEN indicadores de progresso forem exibidos THEN o sistema SHALL usar o mesmo tamanho e qualidade dos ícones dos cards de cursos da página inicial
7. WHEN bordas dos indicadores forem renderizadas THEN elas SHALL ter proporções adequadas e não sair para fora do header

### Requirement 4

**User Story:** Como um estudante, eu quero um player de vídeo funcional, para que eu possa assistir ao conteúdo da aula sem erros.

#### Acceptance Criteria

1. WHEN uma aula possui video_url THEN o sistema SHALL exibir um player de vídeo funcional
2. WHEN o player de vídeo for carregado THEN o sistema SHALL NOT exibir a mensagem "Player de vídeo será integrado aqui"
3. WHEN o vídeo for reproduzido THEN o sistema SHALL rastrear o progresso de visualização
4. WHEN o vídeo for reproduzido THEN o sistema SHALL atualizar o tempo assistido para os critérios de conclusão

### Requirement 5

**User Story:** Como um estudante, eu quero iniciar questionários funcionais, para que eu possa completar as avaliações necessárias da aula.

#### Acceptance Criteria

1. WHEN o usuário clica no botão "Iniciar Questionário" THEN o sistema SHALL abrir a interface do questionário
2. WHEN o questionário for iniciado THEN o sistema SHALL exibir as perguntas do quiz
3. WHEN o usuário completar o questionário THEN o sistema SHALL calcular e armazenar a pontuação
4. WHEN a pontuação for >= 70% THEN o sistema SHALL marcar o critério de quiz como concluído
5. WHEN o questionário for concluído THEN o sistema SHALL atualizar o progresso geral da aula

### Requirement 6

**User Story:** Como um estudante, eu quero um sistema de progresso visual claro, para que eu possa entender facilmente o que preciso completar para finalizar a aula.

#### Acceptance Criteria

1. WHEN o usuário visualiza o progresso THEN o sistema SHALL exibir indicadores visuais para cada critério (tempo, PDF, exercícios, quiz)
2. WHEN um critério for completado THEN o sistema SHALL marcar visualmente como concluído com cor verde
3. WHEN critérios estiverem pendentes THEN o sistema SHALL exibir o progresso parcial com cores apropriadas
4. WHEN todos os critérios forem atendidos THEN o sistema SHALL habilitar o botão de conclusão da aula
5. WHEN o progresso for atualizado THEN o sistema SHALL usar animações suaves para transições visuais

### Requirement 7

**User Story:** Como um desenvolvedor, eu quero utilizar MCPs (Model Context Protocol) para acessar documentação e componentes de UI durante o desenvolvimento, para que eu possa implementar soluções mais eficientes e consistentes.

#### Acceptance Criteria

1. WHEN implementando componentes de UI THEN o sistema SHALL usar Context7 MCP para acessar documentação do Next.js, React e Tailwind CSS
2. WHEN criando elementos visuais THEN o sistema SHALL usar MagicUI MCP para acessar componentes de animação e efeitos especiais
3. WHEN implementando indicadores de progresso THEN o sistema SHALL consultar MagicUI para componentes de progress bars e circular progress
4. WHEN implementando animações de transição THEN o sistema SHALL usar MagicUI para efeitos de fade, slide e scale
5. WHEN resolvendo problemas técnicos THEN o sistema SHALL consultar Context7 para documentação oficial das tecnologias utilizadas