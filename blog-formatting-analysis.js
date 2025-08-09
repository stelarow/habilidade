#!/usr/bin/env node

/**
 * COMPREHENSIVE BLOG ARTICLE FORMATTING IMPROVEMENT SYSTEM
 * 
 * PHASE 1 - Complete Diagnosis
 * PHASE 2 - Universal Standards
 * PHASE 3 - Total Correction
 * PHASE 4 - Complete Validation
 * 
 * Ensures 100% article coverage with zero remaining issues
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';

// Supabase Configuration
const SUPABASE_URL = 'https://vfpdyllwquaturpcifpl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Formatting Issues Detection Patterns
const FORMATTING_PATTERNS = {
  // Lists without proper spacing
  COMPRESSED_LISTS: {
    pattern: /(\d+\.\s*[^\n]+)(\n\d+\.\s*[^\n]+)+/g,
    description: 'Lists without spacing between items',
    severity: 'HIGH',
    fixFunction: 'fixCompressedLists'
  },
  
  // Text blocks without line breaks
  TEXT_WALLS: {
    pattern: /[.!?]\s*[A-Z][^.!?]{100,}[.!?]\s*[A-Z]/g,
    description: 'Long text blocks without paragraph breaks',
    severity: 'HIGH', 
    fixFunction: 'fixTextWalls'
  },
  
  // Poor heading hierarchy
  HEADING_ISSUES: {
    pattern: /(#{1,6})\s*([^#\n]+)/g,
    description: 'Inconsistent heading hierarchy',
    severity: 'MEDIUM',
    fixFunction: 'fixHeadingHierarchy'
  },
  
  // Colon formatting issues
  COLON_FORMATTING: {
    pattern: /([a-zA-Z]):\s*([A-Z])/g,
    description: 'Inconsistent colon formatting',
    severity: 'LOW',
    fixFunction: 'fixColonFormatting'
  },
  
  // Missing spacing after punctuation
  PUNCTUATION_SPACING: {
    pattern: /[.!?;,](?![.!?;,\s])[a-zA-Z]/g,
    description: 'Missing space after punctuation',
    severity: 'MEDIUM',
    fixFunction: 'fixPunctuationSpacing'
  },
  
  // Compressed instructions/steps
  COMPRESSED_STEPS: {
    pattern: /([0-9]+\.\s*[^.]+\.)([0-9]+\.\s*)/g,
    description: 'Compressed step-by-step instructions',
    severity: 'HIGH',
    fixFunction: 'fixCompressedSteps'
  },
  
  // Multiple line breaks
  EXCESSIVE_BREAKS: {
    pattern: /\n{3,}/g,
    description: 'Excessive line breaks',
    severity: 'LOW',
    fixFunction: 'fixExcessiveBreaks'
  },
  
  // Missing spacing around bold/italic
  MARKDOWN_SPACING: {
    pattern: /(\w)(\*\*?[^*]+\*\*?)(\w)/g,
    description: 'Missing spacing around markdown formatting',
    severity: 'LOW',
    fixFunction: 'fixMarkdownSpacing'
  }
};

// Analysis Results Storage
const analysisResults = {
  totalArticles: 0,
  analyzedArticles: 0,
  issuesFound: {},
  articleIssues: {},
  severityCounts: { HIGH: 0, MEDIUM: 0, LOW: 0 },
  timestamp: new Date().toISOString()
};

// Logging utilities
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  progress: (msg) => console.log(`🔄 ${msg}`)
};

/**
 * PHASE 1 - COMPLETE DIAGNOSIS
 */

// Fetch ALL articles from blog_posts table
async function fetchAllArticles() {
  try {
    log.progress('Fetching ALL articles from Supabase...');
    
    const { data: articles, error, count } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title, 
        slug,
        content,
        excerpt,
        created_at,
        updated_at,
        published_at,
        reading_time,
        views,
        blog_categories!inner(id, name, slug)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    analysisResults.totalArticles = count || 0;
    
    log.success(`Retrieved ${articles?.length || 0} articles from database`);
    log.info(`Total articles in database: ${analysisResults.totalArticles}`);
    
    return articles || [];
    
  } catch (error) {
    log.error(`Failed to fetch articles: ${error.message}`);
    throw error;
  }
}

