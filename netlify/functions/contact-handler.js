/**
 * Function para processar formulários de contato
 * Demonstra logging de validação, integrações externas e error handling
 */

const { withLogger } = require('./utils/logger');

async function handler(event, context) {
  const { logger } = context;
  
  // Apenas aceita POST
  if (event.httpMethod !== 'POST') {
    logger.warn('Invalid HTTP method attempted', { 
      method: event.httpMethod,
      expected: 'POST'
    });
    
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      },
      body: JSON.stringify({
        error: 'Method not allowed',
        message: 'Only POST requests are accepted'
      })
    };
  }
  
  logger.info('Processing contact form submission');
  
  try {
    // Parse do body
    let formData;
    try {
      formData = JSON.parse(event.body);
      logger.debug('Form data parsed successfully', { 
        fields: Object.keys(formData) 
      });
    } catch (parseError) {
      logger.error('Failed to parse request body', parseError);
      return createErrorResponse(400, 'Invalid JSON in request body');
    }
    
    // Validação dos dados
    const validationResult = validateContactForm(formData, logger);
    if (!validationResult.isValid) {
      logger.warn('Form validation failed', { 
        errors: validationResult.errors 
      });
      
      return createErrorResponse(400, 'Validation failed', validationResult.errors);
    }
    
    logger.info('Form validation passed', {
      name: formData.name,
      email: formData.email?.substring(0, 3) + '***', // Log parcial do email por segurança
      subject: formData.subject
    });
    
    // Simula processamento do formulário
    const processResult = await processContactSubmission(formData, logger);
    
    if (!processResult.success) {
      logger.error('Contact processing failed', null, processResult.error);
      return createErrorResponse(500, 'Failed to process contact form');
    }
    
    logger.info('Contact form processed successfully', {
      submissionId: processResult.submissionId,
      notificationSent: processResult.notificationSent
    });
    
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
        submissionId: processResult.submissionId
      })
    };
    
  } catch (error) {
    logger.fatal('Unexpected error in contact handler', error);
    
    return createErrorResponse(500, 'Internal server error');
  }
}

/**
 * Valida dados do formulário de contato
 */
function validateContactForm(data, logger) {
  const errors = [];
  const requiredFields = ['name', 'email', 'subject', 'message'];
  
  // Verifica campos obrigatórios
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      logger.validationError(field, data[field], 'required');
      errors.push(`Campo ${field} é obrigatório`);
    }
  });
  
  // Validação de email
  if (data.email && !isValidEmail(data.email)) {
    logger.validationError('email', data.email, 'format');
    errors.push('Email deve ter um formato válido');
  }
  
  // Validação de tamanho da mensagem
  if (data.message && data.message.length > 1000) {
    logger.validationError('message', data.message.length, 'max_length');
    errors.push('Mensagem deve ter no máximo 1000 caracteres');
  }
  
  const isValid = errors.length === 0;
  
  if (isValid) {
    logger.info('Form validation completed successfully');
  } else {
    logger.warn(`Form validation failed with ${errors.length} errors`);
  }
  
  return { isValid, errors };
}

/**
 * Valida formato de email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Processa a submissão do contato
 */
async function processContactSubmission(formData, logger) {
  try {
    const submissionId = generateSubmissionId();
    
    logger.info('Starting contact submission processing', {
      submissionId
    });
    
    // Simula envio de email/notificação
    const emailResult = await sendNotificationEmail(formData, submissionId, logger);
    
    // Simula salvamento em banco/sistema
    await saveContactSubmission(formData, submissionId, logger);
    
    logger.info('Contact submission processing completed', {
      submissionId,
      emailSent: emailResult.success
    });
    
    return {
      success: true,
      submissionId,
      notificationSent: emailResult.success
    };
    
  } catch (error) {
    logger.error('Contact submission processing failed', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Simula envio de email de notificação
 */
async function sendNotificationEmail(formData, submissionId, logger) {
  const startTime = Date.now();
  
  try {
    logger.info('Sending notification email', { submissionId });
    
    // Simula chamada para serviço de email (EmailJS, SendGrid, etc.)
    await simulateAsyncOperation(500); // 500ms delay
    
    const duration = Date.now() - startTime;
    logger.externalCall('EmailService', '/send', 'POST', duration);
    logger.info('Notification email sent successfully', { 
      submissionId, 
      duration 
    });
    
    return { success: true };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to send notification email', error, { 
      submissionId, 
      duration 
    });
    
    return { success: false, error: error.message };
  }
}

/**
 * Simula salvamento da submissão
 */
async function saveContactSubmission(formData, submissionId, logger) {
  const startTime = Date.now();
  
  try {
    logger.info('Saving contact submission', { submissionId });
    
    // Simula operação de banco de dados
    await simulateAsyncOperation(200);
    
    const duration = Date.now() - startTime;
    logger.info('Contact submission saved successfully', { 
      submissionId, 
      duration 
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to save contact submission', error, { 
      submissionId, 
      duration 
    });
    throw error;
  }
}

/**
 * Gera ID único para a submissão
 */
function generateSubmissionId() {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Simula operação assíncrona
 */
function simulateAsyncOperation(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Cria resposta de erro padronizada
 */
function createErrorResponse(statusCode, message, details = null) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: true,
      message,
      ...(details && { details })
    })
  };
}

exports.handler = withLogger(handler, 'contact-handler');