# Technical Assumptions

Repository Structure: Monorepo.

Service Architecture: Módulo monolítico (blog) dentro de uma arquitetura de monorepo, compartilhando utilitários e tipos com os outros módulos (plataforma, marketing-site).

Testing Requirements: A estratégia de testes deve incluir testes unitários para a lógica de negócio e componentes, e testes de integração para as interações com a base de dados e APIs.

Additional Technical Assumptions and Requests:

Linguagem/Framework: Next.js 14 com App Router, TypeScript.

Base de Dados/Autenticação: Supabase (instância existente).

Hosting/Infrastructure: Vercel.