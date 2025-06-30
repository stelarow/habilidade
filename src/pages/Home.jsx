import Hero from '../components/Hero';
import Courses from '../components/Courses';
import HowItWorksSimple from '../components/HowItWorksSimple';
import Reviews from '../components/Reviews';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';

function Home() {
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