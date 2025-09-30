import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/shared/CountdownTimer"

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
            Invista no seu futuro como programador com o curso mais completo da grande florianópolis
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card border rounded-xl p-8 text-center relative overflow-hidden">
            {/* Badge de desconto */}
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-bold">
                32% OFF
              </Badge>
            </div>

            {/* Contador de promoção */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-2">🔥 Promoção válida por apenas:</p>
              <CountdownTimer 
                className="justify-center"
                textClassName="text-yellow-600" 
                bgClassName="bg-yellow-100"
              />
              <p className="text-xs text-yellow-700 mt-2">Tempo limitado</p>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Curso Completo de Programação</h3>
              <p className="text-muted-foreground">133 horas • 6 módulos • Material incluso</p>
            </div>

            {/* Preços */}
            <div className="mb-8">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-teal mb-2">12x R$ 399,90</div>
                <p className="text-lg text-muted-foreground">mensais no boleto</p>
              </div>
              <div className="space-y-1 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-sm text-muted-foreground line-through">De R$ 6.998</span>
                  <span className="text-lg font-semibold text-muted-foreground">Total: R$ 4.788</span>
                </div>
                <p className="text-sm text-muted-foreground">10x sem juros no cartão: R$ 478,80</p>
                <p className="text-sm font-semibold text-green-600">À vista com + 6% de desconto: R$ 4.501</p>
              </div>
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
                <div className="text-white">Economia: R$ 2.210,00</div>
                <div className="text-white">Desconto: 32%</div>
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