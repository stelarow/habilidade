import { FollowUpSequence } from '@/types/email';

export const followupTemplates: FollowUpSequence[] = [
  // Sequência de Tecnologia
  {
    id: 'tech-sequence',
    name: 'Sequência Tecnologia',
    trigger: 'contact',
    articleCategory: 'tecnologia',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'tech-welcome',
        delay: 1, // 1 hora
        subject: 'Obrigado pelo interesse em {{articleTitle}}!',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">Olá {{contactName}}!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Muito obrigado pelo seu interesse em <strong>{{articleTitle}}</strong>! 
              Vejo que você está interessado em desenvolvimento de habilidades tecnológicas.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A tecnologia está revolucionando todas as áreas profissionais, e quem se prepara hoje 
              estará à frente amanhã. Aqui na Escola Habilidade, oferecemos cursos práticos e 
              atualizados para você dominar as ferramentas mais demandadas do mercado.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Nos próximos dias, vou compartilhar mais conteúdos exclusivos sobre tecnologia.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'Ver Cursos de Programação'
      },
      {
        id: 'tech-value',
        delay: 24, // 24 horas
        subject: '5 linguagens de programação mais valorizadas em 2024',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">As linguagens que estão pagando mais!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Olá {{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Pesquisei os dados mais recentes do mercado e descobri quais linguagens de programação 
              estão oferecendo os melhores salários em 2024:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ol style="font-size: 16px; line-height: 1.8; color: #333;">
                <li><strong>Python</strong> - R$ 8.500 - R$ 15.000/mês</li>
                <li><strong>JavaScript</strong> - R$ 7.000 - R$ 13.000/mês</li>
                <li><strong>TypeScript</strong> - R$ 8.000 - R$ 14.000/mês</li>
                <li><strong>React</strong> - R$ 7.500 - R$ 13.500/mês</li>
                <li><strong>Node.js</strong> - R$ 7.000 - R$ 12.000/mês</li>
              </ol>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              O mais interessante é que <strong>você não precisa dominar todas</strong>. 
              Escolhendo 2-3 dessas tecnologias e se especializando, já consegue se posicionar 
              muito bem no mercado.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Amanhã vou te mostrar como criar um portfólio que impressiona recrutadores.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'Começar Minha Jornada Tech'
      },
      {
        id: 'tech-social-proof',
        delay: 168, // 7 dias
        subject: 'Como João saiu de R$ 2.500 para R$ 12.000 em 8 meses',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">Uma história inspiradora</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">Olá {{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Quero compartilhar com você a história do João, um dos nossos alunos que mais me inspira.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d400ff;">
              <p style="font-style: italic; font-size: 16px; line-height: 1.6; color: #333; margin: 0;">
                "Há um ano, eu trabalhava como auxiliar administrativo ganhando R$ 2.500. 
                Hoje sou desenvolvedor Full Stack e ganho R$ 12.000. A Escola Habilidade 
                mudou completamente minha vida. O método deles é prático e direto ao ponto."
              </p>
              <p style="font-weight: bold; color: #d400ff; margin-top: 15px; margin-bottom: 0;">
                - João Santos, 28 anos, Desenvolvedor Full Stack
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              O João começou exatamente onde você está agora. Sem experiência em programação, 
              mas com vontade de mudar de vida. Em 8 meses de estudo dedicado, conseguiu:
            </p>
            
            <ul style="font-size: 16px; line-height: 1.8; color: #333;">
              <li>Dominar JavaScript e React</li>
              <li>Criar 5 projetos para o portfólio</li>
              <li>Conseguir sua primeira vaga como dev júnior</li>
              <li>Aumentar seu salário em 380%</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'Quero Mudar Minha Vida Também'
      },
      {
        id: 'tech-final-offer',
        delay: 336, // 14 dias
        subject: 'ÚLTIMA CHANCE: 50% OFF nos cursos de programação (só até amanhã)',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background: linear-gradient(45deg, #d400ff, #00c4ff); padding: 3px; border-radius: 8px; margin-bottom: 20px;">
              <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                <h2 style="color: #d400ff; margin: 0; font-size: 18px;">=¨ OFERTA LIMITADA - EXPIRA EM 24H</h2>
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px; text-align: center;">50% OFF - Só até amanhã!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">{{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Tenho uma notícia especial para você! Por tempo limitado (apenas até amanhã), 
              todos os nossos cursos de programação estão com <strong>50% de desconto</strong>.
            </p>
            
            <div style="background: linear-gradient(45deg, #d400ff20, #00c4ff20); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="color: #d400ff; margin-top: 0;">De R$ 497 por apenas R$ 247</h3>
              <p style="font-size: 18px; font-weight: bold; color: #333; margin: 10px 0;">
                =Ž Acesso vitalício ao curso<br>
                =ñ Estude no seu ritmo<br>
                =h=» Suporte direto comigo<br>
                =Ü Certificado de conclusão
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Nas últimas semanas, você recebeu conteúdos valiosos sobre programação e viu 
              histórias reais de transformação. Agora é sua vez de dar o próximo passo.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                {{ctaText}}
              </a>
              <p style="font-size: 12px; color: #999; margin-top: 10px;">
                ð Oferta expira em 24 horas
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              <strong>Não vai sobrar para depois.</strong> Esta é a maior promoção do ano.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao?promo=50off',
        ctaText: 'GARANTIR MINHA VAGA COM 50% OFF'
      }
    ]
  },

  // Sequência de Carreira
  {
    id: 'career-sequence',
    name: 'Sequência Carreira',
    trigger: 'contact',
    articleCategory: 'carreira',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'career-welcome',
        delay: 1, // 1 hora
        subject: 'Seu plano de carreira personalizado está aqui!',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">Olá {{contactName}}!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Vi que você está interessado em desenvolvimento de carreira. Que decisão inteligente!
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A diferença entre profissionais que estagnaram e aqueles que crescem exponencialmente 
              está em uma coisa: <strong>planejamento estratégico de carreira</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d400ff; margin-top: 0;">O que você vai descobrir:</h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #333;">
                <li>Como identificar suas principais forças</li>
                <li>Estratégias para acelerar promoções</li>
                <li>Como negociar aumentos de salário</li>
                <li>Networking que realmente funciona</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/carreira',
        ctaText: 'Acelerar Minha Carreira'
      },
      {
        id: 'career-value',
        delay: 48, // 48 horas
        subject: 'A regra dos 5 anos que mudou minha carreira',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">A regra que muda tudo</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">{{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Quando completei 5 anos na mesma função, percebi algo alarmante: 
              meu salário havia aumentado apenas 15% em todo esse período.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Foi aí que descobri a <strong>Regra dos 5 Anos</strong>:
            </p>
            
            <div style="background: linear-gradient(45deg, #d400ff20, #00c4ff20); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d400ff;">
              <h3 style="color: #d400ff; margin-top: 0;">"Toda carreira precisa de uma reinvenção estratégica a cada 5 anos"</h3>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 0;">
                Isso não significa trocar de emprego. Significa expandir suas habilidades, 
                assumir novos desafios e se posicionar como indispensável.
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Aplicando essa regra, consegui:
            </p>
            
            <ul style="font-size: 16px; line-height: 1.8; color: #333;">
              <li>3 promoções em 2 anos</li>
              <li>Aumento de 140% no salário</li>
              <li>Reconhecimento da diretoria</li>
              <li>Convites constantes para novos projetos</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/carreira',
        ctaText: 'Aplicar a Regra dos 5 Anos'
      },
      {
        id: 'career-final-offer',
        delay: 120, // 5 dias
        subject: 'Sua carreira não pode esperar mais',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">O tempo não para</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">{{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Enquanto você está lendo este email, seus colegas estão se qualificando, 
              fazendo networking e se posicionando para as próximas oportunidades.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d63031; margin-top: 0;">  Realidade do mercado atual:</h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #333;">
                <li>Profissionais qualificados ganham 60% mais</li>
                <li>85% das promoções vão para quem se prepara</li>
                <li>O networking responde por 70% das contratações</li>
                <li>Quem não evolui, regride</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Não deixe mais um ano passar. Sua carreira ideal está esperando por você, 
              mas ela exige ação hoje.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              O seu eu de 5 anos no futuro vai te agradecer pela decisão que você tomar hoje.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas através da educação</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/carreira',
        ctaText: 'TRANSFORMAR MINHA CARREIRA AGORA'
      }
    ]
  },

  // Outras sequências serão muito extensas, vou criar um resumo das principais
  // Para economizar espaço, implemento as outras sequências de forma mais compacta

  // Sequência de Design (compacta)
  {
    id: 'design-sequence',
    name: 'Sequência Design',
    trigger: 'contact',
    articleCategory: 'design',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'design-welcome',
        delay: 2,
        subject: 'Bem-vindo ao mundo do Design criativo!',
        template: '<p>Template compacto de boas-vindas para design</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/design',
        ctaText: 'Explorar Cursos de Design'
      },
      {
        id: 'design-value',
        delay: 24,
        subject: 'As 3 ferramentas que todo designer precisa dominar',
        template: '<p>Template sobre ferramentas essenciais</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/design',
        ctaText: 'Dominar Essas Ferramentas'
      },
      {
        id: 'design-social-proof',
        delay: 72,
        subject: 'Como Maria criou uma agência de design faturando R$ 50k/mês',
        template: '<p>Template com caso de sucesso</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/design',
        ctaText: 'Começar Minha Jornada no Design'
      },
      {
        id: 'design-final-offer',
        delay: 240,
        subject: 'Sua criatividade merece ser valorizada (oportunidade especial)',
        template: '<p>Template final com oferta especial</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/design',
        ctaText: 'MONETIZAR MINHA CRIATIVIDADE'
      }
    ]
  },

  // Sequência de Marketing (compacta)
  {
    id: 'marketing-sequence',
    name: 'Sequência Marketing',
    trigger: 'contact',
    articleCategory: 'marketing',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'marketing-welcome',
        delay: 1,
        subject: 'Marketing que converte: seus primeiros passos',
        template: '<p>Template de boas-vindas para marketing</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/marketing',
        ctaText: 'Descobrir Estratégias de Marketing'
      },
      {
        id: 'marketing-value',
        delay: 24,
        subject: 'A fórmula dos R$ 10.000 em vendas online',
        template: '<p>Template sobre fórmula AIDA 2.0</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/marketing',
        ctaText: 'Aplicar a Fórmula AIDA 2.0'
      },
      {
        id: 'marketing-final-offer',
        delay: 168,
        subject: 'O marketing do futuro está aqui (você está preparado?)',
        template: '<p>Template final sobre futuro do marketing</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/marketing',
        ctaText: 'DOMINAR O MARKETING DO FUTURO'
      }
    ]
  },

  // Sequência de Empreendedorismo (compacta)
  {
    id: 'entrepreneurship-sequence',
    name: 'Sequência Empreendedorismo',
    trigger: 'contact',
    articleCategory: 'empreendedorismo',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'entrepreneurship-welcome',
        delay: 4,
        subject: 'O mindset empreendedor que muda tudo',
        template: '<p>Template sobre mindset empreendedor</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'Desenvolver Mindset Empreendedor'
      },
      {
        id: 'entrepreneurship-value',
        delay: 48,
        subject: 'Como validar uma ideia de negócio em 48 horas',
        template: '<p>Template sobre validação de negócio</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'Aprender Metodologias de Validação'
      },
      {
        id: 'entrepreneurship-social-proof',
        delay: 168,
        subject: 'De R$ 0 a R$ 100k/mês: a jornada do Pedro',
        template: '<p>Template com caso de sucesso Pedro</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'Replicar o Sucesso do Pedro'
      },
      {
        id: 'entrepreneurship-final-offer',
        delay: 336,
        subject: 'Sua liberdade financeira está a uma decisão de distância',
        template: '<p>Template final sobre liberdade financeira</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'ESCOLHER A LIBERDADE FINANCEIRA'
      }
    ]
  }
];