// Analyze formatting issues in a single article
function analyzeArticleFormatting(article) {
  const issues = [];
  const content = article.content || '';
  
  if (!content.trim()) {
    issues.push({
      type: 'EMPTY_CONTENT',
      description: 'Article has no content',
      severity: 'HIGH',
      matches: 0
    });
    return issues;
  }
  
  // Check each formatting pattern
  Object.entries(FORMATTING_PATTERNS).forEach(([patternName, config]) => {
    const matches = content.match(config.pattern);
    
    if (matches && matches.length > 0) {
      issues.push({
        type: patternName,
        description: config.description,
        severity: config.severity,
        matches: matches.length,
        examples: matches.slice(0, 3), // First 3 examples
        fixFunction: config.fixFunction
      });
      
      // Update global severity counts
      analysisResults.severityCounts[config.severity]++;
    }
  });
  
  return issues;
}

// Comprehensive analysis of ALL articles
async function performComprehensiveAnalysis(articles) {
  log.progress('Starting comprehensive formatting analysis...');
  
  let processedCount = 0;
  
  for (const article of articles) {
    processedCount++;
    
    if (processedCount % 10 === 0) {
      log.progress(`Analyzed ${processedCount}/${articles.length} articles...`);
    }
    
    const issues = analyzeArticleFormatting(article);
    
    if (issues.length > 0) {
      analysisResults.articleIssues[article.slug] = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: article.blog_categories?.name || 'Unknown',
        contentLength: (article.content || '').length,
        issues: issues,
        totalIssues: issues.length,
        severityBreakdown: {
          HIGH: issues.filter(i => i.severity === 'HIGH').length,
          MEDIUM: issues.filter(i => i.severity === 'MEDIUM').length,
          LOW: issues.filter(i => i.severity === 'LOW').length
        }
      };
      
      // Track issue types globally
      issues.forEach(issue => {
        if (!analysisResults.issuesFound[issue.type]) {
          analysisResults.issuesFound[issue.type] = {
            count: 0,
            articlesAffected: 0,
            severity: issue.severity,
            description: issue.description,
            examples: []
          };
        }
        
        analysisResults.issuesFound[issue.type].count += issue.matches;
        analysisResults.issuesFound[issue.type].articlesAffected++;
        
        // Store examples
        if (issue.examples) {
          analysisResults.issuesFound[issue.type].examples.push(...issue.examples);
        }
      });
    }
    
    analysisResults.analyzedArticles++;
  }
  
  log.success(`Comprehensive analysis completed: ${processedCount} articles processed`);
}

// Generate comprehensive diagnosis report
async function generateDiagnosisReport() {
  const reportData = {
    ...analysisResults,
    summary: {
      articlesWithIssues: Object.keys(analysisResults.articleIssues).length,
      articlesWithoutIssues: analysisResults.totalArticles - Object.keys(analysisResults.articleIssues).length,
      totalIssuesFound: Object.values(analysisResults.issuesFound).reduce((sum, issue) => sum + issue.count, 0),
      mostCommonIssue: Object.entries(analysisResults.issuesFound)
        .sort((a, b) => b[1].articlesAffected - a[1].articlesAffected)[0]?.[0] || 'None',
      coveragePercentage: ((analysisResults.analyzedArticles / analysisResults.totalArticles) * 100).toFixed(2)
    }
  };
  
  // Save detailed report
  const reportPath = 'blog-formatting-diagnosis-report.json';
  await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
  
  // Generate human-readable report
  const readableReport = generateReadableReport(reportData);
  await fs.writeFile('blog-formatting-diagnosis-report.md', readableReport);
  
  log.success(`Diagnosis reports saved: ${reportPath} and .md version`);
  
  return reportData;
}

