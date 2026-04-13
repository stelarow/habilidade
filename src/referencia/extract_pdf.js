const fs = require('node:fs');
const pdf = require('pdf-parse');

async function extractPdfText() {
    try {
        // Ler o arquivo PDF
        const dataBuffer = fs.readFileSync('./conteudo_cursos.pdf');
        
        // Extrair texto
        const data = await pdf(dataBuffer);
        
        // Salvar texto extraído em arquivo
        fs.writeFileSync('./conteudo_cursos_texto.txt', data.text, 'utf8');
        
        console.log('✅ Texto extraído com sucesso!');
        console.log(`📄 Páginas: ${data.numpages}`);
        console.log(`📝 Caracteres: ${data.text.length}`);
        console.log('💾 Arquivo salvo como: conteudo_cursos_texto.txt');
        
    } catch (error) {
        console.error('❌ Erro ao extrair texto do PDF:', error.message);
    }
}

extractPdfText(); 