#!/usr/bin/env node

/**
 * COMPREHENSIVE BLOG ARTICLE FORMATTING DIAGNOSIS
 * Phase 1: Complete diagnosis of ALL 18 articles
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

const SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Comprehensive formatting issue patterns
const FORMATTING_ISSUES = {
  COMPRESSED_LISTS: {
    pattern: /(\d+\.\s*[^\n]+)(\n\d+\.\s*[^\n]+)+/g,
    description: 'Numbered lists without spacing between items',
    severity: 'HIGH',
    example: '1. Item one\n2. Item two'
  },
  
  TEXT_WALLS: {
    pattern: /[.!?]\s*[A-Z][^.!?]{150,}[.!?]\s*[A-Z]/g,
    description: 'Long text blocks without paragraph breaks (150+ chars)',
    severity: 'HIGH',
    example: 'Sentence. Very long sentence with lots of text... Next sentence.'
  },
  
  PUNCTUATION_SPACING: {
    pattern: /[.!?;,](?![.!?;,\s\n])[a-zA-Z]/g,
    description: 'Missing space after punctuation',
    severity: 'MEDIUM',
    example: 'Hello,world'
  },
  
  COLON_FORMATTING: {
    pattern: /([a-zA-Z]):\s*([A-Z])/g,
    description: 'Inconsistent colon formatting',
    severity: 'LOW',
    example: 'Title:Content'
  },
  
  EXCESSIVE_BREAKS: {
    pattern: /\n{4,}/g,
    description: 'Excessive line breaks (4+ consecutive)',
    severity: 'LOW',
    example: '\\n\\n\\n\\n'
  },
  
  COMPRESSED_STEPS: {
    pattern: /([0-9]+\.\s*[^.]+\.)([0-9]+\.\s*)/g,
    description: 'Step-by-step instructions without spacing',
    severity: 'HIGH',
    example: '1. Do this.2. Do that.'
  },
  
  BULLET_LIST_ISSUES: {
    pattern: /(\n-\s*[^\n]+)(\n-\s*[^\n]+)+(?!\n\n)/g,
    description: 'Bullet lists without proper spacing',
    severity: 'MEDIUM',
    example: '- Item one\n- Item two\n- Item three'
  },
  
  MARKDOWN_SPACING: {
    pattern: /(\w)(\*\*?[^*]+\*\*?)(\w)/g,
    description: 'Missing spacing around markdown formatting',
    severity: 'LOW',
    example: 'word**bold**word'
  }
};

async function getAllArticles() {
  console.log('🔄 Fetching ALL articles from blog_posts table...');
  
  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select(`
      id,
      title,
      slug,
      content,
      excerpt,
      created_at,
      updated_at,
      reading_time,
      views,
      blog_categories!inner(id, name, slug)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }
  
  console.log(`✅ Retrieved ${articles.length} articles for analysis`);
  return articles;
}

function analyzeArticleIssues(article) {
  const content = article.content || '';
  const issues = [];
  
  if (!content.trim()) {
    return [{
      type: 'EMPTY_CONTENT',
      description: 'Article has no content',
      severity: 'CRITICAL',
      matches: 0
    }];
  }
  
  Object.entries(FORMATTING_ISSUES).forEach(([issueType, config]) => {
    const matches = content.match(config.pattern);
    
    if (matches && matches.length > 0) {
      issues.push({
        type: issueType,
        description: config.description,
        severity: config.severity,
        matches: matches.length,
        examples: matches.slice(0, 2).map(match => 
          match.length > 100 ? match.substring(0, 100) + '...' : match
        )
      });
    }
  });
  
  return issues;
}

async function performDiagnosis() {
  console.log('🏥 Starting comprehensive diagnosis...\n');
  
  const articles = await getAllArticles();
  const diagnosis = {
    totalArticles: articles.length,
    articlesWithIssues: 0,
    articlesWithoutIssues: 0,
    totalIssuesFound: 0,
    severityBreakdown: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
    issueTypeBreakdown: {},
    articleDetails: [],
    timestamp: new Date().toISOString()
  };
  
  for (const article of articles) {
    console.log(`🔍 Analyzing: ${article.title}`);
    
    const issues = analyzeArticleIssues(article);
    const hasIssues = issues.length > 0;
    
    if (hasIssues) {
      diagnosis.articlesWithIssues++;
    } else {
      diagnosis.articlesWithoutIssues++;
    }
    
    diagnosis.totalIssuesFound += issues.reduce((sum, issue) => sum + issue.matches, 0);
    
    // Count severity levels
    issues.forEach(issue => {
      diagnosis.severityBreakdown[issue.severity] = 
        (diagnosis.severityBreakdown[issue.severity] || 0) + issue.matches;
      
      if (!diagnosis.issueTypeBreakdown[issue.type]) {
        diagnosis.issueTypeBreakdown[issue.type] = {
          articlesAffected: 0,
          totalOccurrences: 0,
          severity: issue.severity,
          description: issue.description
        };
      }
      
      diagnosis.issueTypeBreakdown[issue.type].articlesAffected++;
      diagnosis.issueTypeBreakdown[issue.type].totalOccurrences += issue.matches;
    });
    
    diagnosis.articleDetails.push({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.blog_categories?.name || 'Unknown',
      contentLength: (article.content || '').length,
      wordCount: (article.content || '').split(/\s+/).length,
      issues: issues,
      totalIssues: issues.reduce((sum, issue) => sum + issue.matches, 0),
      needsAttention: hasIssues
    });
    
    // Show progress
    if (issues.length > 0) {
      console.log(`   ⚠️  Found ${issues.length} types of issues (${issues.reduce((sum, issue) => sum + issue.matches, 0)} total)`);
    } else {
      console.log(`   ✅ No formatting issues detected`);
    }
  }
  
  return diagnosis;
}

function generateDiagnosisReport(diagnosis) {
  const mostProblematicArticles = diagnosis.articleDetails
    .filter(article => article.needsAttention)
    .sort((a, b) => b.totalIssues - a.totalIssues)
    .slice(0, 10);
  
  const mostCommonIssues = Object.entries(diagnosis.issueTypeBreakdown)
    .sort((a, b) => b[1].articlesAffected - a[1].articlesAffected);
  
  return `# Blog Article Formatting Diagnosis Report

## Executive Summary

📊 **Overview**
- **Total Articles Analyzed:** ${diagnosis.totalArticles}
- **Articles with Issues:** ${diagnosis.articlesWithIssues} (${((diagnosis.articlesWithIssues / diagnosis.totalArticles) * 100).toFixed(1)}%)
- **Articles without Issues:** ${diagnosis.articlesWithoutIssues} (${((diagnosis.articlesWithoutIssues / diagnosis.totalArticles) * 100).toFixed(1)}%)
- **Total Issues Found:** ${diagnosis.totalIssuesFound}

🚨 **Severity Breakdown**
- **CRITICAL:** ${diagnosis.severityBreakdown.CRITICAL || 0}
- **HIGH:** ${diagnosis.severityBreakdown.HIGH || 0}
- **MEDIUM:** ${diagnosis.severityBreakdown.MEDIUM || 0}
- **LOW:** ${diagnosis.severityBreakdown.LOW || 0}

## Most Common Issues

${mostCommonIssues.map(([issueType, data], index) => `
### ${index + 1}. ${issueType} (${data.severity})
- **Description:** ${data.description}
- **Articles Affected:** ${data.articlesAffected}
- **Total Occurrences:** ${data.totalOccurrences}
`).join('')}

## Articles Requiring Most Attention

${mostProblematicArticles.map((article, index) => `
### ${index + 1}. ${article.title}
- **Slug:** \`${article.slug}\`
- **Category:** ${article.category}
- **Content Length:** ${article.contentLength} characters (${article.wordCount} words)
- **Total Issues:** ${article.totalIssues}
- **Issue Types:** ${article.issues.map(issue => `${issue.type} (${issue.matches})`).join(', ')}
`).join('')}

## Complete Article Analysis

${diagnosis.articleDetails.map((article, index) => `
### ${index + 1}. ${article.title}
- **Slug:** \`${article.slug}\`
- **Category:** ${article.category}
- **Status:** ${article.needsAttention ? `❌ NEEDS ATTENTION (${article.totalIssues} issues)` : '✅ CLEAN'}
- **Content:** ${article.contentLength} chars, ${article.wordCount} words
${article.issues.length > 0 ? `- **Issues Found:**
${article.issues.map(issue => `  - **${issue.type}**: ${issue.matches} occurrences (${issue.severity})`).join('\n')}` : ''}
`).join('')}

## Recommendations

### Immediate Actions Required:
1. **HIGH PRIORITY:** Fix ${diagnosis.severityBreakdown.HIGH || 0} high-severity issues
2. **MEDIUM PRIORITY:** Address ${diagnosis.severityBreakdown.MEDIUM || 0} medium-severity issues
3. **LOW PRIORITY:** Clean up ${diagnosis.severityBreakdown.LOW || 0} low-severity issues

### Implementation Plan:
1. **Batch Processing:** Process articles in groups of 5-10
2. **Priority Order:** Start with most problematic articles
3. **Validation:** Re-check each article after correction
4. **Documentation:** Update this report after corrections

---
*Report generated on: ${diagnosis.timestamp}*
*System: Blog Formatting Diagnosis v1.0*
*Coverage: 100% of articles analyzed*
`;
}

async function main() {
  try {
    console.log('🚀 COMPREHENSIVE BLOG ARTICLE FORMATTING DIAGNOSIS');
    console.log('📋 Objective: Analyze ALL articles for formatting issues\n');
    
    const diagnosis = await performDiagnosis();
    
    // Generate comprehensive report
    const reportContent = generateDiagnosisReport(diagnosis);
    
    // Save reports
    await fs.writeFile('blog-formatting-diagnosis.md', reportContent);
    await fs.writeFile('blog-formatting-diagnosis.json', JSON.stringify(diagnosis, null, 2));
    
    console.log('\n📊 DIAGNOSIS COMPLETE');
    console.log('====================');
    console.log(`✅ Articles Analyzed: ${diagnosis.totalArticles}`);
    console.log(`⚠️  Articles with Issues: ${diagnosis.articlesWithIssues}`);
    console.log(`✨ Clean Articles: ${diagnosis.articlesWithoutIssues}`);
    console.log(`🔥 Total Issues: ${diagnosis.totalIssuesFound}`);
    
    if (diagnosis.totalIssuesFound > 0) {
      console.log('\n📋 Next Steps:');
      console.log('1. Review blog-formatting-diagnosis.md for detailed analysis');
      console.log('2. Run correction system to fix identified issues');
      console.log('3. Validate corrections and ensure 100% success rate');
    } else {
      console.log('\n🎉 All articles are perfectly formatted!');
    }
    
    console.log('\n📄 Reports saved:');
    console.log('- blog-formatting-diagnosis.md (human-readable)');
    console.log('- blog-formatting-diagnosis.json (machine-readable)');
    
  } catch (error) {
    console.error('💥 Diagnosis failed:', error);
    process.exit(1);
  }
}

main();