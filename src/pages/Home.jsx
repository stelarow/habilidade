import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import LatestBlogSection from '../components/LatestBlogSection';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEOHead from '../components/shared/SEOHead';

function Home() {
  return (
    <>
      <SEOHead 
        title="Escola Habilidade Florianópolis, São José, Palhoça - Cursos de Informática, SketchUp, AutoCAD, Revit, Marketing Digital"
        description="Escola de cursos profissionalizantes em Florianópolis, São José e Palhoça. Cursos de Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação e IA. Certificado reconhecido. Aulas presenciais e online."
        keywords="cursos profissionalizantes florianópolis, escola técnica são josé sc, cursos informática palhoça, curso sketchup florianópolis, curso autocad são josé, curso revit palhoça, curso enscape santa catarina, marketing digital florianópolis, programação são josé, inteligência artificial palhoça, cursos técnicos grande florianópolis, escola habilidade"
        path="/"
        type="website"
      />
      <Hero />
      <Courses />
      <HowItWorksSimple />
      <Reviews />
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