import { Monitor, Palette, PenNib, FigmaLogo, Image, Certificate, Users, Clock } from '@phosphor-icons/react';

export const DesignGraficoHeroSection = ({ onEnrollClick }) => {
  console.log('[DesignGraficoHeroSection] Component rendered, onEnrollClick:', typeof onEnrollClick);

  const handleEnrollClick = () => {
    console.log('[DesignGraficoHeroSection] Hero button clicked');
    if (typeof onEnrollClick === 'function') {
      console.log('[DesignGraficoHeroSection] Calling onEnrollClick');
      onEnrollClick();
    } else {
      console.log('[DesignGraficoHeroSection] onEnrollClick is not a function!', onEnrollClick);
    }
  };

  const tools = [
    { icon: Monitor, name: 'Photoshop', color: '#31A8FF' },
    { icon: PenNib, name: 'Illustrator', color: '#FF9A00' },
    { icon: Palette, name: 'InDesign', color: '#FF3366' },
    { icon: FigmaLogo, name: 'Canva', color: '#00C4CC' },
    { icon: Image, name: 'CorelDRAW', color: '#00B4F5' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-purple-950/50 to-zinc-950">
      <div className="absolute inset-0">
        <img
          src="/assets/design-grafico/hero-bg.jpg"
          alt="Design Gráfico Background"
          className="w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-8 cursor-pointer hover:bg-white/15 transition-all duration-300">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg key={index} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-white/90 text-sm font-medium">
            5.0 • 200+ alunos formados
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Curso de{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
            Design Gráfico
          </span>
          <span className="block text-2xl md:text-3xl mt-4 text-gray-300 font-semibold">
            Do Básico ao Profissional
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Domine <span className="text-purple-400 font-semibold">Photoshop</span>,{' '}
          <span className="text-orange-400 font-semibold">Illustrator</span>,{' '}
          <span className="text-pink-400 font-semibold">InDesign</span>,{' '}
          <span className="text-cyan-400 font-semibold">Canva</span> e{' '}
          <span className="text-blue-400 font-semibold">CorelDRAW</span>
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-white px-4 py-2 rounded-full">
            <Users size={18} className="text-purple-400" />
            <span className="text-sm">Presencial ou Online</span>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-white px-4 py-2 rounded-full">
            <Certificate size={18} className="text-green-400" />
            <span className="text-sm">Certificado 90h</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-white px-4 py-2 rounded-full">
            <Clock size={18} className="text-orange-400" />
            <span className="text-sm">5 Módulos</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={handleEnrollClick}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-purple-500/30 cursor-pointer min-h-[48px]"
          >
            <span>Garantir Minha Vaga</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <a
            href="#curriculum"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer min-h-[48px]"
          >
            Ver Grade Curricular
          </a>
        </div>

        <div className="mb-12">
          <p className="text-sm text-gray-400 mb-4">Ferramentas que você vai dominar:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <Icon size={20} style={{ color: tool.color }} weight="duotone" />
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">
                    {tool.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">90h</div>
            <div className="text-xs md:text-sm text-gray-400">de conteúdo</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">76</div>
            <div className="text-xs md:text-sm text-gray-400">aulas práticas</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">5</div>
            <div className="text-xs md:text-sm text-gray-400">softwares</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-xs md:text-sm text-gray-400">prático</div>
          </div>
        </div>
      </div>
    </section>
  );
};