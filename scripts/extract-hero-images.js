import { createClient } from '@supabase/supabase-js';

// Configure your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vfpdyllwquaturpcifpl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    
    // Fetch all blog posts without image_url
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, content, image_url')
      .or('image_url.is.null,image_url.eq.');
    
    if (fetchError) {
      console.error('Error fetching posts:', fetchError);
      return;
    }
    
    console.log(`Found ${posts.length} posts without image_url`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Process each post
    for (const post of posts) {
      const extractedImage = extractFirstImage(post.content);
      
      if (extractedImage) {
        console.log(`Updating post "${post.title}" with image: ${extractedImage}`);
        
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({ 
            image_url: extractedImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);
        
        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
        } else {
          updatedCount++;
        }
      } else {
        console.log(`No image found in content for post: ${post.title}`);
        skippedCount++;
      }
    }
    
    console.log('\nUpdate complete!');
    console.log(`✅ Updated: ${updatedCount} posts`);
    console.log(`⏭️  Skipped: ${skippedCount} posts (no image in content)`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the update
updateBlogPostImages();