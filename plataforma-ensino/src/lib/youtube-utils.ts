/**
 * YouTube URL utilities for validation and processing
 */

// YouTube URL patterns for validation
const YOUTUBE_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /^https?:\/\/(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
]

/**
 * Extracts YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null
  
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) {
      return match[2] // Video ID is in the second capture group
    }
  }
  
  return null
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url) return false
  return YOUTUBE_PATTERNS.some(pattern => pattern.test(url))
}

/**
 * Validates if a YouTube video ID is properly formatted
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
  if (!videoId) return false
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
}

/**
 * Converts any YouTube URL to embed format
 */
export function convertToYouTubeEmbed(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return url
  
  return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'}`
}

/**
 * Validates YouTube URL and returns formatted result
 */
export function validateAndFormatYouTubeUrl(url: string): {
  isValid: boolean
  videoId: string | null
  embedUrl: string | null
  error?: string
} {
  if (!url) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      error: 'URL is required'
    }
  }
  
  if (!isValidYouTubeUrl(url)) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      error: 'Invalid YouTube URL format'
    }
  }
  
  const videoId = extractYouTubeVideoId(url)
  if (!videoId || !isValidYouTubeVideoId(videoId)) {
    return {
      isValid: false,
      videoId,
      embedUrl: null,
      error: 'Invalid YouTube video ID'
    }
  }
  
  return {
    isValid: true,
    videoId,
    embedUrl: convertToYouTubeEmbed(url)
  }
}

/**
 * Checks if a YouTube video exists (client-side only)
 * Note: This is a basic check and may not work for all cases due to CORS
 */
export async function checkYouTubeVideoExists(videoId: string): Promise<boolean> {
  if (!videoId || !isValidYouTubeVideoId(videoId)) {
    return false
  }
  
  try {
    // Use YouTube oEmbed API to check if video exists
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { method: 'GET' }
    )
    
    return response.ok
  } catch (error) {
    console.warn('Unable to verify YouTube video existence:', error)
    return true // Assume valid if we can't check
  }
}