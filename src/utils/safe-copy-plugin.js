import fs from 'fs';
import path from 'path';

/**
 * Safe Copy Plugin for Vite
 * Handles file copying with retry logic and error handling
 */
export function createSafeCopyPlugin() {
  return {
    name: 'safe-copy-plugin',
    enforce: 'post',
    
    closeBundle() {
      const publicDir = path.resolve(process.cwd(), 'public');
      const distDir = path.resolve(process.cwd(), 'dist');
      
      // Files that should be copied to dist
      const filesToCopy = [
        'assets/projetista-3d/thumbnails',
        'assets/projetista-3d/optimized'
      ];
      
      filesToCopy.forEach(relativePath => {
        const srcPath = path.join(publicDir, relativePath);
        const destPath = path.join(distDir, relativePath);
        
        if (fs.existsSync(srcPath)) {
          try {
            // Ensure destination directory exists
            const destDirPath = path.dirname(destPath);
            if (!fs.existsSync(destDirPath)) {
              fs.mkdirSync(destDirPath, { recursive: true });
            }
            
            // Copy directory contents with retry logic
            copyDirectoryWithRetry(srcPath, destPath);
            console.log(`✅ Safely copied ${relativePath}`);
          } catch (error) {
            console.warn(`⚠️ Could not copy ${relativePath}: ${error.message}`);
            // Don't fail the build, just warn
          }
        }
      });
    }
  };
}

function copyDirectoryWithRetry(src, dest, retries = 3) {
  if (!fs.existsSync(src)) {
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectoryWithRetry(srcPath, destPath, retries);
    } else {
      let attempts = 0;
      let copied = false;
      
      while (attempts < retries && !copied) {
        try {
          // Check if source file exists and is readable
          if (fs.existsSync(srcPath)) {
            fs.accessSync(srcPath, fs.constants.R_OK);
            
            // Copy file
            fs.copyFileSync(srcPath, destPath);
            copied = true;
          } else {
            // File doesn't exist, skip it
            console.warn(`⚠️ File not found: ${srcPath}`);
            break;
          }
        } catch (error) {
          attempts++;
          if (attempts >= retries) {
            console.warn(`⚠️ Failed to copy ${entry.name} after ${retries} attempts: ${error.message}`);
          } else {
            // Wait a bit before retry
            const delay = attempts * 100; // Increasing delay
            const start = Date.now();
            while (Date.now() - start < delay) {
              // Simple synchronous delay
            }
          }
        }
      }
    }
  }
}