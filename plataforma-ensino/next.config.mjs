import { withSentryConfig } from '@sentry/nextjs';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude example folder from build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Configure images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'phosphor-react'],
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  
  // Configure webpack for PDF.js compatibility
  webpack: (config, { isServer }) => {
    // Exclude example folder from compilation
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /Exemplo-pagina-aula/,
    });
    
    // Prevent PDF.js from being bundled on server to avoid DOMMatrix errors
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      fs: false,
    };
    
    // Server-specific configuration for PDF.js
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
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

// Conditionally apply Sentry config only if properly configured
const finalConfig = process.env.SENTRY_ORG && process.env.SENTRY_PROJECT 
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      
      // Make auth token optional - only upload source maps if token is available
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      
      // Source map configuration
      widenClientFileUpload: true,
      hideSourceMaps: true, // Hide source maps from browser devtools in production
      disableLogger: true,
      
      // Upload source maps only if auth token is available
      dryRun: !process.env.SENTRY_AUTH_TOKEN, // Skip upload if no auth token
      
      // Vercel integration
      automaticVercelMonitors: true,
      
      // Disable Sentry in development to prevent header processing issues
      disableServerWebpackPlugin: process.env.NODE_ENV === 'development',
      disableClientWebpackPlugin: process.env.NODE_ENV === 'development',
    })
  : nextConfig;

export default withBundleAnalyzer(finalConfig);
