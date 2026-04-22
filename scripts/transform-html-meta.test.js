import test from 'node:test';
import assert from 'node:assert/strict';

import { transformHtml } from './transform-html-meta.js';

test('transformHtml replaces SSR meta tags with data-rh instead of duplicating them', () => {
  const input = `<!doctype html><html><head>
    <title data-rh="true">SSR title</title>
    <meta data-rh="true" name="description" content="SSR description">
    <meta data-rh="true" name="keywords" content="SSR keywords">
    <meta property="og:locale" content="pt_BR">
    <meta data-rh="true" name="twitter:card" content="summary_large_image">
    <meta data-rh="true" name="twitter:title" content="SSR twitter title">
    <meta data-rh="true" name="twitter:description" content="SSR twitter description">
    <meta data-rh="true" name="twitter:image" content="/ssr-image.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="description" content="Base description">
    <meta name="keywords" content="Base keywords">
    <meta name="author" content="Escola Habilidade">
    <title>Base title</title>
  </head><body></body></html>`;

  const output = transformHtml(input, '/cursos/marketing-digital');

  assert.equal((output.match(/<title\b/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="description"/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="keywords"/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="twitter:card"/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="twitter:title"/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="twitter:description"/g) || []).length, 1);
  assert.match(output, /Curso de Marketing Digital \| Google Ads, Facebook Ads, SEO \| São José SC/);
  assert.match(output, /Curso presencial de Marketing Digital em São José SC/);
});

test('transformHtml deduplicates SSR and base head tags even without page-specific config', () => {
  const input = `<!doctype html><html><head>
    <title data-rh="true">SSR blog title</title>
    <meta data-rh="true" name="twitter:card" content="summary_large_image">
    <meta data-rh="true" name="twitter:title" content="SSR twitter title">
    <meta name="twitter:card" content="summary_large_image">
    <title>Base title</title>
  </head><body></body></html>`;

  const output = transformHtml(input, '/blog/post-exemplo');

  assert.equal((output.match(/<title\b/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="twitter:card"/g) || []).length, 1);
  assert.equal((output.match(/<meta[^>]+name="twitter:title"/g) || []).length, 1);
  assert.match(output, /SSR blog title/);
});
