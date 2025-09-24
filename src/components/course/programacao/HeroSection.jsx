import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-navy text-white py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-hero-gradient to-navy"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance text-white">
            Domine a programação
            <br />
            do zero ao profissional
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty">
            Aprenda as tecnologias mais demandadas do mercado com projetos reais.
            Transforme sua carreira e torne-se um desenvolvedor full stack completo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-teal text-navy hover:bg-teal/90 font-semibold px-8">
              Começar agora
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 flex items-center gap-2">
              <div className="w-4 h-4 border-l-[6px] border-l-white border-y-[4px] border-y-transparent"></div>
              Assistir demonstração
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-teal/20 to-teal/10 p-1 rounded-lg">
            <div className="bg-white rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 text-sm ml-4">VS Code - Projeto Prático</span>
              </div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-800">Frontend desenvolvido com React</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-800">Backend criado com Node.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-800">Banco de dados conectado</span>
                </div>
                <div className="bg-gray-900 text-green-400 p-3 rounded mt-4">
                  <div>$ npm start</div>
                  <div>$ Servidor rodando na porta 3000</div>
                  <div>$ Aplicação pronta para uso</div>
                  <div>$ Projeto finalizado ✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}