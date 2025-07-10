import PropTypes from 'prop-types';
import { CreditCard, Money, PiggyBank, Shield, Clock, CheckCircle, DeviceMobile } from 'phosphor-react';
import { useDeferredValue, useLayoutEffect, useState } from 'react';

function CourseInvestment({ course, onEnrollClick }) {
  const [containerSize, setContainerSize] = useState({ width: 0 });
  const deferredSize = useDeferredValue(containerSize);

  // Context 7: Performance hook para medições DOM
  useLayoutEffect(() => {
    const measureContainer = () => {
      const container = document.querySelector('[data-investment-container]');
      if (container) {
        setContainerSize({ width: container.offsetWidth });
      }
    };

    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateDiscount = () => {
    if (course.investment.originalPrice <= course.investment.currentPrice) return 0;
    return Math.round(((course.investment.originalPrice - course.investment.currentPrice) / course.investment.originalPrice) * 100);
  };

  const calculateSavings = () => {
    return course.investment.originalPrice - course.investment.currentPrice;
  };

  return (
    <div 
      className="@container bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 mb-16"
      data-investment-container
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">
        Investimento e Formas de Pagamento
      </h2>

      {/* Context 7: Mobile-first grid com container queries */}
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Pricing Section */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Main Price Display */}
          <div className="text-center p-6 sm:p-8 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl border border-white/10">
            
            {/* Discount Badge */}
            {calculateDiscount() > 0 && (
              <div className="inline-block mb-3 sm:mb-4">
                <span 
                  className="px-3 sm:px-4 py-2 rounded-full text-white font-bold text-xs sm:text-sm"
                  style={{ backgroundColor: course.themeColors.primary }}
                >
                  {calculateDiscount()}% DE DESCONTO
                </span>
              </div>
            )}

            {/* Original Price */}
            {course.investment.originalPrice > course.investment.currentPrice && (
              <div className="mb-2">
                <span className="text-gray-400 line-through text-lg sm:text-xl">
                  de {formatPrice(course.investment.originalPrice)}
                </span>
              </div>
            )}

            {/* Current Price */}
            <div className="mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {formatPrice(course.investment.currentPrice)}
              </span>
              <span className="text-gray-300 text-base sm:text-lg ml-2">à vista</span>
            </div>

            {/* Savings */}
            {calculateSavings() > 0 && (
              <div className="mb-3 sm:mb-4">
                <span className="text-green-400 font-semibold text-sm sm:text-base">
                  Economia de {formatPrice(calculateSavings())}
                </span>
              </div>
            )}

            {/* Installments */}
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-gray-300 text-base sm:text-lg">
                ou <span className="font-bold text-white">{course.investment.installments.max}x</span> de{' '}
                <span className="font-bold text-white">
                  {formatPrice(course.investment.installments.value)}
                </span>
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">sem juros no cartão</p>
            </div>

            {/* Context 7: CTA Button com touch targets 44px mínimo */}
            <button
              onClick={onEnrollClick}
              className="w-full min-h-[44px] py-3 sm:py-4 px-4 rounded-full text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20 touch-manipulation"
              style={{
                background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
              }}
            >
              Matricular-se Agora
            </button>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">Formas de Pagamento</h3>
            {/* Context 7: Mobile-first grid para métodos de pagamento */}
            <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
              {course.investment.paymentMethods.map((method, index) => {
                const getIcon = (method) => {
                  if (method.toLowerCase().includes('cartão')) return <CreditCard size={20} weight="duotone" />;
                  if (method.toLowerCase().includes('pix')) return <Money size={20} weight="duotone" />;
                  if (method.toLowerCase().includes('boleto')) return <PiggyBank size={20} weight="duotone" />;
                  return <CreditCard size={20} weight="duotone" />;
                };

                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg min-h-[44px] touch-manipulation">
                    <div style={{ color: course.themeColors.primary }}>
                      {getIcon(method)}
                    </div>
                    <span className="text-gray-300 text-sm">{method}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Guarantees and Benefits */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Guarantees */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-500/30 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Shield size={24} weight="duotone" color="#10B981" />
              Suas Garantias
            </h3>
            <div className="space-y-3">
              {[
                'Garantia de satisfação de 30 dias',
                'Certificado reconhecido nacionalmente',
                'Suporte durante todo o curso',
                'Material didático incluso',
                'Aulas práticas com projetos reais',
                'Acesso ao laboratório equipado'
              ].map((guarantee, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle size={20} weight="duotone" color="#10B981" className="mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Value Proposition */}
          <div className="p-4 sm:p-6 bg-gray-800/30 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Clock size={24} weight="duotone" style={{ color: course.themeColors.primary }} />
              Valor do Investimento
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Carga horária total</span>
                <span className="text-white font-semibold text-sm">{course.basicInfo.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Valor por hora/aula</span>
                <span className="text-white font-semibold text-sm">
                  {formatPrice(course.investment.currentPrice / parseInt(course.basicInfo.duration))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Total de módulos</span>
                <span className="text-white font-semibold text-sm">{course.curriculum.length} módulos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Aulas práticas</span>
                <span className="text-white font-semibold text-sm">
                  {course.curriculum.reduce((total, module) => total + module.lessons.length, 0)} aulas
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-4 sm:p-6 bg-gray-800/30 rounded-xl">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Dúvidas sobre Pagamento?</h3>
            <p className="text-gray-300 text-sm mb-3 sm:mb-4 leading-relaxed">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas sobre formas de pagamento e condições especiais.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300 flex items-center gap-2 flex-wrap">
                <DeviceMobile size={16} weight="duotone" className="text-blue-400 flex-shrink-0" />
                <span>WhatsApp:</span> <span className="text-white">(48) 99999-9999</span>
              </p>
              <p className="text-gray-300 flex items-start gap-2 flex-wrap">
                <span className="flex-shrink-0">📧</span>
                <span>E-mail:</span> <span className="text-white break-all">contato@escolahabilidade.com.br</span>
              </p>
              <p className="text-gray-300 flex items-center gap-2 flex-wrap">
                <span className="flex-shrink-0">🕒</span>
                <span>Horário:</span> <span className="text-white">Segunda à Sexta, 8h às 18h</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CourseInvestment.propTypes = {
  course: PropTypes.object.isRequired,
  onEnrollClick: PropTypes.func.isRequired,
};

export default CourseInvestment; 