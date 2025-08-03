import { createClient } from '@supabase/supabase-js';
import { mockPosts, mockCategories } from '../src/services/blogMockData';

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateCategories() {
  console.log('Migrating categories...');
  
  for (const category of mockCategories) {
    const { error } = await supabase
      .from('blog_categories')
      .upsert({
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        post_count: category.postCount
      }, {
        onConflict: 'slug'
      });
    
    if (error) {
      console.error(`Error migrating category ${category.name}:`, error);
    } else {
      console.log(`✓ Migrated category: ${category.name}`);
    }
  }
}

async function migrateAuthors() {
  console.log('Migrating authors...');
  
  // Get unique authors from posts
  const authors = new Map();
  mockPosts.forEach(post => {
    const key = post.author.email || post.author.name.toLowerCase().replace(/\s+/g, '.') + '@escolahabilidade.com.br';
    if (!authors.has(key)) {
      authors.set(key, {
        name: post.author.name,
        email: key,
        avatar_url: post.author.avatar || '/assets/avatars/default.jpg',
        bio: `Especialista em ${post.category.name} na Escola Habilidade`
      });
    }
  });
  
  for (const [email, author] of authors) {
    const { error } = await supabase
      .from('blog_authors')
      .upsert(author, {
        onConflict: 'email'
      });
    
    if (error) {
      console.error(`Error migrating author ${author.name}:`, error);
    } else {
      console.log(`✓ Migrated author: ${author.name}`);
    }
  }
}

async function migrateTags() {
  console.log('Migrating tags...');
  
  // Get unique tags from posts
  const tags = new Set<string>();
  mockPosts.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag));
  });
  
  for (const tagName of tags) {
    const { error } = await supabase
      .from('blog_tags')
      .upsert({
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-')
      }, {
        onConflict: 'slug'
      });
    
    if (error) {
      console.error(`Error migrating tag ${tagName}:`, error);
    } else {
      console.log(`✓ Migrated tag: ${tagName}`);
    }
  }
}

async function migratePosts() {
  console.log('Migrating posts...');
  
  for (const post of mockPosts) {
    // Get category ID
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', post.category.slug)
      .single();
    
    // Get author ID
    const authorEmail = post.author.email || 
      post.author.name.toLowerCase().replace(/\s+/g, '.') + '@escolahabilidade.com.br';
    
    const { data: author } = await supabase
      .from('blog_authors')
      .select('id')
      .eq('email', authorEmail)
      .single();
    
    if (!category || !author) {
      console.error(`Skipping post ${post.title} - missing category or author`);
      continue;
    }
    
    // Insert post
    const { data: insertedPost, error: postError } = await supabase
      .from('blog_posts')
      .upsert({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category_id: category.id,
        author_id: author.id,
        image_url: post.imageUrl,
        reading_time: post.readingTime,
        views: post.views || 0,
        published_at: post.publishedAt || new Date().toISOString(),
        seo_title: post.title,
        seo_description: post.excerpt,
        og_image: post.imageUrl,
        canonical_url: `https://escolahabilidade.com.br/blog/${post.slug}`
      }, {
        onConflict: 'slug'
      })
      .select()
      .single();
    
    if (postError) {
      console.error(`Error migrating post ${post.title}:`, postError);
      continue;
    }
    
    // Add tags
    if (post.tags && insertedPost) {
      for (const tagName of post.tags) {
        const { data: tag } = await supabase
          .from('blog_tags')
          .select('id')
          .eq('slug', tagName.toLowerCase().replace(/\s+/g, '-'))
          .single();
        
        if (tag) {
          await supabase
            .from('blog_post_tags')
            .upsert({
              post_id: insertedPost.id,
              tag_id: tag.id
            }, {
              onConflict: 'post_id,tag_id'
            });
        }
      }
    }
    
    console.log(`✓ Migrated post: ${post.title}`);
  }
}

async function updateCategoryCounts() {
  console.log('Updating category post counts...');
  
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, slug');
  
  for (const category of categories || []) {
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id);
    
    await supabase
      .from('blog_categories')
      .update({ post_count: count || 0 })
      .eq('id', category.id);
    
    console.log(`✓ Updated count for ${category.slug}: ${count}`);
  }
}

async function migrate() {
  try {
    await migrateCategories();
    await migrateAuthors();
    await migrateTags();
    await migratePosts();
    await updateCategoryCounts();
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();