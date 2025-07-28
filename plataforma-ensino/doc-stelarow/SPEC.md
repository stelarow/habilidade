# ESPECIFICAÇÃO GHERKIN - BLOG PÚBLICO NO SITE PRINCIPAL

## Funcionalidade: Sistema de Blog Público Integrado
**Contexto**: Como parte da estratégia de marketing digital da Escola Habilidade, precisamos implementar um blog público no site principal (React/Vite) que consuma conteúdo gerenciado através da plataforma de ensino (Next.js/Supabase). O blog deve ser otimizado para SEO, gerar tráfego orgânico e converter visitantes em leads qualificados para os cursos.

---

## EPIC 1: BACKEND E GESTÃO DE CONTEÚDO

### Funcionalidade: API de Blog na Plataforma de Ensino
**Contexto**: Estabelecer endpoints na plataforma de ensino para fornecer dados do blog ao site principal.

**Cenário**: Criação de endpoints públicos para artigos
* **Dado** que a plataforma de ensino está configurada com Supabase
* **Quando** implemento os endpoints de API em `/api/blog/`
* **Então** devo ter um endpoint GET `/api/blog/posts` que retorna lista paginada de artigos publicados
* **E** devo ter um endpoint GET `/api/blog/posts/[slug]` que retorna artigo específico
* **E** devo ter um endpoint GET `/api/blog/categories` que retorna todas as categorias
* **E** devo ter um endpoint GET `/api/blog/posts/category/[slug]` que retorna artigos por categoria
* **E** todos os endpoints devem retornar apenas artigos com status "published"

**Cenário**: Configuração de CORS para comunicação cross-origin
* **Dado** que o site principal está em domínio diferente da plataforma
* **Quando** configuro os headers CORS nos endpoints da API
* **Então** o site principal deve poder fazer requisições aos endpoints do blog
* **E** as requisições devem incluir headers apropriados para cache
* **E** deve haver proteção contra requisições maliciosas

**Cenário**: Otimização de performance da API
* **Dado** que os endpoints do blog serão consumidos externamente
* **Quando** implemento cache e otimizações
* **Então** as respostas devem incluir headers de cache apropriados
* **E** as consultas ao banco devem ser otimizadas com índices
* **E** o tempo de resposta deve ser inferior a 200ms

### Funcionalidade: Painel Administrativo na Plataforma
**Contexto**: Permitir que administradores gerenciem o conteúdo do blog através da plataforma de ensino.

**Cenário**: Interface de gestão de blog no admin
* **Dado** que sou um administrador logado na plataforma de ensino
* **Quando** acesso a seção `/admin/blog`
* **Então** devo ver uma interface para gerenciar artigos do blog
* **E** devo poder criar, editar, publicar e despublicar artigos
* **E** devo poder gerenciar categorias e tags
* **E** devo ter prévia de como o artigo aparecerá no site principal

**Cenário**: Editor de conteúdo com foco em SEO
* **Dado** que estou criando um novo artigo
* **Quando** preencho o formulário de criação
* **Então** devo ter campos específicos para SEO: título SEO, meta description, slug personalizado
* **E** devo ter um editor rich text ou Markdown para o conteúdo
* **E** devo poder associar o artigo a cursos específicos para CTAs direcionados
* **E** devo poder definir imagem destacada otimizada para redes sociais

**Cenário**: Sistema de revisão e publicação
* **Dado** que criei um artigo em modo rascunho
* **Quando** marco o artigo como "pronto para publicação"
* **Então** o artigo deve ficar disponível imediatamente na API pública
* **E** devo poder agendar publicação para data/hora específica
* **E** devo poder despublicar artigos já publicados

---

## EPIC 2: FRONTEND NO SITE PRINCIPAL

### Funcionalidade: Páginas de Blog no Site Principal
**Contexto**: Implementar as páginas do blog no site principal (React/Vite) consumindo a API da plataforma.

**Cenário**: Página de listagem de artigos `/blog`
* **Dado** que o site principal está rodando
* **Quando** acesso a rota `/blog`
* **Então** devo ver uma página listando artigos publicados ordenados por data
* **E** cada artigo deve mostrar título, resumo, imagem destacada, categoria e data
* **E** deve haver paginação para navegar entre páginas de artigos
* **E** a página deve ser otimizada para SEO com meta tags apropriadas

**Cenário**: Página de artigo individual `/blog/[slug]`
* **Dado** que existe um artigo publicado
* **Quando** acesso `/blog/[slug-do-artigo]`
* **Então** devo ver o artigo completo formatado
* **E** devo ver título, conteúdo, imagem destacada, autor e data de publicação
* **E** deve haver breadcrumbs mostrando "Início > Blog > [Título do Artigo]"
* **E** deve haver CTA relacionado ao final do artigo
* **E** deve haver botões de compartilhamento social

