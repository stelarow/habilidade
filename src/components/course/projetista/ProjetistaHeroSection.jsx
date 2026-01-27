import {
  Rocket,
  MapPin,
  Lightning,
  CurrencyCircleDollar,
  Target,
  Clock,
  Users,
  Buildings,
  Certificate,
  Star
} from '@phosphor-icons/react';
import { CountdownTimer } from '../../shared/CountdownTimer';

const TrustCard = ({ icon: Icon, value, label, color }) => (
  <div className="group relative">
    {/* Glow effect on hover */}
    <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500`} />

    <div className="relative flex flex-col items-center gap-2 px-5 py-4 bg-zinc-900/60 backdrop-blur-md border border-zinc-700/50 rounded-xl hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" weight="bold" />
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-black tracking-tight text-white">{value}</div>
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  </div>
);

export const ProjetistaHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/projetista-3d/hero/hero-bg-new.jpg"
          alt="Projetista 3D Background"
          title="Curso Projetista 3D - SketchUp e Enscape - Escola Habilidade São José SC"
          className="w-full h-full object-cover"
        />
        {/* Refined overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/70 to-zinc-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />
      </div>

      {/* Subtle animated background elements - slower, more refined */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]"
        style={{ animation: 'pulse 8s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]"
        style={{ animation: 'pulse 8s ease-in-out infinite 2s' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-24 sm:pb-16 lg:px-8 lg:py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge - More prominent */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/15 border border-purple-400/30 rounded-full">
              <Rocket className="w-5 h-5 text-purple-400" weight="fill" />
              <span className="text-sm font-semibold text-purple-300 tracking-wide">
                MELHOR CURSO PRESENCIAL DE SC
              </span>
            </div>
          </div>

          {/* Main Headline - Much larger and impactful */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                DOMINE SKETCHUP
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-purple-600 bg-clip-text text-transparent">
                E ENSCAPE
              </span>
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
              Transforme suas ideias em{' '}
              <span className="text-white font-medium">projetos 3D realistas</span>
            </p>
          </div>

          {/* Key Benefits - Cleaner presentation */}
          <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base md:text-lg text-zinc-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" weight="fill" />
                <span>Presencial em <strong className="text-white">São José SC</strong></span>
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" weight="fill" />
                <span>Turmas de <strong className="text-purple-300">4 alunos</strong></span>
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="flex items-center gap-2">
                <Certificate className="w-5 h-5 text-cyan-400" weight="fill" />
                <span>Certificado nacional</span>
              </span>
            </div>
          </div>

          {/* Pricing Section - More prominent and eye-catching */}
          <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative inline-block">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />

              <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl">
                {/* Discount badge */}
                <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-xl">
                  <Lightning className="w-6 h-6 text-yellow-400" weight="fill" />
                  <div className="text-left">
                    <div className="text-2xl font-black text-yellow-300">43% OFF</div>
                    <div className="text-xs font-bold text-yellow-400/80 uppercase tracking-wider">Últimas Vagas</div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center sm:text-left">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">7x R$ 499</span>
                    <span className="text-lg text-zinc-500 line-through">R$ 876</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <CurrencyCircleDollar className="w-4 h-4 text-green-400" />
                    <span>ou <strong className="text-green-400">R$ 3.143,70</strong> à vista (10% extra)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Larger and more commanding */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a
              href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20dominar%20as%20ferramentas%20do%20Curso%20de%20Projetista%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-bold text-white rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <Target className="w-6 h-6" weight="bold" />
              <span className="hidden sm:inline">MATRICULE-SE AGORA - ÚLTIMAS VAGAS</span>
              <span className="sm:hidden">QUERO ME MATRICULAR</span>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </a>
          </div>

          {/* Countdown Timer */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900/60 backdrop-blur border border-zinc-700/50 rounded-xl">
              <Clock className="w-5 h-5 text-yellow-400" weight="fill" />
              <span className="text-sm font-medium text-zinc-300">
                Oferta válida por:
              </span>
              <CountdownTimer />
            </div>
          </div>

          {/* Trust Indicators - Redesigned with cards */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-6">
              Método comprovado e aprovado por
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <TrustCard
                icon={Users}
                value="200+"
                label="Alunos"
                color="from-purple-500 to-purple-600"
              />
              <TrustCard
                icon={Buildings}
                value="50+"
                label="Empresas"
                color="from-cyan-500 to-cyan-600"
              />
              <TrustCard
                icon={Certificate}
                value="10+"
                label="Anos"
                color="from-fuchsia-500 to-purple-500"
              />
              <TrustCard
                icon={Star}
                value="4.9★"
                label="Avaliação"
                color="from-amber-500 to-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};
