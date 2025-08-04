import { extractFirstImage, extractFirstImageWithFallback } from './extract-first-image';

// Test with actual blog content
const testContent = `<div class="article-content max-w-4xl mx-auto prose prose-lg">
<h1 class="text-3xl font-bold mb-8">Como Usar SketchUp para Design Conceitual Arquitetônico: Guia Completo</h1>

<img src="/images/blog/sketchup-design-conceitual/home-banner-image.jpg" alt="Design conceitual arquitetônico no SketchUp" class="w-full h-auto rounded-lg shadow-md mb-6">

<p class="mb-4 leading-relaxed text-gray-700">Quando se trata de explorar ideias iniciais em arquitetura...</p>
</div>`;

console.log('Testing extractFirstImage function:');
console.log('-----------------------------------');

const result = extractFirstImage(testContent);
console.log('Extracted image URL:', result);

const resultWithFallback = extractFirstImageWithFallback(testContent);
console.log('With fallback:', resultWithFallback);

// Test with no image
const noImageContent = '<div>No image here</div>';
console.log('\nTesting with no image:');
console.log('Result:', extractFirstImage(noImageContent));
console.log('With fallback:', extractFirstImageWithFallback(noImageContent));

// Test with different image formats
const testCases = [
  '<img src="test.jpg">',
  "<img src='test.png'>",
  '<img class="test" src="/path/to/image.webp" alt="test">',
  '<img src="https://example.com/image.jpg" />',
];

console.log('\nTesting various formats:');
testCases.forEach((html, i) => {
  console.log(`Test ${i + 1}: ${extractFirstImage(html)}`);
});