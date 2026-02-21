/**
 * Afiliação Page Data - "Indique e Ganhe"
 * Sistema simplificado com cupons nominais
 */

export const afiliacaoData = {
  seo: {
    title: 'Indique e Ganhe | Escola Habilidade',
    description:
      'Indique amigos para os cursos da Escola Habilidade usando seu cupom nominal e ganhe comissão por cada matrícula. Cadastre-se gratuitamente!',
    keywords:
      'indique e ganhe, cupom desconto, indicação cursos, escola habilidade, comissão indicação',
  },

  hero: {
    title: 'INDIQUE E GANHE',
    subtitle:
      'Ganhe comissão indicando nossos cursos com seu cupom nominal exclusivo.',
    cta: 'QUERO MEU CUPOM',
  },

  comoFunciona: [
    {
      step: 1,
      title: 'Cadastre-se',
      description: 'Preencha o formulário abaixo com seus dados e escolha o curso que deseja divulgar.',
      iconName: 'UserPlus',
    },
    {
      step: 2,
      title: 'Receba seu cupom',
      description: 'Você receberá um cupom nominal exclusivo (ex: PEDRO10) com desconto para seus indicados.',
      iconName: 'Ticket',
    },
    {
      step: 3,
      title: 'Indique amigos',
      description: 'Compartilhe seu cupom com amigos, familiares e nas redes sociais.',
      iconName: 'ShareNetwork',
    },
    {
      step: 4,
      title: 'Receba comissão',
      description: 'A cada matrícula usando seu cupom, você recebe uma comissão via Pix.',
      iconName: 'Money',
    },
  ],

  planoAcao: [
    {
      passo: '1',
      oQueFazer: 'Compartilhe seu cupom no status do WhatsApp',
      ferramenta: 'WhatsApp Status',
    },
    {
      passo: '2',
      oQueFazer: 'Envie para grupos de amigos e familiares',
      ferramenta: 'WhatsApp / Telegram',
    },
    {
      passo: '3',
      oQueFazer: 'Poste nas suas redes sociais com o cupom',
      ferramenta: 'Instagram / Facebook',
    },
  ],

  mensagemWhatsApp: `Oi! Tô fazendo um curso incrível na Escola Habilidade e consegui um cupom de desconto pra você!

Use o cupom *SEUCUPOM* na matrícula e garanta seu desconto.

Acesse: www.escolahabilidade.com`,

  cursos: [
    'Projetista 3D - Do Esboço ao Render',
    'DevStart - Programação para Jovens',
    'AutoCAD Essencial',
    'SketchUp para Interiores',
  ],

  location: {
    name: 'Escola Habilidade',
    phone: '(48) 98855-9491',
    phoneRaw: '5548988559491',
    email: 'afiliados@escolahabilidade.com',
    website: 'https://www.escolahabilidade.com',
  },
};

export const { seo, hero, comoFunciona, planoAcao, mensagemWhatsApp, cursos, location } =
  afiliacaoData;

export default afiliacaoData;
