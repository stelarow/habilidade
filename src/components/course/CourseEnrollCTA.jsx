import { getIconForContext } from '../IconWrapper';
import { EMAIL_CONFIG } from '../../utils/emailConfig';

function CourseEnrollCTA({ course, onEnrollClick }) {
  console.log('[CourseEnrollCTA] Component rendered');
  console.log('[CourseEnrollCTA] Props received - course:', course?.basicInfo?.title, 'onEnrollClick:', typeof onEnrollClick);

  const handleEnrollClick = () => {
    console.log('[CourseEnrollCTA] Button clicked');
    if (typeof onEnrollClick === 'function') {
      console.log('[CourseEnrollCTA] Calling onEnrollClick prop');
      onEnrollClick();
    } else {
      console.log('[CourseEnrollCTA] onEnrollClick is NOT a function, using WhatsApp fallback');
      const courseName = course?.basicInfo?.title || 'Design Gráfico';
      const message = `Olá! Tenho interesse no curso de ${courseName} e gostaria de mais informações sobre como me matricular.`;
      const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }

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
      <div className="@container max-w-5xl mx-auto px-4">
        <div className="relative">
          {/* Background gradient */}
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})`
            }}
          />

          {/* Conteúdo principal */}
          <div className="relative bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center">

            {/* Selo destacado */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm mb-4 sm:mb-6 shadow-lg min-h-[36px] touch-manipulation">
              {getIconForContext('Star', 'cta', '#000000', { size: 16, weight: 'fill' })}
              <span>Desenvolva uma nova habilidade</span>
              {getIconForContext('Star', 'cta', '#000000', { size: 16, weight: 'fill' })}
            </div>

            {/* Título principal */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Pronto para se Matricular?
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Desenvolva suas habilidades com o curso de{' '}
              <span
                className="font-semibold"
                style={{ color: course?.themeColors?.primary || '#2196F3' }}
              >
                {course?.basicInfo?.title}
              </span>
              . Comece hoje mesmo sua jornada profissional!
            </p>

            {/* Context 7: Benefícios rápidos com mobile-first */}
            <div className="grid grid-cols-1 @sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation">
                {getIconForContext('CheckCircle', 'benefits', '#4ade80')}
                <span className="text-gray-300 text-xs sm:text-sm">Certificado Reconhecido</span>
              </div>
              <div className="flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation">
                {getIconForContext('Lightning', 'benefits', '#facc15')}
                <span className="text-gray-300 text-xs sm:text-sm">Suporte Completo</span>
              </div>
              <div className="flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation">
                {getIconForContext('Star', 'benefits', '#a855f7')}
                <span className="text-gray-300 text-xs sm:text-sm">Material Incluso</span>
              </div>
            </div>

            {/* Context 7: Botão principal com touch targets otimizados */}
            <button
              onClick={handleEnrollClick}
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/20 min-h-[44px] min-w-[200px] touch-manipulation active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})`
              }}
            >
              <span>Garantir Minha Vaga</span>
              {getIconForContext('ArrowRight', 'cta', '#ffffff', {
                className: 'group-hover:translate-x-1 transition-transform duration-300',
                size: 18
              })}
            </button>

            {/* Texto de apoio */}
            <p className="text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6 leading-relaxed">
              📞 Entre em contato conosco • Resposta rápida garantida
            </p>

            {/* Context 7: Elementos decorativos responsivos */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-8 sm:w-12 h-8 sm:h-12 border-2 border-white/10 rounded-full" />
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-6 sm:w-8 h-6 sm:h-8 border-2 border-white/10 rounded-full" />
            <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8 w-4 sm:w-6 h-4 sm:h-6 border-2 border-white/10 rounded-full" />
            <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-8 w-8 sm:w-10 h-8 sm:h-10 border-2 border-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseEnrollCTA; 