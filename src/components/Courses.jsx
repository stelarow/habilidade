// import { Link } from 'react-router-dom'; // Not needed for SSG
import Starfield from './Starfield';
import Section from './Section';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Cube,
  FilmSlate,
  Desktop,
  PenNib,
  Code,
  ChartLine,
  Robot,
  ChartBar,
  Briefcase,
  Brain,
} from '@phosphor-icons/react';
import useInView from '../hooks/useInView';

const COURSES = [
  {
    title: 'Projetista',
    slug: 'projetista-3d',
    icon: Cube,
    desc: 'SketchUp, Enscape, Renderização com IA, Projetos 3D…',
    textColor: 'text-orange-400',
    borderClass: 'course-border-orange',
    hoverShadow: 'hover:shadow-[0_0_25px_#f97316aa]',
  },
  {
    title: 'Edição de Vídeo',
    slug: 'edicao-video',
    icon: FilmSlate,
    desc: 'Premiere, After Effects, DaVinci Resolve, Motion Graphics…',
    textColor: 'text-red-400',
    borderClass: 'course-border-red',
    hoverShadow: 'hover:shadow-[0_0_25px_#f87171aa]',
  },
  {
    title: 'Informática',
    slug: 'informatica',
    icon: Desktop,
    desc: 'Windows, Word, Excel (fundamental → avançado)…',
    textColor: 'text-blue-400',
    borderClass: 'course-border-blue',
    hoverShadow: 'hover:shadow-[0_0_25px_#60a5faaa]',
  },
  {
    title: 'Design Gráfico',
    slug: 'design-grafico',
    icon: PenNib,
    desc: 'Photoshop, Illustrator, InDesign, Canva, Social…',
    textColor: 'text-pink-400',
    borderClass: 'course-border-pink',
    hoverShadow: 'hover:shadow-[0_0_25px_#f472b6aa]',
  },
  {
    title: 'Programação',
    slug: 'programacao',
    icon: Code,
    desc: 'Lógica, Python, Java, PHP, Android Studio, Jogos…',
    textColor: 'text-green-400',
    borderClass: 'course-border-green',
    hoverShadow: 'hover:shadow-[0_0_25px_#4ade80aa]',
  },
  {
    title: 'Marketing Digital',
    slug: 'marketing-digital',
    icon: ChartLine,
    desc: 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics…',
    textColor: 'text-purple-400',
    borderClass: 'course-border-purple',
    hoverShadow: 'hover:shadow-[0_0_25px_#a78bfaaa]',
  },
  {
    title: 'Inteligência Artificial',
    slug: 'inteligencia-artificial',
    icon: Robot,
    desc: 'Cursor, Prompt Engineering, ChatGPT, Visão…',
    textColor: 'text-cyan-400',
    borderClass: 'course-border-cyan',
    hoverShadow: 'hover:shadow-[0_0_25px_#22d3eeaa]',
  },
  {
    title: 'Business Intelligence',
    slug: 'business-intelligence',
    icon: ChartBar,
    desc: 'Master Excel, Power BI, Dashboards, Storytelling de Dados…',
    textColor: 'text-indigo-400',
    borderClass: 'course-border-indigo',
    hoverShadow: 'hover:shadow-[0_0_25px_#818cf8aa]',
  },
  {
    title: 'Administração',
    slug: 'administracao',
    icon: Briefcase,
    desc: 'Office, Excel Avançado, DP, Matemática Financeira, Liderança…',
    textColor: 'text-violet-400',
    borderClass: 'course-border-violet',
    hoverShadow: 'hover:shadow-[0_0_25px_#8b5cf6aa]',
  },
];

function CourseCard({ title, slug, icon: Icon, desc, textColor, borderClass, hoverShadow }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`card-enter ${visible ? 'in-view' : ''} relative clip-card w-full max-w-full h-[120px] p-[3px] ${borderClass} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${hoverShadow}`}
    >
      <Button
        asChild
        variant="course-card"
        className="clip-card w-full h-full flex items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition focus-visible:ring-2 ring-fuchsia-500 focus:outline-none justify-start"
      >
        <a href={`/cursos/${slug}`}>
          <Icon size={24} weight="duotone" className={`${textColor} flex-shrink-0 sm:w-7 sm:h-7 lg:w-8 lg:h-8`} />
          <div className="flex flex-col gap-1 min-w-0 flex-1 text-left">
            <h3 className={`font-semibold text-base sm:text-lg leading-tight truncate ${textColor}`}>{title}</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-snug line-clamp-2">{desc}</p>
          </div>
        </a>
      </Button>
    </div>
  );
}

function VocationalTestCard() {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`card-enter ${visible ? 'in-view' : ''} relative clip-card w-full h-auto min-h-[100px] p-[3px] course-border-purple transition-transform duration-200 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_30px_#a855f7aa]`}
    >
      <Card className="clip-card w-full h-full bg-[radial-gradient(ellipse_at_50%_50%,#1e1b2e_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_50%_50%,#2d1b38_0%,#0a0a0a_100%)] transition border-0">
        <Button
          asChild
          variant="course-card"
          className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-3 sm:px-4 md:px-8 py-4 focus-visible:ring-2 ring-purple-500 focus:outline-none min-h-[100px]"
        >
          <a href="/teste-vocacional">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center md:text-left">
              <Brain size={28} weight="duotone" className="text-purple-400 flex-shrink-0 sm:w-8 sm:h-8" />
              <div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-purple-400 leading-tight mb-1">
                  Descubra Seu Curso Ideal
                </h3>
                <p className="text-xs md:text-sm text-purple-200 opacity-90">
                  Teste Vocacional Científico - Metodologia MIT, Harvard e Stanford
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <div className="text-center">
                <div className="bg-purple-500/20 px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-1">
                  <span className="text-xs md:text-sm text-purple-300 font-semibold">
                    ✨ Apenas 5 minutos
                  </span>
                </div>
                <p className="text-xs text-purple-200 opacity-75">
                  100% Gratuito
                </p>
              </div>

              <Button variant="gradient-purple" size="sm" className="px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm">
                Fazer Teste →
              </Button>
            </div>
          </a>
        </Button>
      </Card>
    </div>
  );
}

function Courses() {
  return (
    <Section id="cursos" className="px-3 sm:px-4 lg:px-6 py-8 bg-zinc-950 text-white items-start justify-start min-h-0 overflow-x-hidden">
      <Starfield className="opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <h2 className="text-center text-3xl sm:text-5xl font-bold mb-12">Nossos Cursos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 justify-items-center max-w-6xl mx-auto w-full">
          {COURSES.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>

        {/* Card do Teste Vocacional - Full Width abaixo de todos os cursos */}
        <div className="mt-8 max-w-6xl mx-auto">
          <VocationalTestCard />
        </div>
      </div>
    </Section>
  );
}

export default Courses; 