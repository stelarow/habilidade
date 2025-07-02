import { Link } from 'react-router-dom';
import Starfield from './Starfield';
import Section from './Section';
import {
  Cube,
  FilmSlate,
  Desktop,
  PenNib,
  Code,
  ChartLine,
  Robot,
  ChartBar,
} from 'phosphor-react';
import useInView from '../hooks/useInView';

const COURSES = [
  {
    title: 'Projetista',
    slug: 'projetista-3d',
    icon: Cube,
    desc: 'SketchUp, Enscape, Renderização com IA, Projetos 3D…',
    textColor: 'text-orange-400',
    borderGradient: 'from-orange-500/60 to-amber-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#f97316aa]',
  },
  {
    title: 'Edição de Vídeo',
    slug: 'edicao-video',
    icon: FilmSlate,
    desc: 'Premiere, After Effects, DaVinci Resolve, Motion Graphics…',
    textColor: 'text-red-400',
    borderGradient: 'from-red-500/60 to-pink-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#f87171aa]',
  },
  {
    title: 'Informática',
    slug: 'informatica',
    icon: Desktop,
    desc: 'Windows, Word, Excel (fundamental → avançado)…',
    textColor: 'text-blue-400',
    borderGradient: 'from-blue-500/60 to-indigo-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#60a5faaa]',
  },
  {
    title: 'Design Gráfico',
    slug: 'design-grafico',
    icon: PenNib,
    desc: 'Photoshop, Illustrator, InDesign, Canva, Social…',
    textColor: 'text-pink-400',
    borderGradient: 'from-pink-500/60 to-rose-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#f472b6aa]',
  },
  {
    title: 'Programação',
    slug: 'programacao',
    icon: Code,
    desc: 'Lógica, Python, Java, PHP, Android Studio, Jogos…',
    textColor: 'text-green-400',
    borderGradient: 'from-green-500/60 to-emerald-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#4ade80aa]',
  },
  {
    title: 'Marketing Digital',
    slug: 'marketing-digital',
    icon: ChartLine,
    desc: 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics…',
    textColor: 'text-purple-400',
    borderGradient: 'from-purple-500/60 to-violet-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#a78bfaaa]',
  },
  {
    title: 'Inteligência Artificial',
    slug: 'inteligencia-artificial',
    icon: Robot,
    desc: 'Cursor, Prompt Engineering, ChatGPT, Visão…',
    textColor: 'text-cyan-400',
    borderGradient: 'from-cyan-500/60 to-teal-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#22d3eeaa]',
  },
  {
    title: 'Business Intelligence',
    slug: 'business-intelligence',
    icon: ChartBar,
    desc: 'Master Excel, Power BI, Dashboards, Storytelling de Dados…',
    textColor: 'text-indigo-400',
    borderGradient: 'from-indigo-500/60 to-blue-400/60',
    hoverShadow: 'hover:shadow-[0_0_25px_#818cf8aa]',
  },
];

function CourseCard({ title, slug, icon: Icon, desc, textColor, borderGradient, hoverShadow }) {
  const [ref, visible] = useInView();
  return (
    <Link
      ref={ref}
      to={`/cursos/${slug}`}
      className={`card-enter ${visible ? 'in-view' : ''} relative clip-card w-full h-[120px] p-[3px] bg-gradient-to-r ${borderGradient} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${hoverShadow} focus-visible:ring-2 ring-fuchsia-500 focus:outline-none`}
    >
      <div
        className="clip-card w-full h-full flex items-center gap-6 px-8 bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition"
      >
        <Icon size={32} weight="duotone" className={`${textColor} flex-shrink-0`} />
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className={`font-semibold text-lg text-left leading-tight truncate ${textColor}`}>{title}</h3>
          <p className="text-sm text-zinc-300 leading-snug text-left line-clamp-2">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function Courses() {
  return (
    <Section id="cursos" className="px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0">
      <Starfield className="opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-5xl font-bold mb-12">Nossos Cursos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center max-w-6xl mx-auto">
          {COURSES.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export default Courses; 