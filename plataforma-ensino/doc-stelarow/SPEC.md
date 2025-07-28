# ESPECIFICA��O GHERKIN - BLOG P�BLICO NO SITE PRINCIPAL

## Funcionalidade: Sistema de Blog P�blico Integrado
**Contexto**: Como parte da estrat�gia de marketing digital da Escola Habilidade, precisamos implementar um blog p�blico no site principal (React/Vite) que consuma conte�do gerenciado atrav�s da plataforma de ensino (Next.js/Supabase). O blog deve ser otimizado para SEO, gerar tr�fego org�nico e converter visitantes em leads qualificados para os cursos.

---

## EPIC 1: BACKEND E GEST�O DE CONTE�DO

### Funcionalidade: API de Blog na Plataforma de Ensino
**Contexto**: Estabelecer endpoints na plataforma de ensino para fornecer dados do blog ao site principal.

**Cen�rio**: Cria��o de endpoints p�blicos para artigos
* **Dado** que a plataforma de ensino est� configurada com Supabase
* **Quando** implemento os endpoints de API em `/api/blog/`
* **Ent�o** devo ter um endpoint GET `/api/blog/posts` que retorna lista paginada de artigos publicados
* **E** devo ter um endpoint GET `/api/blog/posts/[slug]` que retorna artigo espec�fico
* **E** devo ter um endpoint GET `/api/blog/categories` que retorna todas as categorias
* **E** devo ter um endpoint GET `/api/blog/posts/category/[slug]` que retorna artigos por categoria
* **E** todos os endpoints devem retornar apenas artigos com status "published"

**Cen�rio**: Configura��o de CORS para comunica��o cross-origin
* **Dado** que o site principal est� em dom�nio diferente da plataforma
* **Quando** configuro os headers CORS nos endpoints da API
* **Ent�o** o site principal deve poder fazer requisi��es aos endpoints do blog
* **E** as requisi��es devem incluir headers apropriados para cache
* **E** deve haver prote��o contra requisi��es maliciosas

**Cen�rio**: Otimiza��o de performance da API
* **Dado** que os endpoints do blog ser�o consumidos externamente
* **Quando** implemento cache e otimiza��es
* **Ent�o** as respostas devem incluir headers de cache apropriados
* **E** as consultas ao banco devem ser otimizadas com �ndices
* **E** o tempo de resposta deve ser inferior a 200ms

### Funcionalidade: Painel Administrativo na Plataforma
**Contexto**: Permitir que administradores gerenciem o conte�do do blog atrav�s da plataforma de ensino.

**Cen�rio**: Interface de gest�o de blog no admin
* **Dado** que sou um administrador logado na plataforma de ensino
* **Quando** acesso a se��o `/admin/blog`
* **Ent�o** devo ver uma interface para gerenciar artigos do blog
* **E** devo poder criar, editar, publicar e despublicar artigos
* **E** devo poder gerenciar categorias e tags
* **E** devo ter pr�via de como o artigo aparecer� no site principal

**Cen�rio**: Editor de conte�do com foco em SEO
* **Dado** que estou criando um novo artigo
* **Quando** preencho o formul�rio de cria��o
* **Ent�o** devo ter campos espec�ficos para SEO: t�tulo SEO, meta description, slug personalizado
* **E** devo ter um editor rich text ou Markdown para o conte�do
* **E** devo poder associar o artigo a cursos espec�ficos para CTAs direcionados
* **E** devo poder definir imagem destacada otimizada para redes sociais

**Cen�rio**: Sistema de revis�o e publica��o
* **Dado** que criei um artigo em modo rascunho
* **Quando** marco o artigo como "pronto para publica��o"
* **Ent�o** o artigo deve ficar dispon�vel imediatamente na API p�blica
* **E** devo poder agendar publica��o para data/hora espec�fica
* **E** devo poder despublicar artigos j� publicados

---

## EPIC 2: FRONTEND NO SITE PRINCIPAL

