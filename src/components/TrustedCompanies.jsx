import React from 'react';
import { getCompaniesByCategory, courseToCompanyMapping } from '../data/trustedCompanies';
import useInView from '../hooks/useInView';

const TrustedCompanies = ({ 
  variant = 'home',
  courseSlug = null,
  title = null,
  subtitle = null,
  theme = 'light',
  className = ''
}) => {
  // Sempre mostrar todas as empresas, independente da categoria da página
  const getCompanies = () => {
    return getCompaniesByCategory(); // Retorna todas as empresas sem filtro
  };

  const companies = getCompanies();

  // Configurações baseadas na variante
  const config = {
    home: {
      defaultTitle: "Empresas que confiam na Escola Habilidade",
      defaultSubtitle: "Profissionais de empresas regionais já se capacitaram conosco",
      layout: 'grid', // grid compacto para home
      animationDuration: 60,
      showStats: true
    },
    course: {
      defaultTitle: "Empresas que confiam na Escola Habilidade",
      defaultSubtitle: "Profissionais de empresas regionais já se capacitaram conosco",
      layout: 'carousel', // carrossel horizontal para cursos
      animationDuration: 120,
      showStats: false
    }
  };

  const settings = config[variant];
  const displayTitle = title || settings.defaultTitle;
  const displaySubtitle = subtitle || settings.defaultSubtitle;

  // Company Card Component with CSS animation
  const CompanyCard = ({ company, index }) => {
    const [ref, visible] = useInView();

    return (
      <div
        ref={ref}
        className={`card-enter ${visible ? 'in-view' : ''} group rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center hover:-translate-y-1 hover:scale-[1.02] ${
          theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-purple-500/15'
            : 'bg-gray-50 hover:bg-white hover:shadow-lg'
        }`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className={`w-16 h-16 flex items-center justify-center mb-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        }`}>
          <img
            src={company.logo}
            alt={company.name}
            width="64"
            height="64"
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
            loading="lazy"
          />
        </div>
        <div className="text-center">
          <h3 className={`font-semibold text-sm mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {company.name}
          </h3>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {company.description}
          </p>
        </div>
      </div>
    );
  };

  // Layout Grid (para home)
  if (settings.layout === 'grid') {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {displayTitle}
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {displaySubtitle}
            </p>
          </div>

          {/* Grid de empresas - 2 linhas no desktop */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {companies.map((company, index) => (
                <CompanyCard
                  key={`${company.name}-${index}`}
                  company={company}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Estatísticas para variant home */}
          {settings.showStats && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {companies.length}+
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Empresas Atendidas
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  200+
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Profissionais Formados
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  95%
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Taxa de Satisfação
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  4.9★
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avaliação Média
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Carousel Card Component
  const CarouselCard = ({ company }) => (
    <div
      className={`group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 hover:-translate-y-1 hover:scale-105 ${
        theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 hover:shadow-purple-500/15'
          : 'bg-gray-50 hover:bg-white hover:shadow-lg'
      }`}
    >
      <div className={`w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-white'
      }`}>
        <img
          src={company.logo}
          alt={company.name}
          width="80"
          height="80"
          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
        />
      </div>
      <div className="text-center">
        <h3 className={`font-semibold text-sm mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {company.name}
        </h3>
        <p className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {company.description}
        </p>
      </div>
    </div>
  );

  // Layout Carousel (para páginas de curso) - CSS Animation
  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {displayTitle}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {displaySubtitle}
          </p>
        </div>

        {/* Carrossel infinito de logos - CSS Animation */}
        <div className="relative overflow-hidden max-w-7xl mx-auto">
          <div className="carousel-track flex gap-8">
            {/* Primeira sequência de logos */}
            {companies.map((company, index) => (
              <CarouselCard key={`first-${index}`} company={company} />
            ))}

            {/* Segunda sequência de logos (para continuidade perfeita) */}
            {companies.map((company, index) => (
              <CarouselCard key={`second-${index}`} company={company} />
            ))}
          </div>

          {/* Gradientes nas bordas para efeito de fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10 pointer-events-none ${
            theme === 'dark' ? 'from-gray-900' : 'from-white'
          }`}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l to-transparent z-10 pointer-events-none ${
            theme === 'dark' ? 'from-gray-900' : 'from-white'
          }`}></div>
        </div>

        {/* Estatísticas para variant course */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {companies.length}+
            </div>
            <div className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empresas Atendidas
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              200+
            </div>
            <div className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Projetos Entregues
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              95%
            </div>
            <div className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Taxa de Aprovação
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              4.9★
            </div>
            <div className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Avaliação Média
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;