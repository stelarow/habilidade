import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import HowItWorksSimple from './components/HowItWorksSimple';
import Reviews from './components/Reviews';
import ContactForm from './components/ContactForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16" role="main">
        <Hero />
        <Courses />
        <HowItWorksSimple />
        <Reviews />
        <ContactForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

export default App;
