#!/usr/bin/env node

/**
 * Script manual para testar redirects e canonical URLs
 * Executa com: node test-redirects.js
 */

import https from 'https';
import http from 'http';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkRedirect(url, expectedLocation = null, expectedStatus = 301) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
      const result = {
        url,
        status: res.statusCode,
        location: res.headers.location,
        success: res.statusCode === expectedStatus
      };
      
      if (expectedLocation) {
        result.success = result.success && result.location === expectedLocation;
      }
      
      resolve(result);
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
    req.end();
  });
}

function checkCanonical(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const canonicalMatch = data.match(/<link rel="canonical" href="([^"]+)"/);
        const canonical = canonicalMatch ? canonicalMatch[1] : null;
        
        resolve({
          url,
          canonical,
          hasCanonical: !!canonical
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
    req.end();
  });
}

async function testRedirects() {
  log('\n🔍 TESTANDO REDIRECTS DE DOMÍNIO', 'cyan');
  log('=====================================', 'cyan');
  
  const redirectTests = [
    {
      from: 'https://escolahabilidade.com',
      to: 'https://www.escolahabilidade.com/',
      description: 'escolahabilidade.com → www.escolahabilidade.com'
    },
    {
      from: 'https://escolahabilidade.com.br',
      to: 'https://www.escolahabilidade.com/',
      description: 'escolahabilidade.com.br → www.escolahabilidade.com'
    },
    {
      from: 'https://www.escolahabilidade.com.br',
      to: 'https://www.escolahabilidade.com/',
      description: 'www.escolahabilidade.com.br → www.escolahabilidade.com'
    },
    {
      from: 'https://escolahabilidade.com.br/blog',
      to: 'https://www.escolahabilidade.com/blog',
      description: 'Deep link .com.br/blog → .com/blog'
    }
  ];
  
  for (const test of redirectTests) {
    try {
      const result = await checkRedirect(test.from, test.to);
      
      if (result.success) {
        log(`✅ ${test.description}`, 'green');
        log(`   Status: ${result.status} → ${result.location}`, 'green');
      } else {
        log(`❌ ${test.description}`, 'red');
        log(`   Status: ${result.status}, Location: ${result.location || 'none'}`, 'red');
        log(`   Expected: 301 → ${test.to}`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${test.description}`, 'red');
      log(`   Erro: ${error.message}`, 'red');
    }
    
    console.log('');
  }
}

async function testCanonicalUrls() {
  log('\n🔍 TESTANDO CANONICAL URLs', 'cyan');
  log('============================', 'cyan');
  
  const canonicalTests = [
    {
      url: 'https://www.escolahabilidade.com',
      expected: 'https://www.escolahabilidade.com/',
      description: 'Homepage'
    },
    {
      url: 'https://www.escolahabilidade.com/blog',
      expected: 'https://www.escolahabilidade.com/blog',
      description: 'Blog page'
    },
    {
      url: 'https://www.escolahabilidade.com/cursos-florianopolis',
      expected: 'https://www.escolahabilidade.com/cursos-florianopolis',
      description: 'Cursos Florianópolis'
    }
  ];
  
  for (const test of canonicalTests) {
    try {
      const result = await checkCanonical(test.url);
      
      if (result.canonical === test.expected) {
        log(`✅ ${test.description}`, 'green');
        log(`   Canonical: ${result.canonical}`, 'green');
      } else {
        log(`❌ ${test.description}`, 'red');
        log(`   Canonical: ${result.canonical || 'not found'}`, 'red');
        log(`   Expected: ${test.expected}`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${test.description}`, 'red');
      log(`   Erro: ${error.message}`, 'red');
    }
    
    console.log('');
  }
}

async function main() {
  log('🚀 INICIANDO TESTES DE SEO - REDIRECTS E CANONICAL URLs', 'blue');
  log('=======================================================', 'blue');
  
  try {
    await testRedirects();
    await testCanonicalUrls();
    
    log('✅ TESTES CONCLUÍDOS', 'green');
    log('Para mais detalhes, execute os comandos curl manualmente:', 'yellow');
    log('curl -I https://www.escolahabilidade.com.br', 'cyan');
    log('curl -s https://www.escolahabilidade.com | grep canonical', 'cyan');
    
  } catch (error) {
    log(`❌ Erro durante os testes: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();