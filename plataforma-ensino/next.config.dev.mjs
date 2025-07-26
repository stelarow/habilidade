/** @type {import('next').NextConfig} */
// Development-optimized configuration for faster iteration
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Fast development configuration
  typescript: {
    // Skip type checking in dev for faster builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting in dev for faster iteration
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  
  // Development-optimized image config
  images: {
    domains: ['localhost', 'supabase.co'],
    unoptimized: true, // Faster loading in dev
  },
  
  // Disable production optimizations for faster builds
  experimental: {
    // Minimal optimizations in development
    optimizePackageImports: [],
  },
  
  // Minimal webpack config for development
  webpack: (config, { dev }) => {
    if (dev) {
      // Faster development builds
      config.optimization.minimize = false
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }
    
    // Exclude example folder
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /Exemplo-pagina-aula/,
    });
    
    return config;
  },
  
  // Development server optimizations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 2,
  },
  
  poweredByHeader: false,
  compress: false, // Faster in development
};

export default nextConfig;