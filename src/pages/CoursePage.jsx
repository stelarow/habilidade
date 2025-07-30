import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  PaperPlaneTilt, 
  User, 
  Envelope, 
  Phone, 
  BookOpen, 
  CheckCircle,
  Check,
  Trophy,
  ChatCircle,
  Buildings,
  Lightning,
  Target,
  Briefcase
} from 'phosphor-react';
import emailjs from '@emailjs/browser';
import ErrorBoundary from '../components/ErrorBoundary';
import CourseBackground from '../components/CourseBackground';
import CourseHero from '../components/course/CourseHero';
import CourseBreadcrumb from '../components/course/CourseBreadcrumb';
import CourseCurriculum from '../components/course/CourseCurriculum';
import CourseTestimonials from '../components/course/CourseTestimonials';
import CourseWhyStudy from '../components/course/CourseWhyStudy';
import CourseJourney from '../components/course/CourseJourney';
import CourseEnrollCTA from '../components/course/CourseEnrollCTA';
import Loading from '../components/Loading';
import GradientButton from '../components/GradientButton';
import { getCourseBySlug, validateAndSanitizeCourse, generateCourseMetadata } from '../utils/courseHelpers';
import { EMAIL_CONFIG, isEmailConfigured } from '../utils/emailConfig';
import COURSES_DATA from '../data/coursesData';

function CoursePage() {
  const { courseSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  
  // Estados do formulário
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simula carregamento
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Busca curso pelos dados
        const foundCourse = getCourseBySlug(courseSlug, COURSES_DATA);
        
        if (!foundCourse) {
          setError('Curso não encontrado');
          return;
        }

        // Valida e sanitiza os dados do curso
        const validatedCourse = validateAndSanitizeCourse(foundCourse);
        setCourse(validatedCourse);

        // Pré-seleciona o curso no formulário
        setFormData(prev => ({
          ...prev,
          course: validatedCourse.basicInfo.title
        }));

      } catch (err) {
        console.error('Erro ao carregar curso:', err);
        setError('Erro ao carregar dados do curso');
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      loadCourse();
    }
  }, [courseSlug]);

  // Handler para botão de matrícula
  const handleEnrollClick = () => {
    // Scroll para formulário de contato
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'enroll_click', {
        course_name: course.basicInfo.title,
        course_slug: course.basicInfo.slug,
      });
    }
  };

  // Funções do formulário
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async () => {
    try {
      if (!isEmailConfigured()) {
        console.warn('EmailJS não configurado, usando WhatsApp como fallback');
        return { success: false, error: 'EmailJS não configurado' };
      }

      const templateParams = {
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
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  };

  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course || 'Não especificado'}%0A*Mensagem:* ${formData.message || 'Nenhuma mensagem adicional'}`;
    window.open(`https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const emailResult = await sendEmail();
      
      if (emailResult.success) {
        setSubmitStatus('email_success');
        setFormData({ name: '', email: '', phone: '', course: course?.basicInfo?.title || '', message: '' });
      } else {
        setSubmitStatus('whatsapp_fallback');
        setTimeout(() => {
          sendWhatsApp();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      setSubmitStatus('whatsapp_fallback');
      setTimeout(() => {
        sendWhatsApp();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando curso...</p>
          <p className="text-gray-400 text-sm mt-2">Preparando conteúdo exclusivo...</p>
        </div>
      </div>
    );
  }

  // Error state - Redirect to 404
  if (error || !course) {
    return <Navigate to="/404" replace />;
  }

  // Generate metadata for SEO
  const metadata = generateCourseMetadata(course);

  return (
    <ErrorBoundary>
      {/* React 19 native metadata support */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:image" content={metadata.openGraph.image} />
      <meta property="og:url" content={metadata.openGraph.url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.image} />
      
      {/* Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structuredData) }}
      />
      
      <div 
        className="min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900"
        style={{
          background: `linear-gradient(135deg, ${course.themeColors.gradient.from}08 0%, ${course.themeColors.gradient.to}08 100%), radial-gradient(circle at top, #1a1a1a 0%, #000000 100%)`
        }}
      >
        
        {/* Breadcrumb Navigation */}
        <CourseBreadcrumb course={course} />
        
        {/* Hero Section com Background */}
        <div className="relative min-h-screen">
          {/* Background único do curso - APENAS no Hero */}
          <CourseBackground 
            courseSlug={course.basicInfo.slug}
            priority={true}
          />
          <CourseHero course={course} onEnrollClick={handleEnrollClick} />
        </div>

        {/* 3. Por que estudar - NOVA SEÇÃO */}
        <CourseWhyStudy course={course} />

        {/* 4. Passo a passo - NOVA SEÇÃO */}
        <CourseJourney course={course} />

        {/* 5. CTA Matricule-se - NOVA SEÇÃO */}
        <CourseEnrollCTA course={course} onEnrollClick={handleEnrollClick} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-16">

          {/* Course Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Curriculum Section */}
              <section id="curriculo">
                <CourseCurriculum course={course} />
              </section>

              {/* Testimonials Section */}
              <section id="depoimentos">
                <CourseTestimonials course={course} />
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Contact Form Card - NOVO */}
              <div className="sticky top-24">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Interessado no Curso?
                    </h3>
                    <p className="text-gray-300">
                      Entre em contato conosco para mais informações
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                    }}
                  >
                    Solicitar Informações
                  </button>

                  {/* Quick Benefits Summary */}
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Lightning size={16} weight="duotone" className="text-yellow-400" />
                      <span>Resposta rápida</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target size={16} weight="duotone" className="text-orange-400" />
                      <span>Atendimento personalizado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} weight="duotone" className="text-indigo-400" />
                      <span>Orientação profissional</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              {course.faq && course.faq.length > 0 && (
                <section id="faq">
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Perguntas Frequentes</h3>
                    <div className="space-y-4">
                      {course.faq.map((item) => (
                        <div key={item.id} className="border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                          <h4 className="text-white font-semibold mb-2 text-sm">{item.question}</h4>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Contact Form Section - NOVO */}
          <section id="contato" className="mt-16">
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
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
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
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all resize-none"
                      placeholder="Deixe uma mensagem (opcional)"
                    />
                  </div>

                  {/* Mensagens de Status */}
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
                        <Loading size="sm" />
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
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default CoursePage; 