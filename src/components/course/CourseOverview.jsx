import PropTypes from 'prop-types';
import { Clock, Users, Trophy, Calendar, DollarSign, CheckCircle } from 'phosphor-react';

function CourseOverview({ course }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateDiscount = () => {
    if (course.investment.originalPrice <= course.investment.currentPrice) return 0;
    return Math.round(((course.investment.originalPrice - course.investment.currentPrice) / course.investment.originalPrice) * 100);
  };

  const overviewItems = [
    {
      icon: <Clock size={24} />,
      label: 'Duração',
      value: course.basicInfo.duration,
      highlight: true,
    },
    {
      icon: <Users size={24} />,
      label: 'Nível',
      value: course.basicInfo.level,
    },
    {
      icon: <Trophy size={24} />,
      label: 'Certificado',
      value: course.basicInfo.certificate ? 'Incluso' : 'Não incluso',
    },
    {
      icon: <Calendar size={24} />,
      label: 'Modalidade',
      value: 'Presencial',
    },
    {
      icon: <DollarSign size={24} />,
      label: 'Investimento',
      value: formatPrice(course.investment.currentPrice),
      highlight: true,
    },
    {
      icon: <CheckCircle size={24} />,
      label: 'Categoria',
      value: course.basicInfo.category,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Visão Geral do Curso
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewItems.map((item, index) => (
          <div 
            key={index}
            className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
              item.highlight 
                ? 'bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-white/20' 
                : 'bg-gray-800/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-full flex-shrink-0"
                style={{ 
                  backgroundColor: `${course.themeColors.primary}20`,
                  color: course.themeColors.primary 
                }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">{item.label}</p>
                <p className={`font-semibold ${item.highlight ? 'text-white text-lg' : 'text-gray-200'}`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Highlight */}
      {course.investment.originalPrice > course.investment.currentPrice && (
        <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/30 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-green-400 text-2xl font-bold">
                {calculateDiscount()}% OFF
              </span>
              <span className="text-gray-400 line-through text-lg">
                {formatPrice(course.investment.originalPrice)}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Ou {course.investment.installments.max}x de {formatPrice(course.investment.installments.value)} sem juros
            </p>
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <CheckCircle size={18} color={course.themeColors.primary} />
            Garantias Inclusas
          </h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Certificado reconhecido nacionalmente</li>
            <li>• Suporte durante todo o curso</li>
            <li>• Material didático incluso</li>
            <li>• Aulas práticas presenciais</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-800/30 rounded-lg">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Trophy size={18} color={course.themeColors.primary} />
            Diferenciais
          </h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Metodologia prática e atualizada</li>
            <li>• Equipe docente qualificada</li>
            <li>• Turmas reduzidas (máx. 15 alunos)</li>
            <li>• Laboratório equipado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

CourseOverview.propTypes = {
  course: PropTypes.object.isRequired,
};

export default CourseOverview; 