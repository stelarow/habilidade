import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  MessageCircle,
  Box,
  Camera,
  Lightbulb,
  Target,
  ChevronDown,
  ExternalLink,
  MapPin,
  Phone,
  CalendarCheck,
  GraduationCap,
  Timer,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';

// Import critical constants only
import {
  COURSE_STATS,
  PRICING,
  CONTACT_INFO,
  BENEFITS,
  QUICK_BENEFITS,
  COURSE_MODULES,
  SEO_DATA,
  ANIMATION_VARIANTS
} from '../constants/curso-sketchup-enscape.js';

// Lazy-loaded data imports
import {
  getCompaniesData,
  getCourseProjects,
  getTestimonialsData,
  getCompanyStats
} from '../constants/curso-sketchup-enscape-lazy.js';
// Removed OptimizedImage import - using native img for better performance
// Removed LazyImage import - using optimized native img tags
import { preloadCompanyLogos } from '../utils/imageCache.js';

// Componente Header da página do curso - Memoized for performance
const CourseHeader = memo(() => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  const handleBackClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-[#d400ff] transition-colors"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </motion.button>
            <img 
              src="/logo-escola-habilidade.png" 
              alt="Escola Habilidade" 
              className="h-10 w-auto"
              onError={(error) => {
                error.target.src = "https://escolahabilidade.com/wp-content/uploads/2024/06/Design-sem-nome-7.png";
              }}
            />
          </div>
          <motion.a
            href="https://wa.me/5548984587067"
            className="bg-[#d400ff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#b300dd] transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #d400ff55" }}
          >
            Matricule-se Agora
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
});

CourseHeader.displayName = 'CourseHeader';

