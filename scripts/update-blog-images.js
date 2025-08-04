// Script to extract hero images from blog content and update database
// Run with: node scripts/update-blog-images.js

import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://vfpdyllwquaturpcifpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzE4MDEsImV4cCI6MjAzNTk0NzgwMX0.cVstqwDbNPqNr12PabifWPhZKksZWT3WJqRgzOaUgfY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Extract the first image URL from HTML content
 */
function extractFirstImage(content) {
  if (!content) return null;
  
  // Regular expression to find img tags and extract src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = content.match(imgRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Main function to update blog posts
 */
async function main() {
  try {
    console.log('🚀 Starting blog post image extraction...\n');
    
    // Get posts without image_url
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, image_url, content')
      .or('image_url.is.null,image_url.eq.')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }
    
    console.log(`📊 Found ${posts?.length || 0} posts without image_url\n`);
    
    if (!posts || posts.length === 0) {
      console.log('✨ All posts already have images!');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each post
    for (const post of posts) {
      const extractedImage = extractFirstImage(post.content);
      
      if (extractedImage) {
        console.log(`✅ "${post.title}"`);
        console.log(`   📸 Image: ${extractedImage}`);
        
        // Update the post
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ 
            image_url: extractedImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);
        
        if (updateError) {
          console.error(`   ❌ Error updating:`, updateError.message);
        } else {
          updatedCount++;
          console.log(`   ✔️  Updated successfully\n`);
        }
      } else {
        console.log(`⏭️  "${post.title}" - No image found in content\n`);
        skippedCount++;
      }
    }
    
    // Summary
    console.log('\n📈 === Update Summary ===');
    console.log(`✅ Successfully updated: ${updatedCount} posts`);
    console.log(`⏭️  Skipped (no image): ${skippedCount} posts`);
    console.log(`📊 Total processed: ${posts.length} posts`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
console.log('=== Blog Hero Image Extractor ===\n');
main();