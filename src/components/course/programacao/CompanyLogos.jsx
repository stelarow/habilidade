"use client"

import { useEffect, useState } from "react"

export function CompanyLogos() {
  const testimonials = [
    {
      name: "João Silva",
      role: "Desenvolvedor Full-Stack",
      text: "O curso mudou minha vida! Consegui emprego como desenvolvedor em 6 meses.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Desenvolvedora Frontend",
      text: "Metodologia incrível! Os professores são muito didáticos e experientes.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Desenvolvedor Backend",
      text: "Melhor investimento que já fiz. Saí do zero e hoje trabalho em uma startup.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Desenvolvedora Mobile",
      text: "Curso completo e atualizado. Aprendi muito além do que esperava.",
      rating: 5
    },
    {
      name: "Pedro Lima",
      role: "Programador Java",
      text: "Excelente estrutura e suporte. Recomendo para quem quer mudar de carreira.",
      rating: 5
    },
    {
      name: "Juliana Ferreira",
      role: "Desenvolvedora Python",
      text: "Professores experientes e conteúdo sempre atualizado. Valeu muito a pena!",
      rating: 5
    }
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="py-12 bg-background border-b border-border/20">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground text-sm mb-8 uppercase tracking-wide">
          Avaliações dos nossos alunos
        </p>
        <div className="relative overflow-hidden max-w-2xl mx-auto">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm mb-3 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}