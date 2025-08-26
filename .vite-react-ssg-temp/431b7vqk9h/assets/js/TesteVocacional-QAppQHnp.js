import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, Component, useRef } from "react";
import { m as motion } from "./lazyMotion-Brq4XrXb.js";
import { Helmet } from "@dr.pogodin/react-helmet";
import { a as LogoH } from "../../main.mjs";
import { a as analytics } from "./analytics-CIuQyk36.js";
import { Brain, Star, ChatCircle, Clock, Target, Trophy, User, Pulse, CaretRight, Check, CaretLeft, BookOpen, Palette, Code, TrendUp, ChartBar, Camera, Users, ChartPie, Phone, MapPin, ArrowsClockwise, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import "vite-react-ssg";
import "react-router-dom";
import "@tanstack/react-query";
import "prop-types";
let librariesCache = {
  html2canvas: null,
  jspdf: null,
  isLoading: false
};
let progressCallbacks = /* @__PURE__ */ new Set();
const onLoadProgress = (callback) => {
  progressCallbacks.add(callback);
  return () => progressCallbacks.delete(callback);
};
const notifyProgress = (progress) => {
  progressCallbacks.forEach((callback) => {
    try {
      callback(progress);
    } catch (error) {
      console.warn("PDF Worker: Callback error:", error);
    }
  });
};
const loadPDFLibraries = async () => {
  if (librariesCache.html2canvas && librariesCache.jspdf) {
    notifyProgress({ phase: "cached", progress: 100 });
    return {
      html2canvas: librariesCache.html2canvas,
      jsPDF: librariesCache.jspdf
    };
  }
  if (librariesCache.isLoading) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!librariesCache.isLoading && librariesCache.html2canvas && librariesCache.jspdf) {
          clearInterval(checkInterval);
          resolve({
            html2canvas: librariesCache.html2canvas,
            jsPDF: librariesCache.jspdf
          });
        }
      }, 100);
    });
  }
  librariesCache.isLoading = true;
  try {
    notifyProgress({ phase: "loading", progress: 0, message: "Preparando bibliotecas PDF..." });
    notifyProgress({ phase: "loading", progress: 25, message: "Carregando html2canvas..." });
    const html2canvasModule = await import("html2canvas");
    notifyProgress({ phase: "loading", progress: 75, message: "Carregando jsPDF..." });
    const jsPDFModule = await import("jspdf");
    librariesCache.html2canvas = html2canvasModule.default;
    librariesCache.jspdf = jsPDFModule.default;
    notifyProgress({ phase: "complete", progress: 100, message: "Bibliotecas PDF carregadas!" });
    console.log("✅ PDF Worker: Libraries loaded and cached successfully");
    return {
      html2canvas: librariesCache.html2canvas,
      jsPDF: librariesCache.jspdf
    };
  } catch (error) {
    console.error("❌ PDF Worker: Failed to load libraries:", error);
    notifyProgress({ phase: "error", progress: 0, message: "Erro ao carregar bibliotecas PDF" });
    throw new Error(`Falha ao carregar bibliotecas PDF: ${error.message}`);
  } finally {
    librariesCache.isLoading = false;
  }
};
const generatePDF = async (element, filename = "documento.pdf", options = {}) => {
  if (!element) {
    throw new Error("Elemento DOM é obrigatório para geração do PDF");
  }
  try {
    notifyProgress({ phase: "start", progress: 0, message: "Iniciando geração de PDF..." });
    const { html2canvas, jsPDF } = await loadPDFLibraries();
    notifyProgress({ phase: "capture", progress: 20, message: "Capturando conteúdo da página..." });
    const canvasOptions = {
      height: element.scrollHeight,
      width: element.scrollWidth,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#f9fafb",
      logging: false,
      ...options.canvas
    };
    const canvas = await html2canvas(element, canvasOptions);
    notifyProgress({ phase: "processing", progress: 60, message: "Processando imagem..." });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    notifyProgress({ phase: "generating", progress: 80, message: "Gerando arquivo PDF..." });
    if (imgHeight > pageHeight - 20) {
      const scaledHeight = pageHeight - 20;
      const scaledWidth = canvas.width * scaledHeight / canvas.height;
      pdf.addImage(imgData, "PNG", (pageWidth - scaledWidth) / 2, 10, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
    }
    notifyProgress({ phase: "saving", progress: 95, message: "Salvando arquivo..." });
    pdf.save(filename);
    notifyProgress({ phase: "complete", progress: 100, message: "PDF gerado com sucesso!" });
    console.log("✅ PDF Worker: PDF generated successfully:", filename);
  } catch (error) {
    console.error("❌ PDF Worker: PDF generation failed:", error);
    notifyProgress({ phase: "error", progress: 0, message: "Erro ao gerar PDF" });
    const userMessage = error.message.includes("bibliotecas PDF") ? "Não foi possível carregar as ferramentas necessárias. Verifique sua conexão e tente novamente." : "Erro ao gerar PDF. Tente novamente.";
    throw new Error(userMessage);
  }
};
class DOMErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    const isDOMError = error.message && (error.message.includes("removeChild") || error.message.includes("insertBefore") || error.message.includes("appendChild") || error.message.includes("Node"));
    if (isDOMError) {
      return { hasError: true, error };
    }
    throw error;
  }
  componentDidCatch(error, errorInfo) {
    var _a;
    console.warn("🔧 DOM Error Boundary caught:", error.message);
    console.warn("🔧 Error Details:", errorInfo);
    console.warn("🔧 React Version: 19.1.0, Framer Motion: 12.23.12");
    if (typeof ((_a = analytics) == null ? void 0 : _a.trackError) === "function") {
      analytics.trackError(`React19_DOM_Error: ${error.message}`, "DOM_BOUNDARY");
    }
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx("div", { className: this.props.className || "", children: this.props.fallbackChildren || this.props.children });
    }
    return this.props.children;
  }
}
const BarChart = ({ data }) => {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.map((item, index) => /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, delay: 0.1 * index },
      className: "space-y-2",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 capitalize", children: item.area === "gestao" ? "Gestão" : item.area === "educacao" ? "Educação" : item.area === "comunicacao" ? "Comunicação" : item.area === "logica" ? "Lógica" : item.area }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-gray-600", children: [
            item.score,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: /* @__PURE__ */ jsx(
          motion.div,
          {
            className: `h-3 rounded-full ${index === 0 ? "bg-[#d400ff]" : index === 1 ? "bg-purple-400" : index === 2 ? "bg-blue-400" : "bg-gray-400"}`,
            initial: { width: 0 },
            animate: { width: `${item.score}%` },
            transition: { duration: 1, delay: 0.3 + index * 0.1 }
          }
        ) })
      ]
    },
    item.area
  )) });
};
const RadarChart = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = Math.PI * 2 / data.length;
  const points = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const value = item.value / 100;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return { x, y, label: item.label, value: item.value, color: item.color };
  });
  const maxPoints = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y };
  });
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "drop-shadow-lg", children: [
      [0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => /* @__PURE__ */ jsx(
        "circle",
        {
          cx: center,
          cy: center,
          r: radius * scale,
          fill: "none",
          stroke: "#e5e7eb",
          strokeWidth: "1",
          opacity: 0.3
        },
        i
      )),
      maxPoints.map((point, index) => /* @__PURE__ */ jsx(
        "line",
        {
          x1: center,
          y1: center,
          x2: point.x,
          y2: point.y,
          stroke: "#e5e7eb",
          strokeWidth: "1",
          opacity: 0.3
        },
        index
      )),
      /* @__PURE__ */ jsx(
        motion.polygon,
        {
          points: points.map((p) => `${p.x},${p.y}`).join(" "),
          fill: "rgba(212, 0, 255, 0.2)",
          stroke: "#d400ff",
          strokeWidth: "2",
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 1, delay: 0.5 }
        }
      ),
      points.map((point, index) => /* @__PURE__ */ jsx(
        motion.circle,
        {
          cx: point.x,
          cy: point.y,
          r: "4",
          fill: point.color,
          stroke: "white",
          strokeWidth: "2",
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.5, delay: 0.7 + index * 0.1 }
        },
        index
      ))
    ] }),
    data.map((item, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const labelRadius = radius + 25;
      const x = center + Math.cos(angle) * labelRadius;
      const y = center + Math.sin(angle) * labelRadius;
      return /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "absolute text-xs font-semibold text-gray-700 text-center",
          style: {
            left: x - 30,
            top: y - 10,
            width: 60
          },
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay: 1 + index * 0.1 },
          children: [
            /* @__PURE__ */ jsx("div", { className: `text-${item.color.replace("#", "")}`, children: item.label }),
            /* @__PURE__ */ jsxs("div", { className: "text-gray-600 font-bold", children: [
              item.value,
              "%"
            ] })
          ]
        },
        index
      );
    })
  ] });
};
const allQuestions = [
  {
    id: 1,
    section: "Valores Profissionais",
    question: "Se você pudesse criar algo incrível, o que seria?",
    answers: [
      { text: "Um aplicativo ou programa de computador que resolve um problema difícil.", scores: { tecnologia: 3, logica: 2, criatividade: 1 } },
      { text: "Um projeto para ajudar as pessoas da sua escola ou bairro.", scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Um novo negócio ou um time para competir em algo que você gosta.", scores: { gestao: 3, comunicacao: 2, marketing: 1 } },
      { text: "Um desenho, uma música ou um vídeo que todo mundo achasse muito legal.", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Um jeito de organizar informações para que todos entendam um assunto complicado.", scores: { logica: 3, tecnologia: 2, gestao: 1 } }
    ]
  },
  {
    id: 2,
    section: "Valores Profissionais",
    question: "Onde você se sentiria mais à vontade passando a maior parte do seu dia?",
    answers: [
      { text: "Num lugar cheio de computadores e tecnologia de ponta, descobrindo como as coisas funcionam.", scores: { tecnologia: 3, logica: 2, design: 1, comunicacao: -1 } },
      { text: "Conversando e interagindo com muitas pessoas diferentes, ajudando e trocando ideias.", scores: { educacao: 3, comunicacao: 3, marketing: 1, tecnologia: -1 } },
      { text: "Em reuniões, planejando os próximos passos de um projeto e apresentando ideias.", scores: { gestao: 3, marketing: 2, comunicacao: 2, criatividade: -1 } },
      { text: "Em um espaço criativo, com liberdade para desenhar, criar e testar coisas novas.", scores: { design: 3, criatividade: 3, marketing: 1, logica: -1 } },
      { text: "Em um lugar organizado, onde tudo tem um passo a passo claro para ser feito.", scores: { logica: 3, gestao: 2, tecnologia: 1, criatividade: -1 } }
    ]
  },
  {
    id: 3,
    section: "Valores Profissionais",
    question: "O que te deixa mais animado e com vontade de continuar fazendo?",
    answers: [
      { text: "Encontrar a resposta para um desafio muito difícil, como um jogo de quebra-cabeça.", scores: { logica: 3, tecnologia: 2, criatividade: 1 } },
      { text: "Bater papo com a galera, trocar ideias e sentir que está conectado com as pessoas.", scores: { comunicacao: 3, educacao: 2, marketing: 1 } },
      { text: "Ver uma ideia sua saindo do papel e se transformando em algo real.", scores: { design: 3, criatividade: 3, tecnologia: 1 } },
      { text: "Encontrar um jeito mais fácil ou mais rápido de fazer uma tarefa que antes era demorada.", scores: { gestao: 3, logica: 2, tecnologia: 1 } },
      { text: "Aprender uma coisa nova e sentir que você está ficando cada vez melhor naquilo.", scores: { educacao: 2, tecnologia: 2, criatividade: 2 } }
    ]
  },
  {
    id: 4,
    section: "Valores Profissionais",
    question: 'Para você, o que seria "mandar muito bem" no futuro?',
    answers: [
      { text: "Criar uma tecnologia que mude o jeito como as pessoas vivem.", scores: { tecnologia: 3, logica: 2, criatividade: 2 } },
      { text: "Ser alguém que ensina coisas importantes e inspira outras pessoas.", scores: { educacao: 3, comunicacao: 3, gestao: 1 } },
      { text: "Ser o líder de um grande projeto ou ter sua própria empresa de sucesso.", scores: { gestao: 3, marketing: 3, comunicacao: 2 } },
      { text: "Ter seus desenhos, vídeos ou criações conhecidos e admirados por muita gente.", scores: { design: 3, criatividade: 3, marketing: 2 } },
      { text: "Ser a pessoa que mais entende de um assunto, a quem todos pedem ajuda.", scores: { tecnologia: 2, logica: 3, educacao: 1 } }
    ]
  },
  {
    id: 5,
    section: "Valores Profissionais",
    question: "Pelo que você gostaria de ser lembrado?",
    answers: [
      { text: "Por ter criado ferramentas que facilitaram a vida de todo mundo.", scores: { tecnologia: 3, logica: 2, gestao: 1 } },
      { text: "Por ter ajudado muitas pessoas a aprenderem e a crescerem.", scores: { educacao: 3, comunicacao: 2, gestao: 2 } },
      { text: "Por ter organizado projetos que funcionaram muito bem e deram ótimos resultados.", scores: { gestao: 3, logica: 2, comunicacao: 1 } },
      { text: "Por ter deixado o mundo mais bonito e interessante com suas criações.", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Por ter criado uma marca ou produto que milhões de pessoas conhecem e gostam.", scores: { marketing: 3, comunicacao: 2, design: 2 } }
    ]
  },
  {
    id: 6,
    section: "Interesses Profissionais",
    question: "No seu tempo livre, o que você mais gosta de fazer?",
    answers: [
      { text: "Mexer no computador, no celular ou tentar entender como um aparelho funciona.", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Participar de grupos, projetos sociais ou atividades que ajudem os outros.", scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Organizar o rolê com os amigos, planejando o que cada um vai fazer.", scores: { gestao: 3, comunicacao: 2, marketing: 2 } },
      { text: "Desenhar, tirar fotos, editar vídeos ou criar posts legais para a internet.", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Organizar suas músicas em playlists, seus jogos por categoria ou fazer listas de filmes.", scores: { logica: 3, gestao: 2, tecnologia: 1 } }
    ]
  },
  {
    id: 7,
    section: "Interesses Profissionais",
    question: "Se você estivesse num jogo, que tipo de missão você escolheria?",
    answers: [
      { text: "Uma missão de criar um código ou um sistema para destravar a próxima fase.", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Uma missão de ensinar um truque novo para outros jogadores para que o time vença.", scores: { educacao: 3, comunicacao: 3, gestao: 1 } },
      { text: "Uma missão de convencer outros times a se aliarem ao seu para ganhar o jogo.", scores: { marketing: 3, comunicacao: 3, gestao: 2 } },
      { text: "Uma missão de criar o visual do seu personagem ou do seu time para que seja o mais legal de todos.", scores: { design: 3, criatividade: 3, marketing: 2 } },
      { text: "Uma missão de analisar o mapa e os dados do jogo para descobrir o melhor caminho para a vitória.", scores: { logica: 3, tecnologia: 2, gestao: 1 } }
    ]
  },
  {
    id: 8,
    section: "Interesses Profissionais",
    question: "Qual destas coisas você faria por horas, até esquecer do tempo?",
    answers: [
      { text: "Tentar resolver um problema num jogo ou programa de computador.", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Explicar para um amigo um assunto que você domina e ele tem dificuldade.", scores: { educacao: 3, comunicacao: 2, design: 1 } },
      { text: "Pensar em jeitos de divulgar algo legal, como uma festa ou um canal na internet.", scores: { marketing: 3, gestao: 2, comunicacao: 2 } },
      { text: "Editando fotos, criando um desenho no computador ou montando um vídeo.", scores: { design: 3, criatividade: 3, tecnologia: 1 } },
      { text: "Arrumando e organizando algo (seu quarto, seus arquivos, suas figurinhas) para ficar perfeito.", scores: { logica: 3, gestao: 3, tecnologia: 2 } }
    ]
  },
  {
    id: 9,
    section: "Habilidades e Aptidões",
    question: "Num trabalho em grupo da escola, o que você geralmente faz?",
    answers: [
      { text: "Pego os dados e as informações da pesquisa para organizar e ver o que significam.", scores: { logica: 3, gestao: 2, tecnologia: 1 } },
      { text: "Cuido da parte visual, fazendo os slides da apresentação ficarem bonitos e claros.", scores: { design: 3, comunicacao: 2, criatividade: 2 } },
      { text: "Se o computador ou algum programa dá problema, eu sou a pessoa que tenta resolver.", scores: { tecnologia: 3, logica: 2, criatividade: 1 } },
      { text: "Escrevo o roteiro do que vamos falar para convencer o professor e a turma da nossa ideia.", scores: { marketing: 3, comunicacao: 3, educacao: 1 } },
      { text: "Ajudo a organizar quem faz o quê e a garantir que todos entreguem a sua parte a tempo.", scores: { gestao: 3, comunicacao: 2, educacao: 1 } }
    ]
  },
  {
    id: 10,
    section: "Habilidades e Aptidões",
    question: "Qual o seu jeito preferido de aprender algo novo?",
    answers: [
      { text: "Ler tudo sobre o assunto para entender a lógica por trás daquilo.", scores: { logica: 3, educacao: 2, tecnologia: 1, criatividade: -1 } },
      { text: "Ir direto para a prática, testando e descobrindo como funciona na hora.", scores: { tecnologia: 2, criatividade: 3, design: 2, logica: -1 } },
      { text: "Conversar com outras pessoas que entendem do assunto e trocar ideias.", scores: { comunicacao: 3, educacao: 2, gestao: 1, tecnologia: -1 } },
      { text: "Assistir a vídeos ou ver imagens que mostrem como fazer.", scores: { design: 2, marketing: 2, criatividade: 2, logica: -1 } },
      { text: "Fazer um resumo ou um esquema com os pontos mais importantes para não esquecer.", scores: { logica: 3, gestao: 2, educacao: 1, criatividade: -1 } }
    ]
  },
  {
    id: 11,
    section: "Habilidades e Aptidões",
    question: "Em um projeto em grupo, qual é o seu papel natural?",
    answers: [
      { text: "O líder, que organiza as tarefas e mantém o time focado.", scores: { gestao: 3, comunicacao: 2, educacao: 1 } },
      { text: 'O "nerd", que cuida da parte mais técnica e resolve os problemas.', scores: { tecnologia: 3, logica: 2, design: 1 } },
      { text: 'O "artista", que cuida do visual e deixa tudo mais bonito e apresentável.', scores: { design: 3, criatividade: 2, marketing: 2 } },
      { text: 'O "pesquisador", que busca as informações e ajuda a entender o tema.', scores: { logica: 2, educacao: 3, comunicacao: 1 } },
      { text: 'O "divulgador", que conta para todo mundo sobre o projeto e anima a galera.', scores: { marketing: 3, comunicacao: 3, gestao: 1 } }
    ]
  },
  {
    id: 12,
    section: "Realizações Pessoais",
    question: "O que te deixaria mais orgulhoso de ter feito?",
    answers: [
      { text: "Ter criado um aplicativo que milhões de pessoas usam todos os dias.", scores: { tecnologia: 3, criatividade: 2, marketing: 1 } },
      { text: 'Encontrar pessoas que dissessem: "Aprendi muito com você!".', scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Ter liderado um time que criou algo incrível e muito bem-sucedido.", scores: { gestao: 3, marketing: 2, comunicacao: 2 } },
      { text: "Ver um desenho ou um vídeo seu famoso no mundo todo.", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Ser conhecido por ter resolvido um problema que ninguém mais conseguia.", scores: { logica: 3, tecnologia: 2, criatividade: 1 } }
    ]
  },
  {
    id: 13,
    section: "Comportamento sob Pressão",
    question: "Quando você tem um prazo apertado para entregar algo, o que você faz?",
    answers: [
      { text: "Crio um plano e uma lista de tarefas para não me perder.", scores: { gestao: 3, logica: 2, tecnologia: 1 } },
      { text: "Foco totalmente em encontrar a solução mais rápida para o problema principal.", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Penso em uma ideia diferente ou um jeito novo de fazer as coisas para surpreender.", scores: { criatividade: 3, design: 2, marketing: 1 } },
      { text: "Chamo a galera para conversar e alinhar o que cada um precisa fazer.", scores: { comunicacao: 3, gestao: 2, educacao: 1 } },
      { text: "Paro para analisar a situação e pensar no melhor caminho antes de sair fazendo.", scores: { logica: 3, gestao: 2, tecnologia: 1 } }
    ]
  },
  {
    id: 14,
    section: "Interesses Digitais",
    question: "Na internet (YouTube, TikTok, etc.), que tipo de conteúdo você mais gosta de assistir?",
    answers: [
      { text: "Vídeos explicando como a tecnologia funciona, tutoriais de programação ou reviews detalhados de eletrônicos.", scores: { tecnologia: 3, logica: 3, educacao: 1 } },
      { text: "Canais de arte, tutoriais de desenho/edição de vídeo ou perfis com fotos e visuais muito criativos.", scores: { design: 3, criatividade: 3, comunicacao: 1 } },
      { text: "Vídeos de reviews de produtos, análise de propagandas ou pessoas que são muito boas em convencer os outros sobre uma ideia.", scores: { marketing: 3, comunicacao: 3, gestao: 1 } },
      { text: "Documentários, canais de curiosidades ou vídeos que ensinam algo novo sobre ciência, história ou qualquer outro assunto.", scores: { educacao: 3, comunicacao: 2, logica: 2 } },
      { text: "Vídeos sobre como ser mais produtivo, dicas de organização, ou histórias de como empresas de sucesso começaram.", scores: { gestao: 3, logica: 2, marketing: 1 } }
    ]
  },
  {
    id: 15,
    section: "Iniciativa e Planejamento",
    question: "Você tem uma ideia incrível para um projeto (um canal, um app, um evento). Qual é a sua primeira reação?",
    answers: [
      { text: "Escrever um plano com todos os passos, do começo ao fim, para não me perder.", scores: { logica: 3, gestao: 3, tecnologia: 1 } },
      { text: "Chamar meus amigos mais próximos para contar a ideia, ouvir opiniões e ver quem topa participar.", scores: { comunicacao: 3, marketing: 2, gestao: 2 } },
      { text: "Fazer um rascunho, um desenho ou um modelo de como a ideia vai parecer visualmente.", scores: { criatividade: 3, design: 3, tecnologia: 1 } },
      { text: "Começar a pesquisar e testar as ferramentas ou os programas que eu precisaria para colocar a ideia em prática.", scores: { tecnologia: 3, logica: 2, criatividade: 1 } },
      { text: "Começar a estudar tudo sobre o assunto para ter certeza de que sei o suficiente antes de dar o primeiro passo.", scores: { educacao: 3, logica: 2, comunicacao: 1 } }
    ]
  }
];
const courses = [
  {
    id: "informatica",
    name: "Informática",
    subtitle: "Windows 11 + Office + Ambientes Digitais + IA",
    description: "Curso completo de informática com Windows 11, Office, ambientes digitais, Canva e IA aplicada",
    duration: "184,5h",
    price: "Consulte valores",
    areas: ["educacao", "gestao", "comunicacao", "tecnologia"],
    icon: BookOpen,
    image: "keys/curso-informatica?prompt=Professional computer workspace with Office applications"
  },
  {
    id: "design-grafico",
    name: "Design Gráfico",
    subtitle: "Photoshop + Illustrator + InDesign + Canva + CorelDRAW",
    description: "Domine Photoshop, Illustrator, InDesign, Canva e CorelDRAW para criar designs profissionais",
    duration: "90h",
    price: "Consulte valores",
    areas: ["design", "criatividade", "marketing"],
    icon: Palette,
    image: "keys/curso-design?prompt=Graphic design workspace with creative tools and colorful designs"
  },
  {
    id: "programacao",
    name: "Programação",
    subtitle: "Lógica + Python + Java + PHP + Android + IA",
    description: "Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e Cursor com IA",
    duration: "118h",
    price: "Consulte valores",
    areas: ["tecnologia", "logica", "gestao"],
    icon: Code,
    image: "keys/curso-programacao?prompt=Modern programming workspace with code on multiple monitors"
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital",
    subtitle: "Estratégias Digitais + Redes Sociais + Ads",
    description: "Estratégias completas de marketing digital para vender online",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["marketing", "comunicacao", "gestao"],
    icon: TrendUp,
    image: "keys/curso-marketing?prompt=Digital marketing dashboard with social media analytics and charts"
  },
  {
    id: "inteligencia-artificial",
    name: "Inteligência Artificial",
    subtitle: "IA + Machine Learning + Aplicações Práticas",
    description: "Domine inteligência artificial e suas aplicações no mercado de trabalho",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["tecnologia", "logica", "criatividade"],
    icon: Brain,
    image: "keys/curso-ia?prompt=AI workspace with machine learning and data analysis"
  },
  {
    id: "business-intelligence",
    name: "Business Intelligence",
    subtitle: "Power BI + Análise de Dados + Dashboard",
    description: "Análise de dados e criação de dashboards profissionais",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["gestao", "logica", "tecnologia"],
    icon: ChartBar,
    image: "keys/curso-bi?prompt=Business intelligence dashboard with charts and data analysis"
  },
  {
    id: "projetista-3d",
    name: "Projetista 3D Completo",
    subtitle: "SketchUp + Enscape + V-Ray + IA",
    description: "Crie projetos 3D profissionais com renderizações fotorrealísticas",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["design", "tecnologia", "criatividade"],
    icon: Camera,
    image: "keys/curso-sketchup?prompt=3D architectural rendering modern house SketchUp professional"
  },
  {
    id: "edicao-video",
    name: "Edição de Vídeo",
    subtitle: "Premier + After Effects + Criação de Conteúdo",
    description: "Edição profissional de vídeos para redes sociais e mercado audiovisual",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["design", "criatividade", "marketing"],
    icon: Pulse,
    image: "keys/curso-video?prompt=Video editing workspace with timeline and effects"
  },
  {
    id: "administracao",
    name: "Administração",
    subtitle: "Gestão + Liderança + RH + Projetos",
    description: "Desenvolva habilidades de liderança, gestão e administração empresarial",
    duration: "Consulte",
    price: "Consulte valores",
    areas: ["gestao", "comunicacao", "educacao"],
    icon: Users,
    image: "keys/curso-gestao?prompt=Business leadership meeting with charts and professional team"
  }
];
const Hero = () => {
  return /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: [...Array(30)].map((_, i) => /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute w-2 h-2 bg-white rounded-full opacity-20",
        style: {
          left: `${(i * 37 + 13) % 100}%`,
          top: `${(i * 23 + 7) % 100}%`
        },
        animate: {
          y: [0, -20, 0],
          opacity: [0.2, 0.8, 0.2]
        },
        transition: {
          duration: 3 + i % 5 * 0.4,
          repeat: Infinity,
          delay: i * 0.1
        }
      },
      i
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-4 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8 },
          className: "mb-8",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-6", children: [
              /* @__PURE__ */ jsx(Brain, { className: "text-[#d400ff]", size: 32 }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-semibold text-lg", children: "Teste Vocacional Inteligente" })
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-7xl font-bold text-white mb-6", children: [
              "Descubra seu ",
              /* @__PURE__ */ jsx("span", { className: "text-[#d400ff]", children: "Curso Ideal" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto", children: [
              "Em apenas 15 perguntas científicas, descubra o curso da Escola Habilidade que mais combina com você. ",
              /* @__PURE__ */ jsx("strong", { className: "text-[#d400ff]", children: "Metodologia inspirada no MIT, Harvard e Stanford" }),
              " — disponível para toda a ",
              /* @__PURE__ */ jsx("span", { className: "text-[#d400ff] font-semibold", children: "Grande Florianópolis" }),
              "."
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 text-gray-300 mb-8", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Clock, { size: 16, className: "text-[#d400ff]" }),
                "Apenas 5 minutos"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Target, { size: 16, className: "text-[#d400ff]" }),
                "100% personalizado"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Trophy, { size: 16, className: "text-[#d400ff]" }),
                "Resultado profissional"
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "text-center mb-8",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-gradient-to-r from-purple-100/20 to-blue-100/20 px-6 py-3 rounded-full mb-6", children: [
                    /* @__PURE__ */ jsx(Trophy, { className: "text-[#d400ff]", size: 20 }),
                    /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm uppercase tracking-wide", children: "Metodologia MIT • Harvard • Stanford" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto", children: [
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(User, { className: "text-[#d400ff]", size: 24 }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold text-base mb-1", children: "1. Responda" }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "15 perguntas científicas baseadas no modelo VIPS" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Pulse, { className: "text-[#d400ff]", size: 24 }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold text-base mb-1", children: "2. Analisamos" }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Análise baseada no modelo Holland RIASEC" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Target, { className: "text-[#d400ff]", size: 24 }) }),
                      /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold text-base mb-1", children: "3. Recomendamos" }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Cursos personalizados com base no seu resultado" })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                onClick: () => {
                  const event = new CustomEvent("startVocationalTest");
                  window.dispatchEvent(event);
                },
                className: "bg-gradient-to-r from-[#ff00ff] to-[#d400ff] text-white px-12 py-6 rounded-full font-bold text-xl hover:from-purple-600 hover:to-[#d400ff] transition-all duration-300 inline-flex items-center gap-3 shadow-lg",
                whileHover: {
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(212, 0, 255, 0.5)"
                },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx(Brain, { size: 24 }),
                  "Iniciar Teste Vocacional",
                  /* @__PURE__ */ jsx(CaretRight, { size: 20 })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "grid md:grid-cols-3 gap-8 max-w-4xl mx-auto",
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.5 }
        }
      )
    ] })
  ] });
};
const VocationalTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const handleAnswer = (answerIndex, scores) => {
    var _a, _b;
    const question2 = allQuestions[currentQuestion];
    const answer = question2.answers[answerIndex];
    analytics.trackQuestionAnswered(
      currentQuestion + 1,
      question2.question,
      answer.text
    );
    const newAnswers = {
      ...answers,
      [currentQuestion]: { answerIndex, scores }
    };
    setAnswers(newAnswers);
    if (currentQuestion < allQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        analytics.trackTestProgress(currentQuestion + 2, allQuestions.length);
      }, 300);
    } else {
      setIsCompleted(true);
      const results = calculateResults(newAnswers);
      const timeSpent = analytics.measureTestDuration.end();
      const primaryArea = ((_a = results[0]) == null ? void 0 : _a.area) || "não identificado";
      const secondaryArea = ((_b = results[1]) == null ? void 0 : _b.area) || "não identificado";
      analytics.trackTestCompleted(
        { primaryArea, secondaryArea },
        timeSpent
      );
      setTimeout(() => {
        onComplete(results);
      }, 300);
    }
  };
  const calculateResults = (allAnswers) => {
    const totals = {
      tecnologia: 0,
      design: 0,
      marketing: 0,
      gestao: 0,
      educacao: 0,
      criatividade: 0,
      comunicacao: 0,
      logica: 0
    };
    Object.values(allAnswers).forEach((answer) => {
      Object.entries(answer.scores).forEach(([area, score]) => {
        totals[area] += score;
      });
    });
    const adjustedTotals = {};
    const minScore = Math.min(...Object.values(totals));
    const adjustment = minScore < 0 ? Math.abs(minScore) : 0;
    Object.entries(totals).forEach(([area, score]) => {
      adjustedTotals[area] = score + adjustment;
    });
    const maxScore = Math.max(...Object.values(adjustedTotals));
    const normalizedResults = Object.entries(adjustedTotals).map(([area, score]) => ({
      area,
      score: maxScore > 0 ? Math.round(score / maxScore * 100) : 0
    }));
    return normalizedResults;
  };
  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  if (isCompleted) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Check, { className: "text-white", size: 40 }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Teste Concluído!" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Analisando seus resultados e preparando suas recomendações..." }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#d400ff]" }) })
        ]
      }
    ) });
  }
  const progress = (currentQuestion + 1) / allQuestions.length * 100;
  const question = allQuestions[currentQuestion];
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Pergunta ",
          currentQuestion + 1,
          " de ",
          allQuestions.length
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          Math.round(progress),
          "% completo"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "bg-[#d400ff] h-2 rounded-full",
          initial: { width: 0 },
          animate: { width: `${progress}%` },
          transition: { duration: 0.6, ease: "easeOut" }
        },
        "progress-bar-animation"
      ) })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4 },
        className: "text-center mb-8",
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold text-gray-900 mb-8", children: question.question }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 max-w-2xl mx-auto", children: question.answers.map((answer, index) => /* @__PURE__ */ jsx(
            motion.button,
            {
              onClick: () => handleAnswer(index, answer.scores),
              className: "p-6 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-[#d400ff] hover:bg-purple-50 transition-all duration-300",
              whileHover: { scale: 1.02, y: -2 },
              whileTap: { scale: 0.98 },
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3, delay: index * 0.1 },
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-800 font-medium", children: answer.text }),
                /* @__PURE__ */ jsx(CaretRight, { className: "text-[#d400ff] opacity-0 group-hover:opacity-100 transition-opacity", size: 20 })
              ] })
            },
            index
          )) }),
          currentQuestion > 0 && /* @__PURE__ */ jsxs(
            motion.button,
            {
              onClick: goBack,
              className: "mt-8 text-gray-600 hover:text-[#d400ff] inline-flex items-center gap-2",
              whileHover: { x: -2 },
              children: [
                /* @__PURE__ */ jsx(CaretLeft, { size: 16 }),
                "Voltar"
              ]
            }
          )
        ]
      },
      `question-${currentQuestion}`
    )
  ] }, "vocational-test-container");
};
const ResultsDashboard = ({ results, onRestart }) => {
  var _a, _b, _c, _d, _e, _f;
  const [showCourses, setShowCourses] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ phase: "", progress: 0, message: "" });
  const resultsRef = useRef(null);
  const pdfContentRef = useRef(null);
  useEffect(() => {
    const unsubscribe = onLoadProgress((progress) => {
      setPdfProgress(progress);
    });
    return unsubscribe;
  }, []);
  const radarData = [
    { label: "Tecnologia", value: ((_a = results.find((r) => r.area === "tecnologia")) == null ? void 0 : _a.score) || 0, color: "#3b82f6" },
    { label: "Design", value: ((_b = results.find((r) => r.area === "design")) == null ? void 0 : _b.score) || 0, color: "#f59e0b" },
    { label: "Marketing", value: ((_c = results.find((r) => r.area === "marketing")) == null ? void 0 : _c.score) || 0, color: "#10b981" },
    { label: "Gestão", value: ((_d = results.find((r) => r.area === "gestao")) == null ? void 0 : _d.score) || 0, color: "#8b5cf6" },
    { label: "Educação", value: ((_e = results.find((r) => r.area === "educacao")) == null ? void 0 : _e.score) || 0, color: "#f97316" },
    { label: "Criatividade", value: ((_f = results.find((r) => r.area === "criatividade")) == null ? void 0 : _f.score) || 0, color: "#ec4899" }
  ];
  const dominantArea = results.reduce(
    (prev, current) => prev.score > current.score ? prev : current
  );
  const calculateCourseCompatibility = (course, userResults) => {
    const topAreas = userResults.sort((a, b) => b.score - a.score).slice(0, 3);
    let compatibilityScore = 0;
    topAreas.forEach((userArea, index) => {
      if (course.areas.includes(userArea.area)) {
        const weight = 3 - index;
        compatibilityScore += weight;
      }
    });
    return {
      ...course,
      compatibilityScore,
      compatibilityPercentage: Math.round(compatibilityScore / 6 * 100)
      // Máximo possível: 6 pontos
    };
  };
  const recommendedCourses = courses.map((course) => calculateCourseCompatibility(course, results)).filter((course) => course.compatibilityScore > 0).sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 3);
  const getPersonalizedMessage = (results2) => {
    const topAreas = results2.sort((a, b) => b.score - a.score).slice(0, 3);
    const [first, second, third] = topAreas;
    const combinedProfiles = {
      // Tecnologia + outras áreas
      "tecnologia-logica": "Você tem um perfil **Tecnológico-Analítico**! Combina habilidades técnicas com raciocínio lógico excepcional. É ideal para desenvolvimento de software, programação de sistemas complexos, análise de dados e inteligência artificial.",
      "tecnologia-criatividade": "Seu perfil é **Tecnológico-Criativo**! Une conhecimento técnico com pensamento inovador. Perfeito para design de interfaces, desenvolvimento de games, soluções criativas em tech e projetos que exigem tanto código quanto criatividade.",
      "tecnologia-design": "Você é **Tecnológico-Visual**! Combina programação com senso estético. Ideal para desenvolvimento front-end, UX/UI design, criação de aplicativos visuais e projetos que unem código e design.",
      // Design + outras áreas
      "design-marketing": "Seu perfil é **Criativo-Estratégico**! Combina talento visual com visão comercial. Excelente para marketing digital, gestão de redes sociais, criação de campanhas visuais e branding que realmente vendem.",
      "design-comunicacao": "Você tem perfil **Visual-Comunicativo**! Une criação visual com habilidades de comunicação. Perfeito para produção de conteúdo, design editorial, apresentações impactantes e comunicação visual.",
      // Marketing + outras áreas
      "marketing-gestao": "Seu perfil é **Comercial-Estratégico**! Combina visão de negócios com liderança. Ideal para gestão comercial, empreendedorismo, desenvolvimento de negócios e liderança de equipes comerciais.",
      "marketing-comunicacao": "Você é **Comunicativo-Persuasivo**! Excellence em comunicação e persuasão. Perfeito para vendas, marketing digital, relações públicas e qualquer área que exija convencer e engajar pessoas.",
      // Gestão + outras áreas
      "gestao-logica": "Seu perfil é **Gerencial-Analítico**! Combina liderança com análise sistemática. Ideal para gestão de projetos, business intelligence, consultoria empresarial e cargos que exigem decisões baseadas em dados.",
      "gestao-educacao": "Você tem perfil **Líder-Educador**! Une capacidade de gestão com desenvolvimento de pessoas. Excelente para gestão de recursos humanos, treinamentos corporativos e liderança de equipes.",
      // Educação + outras áreas
      "educacao-comunicacao": "Seu perfil é **Educativo-Comunicativo**! Combina ensino com excelente comunicação. Perfeito para treinamentos, palestras, criação de conteúdo educativo e qualquer área que envolva transmitir conhecimento.",
      // Lógica + outras áreas
      "logica-gestao": "Você é **Analítico-Organizacional**! Combina raciocínio lógico com visão de processos. Ideal para análise de dados, otimização de processos, business intelligence e consultoria analítica."
    };
    const profileKey = `${first.area}-${second.area}`;
    if (combinedProfiles[profileKey]) {
      return combinedProfiles[profileKey];
    }
    const singleAreaMessages = {
      tecnologia: `Você tem um **perfil técnico e analítico** com forte afinidade por ${second.area === "logica" ? "raciocínio lógico" : second.area === "design" ? "criação visual" : second.area === "criatividade" ? "inovação" : second.area}. Adora resolver problemas complexos usando tecnologia e criar soluções que realmente funcionam.`,
      design: `Sua **criatividade é seu grande diferencial**, combinada com ${second.area === "marketing" ? "visão comercial" : second.area === "comunicacao" ? "habilidades de comunicação" : second.area === "tecnologia" ? "conhecimento técnico" : second.area}. Você tem olhar estético apurado e transforma ideias em realidade visual.`,
      marketing: `Você é um **comunicador nato com visão estratégica**, especialmente forte em ${second.area === "comunicacao" ? "persuasão" : second.area === "gestao" ? "liderança" : second.area === "design" ? "comunicação visual" : second.area}. Entende como conectar pessoas, produtos e ideias de forma eficaz.`,
      gestao: `**Líder por natureza**, com forte capacidade de ${second.area === "comunicacao" ? "comunicação" : second.area === "logica" ? "análise" : second.area === "marketing" ? "visão comercial" : second.area}. Tem facilidade para organizar, planejar e coordenar pessoas e projetos para alcançar resultados.`,
      educacao: `**Ensinar é sua vocação natural**, combinada com ${second.area === "comunicacao" ? "excelente comunicação" : second.area === "gestao" ? "capacidade organizacional" : second.area === "tecnologia" ? "conhecimento técnico" : second.area}. Tem paciência e satisfação em desenvolver outras pessoas.`,
      criatividade: `Sua **mente criativa é sua maior força**, especialmente quando aplicada à ${second.area === "design" ? "criação visual" : second.area === "tecnologia" ? "inovação técnica" : second.area === "marketing" ? "comunicação criativa" : second.area}. Pensa fora da caixa e encontra soluções únicas.`,
      comunicacao: `**Comunicação é seu talento natural**, potencializada por sua ${second.area === "marketing" ? "visão estratégica" : second.area === "educacao" ? "vocação para ensinar" : second.area === "gestao" ? "capacidade de liderança" : second.area}. Se expressa bem e consegue influenciar pessoas positivamente.`,
      logica: `**Raciocínio lógico é seu diferencial**, especialmente quando combinado com ${second.area === "tecnologia" ? "conhecimento técnico" : second.area === "gestao" ? "visão organizacional" : second.area === "educacao" ? "capacidade de ensinar" : second.area}. Resolve problemas complexos de forma sistemática e organizada.`
    };
    return singleAreaMessages[first.area] || "Você tem um **perfil único e diversificado** com múltiplas fortalezas profissionais!";
  };
  const generatePDF$1 = async () => {
    console.log("📄 TESTE VOCACIONAL: Starting PDF generation with PDF Worker");
    if (!pdfContentRef.current) {
      console.error("❌ PDF: pdfContentRef not found");
      return;
    }
    setIsGeneratingPDF(true);
    setPdfProgress({ phase: "start", progress: 0, message: "Iniciando..." });
    analytics.trackPDFDownloaded(dominantArea.area);
    try {
      const hoje = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR").replace(/\//g, "-");
      const filename = `Teste-Vocacional-Escola-Habilidade-${hoje}.pdf`;
      await generatePDF(pdfContentRef.current, filename);
      console.log("✅ PDF: Generated successfully using PDF Worker");
    } catch (error) {
      console.error("❌ PDF: Generation failed:", error);
      alert(error.message || "Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress({ phase: "", progress: 0, message: "" });
    }
  };
  const shareResults = async () => {
    const areaName = dominantArea.area === "gestao" ? "Gestão" : dominantArea.area === "educacao" ? "Educação" : dominantArea.area === "comunicacao" ? "Comunicação" : dominantArea.area === "logica" ? "Lógica" : dominantArea.area;
    const shareText = `🎯 Descobri meu perfil vocacional na Escola Habilidade!
    
📊 Meu perfil dominante: ${areaName} (${dominantArea.score}%)
${getPersonalizedMessage(results)}

✅ Resultado baseado em metodologia científica de MIT, Harvard e Stanford
📍 Cursos presenciais em Florianópolis, São José e Palhoça

Faça seu teste gratuito: https://escolahabilidade.com/teste-vocacional
#TesteVocacional #EscolaHabilidade #Florianópolis`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meu Resultado do Teste Vocacional - Escola Habilidade",
          text: shareText,
          url: "https://escolahabilidade.com/teste-vocacional"
        });
        analytics.trackResultShared("native_share");
      } catch (error) {
        if (error.name !== "AbortError") {
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };
  const fallbackShare = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Texto copiado! Cole em suas redes sociais para compartilhar 📋");
        analytics.trackResultShared("clipboard");
      }).catch(() => {
        openWhatsAppShare(text);
      });
    } else {
      openWhatsAppShare(text);
    }
  };
  const openWhatsAppShare = (text) => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
    analytics.trackResultShared("whatsapp");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCourses(true);
    }, 2e3);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const topAreas = results.sort((a, b) => b.score - a.score).slice(0, 3);
    const [first, second] = topAreas;
    const combinedProfiles = {
      "tecnologia-logica": "Tecnológico-Analítico",
      "tecnologia-criatividade": "Tecnológico-Criativo",
      "tecnologia-design": "Tecnológico-Visual",
      "design-marketing": "Criativo-Estratégico",
      "design-comunicacao": "Visual-Comunicativo",
      "marketing-gestao": "Comercial-Estratégico",
      "marketing-comunicacao": "Comunicativo-Persuasivo",
      "gestao-logica": "Gerencial-Analítico",
      "gestao-educacao": "Líder-Educador",
      "educacao-comunicacao": "Educativo-Comunicativo",
      "logica-gestao": "Analítico-Organizacional"
    };
    const profileKey = `${first.area}-${second.area}`;
    const profileType = combinedProfiles[profileKey] || `${first.area}-dominante`;
    analytics.trackCombinedProfile(topAreas, profileType);
    analytics.trackCourseCompatibility(recommendedCourses, {
      primaryArea: first.area,
      secondaryArea: second.area
    });
  }, [results, recommendedCourses]);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      ref: resultsRef,
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "max-w-6xl mx-auto",
      children: [
        /* @__PURE__ */ jsxs("div", { ref: pdfContentRef, children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.8, delay: 0.3 },
                className: "w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6",
                children: /* @__PURE__ */ jsx(Star, { className: "text-white", size: 40 })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsx(Trophy, { className: "text-[#d400ff]", size: 24 }),
              /* @__PURE__ */ jsx("span", { className: "text-sm uppercase tracking-wide text-gray-500 font-semibold", children: "Análise Científica MIT • Harvard • Stanford" })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Seu Perfil Vocacional Está Pronto! 🎉" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: [
              /* @__PURE__ */ jsx("strong", { children: "Baseado em metodologias validadas por 2+ milhões de estudantes:" }),
              /* @__PURE__ */ jsx("br", {}),
              getPersonalizedMessage(results)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 mb-12", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -50 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.8, delay: 0.5 },
                className: "bg-white rounded-2xl p-8 shadow-xl",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
                      /* @__PURE__ */ jsx(ChartPie, { className: "text-[#d400ff]", size: 20 }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wide text-gray-500 font-semibold", children: "Metodologia RIASEC - Stanford" })
                    ] }),
                    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Seu Perfil Profissional" }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Análise científica das suas afinidades por área" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(RadarChart, { data: radarData, size: 300 }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 50 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.8, delay: 0.7 },
                className: "bg-white rounded-2xl p-8 shadow-xl",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
                    /* @__PURE__ */ jsx(ChartBar, { className: "text-[#d400ff]", size: 20 }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wide text-gray-500 font-semibold", children: "Modelo VIPS - MIT" })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Análise Completa de Todas as Áreas" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Veja sua pontuação em todas as 8 áreas vocacionais analisadas" }),
                  /* @__PURE__ */ jsx(BarChart, { data: results.sort((a, b) => b.score - a.score) })
                ]
              }
            )
          ] }),
          showCourses && /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 50 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.8 },
              className: "bg-gradient-to-br from-[#d400ff] to-purple-600 rounded-2xl p-8 text-white mb-8",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsx(Trophy, { className: "text-white", size: 24 }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm uppercase tracking-wide text-purple-100 font-semibold", children: "Metodologia MIT • Harvard • Stanford" })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold mb-4", children: "Cursos Cientificamente Recomendados 🎯" }),
                  /* @__PURE__ */ jsx("p", { className: "text-purple-100 text-lg", children: "Baseado na análise do seu perfil VIPS, estes cursos têm alta compatibilidade com você em Florianópolis" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: recommendedCourses.map((course, index) => /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: index * 0.2 },
                    className: "bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(course.icon, { className: "text-white", size: 24 }) }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h4", { className: "font-bold text-lg", children: course.name }),
                          /* @__PURE__ */ jsx("p", { className: "text-purple-100 text-sm", children: course.subtitle })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-purple-100 mb-4", children: course.description }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "bg-white/20 rounded-full px-3 py-1 flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx(Star, { size: 14, className: "text-yellow-300" }),
                          /* @__PURE__ */ jsxs("span", { className: "text-white text-sm font-semibold", children: [
                            course.compatibilityPercentage,
                            "% Compatible"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "text-purple-100 text-xs", children: "Baseado no seu perfil científico" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                        /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
                          "Duração: ",
                          course.duration
                        ] }),
                        /* @__PURE__ */ jsx("span", { className: "font-bold", children: course.price })
                      ] }),
                      /* @__PURE__ */ jsxs(
                        motion.a,
                        {
                          href: `https://wa.me/5548988559491?text=${encodeURIComponent(
                            `Olá! Fiz o teste vocacional científico e obtive ${dominantArea.score}% de afinidade com ${dominantArea.area === "gestao" ? "Gestão" : dominantArea.area === "educacao" ? "Educação" : dominantArea.area === "comunicacao" ? "Comunicação" : dominantArea.area === "logica" ? "Lógica" : dominantArea.area.charAt(0).toUpperCase() + dominantArea.area.slice(1)}.

O curso ${course.name} foi recomendado para meu perfil.
Gostaria de saber mais sobre:
• Valores e formas de pagamento
• Horários disponíveis
• Início das próximas turmas
• Local das aulas (Florianópolis, São José ou Palhoça)`
                          )}`,
                          className: "w-full bg-white text-[#d400ff] py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2",
                          whileHover: { scale: 1.02 },
                          whileTap: { scale: 0.98 },
                          children: [
                            /* @__PURE__ */ jsx(ChatCircle, { size: 18 }),
                            "Quero Este Curso"
                          ]
                        }
                      )
                    ]
                  },
                  course.id
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mt-8 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 mb-3", children: /* @__PURE__ */ jsx(
              LogoH,
              {
                size: "small",
                animated: true,
                showFullText: true,
                textColor: "text-gray-700",
                className: "opacity-80"
              }
            ) }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm mb-2", children: "Transformando carreiras através da tecnologia • Grande Florianópolis" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Phone, { size: 12 }),
                "(48) 98855-9491"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 12 }),
                "Florianópolis • São José • Palhoça"
              ] }),
              /* @__PURE__ */ jsx("span", { children: "www.escolahabilidade.com" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: `https://wa.me/5548988559491?text=${encodeURIComponent(
                  `Olá! Acabei de fazer o teste vocacional científico e meus resultados foram:

🎯 Perfil Dominante: ${dominantArea.area === "gestao" ? "Gestão" : dominantArea.area === "educacao" ? "Educação" : dominantArea.area === "comunicacao" ? "Comunicação" : dominantArea.area === "logica" ? "Lógica" : dominantArea.area.charAt(0).toUpperCase() + dominantArea.area.slice(1)} (${dominantArea.score}%)

📊 Top 3 Áreas:
` + results.sort((a, b) => b.score - a.score).slice(0, 3).map(
                    (r, i) => `${i + 1}. ${r.area === "gestao" ? "Gestão" : r.area === "educacao" ? "Educação" : r.area === "comunicacao" ? "Comunicação" : r.area === "logica" ? "Lógica" : r.area.charAt(0).toUpperCase() + r.area.slice(1)}: ${r.score}%`
                  ).join("\n") + `

📚 Cursos Recomendados:
` + recommendedCourses.map(
                    (course) => `• ${course.name} - ${course.subtitle}`
                  ).join("\n") + `

Gostaria de saber mais detalhes sobre os cursos e valores!`
                )}`,
                className: "bg-[#d400ff] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-600 transition-all duration-300 inline-flex items-center justify-center gap-2",
                whileHover: { scale: 1.05, boxShadow: "0 0 30px rgba(212, 0, 255, 0.4)" },
                children: [
                  /* @__PURE__ */ jsx(ChatCircle, { size: 20 }),
                  "Falar Conosco"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                onClick: onRestart,
                className: "border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2",
                whileHover: { scale: 1.05 },
                children: [
                  /* @__PURE__ */ jsx(ArrowsClockwise, { size: 20 }),
                  "Refazer Teste"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                onClick: generatePDF$1,
                disabled: isGeneratingPDF,
                className: "flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                whileHover: { scale: isGeneratingPDF ? 1 : 1.05 },
                whileTap: { scale: isGeneratingPDF ? 1 : 0.95 },
                children: [
                  /* @__PURE__ */ jsx(DownloadSimple, { size: 14 }),
                  isGeneratingPDF ? pdfProgress.message || "Gerando PDF..." : "Resultado em PDF"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.button,
              {
                onClick: shareResults,
                className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300",
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx(ShareNetwork, { size: 14 }),
                  "Compartilhar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "tel:+5548988559491",
                className: "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300",
                children: [
                  /* @__PURE__ */ jsx(Phone, { size: 14 }),
                  "(48) 98855-9491"
                ]
              }
            )
          ] })
        ] })
      ]
    },
    "vocational-results-dashboard"
  );
};
const TesteVocacional = () => {
  const [currentStep, setCurrentStep] = useState("intro");
  const [results, setResults] = useState(null);
  useEffect(() => {
    console.log("🎯 TESTE VOCACIONAL: Component mounted");
    console.log("📊 TESTE VOCACIONAL: Initial state - step:", currentStep);
    analytics.trackTestPageView();
  }, []);
  useEffect(() => {
    const handleStartTest = () => {
      console.log("🚀 TESTE VOCACIONAL: Starting test from Hero");
      setCurrentStep("test");
      analytics.trackTestStart();
      analytics.measureTestDuration.start();
      setTimeout(() => {
        const testSection = document.getElementById("teste-section");
        if (testSection) {
          testSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);
    };
    window.addEventListener("startVocationalTest", handleStartTest);
    return () => {
      window.removeEventListener("startVocationalTest", handleStartTest);
    };
  }, []);
  const handleTestComplete = (testResults) => {
    console.log("✅ TESTE VOCACIONAL: Test completed", testResults);
    setResults(testResults);
    setCurrentStep("results");
  };
  const handleRestart = () => {
    setCurrentStep("intro");
    setResults(null);
    analytics.trackTestRestart();
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Teste Vocacional Científico - Metodologia MIT, Harvard, Stanford | Escola Habilidade" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Descubra seu curso ideal com nosso teste vocacional científico baseado em metodologias de MIT, Harvard e Stanford. Florianópolis, São José, Palhoça."
        }
      ),
      /* @__PURE__ */ jsx("style", { children: `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Montserrat', sans-serif;
            }
            
            html {
              scroll-behavior: smooth;
            }
          ` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
      currentStep === "intro" && /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsxs("main", { className: currentStep === "intro" ? "pt-0" : "pt-20", children: [
        currentStep === "test" && /* @__PURE__ */ jsx(
          motion.section,
          {
            id: "teste-section",
            className: "py-20 bg-gray-50",
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, ease: "easeOut" },
            children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
              DOMErrorBoundary,
              {
                className: "max-w-4xl mx-auto",
                fallbackChildren: /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Brain, { className: "text-white", size: 40 }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Teste Vocacional" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Recarregue a página para continuar com o teste." }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => window.location.reload(),
                      className: "bg-[#d400ff] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 transition-all duration-300",
                      children: "Recarregar Página"
                    }
                  )
                ] }),
                children: /* @__PURE__ */ jsx(VocationalTest, { onComplete: handleTestComplete })
              }
            ) })
          },
          "vocational-test-questions-section"
        ),
        currentStep === "results" && /* @__PURE__ */ jsx(
          motion.section,
          {
            className: "py-20 bg-gray-50",
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, ease: "easeOut" },
            children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsx(
              DOMErrorBoundary,
              {
                className: "max-w-6xl mx-auto",
                fallbackChildren: /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Star, { className: "text-white", size: 40 }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Resultados do Teste" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: "Houve um problema ao exibir seus resultados. Tente recarregar a página." }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => window.location.reload(),
                        className: "bg-[#d400ff] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 transition-all duration-300",
                        children: "Recarregar Página"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: handleRestart,
                        className: "border-2 border-[#d400ff] text-[#d400ff] px-8 py-3 rounded-full font-bold hover:bg-[#d400ff] hover:text-white transition-all duration-300",
                        children: "Refazer Teste"
                      }
                    )
                  ] })
                ] }),
                children: /* @__PURE__ */ jsx(ResultsDashboard, { results, onRestart: handleRestart })
              }
            ) })
          },
          "vocational-test-results-section"
        )
      ] }),
      /* @__PURE__ */ jsx(
        motion.a,
        {
          href: "https://wa.me/5548988559491?text=Olá! Gostaria de saber mais sobre os cursos da Escola Habilidade.",
          className: "fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center shadow-lg",
          whileHover: {
            scale: 1.1,
            boxShadow: "0 0 20px rgba(212, 0, 255, 0.5)"
          },
          animate: {
            y: [0, -5, 0]
          },
          transition: {
            y: { duration: 2, repeat: Infinity }
          },
          children: /* @__PURE__ */ jsx(ChatCircle, { className: "text-white", size: 24 })
        }
      ),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Escola Habilidade - Teste Vocacional",
          "description": "Teste vocacional gratuito para descobrir o curso ideal em Florianópolis, São José e Palhoça",
          "url": "https://escolahabilidade.com/teste-vocacional",
          "areaServed": [
            {
              "@type": "City",
              "name": "Florianópolis"
            },
            {
              "@type": "City",
              "name": "São José"
            },
            {
              "@type": "City",
              "name": "Palhoça"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "R. Caetano José Ferreira, 426 - Sala 5",
            "addressLocality": "Kobrasol",
            "addressRegion": "SC",
            "postalCode": "88102-280",
            "addressCountry": "BR"
          },
          "telephone": "+55-48-98855-9491",
          "offers": [
            {
              "@type": "Service",
              "name": "Teste Vocacional Gratuito",
              "description": "Descubra qual curso combina com seu perfil"
            }
          ]
        })
      } })
    ] })
  ] });
};
export {
  TesteVocacional as default
};
