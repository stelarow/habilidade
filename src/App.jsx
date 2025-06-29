import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';
import HowItWorksSimple from './components/HowItWorksSimple';
import Reviews from './components/Reviews';

function App() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Courses />
        <HowItWorksSimple />
        <Reviews />
      </main>
    </>
  );
}

export default App;
