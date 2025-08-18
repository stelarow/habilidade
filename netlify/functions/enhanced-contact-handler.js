/**
 * Enhanced Contact Handler com logging detalhado para produção
 * Demonstra uso completo do ProductionLogger para debugging
 */

const { withProductionLogger } = require('./utils/production-logger');

async function handler(event, context) {
  const { logger } = context;
  
  // Set business context
  logger.setBusinessContext('contact_submission', 'contact_forms', 'website_contact');
  
  // Validação de método HTTP
  if (event.httpMethod !== 'POST') {
    logger.securityEvent('invalid_method_attempt', {
      attemptedMethod: event.httpMethod,
      expectedMethod: 'POST',
      suspiciousActivity: false
    }, 'low');
    
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      },
      body: JSON.stringify({
        error: 'Method not allowed',
        message: 'Only POST requests are accepted',
        requestId: logger.requestId
      })
    };
  }

  logger.markPerformance('validation_start');
  
  try {
    // Parse do body com error handling detalhado
    let formData;
    try {
      formData = JSON.parse(event.body);
      logger.info('Form data parsed successfully', {
        fieldsReceived: Object.keys(formData),
        bodySize: event.body?.length || 0
      });
    } catch (parseError) {
      logger.errorWithFullContext(
        'Failed to parse request body', 
        parseError, 
        event,
        {
          bodyPreview: event.body?.substring(0, 100),
          contentType: event.headers['content-type'],
          parseAttempt: 'json'
        }
      );
      
      return createErrorResponse(logger, 400, 'Invalid JSON in request body');
    }

    logger.markPerformance('validation_start');
    
    // Validação detalhada com user context
    const validationResult = await validateContactFormEnhanced(formData, logger);
    
    logger.markPerformance('validation_end');
    
    if (!validationResult.isValid) {
      logger.userAction('form_submission_failed', {
        errors: validationResult.errors,
        submittedFields: Object.keys(formData)
      }, 'validation_failed');
      
      return createErrorResponse(logger, 400, 'Validation failed', validationResult.errors);
    }

    logger.userAction('form_validation_passed', {
      name: formData.name,
      subject: formData.subject,
      messageLength: formData.message?.length
    });

    logger.markPerformance('processing_start');
    
    // Processamento com tracking detalhado
    const processResult = await processContactSubmissionEnhanced(formData, logger);
    
    logger.markPerformance('processing_end');
    
    if (!processResult.success) {
      logger.businessError(
        'contact_processing_failure',
        'Failed to process contact form submission',
        {
          submissionId: processResult.submissionId,
          failureReason: processResult.error,
          userEmail: formData.email?.substring(0, 3) + '***'
        },
        'high'
      );
      
      return createErrorResponse(logger, 500, 'Failed to process contact form', {
        submissionId: processResult.submissionId,
        requestId: logger.requestId
      });
    }

    logger.userAction('form_submission_completed', {
      submissionId: processResult.submissionId,
      notificationSent: processResult.notificationSent,
      processingTime: Date.now() - logger.startTime
    }, 'success');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: true,
        message: 'Mensagem enviada com sucesso!',
        submissionId: processResult.submissionId,
        requestId: logger.requestId
      })
    };
    
  } catch (error) {
    logger.errorWithFullContext(
      'Unexpected error in enhanced contact handler',
      error,
      event,
      {
        criticalError: true,
        requiresImmediateAttention: true,
        errorCategory: 'unhandled_exception'
      }
    );
    
    return createErrorResponse(logger, 500, 'Internal server error');
  }
}

/**
 * Validação enhanced com logging detalhado
 */
async function validateContactFormEnhanced(data, logger) {
  const errors = [];
  const requiredFields = ['name', 'email', 'subject', 'message'];
  
  logger.info('Starting form validation', {
    receivedFields: Object.keys(data),
    requiredFields
  });
  
  // Validação de campos obrigatórios
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      logger.validationErrorDetailed(
        field, 
        data[field], 
        'required',
        { fieldPresent: field in data, fieldType: typeof data[field] }
      );
      errors.push(`Campo ${field} é obrigatório`);
    }
  });
  
  // Validação de email com context
  if (data.email && !isValidEmail(data.email)) {
    logger.validationErrorDetailed(
      'email',
      data.email,
      'format',
      { emailDomain: data.email.split('@')[1], emailLength: data.email.length }
    );
    errors.push('Email deve ter um formato válido');
  }
  
  // Validação de tamanho
  if (data.message && data.message.length > 1000) {
    logger.validationErrorDetailed(
      'message',
      data.message.length,
      'max_length',
      { actualLength: data.message.length, maxLength: 1000 }
    );
    errors.push('Mensagem deve ter no máximo 1000 caracteres');
  }
  
  // Detecção de spam básica
  const spamIndicators = detectSpamIndicators(data, logger);
  if (spamIndicators.isSpam) {
    logger.securityEvent('potential_spam_detected', {
      spamScore: spamIndicators.score,
      indicators: spamIndicators.indicators,
      userEmail: data.email?.substring(0, 3) + '***'
    }, 'medium');
    
    errors.push('Mensagem detectada como potencial spam');
  }
  
  const isValid = errors.length === 0;
  
  logger.markPerformance('validation_complete');
  logger.info('Form validation completed', {
    valid: isValid,
    errorCount: errors.length,
    validationDuration: Date.now() - logger.performanceMarks.validation_start?.timestamp
  });
  
  return { isValid, errors };
}

