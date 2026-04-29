import { Head } from 'vite-react-ssg';
import { Navigate, useLoaderData } from 'react-router-dom';
import { getCompaniesByCategory } from '../../../data/trustedCompanies';
import { generateCourseMetadata, validateAndSanitizeCourse } from '../../../utils/courseHelpers';
import { ScrollReveal, CardGridReveal } from '../../../components/shared/ScrollReveal';
import InteligenciaArtificialContactForm from './InteligenciaArtificialContactForm';
import './inteligencia-artificial.css';

const heroImage = '/assets/inteligencia-artificial/hero/manter_a_imagem_sem_nenhum_202604291100.jpeg';

function trackEvent(eventName, parameters = {}) {
  if (typeof globalThis.gtag === 'function') {
    globalThis.gtag('event', eventName, parameters);
  }
}

function handleEnrollClick(source = 'hero') {
  const contactSection = globalThis.document?.querySelector('#contato');
  contactSection?.scrollIntoView({ behavior: 'smooth' });

  trackEvent('enroll_click', {
    course_name: 'Inteligencia Artificial',
    course_slug: 'inteligencia-artificial',
    cta_source: source
  });
}

function SectionHeader({ eyebrow, title, copy }) {
  return (
    <ScrollReveal animation="fade-up">
      <div className="ai-section-header">
        <p className="ai-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </ScrollReveal>
  );
}

function Hero({ course, lessonsCount }) {
  return (
    <section className="ai-hero">
      <img className="ai-hero-image" src={heroImage} alt="" fetchPriority="high" />
      <div className="ai-photo-overlay" />
      <ScrollReveal animation="fade-up" className="ai-hero-content">
        <p className="ai-eyebrow">Escola Habilidade / Curso</p>
        <h1>
          <span>Inteligencia</span>
          <span>Artificial</span>
        </h1>
        <p className="ai-hero-copy">{course.basicInfo.longDescription}</p>
        <button className="ai-button ai-button-primary" onClick={() => handleEnrollClick('hero')}>
          Garantir minha vaga
        </button>
      </ScrollReveal>
      <ScrollReveal animation="fade-up" delay={0.2}>
        <dl className="ai-hero-specs" aria-label="Resumo do curso">
          <div>
            <dt>Duracao</dt>
            <dd>{course.basicInfo.duration}</dd>
          </div>
          <div>
            <dt>Modulos</dt>
            <dd>{course.curriculum.length}</dd>
          </div>
          <div>
            <dt>Aulas</dt>
            <dd>{lessonsCount}</dd>
          </div>
          <div>
            <dt>Formato</dt>
            <dd>Presencial / Online</dd>
          </div>
        </dl>
      </ScrollReveal>
    </section>
  );
}