**Cenário**: Página de categoria `/blog/categoria/[slug]`
* **Dado** que existem artigos em uma categoria específica
* **Quando** acesso `/blog/categoria/[slug-categoria]`
* **Então** devo ver apenas artigos desta categoria
* **E** o título da página deve indicar a categoria
* **E** deve haver descrição da categoria se disponível
* **E** deve manter paginação e filtros apropriados

### Funcionalidade: Integração com Design System do Site Principal
**Contexto**: Garantir que o blog mantenha a identidade visual e componentes do site principal.

**Cenário**: Consistência visual com o site principal
* **Dado** que estou navegando no blog
* **Quando** vejo qualquer página do blog
* **Então** o header e footer devem ser idênticos ao resto do site
* **E** as cores, tipografias e espaçamentos devem seguir o design system
* **E** os componentes de botão, cards e forms devem ser reutilizados
* **E** a navegação deve incluir link ativo para "Blog" no menu principal

**Cenário**: Responsividade em dispositivos móveis
* **Dado** que estou acessando o blog em dispositivo móvel
* **Quando** navego pelas páginas do blog
* **Então** o layout deve se adaptar perfeitamente à tela pequena
* **E** o conteúdo deve permanecer legível sem zoom horizontal
* **E** os botões e links devem ter tamanho apropriado para touch
* **E** as imagens devem ser carregadas em resolução otimizada

**Cenário**: Performance e otimização de assets
* **Dado** que o blog está integrado ao site principal
* **Quando** carrego qualquer página do blog
* **Então** as imagens devem ser lazy-loaded quando possível
* **E** o código JavaScript deve ser code-split por rota
* **E** os assets CSS devem ser minificados e combinados
* **E** deve haver cache adequado para conteúdo estático

### Funcionalidade: SEO e Otimização para Motores de Busca
**Contexto**: Maximizar a visibilidade do blog nos motores de busca para gerar tráfego orgânico qualificado.

**Cenário**: Meta tags dinâmicas por artigo
* **Dado** que um artigo foi publicado
* **Quando** os motores de busca indexam a página do artigo
* **Então** o título da página deve usar o título SEO configurado no admin
* **E** a meta description deve usar a descrição SEO configurada
* **E** deve haver Open Graph tags para compartilhamento social
* **E** deve haver Twitter Card tags apropriadas
* **E** deve haver schema markup para Article

**Cenário**: URLs amigáveis e estrutura de navegação
* **Dado** que estou configurando as rotas do blog
* **Quando** defino a estrutura de URLs
* **Então** os artigos devem ter URLs no formato `/blog/slug-do-artigo`
* **E** as categorias devem ter URLs no formato `/blog/categoria/slug-categoria`
* **E** deve haver sitemap.xml incluindo todas as páginas do blog
* **E** deve haver navegação breadcrumb clara em todas as páginas

**Cenário**: Otimização de performance para Core Web Vitals
* **Dado** que o blog precisa ter boa performance para SEO
* **Quando** meço as métricas de performance
* **Então** o Largest Contentful Paint (LCP) deve ser inferior a 2.5s
* **E** o First Input Delay (FID) deve ser inferior a 100ms
* **E** o Cumulative Layout Shift (CLS) deve ser inferior a 0.1
* **E** todas as imagens devem ter atributos alt apropriados

---

## EPIC 3: CONVERSÃO E GERAÇÃO DE LEADS

### Funcionalidade: Sistema de Call-to-Actions Contextuais
**Contexto**: Converter o tráfego do blog em leads qualificados direcionando visitantes para cursos relevantes.

**Cenário**: CTA específico por artigo
* **Dado** que um artigo foi configurado com CTA para curso específico
* **Quando** leio o artigo até o final
* **Então** devo ver um componente CTA destacado visualmente
* **E** o CTA deve mostrar o curso relacionado com imagem, título e descrição breve
* **E** deve haver botão "Saiba Mais" direcionando para a página do curso no site principal
* **E** o CTA deve incluir elementos de urgência ou valor quando apropriado

**Cenário**: CTA genérico quando não há curso específico
* **Dado** que um artigo não possui curso específico associado
* **Quando** leio o artigo até o final
* **Então** devo ver um CTA genérico promovendo a escola
* **E** deve direcionar para a página principal de cursos `/cursos`
* **E** deve incluir mensagem como "Explore nossos cursos e transforme sua carreira"
* **E** deve haver botão de ação principal chamativo

