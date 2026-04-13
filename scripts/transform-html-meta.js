#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Configuração de meta tags por página
const metaConfig = {
  // Página de Informática
  '/cursos/informatica': {
    title: 'Curso de Informática Presencial São José SC | Excel Avançado e IA',
    description: 'Curso de informática presencial em São José SC. Excel, Word, PowerPoint, Canva e IA. Atendemos Florianópolis, Palhoça e Biguaçu. Certificado 170h.',
    keywords: 'curso informática presencial, curso informática são josé, curso informática florianópolis, curso informática palhoça, curso informática biguaçu, excel avançado, word, powerpoint, inteligência artificial, canva',
    canonical: 'https://www.escolahabilidade.com/cursos/informatica',
    ogImage: 'https://www.escolahabilidade.com/assets/informatica-nova/hero/1318912.png'
  },

  // Página de Projetista 3D
  '/cursos/projetista-3d': {
    title: 'Curso Projetista 3D - SketchUp e Enscape | São José SC | Escola Habilidade',
    description: 'Curso presencial completo de SketchUp e Enscape em São José SC. 56 horas práticas, turmas pequenas de até 4 alunos, certificado nacional. Transforme sua carreira como Projetista 3D.',
    keywords: 'curso sketchup, curso enscape, projetista 3d, são josé sc, florianópolis, curso presencial, certificado, arquitetura, design',
    canonical: 'https://www.escolahabilidade.com/cursos/projetista-3d',
    ogImage: 'https://www.escolahabilidade.com/logo-escola-habilidade.png'
  },

  // Outras páginas de cursos
  '/cursos/design-grafico': {
    title: 'Curso de Design Gráfico | Photoshop, Illustrator, Canva | São José SC',
    description: 'Curso presencial de Design Gráfico em São José SC. Photoshop, Illustrator, Canva e projetos reais. Certificado reconhecido.',
    keywords: 'curso design gráfico, photoshop, illustrator, canva, design são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/design-grafico'
  },

  '/cursos/programacao': {
    title: 'Curso de Programação | Python, JavaScript, React | São José SC',
    description: 'Curso de Programação presencial em São José SC. Python, JavaScript, React e desenvolvimento web. Do básico ao avançado.',
    keywords: 'curso programação, python, javascript, react, desenvolvimento web, programação são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/programacao',
    ogImage: 'https://www.escolahabilidade.com/assets/programacao/og-image-programacao.png'
  },

  '/cursos/marketing-digital': {
    title: 'Curso de Marketing Digital | Google Ads, Facebook Ads, SEO | São José SC',
    description: 'Curso presencial de Marketing Digital em São José SC. Google Ads, Facebook Ads, SEO, Analytics. Certificado reconhecido.',
    keywords: 'curso marketing digital, google ads, facebook ads, seo, marketing são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/marketing-digital'
  },

  '/cursos/inteligencia-artificial': {
    title: 'Curso de Inteligência Artificial | ChatGPT, Automação, IA | São José SC',
    description: 'Curso presencial de Inteligência Artificial em São José SC. ChatGPT, automação, ferramentas de IA para negócios.',
    keywords: 'curso inteligência artificial, chatgpt, automação, ia, inteligência artificial são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/inteligencia-artificial'
  },

  // Páginas locais
  '/cursos-florianopolis': {
    title: 'Cursos Profissionalizantes em Florianópolis - Escola Habilidade',
    description: 'Cursos profissionalizantes presenciais em Florianópolis. Informática, Design, Programação, Marketing Digital. Certificado reconhecido.',
    keywords: 'cursos florianópolis, cursos profissionalizantes florianópolis, escola técnica florianópolis',
    canonical: 'https://www.escolahabilidade.com/cursos-florianopolis'
  },

  '/cursos-sao-jose': {
    title: 'Cursos Profissionalizantes em São José SC - Escola Habilidade',
    description: 'Cursos profissionalizantes presenciais em São José SC. Informática, Design, Programação, Marketing Digital. Localização privilegiada no Kobrasol.',
    keywords: 'cursos são josé, cursos profissionalizantes são josé, escola técnica são josé, cursos kobrasol',
    canonical: 'https://www.escolahabilidade.com/cursos-sao-jose'
  },

  '/cursos-palhoca': {
    title: 'Cursos Profissionalizantes em Palhoça SC - Escola Habilidade',
    description: 'Cursos profissionalizantes para Palhoça SC. Informática, Design, Programação, Marketing Digital. Localização estratégica próxima a Palhoça.',
    keywords: 'cursos palhoça, cursos profissionalizantes palhoça, escola técnica palhoça',
    canonical: 'https://www.escolahabilidade.com/cursos-palhoca'
  },

  // Página inicial
  '/': {
    title: 'Cursos em São José SC | Escola Habilidade - Informática, AutoCAD, SketchUp',
    description: 'Escola de cursos profissionalizantes em São José SC. Informática, AutoCAD, SketchUp, Design, Marketing Digital. Certificado reconhecido. Matrículas abertas!',
    keywords: 'escola habilidade, cursos são josé, cursos profissionalizantes, informática, autocad, sketchup, design, marketing digital',
    canonical: 'https://www.escolahabilidade.com/'
  },

  // Contato
  '/contato': {
    title: 'Contato - Escola Habilidade | Entre em contato conosco',
    description: 'Entre em contato com a Escola Habilidade. Tire suas dúvidas sobre nossos cursos profissionalizantes em Florianópolis, São José e Palhoça. Estamos aqui para ajudar!',
    keywords: 'contato escola habilidade, telefone, whatsapp, endereço são josé',
    canonical: 'https://www.escolahabilidade.com/contato'
  },

  // Blog
  '/blog': {
    title: 'Blog Escola Habilidade | Dicas de Tecnologia, Design e Carreira',
    description: 'Blog com artigos sobre tecnologia, design, programação e desenvolvimento profissional. Tutoriais, dicas e novidades do mercado.',
    keywords: 'blog tecnologia, dicas design, programação, desenvolvimento profissional, tutoriais',
    canonical: 'https://www.escolahabilidade.com/blog'
  },

  // Página Institucional
  '/habilidade': {
    title: 'Sobre a Escola Habilidade | Nossa História e Missão',
    description: 'Conheça a Escola Habilidade, nossa história de mais de 20 anos formando profissionais em tecnologia na Grande Florianópolis.',
    keywords: 'escola habilidade, história, missão, cursos profissionalizantes florianópolis',
    canonical: 'https://www.escolahabilidade.com/habilidade'
  },

  // Teste Vocacional
  '/teste-vocacional': {
    title: 'Teste Vocacional Gratuito | Descubra seu Curso Ideal',
    description: 'Faça nosso teste vocacional gratuito e descubra qual curso técnico combina mais com seu perfil profissional.',
    keywords: 'teste vocacional, orientação profissional, escolha curso, perfil profissional',
    canonical: 'https://www.escolahabilidade.com/teste-vocacional'
  },

  // Cursos adicionais
  '/cursos/administracao': {
    title: 'Curso de Administração | Gestão Empresarial e Excel | São José SC',
    description: 'Curso de Administração presencial em São José SC. Excel avançado, gestão empresarial, finanças. Certificado reconhecido.',
    keywords: 'curso administração, gestão empresarial, excel avançado, finanças, administração são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/administracao'
  },

  '/cursos/business-intelligence': {
    title: 'Curso Business Intelligence | Power BI, Dados e Analytics | São José SC',
    description: 'Curso de Business Intelligence presencial. Power BI, análise de dados, dashboards profissionais. Certificado reconhecido.',
    keywords: 'curso business intelligence, power bi, análise dados, dashboards, bi são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/business-intelligence'
  },

  '/cursos/edicao-video': {
    title: 'Curso de Edição de Vídeo | Premiere, After Effects | São José SC',
    description: 'Curso presencial de Edição de Vídeo. Adobe Premiere, After Effects, produção audiovisual. Certificado reconhecido.',
    keywords: 'curso edição vídeo, premiere, after effects, produção audiovisual, vídeo são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/edicao-video'
  },

  '/cursos/excel-avancado-business-intelligence': {
    title: 'Curso Excel Avançado e Business Intelligence | Power BI | São José SC',
    description: 'Curso presencial de Excel Avançado com Business Intelligence. Dashboards, análise de dados, Power BI. Certificado.',
    keywords: 'excel avançado, business intelligence, power bi, dashboards, excel são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/excel-avancado-business-intelligence'
  },

  '/cursos/sketchup-enscape': {
    title: 'Curso SketchUp e Enscape | Modelagem 3D e Renderização | São José SC',
    description: 'Curso presencial de SketchUp e Enscape. Modelagem 3D, renderização fotorrealista para arquitetura. Certificado.',
    keywords: 'curso sketchup, enscape, modelagem 3d, renderização, arquitetura são josé',
    canonical: 'https://www.escolahabilidade.com/cursos/sketchup-enscape'
  }
};

