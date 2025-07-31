'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { CTAConfiguration, UrgencyConfig } from '@/types/cta';
import { useCTATracking } from '@/hooks/useCTATracking';
import { 
  Clock, 
  AlertTriangle, 
  Flame,
  Users,
  Star,
  Timer,
  TrendingUp
} from 'lucide-react';

interface UrgencyCTAProps {
  config: CTAConfiguration;
  urgencyConfig: UrgencyConfig;
  className?: string;
  onAction?: () => void;
  onExpired?: () => void;
}

export function UrgencyCTA({
  config,
  urgencyConfig,
  className = '',
  onAction,
  onExpired
}: UrgencyCTAProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [isExpired, setIsExpired] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(urgencyConfig.quantity || 0);
  const [demandLevel, setDemandLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  const { trackEvent } = useCTATracking({
    ctaId: config.id,
    trackViews: true,
    trackClicks: true,
    trackConversions: true,
  });

  // Update countdown timer
  useEffect(() => {
    if (urgencyConfig.type === 'time' && urgencyConfig.deadline && urgencyConfig.showCountdown) {
      const updateTimer = () => {
        const now = new Date();
        const deadline = new Date(urgencyConfig.deadline!);
        
        if (now >= deadline) {
          setIsExpired(true);
          if (onExpired) {
            onExpired();
          }
          return;
        }

        const totalSeconds = differenceInSeconds(deadline, now);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [urgencyConfig.type, urgencyConfig.deadline, urgencyConfig.showCountdown, onExpired]);

  // Simulate quantity decrease for quantity-based urgency
  useEffect(() => {
    if (urgencyConfig.type === 'quantity' && urgencyConfig.quantity) {
      const interval = setInterval(() => {
        setCurrentQuantity(prev => {
          const newQuantity = Math.max(0, prev - Math.floor(Math.random() * 3));
          if (newQuantity === 0) {
            setIsExpired(true);
            if (onExpired) {
              onExpired();
            }
          }
          return newQuantity;
        });
      }, 30000); // Decrease every 30 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [urgencyConfig.type, urgencyConfig.quantity, onExpired]);

  // Simulate demand level changes
  useEffect(() => {
    if (urgencyConfig.type === 'demand') {
      const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      const interval = setInterval(() => {
        setDemandLevel(levels[Math.floor(Math.random() * levels.length)]);
      }, 45000); // Change every 45 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [urgencyConfig.type]);

  // Track view when component mounts
  useEffect(() => {
    trackEvent('view');
  }, [trackEvent]);

  const handleAction = () => {
    trackEvent('click');
    if (onAction) {
      onAction();
    }
  };

  const getBorderRadiusClass = (radius: string = 'md') => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    };
    return radiusMap[radius as keyof typeof radiusMap] || 'rounded-md';
  };

  const getUrgencyColors = () => {
    switch (urgencyConfig.type) {
      case 'time':
        return {
          bg: 'from-red-500 to-orange-500',
          text: 'text-red-100',
          accent: 'text-yellow-300',
          border: 'border-red-400'
        };
      case 'quantity':
        return {
          bg: 'from-orange-500 to-yellow-500',
          text: 'text-orange-100',
          accent: 'text-yellow-200',
          border: 'border-orange-400'
        };
      case 'demand':
        return {
          bg: 'from-purple-500 to-pink-500',
          text: 'text-purple-100',
          accent: 'text-pink-200',
          border: 'border-purple-400'
        };
      case 'seasonal':
        return {
          bg: 'from-green-500 to-teal-500',
          text: 'text-green-100',
          accent: 'text-teal-200',
          border: 'border-green-400'
        };
      default:
        return {
          bg: 'from-red-500 to-orange-500',
          text: 'text-red-100',
          accent: 'text-yellow-300',
          border: 'border-red-400'
        };
    }
  };

  const getUrgencyIcon = () => {
    switch (urgencyConfig.type) {
      case 'time':
        return Timer;
      case 'quantity':
        return Users;
      case 'demand':
        return TrendingUp;
      case 'seasonal':
        return Star;
      default:
        return Clock;
    }
  };

  const getUrgencyBadge = () => {
    switch (urgencyConfig.type) {
      case 'time':
        return 'INSCRIÇÕES ABERTAS';
      case 'quantity':
        return 'INSCRIÇÕES ABERTAS';
      case 'demand':
        return demandLevel === 'high' ? 'ALTA DEMANDA' : 'EM ALTA';
      case 'seasonal':
        return 'CURSO DISPONÍVEL';
      default:
        return 'INSCRIÇÕES ABERTAS';
    }
  };

  const colors = getUrgencyColors();
  const UrgencyIcon = getUrgencyIcon();

  if (isExpired) {
    return null; // Don't render if expired
  }

  return (
    <div className={`${className} w-full`}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`relative overflow-hidden ${getBorderRadiusClass(
            config.design.borderRadius
          )} ${colors.border} border-2`}
        >
          {/* Animated Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} opacity-90`} />
          
          {/* Pulsing Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${colors.bg}`}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <CardContent className="relative z-10 p-6">
            <div className="flex items-center gap-4">
              {/* Icon Section */}
              <motion.div
                className="flex-shrink-0"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm ${colors.text}`}>
                  <UrgencyIcon className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Content Section */}
              <div className="flex-1 space-y-3">
                {/* Badge */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Badge 
                    className={`${colors.accent} bg-white/20 backdrop-blur-sm font-bold text-xs`}
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    {getUrgencyBadge()}
                  </Badge>
                </motion.div>

                {/* Title and Description */}
                <div className={`space-y-1 ${colors.text}`}>
                  <h3 className="text-xl font-bold leading-tight">
                    {config.content.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {urgencyConfig.message}
                  </p>
                </div>

                {/* Urgency Indicators */}
                <div className="space-y-2">
                  {/* Time-based countdown */}
                  {urgencyConfig.type === 'time' && urgencyConfig.showCountdown && (
                    <motion.div
                      className={`flex items-center gap-4 ${colors.accent}`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Clock className="h-4 w-4" />
                      <div className="flex gap-2 text-lg font-mono font-bold">
                        {timeLeft.days > 0 && (
                          <span>{timeLeft.days}d</span>
                        )}
                        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                        <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Quantity-based indicator */}
                  {urgencyConfig.type === 'quantity' && (
                    <motion.div
                      className={`flex items-center gap-2 ${colors.accent}`}
                      animate={{ x: [0, 2, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 1 }}
                    >
                      <Users className="h-4 w-4" />
                      <span className="font-bold">
                        {currentQuantity} inscrições em aberto
                      </span>
                      {currentQuantity <= 5 && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <AlertTriangle className="h-4 w-4 text-yellow-300" />
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Demand-based indicator */}
                  {urgencyConfig.type === 'demand' && (
                    <motion.div
                      className={`flex items-center gap-2 ${colors.accent}`}
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">
                        {demandLevel === 'high' 
                          ? '🎆 Curso em destaque hoje!'
                          : '📈 Interesse crescente neste curso'
                        }
                      </span>
                    </motion.div>
                  )}

                  {/* Seasonal indicator */}
                  {urgencyConfig.type === 'seasonal' && urgencyConfig.deadline && (
                    <div className={`flex items-center gap-2 ${colors.accent}`}>
                      <Star className="h-4 w-4" />
                      <span className="font-bold">
                        Inscrições abertas até {format(new Date(urgencyConfig.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pt-2"
                >
                  <Button
                    onClick={handleAction}
                    className={`bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-lg ${getBorderRadiusClass(
                      config.design.borderRadius
                    )}`}
                    size="lg"
                  >
                    {config.content.buttonText}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      �
                    </motion.div>
                  </Button>
                </motion.div>

                {/* Subtext */}
                {config.content.subtext && (
                  <p className={`text-xs opacity-80 ${colors.text}`}>
                    {config.content.subtext}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          {/* Animated Border Effect */}
          <motion.div
            className={`absolute inset-0 border-2 ${colors.border} rounded-lg`}
            animate={{ 
              boxShadow: [
                '0 0 0px rgba(239, 68, 68, 0.5)',
                '0 0 20px rgba(239, 68, 68, 0.8)',
                '0 0 0px rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </Card>
      </motion.div>
    </div>
  );
}

export default UrgencyCTA;