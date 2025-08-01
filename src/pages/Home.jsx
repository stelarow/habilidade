import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import SEOHead from '../components/shared/SEOHead';

function Home() {
  return (
    <>
      <SEOHead 
        title="Escola Habilidade - Transformando Vidas através da Educação Tecnológica"
        description="Cursos práticos de tecnologia para transformar sua carreira. Aprenda com especialistas e entre no mercado de trabalho digital."
        keywords="cursos de tecnologia, educação digital, programação, design gráfico, marketing digital, inteligência artificial, São José SC"
        path="/"
        type="website"
      />
      <Hero />
      <Courses />
      <HowItWorksSimple />
      <Reviews />
      <ContactForm />
      <FAQ />
    </>
  );
}

export default Home; 