// Função para transformar HTML
function transformHtml(htmlContent, pagePath) {
  const config = metaConfig[pagePath];
  if (!config) {
    return htmlContent;
  }

  // Definir imagem padrão se não houver
  const defaultOgImage = 'https://www.escolahabilidade.com/logo-escola-habilidade.png';
  if (!config.ogImage) {
    config.ogImage = defaultOgImage;
  }

  let transformedHtml = htmlContent;

  // Substituir title
  const titleRegex = /<title>([^<]*)<\/title>/;
  if (titleRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(titleRegex, `<title>${config.title}</title>`);
  }

  // Substituir ou adicionar meta description
  const descriptionRegex = /<meta name="description" content="[^"]*"/;
  if (descriptionRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(descriptionRegex, `<meta name="description" content="${config.description}"`);
  } else {
    // Adicionar meta description após viewport ou charset se não existir
    const addDescRegex = /(<meta name="viewport"[^>]*>|<meta charset="[^"]*">)/;
    if (addDescRegex.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(addDescRegex, `$1\n    <meta name="description" content="${config.description}" />`);
    }
  }

  // Substituir ou adicionar meta keywords se configurado
  if (config.keywords) {
    const keywordsRegex = /<meta name="keywords" content="[^"]*"/;
    if (keywordsRegex.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(keywordsRegex, `<meta name="keywords" content="${config.keywords}"`);
    } else {
      // Adicionar keywords após description
      const addKeywordsRegex = /(<meta name="description" content="[^"]*"[^>]*>)/;
      if (addKeywordsRegex.test(transformedHtml)) {
        transformedHtml = transformedHtml.replace(addKeywordsRegex, `$1\n    <meta name="keywords" content="${config.keywords}" />`);
      }
    }
  }

  // Adicionar ou atualizar Open Graph tags
  const ogSiteNameRegex = /<meta property="og:site_name"[^>]*>/;
  const insertionPoint = ogSiteNameRegex.test(transformedHtml) ? ogSiteNameRegex : /<meta property="og:locale"[^>]*>/;

  // Open Graph title
  const ogTitleRegex = /<meta property="og:title" content="[^"]*"/;
  transformedHtml = ogTitleRegex.test(transformedHtml) ? transformedHtml.replace(ogTitleRegex, `<meta property="og:title" content="${config.title}"`) : transformedHtml.replace(insertionPoint, `$&\n    <meta property="og:title" content="${config.title}" />`);

  // Open Graph description
  const ogDescRegex = /<meta property="og:description" content="[^"]*"/;
  if (ogDescRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(ogDescRegex, `<meta property="og:description" content="${config.description}"`);
  } else {
    const ogTitleTag = /<meta property="og:title"[^>]*>/;
    transformedHtml = transformedHtml.replace(ogTitleTag, `$&\n    <meta property="og:description" content="${config.description}" />`);
  }

  // Open Graph URL
  const ogUrlRegex = /<meta property="og:url" content="[^"]*"/;
  if (ogUrlRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(ogUrlRegex, `<meta property="og:url" content="${config.canonical}"`);
  } else {
    const ogDescTag = /<meta property="og:description"[^>]*>/;
    transformedHtml = transformedHtml.replace(ogDescTag, `$&\n    <meta property="og:url" content="${config.canonical}" />`);
  }

  // Open Graph image
  if (config.ogImage) {
    const ogImageRegex = /<meta property="og:image" content="[^"]*"/;
    if (ogImageRegex.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(ogImageRegex, `<meta property="og:image" content="${config.ogImage}"`);
    } else {
      const ogUrlTag = /<meta property="og:url"[^>]*>/;
      transformedHtml = transformedHtml.replace(ogUrlTag, `$&\n    <meta property="og:image" content="${config.ogImage}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />`);
    }
  }

  // Atualizar Twitter title se existir, senão adicionar
  const twitterTitleRegex = /<meta name="twitter:title" content="[^"]*"/;
  if (twitterTitleRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(twitterTitleRegex, `<meta name="twitter:title" content="${config.title}"`);
  } else {
    const twitterCardTag = /<meta name="twitter:card"[^>]*>/;
    if (twitterCardTag.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(twitterCardTag, `$&\n    <meta name="twitter:title" content="${config.title}" />`);
    }
  }

  // Atualizar Twitter description se existir, senão adicionar
  const twitterDescRegex = /<meta name="twitter:description" content="[^"]*"/;
  if (twitterDescRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(twitterDescRegex, `<meta name="twitter:description" content="${config.description}"`);
  } else {
    const twitterTitleTag = /<meta name="twitter:title"[^>]*>/;
    if (twitterTitleTag.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(twitterTitleTag, `$&\n    <meta name="twitter:description" content="${config.description}" />`);
    }
  }

  // Twitter image
  if (config.ogImage) {
    const twitterImageRegex = /<meta name="twitter:image" content="[^"]*"/;
    if (twitterImageRegex.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(twitterImageRegex, `<meta name="twitter:image" content="${config.ogImage}"`);
    } else {
      const twitterDescTag = /<meta name="twitter:description"[^>]*>/;
      if (twitterDescTag.test(transformedHtml)) {
        transformedHtml = transformedHtml.replace(twitterDescTag, `$&\n    <meta name="twitter:image" content="${config.ogImage}" />`);
      }
    }
  }

  // Atualizar ou adicionar canonical tag se configurado
  if (config.canonical) {
    const canonicalRegex = /<link rel="canonical" href="[^"]*"[^>]*>/;
    if (canonicalRegex.test(transformedHtml)) {
      transformedHtml = transformedHtml.replace(canonicalRegex, `<link rel="canonical" href="${config.canonical}" />`);
    } else {
      const addCanonicalRegex = /(<meta name="author" content="[^"]*"[^>]*>)/;
      if (addCanonicalRegex.test(transformedHtml)) {
        transformedHtml = transformedHtml.replace(addCanonicalRegex, `$1\n    <link rel="canonical" href="${config.canonical}" />`);
      }
    }
  }

  return transformedHtml;
}

