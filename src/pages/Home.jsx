import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';

function Home() {
  // Reset document title for home page
  React.useEffect(() => {
    document.title = 'Escola Habilidade - Transformando Vidas através da Educação Tecnológica';
    
    // Cleanup any persisting blog-related meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cursos práticos de tecnologia para transformar sua carreira. Aprenda com especialistas e entre no mercado de trabalho digital.');
    }
    
    // Reset any blog-specific structured data or meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Escola Habilidade - Educação Tecnológica');
    }
  }, []);

  return (
    <>
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