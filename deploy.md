# Guia de Deploy da Plataforma de Ensino

Este documento detalha o processo para implantar a aplicação da **plataforma de ensino** (localizada no diretório `/plataforma-ensino`) em um ambiente de produção/teste, utilizando um subdomínio como `plataforma.escolahabilidade.com`.

## Visão Geral

- **Aplicação:** O projeto em `/plataforma-ensino` é uma aplicação Next.js.
- **Hospedagem:** A recomendação principal é a **Vercel**, por ser a criadora do Next.js e oferecer a melhor performance e experiência de desenvolvimento.
- **Domínio:** O DNS é gerenciado na **HostGator**. Configuraremos um subdomínio para a plataforma.
- **Repositório:** O deploy será feito a partir do seu repositório no GitHub.

---

## Passo 1: Deploy na Vercel (Recomendado)

A Vercel oferece um processo de deploy otimizado para Next.js, com configuração quase zero.

### 1.1. Crie uma Conta e Importe o Projeto

1.  **Crie uma conta** na [Vercel](https://vercel.com/) utilizando sua conta do GitHub. Isso simplificará o acesso aos seus repositórios.
2.  No seu dashboard, clique em **"Add New..." -> "Project"**.
3.  **Importe o repositório do GitHub** que contém este projeto.

### 1.2. Configure o Projeto

A Vercel é inteligente e detectará que você está usando um monorepo (um repositório com múltiplos projetos). Ela permitirá que você especifique o diretório raiz do projeto Next.js.

1.  **Selecione a Raiz do Projeto:** Quando a Vercel perguntar pelo **Root Directory**, selecione a pasta `plataforma-ensino`.
    ![Configuração da Vercel](https://vercel.com/docs/images/monorepo-configuration.png)
    *A Vercel deve detectar automaticamente que é um projeto Next.js e pré-configurar os comandos de build e o diretório de saída.* 

2.  **Configure as Variáveis de Ambiente:**
    - O projeto contém um arquivo `.env.example`. Isso indica que variáveis de ambiente são necessárias para a aplicação funcionar.
    - Vá para a aba **"Settings" -> "Environment Variables"** do seu novo projeto na Vercel.
    - Adicione todas as variáveis listadas no `.env.example` (como `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.) com seus valores de produção.

3.  **Clique em "Deploy"**.

Após alguns minutos, a Vercel concluirá o build e fornecerá uma URL de deploy padrão (ex: `nome-do-projeto.vercel.app`). Teste essa URL para garantir que a aplicação está funcionando.

---

## Passo 2: Configurar o Subdomínio na HostGator

Após o deploy bem-sucedido na Vercel, vamos apontar `plataforma.escolahabilidade.com` para a aplicação.

### 2.1. Adicione o Domínio na Vercel

1.  No dashboard do seu projeto na Vercel, vá para **"Settings" -> "Domains"**.
2.  Digite o subdomínio `plataforma.escolahabilidade.com` e clique em **"Add"**.
3.  A Vercel fornecerá as instruções de configuração. Ela pedirá para você criar um registro **CNAME**.

### 2.2. Crie o Registro CNAME na HostGator

1.  Acesse o painel de controle da **HostGator**.
2.  Procure pela seção de **"Editor de Zona DNS"** ou similar.
3.  Selecione o domínio `escolahabilidade.com`.
4.  Clique em **"Adicionar um Registro"** e escolha o tipo **CNAME**.
5.  Preencha os campos:
    - **Nome (ou Host):** `plataforma` (a HostGator completará o resto do domínio).
    - **Aponta para (ou Valor):** Cole o valor fornecido pela Vercel. Geralmente é `cname.vercel-dns.com`.
    - **TTL (Time To Live):** Deixe o valor padrão (ex: 14400).

6.  **Salve o registro.**

**Atenção:** A propagação do DNS pode levar de alguns minutos a algumas horas. A Vercel automaticamente detectará a mudança e emitirá um certificado SSL para o seu subdomínio.

---

## Alternativa: Deploy na Netlify

Se preferir manter a consistência com o site principal (`www`), você também pode usar a Netlify.

1.  **Crie um novo site** na Netlify a partir do mesmo repositório do GitHub.
2.  **Configure o Build:**
    - **Base directory:** `plataforma-ensino`
    - **Build command:** `next build`
    - **Publish directory:** `.next`
3.  **Configure as Variáveis de Ambiente** nas configurações do site, assim como faria na Vercel.
4.  **Configure o Subdomínio:** O processo de adicionar um subdomínio na Netlify e criar o registro CNAME na HostGator é muito similar ao da Vercel.

## Passo 3: Checklist Pós-Deploy

- [ ] Acessar `plataforma.escolahabilidade.com` e verificar se a aplicação carrega.
- [ ] Testar as funcionalidades principais que dependem das variáveis de ambiente (ex: conexão com o Supabase).
- [ ] Verificar se não há erros de console no navegador.
- [ ] Realizar um teste de login ou cadastro para garantir que a integração com o banco de dados está funcionando.
