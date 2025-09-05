import { 
  Question, 
  Hand, 
  Books, 
  Briefcase, 
  ArrowsClockwise, 
  Timer, 
  Target,
  CheckCircle
} from '@phosphor-icons/react';

export const ProjetistaPainSolution = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Question className="w-4 h-4" />
            PARA QUEM É ESTE CURSO COMPLETO
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">VOCÊ SE ENCAIXA EM</span>
            <br />
            <span className="text-white">ALGUM PONTO ABAIXO?</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Pain Points */}
          <div className="mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-zinc-800/30 backdrop-blur rounded-lg border border-zinc-700/50">
                <Books className="w-5 h-5 text-red-400" />
                <span className="text-white">A FACULDADE NÃO PREPARA para o mercado real?</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/30 backdrop-blur rounded-lg border border-zinc-700/50">
                <Briefcase className="w-5 h-5 text-red-400" />
                <span className="text-white">PERDEU OPORTUNIDADES por não dominar as ferramentas?</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/30 backdrop-blur rounded-lg border border-zinc-700/50">
                <ArrowsClockwise className="w-5 h-5 text-red-400" />
                <span className="text-white">QUER MUDAR DE CARREIRA e entrar na arquitetura?</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/30 backdrop-blur rounded-lg border border-zinc-700/50">
                <Timer className="w-5 h-5 text-red-400" />
                <span className="text-white">CANSADO DE DEPENDER DE TERCEIROS para seus projetos?</span>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-zinc-800/30 backdrop-blur rounded-lg border border-zinc-700/50">
                <Target className="w-5 h-5 text-red-400" />
                <span className="text-white">PRECISA SE QUALIFICAR para conseguir emprego/estágio?</span>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="relative rounded-2xl bg-green-500/10 backdrop-blur p-8 border border-green-400/20">
            <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
              NOSSA SOLUÇÃO PARA SEUS PROBLEMAS
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Método prático e presencial</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Suporte individualizado</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Turmas pequenas (máx 4 alunos)</span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Professor experiente com informações de mercado</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a 
              href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20uma%20solu%C3%A7%C3%A3o%20presencial%20e%20garantir%20minha%20vaga%20no%20Curso%20de%20Projetista%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 inline-block"
            >
              <Target className="inline w-5 h-5 mr-2" />
              SIM, QUERO SOLUÇÃO PRESENCIAL - GARANTIR VAGA
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};