import React, { useState } from 'react';
import { 
  FacebookLogo, 
  TwitterLogo, 
  LinkedinLogo, 
  WhatsappLogo, 
  LinkSimple, 
  Check, 
  Share 
} from '@phosphor-icons/react';

const ShareButtons = ({ url, title, compact = false, variant = 'default' }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check Web Share API support after component mounts  
  React.useEffect(() => {
    // Only check if we're in a browser environment
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setIsWebShareSupported(true);
    }
  }, []);

  // Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
  };

  // Handle native share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share( {
          title: title,
          url: url,
        });
      } catch (error) {
        console.log('Share cancelled or error:', error);
      }
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Failed to copy: ', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  // Handle social share with mobile optimization
  const handleSocialShare = (platform) => {
    // On mobile, open in same tab for better UX
    if (isMobile) {
      window.open(shareUrls[platform], '_blank');
      return;
    }
    
    // Desktop popup window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      shareUrls[platform],
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  // Compact variant (inline icons)
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* Native Share (mobile) */}
        {isWebShareSupported && (
          <button
            onClick={handleNativeShare}
            className="p-2 text-zinc-400 hover:text-purple-300 transition-colors"
            aria-label="Compartilhar"
          >
            <Share size={20} />
          </button>
        )}

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="p-2 text-zinc-400 hover:text-purple-300 transition-colors"
          aria-label="Copiar link"
        >
          {copied ? <Check size={20} className="text-green-400" /> : <LinkSimple size={20} />}
        </button>
      </div>
    );
  }

  // Minimal variant (subtle, modern design)
  if (variant === 'minimal') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <span className="text-sm text-zinc-400 font-medium">Compartilhar</span>
        </div>
        
        {/* Social Icons in horizontal line */}
        <div className="flex items-center justify-center gap-4">
          {/* Facebook */}
          <button
            onClick={() => handleSocialShare('facebook')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-600/20 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200"
            aria-label="Compartilhar no Facebook"
          >
            <FacebookLogo 
              size={18} 
              className="text-zinc-400 group-hover:text-blue-400 transition-colors" 
            />
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleSocialShare('twitter')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-sky-600/20 border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200"
            aria-label="Compartilhar no Twitter"
          >
            <TwitterLogo 
              size={18} 
              className="text-zinc-400 group-hover:text-sky-400 transition-colors" 
            />
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleSocialShare('linkedin')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-700/20 border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200"
            aria-label="Compartilhar no LinkedIn"
          >
            <LinkedinLogo 
              size={18} 
              className="text-zinc-400 group-hover:text-blue-400 transition-colors" 
            />
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-green-600/20 border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200"
            aria-label="Compartilhar no WhatsApp"
          >
            <WhatsappLogo 
              size={18} 
              className="text-zinc-400 group-hover:text-green-400 transition-colors" 
            />
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
              copied 
                ? 'bg-green-600/20 border-green-500/30' 
                : 'bg-zinc-800/50 hover:bg-zinc-600/20 border-zinc-700/50 hover:border-zinc-500/30'
            }`}
            aria-label="Copiar link"
          >
            {copied ? (
              <Check size={18} className="text-green-400" />
            ) : (
              <LinkSimple 
                size={18} 
                className="text-zinc-400 group-hover:text-zinc-300 transition-colors" 
              />
            )}
          </button>
        </div>

        {/* Native Share for mobile */}
        {isWebShareSupported && (
          <div className="flex justify-center">
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-zinc-200 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 text-sm"
            >
              <Share size={16} />
              <span>Compartilhar</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default variant (current implementation but improved)
  return (
    <div className="space-y-4">
      {/* Native Share (mobile only) */}
      {isWebShareSupported && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200"
        >
          <Share size={20} />
          <span>Compartilhar</span>
        </button>
      )}

      {/* Social Media Buttons - Improved styling */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {/* Facebook */}
        <button
          onClick={() => handleSocialShare('facebook')}
          className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200"
        >
          <FacebookLogo size={20} className="text-blue-400" />
          <span className="font-medium">Facebook</span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleSocialShare('twitter')}
          className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-sky-600/10 text-zinc-200 hover:text-sky-300 rounded-lg border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200"
        >
          <TwitterLogo size={20} className="text-sky-400" />
          <span className="font-medium">Twitter</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleSocialShare('linkedin')}
          className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200"
        >
          <LinkedinLogo size={20} className="text-blue-500" />
          <span className="font-medium">LinkedIn</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleSocialShare('whatsapp')}
          className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-green-600/10 text-zinc-200 hover:text-green-300 rounded-lg border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200"
        >
          <WhatsappLogo size={20} className="text-green-400" />
          <span className="font-medium">WhatsApp</span>
        </button>
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
          copied 
            ? 'bg-green-600/20 border-green-500/30 text-green-300' 
            : 'bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 border-zinc-700/50 hover:border-zinc-600/50'
        }`}
      >
        {copied ? (
          <>
            <Check size={20} />
            <span>Link copiado!</span>
          </>
        ) : (
          <>
            <LinkSimple size={20} />
            <span>Copiar link</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;