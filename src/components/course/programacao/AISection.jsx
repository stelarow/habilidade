import { Button } from "@/components/ui/button"
import { useScrollAnimation, useCounterAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation"

export function AISection() {
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.3, once: true })
  const [codeRef, codeVisible] = useScrollAnimation({ threshold: 0.2, once: true })

  // Number counters para estatísticas
  const hoursCount = useCounterAnimation(133, 2000, statsVisible)
  const modulesCount = useCounterAnimation(6, 1800, statsVisible)
  const lessonsCount = useCounterAnimation(92, 2200, statsVisible)
  const priceCount = useCounterAnimation(399.90, 2000, statsVisible)

  // Código com efeito typewriter
  const codeLines = [
    "# Projeto Sistema de Cadastro",
    "def criar_usuario(nome, email):",
    '    usuario = {"nome": nome, "email": email}',
    "    salvar_database(usuario)",
    '    return "Usuário criado com sucesso!"',
    "# Conectando com MySQL...",
    '>>> criar_usuario("João", "joao@email.com")',
    "✓ Sistema funcionando perfeitamente! 🚀"
  ]

  const visibleLines = useStaggerAnimation(codeLines.length, 75, codeVisible) // Reduzido de 150ms para 75ms (2x mais rápido)

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
              Metodologia comprovada com 6 disciplinas essenciais: Lógica, Python, Java, PHP, Android e claude code.
              Crie um portfólio completo e desenvolva habilidades valorizadas pelo mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-teal text-navy hover:bg-teal/90 w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal/50"
                onClick={() => window.open('https://wa.me/5548988559491', '_blank')}
              >
                Falar com um especialista
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                className="w-full sm:w-auto transition-all duration-300 hover:scale-105"
                onClick={() => window.open('https://wa.me/5548988559491', '_blank')}
              >
                Agendar primeira aula Grátis
              </Button>
            </div>
          </div>

          <div ref={codeRef} className="bg-gray-900 rounded-lg p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto min-w-0">
            <div className="flex items-center gap-2 mb-4 min-w-0">
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="text-gray-400 ml-4 truncate">python-projeto.py</span>
            </div>
            <div className="space-y-1 min-w-0 min-h-[200px]">
              {codeLines.map((line, index) => {
                const isVisible = visibleLines[index]
                const getLineColor = () => {
                  if (line.startsWith('#')) return 'text-blue-400'
                  if (line.startsWith('def')) return 'text-green-400'
                  if (line.startsWith('>>>')) return 'text-yellow-400'
                  if (line.includes('✓')) return 'text-teal'
                  if (line.includes('usuario') || line.includes('salvar_database') || line.includes('return')) return 'text-white'
                  return 'text-gray-400'
                }

                return (
                  <div
                    key={index}
                    className={`break-words transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    } ${getLineColor()}`}
                  >
                    {line}
                    {isVisible && index === codeLines.length - 1 && (
                      <span className="animate-pulse ml-1">|</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div ref={statsRef} className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div className={`transition-all duration-700 delay-100 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">
              {statsVisible ? hoursCount : 0}
            </div>
            <div className="text-xs sm:text-sm text-white/60">Horas de curso</div>
          </div>
          <div className={`transition-all duration-700 delay-200 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">
              {statsVisible ? modulesCount : 0}
            </div>
            <div className="text-xs sm:text-sm text-white/60">Disciplinas diferentes</div>
          </div>
          <div className={`transition-all duration-700 delay-300 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">
              {statsVisible ? lessonsCount : 0}
            </div>
            <div className="text-xs sm:text-sm text-white/60">Aulas práticas</div>
          </div>
          <div className={`transition-all duration-700 delay-500 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-2xl sm:text-3xl font-bold mb-2 text-teal">
              R$ {statsVisible ? priceCount.toFixed(2).replace('.', ',') : '0,00'}
            </div>
            <div className="text-xs sm:text-sm text-white/60">por mês</div>
          </div>
        </div>
      </div>
    </section>
  )
}
