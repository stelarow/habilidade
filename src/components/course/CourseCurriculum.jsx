import { useState } from 'react';
import PropTypes from 'prop-types';
import { CaretDown, CaretUp, Article, PuzzlePiece, RocketLaunch, Users } from 'phosphor-react';
import { useViewportSize } from '../../hooks/useViewportSize';
import { getLessonIconByArea } from '../../utils/lessonIcons';
import { getLessonLabel } from '../../utils/lessonLabels';

function CourseCurriculum({ course }) {
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // Primeiro módulo expandido por padrão
  const { isMobile, isTablet } = useViewportSize();

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (type, courseSlug) => {
    return getLessonIconByArea(courseSlug, type);
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'video': return course.themeColors.primary;
      case 'text': return course.themeColors.secondary;
      case 'exercise': return course.themeColors.accent;
      case 'project': return '#10B981'; // Green for projects
      default: return course.themeColors.primary;
    }
  };

  // Calcular estatísticas
  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
  const totalDuration = course.curriculum.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      const minutes = parseInt(lesson.duration.match(/\d+/)?.[0] || '0');
      return moduleTotal + minutes;
    }, 0);
  }, 0);

  const formatTotalDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className={`@container bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl mb-16 max-w-full overflow-hidden ${isMobile ? 'p-4' : 'p-6 sm:p-8'}`}>
      
      {/* Header Responsivo */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between min-w-0 max-w-full ${isMobile ? 'mb-6' : 'mb-8'}`}>
        <div className={`min-w-0 flex-1 ${isMobile ? 'mb-4' : 'md:mb-0 md:mr-4'}`}>
          <h2 className={`font-bold text-white mb-2 break-words ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Currículo do Curso</h2>
          <p className={`text-gray-400 break-words leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
            {course.curriculum.length} módulos • {totalLessons} aulas • {formatTotalDuration(totalDuration)} de conteúdo
          </p>
        </div>
        
        {/* Botões Expand/Collapse - Mobile Friendly */}
        <div className={`flex gap-2 flex-shrink-0 ${isMobile ? 'w-full' : 'md:w-auto'}`}>
          <button
            onClick={() => setExpandedModules(new Set(course.curriculum.map((_, index) => index)))}
            className={`px-3 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors min-h-[44px] ${isMobile ? 'flex-1 text-xs' : 'md:flex-none text-sm'}`}
          >
            Expandir Todos
          </button>
          <button
            onClick={() => setExpandedModules(new Set())}
            className={`px-3 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors min-h-[44px] ${isMobile ? 'flex-1 text-xs' : 'md:flex-none text-sm'}`}
          >
            Fechar Todos
          </button>
        </div>
      </div>

      {/* Context 7: Modules com overflow protection */}
      <div className={`max-w-full overflow-hidden ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
        {course.curriculum.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(moduleIndex);
          const moduleDuration = module.lessons.reduce((total, lesson) => {
            const minutes = parseInt(lesson.duration.match(/\d+/)?.[0] || '0');
            return total + minutes;
          }, 0);

          return (
            <div 
              key={module.id} 
              className="border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600 transform-gpu max-w-full"
              style={{
                borderColor: isExpanded ? `${course.themeColors.primary}40` : undefined
              }}
            >
              
              {/* Context 7: Module Header com overflow control */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className={`w-full bg-gray-800/30 hover:bg-gray-800/50 transition-colors text-left max-w-full overflow-hidden ${isMobile ? 'px-4 py-4 min-h-[60px]' : 'px-6 py-4'}`}
              >
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-start justify-between'} min-w-0 max-w-full gap-3`}>
                  <div className={`flex items-start gap-3 md:gap-4 flex-1 min-w-0 ${isMobile ? 'mb-2' : 'md:mb-0'}`}>
                    {/* Número do módulo menor em mobile */}
                    <div 
                      className={`rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'}`}
                      style={{ backgroundColor: course.themeColors.primary }}
                    >
                      {moduleIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <h3 className={`font-semibold text-white mb-1 break-words line-clamp-2 leading-tight ${isMobile ? 'text-base' : 'text-lg'}`}>{module.title}</h3>
                      <p className={`text-gray-400 break-words line-clamp-2 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>{module.description}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between md:justify-end gap-4 flex-shrink-0 ${isMobile ? 'ml-9' : 'md:ml-0'}`}>
                    <div className={`text-left md:text-right text-gray-400 whitespace-nowrap ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <div>{module.lessons.length} aulas</div>
                      <div>{formatTotalDuration(moduleDuration)}</div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <CaretUp size={18} className="text-gray-400" />
                      ) : (
                        <CaretDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Context 7: Module Lessons com altura controlada e overflow protection */}
              {isExpanded && (
                <div className={`max-w-full overflow-hidden ${isMobile ? 'px-4 pb-4' : 'px-6 pb-4'}`}>
                  <div className={`mt-4 max-w-full overflow-hidden ${isMobile ? 'space-y-2 max-h-96 overflow-y-auto' : 'space-y-3 md:max-h-none'} transition-all duration-300`} style={{ WebkitOverflowScrolling: 'touch' }}>
                    {module.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type, course.basicInfo.slug);
                      const iconColor = getLessonTypeColor(lesson.type);

                      return (
                        <div 
                          key={lesson.id}
                          className={`flex items-start gap-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors cursor-pointer group ${isMobile ? 'p-2' : 'p-3'}`}
                          style={{
                            // Força contenção horizontal
                            maxWidth: '100%',
                            overflow: 'hidden',
                            minWidth: 0,
                            // Flexbox constrangido
                            flex: '1 1 0%'
                          }}
                        >
                          
                          {/* Context 7: Icon com tamanho fixo */}
                          <div 
                            className={`rounded-xl flex items-center justify-center flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}
                            style={{ backgroundColor: `${iconColor}20` }}
                          >
                            <LessonIcon 
                              size={isMobile ? 16 : 20} 
                              weight="duotone"
                              className={`transition-all group-hover:scale-110 duration-200`}
                              style={{ color: iconColor }}
                            />
                          </div>
                          
                          {/* Context 7: Lesson Info com overflow control BULLETPROOF */}
                          <div 
                            className="flex-1 overflow-hidden"
                            style={{
                              flex: '1 1 0%',
                              minWidth: 0,
                              overflow: 'hidden',
                              maxWidth: '100%'
                            }}
                          >
                            <div 
                              className={`${isMobile ? 'flex flex-col gap-1' : 'flex flex-row md:items-start md:justify-between'}`}
                              style={{
                                minWidth: 0,
                                maxWidth: '100%',
                                overflow: 'hidden'
                              }}
                            >
                              <h4 
                                className={`text-white font-medium leading-tight group-hover:text-gray-200 transition-colors ${isMobile ? 'text-sm mb-1' : 'text-base mb-1 md:mb-0 md:mr-4 flex-1 min-w-0'}`}
                                style={{
                                  // Força quebra de palavras
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  // Limita a 2 linhas com CSS nativo
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  // Evita expansão horizontal
                                  maxWidth: '100%',
                                  width: '100%',
                                  // Line height otimizado
                                  lineHeight: '1.3'
                                }}
                              >
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                              <div className={`flex flex-wrap items-center gap-2 text-gray-400 flex-shrink-0 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                
                                {/* Context 7: Lesson Type com whitespace-nowrap */}
                                <span 
                                  className={`px-2 py-1 rounded font-medium whitespace-nowrap ${isMobile ? 'text-xs' : 'text-xs'}`}
                                  style={{ 
                                    backgroundColor: `${iconColor}20`,
                                    color: iconColor 
                                  }}
                                >
                                  {lesson.label || getLessonLabel(course.basicInfo.slug, lesson.type)}
                                </span>
                                
                                {/* Context 7: Duration com whitespace-nowrap */}
                                <span className="whitespace-nowrap">{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Context 7: Course Summary com overflow protection */}
      <div className={`bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 max-w-full overflow-hidden ${isMobile ? 'mt-6 p-4' : 'mt-8 p-6'}`}>
        <div className={`text-center max-w-full ${isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 md:grid-cols-4 gap-4'}`}>
          <div className="min-w-0">
            <div className={`font-bold text-white mb-1 break-words ${isMobile ? 'text-xl' : 'text-2xl'}`}>{course.curriculum.length}</div>
            <div className="text-sm text-gray-400">Módulos</div>
          </div>
          <div className="min-w-0">
            <div className={`font-bold text-white mb-1 break-words ${isMobile ? 'text-xl' : 'text-2xl'}`}>{totalLessons}</div>
            <div className="text-sm text-gray-400">Aulas</div>
          </div>
          <div className="min-w-0">
            <div className={`font-bold text-white mb-1 break-words ${isMobile ? 'text-xl' : 'text-2xl'}`}>{formatTotalDuration(totalDuration)}</div>
            <div className="text-sm text-gray-400">Duração</div>
          </div>
          <div className="min-w-0">
            <div className={`font-bold break-words leading-tight ${isMobile ? 'text-lg' : 'text-2xl'}`} style={{ color: course.themeColors.primary }}>
              Presencial ou Online
            </div>
            <div className="text-sm text-gray-400">Modalidades</div>
          </div>
        </div>
      </div>
    </div>
  );
}

CourseCurriculum.propTypes = {
  course: PropTypes.shape({
    curriculum: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      lessons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['video', 'text', 'exercise', 'project']).isRequired,
      })).isRequired,
    })).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CourseCurriculum; 