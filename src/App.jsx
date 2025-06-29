import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import HowItWorksSimple from './components/HowItWorksSimple';
import Reviews from './components/Reviews';
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
      </main>
      <Footer />
    </>
  );
}

export default App;
