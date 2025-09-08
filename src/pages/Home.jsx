import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import TrustedCompanies from '../components/TrustedCompanies';
import LatestBlogSection from '../components/LatestBlogSection';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEOHead from '../components/shared/SEOHead';

function Home() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Escola Habilidade',
    description: 'Escola de cursos profissionalizantes em São José SC, especializada em Informática, SketchUp, AutoCAD, Revit, Marketing Digital e Programação.',
    url: 'https://www.escolahabilidade.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol',
      addressLocality: 'São José',
      addressRegion: 'SC',
      addressCountry: 'BR',
      postalCode: '88102-280'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-27.5969',
      longitude: '-48.6356'
    },
    telephone: '+55 48 98855-9491',
    openingHours: 'Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00',
    areaServed: [
      {
        '@type': 'City',
        name: 'São José',
        '@id': 'https://www.wikidata.org/wiki/Q986378'
      },
      {
        '@type': 'City', 
        name: 'Florianópolis',
        '@id': 'https://www.wikidata.org/wiki/Q25444'
      },
      {
        '@type': 'City',
        name: 'Palhoça',
        '@id': 'https://www.wikidata.org/wiki/Q986369'
      }
    ]
  };

  return (
    <>
      <SEOHead 
        title="Cursos em São José SC | Escola Habilidade - Informática, AutoCAD, SketchUp"
        description="Escola de cursos profissionalizantes em São José SC, Kobrasol. Cursos de Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação e IA. Certificado reconhecido. Aulas presenciais e online na Grande Florianópolis."
        keywords="cursos são josé sc, escola técnica são josé, cursos profissionalizantes são josé, curso informática são josé, curso sketchup são josé, curso autocad são josé, curso revit são josé, marketing digital são josé, programação são josé, cursos técnicos grande florianópolis, escola habilidade kobrasol"
        path="/"
        type="website"
        schemaData={schemaData}
      />
      <Hero />
      <Courses />
      <HowItWorksSimple />
      <Reviews />
      <TrustedCompanies variant="home" />
      <LatestBlogSection />
      <ContactForm />
      <FAQ />
    </>
  );
}

// Loader function for SSG (não requer dados externos)
export function loader() {
  return null;
}

// Export both default and Component for vite-react-ssg compatibility
export default Home;
export { Home as Component }; 