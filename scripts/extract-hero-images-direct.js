// Direct database script to extract hero images from blog content
// Run with: node scripts/extract-hero-images-direct.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Configure your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vfpdyllwquaturpcifpl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extract the first image URL from HTML content
 * @param {string} content - HTML content
 * @returns {string|null} - Image URL or null if not found
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
 * Update blog posts that don't have image_url by extracting from content
 */
async function updateBlogPostImages() {
  try {
    console.log('Starting blog post image extraction...');
    console.log('Supabase URL:', supabaseUrl);
    
    // First, let's check how many posts we have in total
    const { count: totalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Total blog posts in database: ${totalCount}`);
    
    // Fetch all blog posts without image_url
    const { data: posts, error: fetchError, count } = await supabase
      .from('blog_posts')
      .select('id, title, slug, content, image_url')
      .or('image_url.is.null,image_url.eq.')
      .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return;
    }
    
    console.log(`Found ${posts?.length || 0} posts without image_url`);
    
    if (!posts || posts.length === 0) {
      console.log('No posts to update.');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    const updates = [];
    
    // Process each post
    for (const post of posts) {
      const extractedImage = extractFirstImage(post.content);
      
      if (extractedImage) {
        console.log(`📸 Found image for "${post.title}": ${extractedImage}`);
        updates.push({
          id: post.id,
          title: post.title,
          image_url: extractedImage
        });
      } else {
        console.log(`❌ No image found in content for: ${post.title}`);
        skippedCount++;
      }
    }
    
    // Perform batch updates
    if (updates.length > 0) {
      console.log(`\nUpdating ${updates.length} posts...`);
      
      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ 
            image_url: update.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`Error updating post "${update.title}":`, updateError);
        } else {
          console.log(`✅ Updated: ${update.title}`);
          updatedCount++;
        }
      }
    }
    
    console.log('\n=== Update Summary ===');
    console.log(`✅ Successfully updated: ${updatedCount} posts`);
    console.log(`⏭️  Skipped (no image): ${skippedCount} posts`);
    console.log(`📊 Total processed: ${posts.length} posts`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

// Execute the update
console.log('=== Blog Hero Image Extractor ===\n');
updateBlogPostImages();