import { useState } from 'react';
import { CaretDown, CaretUp, PlayCircle, Article, PuzzlePiece, Trophy, Monitor, PenNib, Palette, FigmaLogo } from '@phosphor-icons/react';

const moduleIcons = {
  1: Monitor,
  2: PenNib,
  3: Palette,
  4: FigmaLogo,
  5: Trophy,
};

const moduleColors = {
  1: '#31A8FF',
  2: '#FF9A00',
  3: '#FF3366',
  4: '#00C4CC',
  5: '#00B4F5',
};

const getLessonIcon = (type) => {
  switch (type) {
    case 'video': { return PlayCircle; }
    case 'text': { return Article; }
    case 'exercise': { return PuzzlePiece; }
    case 'project': { return Trophy; }
    default: { return PlayCircle; }
  }
};

const formatTotalDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  return `${hours}h`;
};

export const DesignGraficoCurriculum = ({ course }) => {
  const [expandedModules, setExpandedModules] = useState(new Set());
  console.log('[DesignGraficoCurriculum] Component rendered, course:', course?.basicInfo?.title);

  const toggleModule = (moduleIndex) => {
    console.log('[DesignGraficoCurriculum] toggleModule called with moduleIndex:', moduleIndex);
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleIndex)) {
      newExpanded.delete(moduleIndex);
    } else {
      newExpanded.add(moduleIndex);
    }
    setExpandedModules(newExpanded);
  };

  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
  const totalHours = course.curriculum.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      const minutes = Number.parseInt(lesson.duration.match(/\d+/)?.[0] || '0');
      return moduleTotal + minutes;
    }, 0);
  }, 0);

  return (
    <section id="curriculum" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Grade <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Curricular</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            5 módulos completos • {totalLessons} aulas • {formatTotalDuration(totalHours)} de conteúdo prático
          </p>
        </div>

        <div className="space-y-4">
          {course.curriculum.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(moduleIndex);
            const Icon = moduleIcons[moduleIndex + 1] || Monitor;
            const color = moduleColors[moduleIndex + 1] || '#9C27B0';

            return (
              <div
                key={module.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => {
                    console.log('[DesignGraficoCurriculum] Button clicked, moduleIndex:', moduleIndex);
                    toggleModule(moduleIndex);
                  }}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon size={28} weight="duotone" style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1 truncate">{module.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-purple-400 font-medium">
                          {module.lessons.length} aulas
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                          {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {isExpanded ? (
                      <CaretUp size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    ) : (
                      <CaretDown size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 overflow-x-hidden">
                    <div className="grid gap-3 min-w-0 max-w-full">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const LessonIcon = getLessonIcon(lesson.type);
                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group min-w-0"
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <LessonIcon size={20} weight="duotone" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0 w-full overflow-hidden">
                              <h4 className="text-white font-medium text-sm group-hover:text-gray-200 transition-colors truncate block">
                                {lessonIndex + 1}. {lesson.title}
                              </h4>
                            </div>
                            <span className="text-gray-500 text-xs flex-shrink-0">{lesson.duration}</span>
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

        <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{course.curriculum.length}</div>
              <div className="text-sm text-gray-400">Módulos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{totalLessons}</div>
              <div className="text-sm text-gray-400">Aulas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">{formatTotalDuration(totalHours)}</div>
              <div className="text-sm text-gray-400">Duração</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">5</div>
              <div className="text-sm text-gray-400">Softwares</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};