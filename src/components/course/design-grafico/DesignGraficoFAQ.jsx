import { useState } from 'react';
import { CaretDown, CaretUp, Question, Palette, Monitor, BookOpen, Trophy } from '@phosphor-icons/react';

const iconMap = [Question, Palette, Monitor, BookOpen, Trophy];

export const DesignGraficoFAQ = ({ course }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  console.log('[DesignGraficoFAQ] Component rendered, course:', course?.basicInfo?.title);

  if (!course.faq || course.faq.length === 0) {
    console.log('[DesignGraficoFAQ] No FAQ items, returning null');
    return null;
  }

  const toggleItem = (index) => {
    console.log('[DesignGraficoFAQ] toggleItem called with index:', index);
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-zinc-950 to-purple-950/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Perguntas <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Frequentes</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Tudo que você precisa saber antes de começar
          </p>
        </div>

        <div className="space-y-4">
          {course.faq.map((item, index) => {
            const isExpanded = expandedItems.has(index);
            const Icon = iconMap[index % iconMap.length];

            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => {
                    console.log('[DesignGraficoFAQ] Button clicked, index:', index);
                    toggleItem(index);
                  }}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-4 flex-1 pr-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} weight="duotone" className="text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-gray-200 transition-colors truncate">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <CaretUp size={24} className="text-purple-400" />
                    ) : (
                      <CaretDown size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pl-16">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-300 mb-6">
              Nossa equipe está pronta para esclarecer todas as suas questões sobre o curso.
            </p>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 cursor-pointer"
            >
              Falar com Consultor
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};