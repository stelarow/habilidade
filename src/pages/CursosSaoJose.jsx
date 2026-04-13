import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/shared/SEOHead';
import { MapPin, Phone, WhatsappLogo, Clock, GraduationCap } from '@phosphor-icons/react';
import { SaoJoseFAQ } from '../components/course/SaoJoseFAQ';

const CursosSaoJose = () => {
  // Descrições dos cursos para schemas
  const courseDescriptions = {
    'informatica': 'Windows, Word, Excel (fundamental ao avançado), PowerPoint',
    'autocad-2d-3d': 'AutoCAD 2D e 3D para projetos técnicos e arquitetônicos',
    'revit': 'Revit Architecture para projetos BIM e construção civil',
    'marketing-digital': 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics',
    'programacao': 'Lógica, Python, Java, PHP, Android Studio, Desenvolvimento de Jogos',
    'design-grafico': 'Photoshop, Illustrator, InDesign, Canva, Social Media',
    'edicao-video': 'Premiere, After Effects, DaVinci Resolve, Motion Graphics',
    'business-intelligence': 'Master Excel, Power BI, Dashboards, Storytelling de Dados',
    'inteligencia-artificial': 'Cursor, Prompt Engineering, ChatGPT, Claude, IA aplicada'
  };

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

  const schemaData = [
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Escola Habilidade - São José SC',
      description: 'Escola de cursos profissionalizantes em São José SC. Informática, SketchUp, AutoCAD, Revit, Marketing Digital.',
      url: 'https://www.escolahabilidade.com/cursos-sao-jose',
      areaServed: {
        '@type': 'City',
        name: 'São José',
        '@id': 'https://www.wikidata.org/wiki/Q986378'
      },
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
        name: 'Cursos Disponíveis em São José SC',
        itemListElement: cursos.map(curso => ({
          '@type': 'Course',
          name: curso.nome,
          description: courseDescriptions[curso.slug] || 'Curso profissionalizante com certificado reconhecido',
          url: `https://www.escolahabilidade.com/cursos/${curso.slug}`,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Escola Habilidade'
          }
        }))
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Onde fica a Escola Habilidade em São José?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Fica na Rua Caetano José Ferreira, 426 - Sala 5, no bairro Kobrasol em São José SC. É fácil de chegar! Fica perto da BR-101 e da SC-281, com ônibus que param perto e estacionamento na rua.'
          }
        },
        {
          '@type': 'Question',
          name: 'Qual o melhor curso em São José SC?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Escola Habilidade tem os melhores cursos profissionalizantes de São José! Oferecemos Informática, SketchUp, AutoCAD, Revit e Marketing Digital com turmas pequenas (até 4 alunos) e certificado nacional. Nota 5 estrelas e mais de 200 alunos formados.'
          }
        },
        {
          '@type': 'Question',
          name: 'Tem curso de SketchUp em São José SC?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim! O curso de SketchUp fica aqui no Kobrasol, São José. São 56 horas de aula presencial com turmas de até 4 alunos. Inclui SketchUp e Enscape (pra fazer imagens realistas). Certificado nacional e apostila de 360 páginas.'
          }
        },
        {
          '@type': 'Question',
          name: 'Quais os horários da Escola Habilidade?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Funcionamos de segunda a sábado! Segunda, terça e quinta das 8h às 20h. Quarta das 8h às 22h (pra quem trabalha o dia todo). Sexta das 8h às 17h30. Sábado das 8h às 12h. Temos turmas de manhã, tarde e noite.'
          }
        },
        {
          '@type': 'Question',
          name: 'A Escola Habilidade é boa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim! Temos nota 5 estrelas e mais de 200 avaliações positivas. Os alunos elogiam as turmas pequenas (só 4 pessoas), professor certificado pela Trimble, projetos reais em sala e discussões sobre casos do dia a dia. Estamos há mais de 10 anos em São José formando profissionais.'
          }
        },
        {
          '@type': 'Question',
          name: 'Quais cursos a Escola Habilidade oferece em São José?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oferecemos vários cursos profissionalizantes: Informática Completa, SketchUp com Enscape, AutoCAD 2D e 3D, Revit, Marketing Digital, Programação, Design Gráfico, Business Intelligence e Inteligência Artificial. Todos com certificado nacional.'
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Cursos em São José SC - Escola Técnica Habilidade | Informática, AutoCAD, SketchUp"
        description="Escola de cursos profissionalizantes em São José SC. Cursos de Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Localizada em Forquilhinhas. Certificado reconhecido!"
        keywords="cursos são josé sc, escola técnica são josé, curso informática são josé, curso sketchup são josé, curso autocad são josé, curso revit são josé, escola forquilhinhas, cursos profissionalizantes são josé"
        path="/cursos-sao-jose"
        schemaData={schemaData}
      />

      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Escola de Cursos em <span className="text-purple-400">São José SC</span>
              </h1>
              <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
                Localizada no Kobrasol, a Escola Habilidade é a principal escola técnica 
                de São José. Oferecemos cursos profissionalizantes com certificado reconhecido 
                em todo o mercado de trabalho.
              </p>
            </div>

            {/* Nossa Sede em São José */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <GraduationCap className="mr-3 text-purple-400" size={24} />
                Nossa Sede em São José - Kobrasol
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">📍 Endereço Completo:</h3>
                  <p className="text-zinc-300">
                    <strong>Rua Caetano José Ferreira, 426 - Sala 5</strong><br />
                    Bairro Kobrasol<br />
                    São José - SC, CEP: 88102-280<br />
                    <span className="text-sm text-zinc-400 mt-2 block">
                      Fácil acesso pela BR-101 e SC-281<br />
                      Próximo ao centro de São José
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">📞 Entre em Contato:</h3>
                  <p className="text-zinc-300">
                    <Phone className="inline mr-2" size={16} /> <strong>(48) 98855-9491</strong><br />
                    <WhatsappLogo className="inline mr-2 text-green-400" size={16} /> <strong>(48) 98855-9491</strong><br />
                    <Clock className="inline mr-2" size={16} /> <strong>Horários:</strong><br />
                    Seg-Ter e Qui: 8h às 20h<br />
                    Quarta: 8h às 22h<br />
                    Sexta: 8h às 17h30<br />
                    Sábado: 8h às 12h
                  </p>
                </div>
              </div>
            </div>

            {/* Cursos Mais Procurados em São José */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Cursos Mais Procurados em São José
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
                      ✓ Certificado reconhecido<br />
                      ✓ Material didático incluso<br />
                      ✓ Aulas práticas
                    </p>
                    <span className="text-purple-400 font-semibold group-hover:text-purple-300">
                      Ver detalhes do curso →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bairros Atendidos */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Atendemos Todos os Bairros de São José
              </h2>
              <p className="text-zinc-300 mb-4">
                Nossa escola no Kobrasol atende alunos de toda São José e região:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  'Kobrasol', 'Forquilhinhas', 'Campinas', 'Barreiros',
                  'Fazenda Santo Antônio', 'Bela Vista', 'Ipiranga', 'Roçado',
                  'Praia Comprida', 'Potecas', 'Areias', 'Jardim Cidade de Florianópolis',
                  'Serraria', 'Forquilhas', 'Picadas do Sul', 'Centro Histórico'
                ].map((bairro) => (
                  <div key={bairro} className="flex items-center text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    {bairro}
                  </div>
                ))}
              </div>
            </div>

            {/* Diferenciais */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  Por que Somos a Melhor Escola de São José?
                </h3>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Mais de 10 anos de experiência em São José</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Professores especializados e certificados</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Laboratórios equipados com tecnologia moderna</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Parcerias com empresas locais para estágios</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    <span>Taxa de empregabilidade de 85% dos alunos</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">
                  Modalidades de Ensino
                </h3>
                <div className="space-y-4 text-zinc-300">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">📚 Presencial</h4>
                    <p className="text-sm">
                      Aulas 100% presenciais em nossa sede do Kobrasol com 
                      toda infraestrutura necessária.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">💻 Online ao Vivo</h4>
                    <p className="text-sm">
                      Participe das aulas em tempo real de qualquer lugar, 
                      com suporte completo dos professores.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">🎯 Híbrido</h4>
                    <p className="text-sm">
                      Combine aulas presenciais e online conforme sua 
                      disponibilidade e necessidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista Completa de Cursos */}
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Todos os Cursos Disponíveis em São José
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
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <SaoJoseFAQ />
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Matricule-se Hoje na Melhor Escola de São José!
              </h2>
              <p className="text-xl text-zinc-300 mb-8">
                Vagas limitadas! Garanta seu futuro profissional com nossos cursos certificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/5548988559491?text=Olá! Vim do site e quero informações sobre os cursos da Escola Habilidade em São José"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  <WhatsappLogo className="mr-2 text-xl" size={20} />
                  Falar no WhatsApp Agora
                </a>
                <Link
                  to="/contato"
                  className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
                >
                  Agendar Visita à Escola
                </Link>
              </div>
              <p className="text-sm text-zinc-400 mt-6">
                📍 Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol, São José - SC
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CursosSaoJose;