import { 
  CurrencyCircleDollar, 
  Palette, 
  Lightning, 
  House,
  Target
} from '@phosphor-icons/react';

export const ProjetistaTransformationPromise = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-zinc-800/80 via-zinc-950 to-zinc-800/80 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-green-500/10 border border-green-400/20 rounded-full text-sm font-medium text-green-400">
            <Target className="w-4 h-4" />
            SUA TRANSFORMAÇÃO COMEÇA AQUI
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">DESENVOLVA SUA CARREIRA</span>
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">COMO PROJETISTA 3D</span>
            <br />
            <span className="text-white">E CONQUISTE INDEPENDÊNCIA PROFISSIONAL</span>
          </h2>
        </div>

        {/* Promise Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 text-center group animate-scale-in">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                CONSTRUA SEU PORTFÓLIO
              </h3>
              <p className="text-zinc-400">
                Desenvolva projetos profissionais que demonstram suas habilidades e atraem clientes
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 text-center group animate-scale-in" style={{ animationDelay: '150ms' }}>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lightning className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                OTIMIZE SEU FLUXO DE TRABALHO
              </h3>
              <p className="text-zinc-400">
                Domine técnicas avançadas que aumentam sua eficiência e qualidade dos projetos
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 text-center group animate-scale-in" style={{ animationDelay: '300ms' }}>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <House className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                TRABALHE COM FLEXIBILIDADE
              </h3>
              <p className="text-zinc-400">
                Conquiste liberdade geográfica e horários flexíveis com projetos remotos
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1">
            <CurrencyCircleDollar className="inline w-6 h-6 mr-3" />
            QUERO CONHECER O CURSO - VAGAS LIMITADAS
          </button>
        </div>
      </div>
    </section>
  );
};