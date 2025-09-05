import React, { useState } from 'react';
import { motion } from '../../../utils/lazyMotion.jsx';
import { 
  Clock,
  Cube,
  Camera,
  CaretDown
} from '@phosphor-icons/react';

const ModuleSection = ({ title, icon: Icon, lessons, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div 
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg`}>
              <Icon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-zinc-300">{lessons.length} aulas • {lessons.length * 2}h total</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <CaretDown className="text-zinc-400" size={24} />
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{lesson.name}</h4>
                  <p className="text-sm text-zinc-300">{lesson.type}</p>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={16} />
                  <span className="text-sm">{lesson.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ProjetistaCurriculum = () => {
  const sketchupLessons = [
    { name: "Fundamentos do SketchUp", type: "Modelagem", duration: "120 min" },
    { name: "Modificadores e Geometrias", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado – Volume Simples", type: "Projeto", duration: "120 min" },
    { name: "Grupos e Componentes", type: "Modelagem", duration: "120 min" },
    { name: "Manipulação Avançada de Geometrias", type: "Modelagem", duration: "120 min" },
    { name: "Eixos e Superfícies Inclinadas", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado – Elementos Arquitetônicos", type: "Projeto", duration: "120 min" },
    { name: "Materiais e Texturas", type: "Modelagem", duration: "120 min" },
    { name: "Ferramenta Siga-me (Follow Me)", type: "Modelagem", duration: "120 min" },
    { name: "Sandbox e Terrenos", type: "Modelagem", duration: "120 min" },
    { name: "Vetorização e Logotipos 3D", type: "Modelagem", duration: "120 min" },
    { name: "Ferramentas de Sólidos", type: "Modelagem", duration: "120 min" },
    { name: "Importação de Arquivos CAD", type: "Modelagem", duration: "120 min" },
    { name: "Introdução ao Layout do SketchUp", type: "Modelagem", duration: "120 min" },
    { name: "Documentação Técnica com Layout", type: "Modelagem", duration: "120 min" },
    { name: "Plugins Essenciais", type: "Modelagem", duration: "120 min" },
    { name: "Componentes Dinâmicos I", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado – Interiores Residenciais", type: "Projeto", duration: "120 min" },
    { name: "Projeto Guiado – Fachada com Terreno", type: "Projeto", duration: "120 min" },
    { name: "Layout Final do Projeto Completo", type: "Projeto", duration: "120 min" }
  ];

  const enscapeLessons = [
    { name: "Introdução ao Enscape e Configuração Inicial", type: "Renderização", duration: "120 min" },
    { name: "Iluminação Natural e Artificial", type: "Renderização", duration: "120 min" },
    { name: "Materiais e Texturização no Enscape", type: "Renderização", duration: "120 min" },
    { name: "Câmeras e Enquadramentos Profissionais", type: "Renderização", duration: "120 min" },
    { name: "Configurações de Render e Qualidade", type: "Renderização", duration: "120 min" },
    { name: "Animações e Vídeos com Enscape", type: "Renderização", duration: "120 min" },
    { name: "Ambientes Externos e Vegetação", type: "Renderização", duration: "120 min" },
    { name: "Projeto Guiado Completo com Enscape", type: "Projeto", duration: "120 min" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900/80 via-zinc-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grade <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Curricular</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Conteúdo estruturado para levar você do básico ao nível profissional
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-zinc-300">
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              28 aulas completas
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              56 horas de conteúdo
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
              2 softwares profissionais
            </span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <ModuleSection 
            title="SketchUp - Modelagem 3D"
            icon={Cube}
            lessons={sketchupLessons}
            color="purple-600"
          />
          
          <ModuleSection 
            title="Enscape - Renderização Fotorrealística"
            icon={Camera}
            lessons={enscapeLessons}
            color="purple-600"
          />
        </div>
      </div>
    </section>
  );
};