### Funcionalidade: P�ginas de Blog no Site Principal
**Contexto**: Implementar as p�ginas do blog no site principal (React/Vite) consumindo a API da plataforma.

**Cen�rio**: P�gina de listagem de artigos `/blog`
* **Dado** que o site principal est� rodando
* **Quando** acesso a rota `/blog`
* **Ent�o** devo ver uma p�gina listando artigos publicados ordenados por data
* **E** cada artigo deve mostrar t�tulo, resumo, imagem destacada, categoria e data
* **E** deve haver pagina��o para navegar entre p�ginas de artigos
* **E** a p�gina deve ser otimizada para SEO com meta tags apropriadas

**Cen�rio**: P�gina de artigo individual `/blog/[slug]`
* **Dado** que existe um artigo publicado
* **Quando** acesso `/blog/[slug-do-artigo]`
* **Ent�o** devo ver o artigo completo formatado
* **E** devo ver t�tulo, conte�do, imagem destacada, autor e data de publica��o
* **E** deve haver breadcrumbs mostrando "In�cio > Blog > [T�tulo do Artigo]"
* **E** deve haver CTA relacionado ao final do artigo
* **E** deve haver bot�es de compartilhamento social

**Cen�rio**: P�gina de categoria `/blog/categoria/[slug]`
* **Dado** que existem artigos em uma categoria espec�fica
* **Quando** acesso `/blog/categoria/[slug-categoria]`
* **Ent�o** devo ver apenas artigos desta categoria
* **E** o t�tulo da p�gina deve indicar a categoria
* **E** deve haver descri��o da categoria se dispon�vel
* **E** deve manter pagina��o e filtros apropriados

### Funcionalidade: Integra��o com Design System do Site Principal
**Contexto**: Garantir que o blog mantenha a identidade visual e componentes do site principal.

**Cen�rio**: Consist�ncia visual com o site principal
* **Dado** que estou navegando no blog
* **Quando** vejo qualquer p�gina do blog
* **Ent�o** o header e footer devem ser id�nticos ao resto do site
* **E** as cores, tipografias e espa�amentos devem seguir o design system
* **E** os componentes de bot�o, cards e forms devem ser reutilizados
* **E** a navega��o deve incluir link ativo para "Blog" no menu principal

**Cen�rio**: Responsividade em dispositivos m�veis
* **Dado** que estou acessando o blog em dispositivo m�vel
* **Quando** navego pelas p�ginas do blog
* **Ent�o** o layout deve se adaptar perfeitamente � tela pequena
* **E** o conte�do deve permanecer leg�vel sem zoom horizontal
* **E** os bot�es e links devem ter tamanho apropriado para touch
* **E** as imagens devem ser carregadas em resolu��o otimizada

**Cen�rio**: Performance e otimiza��o de assets
* **Dado** que o blog est� integrado ao site principal
* **Quando** carrego qualquer p�gina do blog
* **Ent�o** as imagens devem ser lazy-loaded quando poss�vel
* **E** o c�digo JavaScript deve ser code-split por rota
* **E** os assets CSS devem ser minificados e combinados
* **E** deve haver cache adequado para conte�do est�tico

### Funcionalidade: SEO e Otimiza��o para Motores de Busca
**Contexto**: Maximizar a visibilidade do blog nos motores de busca para gerar tr�fego org�nico qualificado.

**Cen�rio**: Meta tags din�micas por artigo
* **Dado** que um artigo foi publicado
* **Quando** os motores de busca indexam a p�gina do artigo
* **Ent�o** o t�tulo da p�gina deve usar o t�tulo SEO configurado no admin
* **E** a meta description deve usar a descri��o SEO configurada
* **E** deve haver Open Graph tags para compartilhamento social
* **E** deve haver Twitter Card tags apropriadas
* **E** deve haver schema markup para Article

