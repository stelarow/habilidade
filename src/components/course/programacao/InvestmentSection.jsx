import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function InvestmentSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold mb-4">INVESTIMENTO</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Transforme sua carreira
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invista no seu futuro como programador com o curso mais completo da região
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card border rounded-xl p-8 text-center relative overflow-hidden">
            {/* Badge de desconto */}
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-bold">
                40% OFF
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Curso Completo de Programação</h3>
              <p className="text-muted-foreground">133 horas • 6 módulos • Material incluso</p>
            </div>

            {/* Preços */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-lg text-muted-foreground line-through">De R$ 1.497</span>
                <span className="text-4xl font-bold text-teal">R$ 897</span>
              </div>
              <p className="text-sm text-muted-foreground">ou 12x de R$ 89,70 sem juros</p>
            </div>

            {/* Terminal de desconto */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 ml-2">desconto-programacao.sh</span>
              </div>
              <div className="text-left space-y-1">
                <div className="text-green-400">$ calcular_economia()</div>
                <div className="text-white">Economia: R$ 600,00</div>
                <div className="text-white">Desconto: 40%</div>
                <div className="text-teal">Status: ✓ Promoção ativa!</div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-teal">✓</span>
                <span className="text-sm">133 horas de conteúdo prático</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal">✓</span>
                <span className="text-sm">Material didático impresso incluso</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal">✓</span>
                <span className="text-sm">Modalidades presencial e online</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal">✓</span>
                <span className="text-sm">6 projetos práticos para portfólio</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal">✓</span>
                <span className="text-sm">Certificado de conclusão</span>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-teal hover:bg-teal/90 text-navy font-semibold">
                Matricular-se agora
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                Falar com consultor
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Formas de pagamento: Cartão, PIX, Boleto
              </p>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-teal/10 border border-teal/20 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🛡️</span>
            </div>
            <h4 className="font-semibold mb-2">Garantia de Qualidade</h4>
            <p className="text-sm text-muted-foreground">
              Escola Habilidade com mais de 10 anos formando profissionais qualificados em Santa Catarina
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}