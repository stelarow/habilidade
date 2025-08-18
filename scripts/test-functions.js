#!/usr/bin/env node

/**
 * Script para testar todas as Netlify Functions localmente
 * Útil para desenvolvimento e troubleshooting
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configurações de teste
const FUNCTIONS = [
  {
    name: 'health-check',
    method: 'GET',
    description: 'Verifica saúde da aplicação'
  },
  {
    name: 'contact-handler',
    method: 'POST',
    payload: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message from the function testing script.'
    },
    description: 'Testa processamento de formulário de contato'
  },
  {
    name: 'dev-logger',
    method: 'GET',
    querystring: 'type=debug&source=test-script&message=Testing dev logger function',
    description: 'Testa sistema de logging de desenvolvimento'
  },
  {
    name: 'blog-analytics',
    method: 'POST',
    payload: {
      event: 'blog_read',
      slug: 'historia-sketchup-software-arquitetura',
      readingTime: 300,
      scrollDepth: 85,
      timeOnPage: 180
    },
    description: 'Testa analytics do blog'
  }
];

const BASE_URL = 'http://localhost:9999/.netlify/functions';

/**
 * Função principal
 */
async function main() {
  console.log('🧪 Iniciando testes das Netlify Functions...\n');
  
  // Verificar se o servidor está rodando
  const isServerRunning = await checkServerStatus();
  
  if (!isServerRunning) {
    console.log('❌ Servidor de functions não está rodando');
    console.log('💡 Execute: npm run functions:serve ou npm run functions:dev\n');
    return;
  }
  
  console.log('✅ Servidor de functions está rodando\n');
  
  // Testar cada function
  let passedTests = 0;
  let totalTests = FUNCTIONS.length;
  
  for (const func of FUNCTIONS) {
    console.log(`📋 Testando: ${func.name}`);
    console.log(`   Descrição: ${func.description}`);
    
    const result = await testFunction(func);
    
    if (result.success) {
      console.log(`   ✅ Sucesso (${result.statusCode}) - ${result.duration}ms`);
      passedTests++;
    } else {
      console.log(`   ❌ Falhou (${result.statusCode}) - ${result.error}`);
    }
    
    console.log(''); // Linha em branco
  }
  
  // Relatório final
  console.log('📊 Relatório Final:');
  console.log(`   Testes passaram: ${passedTests}/${totalTests}`);
  console.log(`   Taxa de sucesso: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('   🎉 Todos os testes passaram!');
  } else {
    console.log('   ⚠️ Alguns testes falharam. Verifique os logs acima.');
  }
}

/**
 * Verifica se o servidor de functions está rodando
 */
async function checkServerStatus() {
  try {
    const response = await fetch(`${BASE_URL}/health-check`);
    return response.status < 500;
  } catch (error) {
    return false;
  }
}

/**
 * Testa uma function específica
 */
async function testFunction(func) {
  const startTime = Date.now();
  
  try {
    let url = `${BASE_URL}/${func.name}`;
    
    const options = {
      method: func.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Adicionar query string se especificada
    if (func.querystring) {
      url += `?${func.querystring}`;
    }
    
    // Adicionar payload se especificado
    if (func.payload) {
      options.body = JSON.stringify(func.payload);
    }
    
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    // Log da resposta para debug
    if (process.env.VERBOSE) {
      const responseText = await response.clone().text();
      console.log(`   Response: ${responseText.substring(0, 200)}...`);
    }
    
    return {
      success: response.status < 400,
      statusCode: response.status,
      duration
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return {
      success: false,
      statusCode: 0,
      duration,
      error: error.message
    };
  }
}

/**
 * Testa function via CLI do Netlify (alternativo)
 */
async function testFunctionViaCLI(functionName, payload = null, querystring = null) {
  try {
    let command = `netlify functions:invoke ${functionName}`;
    
    if (payload) {
      command += ` --payload '${JSON.stringify(payload)}'`;
    }
    
    if (querystring) {
      command += ` --querystring "${querystring}"`;
    }
    
    const { stdout, stderr } = await execAsync(command);
    
    return {
      success: !stderr,
      output: stdout,
      error: stderr
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Executa testes de performance
 */
async function runPerformanceTests() {
  console.log('⚡ Executando testes de performance...\n');
  
  const performanceTests = [
    { name: 'health-check', expectedMaxTime: 1000 },
    { name: 'contact-handler', expectedMaxTime: 2000 },
    { name: 'dev-logger', expectedMaxTime: 500 },
    { name: 'blog-analytics', expectedMaxTime: 1500 }
  ];
  
  for (const test of performanceTests) {
    const times = [];
    
    // Executar 5 vezes para obter média
    for (let i = 0; i < 5; i++) {
      const func = FUNCTIONS.find(f => f.name === test.name);
      const result = await testFunction(func);
      times.push(result.duration);
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    
    console.log(`📊 ${test.name}:`);
    console.log(`   Tempo médio: ${avgTime.toFixed(1)}ms`);
    console.log(`   Min/Max: ${minTime}ms / ${maxTime}ms`);
    console.log(`   Status: ${maxTime <= test.expectedMaxTime ? '✅ OK' : '⚠️ LENTO'}`);
    console.log('');
  }
}

/**
 * Executa testes de stress
 */
async function runStressTests() {
  console.log('🔥 Executando testes de stress...\n');
  
  const concurrentRequests = 10;
  const promises = [];
  
  // Fazer múltiplas requisições simultâneas
  for (let i = 0; i < concurrentRequests; i++) {
    const func = FUNCTIONS[0]; // Usar health-check para stress test
    promises.push(testFunction(func));
  }
  
  const startTime = Date.now();
  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;
  
  const successCount = results.filter(r => r.success).length;
  
  console.log(`📊 Teste de Stress (${concurrentRequests} requisições simultâneas):`);
  console.log(`   Tempo total: ${totalTime}ms`);
  console.log(`   Sucessos: ${successCount}/${concurrentRequests}`);
  console.log(`   Taxa de sucesso: ${((successCount/concurrentRequests) * 100).toFixed(1)}%`);
  console.log('');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--performance')) {
    runPerformanceTests();
  } else if (args.includes('--stress')) {
    runStressTests();
  } else if (args.includes('--all')) {
    await main();
    await runPerformanceTests();
    await runStressTests();
  } else {
    main();
  }
}

export { testFunction, checkServerStatus, runPerformanceTests, runStressTests };