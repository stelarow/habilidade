#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// Configuração de meta tags por página
const metaConfig = {
  // Página de Informática
  '/cursos/informatica': {
    title: 'Curso de Informática Presencial São José SC | Excel Básico ao Avançado, Word, Canva e IA',
    description: 'Curso de informática presencial em São José SC. Excel, Word, PowerPoint, Canva e IA. Atendemos Florianópolis, Palhoça e Biguaçu. Certificado 170h.',
    keywords: 'curso informática presencial, curso informática são josé, curso informática florianópolis, curso informática palhoça, curso informática biguaçu, excel avançado, word, powerpoint, inteligência artificial, canva'
  },

  // Página de Projetista 3D
  '/cursos/projetista-3d': {
    title: 'Curso Projetista 3D - SketchUp e Enscape | São José SC | Escola Habilidade',
    description: 'Curso de Projetista 3D presencial em São José SC. SketchUp, Enscape, renderização profissional. Certificado reconhecido. Atendemos Grande Florianópolis.',
    keywords: 'curso projetista 3d, curso sketchup, curso enscape, renderização 3d, projetista são josé, curso presencial 3d'
  },

  // Outras páginas de cursos
  '/cursos/design-grafico': {
    title: 'Curso de Design Gráfico | Photoshop, Illustrator, Canva | São José SC',
    description: 'Curso presencial de Design Gráfico em São José SC. Photoshop, Illustrator, Canva e projetos reais. Certificado reconhecido.',
    keywords: 'curso design gráfico, photoshop, illustrator, canva, design são josé'
  },

  '/cursos/programacao': {
    title: 'Curso de Programação | Python, JavaScript, React | São José SC',
    description: 'Curso de Programação presencial em São José SC. Python, JavaScript, React e desenvolvimento web. Do básico ao avançado.',
    keywords: 'curso programação, python, javascript, react, desenvolvimento web, programação são josé'
  },

  '/cursos/marketing-digital': {
    title: 'Curso de Marketing Digital | Google Ads, Facebook Ads, SEO | São José SC',
    description: 'Curso presencial de Marketing Digital em São José SC. Google Ads, Facebook Ads, SEO, Analytics. Certificado reconhecido.',
    keywords: 'curso marketing digital, google ads, facebook ads, seo, marketing são josé'
  },

  '/cursos/inteligencia-artificial': {
    title: 'Curso de Inteligência Artificial | ChatGPT, Automação, IA | São José SC',
    description: 'Curso presencial de Inteligência Artificial em São José SC. ChatGPT, automação, ferramentas de IA para negócios.',
    keywords: 'curso inteligência artificial, chatgpt, automação, ia, inteligência artificial são josé'
  },

  // Páginas locais
  '/cursos-florianopolis': {
    title: 'Cursos Profissionalizantes em Florianópolis - Escola Habilidade',
    description: 'Cursos profissionalizantes presenciais em Florianópolis. Informática, Design, Programação, Marketing Digital. Certificado reconhecido.',
    keywords: 'cursos florianópolis, cursos profissionalizantes florianópolis, escola técnica florianópolis'
  },

  '/cursos-sao-jose': {
    title: 'Cursos Profissionalizantes em São José SC - Escola Habilidade',
    description: 'Cursos profissionalizantes presenciais em São José SC. Informática, Design, Programação, Marketing Digital. Localização privilegiada no Kobrasol.',
    keywords: 'cursos são josé, cursos profissionalizantes são josé, escola técnica são josé, cursos kobrasol'
  },

  '/cursos-palhoca': {
    title: 'Cursos Profissionalizantes em Palhoça SC - Escola Habilidade',
    description: 'Cursos profissionalizantes para Palhoça SC. Informática, Design, Programação, Marketing Digital. Localização estratégica próxima a Palhoça.',
    keywords: 'cursos palhoça, cursos profissionalizantes palhoça, escola técnica palhoça'
  },

  // Página inicial
  '/': {
    title: 'Cursos em São José SC | Escola Habilidade - Informática, AutoCAD, SketchUp',
    description: 'Escola de cursos profissionalizantes em São José SC. Informática, AutoCAD, SketchUp, Design, Marketing Digital. Certificado reconhecido. Matrículas abertas!',
    keywords: 'escola habilidade, cursos são josé, cursos profissionalizantes, informática, autocad, sketchup, design, marketing digital'
  },

  // Contato
  '/contato': {
    title: 'Contato - Escola Habilidade | Entre em contato conosco',
    description: 'Entre em contato com a Escola Habilidade. Tire suas dúvidas sobre nossos cursos profissionalizantes em Florianópolis, São José e Palhoça. Estamos aqui para ajudar!',
    keywords: 'contato escola habilidade, telefone, whatsapp, endereço são josé'
  },

  // Blog
  '/blog': {
    title: 'Blog Escola Habilidade | Dicas de Tecnologia, Design e Carreira',
    description: 'Blog com artigos sobre tecnologia, design, programação e desenvolvimento profissional. Tutoriais, dicas e novidades do mercado.',
    keywords: 'blog tecnologia, dicas design, programação, desenvolvimento profissional, tutoriais'
  },

  // Página Institucional
  '/habilidade': {
    title: 'Sobre a Escola Habilidade | Nossa História e Missão',
    description: 'Conheça a Escola Habilidade, nossa história de mais de 20 anos formando profissionais em tecnologia na Grande Florianópolis.',
    keywords: 'escola habilidade, história, missão, cursos profissionalizantes florianópolis'
  },

  // Teste Vocacional
  '/teste-vocacional': {
    title: 'Teste Vocacional Gratuito | Descubra seu Curso Ideal',
    description: 'Faça nosso teste vocacional gratuito e descubra qual curso técnico combina mais com seu perfil profissional.',
    keywords: 'teste vocacional, orientação profissional, escolha curso, perfil profissional'
  },

  // Cursos adicionais
  '/cursos/administracao': {
    title: 'Curso de Administração | Gestão Empresarial e Excel | São José SC',
    description: 'Curso de Administração presencial em São José SC. Excel avançado, gestão empresarial, finanças. Certificado reconhecido.',
    keywords: 'curso administração, gestão empresarial, excel avançado, finanças, administração são josé'
  },

  '/cursos/business-intelligence': {
    title: 'Curso Business Intelligence | Power BI, Dados e Analytics | São José SC',
    description: 'Curso de Business Intelligence presencial. Power BI, análise de dados, dashboards profissionais. Certificado reconhecido.',
    keywords: 'curso business intelligence, power bi, análise dados, dashboards, bi são josé'
  },

  '/cursos/edicao-video': {
    title: 'Curso de Edição de Vídeo | Premiere, After Effects | São José SC',
    description: 'Curso presencial de Edição de Vídeo. Adobe Premiere, After Effects, produção audiovisual. Certificado reconhecido.',
    keywords: 'curso edição vídeo, premiere, after effects, produção audiovisual, vídeo são josé'
  },

  '/cursos/excel-avancado-business-intelligence': {
    title: 'Curso Excel Avançado e Business Intelligence | Power BI | São José SC',
    description: 'Curso presencial de Excel Avançado com Business Intelligence. Dashboards, análise de dados, Power BI. Certificado.',
    keywords: 'excel avançado, business intelligence, power bi, dashboards, excel são josé'
  },

  '/cursos/sketchup-enscape': {
    title: 'Curso SketchUp e Enscape | Modelagem 3D e Renderização | São José SC',
    description: 'Curso presencial de SketchUp e Enscape. Modelagem 3D, renderização fotorrealista para arquitetura. Certificado.',
    keywords: 'curso sketchup, enscape, modelagem 3d, renderização, arquitetura são josé'
  }
};

