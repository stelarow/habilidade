/**
 * Script para testar backgrounds manualmente
 * Execute no console do navegador na página de curso
 */

// Testar sistema de debug
console.log('🎯 Iniciando teste manual dos backgrounds...');

// Ativar debug mode
localStorage.setItem('debug-backgrounds', 'true');
console.log('✅ Debug mode ativado');

// Verificar performance level
if (typeof window !== 'undefined') {
  // Simular hook usePerformanceLevel
  const testPerformance = () => {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const connection = navigator.connection?.effectiveType || '4g';
    
    console.log('📊 Métricas do dispositivo:');
    console.log(`  RAM: ${memory}GB`);
    console.log(`  Cores: ${cores}`);
    console.log(`  Conexão: ${connection}`);
    
    if (memory <= 2 || cores <= 2 || connection === 'slow-2g') {
      console.log('  Nível: LOW');
      return 'LOW';
    }
    if (memory <= 4 || cores <= 4 || connection === '3g') {
      console.log('  Nível: MEDIUM');
      return 'MEDIUM';
    }
    console.log('  Nível: HIGH');
    return 'HIGH';
  };
  
  const level = testPerformance();
  localStorage.setItem('force-performance-level', level);
}

// Instruções para teste manual
const instructions = `
🧪 COMO TESTAR OS BACKGROUNDS LOCALMENTE:

1. 📱 ABRIR O PREVIEW:
   → http://localhost:4173/habilidade/

2. 🎨 TESTAR PÁGINAS DE CURSOS:
   → http://localhost:4173/habilidade/cursos/projetista-3d
   → http://localhost:4173/habilidade/cursos/edicao-video
   → http://localhost:4173/habilidade/cursos/informatica
   → http://localhost:4173/habilidade/cursos/design-grafico
   → http://localhost:4173/habilidade/cursos/programacao
   → http://localhost:4173/habilidade/cursos/marketing-digital
   → http://localhost:4173/habilidade/cursos/inteligencia-artificial
   → http://localhost:4173/habilidade/cursos/business-intelligence

3. 🔍 VERIFICAR NO CONSOLE:
   → Abrir DevTools (F12)
   → Console deve mostrar logs de debug
   → Verificar se backgrounds carregam sem erro

4. ♿ TESTAR ACESSIBILIDADE:
   → Pressionar Ctrl+A para abrir controles
   → Testar redução de movimento
   → Testar alto contraste

5. 📊 TESTAR PERFORMANCE:
   → Aba Performance do DevTools
   → Verificar FPS das animações
   → Monitorar uso de memória

6. 🎯 VERIFICAR FALLBACKS:
   → localStorage.setItem('force-performance-level', 'LOW')
   → Reload da página
   → Deve mostrar background estático

✅ SUCESSO: Backgrounds únicos visíveis por curso
❌ FALHA: Background vazio ou erro no console

📝 RELATÓRIO: Anotar qual curso/teste apresentou problema
`;

console.log(instructions);

// Função para testar em cada curso
window.testBackgroundForCourse = (courseSlug) => {
  console.log(`🎨 Testando background para: ${courseSlug}`);
  
  // Simular navegação
  const url = `http://localhost:4173/habilidade/cursos/${courseSlug}`;
  console.log(`🔗 URL: ${url}`);
  
  // Verificar se existe background component
  const backgroundElement = document.querySelector('[class*="background"]') || 
                          document.querySelector('[class*="Background"]') ||
                          document.querySelector('.course-background');
  
  if (backgroundElement) {
    console.log('✅ Background element encontrado:', backgroundElement.className);
  } else {
    console.log('⚠️ Background element NÃO encontrado');
  }
  
  return backgroundElement;
};

// Lista de testes rápidos
window.runQuickTests = () => {
  const courses = [
    'projetista-3d', 'edicao-video', 'informatica', 'design-grafico',
    'programacao', 'marketing-digital', 'inteligencia-artificial', 'business-intelligence'
  ];
  
  console.log('🚀 Executando testes rápidos...');
  courses.forEach(course => {
    console.log(`\n--- ${course.toUpperCase()} ---`);
    // Log para cada curso
    console.log(`📝 Para testar: window.location.href = 'http://localhost:4173/habilidade/cursos/${course}'`);
  });
  
  console.log('\n✅ Execute os comandos acima para navegar entre os cursos');
  console.log('🔍 Observe as animações e backgrounds únicos');
};

console.log('\n🎮 COMANDOS DISPONÍVEIS:');
console.log('  window.testBackgroundForCourse("projetista-3d")');
console.log('  window.runQuickTests()');
console.log('\n🎯 Agora abra o preview e execute os testes!'); 