**Cen�rio**: URLs amig�veis e estrutura de navega��o
* **Dado** que estou configurando as rotas do blog
* **Quando** defino a estrutura de URLs
* **Ent�o** os artigos devem ter URLs no formato `/blog/slug-do-artigo`
* **E** as categorias devem ter URLs no formato `/blog/categoria/slug-categoria`
* **E** deve haver sitemap.xml incluindo todas as p�ginas do blog
* **E** deve haver navega��o breadcrumb clara em todas as p�ginas

**Cen�rio**: Otimiza��o de performance para Core Web Vitals
* **Dado** que o blog precisa ter boa performance para SEO
* **Quando** me�o as m�tricas de performance
* **Ent�o** o Largest Contentful Paint (LCP) deve ser inferior a 2.5s
* **E** o First Input Delay (FID) deve ser inferior a 100ms
* **E** o Cumulative Layout Shift (CLS) deve ser inferior a 0.1
* **E** todas as imagens devem ter atributos alt apropriados

---

## EPIC 3: CONVERS�O E GERA��O DE LEADS

### Funcionalidade: Sistema de Call-to-Actions Contextuais
**Contexto**: Converter o tr�fego do blog em leads qualificados direcionando visitantes para cursos relevantes.

**Cen�rio**: CTA espec�fico por artigo
* **Dado** que um artigo foi configurado com CTA para curso espec�fico
* **Quando** leio o artigo at� o final
* **Ent�o** devo ver um componente CTA destacado visualmente
* **E** o CTA deve mostrar o curso relacionado com imagem, t�tulo e descri��o breve
* **E** deve haver bot�o "Saiba Mais" direcionando para a p�gina do curso no site principal
* **E** o CTA deve incluir elementos de urg�ncia ou valor quando apropriado

**Cen�rio**: CTA gen�rico quando n�o h� curso espec�fico
* **Dado** que um artigo n�o possui curso espec�fico associado
* **Quando** leio o artigo at� o final
* **Ent�o** devo ver um CTA gen�rico promovendo a escola
* **E** deve direcionar para a p�gina principal de cursos `/cursos`
* **E** deve incluir mensagem como "Explore nossos cursos e transforme sua carreira"
* **E** deve haver bot�o de a��o principal chamativo

**Cen�rio**: CTAs no meio do conte�do
* **Dado** que um artigo � longo (mais de 1000 palavras)
* **Quando** estou lendo o conte�do
* **Ent�o** pode haver CTAs discretos no meio do texto
* **E** estes CTAs devem ser menos invasivos que o CTA principal
* **E** devem oferecer recursos gratuitos como e-books ou webinars
* **E** n�o devem interromper excessivamente a experi�ncia de leitura

### Funcionalidade: Integra��o com WhatsApp e Canais de Contato
**Contexto**: Facilitar o contato direto de interessados que chegaram atrav�s do blog.

**Cen�rio**: Bot�o de WhatsApp flutuante
* **Dado** que estou lendo um artigo no blog
* **Quando** a p�gina carrega completamente
* **Ent�o** devo ver um bot�o flutuante do WhatsApp no canto da tela
* **E** ao clicar deve abrir conversa pr�-formatada mencionando o artigo que estava lendo
* **E** a mensagem deve incluir "Ol�! Vi o artigo sobre [t�tulo] e gostaria de saber mais sobre os cursos"
* **E** o bot�o deve ser discreto mas sempre vis�vel

**Cen�rio**: Links de contato no final dos artigos
* **Dado** que termino de ler um artigo
* **Quando** chego ao final da p�gina
* **Ent�o** al�m do CTA principal, deve haver se��o de contato
* **E** deve incluir telefone, e-mail e link para WhatsApp
* **E** deve mencionar que a equipe est� dispon�vel para esclarecer d�vidas
* **E** deve ter design consistente com o restante do site

### Funcionalidade: Rastreamento e Analytics
**Contexto**: Medir a efetividade do blog na gera��o de tr�fego e convers�o de leads.

