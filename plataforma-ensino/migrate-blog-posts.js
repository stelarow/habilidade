const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Chave de service role para operações administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Importar dados mockados
const { mockPosts } = require('./src/services/blogMockData.js');

// Mapear categorias por slug para UUID
const categoryMapping = {
  'tecnologia': '2f7b81ef-6562-4efd-9cf5-6594c4577d0c',
  'educacao': 'b7eda7e6-1fe1-45bf-90cf-82237d52b24a',
  'carreira': 'f1f06ac7-4c0d-4376-8994-c49b9fba349c',
  'programacao': 'a573ba54-bfcd-400f-99a5-1eb3b3204d40',
  'design': 'ba436fab-36f9-426f-ab09-0e777ed2d682',
  'arquitetura': '6f44d898-ec31-4b11-bb4d-4ba5c8c65c64'
};

// ID do autor padrão
const authorId = '875fdd01-2ad5-4018-9d9d-c6cf55c75ae9';

// Função para mapear categoria ID para UUID
function getCategoryUUID(categoryId) {
  const categoryMap = {
    1: 'tecnologia',
    2: 'educacao', 
    3: 'carreira',
    4: 'programacao',
    5: 'design',
    6: 'arquitetura'
  };
  
  const slug = categoryMap[categoryId];
  return categoryMapping[slug];
}

// Função para gerar datas realísticas
function generateRealisticDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90); // Últimos 90 dias
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

// Função principal de migração
async function migrateBlogPosts() {
  try {
    console.log('🚀 Iniciando migração dos posts do blog...');
    
    // Filtrar apenas posts que não existem no Supabase
    const { data: existingPosts } = await supabase
      .from('blog_posts')
      .select('slug');
    
    const existingSlugs = existingPosts?.map(p => p.slug) || [];
    const postsToMigrate = mockPosts.filter(post => !existingSlugs.includes(post.slug));
    
    console.log(`📊 Posts encontrados: ${mockPosts.length}`);
    console.log(`📊 Posts existentes: ${existingSlugs.length}`);
    console.log(`📊 Posts para migrar: ${postsToMigrate.length}`);
    
    if (postsToMigrate.length === 0) {
      console.log('✅ Todos os posts já estão migrados!');
      return;
    }
    
    // Preparar dados para inserção
    const postsForInsertion = postsToMigrate.map(post => {
      const publishedAt = generateRealisticDate();
      
      return {
        id: uuidv4(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content || `<p>${post.excerpt}</p>`, // Fallback se não tiver conteúdo
        category_id: getCategoryUUID(post.category?.id || 6), // Default: Arquitetura
        author_id: authorId,
        image_url: post.imageUrl || `/images/blog/${post.slug}/cover.jpg`,
        reading_time: post.readingTime || Math.ceil(post.excerpt.length / 200), // Estimativa
        views: 0,
        published_at: publishedAt,
        created_at: publishedAt,
        updated_at: publishedAt,
        seo_title: post.title,
        seo_description: post.excerpt,
        og_image: null,
        canonical_url: `https://escolahabilidade.com.br/blog/${post.slug}`
      };
    });
    
    // Inserir posts em lotes
    console.log('📝 Inserindo posts no Supabase...');
    
    const batchSize = 10;
    for (let i = 0; i < postsForInsertion.length; i += batchSize) {
      const batch = postsForInsertion.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Erro ao inserir batch ${i / batchSize + 1}:`, error);
        continue;
      }
      
      console.log(`✅ Batch ${i / batchSize + 1}/${Math.ceil(postsForInsertion.length / batchSize)} inserido com sucesso`);
    }
    
    // Verificar inserção
    const { data: finalCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' });
    
    console.log(`🎉 Migração concluída! Total de posts no banco: ${finalCount?.length || 0}`);
    
    // Atualizar contadores das categorias
    await updateCategoryPostCounts();
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Função para atualizar contadores das categorias
async function updateCategoryPostCounts() {
  try {
    console.log('📊 Atualizando contadores das categorias...');
    
    for (const [slug, categoryId] of Object.entries(categoryMapping)) {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('category_id', categoryId);
      
      const postCount = posts?.length || 0;
      
      const { error } = await supabase
        .from('blog_categories')
        .update({ post_count: postCount })
        .eq('id', categoryId);
      
      if (error) {
        console.error(`❌ Erro ao atualizar categoria ${slug}:`, error);
      } else {
        console.log(`✅ Categoria ${slug}: ${postCount} posts`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar contadores:', error);
  }
}

// Executar migração
if (require.main === module) {
  migrateBlogPosts();
}

module.exports = { migrateBlogPosts, updateCategoryPostCounts };