function Proposition({ course }) {
  const benefits = course.whyStudy?.benefits || [];

  return (
    <section className="ai-section ai-proposition">
      <SectionHeader
        eyebrow="Proposta"
        title="IA aplicada ao trabalho real"
        copy="Aprenda fundamentos, prompts e ferramentas de IA para criar conteudos, automatizar tarefas e aplicar solucoes no trabalho ou no seu negocio."
      />
      <CardGridReveal className="ai-line-grid" staggerDelay={0.12}>
        {benefits.map((benefit, index) => (
          <article className="ai-line-panel" key={benefit.title}>
            <p className="ai-panel-index">0{index + 1}</p>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </CardGridReveal>
    </section>
  );
}

function Curriculum({ course }) {
  return (
    <section className="ai-section" id="curriculo">
      <SectionHeader
        eyebrow="Curriculo"
        title="Seis blocos de dominio"
        copy="O curso combina fundamentos, IA para negocios e ferramentas praticas como Cursor, Flowlabs, ElevenLabs e HatchCanvas, com aulas organizadas por modulo."
      />
      <CardGridReveal className="ai-curriculum-list" staggerDelay={0.08}>
        {course.curriculum.map((module) => (
          <details className="ai-module" key={module.id}>
            <summary>
              <span className="ai-module-number">{String(module.id).padStart(2, '0')}</span>
              <span className="ai-module-title">{module.title}</span>
              <span className="ai-module-duration">{module.duration}</span>
            </summary>
            <div className="ai-module-body">
              <p>{module.description}</p>
              {module.note && <p className="ai-note">{module.note}</p>}
              <ol>
                {module.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <span>{lesson.title}</span>
                    <small>{lesson.duration}</small>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        ))}
      </CardGridReveal>
    </section>
  );
}

function Tools({ course }) {
  const tools = course.whatYouWillLearn?.slice(0, 12) || [];
  const requirements = course.requirements || [];

  return (
    <section className="ai-section ai-tools">
      <SectionHeader
        eyebrow="Ferramentas"
        title="Do prompt ao projeto"
        copy="Voce pratica com ferramentas usadas para gerar textos, imagens, audios, codigo, automacoes e projetos visuais, sempre com foco em entrega real."
      />
      <CardGridReveal className="ai-two-column" staggerDelay={0.14}>
        <div className="ai-list-block">
          <h3>Voce aprende</h3>
          <ul>
            {tools.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="ai-list-block">
          <h3>Requisitos</h3>
          <ul>
            {requirements.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </CardGridReveal>
    </section>
  );
}

function Investment({ course }) {
  const { investment, materials } = course;

  return (
    <section className="ai-section ai-investment">
      <SectionHeader
        eyebrow="Investimento"
        title="Entrada controlada para uma habilidade de alto impacto"
      />
      <CardGridReveal className="ai-investment-grid" staggerDelay={0.12}>
        <div>
          <p className="ai-price-label">Valor atual</p>
          <p className="ai-price">R$ {investment.currentPrice}</p>
          <p className="ai-muted">ou {investment.installments.max}x de R$ {investment.installments.value}</p>
        </div>
        <div>
          <p className="ai-price-label">Material</p>
          <p className="ai-investment-copy">{materials.description}</p>
          <p className="ai-muted">{investment.paymentMethods.join(' / ')}</p>
        </div>
        <button className="ai-button ai-button-primary" onClick={() => handleEnrollClick('investment')}>
          Ver condicoes
        </button>
      </CardGridReveal>
    </section>
  );
}

function Testimonials({ course }) {
  return (
    <section className="ai-section" id="depoimentos">
      <SectionHeader eyebrow="Resultados" title="Relatos de alunos" />
      <CardGridReveal className="ai-testimonials" staggerDelay={0.12}>
        {course.testimonials.slice(0, 4).map((testimonial) => (
          <article className="ai-testimonial" key={testimonial.id}>
            <p>{testimonial.text}</p>
            <footer>
              <span>{testimonial.name}</span>
              <small>{testimonial.role} / {testimonial.result}</small>
            </footer>
          </article>
        ))}
      </CardGridReveal>
    </section>
  );
}

function Companies() {
  const companies = getCompaniesByCategory().slice(0, 10);

  return (
    <section className="ai-section ai-companies">
      <SectionHeader
        eyebrow="Empresas"
        title="Credibilidade regional"
        copy="Profissionais de empresas da Grande Florianopolis ja passaram pela Escola Habilidade."
      />
      <CardGridReveal className="ai-company-grid" staggerDelay={0.08}>
        {companies.map((company) => (
          <div className="ai-company" key={company.name}>
            <img src={company.logo} alt={company.name} loading="lazy" />
            <span>{company.name}</span>
          </div>
        ))}
      </CardGridReveal>
    </section>
  );
}

function FAQ({ course }) {
  return (
    <section className="ai-section" id="faq">
      <SectionHeader eyebrow="FAQ" title="Perguntas frequentes" />
      <CardGridReveal className="ai-faq-list" staggerDelay={0.08}>
        {course.faq.map((item) => (
          <details className="ai-faq-item" key={item.id}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </CardGridReveal>
    </section>
  );
}

function Contact() {
  return (
    <section className="ai-section ai-contact" id="contato">
      <SectionHeader
        eyebrow="Contato"
        title="Fale sobre sua vaga"
        copy="Preencha seus dados para receber informacoes sobre turmas, horarios, modalidades e formas de pagamento."
      />
      <ScrollReveal animation="fade-up" delay={0.1}>
        <InteligenciaArtificialContactForm />
      </ScrollReveal>
    </section>
  );
}

export default function InteligenciaArtificialPage({ course: courseProperty }) {
  const loaderData = useLoaderData();
  const course = validateAndSanitizeCourse(courseProperty || loaderData?.course);

  if (!course?.basicInfo?.slug || course.basicInfo.slug !== 'inteligencia-artificial') {
    return <Navigate to="/404" replace />;
  }

  const metadata = generateCourseMetadata(course);
  const lessonsCount = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structuredData) }} />
      </Head>

      <main className="ai-page">
        <Hero course={course} lessonsCount={lessonsCount} />
        <Proposition course={course} />
        <Curriculum course={course} />
        <Tools course={course} />
        <Investment course={course} />
        <Testimonials course={course} />
        <Companies />
        <FAQ course={course} />
        <Contact />
        <ScrollReveal animation="fade-up">
          <section className="ai-final-cta">
            <p className="ai-eyebrow">Proxima turma</p>
            <h2>Transforme IA em rotina produtiva.</h2>
            <button className="ai-button ai-button-primary" onClick={() => handleEnrollClick('final')}>
              Conversar com a escola
            </button>
          </section>
        </ScrollReveal>
      </main>
    </>
  );
}
