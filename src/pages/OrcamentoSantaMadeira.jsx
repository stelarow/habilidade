import React, { useState, useEffect } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion, useInView } from 'framer-motion';
import {
  TrendUp,
  CurrencyDollar,
  Target,
  Lightning,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Phone,
  Download,
  Rocket,
  Heart,
  Globe,
  Code,
  Gauge
} from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Componente de animação de scroll reveal
const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Componente de contador animado
const AnimatedCounter = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
};

// Componente de countdown
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center items-center">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes }
      ].map((item, index) => (
        <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px] border-2 border-lime-400">
          <div className="text-4xl md:text-5xl font-bold text-lime-400 mb-1">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-sm text-white/90 uppercase tracking-wide font-semibold">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

function OrcamentoSantaMadeira() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Ale, quero começar agora! me manda o pix!');
    window.open(`https://wa.me/5548984587067?text=${message}`, '_blank');
  };

  return (
    <TooltipProvider>
      <Helmet>
        <title>Proposta de Modernização - Santa Madeira Casas | R$ 7.000</title>
        <meta
          name="description"
          content="Proposta completa para migração do site para Next.js com blog SEO incluído. Performance 3x melhor, +60% tráfego e economia de R$ 7.200/ano."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Hero Section - Regra 60-30-10: 60% teal (dominante), 30% white (secundária), 10% lime (destaque) */}
        <section className="relative min-h-screen flex items-center overflow-hidden py-24" style={{
          background: `
            radial-gradient(circle at 0% 0%, rgba(13, 148, 136, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #10b981 100%)
          `
        }}>
          {/* Decorative Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 bg-teal-300/5 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column - Text Content + Comparison Cards */}
              <div className="space-y-6 lg:space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white space-y-3"
                >
                  <p className="text-xs md:text-sm uppercase tracking-widest text-white/80 font-semibold">
                    Proposta Novo Site
                  </p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                    SANTA MADEIRA
                    <br />
                    {/* 10% cor de destaque (lime) */}
                    <span className="text-lime-400" style={{ textShadow: '0 0 40px rgba(132, 204, 22, 0.5)' }}>
                      CASAS
                    </span>
                  </h1>
                  <p className="text-base md:text-lg text-white/90 font-medium pt-2">
                    Modernização WordPress → Next.js
                  </p>
                </motion.div>

                {/* Comparison Bars - Animated Progress - 30% cor secundária (white cards) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-4 bg-white/10 backdrop-blur-md p-5 lg:p-6 rounded-2xl border border-white/20 shadow-xl"
                >
                  {/* Velocidade */}
                  <motion.div
                    className="space-y-1.5 p-3 rounded-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-lime-400/20 p-1.5 rounded-lg ring-1 ring-lime-400/40 backdrop-blur-sm">
                          <Lightning className="w-5 h-5 text-lime-400" weight="fill" />
                        </div>
                        <span className="text-white font-bold text-sm uppercase tracking-wider">Velocidade</span>
                      </div>
                      <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/40 font-bold">
                        +186%
                      </Badge>
                    </div>

                    {/* Atual */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-red-400 font-semibold">❌ Atual</span>
                        <span className="text-xs text-white font-bold">2.0s</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="h-2 bg-red-500 rounded-full"
                        style={{ backgroundColor: '#ef4444' }}
                      />
                    </div>

                    {/* Novo */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-lime-400 font-semibold">✅ Novo</span>
                        <span className="text-xs text-white font-bold">0.7s</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "35%" }}
                        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                        className="h-2.5 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #84cc16 0%, #a3e635 100%)',
                          boxShadow: '0 0 10px rgba(132, 204, 22, 0.4)'
                        }}
                      />
                    </div>
                  </motion.div>

                  <Separator className="bg-white/10" />

                  {/* SEO */}
                  <motion.div
                    className="space-y-1.5 p-3 rounded-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-lime-400/20 p-1.5 rounded-lg ring-1 ring-lime-400/40 backdrop-blur-sm">
                          <Target className="w-5 h-5 text-lime-400" weight="fill" />
                        </div>
                        <span className="text-white font-bold text-sm uppercase tracking-wider">SEO</span>
                      </div>
                      <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/40 font-bold">
                        +150%
                      </Badge>
                    </div>

                    {/* Atual */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-red-400 font-semibold">❌ Atual</span>
                        <span className="text-xs text-white font-bold">40%</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "40%" }}
                        transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                        className="h-2 bg-red-500 rounded-full"
                        style={{ backgroundColor: '#ef4444' }}
                      />
                    </div>

                    {/* Novo */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-lime-400 font-semibold">✅ Novo</span>
                        <span className="text-xs text-white font-bold">100%</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
                        className="h-2.5 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #84cc16 0%, #a3e635 100%)',
                          boxShadow: '0 0 10px rgba(132, 204, 22, 0.4)'
                        }}
                      />
                    </div>
                  </motion.div>

                  <Separator className="bg-white/10" />

                  {/* Plugins */}
                  <motion.div
                    className="space-y-1.5 p-3 rounded-xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-lime-400/20 p-1.5 rounded-lg ring-1 ring-lime-400/40 backdrop-blur-sm">
                          <Code className="w-5 h-5 text-lime-400" weight="fill" />
                        </div>
                        <span className="text-white font-bold text-sm uppercase tracking-wider">Plugins</span>
                      </div>
                      <Badge className="bg-lime-400/20 text-lime-400 border-lime-400/40 font-bold">
                        -100%
                      </Badge>
                    </div>

                    {/* Atual */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-red-400 font-semibold">❌ Atual</span>
                        <span className="text-xs text-white font-bold">18 plugins</span>
                      </div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 1.3, ease: "easeOut" }}
                        className="h-2 bg-red-500 rounded-full"
                        style={{ backgroundColor: '#ef4444' }}
                      />
                    </div>

                    {/* Novo */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-lime-400 font-semibold">✅ Novo</span>
                        <span className="text-xs text-white font-bold">0 plugins</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: 0.5, delay: 1.5 }}
                          className="h-full bg-lime-500 rounded-full"
                          style={{ backgroundColor: '#84cc16' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right Column - Logo Card - 30% cor secundária (white) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-full max-w-md"
                >
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-lime-400 text-gray-900 border-lime-500 shadow-lg font-bold px-4 py-1.5">
                    Cliente Exclusivo
                  </Badge>
                  <Card className="relative bg-white/95 backdrop-blur-sm border-2 border-teal-300 overflow-hidden w-full transition-all duration-500 hover:border-lime-400"
                    style={{
                      boxShadow: '0 0 60px rgba(20, 184, 166, 0.4), 0 20px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-transparent to-lime-400/10 pointer-events-none" />
                    <CardContent className="p-10 flex items-center justify-center aspect-square relative z-10">
                      <img
                        src="/logo-santamadeiracasas-color.png.webp"
                        alt="Santa Madeira Casas"
                        className="w-full h-auto object-contain"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Problemas Atuais */}
        <section id="proposta-completa" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-red-500 text-white text-base px-6 py-2 font-semibold">
                  Diagnóstico
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  4 Problemas Críticos do Seu Site Atual
                </h2>
                <p className="text-xl text-gray-400">
                  Cada problema custa dinheiro todo mês
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-gradient-to-br from-slate-800 to-gray-800 border-2 border-red-500/30 rounded-lg px-6 shadow-xl hover:shadow-red-500/20 transition-all">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white py-6">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
                        <XCircle className="w-6 h-6 text-white" weight="fill" />
                      </div>
                      <div>
                        <span className="text-red-400 font-bold text-sm">PROBLEMA #1</span>
                        <p className="text-white mt-1">Google Não Encontra Seu Site</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-4 pb-6 pl-9">
                    <p className="mb-6 leading-relaxed text-base">
                      Quando alguém busca "casas de madeira em Palhoça", seu site não aparece direito porque faltam informações que o Google precisa.
                    </p>
                    <div className="bg-teal-900/30 border-l-4 border-teal-500 p-5 rounded-r-lg mb-6">
                      <p className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                        <Lightning className="w-5 h-5" weight="fill" />
                        Pense assim:
                      </p>
                      <p className="text-gray-300 leading-relaxed">É como ter uma loja linda, mas sem placa na frente. As pessoas passam, mas não sabem o que você vende.</p>
                    </div>
                    <div className="bg-red-950/50 border-2 border-red-500/50 p-5 rounded-lg">
                      <p className="font-bold text-red-400 mb-3 flex items-center gap-2 text-lg">
                        <CurrencyDollar className="w-5 h-5" weight="fill" />
                        Impacto financeiro:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">Seu concorrente aparece primeiro</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-gradient-to-br from-slate-800 to-gray-800 border-2 border-red-500/30 rounded-lg px-6 shadow-xl hover:shadow-red-500/20 transition-all">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white py-6">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
                        <XCircle className="w-6 h-6 text-white" weight="fill" />
                      </div>
                      <div>
                        <span className="text-red-400 font-bold text-sm">PROBLEMA #2</span>
                        <p className="text-white mt-1">Site Muito Lento</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-4 pb-6 pl-9">
                    <p className="mb-6 leading-relaxed text-base">
                      Seu site demora mais de 2 segundos para carregar. Na internet, isso é uma eternidade!
                    </p>
                    <div className="bg-teal-900/30 border-l-4 border-teal-500 p-5 rounded-r-lg mb-6">
                      <p className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                        <Lightning className="w-5 h-5" weight="fill" />
                        Pense assim:
                      </p>
                      <p className="text-gray-300 leading-relaxed">É como se seu cliente batesse na porta e tivesse que esperar 20 minutos até alguém abrir. A maioria desiste e vai no concorrente.</p>
                    </div>
                    <div className="bg-red-950/50 border-2 border-red-500/50 p-5 rounded-lg">
                      <p className="font-bold text-red-400 mb-3 flex items-center gap-2 text-lg">
                        <CurrencyDollar className="w-5 h-5" weight="fill" />
                        Impacto financeiro:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">A cada segundo, perde 7% dos visitantes</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">32 de cada 100 pessoas desistem</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">Google te penaliza nas buscas</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-gradient-to-br from-slate-800 to-gray-800 border-2 border-red-500/30 rounded-lg px-6 shadow-xl hover:shadow-red-500/20 transition-all">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white py-6">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
                        <XCircle className="w-6 h-6 text-white" weight="fill" />
                      </div>
                      <div>
                        <span className="text-red-400 font-bold text-sm">PROBLEMA #3</span>
                        <p className="text-white mt-1">Tecnologia Antiga e Insegura</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-4 pb-6 pl-9">
                    <p className="mb-6 leading-relaxed text-base">
                      WordPress com vários plugins é como ter uma casa com 7 fechaduras diferentes de marcas antigas que ninguém mais fabrica.
                    </p>
                    <div className="bg-teal-900/30 border-l-4 border-teal-500 p-5 rounded-r-lg mb-6">
                      <p className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" weight="fill" />
                        Por que é perigoso:
                      </p>
                      <p className="text-gray-300 leading-relaxed">WordPress é o alvo #1 de hackers. Todo mundo conhece as falhas e sabe como invadir.</p>
                    </div>
                    <div className="bg-red-950/50 border-2 border-red-500/50 p-5 rounded-lg">
                      <p className="font-bold text-red-400 mb-3 flex items-center gap-2 text-lg">
                        <Code className="w-5 h-5" weight="fill" />
                        Seus plugins:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">Elementor - deixa o site pesado</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">WP Rocket - você PAGA ou não funciona</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-200">+ 5 plugins extras = mais peso</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-gradient-to-br from-slate-800 to-gray-800 border-2 border-red-500/30 rounded-lg px-6 shadow-xl hover:shadow-red-500/20 transition-all">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white py-6">
                    <div className="flex items-start gap-4 text-left">
                      <div className="bg-red-500 rounded-full p-2 flex-shrink-0">
                        <XCircle className="w-6 h-6 text-white" weight="fill" />
                      </div>
                      <div>
                        <span className="text-red-400 font-bold text-sm">PROBLEMA #4</span>
                        <p className="text-white mt-1">Arquitetura Bagunçada</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pt-4 pb-6 pl-9">
                    <p className="mb-6 leading-relaxed text-base">
                      Seu site foi feito "empilhando" vários pedaços (plugins) em cima do WordPress.
                    </p>
                    <div className="bg-teal-900/30 border-l-4 border-teal-500 p-5 rounded-r-lg mb-6">
                      <p className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                        <Lightning className="w-5 h-5" weight="fill" />
                        Pense assim:
                      </p>
                      <p className="text-gray-300 leading-relaxed">É como construir uma casa com um quarto de madeira, cozinha de alvenaria e banheiro de container. Funciona? Sim. É o ideal? NÃO!</p>
                    </div>
                    <div className="bg-red-950/50 border-2 border-red-500/50 p-5 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-red-900/30 p-4 rounded-lg">
                          <p className="text-4xl font-bold text-red-400 mb-1">43</p>
                          <p className="text-xs text-gray-300 uppercase tracking-wide">arquivos CSS</p>
                        </div>
                        <div className="bg-red-900/30 p-4 rounded-lg">
                          <p className="text-4xl font-bold text-red-400 mb-1">50</p>
                          <p className="text-xs text-gray-300 uppercase tracking-wide">arquivos JS</p>
                        </div>
                        <div className="bg-red-900/30 p-4 rounded-lg">
                          <p className="text-4xl font-bold text-red-400 mb-1">80</p>
                          <p className="text-xs text-gray-300 uppercase tracking-wide">total arquivos</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-br from-slate-800 to-gray-800 border-2 border-lime-500 rounded-xl p-12 shadow-2xl">
                  <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                    Por essas razões, eu{' '}
                    <span className="text-lime-400">recomendo fortemente</span>{' '}
                    a criação de uma{' '}
                    <span className="text-teal-400">página nova do zero</span>
                  </h3>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                    Seu site atual tem problemas estruturais que não podem ser corrigidos com ajustes simples.
                    É como reformar uma casa com base fraca — melhor construir sobre uma{' '}
                    <span className="font-bold text-lime-400">fundação sólida</span>.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Comparação WordPress vs Site construido em Next.js programado de verdade */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Comparação Técnica
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  WordPress vs Site construido em Next.js programado de verdade
                </h2>
                <p className="text-xl text-teal-700 font-semibold">
                  A diferença é gritante
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="overflow-x-auto">
                <div className="bg-white rounded-xl shadow-2xl border-2 border-teal-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-600">
                        <TableHead className="text-lg font-bold text-white py-5">Característica</TableHead>
                        <TableHead className="text-lg font-bold text-center text-white py-5">
                          <div className="flex flex-col items-center gap-2">
                            <XCircle className="w-6 h-6" weight="fill" />
                            <span>WordPress Atual</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-lg font-bold text-center text-white py-5">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-lime-400" weight="fill" />
                            <span>Next.js Novo</span>
                          </div>
                        </TableHead>
                        <TableHead className="text-lg font-bold text-center text-white py-5">
                          <div className="flex items-center justify-center gap-2">
                            <Lightning className="w-6 h-6 text-lime-400" weight="fill" />
                            <span>Diferença</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-teal-600" />
                            <span>Velocidade</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">2s</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">0,7s</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">3x mais rápido</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-teal-600" />
                            <span>SEO</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">40% incompleto</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">100% completo</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">+60%</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-teal-600" />
                            <span>Arquivos CSS</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">43</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">3</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">93% menor</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-teal-600" />
                            <span>Arquivos JS</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">50</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">10</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">80% menor</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <CurrencyDollar className="w-5 h-5 text-teal-600" />
                            <span>Custo Plugins</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">R$ 300/mês</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">R$ 0</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">-R$ 3.600/ano</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-teal-600" />
                            <span>Segurança</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">🔴 Vulnerável</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">🟢 Seguro</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">100% melhor</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors border-b border-teal-100">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-teal-600" />
                            <span>Mobile</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">40-60 pontos</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">85-95 pontos</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">+50 pontos</TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-teal-50/50 transition-colors">
                        <TableCell className="font-bold text-gray-900 py-5">
                          <div className="flex items-center gap-2">
                            <Code className="w-5 h-5 text-teal-600" />
                            <span>Construção</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge variant="destructive" className="text-base px-4 py-2">Template genérico modificado</Badge>
                        </TableCell>
                        <TableCell className="text-center py-5">
                          <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-base px-4 py-2">Programado do zero profissionalmente</Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lime-600 py-5 text-lg">Código limpo e otimizado</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-lime-50 to-emerald-50 border-2 border-lime-300 p-6 rounded-lg shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-lime-500 rounded-full p-3 flex-shrink-0">
                    <Rocket className="h-6 w-6 text-gray-900" weight="bold" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2 text-lg">Site Profissional de Verdade:</p>
                    <p className="text-gray-700 leading-relaxed">
                      Seu novo site terá <strong className="text-teal-700">qualidade de grandes empresas</strong>, não um template genérico adaptado.
                      Código <strong className="text-teal-700">programado do zero</strong> com as melhores técnicas avançadas de SEO do mundo,
                      otimizações de performance enterprise e arquitetura que <strong className="text-teal-700">sites profissionais usam</strong> para dominar o Google.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Solução: Blog SEO Destacado */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Marketing Digital
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Blog SEO: Seu Segredo Para Dominar o Google
                </h2>
                <p className="text-xl text-teal-700 max-w-3xl mx-auto font-semibold">
                  Não basta ter um site bonito. Você precisa ser ENCONTRADO.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-2 border-teal-200 shadow-2xl bg-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-lime-500 rounded-full p-2">
                      <Target className="w-6 h-6 text-gray-900" weight="bold" />
                    </div>
                    <CardTitle className="text-3xl">Por Que Blog SEO É Fundamental?</CardTitle>
                  </div>
                  <CardDescription className="text-white/95 text-lg">
                    Cada post = uma nova porta de entrada no Google
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-10 pb-10 bg-white">
                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                      <div className="bg-white border-2 border-red-300 p-5 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-6 h-6 text-red-600" weight="fill" />
                          <p className="font-bold text-red-900 text-lg">Problema:</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Hoje seu site só aparece quando alguém busca exatamente "Santa Madeira Casas".
                          E quando buscam "como escolher madeira para casa"? Você <strong className="text-red-700">PERDE o cliente</strong>.
                        </p>
                      </div>

                      <div className="bg-teal-50 border-2 border-teal-300 p-5 rounded-lg shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-6 h-6 text-teal-600" weight="fill" />
                          <p className="font-bold text-teal-900 text-lg">Solução:</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Com o blog, você aparece em <strong className="text-teal-700">DEZENAS de buscas relacionadas</strong>, capturando clientes em todas as etapas da jornada.
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-lg border-2 border-teal-200 mb-6">
                        <h4 className="font-bold text-teal-900 mb-4 text-xl flex items-center gap-2">
                          <Rocket className="w-5 h-5 text-lime-600" weight="fill" />
                          Exemplos de Posts Estratégicos:
                        </h4>
                        <div className="space-y-3">
                          {[
                            {
                              title: "Cumaru vs Pinus: Qual Escolher?",
                              searches: "1.200 buscas/mês"
                            },
                            {
                              title: "Quanto Custa Casa de Madeira em SC?",
                              searches: "800 buscas/mês"
                            },
                            {
                              title: "Como é Construída uma Casa de Madeira",
                              searches: "600 buscas/mês"
                            },
                            {
                              title: "Vantagens e Desvantagens [Guia 2025]",
                              searches: "2.100 buscas/mês"
                            }
                          ].map((post, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border-2 border-teal-200 hover:border-lime-400 hover:shadow-md transition-all">
                              <p className="font-semibold text-gray-900 mb-1">{post.title}</p>
                              <div className="flex items-center gap-2">
                                <TrendUp className="w-4 h-4 text-lime-600" weight="bold" />
                                <p className="text-sm text-teal-700 font-bold">{post.searches}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8 bg-teal-200" />

                  <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
                    <h4 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                      <Shield className="w-6 h-6 text-teal-600" weight="fill" />
                      Diferenciais do Blog SEO:
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        "Cada post = nova porta de entrada",
                        "Conteúdo relevante por anos",
                        "Autoridade de domínio cresce",
                        "Compartilhamento orgânico",
                        "Educação do cliente",
                        "URLs amigáveis para SEO"
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-teal-200">
                          <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-lime-50 to-emerald-50 border-2 border-lime-300 p-6 rounded-lg shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="bg-lime-500 rounded-full p-3 flex-shrink-0">
                        <Rocket className="h-6 w-6 text-gray-900" weight="bold" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 mb-2 text-lg">Resultado esperado:</p>
                        <p className="text-gray-700 leading-relaxed">
                          Cada post bem ranqueado traz visitantes qualificados todo mês, <strong className="text-teal-700">SEM pagar Google Ads</strong>.
                          Seu investimento em conteúdo trabalha para você 24/7.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* Investimento e Pagamento */}
        <section className="py-12 md:py-16 lg:py-20 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Investimento e Pagamento
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-900">
                  Estrutura justa com garantia de resultado
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-2 md:border-4 border-teal-600 shadow-xl md:shadow-2xl overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-6 md:py-8">
                  <p className="text-base md:text-lg mb-2">Investimento Total</p>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-bold">R$ 7.000,00</p>
                </div>

                <CardContent className="p-4 md:p-6 lg:p-8">
                  <div className="space-y-4 md:space-y-6">
                    <div className="bg-teal-50 p-4 md:p-6 rounded-lg border-2 border-teal-200">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-teal-700 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-lg md:text-xl flex-shrink-0">
                          1
                        </div>
                        <div className="flex-1">
                          <p className="text-lg md:text-xl lg:text-2xl font-bold text-teal-900 mb-3">
                            1ª Parcela: R$ 4.000
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-teal-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900">Pago no início do projeto</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-teal-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900">Libera desenvolvimento completo</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-teal-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900">Inclui todas as entregas do escopo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-lime-50 p-4 md:p-6 rounded-lg border-2 border-lime-200">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="bg-lime-600 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-lg md:text-xl flex-shrink-0">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="text-lg md:text-xl lg:text-2xl font-bold text-lime-900 mb-3">
                            2ª Parcela: R$ 3.000
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 md:w-5 md:h-5 text-lime-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900 font-medium">Pago na entrega do site completo</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 md:w-5 md:h-5 text-lime-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900">Site otimizado e funcionando</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 md:w-5 md:h-5 text-lime-600 flex-shrink-0" />
                              <span className="text-sm md:text-base text-gray-900 font-medium">SEO otimizado garantido</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-6 md:mt-8 bg-blue-50 border-blue-200">
                    <Heart className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div className="ml-6 md:ml-8">
                      <p className="font-semibold text-blue-900 mb-1 text-sm md:text-base">Por que essa estrutura?</p>
                      <p className="text-blue-800 text-xs md:text-sm">
                        Queremos que você tenha <strong>certeza do resultado</strong>. A segunda parcela é paga na entrega do site completo,
                        totalmente otimizado para SEO e pronto para gerar resultados. Seu sucesso é nosso sucesso!
                      </p>
                    </div>
                  </Alert>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* Escopo Detalhado (Tabs) */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Escopo Completo
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  O Que Está Incluído
                </h2>
                <p className="text-xl text-teal-700 font-semibold">
                  Uma página programada e otimizada, não apenas o uso de um template no WordPress
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Tabs defaultValue="site" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-gradient-to-r from-teal-600 to-emerald-600 p-1 rounded-lg">
                  <TabsTrigger
                    value="site"
                    className="py-4 text-white data-[state=active]:bg-lime-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg font-semibold transition-all"
                  >
                    Site Principal
                  </TabsTrigger>
                  <TabsTrigger
                    value="blog"
                    className="py-4 text-white data-[state=active]:bg-lime-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg font-semibold transition-all"
                  >
                    Blog SEO
                  </TabsTrigger>
                  <TabsTrigger
                    value="integracoes"
                    className="py-4 text-white data-[state=active]:bg-lime-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg font-semibold transition-all"
                  >
                    Integrações
                  </TabsTrigger>
                  <TabsTrigger
                    value="hospedagem"
                    className="py-4 text-white data-[state=active]:bg-lime-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg font-semibold transition-all"
                  >
                    Hospedagem
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="site" className="mt-6">
                  <Card className="bg-white border-2 border-teal-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-600 rounded-full p-2">
                          <Globe className="w-6 h-6 text-white" weight="bold" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 text-2xl">Site Principal em Next.js</CardTitle>
                          <CardDescription className="text-teal-700 font-medium">Todas as páginas e funcionalidades essenciais</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Home com design moderno",
                          "Sobre Nós",
                          "Galeria de Projetos",
                          "Catálogo de Casas",
                          "Formulário de Contato",
                          "Integração WhatsApp",
                          "SEO técnico completo",
                          "Meta tags otimizadas",
                          "Open Graph para redes sociais",
                          "Schema.org para Google",
                          "Responsivo 100%",
                          "Performance Core Web Vitals"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blog" className="mt-6">
                  <Card className="bg-white border-2 border-teal-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-600 rounded-full p-2">
                          <Target className="w-6 h-6 text-white" weight="bold" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 text-2xl">Blog Otimizado para Ranqueamento</CardTitle>
                          <CardDescription className="text-teal-700 font-medium">Arquitetura focada em aparecer no Google</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                      <div className="space-y-6">
                        <div className="bg-teal-50 p-5 rounded-lg border-2 border-teal-200">
                          <h4 className="font-bold text-teal-900 mb-4 text-lg flex items-center gap-2">
                            <Code className="w-5 h-5" weight="bold" />
                            Estrutura Técnica:
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {[
                              "URLs amigáveis para SEO",
                              "Meta tags automáticas por post",
                              "Schema.org Article/BlogPosting",
                              "Breadcrumbs estruturados",
                              "Sitemap.xml dinâmico",
                              "RSS feed automático",
                              "Lazy loading de imagens",
                              "Pré-renderização estática (SSG)"
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                                <span className="text-gray-700 font-medium">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-teal-200" />

                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                            <Lightning className="w-5 h-5 text-lime-600" weight="bold" />
                            Categorias Estratégicas:
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {[
                              "Tipos de Madeira",
                              "Processos de Construção",
                              "Cases de Sucesso",
                              "Guias e Tutoriais",
                              "Sustentabilidade"
                            ].map((cat, index) => (
                              <Badge key={index} className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-2">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integracoes" className="mt-6">
                  <Card className="bg-white border-2 border-teal-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-600 rounded-full p-2">
                          <Lightning className="w-6 h-6 text-white" weight="bold" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 text-2xl">APIs e Serviços</CardTitle>
                          <CardDescription className="text-teal-700 font-medium">Tudo integrado e funcionando</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Google Analytics 4",
                          "Google Tag Manager",
                          "Google Search Console",
                          "WhatsApp Business API",
                          "EmailJS (formulários)",
                          "Pixels de conversão",
                          "Mapas interativos",
                          "Compartilhamento social"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hospedagem" className="mt-6">
                  <Card className="bg-white border-2 border-teal-200 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-600 rounded-full p-2">
                          <Rocket className="w-6 h-6 text-white" weight="bold" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 text-2xl">Hospedagem Premium Grátis</CardTitle>
                          <CardDescription className="text-teal-700 font-medium">Infraestrutura de primeiro mundo, sem custo</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-8 pb-8">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Vercel ou Netlify (sua escolha)",
                          "CDN global incluído",
                          "SSL automático (HTTPS)",
                          "Backups automáticos",
                          "Deploy contínuo",
                          "Zero downtime",
                          "Escalabilidade automática",
                          "Suporte 24/7"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                            <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-gray-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollReveal>
          </div>
        </section>

        {/* Cronograma */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Planejamento
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Cronograma de Desenvolvimento
                </h2>
                <p className="text-xl text-teal-700 font-semibold">
                  5-6 semanas do início ao lançamento
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {[
                {
                  week: "Semana 1",
                  title: "Setup e Design System",
                  tasks: ["Preparar estrutura", "Definir cores e fontes", "Revisar juntos"],
                  progress: 20,
                  icon: Rocket
                },
                {
                  week: "Semanas 2-3",
                  title: "Páginas Principais",
                  tasks: ["Home 100% funcional", "Sobre Nós", "Contato com formulário", "SEO completo"],
                  progress: 40,
                  icon: Code
                },
                {
                  week: "Semana 4",
                  title: "Blog e Funcionalidades",
                  tasks: ["Sistema de blog", "Galeria de projetos", "Catálogo de casas", "Integrações"],
                  progress: 60,
                  icon: Target
                },
                {
                  week: "Semana 5",
                  title: "Otimização Final",
                  tasks: ["Testes de velocidade", "Ajustes finais", "Garantir 95+ pontos"],
                  progress: 80,
                  icon: Gauge
                },
                {
                  week: "Semana 6",
                  title: "Lançamento",
                  tasks: ["Migração DNS", "Monitoramento", "Suporte pós-lançamento"],
                  progress: 100,
                  icon: CheckCircle
                }
              ].map((phase, index) => (
                <ScrollReveal key={phase.week} delay={index * 0.1}>
                  <Card className="border-2 border-teal-200 hover:shadow-xl hover:border-teal-300 transition-all duration-300 bg-white overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white pb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-lime-500 rounded-full p-2">
                            <phase.icon className="w-6 h-6 text-gray-900" weight="bold" />
                          </div>
                          <CardTitle className="text-2xl font-bold">{phase.week}</CardTitle>
                        </div>
                        <Badge className={phase.progress === 100 ? "bg-lime-500 text-gray-900 text-sm px-4 py-2 font-bold" : "bg-blue-500 text-white text-sm px-4 py-2 font-bold"}>
                          {phase.progress}% concluído
                        </Badge>
                      </div>
                      <CardDescription className="text-xl font-bold text-white/95">
                        {phase.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-6 bg-white">
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-teal-700">Progresso</span>
                          <span className="text-sm font-bold text-teal-900">{phase.progress}%</span>
                        </div>
                        <Progress
                          value={phase.progress}
                          className="h-3 bg-teal-100"
                        />
                      </div>
                      <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg">
                        <h4 className="font-bold text-teal-900 mb-3 text-sm uppercase tracking-wide">Entregas:</h4>
                        <ul className="space-y-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-3 text-gray-700">
                              <CheckCircle className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" weight="fill" />
                              <span className="font-medium">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.6}>
              <div className="mt-12 bg-gradient-to-r from-lime-50 to-emerald-50 border-2 border-lime-300 p-8 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-lime-500 rounded-full p-3 flex-shrink-0">
                    <Clock className="h-7 w-7 text-gray-900" weight="bold" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2 text-xl">Prazo realista e transparente</p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Não prometemos milagres em 1 semana. Um site profissional <strong className="text-teal-700">bem feito leva tempo</strong> - mas o resultado é <strong className="text-teal-700">para durar anos</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Suas Dúvidas
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="text-xl text-teal-700">
                  Tudo que você precisa saber
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq-1" className="bg-white border-2 border-teal-200 rounded-lg px-6 shadow-md hover:shadow-lg transition-shadow">
                  <AccordionTrigger className="text-lg font-semibold text-left text-teal-900 hover:text-teal-700 py-6">
                    Vou perder o que já tenho no site atual?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base leading-relaxed pb-6">
                    <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded-r-lg mb-4">
                      <p className="font-bold text-lime-900 text-lg">NÃO! Vamos EVOLUIR!</p>
                    </div>
                    <p className="mb-4 text-gray-900">
                      O site será recriado do zero com design moderno, mas:
                    </p>
                    <ul className="space-y-3 pl-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Sua identidade visual permanece (cores, logo, fotos)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Mesma mensagem e conteúdo (otimizado para SEO)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Todas funcionalidades atuais + recursos novos</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-lime-600 font-bold">➕</span>
                        <span className="font-semibold text-teal-900">Design profissional que converte mais</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-lime-600 font-bold">➕</span>
                        <span className="font-semibold text-teal-900">3x mais rápido e muito mais bonito!</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="bg-white border-2 border-teal-200 rounded-lg px-6 shadow-md hover:shadow-lg transition-shadow">
                  <AccordionTrigger className="text-lg font-semibold text-left text-teal-900 hover:text-teal-700 py-6">
                    Preciso pagar hospedagem?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base pb-6">
                    <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded-r-lg mb-4">
                      <p className="font-bold text-lime-900 text-lg">NÃO!</p>
                    </div>
                    <ul className="space-y-3 pl-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Hospedagem grátis (Vercel ou Netlify)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>CDN global incluído</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>SSL automático</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Backups automáticos</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="bg-white border-2 border-teal-200 rounded-lg px-6 shadow-md hover:shadow-lg transition-shadow">
                  <AccordionTrigger className="text-lg font-semibold text-left text-teal-900 hover:text-teal-700 py-6">
                    E se der problema depois do lançamento?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base pb-6">
                    <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded-r-lg mb-4">
                      <p className="font-bold text-lime-900 text-lg">TRANQUILO!</p>
                    </div>
                    <ul className="space-y-3 pl-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Código testado e validado</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Monitoramento 24/7</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Backup automático</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Rollback em 1 clique (volta versão anterior)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" weight="fill" />
                        <span>Suporte pós-lançamento incluído</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="bg-white border-2 border-teal-200 rounded-lg px-6 shadow-md hover:shadow-lg transition-shadow">
                  <AccordionTrigger className="text-lg font-semibold text-left text-teal-900 hover:text-teal-700 py-6">
                    Quanto custa manter o site funcionando?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-base pb-6">
                    <div className="bg-lime-50 border-l-4 border-lime-500 p-4 rounded-r-lg mb-4">
                      <p className="font-bold text-lime-900 text-lg">QUASE NADA!</p>
                    </div>
                    <div className="bg-teal-50 border-2 border-teal-200 p-5 rounded-lg mb-4">
                      <p className="font-bold text-teal-900 mb-3 text-lg">Com Next.js:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                          <span>Hospedagem: <strong className="text-teal-900">R$ 0</strong> (grátis)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                          <span>Plugins: <strong className="text-teal-900">R$ 0</strong> (não precisa)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                          <span>Atualizações: <strong className="text-teal-900">R$ 0</strong> (automático)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                          <span>Segurança: <strong className="text-teal-900">R$ 0</strong> (já incluso)</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t-2 border-teal-300">
                        <p className="font-bold text-teal-900">
                          Único custo: domínio (R$ 40/ano - você já paga)
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        {/* Grid de Tecnologias */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-50 via-emerald-50 to-teal-50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-lime-500 text-gray-900 text-base px-6 py-2 font-semibold">
                  Stack Profissional
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Tecnologias de Ponta
                </h2>
                <p className="text-xl text-teal-700 font-semibold">
                  As mesmas usadas por Nike, Uber e Netflix
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Next.js",
                  description: "Framework React mais usado no mundo. Performance e SEO perfeitos.",
                  icon: Code,
                  color: "text-gray-900",
                  bgColor: "bg-gray-900",
                  details: "Framework React para produção com SSR, SSG e ISR. Otimização automática de imagens, code splitting e muito mais. Usado por Nike, Uber, Netflix.",
                  companies: "Nike, Uber, Netflix"
                },
                {
                  name: "TailwindCSS",
                  description: "Design system moderno e responsivo. Usado por GitHub e Shopify.",
                  icon: Gauge,
                  color: "text-cyan-600",
                  bgColor: "bg-cyan-600",
                  details: "Framework CSS utility-first que permite criar designs customizados rapidamente. Gera apenas o CSS necessário, resultando em arquivos super leves.",
                  companies: "GitHub, Shopify"
                },
                {
                  name: "Framer Motion",
                  description: "Animações fluidas que encantam. Experiência premium.",
                  icon: Lightning,
                  color: "text-pink-600",
                  bgColor: "bg-pink-600",
                  details: "Biblioteca de animação mais popular para React. Cria transições suaves e interações que aumentam o engajamento em até 40%.",
                  companies: "Coinbase, Spotify"
                },
                {
                  name: "Vercel",
                  description: "Hospedagem grátis, CDN global, deploy automático.",
                  icon: Globe,
                  color: "text-gray-900",
                  bgColor: "bg-gray-900",
                  details: "Plataforma de hospedagem criada pelos desenvolvedores do Next.js. CDN em 70+ cidades, SSL automático, deploy em segundos. 100% grátis para sempre.",
                  companies: "Next.js, TikTok"
                },
                {
                  name: "React 19",
                  description: "Biblioteca mais popular do mundo. Comunidade gigante.",
                  icon: Code,
                  color: "text-blue-600",
                  bgColor: "bg-blue-600",
                  details: "Biblioteca JavaScript mais usada globalmente. 14+ milhões de sites, comunidade de 10+ milhões de desenvolvedores. Mantida pelo Facebook/Meta.",
                  companies: "Facebook, Instagram"
                },
                {
                  name: "TypeScript",
                  description: "Código seguro e sem bugs. Qualidade empresarial.",
                  icon: Shield,
                  color: "text-blue-700",
                  bgColor: "bg-blue-700",
                  details: "JavaScript com tipagem estática. Detecta bugs antes da execução, reduz erros em 15%, facilita manutenção. Usado por Microsoft, Google, Airbnb.",
                  companies: "Microsoft, Airbnb"
                }
              ].map((tech, index) => (
                <ScrollReveal key={tech.name} delay={index * 0.1}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Card className="border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white overflow-hidden group">
                        <CardHeader className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white pb-6 group-hover:from-teal-500 group-hover:to-emerald-500 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${tech.bgColor} rounded-full p-3 shadow-lg`}>
                              <tech.icon className="w-8 h-8 text-white" weight="bold" />
                            </div>
                            <Badge className="bg-lime-500 text-gray-900 text-xs px-3 py-1 font-bold">
                              Enterprise
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl font-bold mb-1">{tech.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6 bg-white">
                          <p className="text-gray-700 font-medium leading-relaxed mb-4">{tech.description}</p>
                          <div className="flex items-center gap-2 text-sm text-teal-700">
                            <CheckCircle className="w-4 h-4 text-lime-600" weight="fill" />
                            <span className="font-semibold">Usado por {tech.companies}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 border-2 border-teal-200 bg-white">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`${tech.bgColor} rounded-full p-2`}>
                            <tech.icon className="w-5 h-5 text-white" weight="bold" />
                          </div>
                          <h4 className="font-bold text-lg text-gray-900">{tech.name}</h4>
                        </div>
                        <div className="bg-teal-50 border-l-4 border-teal-600 p-3 rounded-r-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">{tech.details}</p>
                        </div>
                        <div className="pt-2">
                          <Badge className="bg-lime-500 text-gray-900 text-xs px-3 py-1 font-semibold">
                            {tech.companies}
                          </Badge>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.7}>
              <div className="mt-16 bg-gradient-to-r from-lime-50 to-emerald-50 border-2 border-lime-300 p-8 rounded-xl shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-lime-500 rounded-full p-3 flex-shrink-0">
                    <Rocket className="h-7 w-7 text-gray-900" weight="bold" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-2 text-xl">Stack de empresas bilionárias</p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Seu site será construído com as <strong className="text-teal-700">mesmas tecnologias que as maiores empresas do mundo</strong> usam.
                      Não é "gambiarra" ou plugin quebrado - é <strong className="text-teal-700">código profissional de verdade</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-4 bg-gradient-to-br from-teal-600 via-teal-700 to-green-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-bold mb-12">
                Vamos Transformar Seu Negócio?
              </h2>

              <div className="mb-12">
                <div className="mb-6">
                  <Badge className="bg-lime-500 text-gray-900 text-lg px-6 py-3 font-bold mb-4 inline-flex items-center gap-2">
                    <Clock className="w-5 h-5" weight="bold" />
                    Oferta Expira Em:
                  </Badge>
                </div>
                <Countdown targetDate="2025-11-02T00:00:00" />
                <p className="text-white/90 text-sm mt-4 font-semibold">
                  Proposta válida até 02/11/2025 às 00h
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-lime-500 hover:bg-lime-400 text-gray-900 text-lg md:text-2xl px-6 md:px-16 py-6 md:py-10 font-bold shadow-2xl hover:shadow-lime-500/50 transition-all hover:scale-105"
                  onClick={handleWhatsAppClick}
                >
                  <CheckCircle className="mr-3 w-6 h-6 md:w-8 md:h-8" weight="fill" />
                  Aceitar Proposta
                </Button>
              </div>

              <div className="mt-12">
                <p className="text-white text-base font-semibold">
                  Quanto mais rápido começarmos, mais rápido você será visto e notado
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </TooltipProvider>
  );
}

// Export both default and Component for vite-react-ssg compatibility
export default OrcamentoSantaMadeira;
export { OrcamentoSantaMadeira as Component };
