'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle, 
  Copy, 
  Mail,
  Link as LinkIcon,
  Check
} from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'minimal' | 'floating';
  className?: string;
}

export function ShareButtons({
  url = 'https://escolahabilidade.com.br/blog/post',
  title = 'Artigo Incrível do Blog',
  description = 'Descrição do artigo para compartilhamento',
  variant = 'default',
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description)
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}`,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      bgColor: 'bg-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}`,
      color: 'hover:bg-blue-50 hover:text-blue-800',
      bgColor: 'bg-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      color: 'hover:bg-green-50 hover:text-green-600',
      bgColor: 'bg-green-500'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
      color: 'hover:bg-gray-50 hover:text-gray-600',
      bgColor: 'bg-gray-500'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
  };

  // Floating Variant
  if (variant === 'floating') {
    return (
      <div className={`fixed right-6 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="sm"
            className="w-12 h-12 rounded-full gradient-button shadow-lg hover:shadow-xl transition-all"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          {isOpen && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-right-2">
              {socialPlatforms.slice(0, 3).map((platform) => (
                <Button
                  key={platform.name}
                  onClick={() => handleShare(platform)}
                  size="sm"
                  variant="outline"
                  className={`w-12 h-12 rounded-full ${platform.color} transition-all`}
                  title={`Compartilhar no ${platform.name}`}
                >
                  <platform.icon className="w-4 h-4" />
                </Button>
              ))}
              
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant="outline"
                className="w-12 h-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                title="Copiar link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal Variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">Compartilhar:</span>
        <div className="flex items-center gap-1">
          {socialPlatforms.slice(0, 4).map((platform) => (
            <Button
              key={platform.name}
              onClick={() => handleShare(platform)}
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 ${platform.color}`}
              title={`Compartilhar no ${platform.name}`}
            >
              <platform.icon className="w-4 h-4" />
            </Button>
          ))}
          
          <Button
            onClick={handleCopyLink}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
            title="Copiar link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <LinkIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Default Variant
  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Compartilhar artigo</h3>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Ajude outras pessoas a descobrir este conteúdo
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {socialPlatforms.map((platform) => (
              <Button
                key={platform.name}
                onClick={() => handleShare(platform)}
                variant="outline"
                className={`flex items-center gap-2 h-11 ${platform.color} transition-all`}
              >
                <platform.icon className="w-4 h-4" />
                <span className="text-sm">{platform.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="w-full px-3 py-2 text-sm bg-muted/50 border border-border/50 rounded-md focus:outline-none"
                />
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="h-10 px-4"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}