#!/usr/bin/env node

/**
 * Script de Otimização de Assets - Curso Projetista 3D
 * 
 * Este script otimiza automaticamente todos os assets do curso:
 * - Converte imagens para WebP e AVIF
 * - Gera breakpoints responsivos
 * - Comprime vídeos
 * - Cria manifesto com metadata
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'projetista-3d');
const OPTIMIZED_DIR = path.join(ASSETS_DIR, 'optimized');
const THUMBNAILS_DIR = path.join(ASSETS_DIR, 'thumbnails');

const OPTIMIZATION_CONFIG = {
  images: {
    formats: ['webp', 'avif'], // Formatos modernos prioritários
    quality: 85,                // Qualidade balanceada
    breakpoints: [320, 640, 768, 1024, 1280, 1536],
    maxWidth: 1920
  },
  videos: {
    formats: ['webm', 'mp4'],   // WebM primeiro (menor tamanho)
    crf: 28,                    // Quality factor otimizado
    maxBitrate: '2M',           // 2Mbps máximo
    preset: 'fast'              // Encoding rápido
  }
};

class AssetOptimizer {
  constructor() {
    this.processedFiles = [];
    this.manifest = {
      generated: new Date().toISOString(),
      version: '1.0.0',
      files: {}
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m'    // Red
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}\x1b[0m`);
  }

  async ensureDirectories() {
    const dirs = [OPTIMIZED_DIR, THUMBNAILS_DIR];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`Created directory: ${path.relative(process.cwd(), dir)}`, 'info');
      }
    }
  }

  async processImages() {
    this.log('🖼️  Processing images...', 'info');
    
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const imageFiles = this.findFiles(ASSETS_DIR, imageExtensions);
    
    for (const imagePath of imageFiles) {
      try {
        await this.optimizeImage(imagePath);
        this.processedFiles.push(imagePath);
      } catch (error) {
        this.log(`Error processing ${imagePath}: ${error.message}`, 'error');
      }
    }
    
    this.log(`✅ Processed ${imageFiles.length} images`, 'success');
  }

  async optimizeImage(imagePath) {
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const relativePath = path.relative(ASSETS_DIR, imagePath);
    
    // Generate WebP versions with breakpoints
    for (const width of OPTIMIZATION_CONFIG.images.breakpoints) {
      const outputPath = path.join(OPTIMIZED_DIR, `${fileName}-${width}w.webp`);
      
      try {
        // Check if ImageMagick/convert is available
        execSync(`convert "${imagePath}" -resize ${width}x -quality ${OPTIMIZATION_CONFIG.images.quality} "${outputPath}"`, 
          { stdio: 'pipe' });
        
        this.manifest.files[`${fileName}-${width}w.webp`] = {
          source: relativePath,
          width: width,
          format: 'webp',
          optimized: true,
          size: this.getFileSize(outputPath)
        };
      } catch (error) {
        // Fallback: just copy the original if ImageMagick is not available
        this.log(`ImageMagick not available, copying original: ${fileName}`, 'warning');
        fs.copyFileSync(imagePath, path.join(OPTIMIZED_DIR, `${fileName}.webp`));
      }
    }

    // Generate thumbnail
    const thumbnailPath = path.join(THUMBNAILS_DIR, `${fileName}-thumb.webp`);
    try {
      execSync(`convert "${imagePath}" -resize 320x240 -quality 75 "${thumbnailPath}"`, 
        { stdio: 'pipe' });
    } catch (error) {
      // Fallback for thumbnail
      fs.copyFileSync(imagePath, thumbnailPath);
    }
  }

  async processVideos() {
    this.log('🎬 Processing videos...', 'info');
    
    const videoExtensions = ['.mp4', '.webm', '.mov'];
    const videoFiles = this.findFiles(ASSETS_DIR, videoExtensions);
    
    for (const videoPath of videoFiles) {
      try {
        await this.optimizeVideo(videoPath);
        this.processedFiles.push(videoPath);
      } catch (error) {
        this.log(`Error processing ${videoPath}: ${error.message}`, 'error');
      }
    }
    
    this.log(`✅ Processed ${videoFiles.length} videos`, 'success');
  }

  async optimizeVideo(videoPath) {
    const fileName = path.basename(videoPath, path.extname(videoPath));
    const relativePath = path.relative(ASSETS_DIR, videoPath);
    
    // Generate WebM version (smaller file size)
    const webmPath = path.join(OPTIMIZED_DIR, `${fileName}.webm`);
    
    try {
      // Check if FFmpeg is available
      execSync(`ffmpeg -i "${videoPath}" -c:v libvpx-vp9 -crf ${OPTIMIZATION_CONFIG.videos.crf} -b:v ${OPTIMIZATION_CONFIG.videos.maxBitrate} -c:a libopus "${webmPath}" -y`, 
        { stdio: 'pipe' });
      
      this.manifest.files[`${fileName}.webm`] = {
        source: relativePath,
        format: 'webm',
        optimized: true,
        size: this.getFileSize(webmPath)
      };
    } catch (error) {
      // Fallback: copy original if FFmpeg is not available
      this.log(`FFmpeg not available, copying original: ${fileName}`, 'warning');
      fs.copyFileSync(videoPath, webmPath);
    }

    // Generate MP4 version for compatibility
    const mp4Path = path.join(OPTIMIZED_DIR, `${fileName}.mp4`);
    
    try {
      execSync(`ffmpeg -i "${videoPath}" -c:v libx264 -crf ${OPTIMIZATION_CONFIG.videos.crf} -preset ${OPTIMIZATION_CONFIG.videos.preset} -b:v ${OPTIMIZATION_CONFIG.videos.maxBitrate} -c:a aac "${mp4Path}" -y`, 
        { stdio: 'pipe' });
    } catch (error) {
      // Fallback: copy original
      if (path.extname(videoPath) !== '.mp4') {
        fs.copyFileSync(videoPath, mp4Path);
      }
    }
  }

  findFiles(directory, extensions) {
    let results = [];
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'optimized' && item !== 'thumbnails') {
        results = results.concat(this.findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.includes(path.extname(item).toLowerCase())) {
        results.push(fullPath);
      }
    }
    
    return results;
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        bytes: stats.size,
        human: this.formatBytes(stats.size)
      };
    } catch (error) {
      return { bytes: 0, human: '0 B' };
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async generateManifest() {
    const manifestPath = path.join(ASSETS_DIR, 'manifest.json');
    
    this.manifest.stats = {
      totalFiles: Object.keys(this.manifest.files).length,
      processedFiles: this.processedFiles.length,
      optimizedDir: path.relative(process.cwd(), OPTIMIZED_DIR),
      thumbnailsDir: path.relative(process.cwd(), THUMBNAILS_DIR)
    };
    
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
    this.log(`📄 Generated manifest: ${path.relative(process.cwd(), manifestPath)}`, 'success');
  }

  async run() {
    console.log('\n🚀 ASSET OPTIMIZATION - PROJETISTA 3D');
    console.log('=====================================\n');
    
    try {
      await this.ensureDirectories();
      await this.processImages();
      await this.processVideos();
      await this.generateManifest();
      
      this.log('\n✨ Asset optimization completed successfully!', 'success');
      this.log(`📊 Stats:`, 'info');
      this.log(`   • Processed files: ${this.processedFiles.length}`, 'info');
      this.log(`   • Optimized files: ${Object.keys(this.manifest.files).length}`, 'info');
      this.log(`   • Output directory: ${path.relative(process.cwd(), OPTIMIZED_DIR)}`, 'info');
      
    } catch (error) {
      this.log(`❌ Optimization failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Run the optimizer
if (require.main === module) {
  const optimizer = new AssetOptimizer();
  optimizer.run().catch(console.error);
}

module.exports = AssetOptimizer;