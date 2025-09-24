import React from 'react';
import { Star } from '@phosphor-icons/react';

export const ProgramacaoNovaTestimonials = () => {
  const testimonials = [
    {
      name: "Ana Costa",
      role: "Desenvolvedora Frontend",
      content: "O curso me deu toda a base que precisava para trabalhar com programação. Hoje sou desenvolvedora em uma startup!",
      rating: 5,
      image: "/assets/testimonials/ana.jpg"
    },
    {
      name: "Roberto Oliveira",
      role: "Freelancer Python",
      content: "Aprendi desde o básico até projetos complexos. Consegui meus primeiros clientes 3 meses após terminar o curso.",
      rating: 5,
      image: "/assets/testimonials/roberto.jpg"
    },
    {
      name: "Juliana Ferreira",
      role: "Analista de Sistemas",
      content: "As aulas práticas foram fundamentais. Saí do curso já com vários projetos no meu portfólio.",
      rating: 5,
      image: "/assets/testimonials/juliana.jpg"
    }
  ];

  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            O que nossos <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Alunos</span> dizem
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Depoimentos reais de quem mudou de vida com programação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-zinc-300 mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-purple-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};