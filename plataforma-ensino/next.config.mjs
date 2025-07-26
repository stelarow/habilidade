/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude example folder from build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Skip TypeScript and ESLint checking during build to save memory
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configure images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Disable experimental optimizations
  experimental: {},
  
  // Minimal webpack configuration
  webpack: (config, { isServer }) => {
    // Memory optimization
    config.optimization = {
      ...config.optimization,
      minimize: false, // Disable minification to save memory during build
    };
    
    // Exclude example folder from compilation
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /Exemplo-pagina-aula/,
    });
    
    // Prevent problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      fs: false,
    };
    
    // Server-specific configuration
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist/build/pdf.worker.min.mjs': false,
        'react-pdf': false,
        'pdfjs-dist': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;