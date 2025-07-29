/**
 * Business hours utilities for Escola Habilidade
 * Handles timezone detection, business hours validation, and status messages
 */

// Business hours configuration
const BUSINESS_HOURS = {
  // Monday = 1, Sunday = 0
  weekdays: [1, 2, 3, 4, 5], // Monday to Friday
  startHour: 8, // 8 AM
  endHour: 18, // 6 PM
  timezone: 'America/Sao_Paulo' // Brazil timezone
};

/**
 * Get current business hours status
 * @returns {Object} Business status object
 */
export const getBusinessHoursStatus = () => {
  try {
    const now = new Date();
    const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
    
    const currentDay = brTime.getDay();
    const currentHour = brTime.getHours();
    const currentMinute = brTime.getMinutes();
    const currentTime = currentHour + (currentMinute / 60);

    const isWeekday = BUSINESS_HOURS.weekdays.includes(currentDay);
    const isBusinessHours = currentTime >= BUSINESS_HOURS.startHour && currentTime < BUSINESS_HOURS.endHour;
    const isOpen = isWeekday && isBusinessHours;

    let message = '';
    let nextOpenTime = '';
    let estimatedResponseTime = '';

    if (isOpen) {
      // Currently open
      const closingTime = BUSINESS_HOURS.endHour;
      const hoursUntilClose = closingTime - currentTime;
      
      if (hoursUntilClose <= 1) {
        message = `=Í Online agora (fecha em ${Math.round(hoursUntilClose * 60)} minutos)`;
      } else {
        message = `=Í Online agora - Resposta imediata`;
      }
      estimatedResponseTime = 'Imediata';
    } else {
      // Currently closed
      if (!isWeekday) {
        // Weekend
        const nextMonday = getNextWeekday(brTime, 1);
        message = `ð Fechado (fim de semana) - Reabrimos na segunda às 8h`;
        nextOpenTime = nextMonday.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        estimatedResponseTime = 'Até 2 horas úteis';
      } else if (currentTime < BUSINESS_HOURS.startHour) {
        // Before business hours (same day)
        const hoursUntilOpen = BUSINESS_HOURS.startHour - currentTime;
        message = `ð Abrimos às 8h (em ${Math.round(hoursUntilOpen * 60)} minutos)`;
        estimatedResponseTime = 'Até 1 hora';
      } else {
        // After business hours
        const tomorrow = new Date(brTime);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (BUSINESS_HOURS.weekdays.includes(tomorrow.getDay())) {
          message = `ð Fechado - Reabrimos amanhã às 8h`;
          estimatedResponseTime = 'Até 2 horas úteis';
        } else {
          // Tomorrow is weekend, find next weekday
          const nextWeekday = getNextWeekday(brTime, 1);
          message = `ð Fechado - Reabrimos na segunda às 8h`;
          nextOpenTime = nextWeekday.toLocaleDateString('pt-BR', { 
            weekday: 'long',
            day: 'numeric',
            month: 'short'
          });
          estimatedResponseTime = 'Até 2 horas úteis';
        }
      }
    }

    return {
      isOpen,
      isWeekday,
      isBusinessHours,
      message,
      nextOpenTime,
      estimatedResponseTime,
      currentTime: brTime.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      currentDay: brTime.toLocaleDateString('pt-BR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
    };
  } catch (error) {
    console.error('Error getting business hours status:', error);
    return {
      isOpen: false,
      message: 'Horário de atendimento: Segunda a sexta, 8h às 18h',
      estimatedResponseTime: 'Até 24 horas'
    };
  }
};

/**
 * Get next occurrence of a specific weekday
 * @param {Date} date - Starting date
 * @param {number} targetDay - Target weekday (0=Sunday, 1=Monday, etc.)
 * @returns {Date} Next occurrence of the target weekday
 */
const getNextWeekday = (date, targetDay) => {
  const result = new Date(date);
  const currentDay = result.getDay();
  const daysUntilTarget = (targetDay + 7 - currentDay) % 7 || 7;
  
  result.setDate(result.getDate() + daysUntilTarget);
  result.setHours(BUSINESS_HOURS.startHour, 0, 0, 0);
  
  return result;
};

/**
 * Check if current time is within business hours
 * @returns {boolean} True if within business hours
 */
export const isWithinBusinessHours = () => {
  const status = getBusinessHoursStatus();
  return status.isOpen;
};

/**
 * Get estimated response time based on current time
 * @returns {string} Estimated response time message
 */
export const getEstimatedResponseTime = () => {
  const status = getBusinessHoursStatus();
  return status.estimatedResponseTime;
};

/**
 * Get business hours for display
 * @returns {string} Formatted business hours string
 */
export const getBusinessHoursString = () => {
  return 'Segunda a sexta, das 8h às 18h';
};

/**
 * Get next business day
 * @returns {Date} Next business day
 */
export const getNextBusinessDay = () => {
  const now = new Date();
  const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
  
  let nextDay = new Date(brTime);
  nextDay.setDate(nextDay.getDate() + 1);
  
  // Find next weekday
  while (!BUSINESS_HOURS.weekdays.includes(nextDay.getDay())) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  nextDay.setHours(BUSINESS_HOURS.startHour, 0, 0, 0);
  return nextDay;
};

/**
 * Format time until next business hours
 * @returns {string} Formatted time string
 */
export const getTimeUntilOpen = () => {
  const status = getBusinessHoursStatus();
  
  if (status.isOpen) {
    return 'Aberto agora';
  }
  
  const now = new Date();
  const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
  const nextOpen = getNextBusinessDay();
  
  const diffMs = nextOpen.getTime() - brTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHours === 0) {
    return `${diffMinutes} minutos`;
  } else if (diffHours < 24) {
    return `${diffHours}h ${diffMinutes}min`;
  } else {
    const days = Math.floor(diffHours / 24);
    const hours = diffHours % 24;
    return `${days} dia${days > 1 ? 's' : ''} ${hours}h`;
  }
};

/**
 * Get appropriate greeting based on time of day
 * @returns {string} Time-appropriate greeting
 */
export const getTimeBasedGreeting = () => {
  const now = new Date();
  const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
  const hour = brTime.getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Bom dia!';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde!';
  } else {
    return 'Boa noite!';
  }
};

/**
 * Check if it's weekend
 * @returns {boolean} True if weekend
 */
export const isWeekend = () => {
  const now = new Date();
  const brTime = new Date(now.toLocaleString("en-US", { timeZone: BUSINESS_HOURS.timezone }));
  const day = brTime.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Get contact priority based on business hours
 * Higher priority = more urgent response expected
 * @returns {number} Priority level (1-3)
 */
export const getContactPriority = () => {
  const status = getBusinessHoursStatus();
  
  if (status.isOpen) {
    return 3; // High priority - immediate response expected
  } else if (!status.isWeekday) {
    return 1; // Low priority - weekend, response within business days
  } else {
    return 2; // Medium priority - outside hours but weekday
  }
};