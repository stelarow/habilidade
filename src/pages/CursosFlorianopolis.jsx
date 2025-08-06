import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaClock } from 'react-icons/fa';

const CursosFlorianopolis = () => {
  const cursos = [
    { nome: 'Informática Completa', slug: 'informatica', destaque: true },
    { nome: 'SketchUp + Enscape', slug: 'sketchup-enscape', destaque: true },
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
    name: 'Escola Habilidade - Florianópolis',
    description: 'Cursos profissionalizantes em Florianópolis: Informática, SketchUp, AutoCAD, Revit, Marketing Digital e mais.',
    url: 'https://www.escolahabilidade.com/cursos-florianopolis',
    areaServed: {
      '@type': 'City',
      name: 'Florianópolis',
      '@id': 'https://www.wikidata.org/wiki/Q25444'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São José',
      addressRegion: 'SC',
      addressCountry: 'BR',
      postalCode: '88102-280',
      streetAddress: 'Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol'
    },
    telephone: '+55 48 98855-9491',
    openingHours: 'Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cursos Disponíveis em Florianópolis',
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
        title="Cursos Profissionalizantes em Florianópolis - Escola Habilidade"
        description="Cursos técnicos e profissionalizantes em Florianópolis. Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Certificado reconhecido. Matrículas abertas!"
        keywords="cursos florianópolis, escola técnica florianópolis, curso informática florianópolis, curso sketchup florianópolis, curso autocad florianópolis, curso revit florianópolis, cursos profissionalizantes florianópolis"
        path="/cursos-florianopolis"
        schemaData={schemaData}
      />

      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="block text-5xl md:text-6xl gradient-text mb-2">Escola Habilidade</span>
                <span className="text-2xl md:text-3xl text-purple-400 font-medium">
                  Cursos Profissionalizantes em Florianópolis
                </span>
              </h1>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                Os melhores cursos técnicos e profissionalizantes para moradores de 
                Florianópolis e região. Transforme sua carreira com nossos cursos certificados.
              </p>
            </div>

            {/* Localização */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-zinc-800">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-purple-400" />
                Atendemos toda a Grande Florianópolis
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Localização:</h3>
                  <p className="text-zinc-300">
                    Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol<br />
                    São José - SC, 88102-280<br />
                    <span className="text-sm text-zinc-400">
                      (Próximo a Florianópolis - 15 min do centro)
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">Contato:</h3>
                  <p className="text-zinc-300">
                    <FaPhone className="inline mr-2" /> (48) 98855-9491<br />
                    <FaWhatsapp className="inline mr-2 text-green-400" /> (48) 98855-9491<br />
                    <FaClock className="inline mr-2" /> Seg-Ter-Qui: 8h-20h | Qua: 8h-22h | Sex: 8h-17h30 | Sáb: 8h-12h
                  </p>
                </div>
              </div>
            </div>

            {/* Cursos em Destaque */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Cursos Mais Procurados em Florianópolis
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
                    <p className="text-zinc-400 text-sm mb-4">
                      Certificado reconhecido • Aulas presenciais e online
                    </p>
                    <span className="text-purple-400 font-semibold group-hover:text-purple-300">
                      Saiba mais →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Todos os Cursos */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Todos os Cursos Disponíveis
              </h2>
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <ul className="grid md:grid-cols-2 gap-4">
                  {cursos.map((curso) => (
                    <li key={curso.slug}>
                      <Link
                        to={`/cursos/${curso.slug}`}
                        className="flex items-center text-zinc-300 hover:text-purple-400 transition-colors"
                      >
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                        {curso.nome}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Por que escolher */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6">
                Por que a Escola Habilidade é a Melhor Escolha em Florianópolis?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">✓ Certificado Reconhecido</h3>
                  <p className="text-zinc-300 text-sm">
                    Nossos certificados são reconhecidos em todo o mercado de trabalho da Grande Florianópolis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">✓ Professores Especializados</h3>
                  <p className="text-zinc-300 text-sm">
                    Instrutores com experiência prática no mercado de Florianópolis e região.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">✓ Material Didático Incluso</h3>
                  <p className="text-zinc-300 text-sm">
                    Apostilas e materiais completos inclusos no valor do curso.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">✓ Flexibilidade de Horários</h3>
                  <p className="text-zinc-300 text-sm">
                    Aulas presenciais e online, com horários flexíveis para sua rotina.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Comece Hoje Mesmo!
              </h2>
              <p className="text-xl text-zinc-300 mb-8">
                Matrículas abertas para todos os cursos. Vagas limitadas!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/5548988559491?text=Olá! Vim do site e quero informações sobre os cursos em Florianópolis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Falar no WhatsApp
                </a>
                <Link
                  to="/contato"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105"
                >
                  Solicitar Informações
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CursosFlorianopolis;