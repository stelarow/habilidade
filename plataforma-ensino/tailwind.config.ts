import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f0ff',
          100: '#f2e6ff',
          200: '#e6ccff',
          300: '#d9b3ff',
          400: '#cc99ff',
          500: '#d400ff',
          600: '#a000ff',
          700: '#8000d4',
          800: '#6000a0',
          900: '#40006c',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00c4ff',
          600: '#009dcc',
          700: '#007699',
          800: '#004f66',
          900: '#002833',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          50: '#f5f0ff',
          100: '#ebe6ff',
          200: '#d7ccff',
          300: '#c3b3ff',
          400: '#af99ff',
          500: '#a000ff',
          600: '#8000cc',
          700: '#600099',
          800: '#400066',
          900: '#200033',
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: {
          dark: '#0a0a0a',
          blue: '#181a2a',
          DEFAULT: 'hsl(var(--background))',
        },
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        'header-bg': 'hsl(var(--header-bg))',
        'header-foreground': 'hsl(var(--header-foreground))',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'gradient-animated': 'linear-gradient(-45deg, #d400ff, #00c4ff, #a000ff, #22d3ee)',
      },
      animation: {
        'gradient': 'gradient 4s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(212, 0, 255, 0.5)' },
          '50%': { 'box-shadow': '0 0 30px rgba(212, 0, 255, 0.8)' },
        },
      },
      clipPath: {
        'corner-cut': 'polygon(0 0, calc(100% - 1rem) 0, 100% 1rem, 100% 100%, 1rem 100%, 0 calc(100% - 1rem))',
      },
    },
  },
  plugins: [],
};
export default config;
