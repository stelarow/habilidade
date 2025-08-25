import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import TrustedCompanies from '../components/TrustedCompanies';
import LatestBlogSection from '../components/LatestBlogSection';
import { LazyContactForm } from '../components/LazyComponents';
import FAQ from '../components/FAQ';
import SEOHead from '../components/shared/SEOHead';

function Home() {
  return (
    <>
      <SEOHead 
        title="Escola Habilidade - Cursos em Florianópolis e São José"
        description="Escola de cursos profissionalizantes em Florianópolis, São José e Palhoça. Cursos de Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação e IA. Certificado reconhecido. Aulas presenciais e online."
        keywords="cursos profissionalizantes florianópolis, escola técnica são josé sc, cursos informática palhoça, curso sketchup florianópolis, curso autocad são josé, curso revit palhoça, curso enscape santa catarina, marketing digital florianópolis, programação são josé, inteligência artificial palhoça, cursos técnicos grande florianópolis, escola habilidade"
        path="/"
        type="website"
      />
      <Hero />
      <Courses />
      <HowItWorksSimple />
      <Reviews />
      <TrustedCompanies variant="home" />
      <LatestBlogSection />
      <LazyContactForm />
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