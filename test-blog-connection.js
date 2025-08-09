#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testBlogConnection() {
  try {
    console.log('🔄 Testing connection to blog_posts table...');
    
    // Get basic count first
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error getting count:', countError);
      return;
    }
    
    console.log(`✅ Found ${count} total articles in database`);
    
    // Get first 5 articles to test content access
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        content,
        created_at,
        blog_categories!inner(name, slug)
      `)
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching articles:', error);
      return;
    }
    
    console.log(`✅ Retrieved ${articles.length} articles for analysis`);
    
    // Analyze content of first article
    if (articles.length > 0) {
      const firstArticle = articles[0];
      console.log(`\n📄 Sample Article Analysis:`);
      console.log(`Title: ${firstArticle.title}`);
      console.log(`Slug: ${firstArticle.slug}`);
      console.log(`Category: ${firstArticle.blog_categories?.name || 'Unknown'}`);
      console.log(`Content Length: ${(firstArticle.content || '').length} characters`);
      
      // Check for formatting issues in sample
      const content = firstArticle.content || '';
      const issuesFound = [];
      
      // Test some patterns
      if (content.match(/(\d+\.\s*[^\n]+)(\n\d+\.\s*[^\n]+)+/g)) {
        issuesFound.push('Compressed Lists');
      }
      
      if (content.match(/[.!?]\s*[A-Z][^.!?]{100,}[.!?]\s*[A-Z]/g)) {
        issuesFound.push('Text Walls');
      }
      
      if (content.match(/[.!?;,](?![.!?;,\s])[a-zA-Z]/g)) {
        issuesFound.push('Punctuation Spacing');
      }
      
      console.log(`Issues Found: ${issuesFound.length > 0 ? issuesFound.join(', ') : 'None detected in sample'}`);
    }
    
    console.log('\n✅ Connection test successful - ready for full analysis');
    
  } catch (error) {
    console.error('💥 Connection test failed:', error);
  }
}

testBlogConnection();