/**
 * E2E Tests for SEO Redirects and Canonical URLs
 * Validates domain consolidation and canonical URL implementation
 */

describe('SEO Redirects and Canonical URLs', () => {
  const domains = {
    primary: 'https://www.escolahabilidade.com',
    secondary: 'https://www.escolahabilidade.com.br',
    nonWww: 'https://escolahabilidade.com',
    nonWwwBr: 'https://escolahabilidade.com.br'
  };

  describe('Domain Redirects', () => {
    test('escolahabilidade.com should redirect to www.escolahabilidade.com', async () => {
      const response = await fetch(domains.nonWww, { redirect: 'manual' });
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(domains.primary + '/');
    });

    test('escolahabilidade.com.br should redirect to www.escolahabilidade.com', async () => {
      const response = await fetch(domains.nonWwwBr, { redirect: 'manual' });
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(domains.primary + '/');
    });

    test('www.escolahabilidade.com.br should redirect to www.escolahabilidade.com', async () => {
      const response = await fetch(domains.secondary, { redirect: 'manual' });
      expect(response.status).toBe(301);
      expect(response.headers.get('location')).toBe(domains.primary + '/');
    });

    test('Deep links should redirect correctly', async () => {
      const paths = ['/blog', '/cursos', '/contato'];
      
      for (const path of paths) {
        const response = await fetch(domains.nonWwwBr + path, { redirect: 'manual' });
        expect(response.status).toBe(301);
        expect(response.headers.get('location')).toBe(domains.primary + path);
      }
    });
  });

  describe('Canonical URLs', () => {
    test('Homepage should have correct canonical URL', async () => {
      const response = await fetch(domains.primary);
      const html = await response.text();
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
      
      expect(canonicalMatch).toBeTruthy();
      expect(canonicalMatch[1]).toBe(domains.primary + '/');
    });

    test('Blog page should have correct canonical URL', async () => {
      const response = await fetch(domains.primary + '/blog');
      const html = await response.text();
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
      
      expect(canonicalMatch).toBeTruthy();
      expect(canonicalMatch[1]).toBe(domains.primary + '/blog');
    });

    test('Blog post should have correct canonical URL', async () => {
      const slug = 'guia-completo-21-estilos-decoracao-transformar-casa';
      const response = await fetch(domains.primary + '/blog/' + slug);
      const html = await response.text();
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
      
      expect(canonicalMatch).toBeTruthy();
      expect(canonicalMatch[1]).toBe(domains.primary + '/blog/' + slug);
    });

    test('Course pages should have correct canonical URL', async () => {
      const courses = ['sketchup-3d', 'informatica-completa', 'revit-completo'];
      
      for (const course of courses) {
        const response = await fetch(domains.primary + '/cursos/' + course);
        const html = await response.text();
        const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
        
        expect(canonicalMatch).toBeTruthy();
        expect(canonicalMatch[1]).toBe(domains.primary + '/cursos/' + course);
      }
    });

    test('Local pages should have correct canonical URL', async () => {
      const localPages = ['cursos-florianopolis', 'cursos-sao-jose', 'cursos-palhoca'];
      
      for (const page of localPages) {
        const response = await fetch(domains.primary + '/' + page);
        const html = await response.text();
        const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
        
        expect(canonicalMatch).toBeTruthy();
        expect(canonicalMatch[1]).toBe(domains.primary + '/' + page);
      }
    });
  });

  describe('Meta Tags Consistency', () => {
    test('OG URL should match canonical URL', async () => {
      const response = await fetch(domains.primary);
      const html = await response.text();
      
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
      const ogUrlMatch = html.match(/<meta property="og:url" content="([^"]+)"/);
      
      expect(canonicalMatch).toBeTruthy();
      expect(ogUrlMatch).toBeTruthy();
      expect(canonicalMatch[1]).toBe(ogUrlMatch[1]);
    });

    test('All internal links should point to primary domain', async () => {
      const response = await fetch(domains.primary);
      const html = await response.text();
      
      // Check for any links to .com.br domain
      const brLinks = html.match(/href="[^"]*escolahabilidade\.com\.br/g);
      expect(brLinks).toBeFalsy();
      
      // Check that sitemap uses primary domain
      const sitemapMatch = html.match(/<link rel="sitemap"[^>]*href="([^"]+)"/);
      if (sitemapMatch) {
        expect(sitemapMatch[1]).toContain('www.escolahabilidade.com');
      }
    });
  });

  describe('Search Console Requirements', () => {
    test('Robots meta should be correct', async () => {
      const response = await fetch(domains.primary);
      const html = await response.text();
      
      // Should not have noindex on main pages
      const noindexMatch = html.match(/<meta name="robots" content="[^"]*noindex/);
      expect(noindexMatch).toBeFalsy();
    });

    test('Sitemap should be accessible', async () => {
      const response = await fetch(domains.primary + '/sitemap.xml');
      expect(response.status).toBe(200);
      
      const xml = await response.text();
      expect(xml).toContain('<?xml');
      expect(xml).toContain('<urlset');
      expect(xml).toContain('www.escolahabilidade.com');
      expect(xml).not.toContain('escolahabilidade.com.br');
    });

    test('Robots.txt should be configured correctly', async () => {
      const response = await fetch(domains.primary + '/robots.txt');
      const text = await response.text();
      
      expect(text).toContain('User-agent: *');
      expect(text).toContain('Sitemap: https://www.escolahabilidade.com/sitemap.xml');
      expect(text).not.toContain('escolahabilidade.com.br');
    });
  });
});

/**
 * Run tests with: npm run test:seo
 * Or specific: npm test -- seo-redirects.test.js
 */