// Componente Hero do Curso - Memoized for performance
const CourseHero = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  // Pre-defined animation variants for better performance
  const heroAnimations = useMemo(() => ({
    textContent: prefersReducedMotion ? {} : ANIMATION_VARIANTS.fadeInLeft,
    imageShowcase: prefersReducedMotion ? {} : ANIMATION_VARIANTS.fadeInRight,
    stats: prefersReducedMotion ? {} : {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.5 }
    }
  }), [prefersReducedMotion]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#110011] to-black"></div>
      
      {/* Background com renderização 3D - Optimized */}
      <div className="absolute inset-0">
        <img 
          src="/assets/cursos/sketchup-enscape/architectural-render-bg.jpeg"
          alt="Renderização Arquitetônica"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo textual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <motion.div 
                className="flex items-center gap-2 bg-[#d400ff]/20 text-[#d400ff] px-4 py-2 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GraduationCap size={16} />
                Aulas 100% Presenciais
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Do <span className="text-[#d400ff]">Esboço</span> ao <span className="text-[#d400ff]">Render</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Domine <strong className="text-white">SketchUp + Enscape</strong> para criar projetos arquitetônicos 
              profissionais com renderizações fotorrealísticas que impressionam clientes.
            </motion.p>

            {/* Estatísticas do curso */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-[#d400ff]">56h</div>
                <div className="text-gray-400 text-sm">Carga Horária</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#d400ff]">28</div>
                <div className="text-gray-400 text-sm">Aulas Práticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#d400ff]">6</div>
                <div className="text-gray-400 text-sm">Projetos Completos</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="https://wa.me/5548984587067"
                className="bg-[#d400ff] text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 justify-center hover:bg-[#b300dd] transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #d400ff88" }}
              >
                <MessageCircle size={20} />
                Garanta sua Vaga - 10x R$ 399,90
              </motion.a>
              
              <motion.a
                href="https://wa.me/5548984587067"
                className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={20} />
                Fale com um Orientador
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Showcase de renderizações - Optimized */}
          <motion.div 
            className="relative"
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="space-y-4"
                initial={prefersReducedMotion ? {} : { y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                <img 
                  src="/assets/cursos/sketchup-enscape/render-1.jpeg"
                  alt="Renderização Interior"
                  className="rounded-xl shadow-xl w-full h-48 object-cover border border-[#d400ff]/20"
                  loading="lazy"
                  decoding="async"
                />
                <img 
                  src="/assets/cursos/sketchup-enscape/render-2.jpeg"
                  alt="Renderização Exterior"
                  className="rounded-xl shadow-xl w-full h-32 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              <motion.div 
                className="space-y-4 mt-8"
                initial={prefersReducedMotion ? {} : { y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.6, duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                <img 
                  src="/assets/cursos/sketchup-enscape/render-3.jpeg"
                  alt="Renderização Cozinha"
                  className="rounded-xl shadow-xl w-full h-32 object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <img 
                  src="/assets/cursos/sketchup-enscape/render-4.jpeg"
                  alt="Renderização Quarto"
                  className="rounded-xl shadow-xl w-full h-48 object-cover border border-[#d400ff]/20"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

CourseHero.displayName = 'CourseHero';

// Componente sobre o curso - Memoized for performance
const AboutCourse = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  // Optimized intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-animation-safe">
              Transforme suas <span className="text-[#d400ff]">ideias</span> em projetos profissionais
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6 text-animation-safe">
              Aprenda a criar desde esboços simples até renderizações fotorrealísticas 
              que impressionam clientes e garantem aprovação de projetos.
            </p>
            
            {/* Destaque para aulas presenciais */}
            <div className="bg-[#d400ff]/10 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CalendarCheck className="text-[#d400ff]" size={32} />
                <h3 className="text-2xl font-bold text-gray-900">Aulas 100% Presenciais</h3>
              </div>
              <p className="text-gray-700">
                Aprendizado hands-on em nossa sede equipada com computadores modernos e software atualizado. 
                Acompanhamento individual e networking com colegas da área.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[#d400ff] font-semibold">
                <MapPin size={16} />
                <span>Kobrasol - São José/SC</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Box, title: "Modelagem 3D", description: "Domine todas as ferramentas do SketchUp para criar modelos 3D precisos e detalhados." },
              { icon: Lightbulb, title: "Renderização", description: "Crie imagens fotorrealísticas com Enscape, incluindo iluminação e materiais profissionais." },
              { icon: Target, title: "Projetos Reais", description: "Desenvolva projetos completos: residências, interiores e documentação técnica." }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center p-6"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: prefersReducedMotion ? 0 : index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

AboutCourse.displayName = 'AboutCourse';

// Componente do Módulo de Aulas - Memoized for performance
const ModuleSection = memo(({ title, lessons, icon: IconComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-[#d400ff] rounded-lg flex items-center justify-center`}>
              <IconComponent className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600">{lessons.length} aulas • {lessons.length * 2}h total</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="text-gray-400" size={24} />
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
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-[#d400ff] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{lesson.name}</h4>
                  <p className="text-sm text-gray-600">{lesson.type}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
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
});

ModuleSection.displayName = 'ModuleSection';

// Componente Grade Curricular - Optimized for performance
const Curriculum = memo(() => {

  return (
    <section className="py-20 bg-gradient-radial from-[#110011] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grade <span className="text-[#d400ff]">Curricular</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conteúdo estruturado para levar você do básico ao nível profissional
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {COURSE_MODULES.map((module, index) => (
            <ModuleSection 
              key={module.title}
              title={module.title}
              icon={module.icon}
              lessons={module.lessons}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

Curriculum.displayName = 'Curriculum';

// Componente Projetos do Curso - Optimized for performance
const CourseProjects = memo(() => {

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-animation-safe">
            Projetos que você vai <span className="text-[#d400ff]">criar</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Portfolio real para impressionar clientes e conseguir trabalhos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {getCourseProjects().map((project, index) => (
            <motion.div
              key={project.title}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

CourseProjects.displayName = 'CourseProjects';

// Company Card Component - Optimized for performance
const CompanyCard = memo(({ company, index }) => {
  const prefersReducedMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);
  
  // Simplified hover animation
  const hoverAnimation = useMemo(() => 
    prefersReducedMotion ? {} : { 
      y: -2,
      scale: 1.01,
      transition: { duration: 0.15 }
    }, [prefersReducedMotion]
  );
  
  return (
    <motion.div
      className="group bg-gray-50 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center min-w-[180px] flex-shrink-0"
      whileHover={hoverAnimation}
    >
      <div className="w-16 h-16 flex items-center justify-center mb-3 rounded-lg bg-white shadow-sm">
        <img 
          src={company.logo}
          alt={company.name}
          className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${prefersReducedMotion ? '' : 'filter grayscale group-hover:grayscale-0 transition-all duration-200'}`}
          loading="lazy"
          onLoad={handleImageLoad}
          style={{ maxWidth: '60px', maxHeight: '60px' }}
        />
        {!imageLoaded && (
          <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{company.name}</h3>
        <p className="text-xs text-gray-600 line-clamp-2">{company.description}</p>
      </div>
    </motion.div>
  );
});

CompanyCard.displayName = 'CompanyCard';

// Componente Empresas Atendidas - Optimized for performance
const CompaniesSection = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Optimized intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Preload only essential logos when section becomes visible
          preloadCompanyLogos(getCompaniesData().slice(0, 4)).catch(console.error);
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  // Simplified animation configuration
  const carouselAnimation = useMemo(() => {
    if (prefersReducedMotion || !isVisible) return { x: 0 };
    const companiesCount = getCompaniesData().length;
    return {
      x: [0, -(180 * Math.min(companiesCount, 6))], // Further reduced animation scope
      transition: {
        duration: 40, // Much faster for better performance
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
      }
    };
  }, [prefersReducedMotion, isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empresas regionais que fizeram nosso curso de <span className="text-[#d400ff]">projetista</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empresas da região que confiaram na Escola Habilidade para capacitar seus profissionais em projetos
          </p>
        </motion.div>

        {/* Simplified company showcase - Static grid for better performance */}
        {isVisible && (
          <div className="max-w-7xl mx-auto">
            {prefersReducedMotion ? (
              // Static grid for reduced motion
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {getCompaniesData().map((company, index) => (
                  <CompanyCard
                    key={`company-${company.name}-${index}`}
                    company={company}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              // Simplified carousel
              <div className="relative overflow-hidden">
                <motion.div 
                  className="flex space-x-8"
                  animate={carouselAnimation}
                >
                  {getCompaniesData().concat(getCompaniesData().slice(0, 2)).map((company, index) => (
                    <CompanyCard
                      key={`company-${company.name}-${index}`}
                      company={company}
                      index={index}
                    />
                  ))}
                </motion.div>
                {/* Simplified gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              </div>
            )}
          </div>
        )}

        {/* Estatísticas - Optimized */}
        {isVisible && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {getCompanyStats().map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-[#d400ff] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
});

CompaniesSection.displayName = 'CompaniesSection';

// Testimonial Card Component - Memoized for performance
const TestimonialCard = memo(({ testimonial, index }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className="bg-[#1b1b1f] border border-[#d400ff33] rounded-xl p-6 text-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={prefersReducedMotion ? {} : { 
        boxShadow: "0 0 20px #d400ff55",
        scale: 1.02
      }}
    >
      <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-xl font-bold">
          {testimonial.initials}
        </span>
      </div>
      <p className="text-gray-300 italic text-sm mb-4 leading-relaxed line-clamp-6">
        "{testimonial.text}"
      </p>
      <div className="font-bold text-white text-lg">{testimonial.name}</div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

// Componente Depoimentos específicos - Optimized for performance
const CourseTestimonials = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-radial from-[#110011] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            O que dizem nossos <span className="text-[#d400ff]">alunos</span>
          </h2>
        </motion.div>

        {isVisible && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {getTestimonialsData().map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

CourseTestimonials.displayName = 'CourseTestimonials';

// Componente CTA Final
// Sub-componentes do CTA Final - Optimized with memo
const OfferBadge = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d400ff]/20 to-purple-600/20 backdrop-blur-sm border border-[#d400ff]/30 text-white px-6 py-3 rounded-xl text-lg font-semibold mb-6"
      animate={prefersReducedMotion ? {} : { 
        boxShadow: [
          "0 0 15px rgba(212, 0, 255, 0.2)",
          "0 0 25px rgba(212, 0, 255, 0.4)",
          "0 0 15px rgba(212, 0, 255, 0.2)"
        ]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <AlertCircle size={20} className="text-[#d400ff]" />
      </motion.div>
      <span 
        className="bg-gradient-to-r from-white to-[#d400ff] bg-clip-text text-transparent"
        style={{
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          fallbacks: [{ color: '#d400ff' }]
        }}
      >
        OFERTA LIMITADA
      </span>
      <span className="text-gray-300">•</span>
      <span className="text-yellow-300 font-bold">15 vagas restantes</span>
    </motion.div>
  );
});

OfferBadge.displayName = 'OfferBadge';

const PricingInfo = memo(() => (
  <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
    <span className="line-through text-gray-400 text-lg">De {PRICING.originalPrice}</span>
    <br />
    <strong className="text-3xl text-white">Por apenas {PRICING.cashPrice} à vista</strong>
    <br />
    <span className="text-xl">ou <strong className="text-green-400">{PRICING.installments}x de {PRICING.installmentPrice}</strong> sem juros</span>
  </p>
));

PricingInfo.displayName = 'PricingInfo';

const QuickBenefits = memo(() => (
  <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-8">
    {QUICK_BENEFITS.map((benefit, index) => (
      <span key={benefit} className="flex items-center gap-2">
        <CheckCircle size={16} className="text-green-400" />
        {benefit}
      </span>
    ))}
  </div>
));

QuickBenefits.displayName = 'QuickBenefits';

const BenefitsGrid = memo(() => (
  <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
    {BENEFITS.map((benefit, index) => (
      <div key={benefit} className="flex flex-col items-center">
        <CheckCircle className="text-white mb-2" size={32} />
        <span className="text-white font-semibold">{benefit}</span>
      </div>
    ))}
  </div>
));

BenefitsGrid.displayName = 'BenefitsGrid';

const CTAButtons = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  const primaryButtonHover = useMemo(() => 
    prefersReducedMotion ? {} : { 
      scale: 1.05, 
      boxShadow: "0 0 40px #d400ff88",
      y: -3
    }, [prefersReducedMotion]
  );
  
  const secondaryButtonHover = useMemo(() => 
    prefersReducedMotion ? {} : { 
      scale: 1.05,
      boxShadow: "0 0 30px #d400ff44" 
    }, [prefersReducedMotion]
  );
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <motion.a
        href={PRICING.whatsappLink}
        className="bg-gradient-to-r from-[#d400ff] to-[#b300dd] text-white px-12 py-6 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:from-[#b300dd] hover:to-[#9000bb] transition-all duration-300 shadow-2xl"
        whileHover={primaryButtonHover}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      >
        <MessageCircle size={24} />
        Garantir Vaga - {PRICING.installments}x {PRICING.installmentPrice}
      </motion.a>
      
      <motion.button
        className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-6 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10"
        whileHover={secondaryButtonHover}
      >
        Tenho Dúvidas
      </motion.button>
    </div>
  );
});

CTAButtons.displayName = 'CTAButtons';

const OfferDetails = memo(() => (
  <div className="mt-6 space-y-3">
    <p className="flex items-center gap-2 justify-center text-yellow-400 font-semibold">
      <Timer size={16} />
      Oferta válida até 15/08/2025 ou enquanto durarem as vagas
    </p>
    <div className="flex flex-wrap justify-center gap-6 text-gray-300 text-sm">
      <span className="flex items-center gap-1">
        <CheckCircle size={16} className="text-green-400" />
        Pagamento em até {PRICING.installments}x sem juros
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle size={16} className="text-green-400" />
        7 dias de garantia total
      </span>
      <span className="flex items-center gap-1">
        <CheckCircle size={16} className="text-green-400" />
        Certificado incluso
      </span>
    </div>
  </div>
));

OfferDetails.displayName = 'OfferDetails';

const LocationCard = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="text-[#d400ff]" size={24} />
        <h3 className="text-xl font-bold text-gray-900" style={{ color: '#111827', fontWeight: '700', fontSize: '1.25rem' }}>Nossa Localização</h3>
      </div>
      <div className="space-y-2 text-gray-700" style={{ color: '#374151' }}>
        <p className="font-semibold" style={{ fontWeight: '600', color: '#374151' }}>{CONTACT_INFO.address.street}</p>
        <p style={{ color: '#374151' }}>{CONTACT_INFO.address.complement}</p>
        <p style={{ color: '#374151' }}>{CONTACT_INFO.address.city}</p>
      </div>
      <motion.a
        href={CONTACT_INFO.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 text-[#d400ff] hover:text-[#b300dd] font-semibold"
        style={{ color: '#d400ff', fontWeight: '600' }}
        whileHover={prefersReducedMotion ? {} : { x: 2 }}
      >
        <ExternalLink size={16} />
        <span style={{ color: '#d400ff', fontWeight: '600' }}>Abrir no Google Maps</span>
      </motion.a>
    </div>
  );
});

LocationCard.displayName = 'LocationCard';

const ContactCard = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  const whatsappMessage = useMemo(() => 
    `https://wa.me/${CONTACT_INFO.whatsapp}?text=Olá! Gostaria de mais informações sobre o curso Do Esboço ao Render.`,
    []
  );
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="text-[#d400ff]" size={24} />
        <h3 className="text-xl font-bold text-gray-900" style={{ color: '#111827', fontWeight: '700', fontSize: '1.25rem' }}>Contato Direto</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm" style={{ color: '#4b5563', fontSize: '0.875rem' }}>WhatsApp / Telefone</p>
          <p className="text-xl font-bold text-gray-900" style={{ color: '#111827', fontSize: '1.25rem', fontWeight: '700' }}>{CONTACT_INFO.phone}</p>
        </div>
        <motion.a
          href={whatsappMessage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold"
          style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: '600' }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
        >
          <MessageCircle size={16} />
          <span style={{ color: '#ffffff', fontWeight: '600' }}>Chamar no WhatsApp</span>
        </motion.a>
      </div>
    </div>
  );
});

ContactCard.displayName = 'ContactCard';

const FloatingElements = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  // Reduce elements for better performance
  const elements = useMemo(() => 
    Array.from({length: 6}).map((_, index) => ({
      key: index,
      left: `${(index * 30 + 10) % 90}%`,
      top: `${(index * 25 + 15) % 70}%`,
      delay: index * 0.8
    })), []
  );
  
  if (prefersReducedMotion) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.key}
          className="absolute w-1 h-1 bg-[#d400ff]/40 rounded-full"
          style={{
            left: element.left,
            top: element.top,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8, // Slower animation for less CPU usage
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
});

FloatingElements.displayName = 'FloatingElements';

const FinalCTA = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      {/* Background com foto de projeto - Optimized */}
      <div className="absolute inset-0">
        <img 
          src="/assets/cursos/sketchup-enscape/cta-background.jpeg"
          alt="Projeto Arquitetônico"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Overlay escuro com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
        {/* Overlay roxo sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#d400ff]/20 via-transparent to-[#d400ff]/20"></div>
      </div>

      {/* Elementos flutuantes sutis - Only render when visible */}
      {isVisible && <FloatingElements />}

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comece sua carreira de projetista hoje!
          </h2>
          
          <OfferBadge />
          <PricingInfo />
          <QuickBenefits />
          <BenefitsGrid />
          <CTAButtons />
          <OfferDetails />
        </motion.div>
      </div>
      
      {/* Seção de Localização */}
      {isVisible && (
        <div className="container mx-auto px-4 mt-16">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <LocationCard />
              <ContactCard />
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';

// Componente principal da página - Optimized for performance
const CursoSketchUpEnscape = memo(() => {
  return (
    <div className="font-montserrat">
      <Helmet>
        <title>{SEO_DATA.title}</title>
        <meta name="description" content={SEO_DATA.description} />
        <meta name="keywords" content={SEO_DATA.keywords} />
        <meta property="og:title" content="Curso SketchUp + Enscape - Do Esboço ao Render" />
        <meta property="og:description" content="Aprenda a criar projetos arquitetônicos profissionais com renderizações fotorealísticas que impressionam clientes." />
        <meta property="og:image" content={SEO_DATA.ogImage} />
        <link rel="canonical" href={SEO_DATA.canonical} />
      </Helmet>
      
      <style>
        {`
          .font-montserrat {
            font-family: 'Montserrat', sans-serif !important;
          }
          
          .bg-gradient-radial {
            background: radial-gradient(circle, #110011, #000000);
          }
          
          html {
            scroll-behavior: smooth;
          }
          
          /* Force text visibility and prevent invisible motion elements */
          * {
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Specific text visibility fixes */
          .text-gray-700,
          .text-gray-600,
          .text-gray-900,
          .text-white,
          .font-semibold,
          .font-bold,
          h1, h2, h3, h4, h5, h6, p, span, div {
            color: inherit !important;
            font-weight: inherit !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Ensure motion elements are always visible */
          [data-framer-name],
          .framer-motion-element,
          div[style*="opacity: 0"] {
            opacity: 1 !important;
          }
          
          /* Enhanced fallback for gradient text elements */
          .bg-clip-text {
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
          }
          
          /* Ensure gradient text fallback */
          @supports not (background-clip: text) {
            .bg-clip-text.text-transparent {
              color: #d400ff !important;
              -webkit-text-fill-color: #d400ff !important;
            }
          }
          
          /* iOS Safari specific fix */
          @media screen and (-webkit-min-device-pixel-ratio: 2) {
            .bg-clip-text.text-transparent {
              -webkit-text-fill-color: transparent;
              text-shadow: none;
            }
          }
          
          /* Specific fixes for CTA section */
          .bg-white .text-gray-700 {
            color: #374151 !important;
          }
          
          .bg-white .text-gray-600 {
            color: #4b5563 !important;
          }
          
          .bg-white .text-gray-900 {
            color: #111827 !important;
          }
          
          .bg-white .font-semibold {
            font-weight: 600 !important;
          }
          
          .bg-white .font-bold {
            font-weight: 700 !important;
          }
        `}
      </style>

      <CourseHeader />
      <CourseHero />
      <AboutCourse />
      <Curriculum />
      <CourseProjects />
      <CourseTestimonials />
      <CompaniesSection />
      <FinalCTA />
    </div>
  );
});

CursoSketchUpEnscape.displayName = 'CursoSketchUpEnscape';

export default CursoSketchUpEnscape;

// Export for React Router lazy loading
export const Component = CursoSketchUpEnscape;