#!/usr/bin/env node

/**
 * Script de Otimização Simplificada - Curso Projetista 3D
 * Versão compatível com Netlify (sem dependências externas)
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'projetista-3d');
const OPTIMIZED_DIR = path.join(ASSETS_DIR, 'optimized');
const THUMBNAILS_DIR = path.join(ASSETS_DIR, 'thumbnails');

class SimpleAssetOptimizer {
  constructor() {
    this.manifest = {
      generated: new Date().toISOString(),
      version: '1.0.0',
      files: {},
      note: 'Simplified optimization for Netlify build - assets copied as-is'
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }

  async ensureDirectories() {
    const dirs = [OPTIMIZED_DIR, THUMBNAILS_DIR];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`Created directory: ${path.relative(process.cwd(), dir)}`);
      }
    }
  }

  findFiles(directory, extensions) {
    let results = [];
    
    if (!fs.existsSync(directory)) {
      return results;
    }
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      
      if (!fs.existsSync(fullPath)) continue;
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'optimized' && item !== 'thumbnails') {
        results = results.concat(this.findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.includes(path.extname(item).toLowerCase())) {
        results.push(fullPath);
      }
    }
    
    return results;
  }

  async processAssets() {
    this.log('📁 Processing assets (simple copy mode)...');
    
    // Process images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const imageFiles = this.findFiles(ASSETS_DIR, imageExtensions);
    
    for (const imagePath of imageFiles) {
      try {
        const fileName = path.basename(imagePath);
        const copyPath = path.join(OPTIMIZED_DIR, fileName);
        
        // Skip if file doesn't exist or can't be accessed
        if (!fs.existsSync(imagePath)) {
          this.log(`⚠️ Skipping non-existent file: ${imagePath}`);
          continue;
        }
        
        // Ensure source file is readable
        try {
          fs.accessSync(imagePath, fs.constants.R_OK);
        } catch (err) {
          this.log(`⚠️ Cannot read file: ${imagePath}`);
          continue;
        }
        
        if (!fs.existsSync(copyPath)) {
          fs.copyFileSync(imagePath, copyPath);
        }
        
        // Create simple thumbnail (copy original for now)
        const thumbnailPath = path.join(THUMBNAILS_DIR, fileName);
        if (!fs.existsSync(thumbnailPath) && !imagePath.includes('/thumbnails/')) {
          fs.copyFileSync(imagePath, thumbnailPath);
        }
        
        this.manifest.files[fileName] = {
          source: path.relative(ASSETS_DIR, imagePath),
          optimized: false,
          note: 'Copied as-is (no external tools available)'
        };
      } catch (error) {
        this.log(`Error processing ${imagePath}: ${error.message}`);
      }
    }
    
    // Process videos
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    const videoFiles = this.findFiles(ASSETS_DIR, videoExtensions);
    
    for (const videoPath of videoFiles) {
      try {
        const fileName = path.basename(videoPath);
        const copyPath = path.join(OPTIMIZED_DIR, fileName);
        
        if (!fs.existsSync(copyPath)) {
          fs.copyFileSync(videoPath, copyPath);
        }
        
        this.manifest.files[fileName] = {
          source: path.relative(ASSETS_DIR, videoPath),
          optimized: false,
          note: 'Copied as-is (no external tools available)'
        };
      } catch (error) {
        this.log(`Error processing ${videoPath}: ${error.message}`);
      }
    }
    
    this.log(`✅ Processed ${imageFiles.length} images and ${videoFiles.length} videos`);
  }

  async generateManifest() {
    const manifestPath = path.join(ASSETS_DIR, 'manifest.json');
    
    this.manifest.stats = {
      totalFiles: Object.keys(this.manifest.files).length,
      optimizedDir: path.relative(process.cwd(), OPTIMIZED_DIR),
      thumbnailsDir: path.relative(process.cwd(), THUMBNAILS_DIR)
    };
    
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
    this.log(`📄 Generated manifest: ${path.relative(process.cwd(), manifestPath)}`);
  }

  async run() {
    console.log('\n🚀 SIMPLE ASSET OPTIMIZATION - PROJETISTA 3D');
    console.log('=============================================\n');
    
    try {
      await this.ensureDirectories();
      await this.processAssets();
      await this.generateManifest();
      
      this.log('\n✨ Simple asset optimization completed!');
      this.log('📊 Note: Assets copied as-is (optimization requires external tools)');
      
    } catch (error) {
      this.log(`❌ Optimization failed: ${error.message}`);
      // Don't exit with error - just warn
      console.warn('Continuing build without asset optimization...');
    }
  }
}

// Run the optimizer
if (require.main === module) {
  const optimizer = new SimpleAssetOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = SimpleAssetOptimizer;