/**
 * Processamento enhanced com tracking detalhado
 */
async function processContactSubmissionEnhanced(formData, logger) {
  const submissionId = generateSubmissionId();
  
  logger.setBusinessContext('contact_processing', 'email_service', 'contact_submission');
  logger.info('Starting enhanced contact processing', { submissionId });
  
  try {
    // Email notification com retry logic
    const emailResult = await sendNotificationEmailEnhanced(formData, submissionId, logger);
    
    // Salvamento com backup strategy
    await saveContactSubmissionEnhanced(formData, submissionId, logger);
    
    // Analytics tracking
    await trackContactAnalytics(formData, submissionId, logger);
    
    logger.info('Contact processing completed successfully', {
      submissionId,
      emailSent: emailResult.success,
      processingSummary: true
    });
    
    return {
      success: true,
      submissionId,
      notificationSent: emailResult.success
    };
    
  } catch (error) {
    logger.businessError(
      'processing_exception',
      'Contact processing failed with exception',
      {
        submissionId,
        processingStep: 'unknown',
        errorDetails: error.message
      },
      'high'
    );
    
    return {
      success: false,
      submissionId,
      error: error.message
    };
  }
}

/**
 * Email service com retry e monitoring
 */
async function sendNotificationEmailEnhanced(formData, submissionId, logger) {
  const maxRetries = 3;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const startTime = Date.now();
    
    try {
      logger.info(`Email attempt ${attempt}/${maxRetries}`, { submissionId, attempt });
      
      // Simula chamada para serviço de email
      await simulateEmailService(formData, submissionId);
      
      const duration = Date.now() - startTime;
      logger.externalAPICall('EmailService', '/send', 'POST', duration, attempt, true);
      
      logger.userAction('email_notification_sent', {
        submissionId,
        attempt,
        duration,
        recipientDomain: formData.email.split('@')[1]
      });
      
      return { success: true, attempt };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      lastError = error;
      
      logger.externalAPICall('EmailService', '/send', 'POST', duration, attempt, false);
      
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000; // Progressive backoff
        logger.warn(`Email attempt ${attempt} failed, retrying in ${waitTime}ms`, {
          submissionId,
          attempt,
          error: error.message,
          retryIn: waitTime
        });
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  logger.businessError(
    'email_service_failure',
    'All email attempts failed',
    {
      submissionId,
      totalAttempts: maxRetries,
      finalError: lastError.message
    },
    'high'
  );
  
  return { success: false, error: lastError.message, attempts: maxRetries };
}

/**
 * Detecção básica de spam
 */
function detectSpamIndicators(data, logger) {
  let spamScore = 0;
  const indicators = [];
  
  // Verificações básicas de spam
  if (data.message && data.message.includes('http')) {
    spamScore += 30;
    indicators.push('contains_links');
  }
  
  if (data.name && data.name.length < 2) {
    spamScore += 20;
    indicators.push('suspicious_name');
  }
  
  if (data.message && data.message.split(' ').length < 3) {
    spamScore += 15;
    indicators.push('too_short_message');
  }
  
  const isSpam = spamScore >= 50;
  
  if (spamScore > 0) {
    logger.info('Spam detection completed', {
      spamScore,
      indicators,
      isSpam,
      spamCheck: true
    });
  }
  
  return { isSpam, score: spamScore, indicators };
}

/**
 * Simulação de serviço de email
 */
async function simulateEmailService(formData, submissionId) {
  // Simula falha ocasional para testar retry
  if (Math.random() < 0.2) {
    throw new Error('Email service temporarily unavailable');
  }
  
  // Simula delay variável
  const delay = 300 + Math.random() * 700;
  await new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Salvamento enhanced
 */
async function saveContactSubmissionEnhanced(formData, submissionId, logger) {
  logger.info('Saving contact submission', { submissionId });
  
  try {
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 200));
    
    logger.info('Contact submission saved successfully', {
      submissionId,
      storageDuration: 200
    });
    
  } catch (error) {
    logger.businessError(
      'storage_failure',
      'Failed to save contact submission',
      { submissionId, error: error.message },
      'medium'
    );
    throw error;
  }
}

/**
 * Analytics tracking
 */
async function trackContactAnalytics(formData, submissionId, logger) {
  logger.info('Tracking contact analytics', {
    submissionId,
    analytics: true,
    source: 'website_contact'
  });
}

/**
 * Outras funções auxiliares
 */
function generateSubmissionId() {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function createErrorResponse(logger, statusCode, message, details = null) {
  logger.info('Sending error response', {
    statusCode,
    message,
    hasDetails: !!details
  });
  
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: true,
      message,
      requestId: logger.requestId,
      ...(details && { details })
    })
  };
}

exports.handler = withProductionLogger(handler, 'enhanced-contact-handler');