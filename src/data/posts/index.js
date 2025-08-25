// Agregador de posts do blog para otimização de code splitting
// Este arquivo consolida todos os posts em um único bundle

// Importar todos os posts de forma estática
import post10DicasEspecialistas from './10-dicas-especialistas-renderizacoes-enscape-destaque.json';
import post10ExtensoesSketchup from './10-extensoes-sketchup-arquitetos.json';
import post5RazoesExcel from './5-razoes-organizacoes-investir-treinamento-excel.json';
import postAcelerandoWorkflow from './acelerando-workflow-grey-boxing-sketchup.json';
import postCincoManeiras from './cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas.json';
import postComoApresentar from './como-apresentar-projetos-design-interior-sketchup.json';
import postComoConstruir from './como-construir-seu-primeiro-agente-ia-n8n.json';
import postComoUsarSketchup from './como-usar-sketchup-para-design-conceitual-arquitetonico.json';
import postDesignEspacos from './design-espacos-varejo-sketchup-pro.json';
import postDominandoShape from './dominando-shape-bender-curvando-geometrias-sketchup.json';
import postEditorMateriais from './editor-materiais-sketchup-realismo-enscape.json';
import postGuiaCompleto21 from './guia-completo-21-estilos-decoracao-transformar-casa.json';
import postGuiaCompletoEnscape from './guia-completo-enscape-sketchup-iniciantes.json';
import postHistoriaSketchup from './historia-sketchup-software-arquitetura.json';
import postOQueESketchup from './o-que-e-sketchup-guia-completo-modelagem-3d-2025.json';
import postPorQueEnscape from './por-que-enscape-essencial-visualizacao-arquitetonica.json';
import postSketchup2025 from './sketchup-2025-visualizacao-3d-materiais-fotorrealistas.json';
import postSketchupArquitetura from './sketchup-arquitetura-paisagistica.json';
import postSketchupWorkflows from './sketchup-workflows-avancados-arquitetura-paisagistica.json';
import postTiposPuxadores from './tipos-puxadores-moveis.json';
import postTransformeDados from './transforme-dados-em-decisoes-estrategicas-dashboards-empresariais.json';

// Mapa de posts organizado por slug para acesso O(1)
export const BLOG_POSTS = {
  '10-dicas-especialistas-renderizacoes-enscape-destaque': post10DicasEspecialistas,
  '10-extensoes-sketchup-arquitetos': post10ExtensoesSketchup,
  '5-razoes-organizacoes-investir-treinamento-excel': post5RazoesExcel,
  'acelerando-workflow-grey-boxing-sketchup': postAcelerandoWorkflow,
  'cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas': postCincoManeiras,
  'como-apresentar-projetos-design-interior-sketchup': postComoApresentar,
  'como-construir-seu-primeiro-agente-ia-n8n': postComoConstruir,
  'como-usar-sketchup-para-design-conceitual-arquitetonico': postComoUsarSketchup,
  'design-espacos-varejo-sketchup-pro': postDesignEspacos,
  'dominando-shape-bender-curvando-geometrias-sketchup': postDominandoShape,
  'editor-materiais-sketchup-realismo-enscape': postEditorMateriais,
  'guia-completo-21-estilos-decoracao-transformar-casa': postGuiaCompleto21,
  'guia-completo-enscape-sketchup-iniciantes': postGuiaCompletoEnscape,
  'historia-sketchup-software-arquitetura': postHistoriaSketchup,
  'o-que-e-sketchup-guia-completo-modelagem-3d-2025': postOQueESketchup,
  'por-que-enscape-essencial-visualizacao-arquitetonica': postPorQueEnscape,
  'sketchup-2025-visualizacao-3d-materiais-fotorrealistas': postSketchup2025,
  'sketchup-arquitetura-paisagistica': postSketchupArquitetura,
  'sketchup-workflows-avancados-arquitetura-paisagistica': postSketchupWorkflows,
  'tipos-puxadores-moveis': postTiposPuxadores,
  'transforme-dados-em-decisoes-estrategicas-dashboards-empresariais': postTransformeDados
};

// Lista de slugs para compatibilidade com código existente
export const BLOG_SLUGS = Object.keys(BLOG_POSTS);

// Função para buscar post por slug
export const getPostBySlug = (slug) => {
  return BLOG_POSTS[slug] || null;
};

// Função para buscar todos os posts
export const getAllPosts = () => {
  return Object.values(BLOG_POSTS);
};

// Função para buscar posts por categoria
export const getPostsByCategory = (categorySlug) => {
  return Object.values(BLOG_POSTS).filter(postData => {
    const post = postData.post || postData;
    return post.category?.slug === categorySlug;
  });
};

// Export default para compatibilidade
export default BLOG_POSTS;