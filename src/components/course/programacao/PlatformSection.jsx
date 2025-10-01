import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation"

export function PlatformSection() {
  const [titleRef, titleVisible] = useScrollAnimation({ threshold: 0.3, once: true })
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

  const visibleCards = useStaggerAnimation(features.length, 200, titleVisible)

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
          titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            O curso de programação completo em são josé, presencial para você se transformar em um programador full stack
          </h2>
          <p className="text-lg text-muted-foreground">
            Do planejamento ao deploy, aprenda todo o ciclo de desenvolvimento com metodologia prática.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-card border rounded-lg p-8 h-full hover:shadow-lg hover:scale-105 hover:border-teal/50 transition-all duration-300 group">
                <div className="text-teal font-semibold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.highlight}
                </div>
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
