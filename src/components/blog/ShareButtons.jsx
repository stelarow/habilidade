import React, { useState } from 'react';
import { 
  FacebookLogo, 
  TwitterLogo, 
  LinkedinLogo, 
  WhatsappLogo, 
  LinkSimple, 
  Check, 
  Share 
} from 'phosphor-react';

const ShareButtons = ({ url, title, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(
    typeof navigator !== 'undefined' && navigator.share
  );

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
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
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

  // Handle social share
  const handleSocialShare = (platform) => {
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

  return (
    <div className="space-y-4">
      {/* Native Share (mobile only) */}
      {isWebShareSupported && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-3 w-full px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg transition-colors"
        >
          <Share size={20} />
          <span>Compartilhar</span>
        </button>
      )}

      {/* Social Media Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Facebook */}
        <button
          onClick={() => handleSocialShare('facebook')}
          className="flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FacebookLogo size={20} />
          <span className="font-medium">Facebook</span>
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleSocialShare('twitter')}
          className="flex items-center gap-3 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <TwitterLogo size={20} />
          <span className="font-medium">Twitter</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleSocialShare('linkedin')}
          className="flex items-center gap-3 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
        >
          <LinkedinLogo size={20} />
          <span className="font-medium">LinkedIn</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => handleSocialShare('whatsapp')}
          className="flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <WhatsappLogo size={20} />
          <span className="font-medium">WhatsApp</span>
        </button>
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
          copied 
            ? 'bg-green-600 text-white' 
            : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
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