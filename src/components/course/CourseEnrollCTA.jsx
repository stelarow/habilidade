import { getIconForContext } from '../IconWrapper';

function CourseEnrollCTA({ course, onEnrollClick }) {
  const handleEnrollClick = () => {
    // Chama a função passada como prop para scroll para formulário
    if (onEnrollClick) {
      onEnrollClick();
    }
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'enroll_cta_click', {
        course_name: course?.basicInfo?.title,
        course_slug: course?.basicInfo?.slug,
        cta_position: 'main_cta'
      });
    }
  };

  return (
    <section className="mb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})`
            }}
          />
          
          {/* Conteúdo principal */}
          <div className="relative bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center">
            
            {/* Selo destacado */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full font-semibold text-sm mb-6 shadow-lg">
              {getIconForContext('Star', 'cta', '#000000', { size: 16, weight: 'fill' })}
              <span>Desenvolva uma nova habilidade</span>
              {getIconForContext('Star', 'cta', '#000000', { size: 16, weight: 'fill' })}
            </div>

            {/* Título principal */}
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Pronto para se Matricular?
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Transforme sua carreira com o curso de{' '}
              <span 
                className="font-semibold"
                style={{ color: course?.themeColors?.primary || '#2196F3' }}
              >
                {course?.basicInfo?.title}
              </span>
              . Comece hoje mesmo sua jornada profissional!
            </p>

            {/* Benefícios rápidos */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 justify-center">
                {getIconForContext('CheckCircle', 'benefits', '#4ade80')}
                <span className="text-gray-300 text-sm">Certificado Reconhecido</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                {getIconForContext('Lightning', 'benefits', '#facc15')}
                <span className="text-gray-300 text-sm">Suporte Completo</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                {getIconForContext('Star', 'benefits', '#a855f7')}
                <span className="text-gray-300 text-sm">Material Incluso</span>
              </div>
            </div>

            {/* Botão principal */}
            <button
              onClick={handleEnrollClick}
              className="group inline-flex items-center gap-3 px-8 py-4 text-white font-bold text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/20"
              style={{
                background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})`
              }}
            >
              <span>Solicitar Informações</span>
              {getIconForContext('ArrowRight', 'cta', '#ffffff', { 
                className: 'group-hover:translate-x-1 transition-transform duration-300' 
              })}
            </button>

            {/* Texto de apoio */}
            <p className="text-gray-400 text-sm mt-6">
              📞 Entre em contato conosco • Resposta rápida garantida
            </p>

            {/* Elementos decorativos */}
            <div className="absolute top-6 left-6 w-12 h-12 border-2 border-white/10 rounded-full" />
            <div className="absolute top-6 right-6 w-8 h-8 border-2 border-white/10 rounded-full" />
            <div className="absolute bottom-6 left-8 w-6 h-6 border-2 border-white/10 rounded-full" />
            <div className="absolute bottom-6 right-8 w-10 h-10 border-2 border-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseEnrollCTA; 