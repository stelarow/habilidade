import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <>
      {/* React 19 native metadata support */}
      <title>Página não encontrada - Escola Habilidade</title>
      <meta name="description" content="A página que você procura não foi encontrada. Explore nossos cursos e encontre a formação ideal para você." />
      <meta name="robots" content="noindex, nofollow" />
      
      <div className="min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Página não encontrada
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Ops! A página que você está procurando não existe ou foi movida.
              Que tal explorar nossos cursos?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Voltar ao Início
            </Link>
            <Link
              to="/#courses"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Ver Cursos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound; 