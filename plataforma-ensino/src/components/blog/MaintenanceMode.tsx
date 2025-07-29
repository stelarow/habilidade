'use client';

/**
 * MaintenanceMode Component - Interface de usuário para modo de manutenção
 * Feature: FEATURE_003_MAINTENANCE_MODE
 * 
 * Fornece uma interface fullscreen para informar usuários sobre manutenções ativas,
 * com bypass discreto para administradores e informações de contato.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Shield,
  RefreshCw,
  MessageCircle,
  Mail,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { MaintenanceWindow } from '@/services/maintenanceService';

interface MaintenanceModeProps {
  maintenance: MaintenanceWindow;
  userHasBypass?: boolean;
  isAdmin?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export function MaintenanceMode({ 
  maintenance, 
  userHasBypass = false, 
  isAdmin = false,
  onRefresh,
  refreshing = false 
}: MaintenanceModeProps) {
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  // Calculate countdown to end time
  useEffect(() => {
    setMounted(true);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = maintenance.endTime.getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ hours, minutes, seconds });
      } else {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [maintenance.endTime]);

  // Format WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Olá! Estou tentando acessar a plataforma Habilidade mas está em manutenção. Preciso de suporte urgente. Manutenção: ${maintenance.title}`
  );

  const whatsappUrl = `https://wa.me/5548988559491?text=${whatsappMessage}`;

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Admin Bypass Notice */}
      <AdminMaintenanceNotice 
        isVisible={userHasBypass || isAdmin}
        maintenanceTitle={maintenance.title}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mx-auto mb-4 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center"
              >
                <Settings className="w-8 h-8 text-white" />
              </motion.div>
              
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {maintenance.title}
              </CardTitle>
              
              <p className="text-blue-100 text-lg">
                {maintenance.description || 'Estamos realizando melhorias em nossa plataforma'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Countdown Timer */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo Estimado para Conclusão
                </h3>
                
                <div className="flex justify-center gap-4">
                  <CountdownUnit value={countdown.hours} label="Horas" />
                  <CountdownUnit value={countdown.minutes} label="Minutos" />
                  <CountdownUnit value={countdown.seconds} label="Segundos" />
                </div>
                
                <p className="text-blue-200 mt-4">
                  Previsão de conclusão: {format(maintenance.endTime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              {/* Affected Services */}
              {maintenance.affectedServices.length > 0 && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Serviços Afetados
                  </h3>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {maintenance.affectedServices.map((service, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-red-500/20 text-red-100 border-red-300/30"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Options */}
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Precisa de Suporte Urgente?
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <a href="mailto:suporte@escolahabilidade.com.br">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
                
                <p className="text-blue-200 text-sm">
                  Nossa equipe estará disponível para emergências
                </p>
              </div>

              {/* Social Links */}
              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-blue-200 mb-3">Acompanhe nossas atualizações:</p>
                <div className="flex justify-center gap-4">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-blue-200 hover:text-white hover:bg-white/10"
                  >
                    <a href="https://instagram.com/escolahabilidade" target="_blank" rel="noopener noreferrer">
                      Instagram
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                  
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-blue-200 hover:text-white hover:bg-white/10"
                  >
                    <a href="https://escolahabilidade.com.br" target="_blank" rel="noopener noreferrer">
                      Site Principal
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="text-center">
                <Button
                  onClick={onRefresh}
                  disabled={refreshing}
                  variant="ghost"
                  size="sm"
                  className="text-blue-200 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Atualizando...' : 'Atualizar Status'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Countdown Unit Component
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/20 backdrop-blur rounded-lg p-3 min-w-[60px]"
      >
        <div className="text-2xl font-bold text-white">
          {value.toString().padStart(2, '0')}
        </div>
      </motion.div>
      <div className="text-sm text-blue-200 mt-1">{label}</div>
    </div>
  );
}

// Admin Bypass Notice Component
function AdminMaintenanceNotice({ 
  isVisible, 
  maintenanceTitle 
}: { 
  isVisible: boolean; 
  maintenanceTitle: string; 
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-orange-600 text-white py-2 px-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">
            Modo Bypass Ativo - {maintenanceTitle}
          </span>
        </div>
        
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-white hover:bg-orange-700"
        >
          <a href="/admin/blog/maintenance">
            <Settings className="w-4 h-4 mr-1" />
            Painel de Controle
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

export default MaintenanceMode;