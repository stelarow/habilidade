#!/usr/bin/env node

/**
 * Script para converter imagens JPG/PNG para WebP
 * Uso: node scripts/convert-images-to-webp.js [pasta]
 *
 * Este script:
 * 1. Converte imagens para WebP mantendo qualidade alta
 * 2. Gera múltiplas resoluções para responsive images
 * 3. Mantém arquivos originais como fallback
 * 4. Otimiza tamanhos drasticamente
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];
const RESPONSIVE_SIZES = [320, 640, 960, 1280];
const WEBP_QUALITY = 85;
const JPEG_QUALITY = 80;

async function convertImageToWebP(inputPath, outputPath, width = null) {
  try {
    let pipeline = sharp(inputPath);

    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    return stats.size;
  } catch (error) {
    console.error(`Erro ao converter ${inputPath}:`, error.message);
    return 0;
  }
}

async function optimizeOriginal(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    let pipeline = sharp(inputPath);

    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true });
    } else if (ext === '.png') {
      pipeline = pipeline.png({ compressionLevel: 9, progressive: true });
    }

    await pipeline.toFile(outputPath);

    const stats = fs.statSync(outputPath);
    return stats.size;
  } catch (error) {
    console.error(`Erro ao otimizar ${inputPath}:`, error.message);
    return 0;
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function processImage(imagePath) {
  const originalStats = fs.statSync(imagePath);
  const originalSize = originalStats.size;

  console.log(`\n📸 Processando: ${imagePath}`);
  console.log(`   Tamanho original: ${formatFileSize(originalSize)}`);

  const dir = path.dirname(imagePath);
  const name = path.parse(imagePath).name;
  const ext = path.extname(imagePath);

  let totalSaved = 0;
  let filesCreated = 0;

  try {
    // 1. Criar versão WebP original
    const webpPath = path.join(dir, `${name}.webp`);
    const webpSize = await convertImageToWebP(imagePath, webpPath);
    if (webpSize > 0) {
      console.log(`   ✅ WebP criado: ${formatFileSize(webpSize)} (${Math.round((1 - webpSize/originalSize) * 100)}% menor)`);
      totalSaved += originalSize - webpSize;
      filesCreated++;
    }

    // 2. Criar versões responsivas em WebP
    for (const width of RESPONSIVE_SIZES) {
      const responsiveWebpPath = path.join(dir, `${name}-${width}.webp`);
      const responsiveSize = await convertImageToWebP(imagePath, responsiveWebpPath, width);
      if (responsiveSize > 0) {
        console.log(`   ✅ WebP ${width}w: ${formatFileSize(responsiveSize)}`);
        filesCreated++;
      }
    }

    // 3. Criar versões responsivas do formato original
    for (const width of RESPONSIVE_SIZES) {
      const responsiveOriginalPath = path.join(dir, `${name}-${width}${ext}`);
      try {
        await sharp(imagePath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .toFile(responsiveOriginalPath);

        const stats = fs.statSync(responsiveOriginalPath);
        console.log(`   ✅ ${ext.slice(1).toUpperCase()} ${width}w: ${formatFileSize(stats.size)}`);
        filesCreated++;
      } catch (error) {
        console.error(`   ❌ Erro ao criar ${responsiveOriginalPath}:`, error.message);
      }
    }

    // 4. Otimizar original se ainda não existe versão otimizada
    const optimizedPath = path.join(dir, `${name}-original${ext}`);
    if (!fs.existsSync(optimizedPath)) {
      fs.copyFileSync(imagePath, optimizedPath);
      const optimizedSize = await optimizeOriginal(optimizedPath, optimizedPath);
      if (optimizedSize > 0) {
        console.log(`   ✅ Original otimizado: ${formatFileSize(optimizedSize)}`);
      }
    }

    console.log(`   📊 Total de arquivos criados: ${filesCreated}`);
    console.log(`   💾 Economia estimada: ${formatFileSize(totalSaved)}`);

    return { filesCreated, saved: totalSaved };

  } catch (error) {
    console.error(`   ❌ Erro ao processar ${imagePath}:`, error.message);
    return { filesCreated: 0, saved: 0 };
  }
}

async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let totalFiles = 0;
  let totalSaved = 0;

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subResults = await processDirectory(filePath);
      totalFiles += subResults.files;
      totalSaved += subResults.saved;
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        const result = await processImage(filePath);
        totalFiles += result.filesCreated;
        totalSaved += result.saved;
      }
    }
  }

  return { files: totalFiles, saved: totalSaved };
}

async function main() {
  const targetDir = process.argv[2] || 'public/assets/informatica-nova';

  if (!fs.existsSync(targetDir)) {
    console.error(`❌ Diretório não encontrado: ${targetDir}`);
    process.exit(1);
  }

  console.log(`🚀 Iniciando conversão de imagens em: ${targetDir}`);
  console.log(`📋 Formatos suportados: ${SUPPORTED_FORMATS.join(', ')}`);
  console.log(`📐 Tamanhos responsivos: ${RESPONSIVE_SIZES.map(s => s + 'w').join(', ')}`);
  console.log(`⚙️  Qualidade WebP: ${WEBP_QUALITY}%, JPEG: ${JPEG_QUALITY}%`);

  const startTime = Date.now();
  const results = await processDirectory(targetDir);
  const endTime = Date.now();

  console.log(`\n🎉 Conversão concluída!`);
  console.log(`📁 Arquivos criados: ${results.files}`);
  console.log(`💾 Espaço economizado: ${formatFileSize(results.saved)}`);
  console.log(`⏱️  Tempo total: ${((endTime - startTime) / 1000).toFixed(1)}s`);

  console.log(`\n💡 Próximos passos:`);
  console.log(`   1. Verificar se as imagens WebP foram criadas corretamente`);
  console.log(`   2. Atualizar componentes para usar OptimizedImage`);
  console.log(`   3. Testar carregamento em diferentes navegadores`);
  console.log(`   4. Fazer commit das novas imagens otimizadas`);
}

// Verificar se Sharp está instalado
try {
  require('sharp');
} catch (error) {
  console.error('❌ Sharp não está instalado. Execute: npm install sharp --save-dev');
  process.exit(1);
}

main().catch(console.error);