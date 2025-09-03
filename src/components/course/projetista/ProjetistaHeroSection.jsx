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
          src="/assets/projetista-3d/hero/hero-bg.png"
          alt="Projetista 3D Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Main Headline */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
              <Rocket className="w-4 h-4" />
              ÚNICO CURSO PRESENCIAL EM SC
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
                DOMINE SKETCHUP E ENSCAPE
              </span>
              <br />
              <span className="text-white">
                TRANSFORME SUAS IDEIAS EM PROJETOS 3D
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
                PROFISSIONAIS E REALISTAS
              </span>
            </h1>
          </div>

          {/* Key Benefits */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-center gap-3 text-lg">
              <MapPin className="w-6 h-6 text-cyan-400" />
              <span className="text-zinc-300">
                Único curso presencial completo em <strong className="text-white">São José SC</strong> com certificado nacional e turmas de até <strong className="text-purple-400">4 alunos</strong>
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-400">+ de 200 alunos formados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-400">+ de 50 empresas parceiras</span>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-8">
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
          <div className="mb-8">
            <a 
              href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20dominar%20as%20ferramentas%20do%20Curso%20de%20Projetista%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 inline-block"
            >
              <Target className="inline w-6 h-6 mr-3" />
              QUERO DOMINAR AS FERRAMENTAS - ÚLTIMAS VAGAS
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
            <p className="text-sm text-zinc-400 mb-4">
              Método comprovado e aprovado por:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-purple-400">200+</div>
                <div className="text-zinc-400">Alunos</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-cyan-400">50+</div>
                <div className="text-zinc-400">Empresas</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-purple-600">10+</div>
                <div className="text-zinc-400">Anos</div>
              </div>
              <div className="text-xs text-center">
                <div className="text-2xl font-bold text-green-400">4.9★</div>
                <div className="text-zinc-400">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};