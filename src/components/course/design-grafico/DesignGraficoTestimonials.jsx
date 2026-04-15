import { useState } from 'react';
import { Star, Quotes, Palette, PenNib, Monitor, Camera } from '@phosphor-icons/react';

const studentAvatars = [
  { icon: Palette, color: '#9C27B0' },
  { icon: PenNib, color: '#E91E63' },
  { icon: Monitor, color: '#FF5722' },
  { icon: Camera, color: '#00BCD4' },
  { icon: Palette, color: '#673AB7' },
  { icon: PenNib, color: '#F44336' },
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={18}
      weight={index < rating ? 'fill' : 'regular'}
      className={index < rating ? 'text-yellow-400' : 'text-gray-600'}
    />
  ));
};

export const DesignGraficoTestimonials = ({ course }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  console.log('[DesignGraficoTestimonials] Component rendered, activeIndex:', activeIndex);

  if (!course.testimonials || course.testimonials.length === 0) {
    console.log('[DesignGraficoTestimonials] No testimonials, returning null');
    return null;
  }

  const nextSlide = () => {
    console.log('[DesignGraficoTestimonials] nextSlide called');
    setActiveIndex((prev) => (prev + 1) % course.testimonials.length);
  };

  const prevSlide = () => {
    console.log('[DesignGraficoTestimonials] prevSlide called');
    setActiveIndex((prev) => (prev - 1 + course.testimonials.length) % course.testimonials.length);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-zinc-950 via-purple-950/20 to-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            O que nossos <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">alunos</span> dizem
          </h2>
          <p className="text-gray-400 text-lg">
            Histórias reais de quem transformou a carreira com design gráfico
          </p>
        </div>

        <div className="relative">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Quotes size={28} weight="duotone" className="text-white" />
              </div>
            </div>

            <div className="min-h-[280px] md:min-h-[240px] flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {renderStars(course.testimonials[activeIndex].rating)}
                </div>
                <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                  "{course.testimonials[activeIndex].text}"
                </blockquote>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${studentAvatars[activeIndex % studentAvatars.length].color}30` }}
                >
                  {(() => {
                    const Icon = studentAvatars[activeIndex % studentAvatars.length].icon;
                    return <Icon size={32} weight="duotone" style={{ color: studentAvatars[activeIndex % studentAvatars.length].color }} />;
                  })()}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {course.testimonials[activeIndex].name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {course.testimonials[activeIndex].role} • {course.testimonials[activeIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => {
                console.log('[DesignGraficoTestimonials] Prev button clicked');
                prevSlide();
              }}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {course.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log('[DesignGraficoTestimonials] Dot clicked, index:', index);
                    setActiveIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    index === activeIndex ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                console.log('[DesignGraficoTestimonials] Next button clicked');
                nextSlide();
              }}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {course.testimonials.slice(0, 4).map((testimonial, index) => (
            <div
              key={testimonial.id}
              onClick={() => setActiveIndex(index)}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'bg-white/10 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex gap-1 mb-2">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-300 text-sm line-clamp-2 mb-2">"{testimonial.text.slice(0, 80)}..."</p>
              <p className="text-white text-xs font-medium">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};