import Starfield from './Starfield';
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

const COURSES = [
  {
    title: 'Projetista 3D',
    icon: Cube,
    desc: 'Blender, AutoCAD, SketchUp, Impressão 3D, Maquetes…',
  },
  {
    title: 'Edição de Vídeo',
    icon: FilmSlate,
    desc: 'Premiere, After Effects, DaVinci Resolve, Motion Graphics…',
  },
  {
    title: 'Informática',
    icon: Desktop,
    desc: 'Windows, Word, Excel (fundamental → avançado)…',
  },
  {
    title: 'Design Gráfico',
    icon: PenNib,
    desc: 'Photoshop, Illustrator, InDesign, Canva, Social…',
  },
  {
    title: 'Programação',
    icon: Code,
    desc: 'Lógica, Python, Java, PHP, Android Studio, Jogos…',
  },
  {
    title: 'Marketing Digital',
    icon: ChartLine,
    desc: 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics…',
  },
  {
    title: 'Inteligência Artificial',
    icon: Robot,
    desc: 'Machine Learning, Prompt Engineering, ChatGPT, Visão…',
  },
  {
    title: 'Business Intelligence',
    icon: ChartBar,
    desc: 'Master Excel, Power BI, Dashboards, Storytelling de Dados…',
  },
];

function CourseCard({ title, icon: Icon, desc }) {
  return (
    <a
      href="#"
      className="relative clip-card w-full md:w-[320px] h-[120px] p-[3px] bg-gradient-to-r from-fuchsia-500/60 to-cyan-400/60 transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_0_25px_#00c4ff88] focus-visible:ring-2 ring-fuchsia-500 focus:outline-none"
    >
      <div
        className="clip-card w-full h-full flex items-center gap-6 px-8 bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition"
      >
        <Icon size={32} weight="duotone" className="text-white flex-shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-semibold text-lg text-left leading-tight truncate">{title}</h3>
          <p className="text-sm text-zinc-300 leading-snug text-left line-clamp-2">{desc}</p>
        </div>
      </div>
    </a>
  );
}

function Courses() {
  return (
    <section id="cursos" className="relative px-4 py-24 bg-zinc-950 text-white">
      <Starfield className="opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-5xl font-bold mb-12">Nossos Cursos</h2>

        <div className="grid place-content-center gap-4 md:gap-3 md:[grid-template-columns:repeat(3,max-content)]">
          {COURSES.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Courses; 