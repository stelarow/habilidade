
# Workflow Editorial do Blog

Este documento descreve o processo para criar, revisar e publicar um novo artigo no blog.

## Papéis

- **Autor:** A pessoa que escreve o conteúdo do artigo.
- **Revisor/Admin:** A pessoa responsável por revisar o conteúdo e publicá-lo.

## Processo

1.  **Criação do Rascunho (`Draft`)
    - O **Autor** acessa a área de administração do blog em `[URL_DA_PLATAFORMA]/admin/blog`.
    - Clica em **"New Post"**.
    - Preenche o título, o conteúdo (usando o editor de texto), e define um `slug` amigável (ex: `como-aprender-react-rapido`).
    - Opcionalmente, adiciona um resumo (`excerpt`), uma imagem de destaque e tags.
    - Salva o post. Neste ponto, o status do post é `draft` e ele não é visível publicamente.

2.  **Revisão (`In Review`)
    - Quando o rascunho está pronto para revisão, o **Autor** muda o status do post para `in_review` e notifica o **Revisor**.
    - O **Revisor** acessa o post no painel de administração.
    - Para visualizar como o post ficará no site, o revisor utiliza a funcionalidade de **Preview**:
        - Abre a URL de preview: `[URL_DA_PLATAFORMA]/blog/preview/[slug-do-post]`.
    - O revisor pode fazer alterações diretamente no post ou deixar comentários para o autor.

3.  **Publicação (`Published`)
    - Uma vez que o post está aprovado, o **Revisor/Admin** muda o status para `published` e salva.
    - Neste momento, o post se torna visível publicamente no site em `[URL_DO_SITE]/blog` e `[URL_DO_SITE]/blog/[slug-do-post]`.
    - O webhook configurado irá revalidar as páginas do blog, garantindo que o novo conteúdo apareça imediatamente.

## Boas Práticas

- **Slugs:** Use slugs curtos, descritivos e em letras minúsculas, separados por hífens.
- **Imagens:** Otimize as imagens antes de fazer o upload para o Supabase Storage para garantir um carregamento rápido.
- **SEO:** Preencha o `excerpt` (resumo) com um texto atrativo, pois ele será usado na meta description para os motores de busca.
