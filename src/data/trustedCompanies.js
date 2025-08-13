// Dados das empresas parceiras organizados por categoria/curso
export const trustedCompaniesData = {
  // Empresas que fizeram cursos de design/projetos (SketchUp, AutoCAD, etc)
  design: [
    {
      name: "Portinox",
      logo: "/images/course/sketchup-enscape/_AM4K71sI76P_48oTfwuh.webp",
      description: "Equipamentos Gastronômicos"
    },
    {
      name: "RM", // Corrigido de "MR" para "RM"
      logo: "/images/course/sketchup-enscape/2jNvD0A0IySCMxVqHKKLN.jpeg", 
      description: "Móveis Planejados"
    },
    {
      name: "Rinox",
      logo: "/images/course/sketchup-enscape/Dto_HF1D0esz2RgHkyluP.png",
      description: "Soluções Industriais"
    },
    {
      name: "Serralheria Mota",
      logo: "/images/course/sketchup-enscape/l5v_ub2GBPsN8c9qczmU6.jpeg",
      description: "Serralheria e Metalurgia"
    },
    {
      name: "Steinbach",
      logo: "/images/course/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp",
      description: "Marcenaria"
    },
    {
      name: "Torres",
      logo: "/images/course/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif",
      description: "Projetos Farmacêuticos"
    },
    {
      name: "Legno",
      logo: "/images/course/sketchup-enscape/ukKT5CnXfAVP3AS9G4jXs.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Mobiliário e Miniaturas", // Corrigido nome e descrição
      logo: "/images/course/sketchup-enscape/xYBvu3zwJyVFvvlKHPcz0.jpeg",
      description: "Móveis em Miniaturas"
    },
    {
      name: "Protérmica",
      logo: "/images/course/sketchup-enscape/dU-RkMhy9INgLG_2WQrOs.png",
      description: "Climatização"
    },
    {
      name: "Marcenaria JP",
      logo: "/images/course/sketchup-enscape/sXBkejmP3TgFhiLFB-2NM.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Ousadia",
      logo: "/images/course/sketchup-enscape/p4GIB7Eemw3frRpbKG2zR.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Escadas Imperatriz",
      logo: "/images/course/sketchup-enscape/PLOSn09XPv1Fkg_lJVsAG.jpeg",
      description: "Escadas e Estruturas"
    },
    {
      name: "Pedra Granada",
      logo: "/images/course/sketchup-enscape/kI8JxlGaNQo0Ecg5B1uEP.jpeg",
      description: "Marmoraria"
    },
    {
      name: "Brasil Mármore",
      logo: "/images/course/sketchup-enscape/brasil_marmore.jpg",
      description: "Marmoraria e Granitos"
    },
    {
      name: "Santa Madeira Casas",
      logo: "/images/course/sketchup-enscape/SANTA MADEIRA CASAS.webp",
      description: "Casas de Madeira"
    },
    {
      name: "Nexus Center",
      logo: "/images/companies/nexus-center-logo.svg",
      description: "Contact Center"
    },
    {
      name: "Casa da Mana",
      logo: "/images/companies/casa-da-mana-logo.jpeg",
      description: "Produtos Artesanais"
    }
  ],

  // Empresas que fizeram cursos de informática
  informatica: [
    // Algumas empresas que também fizeram informática além de design
    {
      name: "Torres",
      logo: "/images/course/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif",
      description: "Projetos Farmacêuticos"
    },
    {
      name: "Protérmica",
      logo: "/images/course/sketchup-enscape/dU-RkMhy9INgLG_2WQrOs.png",
      description: "Climatização"
    },
    {
      name: "Rinox",
      logo: "/images/course/sketchup-enscape/Dto_HF1D0esz2RgHkyluP.png",
      description: "Soluções Industriais"
    }
  ],

  // Empresas que fizeram cursos de marketing digital
  marketing: [
    {
      name: "RM",
      logo: "/images/course/sketchup-enscape/2jNvD0A0IySCMxVqHKKLN.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Legno",
      logo: "/images/course/sketchup-enscape/ukKT5CnXfAVP3AS9G4jXs.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Steinbach",
      logo: "/images/course/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp",
      description: "Marcenaria"
    }
  ]
};

// Função helper para buscar empresas por categoria
export const getCompaniesByCategory = (categories) => {
  if (!categories || categories.length === 0) {
    // Se não especificado, retorna todas as empresas únicas
    const allCompanies = new Map();
    for (const company of Object.values(trustedCompaniesData).flat()) {
      allCompanies.set(company.name, company);
    }
    return [...allCompanies.values()];
  }

  const companiesSet = new Map();
  for (const category of categories) {
    if (trustedCompaniesData[category]) {
      for (const company of trustedCompaniesData[category]) {
        companiesSet.set(company.name, company);
      }
    }
  }
  
  return [...companiesSet.values()];
};

// Mapeamento de cursos para categorias de empresas
export const courseToCompanyMapping = {
  'sketchup-enscape': ['design'],
  'autocad-2d-3d': ['design'],
  'revit': ['design'],
  'informatica': ['informatica'],
  'marketing-digital': ['marketing'],
  'programacao': ['informatica'],
  'design-grafico': ['design', 'marketing']
};