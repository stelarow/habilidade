import Header from './components/Header';
import Hero from './components/Hero';
import Courses from './components/Courses';

function App() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Hero />
        <Courses />
      </main>
    </>
  );
}

export default App;
