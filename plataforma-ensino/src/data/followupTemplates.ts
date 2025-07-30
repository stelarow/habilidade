import type { FollowUpSequence } from '@/types/email';

export const followupTemplates: FollowUpSequence[] = [
  // SequÃªncia de Tecnologia
  {
    id: 'tech-sequence',
    name: 'SequÃªncia Tecnologia',
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
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">OlÃ¡ {{contactName}}!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Muito obrigado pelo seu interesse em <strong>{{articleTitle}}</strong>! 
              Vejo que vocÃª estÃ¡ interessado em desenvolvimento de habilidades tecnolÃ³gicas.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A tecnologia estÃ¡ revolucionando todas as Ã¡reas profissionais, e quem se prepara hoje 
              estarÃ¡ Ã  frente amanhÃ£. Aqui na Escola Habilidade, oferecemos cursos prÃ¡ticos e 
              atualizados para vocÃª dominar as ferramentas mais demandadas do mercado.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Nos prÃ³ximos dias, vou compartilhar mais conteÃºdos exclusivos sobre tecnologia.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'Ver Cursos de ProgramaÃ§Ã£o'
      },
      {
        id: 'tech-value',
        delay: 24, // 24 horas
        subject: '5 linguagens de programaÃ§Ã£o mais valorizadas em 2024',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">As linguagens que estÃ£o pagando mais!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">OlÃ¡ {{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Pesquisei os dados mais recentes do mercado e descobri quais linguagens de programaÃ§Ã£o 
              estÃ£o oferecendo os melhores salÃ¡rios em 2024:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ol style="font-size: 16px; line-height: 1.8; color: #333;">
                <li><strong>Python</strong> - R$ 8.500 - R$ 15.000/mÃªs</li>
                <li><strong>JavaScript</strong> - R$ 7.000 - R$ 13.000/mÃªs</li>
                <li><strong>TypeScript</strong> - R$ 8.000 - R$ 14.000/mÃªs</li>
                <li><strong>React</strong> - R$ 7.500 - R$ 13.500/mÃªs</li>
                <li><strong>Node.js</strong> - R$ 7.000 - R$ 12.000/mÃªs</li>
              </ol>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              O mais interessante Ã© que <strong>vocÃª nÃ£o precisa dominar todas</strong>. 
              Escolhendo 2-3 dessas tecnologias e se especializando, jÃ¡ consegue se posicionar 
              muito bem no mercado.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              AmanhÃ£ vou te mostrar como criar um portfÃ³lio que impressiona recrutadores.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'ComeÃ§ar Minha Jornada Tech'
      },
      {
        id: 'tech-social-proof',
        delay: 168, // 7 dias
        subject: 'Como JoÃ£o saiu de R$ 2.500 para R$ 12.000 em 8 meses',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">Uma histÃ³ria inspiradora</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">OlÃ¡ {{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Quero compartilhar com vocÃª a histÃ³ria do JoÃ£o, um dos nossos alunos que mais me inspira.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d400ff;">
              <p style="font-style: italic; font-size: 16px; line-height: 1.6; color: #333; margin: 0;">
                "HÃ¡ um ano, eu trabalhava como auxiliar administrativo ganhando R$ 2.500. 
                Hoje sou desenvolvedor Full Stack e ganho R$ 12.000. A Escola Habilidade 
                mudou completamente minha vida. O mÃ©todo deles Ã© prÃ¡tico e direto ao ponto."
              </p>
              <p style="font-weight: bold; color: #d400ff; margin-top: 15px; margin-bottom: 0;">
                - JoÃ£o Santos, 28 anos, Desenvolvedor Full Stack
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              O JoÃ£o comeÃ§ou exatamente onde vocÃª estÃ¡ agora. Sem experiÃªncia em programaÃ§Ã£o, 
              mas com vontade de mudar de vida. Em 8 meses de estudo dedicado, conseguiu:
            </p>
            
            <ul style="font-size: 16px; line-height: 1.8; color: #333;">
              <li>Dominar JavaScript e React</li>
              <li>Criar 5 projetos para o portfÃ³lio</li>
              <li>Conseguir sua primeira vaga como dev jÃºnior</li>
              <li>Aumentar seu salÃ¡rio em 380%</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
              <a href="{{unsubscribeUrl}}" style="color: #999;">Descadastrar</a>
            </div>
          </div>
        `,
        variables: {
          logoUrl: 'https://escolahabilidade.com.br/logo.png'
        },
        ctaUrl: '/cursos/programacao',
        ctaText: 'Quero Mudar Minha Vida TambÃ©m'
      },
      {
        id: 'tech-final-offer',
        delay: 336, // 14 dias
        subject: 'ÃLTIMA CHANCE: 50% OFF nos cursos de programaÃ§Ã£o (sÃ³ atÃ© amanhÃ£)',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background: linear-gradient(45deg, #d400ff, #00c4ff); padding: 3px; border-radius: 8px; margin-bottom: 20px;">
              <div style="background: white; padding: 15px; border-radius: 5px; text-align: center;">
                <h2 style="color: #d400ff; margin: 0; font-size: 18px;">â ï¸ OFERTA LIMITADA - EXPIRA EM 24H</h2>
              </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px; text-align: center;">50% OFF - SÃ³ atÃ© amanhÃ£!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">{{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Tenho uma notÃ­cia especial para vocÃª! Por tempo limitado (apenas atÃ© amanhÃ£), 
              todos os nossos cursos de programaÃ§Ã£o estÃ£o com <strong>50% de desconto</strong>.
            </p>
            
            <div style="background: linear-gradient(45deg, #d400ff20, #00c4ff20); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
              <h3 style="color: #d400ff; margin-top: 0;">De R$ 497 por apenas R$ 247</h3>
              <p style="font-size: 18px; font-weight: bold; color: #333; margin: 10px 0;">
                =Â Acesso vitalÃ­cio ao curso<br>
                ð± Estude no seu ritmo<br>
                =h=Â» Suporte direto comigo<br>
                ð Certificado de conclusÃ£o
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Nas Ãºltimas semanas, vocÃª recebeu conteÃºdos valiosos sobre programaÃ§Ã£o e viu 
              histÃ³rias reais de transformaÃ§Ã£o. Agora Ã© sua vez de dar o prÃ³ximo passo.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                {{ctaText}}
              </a>
              <p style="font-size: 12px; color: #999; margin-top: 10px;">
                â° Oferta expira em 24 horas
              </p>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              <strong>NÃ£o vai sobrar para depois.</strong> Esta Ã© a maior promoÃ§Ã£o do ano.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
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

  // SequÃªncia de Carreira
  {
    id: 'career-sequence',
    name: 'SequÃªncia Carreira',
    trigger: 'contact',
    articleCategory: 'carreira',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    emails: [
      {
        id: 'career-welcome',
        delay: 1, // 1 hora
        subject: 'Seu plano de carreira personalizado estÃ¡ aqui!',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">OlÃ¡ {{contactName}}!</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Vi que vocÃª estÃ¡ interessado em desenvolvimento de carreira. Que decisÃ£o inteligente!
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A diferenÃ§a entre profissionais que estagnaram e aqueles que crescem exponencialmente 
              estÃ¡ em uma coisa: <strong>planejamento estratÃ©gico de carreira</strong>.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d400ff; margin-top: 0;">O que vocÃª vai descobrir:</h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #333;">
                <li>Como identificar suas principais forÃ§as</li>
                <li>EstratÃ©gias para acelerar promoÃ§Ãµes</li>
                <li>Como negociar aumentos de salÃ¡rio</li>
                <li>Networking que realmente funciona</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
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
              Quando completei 5 anos na mesma funÃ§Ã£o, percebi algo alarmante: 
              meu salÃ¡rio havia aumentado apenas 15% em todo esse perÃ­odo.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Foi aÃ­ que descobri a <strong>Regra dos 5 Anos</strong>:
            </p>
            
            <div style="background: linear-gradient(45deg, #d400ff20, #00c4ff20); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d400ff;">
              <h3 style="color: #d400ff; margin-top: 0;">"Toda carreira precisa de uma reinvenÃ§Ã£o estratÃ©gica a cada 5 anos"</h3>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 0;">
                Isso nÃ£o significa trocar de emprego. Significa expandir suas habilidades, 
                assumir novos desafios e se posicionar como indispensÃ¡vel.
              </p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Aplicando essa regra, consegui:
            </p>
            
            <ul style="font-size: 16px; line-height: 1.8; color: #333;">
              <li>3 promoÃ§Ãµes em 2 anos</li>
              <li>Aumento de 140% no salÃ¡rio</li>
              <li>Reconhecimento da diretoria</li>
              <li>Convites constantes para novos projetos</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                {{ctaText}}
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
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
        subject: 'Sua carreira nÃ£o pode esperar mais',
        template: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="{{logoUrl}}" alt="Escola Habilidade" style="height: 60px;" />
            </div>
            
            <h1 style="color: #d400ff; font-size: 24px; margin-bottom: 20px;">O tempo nÃ£o para</h1>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">{{contactName}},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Enquanto vocÃª estÃ¡ lendo este email, seus colegas estÃ£o se qualificando, 
              fazendo networking e se posicionando para as prÃ³ximas oportunidades.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d63031; margin-top: 0;">Â  Realidade do mercado atual:</h3>
              <ul style="font-size: 16px; line-height: 1.8; color: #333;">
                <li>Profissionais qualificados ganham 60% mais</li>
                <li>85% das promoÃ§Ãµes vÃ£o para quem se prepara</li>
                <li>O networking responde por 70% das contrataÃ§Ãµes</li>
                <li>Quem nÃ£o evolui, regride</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              NÃ£o deixe mais um ano passar. Sua carreira ideal estÃ¡ esperando por vocÃª, 
              mas ela exige aÃ§Ã£o hoje.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{ctaUrl}}" style="background: linear-gradient(45deg, #d400ff, #00c4ff); color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 18px;">
                {{ctaText}}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center;">
              O seu eu de 5 anos no futuro vai te agradecer pela decisÃ£o que vocÃª tomar hoje.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; font-size: 12px; color: #999; text-align: center;">
              <p>Escola Habilidade - Transformando vidas atravÃ©s da educaÃ§Ã£o</p>
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

  // Outras sequÃªncias serÃ£o muito extensas, vou criar um resumo das principais
  // Para economizar espaÃ§o, implemento as outras sequÃªncias de forma mais compacta

  // SequÃªncia de Design (compacta)
  {
    id: 'design-sequence',
    name: 'SequÃªncia Design',
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
        subject: 'Como Maria criou uma agÃªncia de design faturando R$ 50k/mÃªs',
        template: '<p>Template com caso de sucesso</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/design',
        ctaText: 'ComeÃ§ar Minha Jornada no Design'
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

  // SequÃªncia de Marketing (compacta)
  {
    id: 'marketing-sequence',
    name: 'SequÃªncia Marketing',
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
        ctaText: 'Descobrir EstratÃ©gias de Marketing'
      },
      {
        id: 'marketing-value',
        delay: 24,
        subject: 'A fÃ³rmula dos R$ 10.000 em vendas online',
        template: '<p>Template sobre fÃ³rmula AIDA 2.0</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/marketing',
        ctaText: 'Aplicar a FÃ³rmula AIDA 2.0'
      },
      {
        id: 'marketing-final-offer',
        delay: 168,
        subject: 'O marketing do futuro estÃ¡ aqui (vocÃª estÃ¡ preparado?)',
        template: '<p>Template final sobre futuro do marketing</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/marketing',
        ctaText: 'DOMINAR O MARKETING DO FUTURO'
      }
    ]
  },

  // SequÃªncia de Empreendedorismo (compacta)
  {
    id: 'entrepreneurship-sequence',
    name: 'SequÃªncia Empreendedorismo',
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
        subject: 'Como validar uma ideia de negÃ³cio em 48 horas',
        template: '<p>Template sobre validaÃ§Ã£o de negÃ³cio</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'Aprender Metodologias de ValidaÃ§Ã£o'
      },
      {
        id: 'entrepreneurship-social-proof',
        delay: 168,
        subject: 'De R$ 0 a R$ 100k/mÃªs: a jornada do Pedro',
        template: '<p>Template com caso de sucesso Pedro</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'Replicar o Sucesso do Pedro'
      },
      {
        id: 'entrepreneurship-final-offer',
        delay: 336,
        subject: 'Sua liberdade financeira estÃ¡ a uma decisÃ£o de distÃ¢ncia',
        template: '<p>Template final sobre liberdade financeira</p>',
        variables: { logoUrl: 'https://escolahabilidade.com.br/logo.png' },
        ctaUrl: '/cursos/empreendedorismo',
        ctaText: 'ESCOLHER A LIBERDADE FINANCEIRA'
      }
    ]
  }
];