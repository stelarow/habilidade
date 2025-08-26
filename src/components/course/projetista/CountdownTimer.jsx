import React, { useState, useEffect } from 'react';
import { Clock } from '@phosphor-icons/react';

const CountdownTimer = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 45,
    seconds: 12
  });

  useEffect(() => {
    // Função para calcular o tempo restante até o próximo reset (a cada 8 dias)
    const calculateTimeLeft = () => {
      const now = new Date();
      const resetCycle = 8 * 24 * 60 * 60 * 1000; // 8 dias em millisegundos
      const epochStart = new Date('2024-01-01').getTime(); // Data base para sincronizar ciclos
      
      // Calcula quantos ciclos completos se passaram desde a data base
      const timeSinceEpoch = now.getTime() - epochStart;
      const cyclesPassed = Math.floor(timeSinceEpoch / resetCycle);
      
      // Calcula o próximo reset
      const nextReset = epochStart + (cyclesPassed + 1) * resetCycle;
      const timeRemaining = nextReset - now.getTime();
      
      // Converte para dias, horas, minutos e segundos
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };

    // Atualiza o timer imediatamente
    setTimeLeft(calculateTimeLeft());

    // Atualiza a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2 text-orange-400 ${className}`}>
      <Clock className="w-5 h-5 animate-pulse" />
      <span className="font-mono text-lg font-bold">
        ⏰ Timer: {timeLeft.days}d : {timeLeft.hours.toString().padStart(2, '0')}h : {timeLeft.minutes.toString().padStart(2, '0')}min : {timeLeft.seconds.toString().padStart(2, '0')}seg
      </span>
    </div>
  );
};

export default CountdownTimer;