// Função para transformar HTML
function transformHtml(htmlContent, pagePath) {
  const config = metaConfig[pagePath];
  if (!config) {
    console.log(`⚠️ Nenhuma configuração encontrada para: ${pagePath}`);
    return htmlContent;
  }

  let transformedHtml = htmlContent;

  // Substituir title
  const titleRegex = /<title>([^<]*)<\/title>/;
  if (titleRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(titleRegex, `<title>${config.title}</title>`);
    console.log(`✅ Title atualizado para: ${pagePath}`);
  }

  // Substituir meta description
  const descriptionRegex = /<meta name="description" content="[^"]*"/;
  if (descriptionRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(descriptionRegex, `<meta name="description" content="${config.description}"`);
    console.log(`✅ Meta description atualizada para: ${pagePath}`);
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
    console.log(`✅ Meta keywords atualizada para: ${pagePath}`);
  }

  // Atualizar Open Graph title se existir
  const ogTitleRegex = /<meta property="og:title" content="[^"]*"/;
  if (ogTitleRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(ogTitleRegex, `<meta property="og:title" content="${config.title}"`);
  }

  // Atualizar Open Graph description se existir
  const ogDescRegex = /<meta property="og:description" content="[^"]*"/;
  if (ogDescRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(ogDescRegex, `<meta property="og:description" content="${config.description}"`);
  }

  // Atualizar Twitter title se existir
  const twitterTitleRegex = /<meta name="twitter:title" content="[^"]*"/;
  if (twitterTitleRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(twitterTitleRegex, `<meta name="twitter:title" content="${config.title}"`);
  }

  // Atualizar Twitter description se existir
  const twitterDescRegex = /<meta name="twitter:description" content="[^"]*"/;
  if (twitterDescRegex.test(transformedHtml)) {
    transformedHtml = transformedHtml.replace(twitterDescRegex, `<meta name="twitter:description" content="${config.description}"`);
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

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursivo para subdiretórios
      processedCount += processHtmlFiles(fullPath);
    } else if (item.endsWith('.html')) {
      try {
        // Calcular path relativo para mapeamento
        const relativePath = fullPath.replace(distDir, '').replace(/\\/g, '/');
        const pagePath = getPagePath(relativePath);

        console.log(`🔍 Processando: ${relativePath} -> ${pagePath}`);

        // Ler, transformar e escrever
        const originalHtml = readFileSync(fullPath, 'utf-8');
        const transformedHtml = transformHtml(originalHtml, pagePath);

        if (originalHtml !== transformedHtml) {
          writeFileSync(fullPath, transformedHtml, 'utf-8');
          processedCount++;
          console.log(`✅ Transformado: ${relativePath}`);
        } else {
          console.log(`⚪ Sem alterações: ${relativePath}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${fullPath}:`, error.message);
      }
    }
  }

  return processedCount;
}

// Função principal
export function transformHtmlMeta() {
  console.log('🎨 Iniciando transformação de meta tags HTML...');
  console.log(`📁 Diretório: ${distDir}`);

  try {
    const processedCount = processHtmlFiles(distDir);
    console.log(`✅ Transformação concluída! ${processedCount} arquivos processados.`);
    return true;
  } catch (error) {
    console.error('❌ Erro durante transformação:', error.message);
    return false;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  transformHtmlMeta();
}