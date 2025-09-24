export function PlatformSection() {
  const features = [
    {
      title: "Aprenda & Pratique",
      description: "Desenvolvimento prático com projetos reais do mercado de trabalho.",
      highlight: "Frontend & Backend"
    },
    {
      title: "Projetos & Portfólio",
      description: "Crie um portfólio impressionante com aplicações completas e funcionais.",
      highlight: "Projetos Reais"
    },
    {
      title: "Carreira & Mentoria",
      description: "Suporte completo para transição de carreira e preparação para entrevistas.",
      highlight: "Mentoria 1:1"
    }
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            A plataforma completa para se tornar desenvolvedor
          </h2>
          <p className="text-lg text-muted-foreground">
            Do planejamento ao deploy, aprenda todo o ciclo de desenvolvimento com metodologia comprovada
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-card border rounded-lg p-8 h-full hover:shadow-lg transition-shadow">
                <div className="text-teal font-semibold mb-4">{feature.highlight}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}