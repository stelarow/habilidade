export function TestimonialSection() {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            Transforme sua carreira hoje
          </h2>

          <div className="bg-white text-gray-900 rounded-lg p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                <span className="text-navy font-bold">M</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">Maria Silva</div>
                <div className="text-gray-600">Ex-contadora, hoje Desenvolvedora Full Stack</div>
              </div>
            </div>
            <p className="text-lg italic mb-6">
              "Em 6 meses saí da contabilidade para trabalhar como desenvolvedora em uma startup.
              O curso me deu toda a base técnica e confiança que eu precisava para fazer essa transição."
            </p>
            <div className="flex items-center gap-1 text-yellow-500">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <span className="text-teal">✓ Metodologia prática e eficiente</span>
            </div>
            <div className="text-center">
              <span className="text-teal">✓ Suporte durante toda a jornada</span>
            </div>
            <div className="text-center">
              <span className="text-teal">✓ Projetos para o seu portfólio</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 mb-4">
              Junte-se a centenas de alunos que já transformaram suas carreiras
            </p>
            <a href="#" className="text-teal hover:underline">
              Ver mais depoimentos →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}