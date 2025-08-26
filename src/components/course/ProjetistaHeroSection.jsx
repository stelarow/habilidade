import React from 'react';
import { 
  Rocket, 
  MapPin, 
  CheckCircle, 
  Lightning, 
  CurrencyCircleDollar,
  Target
} from '@phosphor-icons/react';
import OptimizedVideo from '../shared/OptimizedVideo';
import CountdownTimer from './projetista/CountdownTimer';

const ProjetistaHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video com múltiplos fallbacks */}
      <div className="absolute inset-0 w-full h-full">
        <OptimizedVideo
          src="/assets/projetista-3d/hero/The_video_starts_202508261222.mp4"
          poster="/assets/projetista-3d/hero/generation-ff879e0f-a55b-45d3-8dcd-8afb1c23630a.png"
          alt="Demonstração de projetos 3D profissionais SketchUp e Enscape - Escola Habilidade São José SC"
          className="w-full h-full object-cover"
          autoplay={true}
          muted={true}
          lazy={false} // Hero nunca deve ser lazy
          fallbackImage="/assets/projetista-3d/imagens-projeto/Video vertical - projeto renderizado.webm"
          onError={() => console.log('Fallback para vídeo vertical ativado')}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        
        {/* Overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Headline Principal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="flex items-center justify-center gap-3 mb-4">
                <Rocket className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  APRENDA EM 56 HORAS
                </span>
              </span>
              <span className="block text-white">
                A DOMINAR SKETCHUP E ENSCAPE
              </span>
              <span className="block text-2xl md:text-4xl lg:text-5xl text-green-400 font-extrabold">
                E FATURE ALTO COMO PROJETISTA 3D
              </span>
            </h1>
          </div>

          {/* Subheadline com localização */}
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl lg:text-2xl">
            <MapPin className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <p className="text-gray-200">
              Único curso presencial completo em <span className="text-purple-400 font-bold">São José SC</span> com
              certificado nacional e turmas de até 4 alunos
            </p>
          </div>

          {/* Proof Points */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-base md:text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>+ de 200 alunos formados na região</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>+ de 50 empresas que já formaram funcionários</span>
            </div>
          </div>

          {/* Offer Box */}
          <div className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-purple-500/30 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              
              {/* Desconto */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Lightning className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-lg">DESCONTO 43%</span>
                </div>
                <p className="text-red-400 font-bold text-sm">ÚLTIMAS VAGAS</p>
              </div>

              {/* Preço */}
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                  <CurrencyCircleDollar className="w-6 h-6 text-green-400" />
                  <div className="space-y-1">
                    <p className="text-gray-400 line-through text-sm">DE 7X R$ 699</p>
                    <p className="text-green-400 font-bold text-xl">7X R$ 399</p>
                    <p className="text-gray-300 text-sm">OU À VISTA COM 10% DE DESCONTO</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="mt-8">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg md:text-xl py-4 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                <Target className="w-6 h-6" />
                QUERO DOMINAR AS FERRAMENTAS - ÚLTIMAS VAGAS
              </button>
            </div>

            {/* Timer de urgência */}
            <div className="mt-6 text-center">
              <CountdownTimer />
              <p className="text-gray-400 text-sm mt-1">
                Contador que reseta a cada 8 dias para criar urgência
              </p>
            </div>
          </div>

          {/* Social Proof Rápida */}
          <div className="text-center text-gray-300">
            <p className="text-sm">
              <span className="text-green-400 font-bold">Carol, Lauren, Elton e Patrícia</span> já transformaram suas carreiras
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default ProjetistaHeroSection;