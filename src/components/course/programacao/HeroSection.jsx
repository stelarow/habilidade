import { Button } from "@/components/ui/button"
import { SalaryTooltip } from "@/components/shared/SalaryTooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HeroSection() {
  return (
    <section className="bg-navy text-white py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-hero-gradient to-navy"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Coluna Esquerda - Conteúdo */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-balance text-white">
              Curso de programação em são josé e grande florianópolis
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-6 text-pretty">
              Domine Lógica, Python, Java, PHP, Android e Claude Code para desenvolvimento completo.
              6 módulos completos para iniciar sua carreira como programador.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal rounded-full"></div>
                133 horas de curso
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal rounded-full"></div>
                Material didático incluso
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal rounded-full"></div>
                Presencial e Online
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center">
              <Button size="lg" className="bg-teal text-navy hover:bg-teal/90 font-semibold px-8 w-full sm:w-auto">
                Começar agora
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2 w-full sm:w-auto justify-center border-white text-white hover:bg-white hover:text-navy">
                <div className="w-4 h-4 border-l-[6px] border-l-current border-y-[4px] border-y-transparent flex-shrink-0"></div>
                Ver grade curricular
              </Button>
            </div>
          </div>

          {/* Coluna Direita - Dashboard Mockup */}
          <div className="mt-8 lg:mt-0 min-w-0">
            <div className="bg-gradient-to-br from-teal/20 to-teal/10 p-1 rounded-lg">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-2xl min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 text-xs sm:text-sm ml-4 truncate">Terminal - Jornada Full-Stack</span>
                </div>
                <ScrollArea className="h-64 sm:h-auto">
                  <div className="space-y-2 text-xs sm:text-sm font-mono pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 flex-shrink-0">1.</span>
                      <span className="text-gray-800 min-w-0">Lógica de Programação (21h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 flex-shrink-0">2.</span>
                      <span className="text-gray-800 min-w-0">Python Completo (24h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 flex-shrink-0">3.</span>
                      <span className="text-gray-800 min-w-0">Java Empresarial (24h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600 flex-shrink-0">4.</span>
                      <span className="text-gray-800 min-w-0">PHP & MySQL (30h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 flex-shrink-0">5.</span>
                      <span className="text-gray-800 min-w-0">Android Studio (24h)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-teal-600 flex-shrink-0">6.</span>
                      <span className="text-gray-800 min-w-0">Claude Code (15h)</span>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded mt-4 space-y-1">
                      <div className="text-xs sm:text-sm">$ Carreira: Desenvolvedor Full-Stack</div>
                      <div className="text-xs sm:text-sm">$ Portfolio: 6 projetos completos</div>
                      <div className="text-xs sm:text-sm">$ Status: Qualificado para vagas</div>
                      <SalaryTooltip>
                        <div className="text-teal-400 cursor-help border-b border-dotted border-teal-400 text-xs sm:text-sm">
                          $ Média salarial júnior: R$ 4.154* ⓘ
                        </div>
                      </SalaryTooltip>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}