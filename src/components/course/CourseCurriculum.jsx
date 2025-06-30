import { useState } from 'react';
import PropTypes from 'prop-types';
import { CaretDown, CaretUp, ChalkboardTeacher, FileText, PencilSimple, FolderOpen, Users } from 'phosphor-react';

function CourseCurriculum({ course }) {
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // Primeiro módulo expandido por padrão

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return ChalkboardTeacher;
      case 'text': return FileText;
      case 'exercise': return PencilSimple;
      case 'project': return FolderOpen;
      default: return ChalkboardTeacher;
    }
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
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Currículo do Curso</h2>
          <p className="text-gray-400">
            {course.curriculum.length} módulos • {totalLessons} aulas • {formatTotalDuration(totalDuration)} de conteúdo
          </p>
        </div>
        
        {/* Expand/Collapse All */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedModules(new Set(course.curriculum.map((_, index) => index)))}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Expandir Todos
          </button>
          <button
            onClick={() => setExpandedModules(new Set())}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
          >
            Fechar Todos
          </button>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {course.curriculum.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(moduleIndex);
          const moduleDuration = module.lessons.reduce((total, lesson) => {
            const minutes = parseInt(lesson.duration.match(/\d+/)?.[0] || '0');
            return total + minutes;
          }, 0);

          return (
            <div 
              key={module.id} 
              className="border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600"
              style={{
                borderColor: isExpanded ? `${course.themeColors.primary}40` : undefined
              }}
            >
              
              {/* Module Header */}
              <button
                onClick={() => toggleModule(moduleIndex)}
                className="w-full px-6 py-4 bg-gray-800/30 hover:bg-gray-800/50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: course.themeColors.primary }}
                    >
                      {moduleIndex + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm text-gray-400">
                      <div>{module.lessons.length} aulas</div>
                      <div>{formatTotalDuration(moduleDuration)}</div>
                    </div>
                    {isExpanded ? (
                      <CaretUp size={20} className="text-gray-400" />
                    ) : (
                      <CaretDown size={20} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="px-6 pb-4">
                  <div className="space-y-3 mt-4">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const iconColor = getLessonTypeColor(lesson.type);

                      return (
                        <div 
                          key={lesson.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors cursor-pointer group"
                        >
                          
                          {/* Lesson Icon */}
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${iconColor}20` }}
                          >
                            <LessonIcon 
                              size={16} 
                              className="transition-colors group-hover:scale-110 duration-200"
                              style={{ color: iconColor }}
                            />
                          </div>
                          
                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium truncate group-hover:text-gray-200 transition-colors">
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                
                                {/* Lesson Type */}
                                <span 
                                  className="px-2 py-1 rounded text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${iconColor}20`,
                                    color: iconColor 
                                  }}
                                >
                                  {lesson.type === 'video' && 'Aula Prática'}
                                  {lesson.type === 'text' && 'Teoria'}
                                  {lesson.type === 'exercise' && 'Exercício'}
                                  {lesson.type === 'project' && 'Projeto'}
                                </span>
                                
                                {/* Duration */}
                                <span>{lesson.duration}</span>
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

      {/* Course Summary */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{course.curriculum.length}</div>
            <div className="text-sm text-gray-400">Módulos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{totalLessons}</div>
            <div className="text-sm text-gray-400">Aulas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">{formatTotalDuration(totalDuration)}</div>
            <div className="text-sm text-gray-400">Duração</div>
          </div>
          <div>
            <div className="text-2xl font-bold" style={{ color: course.themeColors.primary }}>
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