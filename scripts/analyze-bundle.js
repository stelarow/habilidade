#!/usr/bin/env node

// Script para análise de bundle e otimizações implementadas
// Run: npm run analyze:bundle

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = {
  lazyComponents: false,
  lazyBackgrounds: false,
  headerLazy: false,
  codeSplitting: false,
  terser: false,
  dropConsole: false,
  treeShake: false
};

// Check lazy loading
const lazyComponentsPath = path.join(__dirname, '../src/components/LazyComponents.jsx');
const lazyBackgroundsPath = path.join(__dirname, '../src/components/LazyBackgrounds.jsx');
checks.lazyComponents = fs.existsSync(lazyComponentsPath);
checks.lazyBackgrounds = fs.existsSync(lazyBackgroundsPath);

const headerPath = path.join(__dirname, '../src/components/Header.jsx');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf-8');
  checks.headerLazy = headerContent.includes('LazyMegaMenu') && headerContent.includes('LazyMobileMegaMenu');
}

// Check Vite optimizations
const viteConfigPath = path.join(__dirname, '../vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf-8');
  checks.codeSplitting = viteContent.includes('manualChunks');
  checks.terser = viteContent.includes('terserOptions');
  checks.dropConsole = viteContent.includes('drop_console: true');
  checks.treeShake = viteContent.includes('treeshake');
}

// Summary output
const passed = Object.values(checks).filter(Boolean).length;
const total = Object.keys(checks).length;

console.log(`📊 Bundle analysis: ${passed}/${total} optimizations active`);

if (passed < total) {
  const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  console.log(`   Missing: ${missing.join(', ')}`);
}
