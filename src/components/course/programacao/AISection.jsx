import { Button } from "@/components/ui/button"

export function AISection() {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-hero-gradient to-navy"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
              Desenvolva aplicações
              <br />
              modernas com
              <br />
              tecnologias atuais
            </h2>
            <p className="text-lg text-white/80 mb-8 text-pretty">
              Aprenda React, Node.js, bancos de dados e deployment. Crie projetos do mundo real
              e tenha o conhecimento completo para trabalhar como desenvolvedor full stack.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-teal text-navy hover:bg-teal/90">
                Ver grade curricular
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Projetos do curso
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400 ml-4">terminal</span>
            </div>
            <div className="space-y-1 text-green-400">
              <div>$ npx create-react-app meu-projeto</div>
              <div>$ cd meu-projeto</div>
              <div>$ npm install express mongoose</div>
              <div className="text-white">✓ Dependências instaladas</div>
              <div className="text-white">✓ Servidor: http://localhost:3000</div>
              <div className="text-white">✓ API: http://localhost:5000</div>
              <div className="text-teal">$ Aplicação Full Stack pronta ✨</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">1000+</div>
            <div className="text-white/60">Alunos formados</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-white/60">Taxa de aprovação</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">4.9</div>
            <div className="text-white/60">Avaliação média</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">6 meses</div>
            <div className="text-white/60">Duração do curso</div>
          </div>
        </div>
      </div>
    </section>
  )
}