import { Button } from "@/components/ui/button"

export function AISection() {
  return (
    <section className="py-20 bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-hero-gradient to-navy"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-balance">
              Do zero ao
              <br />
              início da carreira
              <br />
              como desenvolvedor
            </h2>
            <p className="text-lg text-white/80 mb-8 text-pretty">
              Metodologia comprovada com 6 linguagens essenciais: Lógica, Python, Java, PHP, Android e Cursor IA.
              Crie um portfólio completo e desenvolva habilidades valorizadas pelo mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-teal text-navy hover:bg-teal/90 w-full sm:w-auto">
                Ver grade curricular
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                className="w-full sm:w-auto"
              >
                Projetos do curso
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto min-w-0">
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-400 ml-4 truncate">python-projeto.py</span>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-blue-400 break-words"># Projeto Sistema de Cadastro</div>
              <div className="text-green-400 break-words">def criar_usuario(nome, email):</div>
              <div className="text-white ml-2 sm:ml-4 break-words">usuario = {'{"nome": nome, "email": email}'}</div>
              <div className="text-white ml-2 sm:ml-4 break-words">salvar_database(usuario)</div>
              <div className="text-green-400 break-words">    return "Usuário criado com sucesso!"</div>
              <div className="text-gray-400 break-words"># Conectando com MySQL...</div>
              <div className="text-yellow-400 break-words">{'>>> criar_usuario("João", "joao@email.com")'}</div>
              <div className="text-teal break-words">✓ Sistema funcionando perfeitamente! 🚀</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">133</div>
            <div className="text-xs sm:text-sm text-white/60">Horas de curso</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">6</div>
            <div className="text-xs sm:text-sm text-white/60">Linguagens diferentes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">92</div>
            <div className="text-xs sm:text-sm text-white/60">Aulas práticas</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">R$ 897</div>
            <div className="text-xs sm:text-sm text-white/60">Investimento</div>
          </div>
        </div>
      </div>
    </section>
  )
}