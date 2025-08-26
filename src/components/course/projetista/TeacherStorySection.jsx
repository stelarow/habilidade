import React from 'react';
import { 
  User, 
  Trophy, 
  Scroll, 
  Buildings, 
  Users,
  Target,
  CheckCircle
} from '@phosphor-icons/react';
import OptimizedImage from '../../shared/OptimizedImage';

const TeacherStorySection = () => {
  const credentials = [
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      text: "10+ anos de experiência"
    },
    {
      icon: <Scroll className="w-5 h-5 text-blue-400" />,
      text: "Certificações: SketchUp Pro Trimble e Enscape"
    },
    {
      icon: <Buildings className="w-5 h-5 text-green-400" />,
      text: "50+ projetos realizados"
    },
    {
      icon: <Users className="w-5 h-5 text-purple-400" />,
      text: "200+ alunos formados"
    }
  ];

  const achievements = [
    "Especialista certificado em SketchUp Pro pela Trimble",
    "Profissional certificado Enscape Advanced",
    "Fundador da metodologia presencial exclusiva",
    "Mentor de profissionais em 50+ empresas da região"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-blue-950/10 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <User className="w-10 h-10 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                QUEM IRÁ TE ENSINAR?
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              Conheça o professor que vai transformar sua carreira
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Teacher Photo */}
            <div className="order-2 lg:order-1">
              <div className="relative max-w-md mx-auto">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
                  <OptimizedImage
                    src="/assets/projetista-3d/imagens-projeto/professor-alessandro.jpg"
                    alt="Professor Alessandro Ferreira - Especialista em SketchUp e Enscape"
                    className="w-full h-full object-cover"
                    lazy={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                
                {/* Floating credentials */}
                <div className="absolute -right-4 top-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 border border-purple-400/30 shadow-2xl">
                  <div className="text-center text-white">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p className="font-bold text-sm">200+ Alunos</p>
                    <p className="text-xs opacity-90">Formados</p>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 border border-blue-400/30 shadow-2xl">
                  <div className="text-center text-white">
                    <Buildings className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="font-bold text-sm">50+ Empresas</p>
                    <p className="text-xs opacity-90">Parceiras</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Story */}
            <div className="order-1 lg:order-2 space-y-8">
              
              {/* Introduction */}
              <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-3xl font-black text-white mb-6">
                  Alessandro Ferreira
                </h3>
                <p className="text-lg text-purple-400 font-semibold mb-4">
                  Professor especializado desde 2013
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Especializado em SketchUp, Enscape e renderizações ultra realistas. 
                  Minha jornada começou quando descobri o poder de transformar ideias em 
                  visualizações impressionantes que vendem projetos.
                </p>

                {/* Credentials Grid */}
                <div className="grid md:grid-cols-2 gap-3">
                  {credentials.map((credential, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {credential.icon}
                      <span className="text-gray-300">{credential.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/20">
                <blockquote className="text-xl text-white italic text-center leading-relaxed">
                  "Meu primeiro projeto mudou minha vida, e sei que pode mudar a sua também. 
                  Foi por isso que criei este método presencial exclusivo."
                </blockquote>
                <div className="text-center mt-4">
                  <cite className="text-purple-400 font-semibold">— Alessandro Ferreira</cite>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-2xl p-6 border border-green-500/20">
                <h4 className="text-2xl font-bold text-green-400 mb-4 text-center">
                  🏆 Conquistas e Certificações
                </h4>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-200">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-600">
                  <div className="text-2xl font-black text-purple-400">10+</div>
                  <div className="text-sm text-gray-300">Anos de Experiência</div>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-600">
                  <div className="text-2xl font-black text-green-400">200+</div>
                  <div className="text-sm text-gray-300">Alunos Formados</div>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-600">
                  <div className="text-2xl font-black text-blue-400">50+</div>
                  <div className="text-sm text-gray-300">Empresas Parceiras</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/20 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold text-white mb-4">
                🎯 METODOLOGIA EXCLUSIVA PRESENCIAL
              </h4>
              <p className="text-lg text-gray-300 mb-6">
                Desenvolvida ao longo de 10 anos formando profissionais que se destacam no mercado
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg py-4 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                <Target className="w-6 h-6" />
                QUERO APRENDER COM O ALESSANDRO - GARANTIR VAGA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherStorySection;