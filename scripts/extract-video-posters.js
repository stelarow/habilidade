#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);

// Obter __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações
const PUBLIC_PATH = path.join(__dirname, '..', 'public');
const CASES_PATH = path.join(PUBLIC_PATH, 'assets', 'projetista-3d', 'cases');

// Lista de vídeos para processar
const videos = [
  // Carol Orofino
  'carol-orofino/video externo.mp4',
  
  // Debora Chiquetti
  'debora-chiquetti/animacao-sala.mp4',
  'debora-chiquetti/animacao-painel.mp4',
  
  // Elton Santa Madeira
  'elton-santa-madeira/The_camera_stand_202508271725.mp4',
  'elton-santa-madeira/The_camera_dont_202508261226.mp4',
  
  // Patricia Ricardo Moveis
  'patricia-ricardo-moveis/video-salao-beleza.mp4',
  'patricia-ricardo-moveis/video-cozinha.mp4',
  'patricia-ricardo-moveis/video-sala.mp4'
];

// Função para verificar se ffmpeg está instalado
async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    return false;
  }
}

// Função para extrair frame usando ffmpeg
async function extractFrameWithFFmpeg(videoPath, posterPath) {
  try {
    // Extrai frame no segundo 1 do vídeo (ou 0 se o vídeo for muito curto)
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${posterPath}" -y`;
    await execAsync(command);
    console.log(`✓ Poster criado: ${path.basename(posterPath)}`);
    return true;
  } catch (error) {
    // Tenta extrair o primeiro frame se falhar no segundo 1
    try {
      const fallbackCommand = `ffmpeg -i "${videoPath}" -ss 00:00:00 -vframes 1 -q:v 2 "${posterPath}" -y`;
      await execAsync(fallbackCommand);
      console.log(`✓ Poster criado (primeiro frame): ${path.basename(posterPath)}`);
      return true;
    } catch (fallbackError) {
      console.error(`✗ Erro ao criar poster para ${path.basename(videoPath)}:`, fallbackError.message);
      return false;
    }
  }
}

// Função para criar um placeholder de poster (fallback se ffmpeg não estiver disponível)
async function createPlaceholderPoster(videoPath, posterPath) {
  // Cria um arquivo HTML que será usado como indicador
  const placeholderContent = `<!-- Placeholder para poster de vídeo -->
<!-- Execute o script com ffmpeg instalado para gerar o poster real -->
<!-- Vídeo: ${path.basename(videoPath)} -->`;
  
  const placeholderPath = posterPath.replace('.jpg', '.placeholder.txt');
  fs.writeFileSync(placeholderPath, placeholderContent);
  console.log(`⚠ Placeholder criado para ${path.basename(videoPath)} (instale ffmpeg para gerar posters reais)`);
  return false;
}

// Função principal
async function main() {
  console.log('🎬 Iniciando extração de posters dos vídeos...\n');
  
  const hasFFmpeg = await checkFFmpeg();
  
  if (!hasFFmpeg) {
    console.log('⚠️  ffmpeg não encontrado. Instalação recomendada:');
    console.log('   Windows: winget install ffmpeg');
    console.log('   Linux/WSL: sudo apt-get install ffmpeg');
    console.log('   Mac: brew install ffmpeg\n');
    console.log('Criando placeholders por enquanto...\n');
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const videoRelPath of videos) {
    const videoPath = path.join(CASES_PATH, videoRelPath);
    const posterName = path.basename(videoRelPath, path.extname(videoRelPath)) + '-poster.jpg';
    const posterPath = path.join(path.dirname(videoPath), posterName);
    
    // Verifica se o vídeo existe
    if (!fs.existsSync(videoPath)) {
      console.log(`⚠ Vídeo não encontrado: ${videoRelPath}`);
      failCount++;
      continue;
    }
    
    // Extrai o frame ou cria placeholder
    let success;
    if (hasFFmpeg) {
      success = await extractFrameWithFFmpeg(videoPath, posterPath);
    } else {
      success = await createPlaceholderPoster(videoPath, posterPath);
    }
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n✅ Processo concluído!`);
  console.log(`   Posters criados: ${successCount}`);
  if (failCount > 0) {
    console.log(`   Falhas: ${failCount}`);
  }
  
  if (!hasFFmpeg) {
    console.log('\n💡 Dica: Instale ffmpeg e execute novamente para gerar posters reais.');
  }
}

// Executa o script
main().catch(console.error);