**Cen�rio**: Integra��o com Google Analytics
* **Dado** que o site principal j� tem Google Analytics configurado
* **Quando** implemento o blog
* **Ent�o** todas as p�ginas do blog devem ser rastreadas
* **E** deve haver eventos personalizados para cliques em CTAs
* **E** deve haver rastreamento de tempo de perman�ncia por artigo
* **E** deve haver goals configurados para convers�es vindas do blog

**Cen�rio**: M�tricas espec�ficas do blog
* **Dado** que o blog est� em funcionamento
* **Quando** analiso as m�tricas no painel administrativo
* **Ent�o** devo poder ver artigos mais lidos
* **E** devo poder ver taxa de convers�o por artigo
* **E** devo poder ver origem do tr�fego (org�nico, redes sociais, direto)
* **E** devo poder ver quais CTAs t�m melhor performance

---

## EPIC 4: PERFORMANCE E MANUTEN��O

### Funcionalidade: Cache e Otimiza��o de Performance
**Contexto**: Garantir que o blog tenha performance excelente mesmo com crescimento do conte�do.

**Cen�rio**: Sistema de cache inteligente
* **Dado** que o blog consome API externa da plataforma
* **Quando** implemento o sistema de cache
* **Ent�o** as listagens de artigos devem ser cacheadas por 5 minutos
* **E** o conte�do de artigos individuais deve ser cacheado por 1 hora
* **E** deve haver invalida��o autom�tica quando artigo � atualizado na plataforma
* **E** deve haver fallback para conte�do cacheado em caso de falha da API

**Cen�rio**: Otimiza��o de imagens
* **Dado** que os artigos cont�m imagens
* **Quando** as p�ginas s�o carregadas
* **Ent�o** as imagens devem ser servidas em formato WebP quando suportado
* **E** deve haver m�ltiplos tamanhos de imagem para diferentes dispositivos
* **E** as imagens devem ter carregamento lazy por padr�o
* **E** deve haver placeholder durante o carregamento

**Cen�rio**: Build e deploy otimizado
* **Dado** que o blog � parte do site principal Vite
* **Quando** fa�o build para produ��o
* **Ent�o** as p�ginas do blog devem ser pr�-renderizadas quando poss�vel
* **E** o JavaScript do blog deve ser code-split em chunks separados
* **E** deve haver compress�o gzip/brotli para todos os assets
* **E** deve haver hash nos nomes de arquivo para cache busting

### Funcionalidade: Monitoramento e Manuten��o
**Contexto**: Garantir que o blog funcione de forma confi�vel e identificar problemas rapidamente.

**Cen�rio**: Monitoramento de disponibilidade da API
* **Dado** que o blog depende da API da plataforma
* **Quando** implemento monitoramento
* **Ent�o** deve haver verifica��o autom�tica a cada 5 minutos da disponibilidade da API
* **E** deve haver alertas quando a API n�o responde em 3 segundos
* **E** deve haver p�gina de status mostrando sa�de dos servi�os
* **E** deve haver graceful degradation quando API est� indispon�vel

**Cen�rio**: Logs e debugging
* **Dado** que preciso debugar problemas no blog
* **Quando** ocorrem erros
* **Ent�o** deve haver logging detalhado de erros de API
* **E** deve haver rastreamento de performance das p�ginas
* **E** deve haver alertas para erros 404 frequentes
* **E** deve haver dashboard com m�tricas principais do blog

**Cen�rio**: Backup e recupera��o de conte�do
* **Dado** que o conte�do � gerenciado na plataforma Supabase
* **Quando** configuro backup
* **Ent�o** deve haver backup autom�tico di�rio do banco de dados
* **E** deve haver backup das imagens no Supabase Storage
* **E** deve haver procedimento documentado para restaurar conte�do
* **E** deve haver teste regular do processo de backup/restore

---

## REQUISITOS T�CNICOS E ARQUITETURAIS

### Funcionalidade: Integra��o entre Aplica��es
**Contexto**: Garantir comunica��o eficiente e confi�vel entre site principal (React/Vite) e plataforma (Next.js/Supabase).

