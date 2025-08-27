import { useState, useEffect } from 'react';

/**
 * Componente de timer de contagem regressiva que sempre mostra uma semana 
 * restante a partir da próxima segunda-feira
 */
export const CountdownTimer = ({ 
  className = "", 
  textClassName = "text-yellow-400",
  bgClassName = "bg-yellow-400/20" 
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Encontrar a próxima segunda-feira
      const nextMonday = new Date(now);
      const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7; // 1 = Segunda-feira
      nextMonday.setDate(now.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0);
      
      // Calcular diferença
      const difference = nextMonday - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        return { days, hours, minutes, seconds };
      } else {
        // Se já passou da próxima segunda, reinicia para a segunda seguinte
        return { days: 7, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Atualizar imediatamente
    setTimeLeft(calculateTimeLeft());
    
    // Atualizar a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex items-center gap-2 font-mono font-bold ${textClassName} ${className}`}>
      <span className={`px-2 py-1 ${bgClassName} rounded text-sm`}>
        {timeLeft.days}d
      </span>
      <span>:</span>
      <span className={`px-2 py-1 ${bgClassName} rounded text-sm`}>
        {timeLeft.hours.toString().padStart(2, '0')}h
      </span>
      <span>:</span>
      <span className={`px-2 py-1 ${bgClassName} rounded text-sm`}>
        {timeLeft.minutes.toString().padStart(2, '0')}m
      </span>
      <span>:</span>
      <span className={`px-2 py-1 ${bgClassName} rounded text-sm`}>
        {timeLeft.seconds.toString().padStart(2, '0')}s
      </span>
    </div>
  );
};