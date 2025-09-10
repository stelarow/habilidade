import React, { useState } from 'react';
import { Star, CaretLeft, CaretRight, Quotes, MapPin, Calendar } from '@phosphor-icons/react';

// Depoimentos reais dos dados do coursesData.js
const testimonials = [
  {
    id: 1,
    name: 'Letícia Mendes',
    role: 'Informática Fundamental',
    photo: '/testimonials/leticia-mendes.jpg',
    rating: 5,
    text: 'Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 2,
    name: 'Mateus Oliveira',
    role: 'Informática Fundamental',
    photo: '/testimonials/mateus-oliveira.jpg',
    rating: 5,
    text: 'O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 3,
    name: 'Gabriela Costa Silva',
    role: 'Informática Fundamental',
    photo: '/testimonials/gabriela-costa-silva.jpg',
    rating: 5,
    text: 'A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.',
    location: 'São José - SC',
    date: 'jan. de 2025'
  },
  {
    id: 4,
    name: 'Lucas Felipe Ribeiro',
    role: 'Informática Fundamental',
    photo: '/testimonials/lucas-felipe-ribeiro.jpg',
    rating: 5,
    text: 'Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 5,
    name: 'Carolina Almeida',
    role: 'Informática Fundamental',
    photo: '/testimonials/carolina-almeida.jpg',
    rating: 5,
    text: 'As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.',
    location: 'São José - SC',
    date: 'nov. de 2024'
  },
  {
    id: 6,
    name: 'Pedro Henrique Soares',
    role: 'Informática Fundamental',
    photo: '/testimonials/pedro-henrique-soares.jpg',
    rating: 5,
    text: 'Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  }
];

export const InformaticaNovaTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">O QUE NOSSOS</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
              ALUNOS DIZEM
            </span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Mais de 150 alunos já transformaram suas vidas com nosso método. 
            Veja o que eles têm a dizer sobre a experiência.
          </p>
        </div>

        {/* Carousel de depoimentos */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Depoimento atual */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            
            {/* Quote icon */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full flex items-center justify-center">
              <Quotes className="w-6 h-6 text-blue-400" />
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {renderStars(testimonials[currentIndex].rating)}
            </div>

            {/* Depoimento */}
            <blockquote className="text-lg md:text-xl text-zinc-200 leading-relaxed mb-8 max-w-3xl mx-auto">
              "{testimonials[currentIndex].text}"
            </blockquote>

            {/* Informações do aluno */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <img
                src={testimonials[currentIndex].photo}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              />
              
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-blue-300 font-medium text-sm mb-2">
                  {testimonials[currentIndex].role}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{testimonials[currentIndex].location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{testimonials[currentIndex].date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <CaretLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <CaretRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-400' : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-zinc-400">Avaliação média</div>
            <div className="flex justify-center gap-1 mt-2">
              {renderStars(5)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <div className="text-zinc-400">Alunos aprovados</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">92%</div>
            <div className="text-zinc-400">Taxa de satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
};