import { useState, useRef } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { PaperPlaneTilt, User, Envelope, Phone, BookOpen, CheckCircle, CircleNotch } from '@phosphor-icons/react';
import emailjs from '@emailjs/browser';
import { DesignGraficoHeroSection } from './design-grafico/DesignGraficoHeroSection';
import { DesignGraficoCurriculum } from './design-grafico/DesignGraficoCurriculum';
import { DesignGraficoTestimonials } from './design-grafico/DesignGraficoTestimonials';
import { DesignGraficoFAQ } from './design-grafico/DesignGraficoFAQ';
import { DesignGraficoInvestment } from './design-grafico/DesignGraficoInvestment';
import CourseWhyStudy from './CourseWhyStudy';
import CourseJourney from './CourseJourney';
import CourseEnrollCTA from './CourseEnrollCTA';
import GradientButton from '../GradientButton';
import TrustedCompanies from '../TrustedCompanies';
import COURSES_DATA from '../../data/coursesData';
import { getCourseBySlug } from '../../utils/courseHelpers';
import { EMAIL_CONFIG, isEmailConfigured } from '../../utils/emailConfig';

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Design Gráfico - Photoshop, Illustrator, InDesign, Canva e CorelDRAW",
  "description": "Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW com teorias fundamentais do design. 5 módulos completos para dominar o design profissional.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "Escola Habilidade",
    "url": "https://www.escolahabilidade.com.br"
  },
  "url": "https://www.escolahabilidade.com/cursos/design-grafico",
  "courseMode": "Blended",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "https://schema.org/BlendedEventAttendanceMode",
    "courseWorkload": "PT90H"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceCurrency": "BRL"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Escola Habilidade - Curso de Design Gráfico",
  "description": "Curso de Design Gráfico presencial em São José SC. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW.",
  "url": "https://www.escolahabilidade.com/cursos/design-grafico",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
    "addressLocality": "São José",
    "addressRegion": "SC",
    "postalCode": "88102-280",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-27.5923906",
    "longitude": "-48.6175692"
  },
  "telephone": "+55-48-98855-9491",
  "openingHours": "Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00",
  "areaServed": [
    { "@type": "City", "name": "São José" },
    { "@type": "City", "name": "Florianópolis" },
    { "@type": "City", "name": "Palhoça" },
    { "@type": "City", "name": "Biguaçu" }
  ]
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Preciso ter experiência prévia em design para fazer o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! O curso foi desenvolvido para iniciantes. Começamos com os fundamentos do design e evoluímos progressivamente até técnicas avançadas."
      }
    },
    {
      "@type": "Question",
      "name": "Quais softwares são ensinados no curso de Design Gráfico?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ensinamos Photoshop, Illustrator, InDesign, Canva e CorelDRAW. São as principais ferramentas do mercado profissional de design."
      }
    },
    {
      "@type": "Question",
      "name": "Posso trabalhar como designer gráfico após o curso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! O mercado de design gráfico é amplo e em constante crescimento. Nossos alunos trabalham como designers em agências, departamentos de marketing, editoras, ONGs e como freelancers."
      }
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Início",
      "item": "https://www.escolahabilidade.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Cursos",
      "item": "https://www.escolahabilidade.com/#cursos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Design Gráfico",
      "item": "https://www.escolahabilidade.com/cursos/design-grafico"
    }
  ]
};

const courses = [
  'Projetista',
  'Edição de Vídeo',
  'Informática',
  'Design Gráfico',
  'Programação',
  'Marketing Digital',
  'Inteligência Artificial',
  'Business Intelligence'
];

