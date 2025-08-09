import React from 'react';
import { 
  TrendUp,
  Users,
  Lightbulb,
  ArrowRight,
  User,
  Desktop,
  ShieldCheck,
  Coffee,
  VideoCamera,
  GraduationCap
} from '@phosphor-icons/react';

const CourseProblemStatement = ({ course }) => {
  const problems = [
    {
      icon: TrendUp,
      title: "Não Sei Por Onde Começar",
      description: "YouTube tem tutorial de tudo, mas qual software aprender primeiro? SketchUp, Blender, 3DS Max, Revit? Você perde meses pulando entre tutoriais sem criar nada profissional.",
      stat: "4+ softwares diferentes"
    },
    {
      icon: Users,
      title: "Cursos Caros e Incompletos", 
      description: "Curso de SketchUp R$ 2.000, AutoCAD R$ 2.500, Revit R$ 3.500... No final, você ainda não sabe integrar nada e fazer um projeto completo.",
      stat: "R$ 8.000+ separado"
    },
    {
      icon: Lightbulb,
      title: "Vai Levar Anos Sozinho",
      description: "Aprendendo por conta própria, você leva anos para descobrir o que o mercado realmente pede. Enquanto isso, as vagas passam e você continua estudando.",
      stat: "2-3 anos perdidos"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            5 Motivos Pelos Quais é Difícil Começar Como Projetista 3D (Sem o Caminho Certo)
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Quer ser projetista 3D mas não sabe por onde começar? Descubra os obstáculos reais que 
            impedem 73% das pessoas de conseguirem e como você pode ser diferente.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            
            return (
              <div 
                key={index}
                className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-red-400" weight="duotone" />
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {problem.stat}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-200 transition-colors">
                  {problem.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Solution Section */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-4 rounded-full px-8 py-4 backdrop-blur-sm border border-blue-500/30 mb-8"
            style={{ 
              background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}20, ${course?.themeColors?.gradient?.to || '#21CBF3'}20)`
            }}
          >
            <span className="text-lg text-white font-medium">
              A solução? Domine SketchUp + AutoCAD + Revit + Enscape em um curso só
            </span>
            <ArrowRight 
              size={20} 
              className="font-bold" 
              style={{ color: course?.themeColors?.primary || '#2196F3' }}
            />
          </div>
        </div>

        {/* Enhanced Solution Details */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">A Solução:</h3>
          <p className="text-lg text-gray-300 text-center mb-8 leading-relaxed">
            Em 94 horas 100% PRESENCIAIS, com método testado por 200+ alunos, você sai do zero absoluto 
            para projetista PROFISSIONAL, com portfolio pronto e certificado reconhecido.
          </p>
          
          {/* Diferenciais do Presencial */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-blue-400" weight="duotone" />
              </div>
              <h4 className="text-white font-semibold mb-2">Professor ao Seu Lado</h4>
              <p className="text-gray-400 text-sm">Dúvida? Resolvida na hora. Sem esperar resposta em fórum ou email.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendUp size={24} className="text-green-400" weight="duotone" />
              </div>
              <h4 className="text-white font-semibold mb-2">Equipamentos Inclusos</h4>
              <p className="text-gray-400 text-sm">Não precisa ter PC potente nem comprar licenças. Usamos nossos equipamentos profissionais.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lightbulb size={24} className="text-purple-400" weight="duotone" />
              </div>
              <h4 className="text-white font-semibold mb-2">Foco Total</h4>
              <p className="text-gray-400 text-sm">Em casa tem Netflix, WhatsApp, cama... Aqui você está 100% focado em aprender.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6">
            <h4 className="text-xl font-bold text-white mb-2">TURMA PRESENCIAL LIMITADA</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-green-400 flex items-center gap-2">
                <User size={16} className="text-green-400" weight="duotone" />
                Máximo 3 alunos (atenção personalizada)
              </div>
              <div className="text-green-400 flex items-center gap-2">
                <Desktop size={16} className="text-green-400" weight="duotone" />
                Computadores profissionais inclusos
              </div>
              <div className="text-green-400 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400" weight="duotone" />
                Software licenciado disponível
              </div>
              <div className="text-green-400 flex items-center gap-2">
                <Coffee size={16} className="text-green-400" weight="duotone" />
                Coffee break e networking
              </div>
              <div className="text-red-400 flex items-center gap-2">
                <VideoCamera size={16} className="text-red-400" weight="duotone" />
                Sem aulas gravadas genéricas
              </div>
              <div className="text-red-400 flex items-center gap-2">
                <GraduationCap size={16} className="text-red-400" weight="duotone" />
                Sem abandono no meio do curso
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm italic max-w-4xl mx-auto">
            Curso online de 3D? Você já tentou e sabe que não funciona. A diferença entre aprender de verdade 
            e desistir no meio está no acompanhamento presencial, na correção imediata, no professor que está 
            ali do seu lado. É por isso que 94% dos nossos alunos presenciais concluem e saem projetando.
          </p>
        </div>

      </div>
    </section>
  );
};

export default CourseProblemStatement;