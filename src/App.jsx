import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <Router basename="/habilidade">
        <div className="App">
          <Header />
          <main id="main-content" className="pt-16" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cursos/:slug" element={<CoursePage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
