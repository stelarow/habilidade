// Configurações das estrelas
const STAR_COUNT = 50;
const STAR_MIN_SIZE = 2;
const STAR_MAX_SIZE = 4;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeStarfield();
    initializeScrollEffects();
    initializeAnimations();
    initializeIntersectionObserver();
    adjustOrbsForMobile();
    updateHeroPaddingAndScrollMargin();
    initializeSectionStarfield('starfield-hero', 50);
    initializeSectionStarfield('starfield-cursos', 30);
});

// Criação do campo de estrelas (apenas para Hero)
function initializeStarfield() {
    const starfield = document.querySelector('#starfield-hero');
    starfield.innerHTML = '';
    let starCount = STAR_COUNT;
    if (window.innerWidth <= 480) {
        starCount = 25;
    }
    for (let index = 0; index < starCount; index++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) + STAR_MIN_SIZE;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starfield.append(star);
    }
}

// Efeitos de scroll
function initializeScrollEffects() {
    const header = document.querySelector('#header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header com blur e borda ao rolar
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animação de entrada dos elementos
        animateOnScroll();
    });
}

// Animações de entrada
function initializeAnimations() {
    // Animação de entrada do header
    const header = document.querySelector('#header');
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.8s ease';
    
    setTimeout(() => {
        header.style.transform = 'translateY(0)';
    }, 100);
    
    // Animação da flecha de scroll
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        setInterval(() => {
            scrollArrow.style.transform = 'translateY(10px)';
            setTimeout(() => {
                scrollArrow.style.transform = 'translateY(0)';
            }, 1000);
        }, 2000);
    }
}

// Observer para animações de entrada
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    }, observerOptions);
    
    // Elementos para animar
    const animatedElements = document.querySelectorAll(`
        .problem-card,
        .testimonial-card,
        .etapa-item,
        .section-title,
        .hero-content
    `);
    
    for (const element of animatedElements) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    }
}

// Animação de scroll suave
function animateOnScroll() {
    const elements = document.querySelectorAll('.problem-card, .testimonial-card, .etapa-item');
    
    for (const element of elements) {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    }
}

// Efeitos de hover para botões
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    for (const button of buttons) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 20px rgba(212, 0, 255, 0.5)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
});

// Efeitos de hover para cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.problem-card, .testimonial-card');
    
    for (const card of cards) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 8px 30px rgba(212, 0, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        });
    }
});

// Scroll suave para links internos
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    for (const link of internalLinks) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('#header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Animação das orbs
function animateOrbs() {
    const orbs = document.querySelectorAll('.orb');
    
    for (const [index, orb] of orbs.entries()) {
        const duration = 6 + (index * 2); // 6s e 8s
        const delay = index * 2; // Delay diferente para cada orb
        
        orb.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    }
}

// Inicializar animação das orbs
document.addEventListener('DOMContentLoaded', function() {
    animateOrbs();
});

// Efeito de parallax sutil para as orbs
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.orb');
    
    for (const [index, orb] of orbs.entries()) {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
    }
});