// Função para mapear arquivo para path
function getPagePath(filePath) {
  // Converter caminho do arquivo para path da URL
  let pagePath = filePath
    .replace(/\.html$/, '')
    .replace(/\/index$/, '');

  // Casos especiais
  if (pagePath === '') {
    return '/';
  }

  // Páginas de cursos (remover /cursos/ do path para match com config)
  if (pagePath.startsWith('/cursos/')) {
    return pagePath;
  }

  // Páginas locais
  if (pagePath.includes('cursos-florianopolis')) {
    return '/cursos-florianopolis';
  }
  if (pagePath.includes('cursos-sao-jose')) {
    return '/cursos-sao-jose';
  }
  if (pagePath.includes('cursos-palhoca')) {
    return '/cursos-palhoca';
  }
  if (pagePath.includes('contato')) {
    return '/contato';
  }

  return pagePath;
}

// Função para processar arquivos HTML recursivamente
function processHtmlFiles(dir) {
  const items = readdirSync(dir);
  let processedCount = 0;
  let totalCount = 0;

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const result = processHtmlFiles(fullPath);
      processedCount += result.processed;
      totalCount += result.total;
    } else if (item.endsWith('.html')) {
      totalCount++;
      try {
        const relativePath = fullPath.replace(distDir, '').replaceAll('\\', '/');
        const pagePath = getPagePath(relativePath);

        const originalHtml = readFileSync(fullPath, 'utf-8');
        const transformedHtml = transformHtml(originalHtml, pagePath);

        if (originalHtml !== transformedHtml) {
          writeFileSync(fullPath, transformedHtml, 'utf-8');
          processedCount++;
        }
      } catch (error) {
        console.error(`❌ Erro: ${fullPath}:`, error.message);
      }
    }
  }

  return { processed: processedCount, total: totalCount };
}

// Função principal
export function transformHtmlMeta() {
  try {
    const result = processHtmlFiles(distDir);
    console.log(`🏷️  Meta tags: ${result.processed}/${result.total} updated`);
    return true;
  } catch (error) {
    console.error('❌ Meta tags error:', error.message);
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  transformHtmlMeta();
}