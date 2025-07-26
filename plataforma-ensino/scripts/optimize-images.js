#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script analyzes images in the project and provides optimization recommendations.
 * It can be run manually or integrated into the build process.
 */

const fs = require('fs')
const path = require('path')

// Configuration
const CONFIG = {
  publicDir: 'public',
  srcDir: 'src',
  maxFileSize: 1024 * 1024, // 1MB
  recommendedFormats: ['webp', 'avif', 'jpg', 'jpeg', 'png'],
  extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'],
}

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function findImages(dir, images = []) {
  try {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        // Skip node_modules and .next directories
        if (!file.startsWith('.') && file !== 'node_modules') {
          findImages(filePath, images)
        }
      } else {
        const ext = path.extname(file).toLowerCase()
        if (CONFIG.extensions.includes(ext)) {
          images.push({
            path: filePath,
            name: file,
            size: stat.size,
            extension: ext,
            directory: path.dirname(filePath),
          })
        }
      }
    }
  } catch (error) {
    log(`Error reading directory ${dir}: ${error.message}`, 'red')
  }
  
  return images
}

function analyzeImages(images) {
  const analysis = {
    total: images.length,
    totalSize: 0,
    largeFiles: [],
    unoptimizedFormats: [],
    recommendations: [],
  }
  
  for (const image of images) {
    analysis.totalSize += image.size
    
    // Check for large files
    if (image.size > CONFIG.maxFileSize) {
      analysis.largeFiles.push(image)
    }
    
    // Check for unoptimized formats
    if (['.png', '.jpg', '.jpeg'].includes(image.extension)) {
      analysis.unoptimizedFormats.push(image)
    }
  }
  
  // Generate recommendations
  if (analysis.largeFiles.length > 0) {
    analysis.recommendations.push({
      type: 'size',
      message: `${analysis.largeFiles.length} files are larger than ${formatFileSize(CONFIG.maxFileSize)}`,
      action: 'Consider compressing these files or using Next.js Image optimization',
    })
  }
  
  if (analysis.unoptimizedFormats.length > 0) {
    analysis.recommendations.push({
      type: 'format',
      message: `${analysis.unoptimizedFormats.length} files could benefit from modern formats`,
      action: 'Consider converting to WebP or AVIF format, or use Next.js Image component',
    })
  }
  
  return analysis
}

function generateReport(images, analysis) {
  log('\n🖼️  IMAGE OPTIMIZATION REPORT', 'bold')
  log('=' .repeat(50), 'cyan')
  
  log(`\n📊 Summary:`, 'blue')
  log(`   Total images: ${analysis.total}`)
  log(`   Total size: ${formatFileSize(analysis.totalSize)}`)
  
  if (analysis.largeFiles.length > 0) {
    log(`\n⚠️  Large files (>${formatFileSize(CONFIG.maxFileSize)}):`, 'yellow')
    for (const file of analysis.largeFiles) {
      log(`   • ${file.path} (${formatFileSize(file.size)})`, 'yellow')
    }
  }
  
  if (analysis.unoptimizedFormats.length > 0) {
    log(`\n🔄 Files that could be optimized:`, 'yellow')
    for (const file of analysis.unoptimizedFormats.slice(0, 10)) {
      log(`   • ${file.path} (${file.extension.toUpperCase()})`, 'yellow')
    }
    if (analysis.unoptimizedFormats.length > 10) {
      log(`   ... and ${analysis.unoptimizedFormats.length - 10} more`, 'yellow')
    }
  }
  
  if (analysis.recommendations.length > 0) {
    log(`\n💡 Recommendations:`, 'green')
    for (const rec of analysis.recommendations) {
      log(`   ${rec.message}`, 'green')
      log(`   → ${rec.action}`, 'cyan')
    }
  }
  
  log(`\n🚀 Next.js Image Optimization Features:`, 'blue')
  log(`   • Automatic WebP/AVIF conversion`, 'cyan')
  log(`   • Responsive image sizing`, 'cyan')
  log(`   • Lazy loading by default`, 'cyan')
  log(`   • Placeholder blur effects`, 'cyan')
  log(`   • Quality optimization (85% default)`, 'cyan')
  
  log(`\n📚 Usage Example:`, 'blue')
  log(`   import OptimizedImage from '@/components/ui/OptimizedImage'`, 'cyan')
  log(`   
   <OptimizedImage
     src="/images/hero.jpg"
     alt="Hero image"
     width={800}
     height={600}
     quality={90}
     priority={true}
   />`, 'cyan')
  
  if (analysis.total === 0) {
    log(`\n✅ No images found in the project.`, 'green')
    log(`   This is good for initial bundle size!`, 'green')
  } else if (analysis.recommendations.length === 0) {
    log(`\n✅ All images appear to be optimized!`, 'green')
  }
  
  log('\n' + '=' .repeat(50), 'cyan')
}

function main() {
  log('🔍 Scanning for images...', 'blue')
  
  const images = findImages('.')
  const analysis = analyzeImages(images)
  
  generateReport(images, analysis)
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { findImages, analyzeImages, generateReport }