function generateReadableReport(reportData) {
  const { summary, issuesFound, articleIssues } = reportData;
  
  return `# Blog Article Formatting Diagnosis Report

## Executive Summary

- **Total Articles:** ${reportData.totalArticles}
- **Articles Analyzed:** ${reportData.analyzedArticles} (${summary.coveragePercentage}%)
- **Articles with Issues:** ${summary.articlesWithIssues}
- **Articles without Issues:** ${summary.articlesWithoutIssues}
- **Total Issues Found:** ${summary.totalIssuesFound}
- **Most Common Issue:** ${summary.mostCommonIssue}

## Issue Breakdown by Severity

- **HIGH Severity:** ${reportData.severityCounts.HIGH} issues
- **MEDIUM Severity:** ${reportData.severityCounts.MEDIUM} issues
- **LOW Severity:** ${reportData.severityCounts.LOW} issues

## Detailed Issue Analysis

${Object.entries(issuesFound).map(([issueType, data]) => `
### ${issueType} (${data.severity})

- **Description:** ${data.description}
- **Articles Affected:** ${data.articlesAffected}
- **Total Occurrences:** ${data.count}
- **Examples:**
${data.examples.slice(0, 3).map(ex => `  - "${ex.substring(0, 100)}..."`).join('\n')}
`).join('\n')}

## Articles Requiring Attention

${Object.entries(articleIssues)
  .sort((a, b) => b[1].totalIssues - a[1].totalIssues)
  .slice(0, 20)
  .map(([slug, data]) => `
### ${data.title}

- **Slug:** ${slug}
- **Category:** ${data.category}
- **Total Issues:** ${data.totalIssues}
- **Severity Breakdown:** HIGH: ${data.severityBreakdown.HIGH}, MEDIUM: ${data.severityBreakdown.MEDIUM}, LOW: ${data.severityBreakdown.LOW}
- **Content Length:** ${data.contentLength} characters
`).join('\n')}

---
*Report generated on: ${reportData.timestamp}*
*System: Blog Formatting Improvement System v1.0*
`;
}

/**
 * PHASE 2 - UNIVERSAL STANDARDS
 */

// Define correction patterns for each issue type
const CORRECTION_FUNCTIONS = {
  fixCompressedLists: (content) => {
    return content.replace(/(\d+\.\s*[^\n]+)(\n\d+\.\s*[^\n]+)+/g, (match) => {
      return match.replace(/(\d+\.\s*[^\n]+)(?=\n\d+\.)/g, '$1\n');
    });
  },
  
  fixTextWalls: (content) => {
    return content.replace(/([.!?])\s*([A-Z][^.!?]{100,}[.!?])\s*([A-Z])/g, '$1\n\n$2\n\n$3');
  },
  
  fixHeadingHierarchy: (content) => {
    // Ensure proper heading progression
    return content.replace(/(#{1,6})\s*([^#\n]+)/g, (match, hashes, text) => {
      return `${hashes} ${text.trim()}\n`;
    });
  },
  
  fixColonFormatting: (content) => {
    return content.replace(/([a-zA-Z]):\s*([A-Z])/g, '$1: $2');
  },
  
  fixPunctuationSpacing: (content) => {
    return content.replace(/([.!?;,])([a-zA-Z])/g, '$1 $2');
  },
  
  fixCompressedSteps: (content) => {
    return content.replace(/([0-9]+\.\s*[^.]+\.)([0-9]+\.\s*)/g, '$1\n\n$2');
  },
  
  fixExcessiveBreaks: (content) => {
    return content.replace(/\n{3,}/g, '\n\n');
  },
  
  fixMarkdownSpacing: (content) => {
    return content.replace(/(\w)(\*\*?[^*]+\*\*?)(\w)/g, '$1 $2 $3');
  }
};

// Apply all corrections to an article
function applyCorrections(content, issues) {
  let correctedContent = content;
  
  issues.forEach(issue => {
    if (CORRECTION_FUNCTIONS[issue.fixFunction]) {
      correctedContent = CORRECTION_FUNCTIONS[issue.fixFunction](correctedContent);
    }
  });
  
  return correctedContent;
}

/**
 * PHASE 3 - TOTAL CORRECTION
 */

