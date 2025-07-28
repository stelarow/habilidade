'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  WhatsApp, 
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: '#4267B2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      icon: WhatsApp,
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: 'Email',
      icon: Mail,
      color: '#EA4335',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
    }
  ];

  if (variant === 'floating') {
    return (
      <div className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
        <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-xl">
          <CardContent className="p-2">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 p-0 hover:bg-primary/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              {isOpen && (
                <>
                  {shareOptions.map((option) => (
                    <Button
                      key={option.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(option.url, '_blank', 'noopener,noreferrer')}
                      className="h-10 w-10 p-0 hover:bg-primary/10"
                      title={`Compartilhar no ${option.name}`}
                    >
                      <option.icon className="w-4 h-4" style={{ color: option.color }} />
                    </Button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-10 w-10 p-0 hover:bg-primary/10"
                    title="Copiar link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-muted-foreground">
          Compartilhar:
        </span>
        
        <div className="flex items-center gap-1">
          {shareOptions.slice(0, 3).map((option) => (
            <Button
              key={option.name}
              variant="ghost"
              size="sm"
              onClick={() => window.open(option.url, '_blank', 'noopener,noreferrer')}
              className="h-8 w-8 p-0 hover:bg-muted/50"
              title={`Compartilhar no ${option.name}`}
            >
              <option.icon className="w-3 h-3" style={{ color: option.color }} />
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0 hover:bg-muted/50"
            title="Copiar link"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Compartilhar artigo</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {shareOptions.map((option) => (
            <Button
              key={option.name}
              variant="outline"
              size="sm"
              onClick={() => window.open(option.url, '_blank', 'noopener,noreferrer')}
              className="h-10 justify-start gap-2 hover:scale-105 transition-all bg-background/50 border-border/30"
            >
              <option.icon 
                className="w-4 h-4" 
                style={{ color: option.color }} 
              />
              <span className="text-xs">{option.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 bg-background/50 border border-border/30 rounded text-xs text-muted-foreground truncate">
              {url}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="h-9 px-3 hover:scale-105 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  <span className="text-xs">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="text-xs">Copiar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}