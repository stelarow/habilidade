import { 
  Megaphone, 
  Star,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Juliana Marques",
    initials: "JM",
    location: "São José/SC",
    testimonial: "Estou adorando o curso! Professor explica tudo de um jeito fácil...",
    rating: 5
  },
  {
    id: 2,
    name: "Carlos Eduardo",
    initials: "CE", 
    location: "São José/SC",
    testimonial: "Já estou aplicando no trabalho tudo que aprendo...",
    rating: 5
  },
  {
    id: 3,
    name: "Marina Silva",
    initials: "MS",
    location: "Florianópolis/SC", 
    testimonial: "O curso superou minhas expectativas. Metodologia excelente!",
    rating: 5
  }
];

export const ProjetistaTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const testimonial = testimonials[currentTestimonial];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Megaphone className="w-4 h-4" />
            O QUE NOSSOS ALUNOS DIZEM
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">DEPOIMENTOS</span>
            <br />
            <span className="text-white">DE QUEM JÁ TRANSFORMOU A VIDA</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Current Testimonial */}
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-8 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {testimonial.initials}
              </div>
              
              <div className="flex-1">
                <blockquote className="text-xl text-white mb-4 italic">
                  "{testimonial.testimonial}"
                </blockquote>
                
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="text-purple-400 font-semibold">
                  {testimonial.name} - {testimonial.location}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-zinc-800/50 backdrop-blur border border-zinc-700 hover:border-purple-400 transition-colors duration-300 group"
            >
              <CaretLeft className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-400 scale-125' 
                      : 'bg-zinc-600 hover:bg-purple-400/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-zinc-800/50 backdrop-blur border border-zinc-700 hover:border-purple-400 transition-colors duration-300 group"
            >
              <CaretRight className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            </button>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1">
              <Star className="inline w-5 h-5 mr-2" />
              EU TAMBÉM QUERO ESSAS APROVAÇÕES - ÚLTIMAS VAGAS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};