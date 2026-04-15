import { CreditCard, Money, PiggyBank, Shield, CheckCircle, Clock, DeviceMobile } from '@phosphor-icons/react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export const DesignGraficoInvestment = ({ course, onEnrollClick }) => {
  const handleEnrollClick = () => {
    if (typeof onEnrollClick === 'function') {
      onEnrollClick();
    }
  };

  const installmentValue = course.investment.installments.value;
  const originalInstallmentValue = course.investment.installments.originalValue;
  const totalPrice = installmentValue * course.investment.installments.max;
  const originalTotalPrice = originalInstallmentValue * course.investment.installments.max;
  const pixPrice = totalPrice * 0.9;

  const getIcon = (method) => {
    if (method.toLowerCase().includes('cartão')) return <CreditCard size={24} weight="duotone" />;
    if (method.toLowerCase().includes('pix')) return <Money size={24} weight="duotone" />;
    if (method.toLowerCase().includes('boleto')) return <PiggyBank size={24} weight="duotone" />;
    return <CreditCard size={24} weight="duotone" />;
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Investimento na sua <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Carreira</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Condições especiais para você começar hoje
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm rounded-full mb-4">
                PROMOÇÃO ESPECIAL
              </span>

              <div className="mb-2">
                <span className="text-gray-400 line-through text-xl">
                  de {course.investment.installments.max}x de {formatPrice(originalInstallmentValue)} ({formatPrice(originalTotalPrice)} total)
                </span>
              </div>

              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  {course.investment.installments.max}x de {formatPrice(installmentValue)}
                </span>
                <span className="text-gray-300 text-lg ml-2">no boleto</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Total: {formatPrice(totalPrice)}</p>

              <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-3 mb-6">
                <p className="text-green-400 font-semibold text-sm">
                  PIX ou Dinheiro: {formatPrice(pixPrice)} à vista (-10%)
                </p>
              </div>

              <button
                onClick={handleEnrollClick}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 cursor-pointer min-h-[52px]"
              >
                Matricular-se Agora
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Formas de Pagamento
              </h3>
              <div className="space-y-3">
                {course.investment.paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                  >
                    <div className="text-purple-400">
                      {getIcon(method)}
                    </div>
                    <span className="text-gray-300">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-2xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={24} weight="duotone" className="text-green-400" />
                Suas Garantias
              </h3>
              <div className="space-y-3">
                {[
                  'Certificado reconhecido nacionalmente',
                  'Material didático impresso incluso',
                  'Suporte vitalício aos alunos',
                  'Aulas práticas com projetos reais',
                  'Laboratório equipado disponível'
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={20} weight="duotone" className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={24} weight="duotone" className="text-purple-400" />
                Informações do Curso
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Carga horária total</span>
                  <span className="text-white font-semibold">{course.basicInfo.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total de módulos</span>
                  <span className="text-white font-semibold">{course.curriculum.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Certificado</span>
                  <span className="text-white font-semibold">90 horas</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Dúvidas?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Nossa equipe está pronta para ajudar você a escolher a melhor forma de pagamento.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="https://wa.me/5548988559491"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 flex items-center gap-2 hover:text-green-400 transition-colors cursor-pointer"
                >
                  <DeviceMobile size={16} className="text-green-400" />
                  WhatsApp: (48) 98855-9491
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};