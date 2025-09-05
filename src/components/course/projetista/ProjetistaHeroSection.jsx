import { 
  Rocket, 
  MapPin, 
  CheckCircle, 
  Lightning, 
  CurrencyCircleDollar, 
  Target, 
  Clock 
} from '@phosphor-icons/react';
import { CountdownTimer } from '../../shared/CountdownTimer';

export const ProjetistaHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/projetista-3d/hero/hero-bg-new.jpg"
          alt="Projetista 3D Background"
          className="w-full h-full object-cover filter blur-[0.5px]"
        />
        {/* Multi-layered overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/40_70%)]" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Headline */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
              <Rocket className="w-4 h-4" />
              Melhor curso presencial em SC
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
                DOMINE SKETCHUP E ENSCAPE
              </span>
              <br />
              <span className="text-white text-xl md:text-2xl lg:text-3xl">
                Transforme Suas Ideias Em Projetos 3D Realistas
              </span>
            </h1>
          </div>

          {/* Key Benefits */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-center gap-3 text-base">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span className="text-zinc-300">
                Presencial em <strong className="text-white">São José SC</strong> • Turmas de <strong className="text-purple-400">4 alunos</strong> • Certificado nacional
              </span>
            </div>
            
          </div>

          {/* Pricing Section */}
          <div className="mb-6">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-zinc-800/80 backdrop-blur border border-zinc-700 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400 rounded-lg">
                <Lightning className="w-5 h-5 text-yellow-400" />
                <span className="font-bold text-yellow-300">DESCONTO 43%</span>
                <span className="text-sm font-medium text-yellow-300">ÚLTIMAS VAGAS</span>
              </div>
              
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 mb-1">
                  <CurrencyCircleDollar className="w-5 h-5 text-cyan-400" />
                  <span className="text-2xl font-bold text-cyan-400">7X R$ 399</span>
                  <span className="text-sm text-zinc-400 line-through">DE 7X R$ 699</span>
                </div>
                <div className="text-sm text-zinc-400">
                  OU À VISTA COM 10% DE DESCONTO
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mb-6">
            <a 
              href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20dominar%20as%20ferramentas%20do%20Curso%20de%20Projetista%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 inline-block"
            >
              <Target className="inline w-6 h-6 mr-3" />
              MATRICULE-SE AGORA - ÚLTIMAS VAGAS
              <div className="absolute inset-0 rounded-xl bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          </div>

          {/* Countdown Timer */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-800/80 backdrop-blur border border-zinc-700 rounded-xl">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-zinc-300">
              Oferta válida por:
            </span>
            <CountdownTimer />
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-zinc-700/50">
            <p className="text-sm text-zinc-300 mb-4">
              Método comprovado e aprovado por:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-purple-400">200+</div>
                <div className="text-zinc-300">Alunos</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-cyan-400">50+</div>
                <div className="text-zinc-300">Empresas</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-purple-400">10+</div>
                <div className="text-zinc-300">Anos</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-green-400">4.9★</div>
                <div className="text-zinc-300">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};