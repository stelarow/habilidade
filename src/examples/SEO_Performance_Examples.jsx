/**
 * SEO & Performance Examples and Documentation
 * Complete usage examples for all implemented SEO and performance features
 */

import React, { useState, useEffect } from 'react';
import { useArticleSEO, usePageSEO } from '../hooks/useSEO';
import TableOfContents from '../components/blog/TableOfContents';
import { 
  PerformanceMonitor, 
  performanceAudit, 
  getRating, 
  getRatingColor 
} from '../utils/performanceUtils';
import { 
  generateMetaTags, 
  sanitizeTitle, 
  validateSEO,
  extractKeywords
} from '../utils/seoUtils';

// ===================================
// 1. SEO UTILS EXAMPLES
// ===================================

const SEOUtilsExamples = () => {
  const [seoValidation, setSeoValidation] = useState(null);
  
  // Example article data
  const articleData = {
    title: 'Como Otimizar SEO para Blogs em 2024',
    description: 'Guia completo com as melhores práticas de SEO para blogs, incluindo Core Web Vitals, estruturação de conteúdo e otimização técnica.',
    content: `
      <h1>Como Otimizar SEO para Blogs</h1>
      <h2>Introdução ao SEO</h2>
      <p>SEO é fundamental para o sucesso de qualquer blog...</p>
      <h2>Core Web Vitals</h2>
      <h3>Largest Contentful Paint (LCP)</h3>
      <p>O LCP mede o tempo de carregamento...</p>
      <h3>First Input Delay (FID)</h3>
      <p>O FID mede a interatividade...</p>
      <h2>Estruturação de Conteúdo</h2>
      <h3>Headers e Hierarquia</h3>
      <p>A estrutura de headers é crucial...</p>  
    `,
    url: '/blog/otimizar-seo-blogs-2024',
    author: 'Escola Habilidade',
    tags: ['seo', 'blogs', 'otimização', 'web vitals'],
    category: 'tecnologia'
  };

  // Example: Generate meta tags
  const metaTags = generateMetaTags({
    title: articleData.title,
    description: articleData.description,
    url: articleData.url,
    type: 'article',
    tags: articleData.tags,
    section: articleData.category
  });

  // Example: Sanitize title
  const sanitizedTitle = sanitizeTitle(articleData.title);

  // Example: Extract keywords
  const extractedKeywords = extractKeywords(articleData.content, { maxKeywords: 5 });

  // Example: Validate SEO
  useEffect(() => {
    const validation = validateSEO({
      title: articleData.title,
      description: articleData.description,
      url: articleData.url,
      image: null
    });
    setSeoValidation(validation);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 text-zinc-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-300">SEO Utils Examples</h2>
      
      {/* Meta Tags Example */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">1. Generated Meta Tags</h3>
        <div className="bg-zinc-800 p-4 rounded-lg overflow-x-auto">
          <pre className="text-sm text-green-400">
            {JSON.stringify(metaTags, null, 2)}
          </pre>
        </div>
      </section>

      {/* Title Sanitization */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">2. Title Sanitization</h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <p><strong>Original:</strong> {articleData.title}</p>
          <p><strong>Sanitized:</strong> {sanitizedTitle}</p>
        </div>
      </section>

      {/* Keyword Extraction */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">3. Keyword Extraction</h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <p><strong>Extracted Keywords:</strong></p>
          <div className="flex flex-wrap gap-2 mt-2">
            {extractedKeywords.map((keyword, index) => (
              <span key={index} className="px-2 py-1 bg-purple-600 rounded text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Validation */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">4. SEO Validation</h3>
        {seoValidation && (
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className={`font-bold ${seoValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                Score: {seoValidation.score}/100
              </span>
              <span className={`px-2 py-1 rounded text-sm ${seoValidation.isValid ? 'bg-green-600' : 'bg-red-600'}`}>
                {seoValidation.isValid ? 'Valid' : 'Issues Found'}
              </span>
            </div>
            
            {seoValidation.issues.length > 0 && (
              <div className="mb-3">
                <strong className="text-red-400">Issues:</strong>
                <ul className="list-disc list-inside mt-1">
                  {seoValidation.issues.map((issue, index) => (
                    <li key={index} className="text-red-300">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {seoValidation.warnings.length > 0 && (
              <div>
                <strong className="text-yellow-400">Warnings:</strong>
                <ul className="list-disc list-inside mt-1">
                  {seoValidation.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-300">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

// ===================================
// 2. useSEO HOOK EXAMPLES
// ===================================

const UseSEOHookExamples = () => {
  // Example: Article SEO
  const articleSEO = useArticleSEO({
    title: 'Meu Artigo Incrível sobre JavaScript',
    description: 'Aprenda JavaScript desde o básico até conceitos avançados.',
    slug: 'artigo-javascript-completo',
    tags: ['javascript', 'programação', 'web'],
    category: 'programação',
    author: 'João Silva',
    readingTime: 15
  });

  // Example: Page SEO
  const pageSEO = usePageSEO({
    title: 'Sobre Nós - Escola Habilidade',
    description: 'Conheça a história da Escola Habilidade e nossa missão.'
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 text-zinc-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-300">useSEO Hook Examples</h2>
      
      {/* Article SEO Status */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">1. Article SEO Status</h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Valid:</strong> {articleSEO.isValid ? '' : 'L'}</p>
              <p><strong>Score:</strong> {articleSEO.score}/100</p>
            </div>
            <div>
              <p><strong>Issues:</strong> {articleSEO.issues.length}</p>
              <p><strong>Warnings:</strong> {articleSEO.warnings.length}</p>
            </div>
          </div>
          
          {articleSEO.issues.length > 0 && (
            <div className="mt-4">
              <strong className="text-red-400">Issues:</strong>
              <ul className="list-disc list-inside mt-1">
                {articleSEO.issues.map((issue, index) => (
                  <li key={index} className="text-red-300">{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* SEO Utilities Demo */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">2. Available Utilities</h3>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => articleSEO.clearCache()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
            >
              Clear SEO Cache
            </button>
            <button
              onClick={() => {
                const validation = articleSEO.validateSEO();
                console.log('SEO Validation:', validation);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Validate SEO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ===================================
// 3. TABLE OF CONTENTS EXAMPLE
// ===================================

const TableOfContentsExample = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-zinc-900 text-zinc-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-300">Table of Contents Example</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article className="prose prose-zinc prose-invert max-w-none">
            <h1 id="introducao">Introdução ao SEO Moderno</h1>
            <p>O SEO mudou drasticamente nos últimos anos...</p>
            
            <h2 id="core-web-vitals">Core Web Vitals</h2>
            <p>Os Core Web Vitals são métricas essenciais...</p>
            
            <h3 id="lcp">Largest Contentful Paint (LCP)</h3>
            <p>O LCP mede o tempo de carregamento do maior elemento...</p>
            
            <h3 id="fid">First Input Delay (FID)</h3>
            <p>O FID mede o tempo entre a primeira interação...</p>
            
            <h3 id="cls">Cumulative Layout Shift (CLS)</h3>
            <p>O CLS mede a estabilidade visual da página...</p>
            
            <h2 id="otimizacao-tecnica">Otimização Técnica</h2>
            <p>A otimização técnica envolve vários aspectos...</p>
            
            <h3 id="meta-tags">Meta Tags</h3>
            <p>As meta tags são fundamentais para o SEO...</p>
            
            <h3 id="estruturados">Dados Estruturados</h3>
            <p>Os dados estruturados ajudam os motores de busca...</p>
            
            <h2 id="conteudo">Otimização de Conteúdo</h2>
            <p>O conteúdo continua sendo rei no SEO...</p>
            
            <h3 id="palavras-chave">Pesquisa de Palavras-chave</h3>    
            <p>A pesquisa de palavras-chave é o primeiro passo...</p>
          </article>
        </div>
        
        {/* TOC Sidebar */}
        <div className="lg:col-span-1">
          <TableOfContents 
            containerSelector="article"
            showProgress={true}
            collapsible={true}
            title="Navegação do Artigo"
          />
        </div>
      </div>
    </div>
  );
};

// ===================================
// 4. PERFORMANCE MONITORING EXAMPLE
// ===================================

const PerformanceExample = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [auditResults, setAuditResults] = useState(null);
  const [monitor, setMonitor] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Initialize performance monitor
  useEffect(() => {
    const perfMonitor = new PerformanceMonitor({
      enableMemoryTracking: true,
      enableBundleTracking: true,
      interval: 3000
    });
    
    setMonitor(perfMonitor);
    
    return () => {
      if (perfMonitor) {
        perfMonitor.stop();
      }
    };
  }, []);

  // Start monitoring
  const startMonitoring = () => {
    if (monitor && !isMonitoring) {
      monitor.start((metrics) => {
        setPerformanceData(metrics);
      });
      setIsMonitoring(true);
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    if (monitor && isMonitoring) {
      monitor.stop();
      setIsMonitoring(false);
    }
  };

  // Run performance audit
  const runAudit = async () => {
    try {
      const results = await performanceAudit();
      setAuditResults(results);
    } catch (error) {
      console.error('Performance audit failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-zinc-900 text-zinc-100">
      <h2 className="text-2xl font-bold mb-6 text-purple-300">Performance Monitoring Example</h2>
      
      {/* Controls */}
      <section className="mb-8">
        <div className="flex gap-4 mb-4">
          <button
            onClick={startMonitoring}
            disabled={isMonitoring}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition-colors"
          >
            Start Monitoring
          </button>
          <button
            onClick={stopMonitoring}
            disabled={!isMonitoring}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded transition-colors"
          >
            Stop Monitoring
          </button>
          <button
            onClick={runAudit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Run Audit
          </button>
        </div>
        
        <div className="text-sm text-zinc-400">
          Status: {isMonitoring ? '=â Monitoring Active' : '=4 Monitoring Stopped'}
        </div>
      </section>

      {/* Real-time Metrics */}
      {performanceData && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Real-time Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(performanceData).map(([key, metric]) => (
              <div key={key} className="bg-zinc-800 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">{metric.name || key}</h4>
                
                {metric.rating && (
                  <div className="mb-2">
                    <span className={`font-bold ${getRatingColor(metric.rating)}`}>
                      {metric.rating.toUpperCase()}
                    </span>
                  </div>
                )}
                
                {metric.value !== undefined && (
                  <div className="text-sm">
                    <strong>Value:</strong> {
                      typeof metric.value === 'number' 
                        ? metric.value.toFixed(2) 
                        : metric.value
                    }
                  </div>
                )}
                
                {metric.usage !== undefined && (
                  <div className="text-sm">
                    <strong>Usage:</strong> {metric.usage}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audit Results */}
      {auditResults && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Performance Audit Results</h3>
          
          {/* Summary */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong>Web Vitals Score:</strong> {auditResults.webVitalsScore}/100
              </div>
              <div>
                <strong>Status:</strong> {auditResults.webVitalsPassed ? ' Passed' : 'L Failed'}
              </div>
              <div>
                <strong>Audit Time:</strong> {auditResults.auditDuration}ms
              </div>
            </div>
          </div>

          {/* Web Vitals Details */}
          <div className="bg-zinc-800 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-3">Web Vitals Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(auditResults.webVitals).map(([key, metric]) => (
                <div key={key} className="text-center">
                  <div className="font-semibold">{key}</div>
                  <div className={`font-bold ${getRatingColor(metric.rating)}`}>
                    {metric.value?.toFixed(2)} {key === 'CLS' ? '' : 'ms'}
                  </div>
                  <div className="text-sm text-zinc-400">{metric.rating}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {auditResults.recommendations.length > 0 && (
            <div className="bg-zinc-800 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Recommendations</h4>
              {auditResults.recommendations.map((rec, index) => (
                <div key={index} className="mb-3 p-3 bg-zinc-700 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs ${
                      rec.priority === 'high' ? 'bg-red-600' : 
                      rec.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="font-semibold">{rec.type}</span>
                  </div>
                  <p className="text-sm text-zinc-300">{rec.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

// ===================================
// MAIN EXAMPLE COMPONENT
// ===================================

const SEOPerformanceExamples = () => {
  const [activeTab, setActiveTab] = useState('seo-utils');

  const tabs = [
    { id: 'seo-utils', label: 'SEO Utils', component: SEOUtilsExamples },
    { id: 'use-seo', label: 'useSEO Hook', component: UseSEOHookExamples },
    { id: 'table-of-contents', label: 'Table of Contents', component: TableOfContentsExample },
    { id: 'performance', label: 'Performance Monitor', component: PerformanceExample }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SEOUtilsExamples;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Navigation */}
      <nav className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-8">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default SEOPerformanceExamples;

// ===================================
// USAGE DOCUMENTATION
// ===================================

/*
# SEO & Performance Features Documentation

## 1. SEO Utils (`/src/utils/seoUtils.js`)

### Key Functions:
- `generateMetaTags()` - Comprehensive meta tags for OG/Twitter
- `generateStructuredData()` - JSON-LD Article schema
- `generateCanonicalUrl()` - Clean canonical URLs
- `sanitizeTitle()` - SEO-optimized titles
- `truncateDescription()` - Optimized descriptions
- `validateSEO()` - SEO validation with scoring
- `extractKeywords()` - Auto keyword extraction

### Example Usage:
```javascript
import { generateMetaTags, validateSEO } from '../utils/seoUtils';

const metaTags = generateMetaTags({
  title: 'My Article',
  description: 'Article description',
  url: '/blog/my-article',
  type: 'article'
});

const validation = validateSEO({
  title: 'My Article',
  description: 'Article description',
  url: '/blog/my-article'
});
```

## 2. useSEO Hook (`/src/hooks/useSEO.js`)

### Variants:
- `useSEO()` - Full-featured SEO management
- `usePageSEO()` - Simple page SEO
- `useArticleSEO()` - Blog article SEO with metrics

### Features:
- Automatic meta tag updates
- SEO validation with scoring
- Performance metrics
- Caching system

### Example Usage:
```javascript
import { useArticleSEO } from '../hooks/useSEO';

const MyBlogPost = ({ post }) => {
  const seo = useArticleSEO({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    tags: post.tags
  });

  return (
    <div>
      <h1>{post.title}</h1>
      {!seo.isValid && (
        <div>SEO Score: {seo.score}/100</div>
      )}
    </div>
  );
};
```

## 3. Table of Contents (`/src/components/blog/TableOfContents.jsx`)

### Features:
- Auto-extracts headers from content
- Smooth scroll navigation
- Mobile responsive (dropdown)
- Reading progress indicator
- URL hash updates

### Example Usage:
```javascript
import TableOfContents from '../components/blog/TableOfContents';

const BlogPost = () => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <main className="col-span-3">
        <article>
          <h1>My Article</h1>
          <h2>Section 1</h2>
          <h3>Subsection</h3>
        </article>
      </main>
      <aside className="col-span-1">
        <TableOfContents 
          containerSelector="article"
          showProgress={true}
          collapsible={true}
        />
      </aside>
    </div>
  );
};
```

## 4. Performance Utils (`/src/utils/performanceUtils.js`)

### Features:
- Web Vitals monitoring (LCP, FID, CLS)
- Memory usage tracking
- Bundle size analysis
- Performance auditing
- Real-time monitoring class

### Example Usage:
```javascript
import { PerformanceMonitor, performanceAudit } from '../utils/performanceUtils';

// Real-time monitoring
const monitor = new PerformanceMonitor();
monitor.start((metrics) => {
  console.log('Performance metrics:', metrics);
});

// One-time audit
const auditResults = await performanceAudit();
console.log('Audit results:', auditResults);
```

## Integration Examples

### BlogPost with all features:
```javascript
import { useArticleSEO } from '../hooks/useSEO';
import TableOfContents from '../components/blog/TableOfContents';
import { PerformanceMonitor } from '../utils/performanceUtils';

const BlogPost = ({ post }) => {
  // SEO management
  const seo = useArticleSEO({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    tags: post.tags,
    category: post.category,
    readingTime: post.readingTime
  });

  // Performance monitoring
  useEffect(() => {
    const monitor = new PerformanceMonitor();
    monitor.start();
    return () => monitor.stop();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-8">
      <main className="col-span-3">
        <article dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
      <aside className="col-span-1">
        <TableOfContents 
          containerSelector="article"
          showProgress={true}
        />
        {!seo.isValid && (
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            SEO Issues: {seo.issues.length}
          </div>
        )}
      </aside>
    </div>
  );
};
```

All features are fully integrated and ready for production use with the Habilidade design system.
*/