// Otimização de performance - throttling para eventos de scroll
function throttle(function_, limit) {
    let inThrottle;
    return function() {
        const arguments_ = arguments;
        const context = this;
        if (!inThrottle) {
            function_.apply(context, arguments_);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Aplicar throttling aos eventos de scroll
window.addEventListener('scroll', throttle(function() {
    // Efeitos de scroll existentes
    const header = document.querySelector('#header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 16)); // ~60fps

// Animação de loading da página
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Efeito de destaque para elementos importantes
function highlightImportantElements() {
    const importantElements = document.querySelectorAll('.btn-primary, .hero-title, .cta-title');
    
    for (const element of importantElements) {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(212, 0, 255, 0.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    }
}

// Inicializar efeitos de destaque
document.addEventListener('DOMContentLoaded', function() {
    highlightImportantElements();
});

// Animação de contador para números (se houver)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    for (const counter of counters) {
        const target = Number.parseInt(counter.dataset.target);
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// Verificar se há contadores na página
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        // Observer para animar contadores quando entrarem no viewport
        const counterObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            }
        }, { threshold: 0.5 });
        
        for (const counter of counters) {
            counterObserver.observe(counter);
        }
    }
});

// Typewriter Animation for Hero Title
const typewriterWords = [
    'Projetos 3D',
    'Programação',
    'Design',
    'Marketing Digital',
    'Excel Avançado',
    'Inteligência Artificial',
    'Automação',
    'SketchUp',
    'Enscape'
];

const typewriterElement = document.querySelector('#typewriter');
let typewriterIndex = 0;
let typewriterChar = 0;
let typewriterDeleting = false;
let typewriterTimeout;

function typewriterLoop() {
    const word = typewriterWords[typewriterIndex];
    let display = word.slice(0, Math.max(0, typewriterChar));
    typewriterElement.textContent = display;
    typewriterElement.setAttribute('aria-label', 'Habilidade em ' + display);
    if (display.length === 0) {
        typewriterElement.innerHTML = '&nbsp;';
    }
    if (typewriterDeleting) {
        if (typewriterChar > 0) {
            typewriterChar--;
            typewriterTimeout = setTimeout(typewriterLoop, 40);
        } else {
            typewriterDeleting = false;
            typewriterIndex = (typewriterIndex + 1) % typewriterWords.length;
            typewriterTimeout = setTimeout(typewriterLoop, 300);
        }
    } else {
        if (typewriterChar < word.length) {
            typewriterChar++;
            typewriterTimeout = setTimeout(typewriterLoop, 80);
        } else {
            typewriterDeleting = true;
            typewriterTimeout = setTimeout(typewriterLoop, 2000);
        }
    }
}

// Iniciar animação ao carregar DOM
if (typewriterElement) {
    typewriterLoop();
}

// Preloader (opcional)
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--black-deep);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    document.body.append(preloader);
    
    // Remover preloader após carregamento
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 500);
    });
}

// Mostrar preloader apenas se a página demorar para carregar
if (document.readyState === 'loading') {
    showPreloader();
}

// Mobile Hamburger Menu
const hamburger = document.querySelector('#hamburger');
const mobileMenu = document.querySelector('#mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        setTimeout(updateHeroPaddingAndScrollMargin, 350); // após animação do menu
    });
    // Fechar menu ao clicar em um link
    for (const link of mobileMenu.querySelectorAll('a')) {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            mobileMenu.setAttribute('aria-hidden', true);
            document.body.style.overflow = '';
        });
    }
}

// Ajustar orbs para mobile
function adjustOrbsForMobile() {
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (window.innerWidth <= 480) {
        if (orb1) {
            orb1.style.left = '-40px';
            orb1.style.top = '10%';
        }
        if (orb2) {
            orb2.style.right = '-40px';
            orb2.style.bottom = '10%';
        }
    } else {
        if (orb1) {
            orb1.style.left = '10%';
            orb1.style.top = '20%';
        }
        if (orb2) {
            orb2.style.right = '10%';
            orb2.style.bottom = '20%';
        }
    }
}

window.addEventListener('resize', function() {
    initializeStarfield();
    adjustOrbsForMobile();
    updateHeroPaddingAndScrollMargin();
    initializeSectionStarfield('starfield-hero', 50);
    initializeSectionStarfield('starfield-cursos', 30);
});

// Ajuste dinâmico de padding-top do Hero e scroll-margin-top das seções no mobile
function updateHeroPaddingAndScrollMargin() {
    if (window.innerWidth <= 480) {
        const header = document.querySelector('#header');
        const hero = document.querySelector('.hero');
        if (header && hero) {
            const headerHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-h', headerHeight + 'px');
            hero.style.paddingTop = `calc(${headerHeight}px + 16px)`;
        }
        // Ajustar scroll-margin-top para todas as seções âncora
        const sections = document.querySelectorAll('section[id]');
        for (const section of sections) {
            section.style.scrollMarginTop = `calc(var(--header-h, 0px) + 16px)`;
        }
    } else {
        // Remover padding extra no desktop
        const hero = document.querySelector('.hero');
        if (hero) hero.style.paddingTop = '';
        const sections = document.querySelectorAll('section[id]');
        for (const section of sections) {
            section.style.scrollMarginTop = '';
        }
    }
}

// Starfield para Hero e Cursos
function initializeSectionStarfield(starfieldId, count) {
    const starfield = document.getElementById(starfieldId);
    if (!starfield) return;
    starfield.innerHTML = '';
    for (let index = 0; index < count; index++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE) + STAR_MIN_SIZE;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starfield.append(star);
    }
} 