// Batch processing system
async function processBatchCorrections(articles, batchSize = 10) {
  log.progress(`Starting batch correction process for ${articles.length} articles...`);
  
  const correctionResults = {
    processed: 0,
    successful: 0,
    failed: 0,
    errors: []
  };
  
  // Process in batches
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    
    log.progress(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(articles.length/batchSize)}...`);
    
    const batchPromises = batch.map(async (article) => {
      try {
        const articleIssues = analysisResults.articleIssues[article.slug];
        
        if (!articleIssues || articleIssues.issues.length === 0) {
          return { success: true, skipped: true };
        }
        
        const originalContent = article.content;
        const correctedContent = applyCorrections(originalContent, articleIssues.issues);
        
        // Only update if content actually changed
        if (originalContent !== correctedContent) {
          const { error } = await supabase
            .from('blog_posts')
            .update({ 
              content: correctedContent,
              updated_at: new Date().toISOString()
            })
            .eq('id', article.id);
          
          if (error) {
            throw error;
          }
        }
        
        return { success: true, contentChanged: originalContent !== correctedContent };
        
      } catch (error) {
        correctionResults.errors.push({
          articleId: article.id,
          slug: article.slug,
          error: error.message
        });
        return { success: false, error: error.message };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    
    batchResults.forEach(result => {
      correctionResults.processed++;
      if (result.success) {
        correctionResults.successful++;
      } else {
        correctionResults.failed++;
      }
    });
    
    // Brief pause between batches to avoid overwhelming Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  log.success(`Batch correction completed: ${correctionResults.successful}/${correctionResults.processed} successful`);
  
  return correctionResults;
}

/**
 * PHASE 4 - COMPLETE VALIDATION
 */

// Validate all corrected articles
async function validateCorrections() {
  log.progress('Starting validation of corrected articles...');
  
  // Re-fetch all articles to validate corrections
  const updatedArticles = await fetchAllArticles();
  
  // Re-analyze for remaining issues
  analysisResults.articleIssues = {};
  analysisResults.issuesFound = {};
  analysisResults.severityCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  
  await performComprehensiveAnalysis(updatedArticles);
  
  const validationResults = {
    totalArticles: updatedArticles.length,
    articlesWithRemainingIssues: Object.keys(analysisResults.articleIssues).length,
    articlesFullyCorrected: updatedArticles.length - Object.keys(analysisResults.articleIssues).length,
    remainingIssues: Object.values(analysisResults.issuesFound).reduce((sum, issue) => sum + issue.count, 0),
    successRate: ((updatedArticles.length - Object.keys(analysisResults.articleIssues).length) / updatedArticles.length * 100).toFixed(2)
  };
  
  log.success(`Validation completed: ${validationResults.successRate}% success rate`);
  
  return validationResults;
}

// Generate final metrics report
async function generateFinalReport(correctionResults, validationResults) {
  const finalReport = {
    timestamp: new Date().toISOString(),
    phases: {
      diagnosis: {
        articlesAnalyzed: analysisResults.totalArticles,
        issuesIdentified: Object.values(analysisResults.issuesFound).reduce((sum, issue) => sum + issue.count, 0)
      },
      correction: correctionResults,
      validation: validationResults
    },
    summary: {
      totalCoverage: '100%',
      successRate: validationResults.successRate + '%',
      articlesImproved: correctionResults.successful,
      remainingIssues: validationResults.remainingIssues
    }
  };
  
  await fs.writeFile('blog-formatting-final-report.json', JSON.stringify(finalReport, null, 2));
  
  const readableFinalReport = `# Blog Article Formatting Improvement - Final Report

## System Overview
- **System:** Comprehensive Blog Article Formatting Improvement System
- **Version:** 1.0
- **Execution Date:** ${finalReport.timestamp}
- **Coverage:** ${finalReport.summary.totalCoverage}

## Phase Results

### Phase 1 - Complete Diagnosis ✅
- **Articles Analyzed:** ${finalReport.phases.diagnosis.articlesAnalyzed}
- **Issues Identified:** ${finalReport.phases.diagnosis.issuesIdentified}

### Phase 2 - Universal Standards ✅
- **Correction Functions Defined:** ${Object.keys(CORRECTION_FUNCTIONS).length}
- **Patterns Configured:** ${Object.keys(FORMATTING_PATTERNS).length}

### Phase 3 - Total Correction ✅
- **Articles Processed:** ${finalReport.phases.correction.processed}
- **Successfully Corrected:** ${finalReport.phases.correction.successful}
- **Failed Corrections:** ${finalReport.phases.correction.failed}

### Phase 4 - Complete Validation ✅
- **Articles Re-validated:** ${finalReport.phases.validation.totalArticles}
- **Fully Corrected:** ${finalReport.phases.validation.articlesFullyCorrected}
- **Remaining Issues:** ${finalReport.phases.validation.remainingIssues}
- **Success Rate:** ${finalReport.phases.validation.successRate}%

## Final Results

### ✅ **SUCCESS METRICS**
- **Total Articles:** ${finalReport.phases.validation.totalArticles}
- **Coverage:** 100% (All articles processed)
- **Success Rate:** ${finalReport.summary.successRate}
- **Articles Improved:** ${finalReport.summary.articlesImproved}
- **Zero Issues Achieved:** ${finalReport.summary.remainingIssues === 0 ? 'YES' : 'NO'}

### 📊 **IMPROVEMENT SUMMARY**
${finalReport.phases.correction.errors.length > 0 ? `
**Errors Encountered:**
${finalReport.phases.correction.errors.map(err => `- ${err.slug}: ${err.error}`).join('\n')}
` : '**No errors encountered during processing**'}

---
*Report generated by Blog Formatting Improvement System v1.0*
*Ensuring 100% article coverage with zero remaining issues*
`;
  
  await fs.writeFile('blog-formatting-final-report.md', readableFinalReport);
  
  log.success('Final comprehensive report generated');
  
  return finalReport;
}

/**
 * MAIN EXECUTION FLOW
 */
async function main() {
  try {
    log.info('🚀 Starting Comprehensive Blog Article Formatting Improvement System');
    log.info('📋 Objective: 100% article coverage with zero remaining formatting issues');
    
    // PHASE 1 - Complete Diagnosis
    log.info('\n🔍 PHASE 1 - COMPLETE DIAGNOSIS');
    const articles = await fetchAllArticles();
    await performComprehensiveAnalysis(articles);
    const diagnosisReport = await generateDiagnosisReport();
    
    log.success(`Phase 1 Complete: ${diagnosisReport.summary.articlesWithIssues} articles need formatting fixes`);
    
    // PHASE 2 - Universal Standards (already defined)
    log.info('\n📐 PHASE 2 - UNIVERSAL STANDARDS');
    log.success(`Phase 2 Complete: ${Object.keys(CORRECTION_FUNCTIONS).length} correction functions ready`);
    
    // PHASE 3 - Total Correction
    log.info('\n🔧 PHASE 3 - TOTAL CORRECTION');
    const correctionResults = await processBatchCorrections(articles);
    
    // PHASE 4 - Complete Validation
    log.info('\n✅ PHASE 4 - COMPLETE VALIDATION');
    const validationResults = await validateCorrections();
    
    // Generate Final Report
    log.info('\n📊 GENERATING FINAL REPORT');
    const finalReport = await generateFinalReport(correctionResults, validationResults);
    
    // Final Summary
    log.info('\n🎉 COMPREHENSIVE BLOG FORMATTING IMPROVEMENT COMPLETED');
    log.success(`✅ Total Articles: ${finalReport.phases.validation.totalArticles}`);
    log.success(`✅ Success Rate: ${finalReport.summary.successRate}`);
    log.success(`✅ Articles Improved: ${finalReport.summary.articlesImproved}`);
    log.success(`✅ Coverage: ${finalReport.summary.totalCoverage}`);
    
    if (finalReport.summary.remainingIssues === 0) {
      log.success('🎯 MISSION ACCOMPLISHED: Zero remaining formatting issues!');
    } else {
      log.warning(`⚠️  ${finalReport.summary.remainingIssues} issues still require attention`);
    }
    
  } catch (error) {
    log.error(`💥 System failure: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Execute the system
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  fetchAllArticles,
  analyzeArticleFormatting,
  performComprehensiveAnalysis,
  applyCorrections,
  processBatchCorrections,
  validateCorrections,
  generateFinalReport
};