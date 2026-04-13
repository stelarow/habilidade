import React from 'react'

export function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Paulo Henrique Santos',
      role: 'Programação',
      rating: 5,
      text: 'O curso de Programação mudou minha forma de pensar. Nunca imaginei que aprender lógica e código pudesse ser tão prático. As aulas são muito bem organizadas.',
      location: 'São José - SC',
      date: 'dez. de 2024',
      initial: 'P'
    },
    {
      id: 2,
      name: 'Letícia Ribeiro',
      role: 'Programação',
      rating: 5,
      text: 'Escolhi o curso sem saber nada de programação e já estou desenvolvendo meus primeiros projetos. O professor tem uma didática incrível e sempre nos motiva.',
      location: 'São José - SC',
      date: 'jan. de 2025',
      initial: 'L'
    },
    {
      id: 3,
      name: 'Isadora Lima',
      role: 'Programação',
      rating: 5,
      text: 'Estou impressionada com a evolução que tive. O curso é direto ao ponto, com muita prática. O professor torna assuntos complexos fáceis de entender.',
      location: 'São José - SC',
      date: 'dez. de 2024',
      initial: 'I'
    }
  ]

  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((previous) => (previous + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const current = testimonials[currentTestimonial]

  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            Nossos alunos aprovam
          </h2>

          <div className="bg-white text-gray-900 rounded-lg p-8 mb-8 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                <span className="text-navy font-bold">{current.initial}</span>
              </div>
              <div className="text-left">
                <div className="font-semibold">{current.name}</div>
                <div className="text-gray-600">Aluno de {current.role}</div>
              </div>
            </div>
            <p className="text-lg italic mb-4">
              "{current.text}"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: current.rating }, (_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {current.location} • {current.date}
              </div>
            </div>
          </div>

          {/* Indicadores de navegação */}
          <div className="flex justify-center gap-2 mb-12">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-teal' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <span className="text-teal">✓ Material didático incluso</span>
            </div>
            <div className="text-center">
              <span className="text-teal">✓ Modalidades presencial e online</span>
            </div>
            <div className="text-center">
              <span className="text-teal">✓ 6 projetos práticos</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 mb-4">
              Mais de 133 horas de curso prático para você dominar programação
            </p>
            <div
              className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-w-md mx-auto cursor-pointer hover:bg-gray-800 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-teal/50"
              onClick={() => window.open('https://wa.me/5548988559491?text=Tenho%20interesse%20em%20aprender%20programa%C3%A7%C3%A3o.%20Quais%20linguagens%20voc%C3%AAs%20ensinam%3F%20%C3%89%20para%20iniciantes%3F', '_blank')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.open('https://wa.me/5548988559491?text=Tenho%20interesse%20em%20aprender%20programa%C3%A7%C3%A3o.%20Quais%20linguagens%20voc%C3%AAs%20ensinam%3F%20%C3%89%20para%20iniciantes%3F', '_blank')
                }
              }}
            >
              <div className="text-green-400">console.log('Próximo passo:')</div>
              <div className="text-teal">{'> \'Matricule-se agora!\' 🚀'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}