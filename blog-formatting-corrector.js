#!/usr/bin/env node

/**
 * COMPREHENSIVE BLOG ARTICLE FORMATTING CORRECTOR
 * Phase 2: Universal Standards + Phase 3: Total Correction
 * 
 * Corrects ALL formatting issues identified in diagnosis
 * Processes ALL 17 articles with 651 total issues
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// PHASE 2: Universal Standards - Correction Functions
const CORRECTION_FUNCTIONS = {
  
  // HIGH PRIORITY: Fix compressed lists (numbered)
  COMPRESSED_LISTS: (content) => {
    console.log('    🔧 Fixing compressed lists...');
    return content.replace(/(\d+\.\s*[^\n]+)\n(\d+\.\s*)/g, '$1\n\n$2');
  },
  
  // HIGH PRIORITY: Fix text walls (long paragraphs)
  TEXT_WALLS: (content) => {
    console.log('    🔧 Breaking up text walls...');
    // Insert paragraph breaks in very long sentences
    return content.replace(/([.!?])\s+([A-Z][^.!?]{150,}[.!?])\s+([A-Z])/g, '$1\n\n$2\n\n$3');
  },
  
  // MEDIUM PRIORITY: Fix punctuation spacing
  PUNCTUATION_SPACING: (content) => {
    console.log('    🔧 Fixing punctuation spacing...');
    // Add space after punctuation when missing (but not before line breaks or other punctuation)
    return content.replace(/([.!?;,])(?![.!?;,\s\n])/g, '$1 ');
  },
  
  // MEDIUM PRIORITY: Fix bullet list spacing  
  BULLET_LIST_ISSUES: (content) => {
    console.log('    🔧 Fixing bullet list spacing...');
    // Add spacing between bullet list items
    return content.replace(/(\n-\s*[^\n]+)(\n-\s*)/g, '$1\n$2');
  },
  
  // LOW PRIORITY: Fix colon formatting
  COLON_FORMATTING: (content) => {
    console.log('    🔧 Fixing colon formatting...');
    // Ensure space after colons before capital letters
    return content.replace(/([a-zA-Z]):([A-Z])/g, '$1: $2');
  },
  
  // LOW PRIORITY: Fix excessive line breaks
  EXCESSIVE_BREAKS: (content) => {
    console.log('    🔧 Removing excessive line breaks...');
    return content.replace(/\n{4,}/g, '\n\n\n');
  },
  
  // HIGH PRIORITY: Fix compressed steps
  COMPRESSED_STEPS: (content) => {
    console.log('    🔧 Fixing compressed step instructions...');
    return content.replace(/([0-9]+\.\s*[^.]+\.)([0-9]+\.\s*)/g, '$1\n\n$2');
  },
  
  // LOW PRIORITY: Fix markdown spacing
  MARKDOWN_SPACING: (content) => {
    console.log('    🔧 Fixing markdown formatting spacing...');
    // Add spaces around bold/italic markdown (careful not to break existing formatting)
    return content.replace(/(\w)(\*\*?[^*]+\*\*?)(\w)/g, '$1 $2 $3');
  }
};

// Load diagnosis results
async function loadDiagnosis() {
  try {
    const diagnosisData = await fs.readFile('blog-formatting-diagnosis.json', 'utf8');
    return JSON.parse(diagnosisData);
  } catch (error) {
    throw new Error('Could not load diagnosis file. Please run diagnosis first.');
  }
}

// Get article from database
async function getArticle(articleId) {
  const { data: article, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', articleId)
    .single();
  
  if (error) {
    throw new Error(`Failed to fetch article ${articleId}: ${error.message}`);
  }
  
  return article;
}

// Apply all corrections to content
function applyCorrectionPipeline(content, articleSlug) {
  console.log(`  📝 Applying correction pipeline to: ${articleSlug}`);
  
  let correctedContent = content;
  let totalChanges = 0;
  
  // Apply corrections in priority order: HIGH -> MEDIUM -> LOW
  const priorityOrder = [
    'COMPRESSED_LISTS', 'TEXT_WALLS', 'COMPRESSED_STEPS',  // HIGH
    'PUNCTUATION_SPACING', 'BULLET_LIST_ISSUES',           // MEDIUM  
    'COLON_FORMATTING', 'EXCESSIVE_BREAKS', 'MARKDOWN_SPACING'  // LOW
  ];
  
  priorityOrder.forEach(correctionType => {
    if (CORRECTION_FUNCTIONS[correctionType]) {
      const beforeLength = correctedContent.length;
      correctedContent = CORRECTION_FUNCTIONS[correctionType](correctedContent);
      
      // Detect if changes were made
      if (beforeLength !== correctedContent.length || content !== correctedContent) {
        totalChanges++;
      }
    }
  });
  
  console.log(`    ✅ Applied ${totalChanges} correction types`);
  return correctedContent;
}

// Update article in database
async function updateArticle(articleId, correctedContent, originalContent) {
  if (correctedContent === originalContent) {
    console.log(`    ↩️  No changes needed`);
    return { updated: false, reason: 'no_changes' };
  }
  
  const { error } = await supabase
    .from('blog_posts')
    .update({ 
      content: correctedContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', articleId);
  
  if (error) {
    throw new Error(`Failed to update article ${articleId}: ${error.message}`);
  }
  
  console.log(`    💾 Successfully updated in database`);
  return { updated: true, reason: 'corrected' };
}

// Process single article
async function processArticle(articleDetail) {
  console.log(`\n🔧 Processing: ${articleDetail.title}`);
  console.log(`   📊 Issues to fix: ${articleDetail.totalIssues}`);
  
  try {
    // Get current article content
    const article = await getArticle(articleDetail.id);
    const originalContent = article.content || '';
    
    if (!originalContent.trim()) {
      console.log(`   ⚠️  Skipping: Article has no content`);
      return { success: false, reason: 'empty_content' };
    }
    
    // Apply corrections
    const correctedContent = applyCorrectionPipeline(originalContent, articleDetail.slug);
    
    // Update in database
    const updateResult = await updateArticle(articleDetail.id, correctedContent, originalContent);
    
    return { 
      success: true, 
      updated: updateResult.updated,
      originalLength: originalContent.length,
      correctedLength: correctedContent.length,
      reason: updateResult.reason
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message, reason: 'error' };
  }
}

// Process all articles in batches
async function processAllArticles(diagnosis) {
  console.log('\n🚀 Starting batch correction process...');
  console.log(`📋 Processing ${diagnosis.articlesWithIssues} articles with issues\n`);
  
  const results = {
    totalProcessed: 0,
    successful: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
    startTime: new Date(),
    endTime: null
  };
  
  // Get articles that need attention (sorted by most issues first)
  const articlesToProcess = diagnosis.articleDetails
    .filter(article => article.needsAttention)
    .sort((a, b) => b.totalIssues - a.totalIssues);
  
  console.log(`🎯 Processing articles in order of severity:\n`);
  
  // Process each article
  for (const article of articlesToProcess) {
    results.totalProcessed++;
    
    const result = await processArticle(article);
    
    if (result.success) {
      results.successful++;
      if (result.updated) {
        results.updated++;
      } else {
        results.skipped++;
      }
    } else {
      results.failed++;
      results.errors.push({
        articleId: article.id,
        slug: article.slug,
        error: result.error || result.reason
      });
    }
    
    // Small delay to be gentle on Supabase
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  results.endTime = new Date();
  return results;
}

// PHASE 4: Validation - Re-run diagnosis to check corrections
async function validateCorrections() {
  console.log('\n🔍 PHASE 4: VALIDATION - Re-running diagnosis...');
  
  try {
    // Import diagnosis functions (simplified inline version)
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, content')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Quick re-analysis
    let articlesWithIssues = 0;
    let totalIssues = 0;
    
    const issuePatterns = {
      COMPRESSED_LISTS: /(\d+\.\s*[^\n]+)(\n\d+\.\s*[^\n]+)+/g,
      TEXT_WALLS: /[.!?]\s*[A-Z][^.!?]{150,}[.!?]\s*[A-Z]/g,
      PUNCTUATION_SPACING: /[.!?;,](?![.!?;,\s\n])[a-zA-Z]/g,
      BULLET_LIST_ISSUES: /(\n-\s*[^\n]+)(\n-\s*[^\n]+)+(?!\n\n)/g,
      COLON_FORMATTING: /([a-zA-Z]):\s*([A-Z])/g,
      EXCESSIVE_BREAKS: /\n{4,}/g,
      COMPRESSED_STEPS: /([0-9]+\.\s*[^.]+\.)([0-9]+\.\s*)/g,
      MARKDOWN_SPACING: /(\w)(\*\*?[^*]+\*\*?)(\w)/g
    };
    
    for (const article of articles) {
      const content = article.content || '';
      let articleIssues = 0;
      
      Object.values(issuePatterns).forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          articleIssues += matches.length;
        }
      });
      
      if (articleIssues > 0) {
        articlesWithIssues++;
        totalIssues += articleIssues;
      }
    }
    
    return {
      totalArticles: articles.length,
      articlesWithIssues,
      articlesFixed: articles.length - articlesWithIssues,
      totalIssuesRemaining: totalIssues,
      successRate: ((articles.length - articlesWithIssues) / articles.length * 100).toFixed(1)
    };
    
  } catch (error) {
    console.log(`❌ Validation failed: ${error.message}`);
    return null;
  }
}

// Generate final report
async function generateFinalReport(correctionResults, validationResults, diagnosis) {
  const report = {
    timestamp: new Date().toISOString(),
    originalDiagnosis: {
      totalArticles: diagnosis.totalArticles,
      articlesWithIssues: diagnosis.articlesWithIssues,
      totalIssuesFound: diagnosis.totalIssuesFound
    },
    correctionResults,
    validationResults,
    summary: {
      issuesFixed: diagnosis.totalIssuesFound - (validationResults?.totalIssuesRemaining || 0),
      successRate: validationResults?.successRate + '%' || 'N/A',
      processingTime: correctionResults.endTime - correctionResults.startTime
    }
  };
  
  const readableReport = `# Blog Article Formatting Correction - Final Report

## System Performance Summary

🚀 **MISSION STATUS**: ${validationResults?.totalIssuesRemaining === 0 ? 'COMPLETED ✅' : 'PARTIAL SUCCESS ⚠️'}

📊 **Processing Results**
- **Articles Processed**: ${correctionResults.totalProcessed}
- **Successfully Updated**: ${correctionResults.updated}
- **No Changes Needed**: ${correctionResults.skipped}
- **Failed**: ${correctionResults.failed}
- **Processing Time**: ${Math.round((correctionResults.endTime - correctionResults.startTime) / 1000)}s

## Before vs After Comparison

### Original State (From Diagnosis)
- **Total Articles**: ${report.originalDiagnosis.totalArticles}
- **Articles with Issues**: ${report.originalDiagnosis.articlesWithIssues} (100%)
- **Total Issues Found**: ${report.originalDiagnosis.totalIssuesFound}

### Current State (After Correction)
- **Total Articles**: ${validationResults?.totalArticles || 'N/A'}
- **Articles with Issues**: ${validationResults?.articlesWithIssues || 'N/A'}
- **Articles Fixed**: ${validationResults?.articlesFixed || 'N/A'}
- **Issues Remaining**: ${validationResults?.totalIssuesRemaining || 'N/A'}
- **Success Rate**: ${validationResults?.successRate || 'N/A'}%

## Impact Analysis

🎯 **Issues Resolved**: ${report.summary.issuesFixed}/${report.originalDiagnosis.totalIssuesFound}
📈 **Improvement Rate**: ${(((report.originalDiagnosis.totalIssuesFound - (validationResults?.totalIssuesRemaining || 0)) / report.originalDiagnosis.totalIssuesFound) * 100).toFixed(1)}%
⚡ **Processing Speed**: ${(correctionResults.totalProcessed / Math.round((correctionResults.endTime - correctionResults.startTime) / 1000)).toFixed(1)} articles/second

${correctionResults.errors.length > 0 ? `## Errors Encountered

${correctionResults.errors.map(err => `- **${err.slug}**: ${err.error}`).join('\n')}` : '## ✅ No Errors Encountered'}

## Next Steps

${validationResults?.totalIssuesRemaining === 0 ? 
  '🎉 **CONGRATULATIONS!** All formatting issues have been successfully resolved!' :
  `⚠️ **${validationResults?.totalIssuesRemaining || 'Some'} issues still remain.** Consider running targeted corrections.`
}

---
*Report generated on: ${report.timestamp}*
*System: Blog Formatting Corrector v1.0*
*Coverage: 100% of identified articles processed*
`;
  
  await fs.writeFile('blog-formatting-correction-report.json', JSON.stringify(report, null, 2));
  await fs.writeFile('blog-formatting-correction-report.md', readableReport);
  
  return report;
}

async function main() {
  try {
    console.log('🚀 COMPREHENSIVE BLOG ARTICLE FORMATTING CORRECTOR');
    console.log('📋 Objective: Fix ALL formatting issues in ALL articles\n');
    
    // Load diagnosis results
    const diagnosis = await loadDiagnosis();
    console.log(`📊 Loaded diagnosis: ${diagnosis.articlesWithIssues} articles need correction`);
    console.log(`🔥 Total issues to fix: ${diagnosis.totalIssuesFound}\n`);
    
    // PHASE 3: Total Correction
    console.log('🔧 PHASE 3: TOTAL CORRECTION');
    const correctionResults = await processAllArticles(diagnosis);
    
    // PHASE 4: Complete Validation
    const validationResults = await validateCorrections();
    
    // Generate comprehensive final report
    console.log('\n📊 Generating final report...');
    const finalReport = await generateFinalReport(correctionResults, validationResults, diagnosis);
    
    // Final summary
    console.log('\n🎉 CORRECTION PROCESS COMPLETED!');
    console.log('================================');
    console.log(`✅ Articles Processed: ${correctionResults.totalProcessed}`);
    console.log(`💾 Articles Updated: ${correctionResults.updated}`);
    console.log(`⏭️  Articles Skipped: ${correctionResults.skipped}`);
    console.log(`❌ Articles Failed: ${correctionResults.failed}`);
    
    if (validationResults) {
      console.log(`\n📈 IMPROVEMENT METRICS:`);
      console.log(`🎯 Issues Fixed: ${finalReport.summary.issuesFixed}/${diagnosis.totalIssuesFound}`);
      console.log(`📊 Success Rate: ${validationResults.successRate}%`);
      console.log(`🏆 Articles Clean: ${validationResults.articlesFixed}/${validationResults.totalArticles}`);
      
      if (validationResults.totalIssuesRemaining === 0) {
        console.log('\n🏅 PERFECT SCORE: All formatting issues resolved!');
      } else {
        console.log(`\n⚠️  ${validationResults.totalIssuesRemaining} issues still need attention`);
      }
    }
    
    console.log('\n📄 Reports generated:');
    console.log('- blog-formatting-correction-report.md');
    console.log('- blog-formatting-correction-report.json');
    
  } catch (error) {
    console.error('💥 Correction failed:', error);
    process.exit(1);
  }
}

main();