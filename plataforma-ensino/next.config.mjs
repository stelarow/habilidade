/** @type {import('next').NextConfig} */
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Exclude example folder from build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Environment-optimized TypeScript and ESLint checking
  typescript: {
    // Always validate types in production builds
    ignoreBuildErrors: false,
    // Use faster incremental checking in development
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    // Temporarily skip linting during builds for testing
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  
  // Configure images for optimal performance
  images: {
    domains: ['localhost', 'supabase.co', '*.supabase.co', 'escolahabilidade.com.br', '*.escolahabilidade.com.br'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600, // 1 hour cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
  },
  
  // Enable production optimizations
  experimental: {
    // Enable modern bundling optimizations
    optimizePackageImports: ['@radix-ui/react-icons', '@phosphor-icons/react'],
    // Improve server components performance
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  
  // Production-optimized webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        // Enable minification in production
        minimize: true,
        // Optimize module concatenation
        concatenateModules: true,
        // Remove unused exports
        usedExports: true,
        // Tree shake modules
        sideEffects: false,
        // Enhanced chunk splitting for optimal loading
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // React ecosystem (highest priority)
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 50,
            },
            // Next.js core
            nextjs: {
              test: /[\\/]node_modules[\\/](next)[\\/]/,
              name: 'nextjs',
              chunks: 'all',
              priority: 45,
            },
            // Heavy PDF libraries (separate from main bundle)
            pdf: {
              test: /[\\/]node_modules[\\/](pdfjs-dist|react-pdf)[\\/]/,
              name: 'pdf-libs',
              chunks: 'all',
              priority: 40,
              enforce: true, // Always create this chunk
            },
            // Rich text editor libraries
            editor: {
              test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
              name: 'editor-libs',
              chunks: 'all',
              priority: 35,
              enforce: true,
            },
            // Video and media libraries
            media: {
              test: /[\\/]node_modules[\\/](@mux|react-player)[\\/]/,
              name: 'media-libs',
              chunks: 'all',
              priority: 35,
              enforce: true,
            },
            // UI component libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|@headlessui|@heroicons|framer-motion)[\\/]/,
              name: 'ui-libs',
              chunks: 'all',
              priority: 30,
            },
            // Supabase and auth libraries
            supabase: {
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              name: 'supabase-libs',
              chunks: 'all',
              priority: 30,
            },
            // Forms and validation
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/,
              name: 'forms-libs',
              chunks: 'all',
              priority: 25,
            },
            // Utilities and smaller libraries
            utils: {
              test: /[\\/]node_modules[\\/](date-fns|clsx|class-variance-authority|tailwind-merge|crypto-js|jsonwebtoken|dompurify)[\\/]/,
              name: 'utils-libs',
              chunks: 'all',
              priority: 20,
            },
            // Common vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Application common code
            common: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            }
          }
        }
      };

      // Add performance hints for development feedback (relaxed for Netlify)
      config.performance = {
        hints: false, // Disable performance hints in production builds
        maxEntrypointSize: 500000, // 500KB (relaxed for Netlify)
        maxAssetSize: 500000, // 500KB (relaxed for Netlify)
      };
    }
    
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
      
      // Reduce server bundle size
      config.externals = [...(config.externals || []), 'canvas'];
    }
    
    return config;
  },
  
  // Output configuration for better caching
  output: 'standalone',
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Power Pack optimizations for performance
  poweredByHeader: false,
  compress: true,
  
  // Optimize redirects and rewrites
  async redirects() {
    const redirects = [];
    
    // In production, redirect debug/test routes to 404
    if (process.env.NODE_ENV === 'production') {
      redirects.push(
        // Test pages
        {
          source: '/test-:path*',
          destination: '/404',
          permanent: false,
        },
        {
          source: '/debug/:path*',
          destination: '/404',
          permanent: false,
        },
        {
          source: '/admin/test-:path*',
          destination: '/404',
          permanent: false,
        },
        // Test API routes
        {
          source: '/api/test-:path*',
          destination: '/api/404',
          permanent: false,
        }
      );
    }
    
    return redirects;
  },
  
  async rewrites() {
    return [];
  }
};

export default withBundleAnalyzer(nextConfig);