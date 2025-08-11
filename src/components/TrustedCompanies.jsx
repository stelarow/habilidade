import React from 'react';
import { motion } from 'framer-motion';
import { getCompaniesByCategory, courseToCompanyMapping } from '../data/trustedCompanies';

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
      defaultTitle: "Empresas regionais que fizeram nossos cursos",
      defaultSubtitle: "Empresas da região que confiaram na Escola Habilidade para capacitar seus profissionais",
      layout: 'carousel', // carrossel horizontal para cursos
      animationDuration: 120,
      showStats: false
    }
  };

  const settings = config[variant];
  const displayTitle = title || settings.defaultTitle;
  const displaySubtitle = subtitle || settings.defaultSubtitle;

  // Layout Grid (para home)
  if (settings.layout === 'grid') {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${className}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {displayTitle}
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {displaySubtitle}
            </p>
          </motion.div>

          {/* Grid de empresas - 2 linhas no desktop */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {companies.slice(0, 10).map((company, index) => (
                <motion.div
                  key={`${company.name}-${index}`}
                  className={`group rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ 
                    y: -3,
                    boxShadow: theme === 'dark' 
                      ? "0 10px 30px rgba(147, 51, 234, 0.15)" 
                      : "0 10px 30px rgba(0, 0, 0, 0.1)",
                    scale: 1.02
                  }}
                >
                  <div className={`w-16 h-16 flex items-center justify-center mb-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <img 
                      src={company.logo}
                      alt={company.name}
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Estatísticas para variant home */}
          {settings.showStats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
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
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  // Layout Carousel (para páginas de curso)
  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {displayTitle} <span className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
              projetista
            </span>
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {displaySubtitle}
          </p>
        </motion.div>

        {/* Carrossel infinito de logos */}
        <div className="relative overflow-hidden max-w-7xl mx-auto">
          <motion.div 
            className="flex space-x-8"
            animate={{
              x: [0, -(208 * companies.length)]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: settings.animationDuration,
                ease: "linear"
              }
            }}
          >
            {/* Primeira sequência de logos */}
            {companies.map((company, index) => (
              <motion.div
                key={`first-${index}`}
                className={`group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                }`}
                whileHover={{ 
                  y: -5,
                  boxShadow: theme === 'dark'
                    ? "0 10px 30px rgba(147, 51, 234, 0.15)"
                    : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                }}
              >
                <div className={`w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <img 
                    src={company.logo}
                    alt={company.name}
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
              </motion.div>
            ))}
            
            {/* Segunda sequência de logos (para continuidade perfeita) */}
            {companies.map((company, index) => (
              <motion.div
                key={`second-${index}`}
                className={`group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                }`}
                whileHover={{ 
                  y: -5,
                  boxShadow: theme === 'dark'
                    ? "0 10px 30px rgba(147, 51, 234, 0.15)"
                    : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                }}
              >
                <div className={`w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <img 
                    src={company.logo}
                    alt={company.name}
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
              </motion.div>
            ))}
            
            {/* Terceira sequência para garantir continuidade */}
            {companies.slice(0, 3).map((company, index) => (
              <motion.div
                key={`third-${index}`}
                className={`group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                }`}
                whileHover={{ 
                  y: -5,
                  boxShadow: theme === 'dark'
                    ? "0 10px 30px rgba(147, 51, 234, 0.15)"
                    : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                }}
              >
                <div className={`w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <img 
                    src={company.logo}
                    alt={company.name}
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
              </motion.div>
            ))}
          </motion.div>
          
          {/* Gradientes nas bordas para efeito de fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10 pointer-events-none ${
            theme === 'dark' ? 'from-gray-900' : 'from-white'
          }`}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l to-transparent z-10 pointer-events-none ${
            theme === 'dark' ? 'from-gray-900' : 'from-white'
          }`}></div>
        </div>

        {/* Estatísticas para variant course */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedCompanies;