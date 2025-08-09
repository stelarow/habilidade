#!/usr/bin/env node

/**
 * IMPROVED BLOG ARTICLE FORMATTING CORRECTOR V2
 * 
 * Fixes issues with V1 corrections and implements safer patterns
 * Focus: Precision over volume to avoid introducing new issues
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// IMPROVED CORRECTION FUNCTIONS - More precise and conservative
const SAFE_CORRECTION_FUNCTIONS = {
  
  // Fix the most critical and safe corrections first
  PUNCTUATION_SPACING: (content) => {
    console.log('    🔧 Fixing punctuation spacing (safe mode)...');
    // Only fix clear cases: punctuation followed immediately by letter (not space, newline, or punctuation)
    let fixed = content;
    
    // Fix periods followed by letters
    fixed = fixed.replace(/\.([A-Z])/g, '. $1');
    
    // Fix commas followed by letters (but not in numbers like 1,000)
    fixed = fixed.replace(/,([A-Za-z])/g, ', $1');
    
    // Fix exclamation points followed by letters
    fixed = fixed.replace(/!([A-Z])/g, '! $1');
    
    // Fix question marks followed by letters
    fixed = fixed.replace(/\?([A-Z])/g, '? $1');
    
    // Fix semicolons followed by letters
    fixed = fixed.replace(/;([A-Za-z])/g, '; $1');
    
    return fixed;
  },
  
  // Fix obvious colon issues
  COLON_FORMATTING: (content) => {
    console.log('    🔧 Fixing colon formatting (safe mode)...');
    // Only fix colons followed immediately by capital letters (clear cases)
    return content.replace(/([a-zA-Z]):([A-Z][a-z])/g, '$1: $2');
  },
  
  // Fix excessive line breaks (conservative)
  EXCESSIVE_BREAKS: (content) => {
    console.log('    🔧 Removing excessive line breaks (conservative)...');
    // Only remove truly excessive breaks (5+ consecutive newlines)
    return content.replace(/\n{5,}/g, '\n\n\n');
  },
  
  // Fix compressed numbered lists (very careful)
  COMPRESSED_LISTS: (content) => {
    console.log('    🔧 Fixing compressed numbered lists (careful)...');
    // Only fix obvious cases: "1. text\n2. text" -> "1. text\n\n2. text"
    return content.replace(/(\d+\.\s+[^\n]{10,})\n(\d+\.\s+)/g, '$1\n\n$2');
  },
  
  // Fix bullet list spacing (careful)
  BULLET_LIST_SPACING: (content) => {
    console.log('    🔧 Fixing bullet list spacing (careful)...');
    // Only fix clear bullet lists without spacing
    return content.replace(/(\n-\s+[^\n]{10,})\n(-\s+)/g, '$1\n\n$2');
  }
};

// Test correction on sample text to verify it doesn't break things
function testCorrection(correctionFunc, sampleText) {
  try {
    const result = correctionFunc(sampleText);
    return result !== sampleText; // Return true if changes were made
  } catch (error) {
    console.log(`    ⚠️ Correction function error: ${error.message}`);
    return false;
  }
}

// Get all articles for processing
async function getAllArticles() {
  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, updated_at')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(`Supabase error: ${error.message}`);
  return articles;
}

// Apply corrections more carefully
function applyCarefulCorrections(content, articleSlug) {
  console.log(`  📝 Applying careful corrections to: ${articleSlug}`);
  
  let correctedContent = content;
  const corrections = [];
  
  // Apply each correction and track what was changed
  Object.entries(SAFE_CORRECTION_FUNCTIONS).forEach(([correctionType, correctionFunc]) => {
    const beforeContent = correctedContent;
    correctedContent = correctionFunc(correctedContent);
    
    if (beforeContent !== correctedContent) {
      corrections.push(correctionType);
    }
  });
  
  console.log(`    ✅ Applied corrections: ${corrections.length > 0 ? corrections.join(', ') : 'none needed'}`);
  
  return {
    content: correctedContent,
    corrections: corrections,
    changed: content !== correctedContent
  };
}

// Process a single article with validation
async function processArticleCarefully(article) {
  console.log(`\n🔧 Processing: ${article.title}`);
  
  try {
    const originalContent = article.content || '';
    
    if (!originalContent.trim()) {
      console.log(`   ⚠️ Skipping: Empty content`);
      return { success: true, skipped: true, reason: 'empty_content' };
    }
    
    // Apply corrections
    const correctionResult = applyCarefulCorrections(originalContent, article.slug);
    
    if (!correctionResult.changed) {
      console.log(`   ✅ No changes needed`);
      return { success: true, skipped: true, reason: 'no_changes_needed' };
    }
    
    // Validate the changes don't break the content
    const originalLength = originalContent.length;
    const newLength = correctionResult.content.length;
    const lengthDiff = Math.abs(newLength - originalLength);
    const lengthChangePercent = (lengthDiff / originalLength) * 100;
    
    // Safety check: if content changed too dramatically, skip
    if (lengthChangePercent > 20) {
      console.log(`   ⚠️ Skipping: Content changed too dramatically (${lengthChangePercent.toFixed(1)}%)`);
      return { success: true, skipped: true, reason: 'too_many_changes' };
    }
    
    // Update the article
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        content: correctionResult.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', article.id);
    
    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
    
    console.log(`   💾 Successfully updated (${correctionResult.corrections.length} corrections applied)`);
    
    return { 
      success: true, 
      updated: true,
      corrections: correctionResult.corrections,
      originalLength,
      newLength
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Run a fresh diagnosis after corrections
async function runFreshDiagnosis() {
  console.log('\n🔍 Running fresh diagnosis...');
  
  const articles = await getAllArticles();
  
  // Simple issue detection patterns (same as diagnosis)
  const issuePatterns = {
    PUNCTUATION_SPACING: /[.!?;,]([A-Za-z])/g,
    COLON_FORMATTING: /([a-zA-Z]):([A-Z][a-z])/g,
    EXCESSIVE_BREAKS: /\n{5,}/g,
    COMPRESSED_LISTS: /(\d+\.\s+[^\n]{10,})\n(\d+\.\s+)/g,
    BULLET_LIST_SPACING: /(\n-\s+[^\n]{10,})\n(-\s+)/g
  };
  
  let totalIssues = 0;
  let articlesWithIssues = 0;
  
  const detailedResults = [];
  
  for (const article of articles) {
    const content = article.content || '';
    let articleIssues = 0;
    const issueBreakdown = {};
    
    Object.entries(issuePatterns).forEach(([patternName, pattern]) => {
      const matches = content.match(pattern);
      const count = matches ? matches.length : 0;
      issueBreakdown[patternName] = count;
      articleIssues += count;
    });
    
    if (articleIssues > 0) {
      articlesWithIssues++;
    }
    
    totalIssues += articleIssues;
    
    detailedResults.push({
      title: article.title,
      slug: article.slug,
      issues: articleIssues,
      breakdown: issueBreakdown
    });
  }
  
  return {
    totalArticles: articles.length,
    articlesWithIssues,
    articlesClean: articles.length - articlesWithIssues,
    totalIssues,
    successRate: ((articles.length - articlesWithIssues) / articles.length * 100).toFixed(1),
    detailedResults: detailedResults.filter(r => r.issues > 0).sort((a, b) => b.issues - a.issues)
  };
}

async function main() {
  try {
    console.log('🚀 IMPROVED BLOG ARTICLE FORMATTING CORRECTOR V2');
    console.log('📋 Focus: Safe, targeted corrections\n');
    
    // Get all articles
    const articles = await getAllArticles();
    console.log(`📊 Found ${articles.length} articles to process\n`);
    
    // Process results tracking
    const results = {
      totalProcessed: 0,
      successful: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      startTime: new Date()
    };
    
    // Process each article carefully
    for (const article of articles) {
      results.totalProcessed++;
      
      const result = await processArticleCarefully(article);
      
      if (result.success) {
        results.successful++;
        if (result.updated) {
          results.updated++;
        } else {
          results.skipped++;
        }
      } else {
        results.failed++;
      }
      
      // Small delay to be gentle on database
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    results.endTime = new Date();
    
    // Run fresh diagnosis
    const freshDiagnosis = await runFreshDiagnosis();
    
    // Generate summary report
    console.log('\n🎉 V2 CORRECTION COMPLETED!');
    console.log('===========================');
    console.log(`✅ Articles Processed: ${results.totalProcessed}`);
    console.log(`💾 Articles Updated: ${results.updated}`);
    console.log(`⏭️ Articles Skipped: ${results.skipped}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⏱️ Processing Time: ${Math.round((results.endTime - results.startTime) / 1000)}s`);
    
    console.log('\n📊 CURRENT STATUS AFTER V2:');
    console.log(`🏆 Clean Articles: ${freshDiagnosis.articlesClean}/${freshDiagnosis.totalArticles}`);
    console.log(`⚠️ Issues Remaining: ${freshDiagnosis.totalIssues}`);
    console.log(`📈 Success Rate: ${freshDiagnosis.successRate}%`);
    
    if (freshDiagnosis.totalIssues === 0) {
      console.log('\n🎯 PERFECT SCORE! All formatting issues resolved!');
    } else {
      console.log(`\n📋 Articles still needing attention:`);
      freshDiagnosis.detailedResults.slice(0, 5).forEach((article, i) => {
        console.log(`${i + 1}. ${article.title} (${article.issues} issues)`);
      });
    }
    
    // Save final diagnosis
    await fs.writeFile('blog-formatting-v2-results.json', JSON.stringify({
      processingResults: results,
      finalDiagnosis: freshDiagnosis,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log('\n📄 Results saved: blog-formatting-v2-results.json');
    
  } catch (error) {
    console.error('💥 V2 Corrector failed:', error);
    process.exit(1);
  }
}

main();