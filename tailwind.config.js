module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    // Classes existentes (manter)
    'course-border-orange', 'course-border-red', 'course-border-blue',
    'course-border-pink', 'course-border-green', 'course-border-purple',
    'course-border-cyan', 'course-border-indigo', 'course-border-violet',
    'bg-gradient-purple', 'bg-gradient-purple-hover',
    'clip-card', 'card-enter', 'in-view',

    // Adicionar padrões dinâmicos
    { pattern: /bg-(red|blue|green|purple|orange|pink|cyan|indigo|violet)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /text-(red|blue|green|purple|orange|pink|cyan|indigo|violet)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /border-(red|blue|green|purple|orange|pink|cyan|indigo|violet)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /from-(red|blue|green|purple|orange|pink|cyan|indigo|violet)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /to-(amber|indigo|emerald|violet|rose|teal|pink|blue)-(100|200|300|400|500|600|700|800|900)/ },

    // Gradientes específicos mais usados (sem padrões problemáticos)
    'hover:from-purple-600', 'hover:to-blue-600', 'hover:from-orange-500', 'hover:to-amber-400',
    'hover:bg-purple-600', 'hover:bg-blue-600', 'hover:text-white', 'hover:text-purple-400',

    // Classes de animação
    'animate-fade-in', 'animate-scale-in', 'animate-float', 'animate-pulse-glow',
    'animate-blink', 'animate-gradient', 'animate-bounce', 'animate-spin',
    'animation-delay-300', 'animation-delay-500', 'animation-complete',

    // Responsividade específica mais comum
    'sm:text-lg', 'sm:text-xl', 'sm:text-2xl', 'sm:text-3xl', 'sm:text-4xl',
    'md:text-xl', 'md:text-2xl', 'md:text-3xl', 'md:text-4xl', 'md:text-5xl',
    'lg:text-2xl', 'lg:text-3xl', 'lg:text-4xl', 'lg:text-5xl', 'lg:text-6xl',
    'xl:text-3xl', 'xl:text-4xl', 'xl:text-5xl', 'xl:text-6xl', 'xl:text-7xl',

    // Classes customizadas do projeto
    'gradient-text', 'gradient-text-ai', 'gradient-text-design',
    'gradient-text-programming', 'gradient-text-marketing',
    'neon', 'neon-strong', 'stroke-outline', 'underline-light',
    'btn-neon', 'glass-hover', 'pulse-border', 'corner-glow', 'glow-hover',

    // Classes de starfield e efeitos especiais
    'star', 'starfield-css', 'word-fade',

    // Classes de revisão e avatares
    'review-star-fill', 'avatar-glow',

    // Classes de cards especiais
    'choose-card-special', 'special-badge', 'special-card',

    // Classes do sistema de timeline
    'timeline-container', 'timeline-dynamic', 'dynamic-step',

    // Utilitários de texto e layout
    'text-container-center', 'text-content-left', 'flex-center-both',
    'grid-responsive-cards', 'card-consistent', 'flex-aligned-content',
    'text-responsive-sm', 'text-responsive-md', 'text-responsive-lg'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-delayed': 'slideUp 0.6s ease-out 0.2s both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 