**Cen�rio**: Configura��o de ambientes
* **Dado** que tenho dois projetos separados
* **Quando** configuro as vari�veis de ambiente
* **Ent�o** o site principal deve ter URL da API da plataforma configurada
* **E** deve haver configura��o separada para desenvolvimento, staging e produ��o
* **E** deve haver fallback para URLs de API em caso de falha
* **E** todas as chaves de API devem ser criptografadas

**Cen�rio**: Versionamento e compatibilidade da API
* **Dado** que a API do blog pode evoluir
* **Quando** implemento versionamento
* **Ent�o** a API deve incluir versionamento no header ou URL
* **E** deve haver backward compatibility por pelo menos 2 vers�es
* **E** deve haver documenta��o clara das mudan�as de vers�o
* **E** o site principal deve ser capaz de lidar com diferentes vers�es

**Cen�rio**: Tratamento de erros entre aplica��es
* **Dado** que podem ocorrer falhas na comunica��o
* **Quando** a API da plataforma n�o responde
* **Ent�o** o site principal deve mostrar conte�do em cache
* **E** deve haver mensagem discreta sobre poss�vel desatualiza��o
* **E** deve haver retry autom�tico com backoff exponencial
* **E** deve haver logs detalhados para debug

### Funcionalidade: Seguran�a e Prote��o
**Contexto**: Garantir que a comunica��o entre aplica��es seja segura e protegida contra ataques.

**Cen�rio**: Autentica��o de API para requests p�blicos
* **Dado** que o site principal faz requests para a plataforma
* **Quando** configuro autentica��o
* **Ent�o** deve haver rate limiting por IP para requests de blog
* **E** deve haver valida��o de referer para requests vindos do site principal
* **E** deve haver prote��o contra ataques DDOS
* **E** deve haver logs de requests suspeitos

**Cen�rio**: Sanitiza��o de conte�do
* **Dado** que o conte�do � criado na plataforma e exibido no site principal
* **Quando** processo o conte�do
* **Ent�o** todo HTML deve ser sanitizado para prevenir XSS
* **E** deve haver valida��o de tipos de arquivo de imagem
* **E** deve haver escape apropriado de caracteres especiais
* **E** deve haver valida��o de URLs em links

**Cen�rio**: Prote��o de dados sens�veis
* **Dado** que dados transitam entre aplica��es
* **Quando** implemento seguran�a
* **Ent�o** todas as comunica��es devem usar HTTPS
* **E** n�o deve haver exposi��o de dados internos na API p�blica
* **E** deve haver headers de seguran�a apropriados (CORS, CSP)
* **E** deve haver auditoria de acesso aos endpoints

### Funcionalidade: Escalabilidade e Performance
**Contexto**: Preparar o sistema para crescimento futuro em tr�fego e conte�do.

**Cen�rio**: Cache distribu�do e CDN
* **Dado** que o blog pode receber muito tr�fego
* **Quando** implemento infraestrutura de cache
* **Ent�o** deve haver CDN para servir imagens otimizadas
* **E** deve haver cache de API em m�ltiplas camadas
* **E** deve haver invalida��o inteligente de cache
* **E** deve haver m�tricas de hit rate do cache

**Cen�rio**: Otimiza��o de banco de dados
* **Dado** que o volume de conte�do pode crescer
* **Quando** configuro o banco de dados
* **Ent�o** deve haver �ndices otimizados para queries de blog
* **E** deve haver pagina��o eficiente para grandes volumes
* **E** deve haver archiving de conte�do muito antigo
* **E** deve haver monitoramento de performance de queries

**Cen�rio**: Prepara��o para alta concorr�ncia
* **Dado** que artigos podem viralizar
* **Quando** recebo picos de tr�fego
* **Ent�o** a API deve suportar pelo menos 1000 req/min
* **E** deve haver auto-scaling da infraestrutura quando poss�vel
* **E** deve haver graceful degradation em caso de sobrecarga
* **E** deve haver alertas para picos de tr�fego an�malos