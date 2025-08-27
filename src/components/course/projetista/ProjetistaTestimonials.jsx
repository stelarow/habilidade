import { 
  Megaphone, 
  Star
} from '@phosphor-icons/react';

export const ProjetistaTestimonials = () => {
  const reviews = [
    {
      id: 1,
      name: "Karolain Roberta Régis",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-20",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado, eles têm deles mesmo até IA ajudando o pessoal nas medições e até em render rápidos, fora a apostila bem completa.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 2,
      name: "Jonatas Torres",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-20",
      text: "Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando.",
      highlight: true,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 3,
      name: "Ana Caroline Orofino",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-15",
      text: "Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 4,
      name: "Juliana Marques",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-01",
      text: "Estou adorando o curso! Professor explica tudo de um jeito fácil, metodologia muito boa e as turmas pequenas fazem toda a diferença. Recomendo muito!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 5,
      name: "Carlos Eduardo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-20",
      text: "Já estou aplicando no trabalho tudo que aprendo aqui. O curso tem muito conteúdo prático e o suporte dos professores é excelente. Valeu cada centavo!",
      highlight: true,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 6,
      name: "Marina Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-15",
      text: "O curso superou minhas expectativas. Metodologia excelente, material completo e professores muito qualificados. Estou conseguindo criar projetos incríveis!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
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

  const formatDateConsistent = (dateString) => {
    const months = {
      '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', 
      '05': 'mai', '06': 'jun', '07': 'jul', '08': 'ago',
      '09': 'set', '10': 'out', '11': 'nov', '12': 'dez'
    };
    
    const [year, month] = dateString.split('-');
    const monthName = months[month];
    
    return `${monthName}. de ${year}`;
  };

  function ReviewCard({ review, index }) {
    return (
      <div className="break-inside-avoid group">
        <div className={`bg-gradient-to-r ${review.gradient} rounded-2xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:shadow-${review.shadowColor} tech-card`}>
          <div className="w-full bg-zinc-900 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
            
            <div className="flex justify-between items-start mb-4">
              <Megaphone size={20} className="text-purple-400 opacity-60 tech-icon" weight="fill" />
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
                    <p className="text-purple-400 font-medium text-xs">{review.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                    <Star size={10} />
                    {formatDateConsistent(review.date)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Megaphone size={10} />
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

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-950 text-white">
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

          <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Histórias reais de transformação profissional com nosso método presencial
          </p>
        </div>

        {/* Mosaico de Reviews */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-16">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1">
            <Star className="inline w-5 h-5 mr-2" />
            EU TAMBÉM QUERO ESSAS APROVAÇÕES - ÚLTIMAS VAGAS
          </button>
        </div>
      </div>
    </section>
  );
};