**Cenário**: CTAs no meio do conteúdo
* **Dado** que um artigo é longo (mais de 1000 palavras)
* **Quando** estou lendo o conteúdo
* **Então** pode haver CTAs discretos no meio do texto
* **E** estes CTAs devem ser menos invasivos que o CTA principal
* **E** devem oferecer recursos gratuitos como e-books ou webinars
* **E** não devem interromper excessivamente a experiência de leitura

### Funcionalidade: Integração com WhatsApp e Canais de Contato
**Contexto**: Facilitar o contato direto de interessados que chegaram através do blog.

**Cenário**: Botão de WhatsApp flutuante
* **Dado** que estou lendo um artigo no blog
* **Quando** a página carrega completamente
* **Então** devo ver um botão flutuante do WhatsApp no canto da tela
* **E** ao clicar deve abrir conversa pré-formatada mencionando o artigo que estava lendo
* **E** a mensagem deve incluir "Olá! Vi o artigo sobre [título] e gostaria de saber mais sobre os cursos"
* **E** o botão deve ser discreto mas sempre visível

**Cenário**: Links de contato no final dos artigos
* **Dado** que termino de ler um artigo
* **Quando** chego ao final da página
* **Então** além do CTA principal, deve haver seção de contato
* **E** deve incluir telefone, e-mail e link para WhatsApp
* **E** deve mencionar que a equipe está disponível para esclarecer dúvidas
* **E** deve ter design consistente com o restante do site

### Funcionalidade: Rastreamento e Analytics
**Contexto**: Medir a efetividade do blog na geração de tráfego e conversão de leads.

**Cenário**: Integração com Google Analytics
* **Dado** que o site principal já tem Google Analytics configurado
* **Quando** implemento o blog
* **Então** todas as páginas do blog devem ser rastreadas
* **E** deve haver eventos personalizados para cliques em CTAs
* **E** deve haver rastreamento de tempo de permanência por artigo
* **E** deve haver goals configurados para conversões vindas do blog

**Cenário**: Métricas específicas do blog
* **Dado** que o blog está em funcionamento
* **Quando** analiso as métricas no painel administrativo
* **Então** devo poder ver artigos mais lidos
* **E** devo poder ver taxa de conversão por artigo
* **E** devo poder ver origem do tráfego (orgânico, redes sociais, direto)
* **E** devo poder ver quais CTAs têm melhor performance

---

## EPIC 4: PERFORMANCE E MANUTENÇÃO

### Funcionalidade: Cache e Otimização de Performance
**Contexto**: Garantir que o blog tenha performance excelente mesmo com crescimento do conteúdo.

**Cenário**: Sistema de cache inteligente
* **Dado** que o blog consome API externa da plataforma
* **Quando** implemento o sistema de cache
* **Então** as listagens de artigos devem ser cacheadas por 5 minutos
* **E** o conteúdo de artigos individuais deve ser cacheado por 1 hora
* **E** deve haver invalidação automática quando artigo é atualizado na plataforma
* **E** deve haver fallback para conteúdo cacheado em caso de falha da API

**Cenário**: Otimização de imagens
* **Dado** que os artigos contêm imagens
* **Quando** as páginas são carregadas
* **Então** as imagens devem ser servidas em formato WebP quando suportado
* **E** deve haver múltiplos tamanhos de imagem para diferentes dispositivos
* **E** as imagens devem ter carregamento lazy por padrão
* **E** deve haver placeholder durante o carregamento

**Cenário**: Build e deploy otimizado
* **Dado** que o blog é parte do site principal Vite
* **Quando** faço build para produção
* **Então** as páginas do blog devem ser pré-renderizadas quando possível
* **E** o JavaScript do blog deve ser code-split em chunks separados
* **E** deve haver compressão gzip/brotli para todos os assets
* **E** deve haver hash nos nomes de arquivo para cache busting

### Funcionalidade: Monitoramento e Manutenção
**Contexto**: Garantir que o blog funcione de forma confiável e identificar problemas rapidamente.

**Cenário**: Monitoramento de disponibilidade da API
* **Dado** que o blog depende da API da plataforma
* **Quando** implemento monitoramento
* **Então** deve haver verificação automática a cada 5 minutos da disponibilidade da API
* **E** deve haver alertas quando a API não responde em 3 segundos
* **E** deve haver página de status mostrando saúde dos serviços
* **E** deve haver graceful degradation quando API está indisponível

