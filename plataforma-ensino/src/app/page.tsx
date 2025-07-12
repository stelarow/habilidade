'use client';

import { Header, Starfield, GradientButton } from '@/components';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <Starfield count={80} />
      <Header />
      
      {/* Hero Section */}
      <main id="main-content" className="relative z-10">
        <section className="container-custom section-padding pt-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow">
              Transforme seu Futuro com{' '}
              <span className="gradient-text">
                Educação de Qualidade
              </span>
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Aprenda com os melhores profissionais e domine as tecnologias mais demandadas do mercado
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <GradientButton 
                href="/auth/register" 
                className="px-8 py-4 text-lg font-semibold min-w-[200px]"
              >
                Começar Agora
              </GradientButton>
              
              <Link 
                href="/auth/login"
                className="px-8 py-4 text-lg font-semibold border-2 border-white/30 text-white rounded-lg hover:bg-white/10 transition-all duration-300 min-w-[200px] text-center"
              >
                Fazer Login
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="glass-effect-dark p-6 rounded-lg text-center">
                <div className="text-3xl font-bold gradient-text mb-2">1000+</div>
                <div className="text-gray-300">Alunos Certificados</div>
              </div>
              <div className="glass-effect-dark p-6 rounded-lg text-center">
                <div className="text-3xl font-bold gradient-text mb-2">50+</div>
                <div className="text-gray-300">Cursos Disponíveis</div>
              </div>
              <div className="glass-effect-dark p-6 rounded-lg text-center">
                <div className="text-3xl font-bold gradient-text mb-2">98%</div>
                <div className="text-gray-300">Taxa de Satisfação</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container-custom section-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-xl text-gray-300">
              Oferecemos a melhor experiência de aprendizado online
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-3">Instrutores Especialistas</h3>
              <p className="text-gray-300">
                Aprenda com profissionais experientes e reconhecidos no mercado
              </p>
            </div>
            
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold text-white mb-3">Tecnologia Moderna</h3>
              <p className="text-gray-300">
                Plataforma otimizada com as melhores ferramentas de ensino
              </p>
            </div>
            
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-3">Resultados Práticos</h3>
              <p className="text-gray-300">
                Projetos reais que preparam você para o mercado de trabalho
              </p>
            </div>
            
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-3">Flexibilidade Total</h3>
              <p className="text-gray-300">
                Estude no seu ritmo, quando e onde quiser
              </p>
            </div>
            
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-3">Certificação</h3>
              <p className="text-gray-300">
                Certificados reconhecidos pelo mercado
              </p>
            </div>
            
            <div className="glass-effect-dark p-8 rounded-lg text-center hover:scale-105 transition-transform duration-300">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-3">Suporte Completo</h3>
              <p className="text-gray-300">
                Suporte técnico e pedagógico disponível 24/7
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container-custom section-padding">
          <div className="text-center glass-effect-dark p-12 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a milhares de alunos que já transformaram suas carreiras
            </p>
            <GradientButton 
              href="/auth/register"
              className="px-12 py-4 text-xl font-semibold"
            >
              Inscreva-se Gratuitamente
            </GradientButton>
          </div>
        </section>
      </main>
    </div>
  );
}
