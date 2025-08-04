/**
 * Extracts the first image URL from HTML content
 * @param htmlContent - The HTML content to parse
 * @returns The first image URL found, or null if no image exists
 */
export function extractFirstImage(htmlContent: string): string | null {
  if (!htmlContent) return null;
  
  // Regular expression to match img tags and extract src attribute
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = htmlContent.match(imgRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Extracts the first image URL from HTML content or returns a fallback
 * @param htmlContent - The HTML content to parse
 * @param fallbackUrl - The fallback URL to use if no image is found
 * @returns The first image URL found, or the fallback URL
 */
export function extractFirstImageWithFallback(
  htmlContent: string, 
  fallbackUrl: string = 'https://placehold.co/600x400/1a1a1a/666666?text=Escola+Habilidade'
): string {
  return extractFirstImage(htmlContent) || fallbackUrl;
}