**Cenário**: Logs e debugging
* **Dado** que preciso debugar problemas no blog
* **Quando** ocorrem erros
* **Então** deve haver logging detalhado de erros de API
* **E** deve haver rastreamento de performance das páginas
* **E** deve haver alertas para erros 404 frequentes
* **E** deve haver dashboard com métricas principais do blog

**Cenário**: Backup e recuperação de conteúdo
* **Dado** que o conteúdo é gerenciado na plataforma Supabase
* **Quando** configuro backup
* **Então** deve haver backup automático diário do banco de dados
* **E** deve haver backup das imagens no Supabase Storage
* **E** deve haver procedimento documentado para restaurar conteúdo
* **E** deve haver teste regular do processo de backup/restore

---

## REQUISITOS TÉCNICOS E ARQUITETURAIS

### Funcionalidade: Integração entre Aplicações
**Contexto**: Garantir comunicação eficiente e confiável entre site principal (React/Vite) e plataforma (Next.js/Supabase).

**Cenário**: Configuração de ambientes
* **Dado** que tenho dois projetos separados
* **Quando** configuro as variáveis de ambiente
* **Então** o site principal deve ter URL da API da plataforma configurada
* **E** deve haver configuração separada para desenvolvimento, staging e produção
* **E** deve haver fallback para URLs de API em caso de falha
* **E** todas as chaves de API devem ser criptografadas

**Cenário**: Versionamento e compatibilidade da API
* **Dado** que a API do blog pode evoluir
* **Quando** implemento versionamento
* **Então** a API deve incluir versionamento no header ou URL
* **E** deve haver backward compatibility por pelo menos 2 versões
* **E** deve haver documentação clara das mudanças de versão
* **E** o site principal deve ser capaz de lidar com diferentes versões

**Cenário**: Tratamento de erros entre aplicações
* **Dado** que podem ocorrer falhas na comunicação
* **Quando** a API da plataforma não responde
* **Então** o site principal deve mostrar conteúdo em cache
* **E** deve haver mensagem discreta sobre possível desatualização
* **E** deve haver retry automático com backoff exponencial
* **E** deve haver logs detalhados para debug

### Funcionalidade: Segurança e Proteção
**Contexto**: Garantir que a comunicação entre aplicações seja segura e protegida contra ataques.

**Cenário**: Autenticação de API para requests públicos
* **Dado** que o site principal faz requests para a plataforma
* **Quando** configuro autenticação
* **Então** deve haver rate limiting por IP para requests de blog
* **E** deve haver validação de referer para requests vindos do site principal
* **E** deve haver proteção contra ataques DDOS
* **E** deve haver logs de requests suspeitos

**Cenário**: Sanitização de conteúdo
* **Dado** que o conteúdo é criado na plataforma e exibido no site principal
* **Quando** processo o conteúdo
* **Então** todo HTML deve ser sanitizado para prevenir XSS
* **E** deve haver validação de tipos de arquivo de imagem
* **E** deve haver escape apropriado de caracteres especiais
* **E** deve haver validação de URLs em links

**Cenário**: Proteção de dados sensíveis
* **Dado** que dados transitam entre aplicações
* **Quando** implemento segurança
* **Então** todas as comunicações devem usar HTTPS
* **E** não deve haver exposição de dados internos na API pública
* **E** deve haver headers de segurança apropriados (CORS, CSP)
* **E** deve haver auditoria de acesso aos endpoints

### Funcionalidade: Escalabilidade e Performance
**Contexto**: Preparar o sistema para crescimento futuro em tráfego e conteúdo.

**Cenário**: Cache distribuído e CDN
* **Dado** que o blog pode receber muito tráfego
* **Quando** implemento infraestrutura de cache
* **Então** deve haver CDN para servir imagens otimizadas
* **E** deve haver cache de API em múltiplas camadas
* **E** deve haver invalidação inteligente de cache
* **E** deve haver métricas de hit rate do cache

**Cenário**: Otimização de banco de dados
* **Dado** que o volume de conteúdo pode crescer
* **Quando** configuro o banco de dados
* **Então** deve haver índices otimizados para queries de blog
* **E** deve haver paginação eficiente para grandes volumes
* **E** deve haver archiving de conteúdo muito antigo
* **E** deve haver monitoramento de performance de queries

**Cenário**: Preparação para alta concorrência
* **Dado** que artigos podem viralizar
* **Quando** recebo picos de tráfego
* **Então** a API deve suportar pelo menos 1000 req/min
* **E** deve haver auto-scaling da infraestrutura quando possível
* **E** deve haver graceful degradation em caso de sobrecarga
* **E** deve haver alertas para picos de tráfego anômalos