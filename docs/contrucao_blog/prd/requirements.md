# Requirements

## Functional
FR1: O sistema deve fornecer uma interface de autoria para criar, editar, publicar e despublicar artigos de blog.

FR2: Os artigos devem suportar formatação de texto rica através de Markdown, incluindo títulos, listas, links e blocos de código.

FR3: O sistema deve permitir o upload e a inserção de imagens e outras mídias nos artigos.

FR4: Os artigos publicados devem ser visíveis publicamente em páginas web responsivas e otimizadas para leitura.

FR5: O sistema deve permitir a organização de artigos através de um sistema de Categorias e Tags.

FR6: Devem existir páginas de listagem que exibam todos os artigos pertencentes a uma Categoria ou Tag específica.

FR7: O sistema deve fornecer uma funcionalidade de pesquisa interna que retorne uma lista de artigos relevantes para um termo de busca.

FR8: Os artigos devem incluir campos para metadados de SEO (meta-título, meta-descrição, slug editável) e implementar schema markup para rich snippets.

FR9: Os artigos devem poder conter "Call-to-Actions" (CTAs) contextuais que direcionem os leitores para os cursos relevantes na plataforma principal.

FR10: Utilizadores com os papéis de "instrutor" ou "administrador" na plataforma principal devem ter permissão para aceder à interface de autoria do blog usando a mesma sessão de login.

## Non-Functional
NFR1: O blog deve ser construído usando a stack tecnológica definida: Next.js 14, TypeScript e Supabase.

NFR2: O código do blog deve residir dentro do monorepo existente da plataforma Stelarow.

NFR3: O tempo de First Contentful Paint (FCP) para as páginas de artigos deve ser inferior a 2 segundos em conexões de banda larga.

NFR4: A interface do blog deve ser totalmente responsiva, adaptando-se a desktops, tablets e dispositivos móveis.

NFR5: O sistema de autenticação e autorização deve ser o mesmo da plataforma Stelarow, utilizando a instância do Supabase existente.

NFR6: As políticas de segurança da plataforma principal devem ser aplicadas ao blog (validação de entrada, proteção contra XSS, etc.).