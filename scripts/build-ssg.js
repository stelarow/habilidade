#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🚀 Starting vite-react-ssg build with clean exit handling...');

// Create a promise-based wrapper for the build process
function runSSGBuild() {
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npx', ['vite-react-ssg', 'build'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true
    });

    let buildCompleted = false;
    let forceExitTimeout;

    // Handle successful completion
    buildProcess.on('close', (code) => {
      if (buildCompleted) return;
      buildCompleted = true;
      
      if (forceExitTimeout) {
        clearTimeout(forceExitTimeout);
      }

      if (code === 0) {
        console.log('✅ vite-react-ssg build completed successfully');
        resolve(code);
      } else {
        console.error(`❌ Build failed with exit code ${code}`);
        reject(new Error(`Build process exited with code ${code}`));
      }
    });

    // Handle process errors
    buildProcess.on('error', (error) => {
      if (buildCompleted) return;
      buildCompleted = true;
      
      if (forceExitTimeout) {
        clearTimeout(forceExitTimeout);
      }

      console.error('❌ Build process error:', error);
      reject(error);
    });

    // Force exit after 10 minutes if the process hangs (SSG needs time to render pages)
    forceExitTimeout = setTimeout(() => {
      if (buildCompleted) return;
      buildCompleted = true;

      console.log('⚠️ Build process taking too long (10min timeout), forcing exit...');
      buildProcess.kill('SIGTERM');

      // Give it 10 more seconds for graceful shutdown
      setTimeout(() => {
        if (buildProcess.exitCode === null) {
          console.log('🔥 Force killing build process...');
          buildProcess.kill('SIGKILL');
        }
        // Don't resolve as successful if we had to force kill
        reject(new Error('Build process timed out after 10 minutes'));
      }, 10_000);
    }, 600_000); // 10 minutes timeout
  });
}

// Main execution
async function main() {
  try {
    const startTime = Date.now();
    await runSSGBuild();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`🎉 Build completed in ${duration}s`);

    // Após o build SSG completar, transformar meta tags HTML
    const { transformHtmlMeta } = await import('./transform-html-meta.js');
    await transformHtmlMeta();

    // Após as meta tags, executar injeção de CSS crítico
    const { injectCriticalCSS } = await import('./inject-critical-css.js');
    await injectCriticalCSS();

    process.exit(0);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Handle process signals to ensure clean shutdown
process.on('SIGINT', () => {
  console.log('\n⚠️ Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

main();