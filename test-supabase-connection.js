// Teste simples de conexão Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vfpdyllwquaturpcifpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    
    // Teste 1: Buscar categorias
    const { data: categories, error: categoryError } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .limit(3);
    
    if (categoryError) {
      console.error('❌ Erro ao buscar categorias:', categoryError);
      return;
    }
    
    console.log('✅ Categorias encontradas:', categories?.length || 0);
    console.log('📋 Primeiras categorias:', categories);
    
    // Teste 2: Buscar posts
    const { data: posts, error: postError } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        blog_categories!inner(name, slug)
      `)
      .limit(3);
    
    if (postError) {
      console.error('❌ Erro ao buscar posts:', postError);
      return;
    }
    
    console.log('✅ Posts encontrados:', posts?.length || 0);
    console.log('📄 Primeiros posts:', posts);
    
    // Teste 3: Buscar um post específico
    const { data: specificPost, error: specificError } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories!inner(id, name, slug, description, color)
      `)
      .eq('slug', 'como-usar-sketchup-para-design-conceitual-arquitetonico')
      .single();
    
    if (specificError) {
      console.error('❌ Erro ao buscar post específico:', specificError);
      return;
    }
    
    console.log('✅ Post específico encontrado:', specificPost?.title);
    
    console.log('🎉 Todos os testes passaram! Supabase está funcionando corretamente.');
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testConnection();