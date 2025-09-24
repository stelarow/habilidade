export function FrameworksSection() {
  const technologies = [
    { name: "HTML/CSS", icon: "🌐", description: "Fundamentos do desenvolvimento web" },
    { name: "JavaScript", icon: "⚡", description: "Linguagem de programação essencial" },
    { name: "React", icon: "⚛️", description: "Biblioteca para interfaces modernas" },
    { name: "Node.js", icon: "🚀", description: "Runtime JavaScript para backend" },
    { name: "MongoDB", icon: "🍃", description: "Banco de dados NoSQL" },
    { name: "Git/GitHub", icon: "🔧", description: "Controle de versão e colaboração" }
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-teal font-semibold mb-4">TECNOLOGIAS</div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Stack completo para o mercado
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda as tecnologias mais utilizadas pelas empresas de tecnologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-teal rounded flex items-center justify-center text-white">
                  {tech.icon}
                </div>
                <h3 className="font-semibold">{tech.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{tech.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            E muito mais: TypeScript, Express, APIs REST, Deploy, Testes...
          </p>
        </div>
      </div>
    </section>
  )
}