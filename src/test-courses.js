// Script simples para testar a integridade dos dados dos cursos
import COURSES_DATA from './data/coursesData.js';
import { validateCourseData } from './data/coursesSchema.js';

function testCoursesData() {
  console.log('🧪 TESTANDO DADOS DOS CURSOS\n');
  
  const report = {
    total: COURSES_DATA.length,
    valid: 0,
    invalid: 0,
    errors: []
  };
  
  console.log(`📊 Total de cursos: ${report.total}\n`);
  
  // Testar cada curso
  COURSES_DATA.forEach((course, index) => {
    const validation = validateCourseData(course);
    
    if (validation.isValid) {
      report.valid++;
      console.log(`✅ ${course.basicInfo.title} - VÁLIDO`);
    } else {
      report.invalid++;
      console.log(`❌ ${course.basicInfo.title || `Curso ${index}`} - INVÁLIDO`);
      console.log(`   Erros: ${validation.errors.join(', ')}`);
      report.errors.push({
        course: course.basicInfo.title || `Curso ${index}`,
        errors: validation.errors
      });
    }
  });
  
  console.log('\n📈 RESUMO:');
  console.log(`✅ Válidos: ${report.valid}`);
  console.log(`❌ Inválidos: ${report.invalid}`);
  
  if (report.invalid === 0) {
    console.log('\n🎉 TODOS OS CURSOS ESTÃO VÁLIDOS!');
  } else {
    console.log('\n⚠️ ALGUNS CURSOS PRECISAM DE CORREÇÃO');
  }
  
  return report;
}

// Executar teste
testCoursesData(); 