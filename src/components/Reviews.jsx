import { Star, Quotes, MapPin, Calendar, User, Trophy } from '@phosphor-icons/react';
import Section from './Section';
import Starfield from './Starfield';
import GradientButton from './GradientButton';
import useInView from '../hooks/useInView';

const Reviews = () => {
  const stats = {
    totalReviews: 127,
    googleRating: 4.9,
    studentsGraduated: 1000,
    yearsExperience: 8
  };

  const reviews = [
    {
      id: 1,
      name: "Karolain Roberta Régis",
      course: "Projetista",
      rating: 5,
      date: "2024-11-20",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado, eles têm deles mesmo até IA ajudando o pessoal nas medições e até em render rápidos, fora a apostila bem completa.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 2,
      name: "Renan Souza",
      course: "Programação",
      rating: 5,
      date: "2024-10-15",
      text: "Minha experiência na Escola Habilidade está sendo ótima, estou no curso de programação. Curso presencial, atenção total do professor, atividades totalmente práticas e divertidas que chamam totalmente minha atenção.",
      highlight: true,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 3,
      name: "Emily Vitoria",
      course: "Informática Fundamental + Administração de Empresas",
      rating: 5,
      date: "2024-11-20",
      text: "Lugar ótimo e acolhedor, as turmas pequenas realmente facilitam a precisão na hora de aprender e o foco do professor para cada aluno. Recomendo!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 4,
      name: "Luiza Bóz Dutra",
      course: "Informática Fundamental",
      rating: 5,
      date: "2024-10-01",
      text: "O espaço é muito acolhedor, e as aulas são bastante explicativas e práticas. Durante as aulas, conseguimos tirar todas as nossas dúvidas, e os professores são extremamente dedicados.",
      highlight: true,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 5,
      name: "Jonatas Torres",
      course: "Projetista",
      rating: 5,
      date: "2024-11-20",
      text: "Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 6,
      name: "Ana Caroline Orofino",
      course: "Projetista",
      rating: 5,
      date: "2024-10-15",
      text: "Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        weight={index < rating ? 'fill' : 'regular'}
        className={index < rating ? 'text-yellow-400' : 'text-zinc-600'}
      />
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  function ReviewCard({ review, index }) {
    const [ref, visible] = useInView();
    
    return (
      <div
        ref={ref}
        className={`card-enter ${visible ? 'in-view' : ''} break-inside-avoid group`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className={`bg-gradient-to-r ${review.gradient} rounded-2xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:shadow-${review.shadowColor} tech-card`}>
          <div className="w-full bg-zinc-900 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
            
            <div className="flex justify-between items-start mb-4">
              <Quotes size={20} className="text-cyan-400 opacity-60 tech-icon" weight="fill" />
              {review.highlight && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold special-badge">
                  DESTAQUE
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              {renderStars(review.rating)}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4 text-sm group-hover:text-zinc-100 transition-colors duration-300">
              "{review.text}"
            </p>

            <div className="border-t border-zinc-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${review.gradient} flex items-center justify-center text-white font-bold text-sm tech-badge transition-transform duration-300 group-hover:scale-110`}>
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{review.name}</h4>
                    <p className="text-cyan-400 font-medium text-xs">{review.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                    <Calendar size={10} />
                    {new Date(review.date).toLocaleDateString('pt-BR', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin size={10} />
                    São José - SC
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function StatCard({ stat, index }) {
    const [ref, visible] = useInView();
    
    return (
      <div
        ref={ref}
        className={`card-enter ${visible ? 'in-view' : ''} text-center group`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-zinc-800 hover:border-cyan-400/50 transition-all duration-300 group-hover:scale-105 h-24 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center mb-2 h-6">
            {stat.icon}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-white mb-1 gradient-text">
            {stat.value}
          </div>
          <div className="text-xs text-zinc-400 font-medium">{stat.label}</div>
        </div>
      </div>
    );
  }

  return (
    <Section id="avaliacoes" className="px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0">
      <Starfield className="opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 tech-badge">
            <Star size={16} weight="fill" className="tech-icon" />
            Avaliações
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-white">
            O que nossos alunos dizem
          </h2>
          
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Histórias reais de transformação e sucesso profissional
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            <StatCard 
              stat={{
                icon: <div className="flex items-center justify-center gap-1">{renderStars(5)}</div>,
                value: stats.googleRating,
                label: "Google Reviews"
              }}
              index={0}
            />
            <StatCard 
              stat={{
                icon: <Star size={24} weight="fill" className="text-yellow-400 tech-icon" />,
                value: `${stats.totalReviews}+`,
                label: "Avaliações"
              }}
              index={1}
            />
            <StatCard 
              stat={{
                icon: <User size={24} weight="fill" className="text-cyan-400 tech-icon" />,
                value: `${stats.studentsGraduated}+`,
                label: "Alunos Formados"
              }}
              index={2}
            />
            <StatCard 
              stat={{
                icon: <Trophy size={24} weight="fill" className="text-purple-400 tech-icon" />,
                value: stats.yearsExperience,
                label: "Anos de Experiência"
              }}
              index={3}
            />
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-16">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping animation-delay-500"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy size={28} weight="fill" className="text-yellow-400 tech-icon" />
                <span className="text-xl font-bold">Seja o próximo sucesso!</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Desenvolva suas habilidades conosco
              </h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Junte-se aos nossos alunos que já aprimoraram suas habilidades e conhecimentos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GradientButton href="#cursos" className="px-8 py-3">
                  Ver Cursos Disponíveis
                </GradientButton>
                <GradientButton 
                  href="https://wa.me/5548988559491?text=Olá! Gostaria de agendar uma visita."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3"
                >
                  Agendar Visita
                </GradientButton>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-60">
          <div className="flex items-center gap-2 text-zinc-500 hover:text-purple-400 transition-colors duration-300">
            <Trophy size={18} className="tech-icon" />
            <span className="text-sm">Certificação Nacional</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 hover:text-pink-400 transition-colors duration-300">
            <MapPin size={18} className="tech-icon" />
            <span className="text-sm">Kobrasol, São José - SC</span>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Reviews;