export function DesignGraficoPage() {
  console.log('[DesignGraficoPage] Component MOUNTING/RENDERING');
  const course = getCourseBySlug('design-grafico', COURSES_DATA);
  console.log('[DesignGraficoPage] Course found:', course?.basicInfo?.title);
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Design Gráfico',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleEnrollClick = () => {
    console.log('[DesignGraficoPage] handleEnrollClick called - opening WhatsApp');
    const message = `Olá! Tenho interesse no curso de Design Gráfico e gostaria de me matricular.`;
    const whatsappUrl = `https://wa.me/5548988559491?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async () => {
    try {
      if (!isEmailConfigured()) {
        return { success: false, error: 'EmailJS não configurado' };
      }

      const templateParameters = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        course: formData.course || 'Não especificado',
        message: formData.message || 'Nenhuma mensagem adicional',
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: formData.email
      };

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParameters,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course || 'Não especificado'}%0A*Mensagem:* ${formData.message || 'Nenhuma mensagem adicional'}`;
    window.open(`https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DesignGraficoPage] handleSubmit called');
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const emailResult = await sendEmail();

      if (emailResult.success) {
        setSubmitStatus('email_success');
        setFormData({ name: '', email: '', phone: '', course: 'Design Gráfico', message: '' });
      } else {
        setSubmitStatus('whatsapp_fallback');
        setTimeout(() => {
          sendWhatsApp();
        }, 1500);
      }
    } catch (error) {
      setSubmitStatus('whatsapp_fallback');
      setTimeout(() => {
        sendWhatsApp();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <Helmet>
        <title>Curso de Design Gráfico | Photoshop, Illustrator, Canva | Escola Habilidade</title>
        <meta name="description" content="Curso de Design Gráfico completo em São José SC. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW. 90 horas, apostilas inclusas, certificado reconhecido." />
        <meta name="keywords" content="curso design gráfico, photoshop, illustrator, canva, coreldraw, indeisgn, curso são josé, curso florianópolis" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Escola Habilidade" />
        <meta name="theme-color" content="#9C27B0" />
        <link rel="canonical" href="https://www.escolahabilidade.com/cursos/design-grafico" />
      </Helmet>

      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(courseSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(faqPageSchema)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbSchema)}} />

      <DesignGraficoHeroSection onEnrollClick={handleEnrollClick} />
      <CourseWhyStudy course={course} />
      <CourseJourney course={course} />
      <DesignGraficoCurriculum course={course} />
      <DesignGraficoInvestment course={course} onEnrollClick={handleEnrollClick} />
      <DesignGraficoTestimonials course={course} />
      <DesignGraficoFAQ course={course} />
      <CourseEnrollCTA course={course} onEnrollClick={handleEnrollClick} />
      <TrustedCompanies variant="course" courseSlug="design-grafico" theme="dark" />

      <section id="contato" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Entre em Contato
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Interessado no curso de {course.basicInfo.title}? Preencha o formulário e entraremos em contato!
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <form ref={form} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    <User size={16} className="inline mr-2" />
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    <Envelope size={16} className="inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    <Phone size={16} className="inline mr-2" />
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="(48) 9 9999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="course" className="block text-sm font-medium text-gray-300">
                    <BookOpen size={16} className="inline mr-2" />
                    Curso de interesse
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um curso</option>
                    {courses.map(courseOption => (
                      <option key={courseOption} value={courseOption}>{courseOption}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Mensagem (opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Deixe uma mensagem (opcional)"
                />
              </div>

              {submitStatus === 'email_success' && (
                <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-300 font-medium">Email enviado com sucesso!</p>
                    <p className="text-green-400 text-sm">Entraremos em contato em breve.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'whatsapp_fallback' && (
                <div className="flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <CheckCircle size={24} className="text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-medium">Redirecionando para WhatsApp...</p>
                    <p className="text-blue-400 text-sm">Você será direcionado para continuar pelo WhatsApp.</p>
                  </div>
                </div>
              )}

              <GradientButton
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <CircleNotch size={20} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <PaperPlaneTilt size={20} />
                    Enviar Mensagem
                  </>
                )}
              </GradientButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Seus dados são tratados com total confidencialidade conforme nossa política de privacidade.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DesignGraficoPage;
export { DesignGraficoPage as Component };