import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';
import { MapPin, Phone, WhatsappLogo, Clock, Car, Bus } from '@phosphor-icons/react';

const CursosPalhoca = () => {
  const cursos = [
    { nome: 'Informática Completa', slug: 'informatica', destaque: true },

    { nome: 'AutoCAD 2D e 3D', slug: 'autocad-2d-3d', destaque: true },
    { nome: 'Revit Architecture', slug: 'revit', destaque: true },
    { nome: 'Marketing Digital', slug: 'marketing-digital', destaque: true },
    { nome: 'Programação Full Stack', slug: 'programacao', destaque: false },
    { nome: 'Design Gráfico', slug: 'design-grafico', destaque: false },
    { nome: 'Edição de Vídeo', slug: 'edicao-video', destaque: false },
    { nome: 'Business Intelligence', slug: 'business-intelligence', destaque: false },
    { nome: 'Inteligência Artificial', slug: 'inteligencia-artificial', destaque: false },
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Escola Habilidade - Cursos em Palhoça SC',
    description: 'Cursos profissionalizantes para moradores de Palhoça. Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Próximo a Palhoça.',
    url: 'https://www.escolahabilidade.com/cursos-palhoca',
    areaServed: [
      {
        '@type': 'City',
        name: 'Palhoça',
        '@id': 'https://www.wikidata.org/wiki/Q986369'
      },
      {
        '@type': 'City',
        name: 'São José',
        '@id': 'https://www.wikidata.org/wiki/Q986378'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São José',
      addressRegion: 'SC',
      addressCountry: 'BR',
      postalCode: '88102-280',
      streetAddress: 'Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-27.5969',
      longitude: '-48.6356'
    },
    telephone: '+55 48 98855-9491',
    openingHours: 'Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cursos para Moradores de Palhoça',
      itemListElement: cursos.map(curso => ({
        '@type': 'Course',
        name: curso.nome,
        url: `https://www.escolahabilidade.com/cursos/${curso.slug}`,
        provider: {
          '@type': 'EducationalOrganization',
          name: 'Escola Habilidade'
        }
      }))
    }
  };

  return (
    <>
      <SEOHead
        title="Cursos em Palhoça SC - Escola Técnica Próxima | Informática, AutoCAD, Marketing"
        description="Cursos profissionalizantes para moradores de Palhoça SC. Escola localizada próxima, em São José. Cursos de Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Fácil acesso!"
        keywords="cursos palhoça sc, escola técnica palhoça, curso informática palhoça, curso autocad palhoça, curso sketchup palhoça, curso revit palhoça, cursos profissionalizantes palhoça, escola próxima palhoça"
        path="/cursos-palhoca"
        schemaData={schemaData}
      />

      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Cursos Profissionalizantes para <span className="text-purple-400">Palhoça SC</span>
              </h1>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                A Escola Habilidade está estrategicamente localizada próxima a Palhoça, 
                oferecendo os melhores cursos técnicos com fácil acesso para todos os 
                moradores da região.
              </p>
            </div>

            {/* Como Chegar de Palhoça */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="mr-3 text-purple-400" size={24} />
                Fácil Acesso para Moradores de Palhoça
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">📍 Nossa Localização:</h3>
                  <p className="text-zinc-300">
                    <strong>Rua Caetano José Ferreira, 426 - Sala 5</strong><br />
                    Kobrasol - São José/SC - CEP: 88102-280<br />
                    <span className="text-sm text-zinc-400 mt-2 block">
                      <strong>Apenas 15 minutos de Palhoça!</strong><br />
                      Via BR-101 ou SC-281
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">🚗 Como Chegar:</h3>
                  <div className="space-y-2 text-zinc-300 text-sm">
                    <div className="flex items-start">
                      <Car className="mr-2 mt-1 text-purple-400" size={16} />
                      <span><strong>De carro:</strong> 15-20 min via BR-101</span>
                    </div>
                    <div className="flex items-start">
                      <Bus className="mr-2 mt-1 text-purple-400" size={16} />
                      <span><strong>Ônibus:</strong> Linhas que conectam Palhoça-São José</span>
                    </div>
                    <div className="flex items-start">
                      <span className="mr-2">🅿️</span>
                      <span><strong>Estacionamento:</strong> Gratuito no local</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cursos em Destaque para Palhoça */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Cursos Mais Procurados por Alunos de Palhoça
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.filter(c => c.destaque).map((curso) => (
                  <Link
                    key={curso.slug}
                    to={`/cursos/${curso.slug}`}
                    className="group bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {curso.nome}
                    </h3>
                    <div className="text-zinc-400 text-sm mb-4">
                      <p className="mb-2">✓ Certificado reconhecido</p>
                      <p className="mb-2">✓ Material didático incluso</p>
                      <p>✓ Horários flexíveis</p>
                    </div>
                    <span className="text-purple-400 font-semibold group-hover:text-purple-300">
                      Saiba mais →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Regiões de Palhoça Atendidas */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Atendemos Todas as Regiões de Palhoça
              </h2>
              <p className="text-zinc-300 mb-4">
                Nossos alunos vêm de todos os bairros e regiões de Palhoça:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  'Centro', 'Ponte do Imaruim', 'Pedra Branca', 'Pagani',
                  'Jardim Eldorado', 'Bela Vista', 'Caminho Novo', 'Passa Vinte',
                  'Aririú', 'Barra do Aririú', 'Pachecos', 'Madri',
                  'São Sebastião', 'Brejarú', 'Enseada do Brito', 'Guarda do Embaú'
                ].map((bairro) => (
                  <div key={bairro} className="flex items-center text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    {bairro}
                  </div>
                ))}
              </div>
            </div>

            {/* Vantagens para Alunos de Palhoça */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  Vantagens Especiais para Palhoça
                </h3>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Horários especiais para quem trabalha em Florianópolis</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Turmas aos sábados para maior flexibilidade</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Modalidade online para quem prefere estudar de casa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Parcelamento facilitado em até 12x</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Descontos para grupos de amigos/família</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  Por Que Escolher Nossa Escola?
                </h3>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">🏆</span>
                    <span>Melhor escola técnica da região metropolitana</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">👨‍🏫</span>
                    <span>Professores com experiência no mercado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">💼</span>
                    <span>Encaminhamento para vagas de emprego</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">🖥️</span>
                    <span>Laboratórios modernos e equipados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">📚</span>
                    <span>Material didático completo incluso</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Depoimentos de Alunos de Palhoça */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                O Que Dizem Nossos Alunos de Palhoça
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-zinc-300 text-sm italic mb-3">
                    "Vale muito a pena o deslocamento! O curso de AutoCAD mudou minha carreira. 
                    Consegui um emprego antes mesmo de terminar o curso."
                  </p>
                  <p className="text-purple-400 font-semibold text-sm">
                    - Maria S., Pedra Branca
                  </p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-zinc-300 text-sm italic mb-3">
                    "A modalidade online foi perfeita para mim. Moro no Caminho Novo e consigo 
                    acompanhar todas as aulas sem problemas."
                  </p>
                  <p className="text-purple-400 font-semibold text-sm">
                    - João P., Caminho Novo
                  </p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-zinc-300 text-sm italic mb-3">
                    "Fiz o curso de Marketing Digital e hoje trabalho como freelancer. 
                    A escola tem ótima estrutura e professores excelentes!"
                  </p>
                  <p className="text-purple-400 font-semibold text-sm">
                    - Ana C., Centro
                  </p>
                </div>
              </div>
            </div>

            {/* Lista Completa de Cursos */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Todos os Cursos Disponíveis para Palhoça
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {cursos.map((curso) => (
                  <Link
                    key={curso.slug}
                    to={`/cursos/${curso.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                  >
                    <span className="text-zinc-300 group-hover:text-purple-400 transition-colors">
                      {curso.nome}
                    </span>
                    <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver detalhes →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comece Hoje Mesmo Seu Curso!
              </h2>
              <p className="text-xl text-zinc-300 mb-6">
                Não perca mais tempo! Invista no seu futuro profissional.
              </p>
              <p className="text-lg text-purple-300 mb-8">
                📍 Apenas 15 minutos de Palhoça • 🅿️ Estacionamento Gratuito
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/5548988559491?text=Olá! Sou de Palhoça e quero informações sobre os cursos da Escola Habilidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  <WhatsappLogo className="mr-2 text-xl" size={20} />
                  WhatsApp - Resposta Imediata
                </a>
                <a
                  href="tel:+5548988559491"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  <Phone className="mr-2" size={20} />
                  Ligar: (48) 98855-9491
                </a>
              </div>
              <p className="text-sm text-zinc-400 mt-6">
                Atendimento: Seg-Ter-Qui 8h-20h | Qua 8h-22h | Sex 8h-17h30 | Sáb 8h-12h
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CursosPalhoca;