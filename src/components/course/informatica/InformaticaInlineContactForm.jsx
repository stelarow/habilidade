import React, { useState, useCallback, useEffect, useRef } from 'react';
import { User, Phone, ChatCircle, ArrowLeft, ArrowRight, PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG, isEmailConfigured } from '../../../utils/emailConfig';
import { formatPhoneNumber } from '../../../lib/utils';
import { trackGoogleAdsConversion } from '../../../utils/ctaUtils';

// Extraindo StepContent para fora do componente principal para evitar re-criação
const StepContent = React.memo(({ step, submitStatus, formData, onInputChange, phoneInputRef, messageInputRef }) => {

  // Autofocus quando mudar de step
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (step === 2 && phoneInputRef?.current) {
        phoneInputRef.current.focus();
      } else if (step === 3 && messageInputRef?.current) {
        messageInputRef.current.focus();
      }
    }, 100); // Pequeno delay para garantir que o DOM foi atualizado

    return () => clearTimeout(focusTimeout);
  }, [step, phoneInputRef, messageInputRef]);

  if (submitStatus === 'email_success') {
    return (
      <div className="text-center py-8">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Enviado com sucesso!</h3>
        <p className="text-zinc-300">Entraremos em contato em breve.</p>
      </div>
    );
  }

  if (submitStatus === 'whatsapp_fallback') {
    return (
      <div className="text-center py-8">
        <ChatCircle size={64} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Redirecionando para WhatsApp...</h3>
        <p className="text-zinc-300">Você será redirecionado em instantes.</p>
      </div>
    );
  }

  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Vamos nos conhecer!</h3>
            <p className="text-zinc-300">Como podemos te chamar?</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-lg flex items-center">
              <User size={20} className="mr-2" />
              Seu nome completo
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Digite seu nome completo"
              className="step-input h-14 text-lg bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Como te contatar?</h3>
            <p className="text-zinc-300">Precisamos do seu WhatsApp ou telefone</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white text-lg flex items-center">
              <Phone size={20} className="mr-2" />
              WhatsApp / Telefone
            </Label>
            <Input
              id="phone"
              ref={phoneInputRef}
              type="tel"
              value={formData.phone}
              maxLength={16} // (XX) 9 XXXX-XXXX = 16 caracteres
              onChange={(e) => {
                const formattedValue = formatPhoneNumber(e.target.value);
                onInputChange('phone', formattedValue);
              }}
              onKeyDown={(e) => {
                // Permite apenas números, backspace, delete, tab, escape, enter, home, end, setas
                const allowedKeys = [
                  'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End',
                  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
                ];

                if (allowedKeys.includes(e.key)) {
                  return;
                }

                // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
                if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
                  return;
                }

                // Bloqueia qualquer tecla que não seja número
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              placeholder="(48) 9 9999-9999"
              className="step-input h-14 text-lg bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
            />
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Quase pronto!</h3>
            <p className="text-zinc-300">Alguma mensagem adicional? (opcional)</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
              <h4 className="text-white font-medium mb-2">Resumo do seu interesse:</h4>
              <div className="space-y-1 text-sm text-zinc-300">
                <p><strong>Nome:</strong> {formData.name}</p>
                <p><strong>Telefone:</strong> {formData.phone}</p>
                <p><strong>Curso:</strong> {formData.course}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white text-lg flex items-center">
                <ChatCircle size={20} className="mr-2" />
                Mensagem (opcional)
              </Label>
              <Textarea
                id="message"
                ref={messageInputRef}
                value={formData.message}
                onChange={(e) => {
                  onInputChange('message', e.target.value);
                }}
                placeholder="Deixe uma mensagem sobre suas expectativas, horários preferidos, etc..."
                className="min-h-[100px] text-lg bg-zinc-800/50 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500 resize-none"
                dir="ltr"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}, (prevProps, nextProps) => {
  // Custom comparison function para evitar re-renders desnecessários
  const shouldRerender = (
    prevProps.step !== nextProps.step ||
    prevProps.submitStatus !== nextProps.submitStatus ||
    prevProps.phoneInputRef !== nextProps.phoneInputRef ||
    prevProps.messageInputRef !== nextProps.messageInputRef ||
    (nextProps.step === 1 && prevProps.formData.name !== nextProps.formData.name) ||
    (nextProps.step === 2 && prevProps.formData.phone !== nextProps.formData.phone) ||
    (nextProps.step === 3 && (
      prevProps.formData.name !== nextProps.formData.name ||
      prevProps.formData.phone !== nextProps.formData.phone ||
      prevProps.formData.course !== nextProps.formData.course ||
      prevProps.formData.message !== nextProps.formData.message
    ))
  );

  return !shouldRerender;
});

const InformaticaInlineContactForm = () => {

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: 'Informática',
    message: ''
  });

  const totalSteps = 3;

  // Refs para autofocus
  const phoneInputRef = useRef(null);
  const messageInputRef = useRef(null);


  // Usar useCallback para evitar re-criação da função
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }, [step, totalSteps]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const sendEmail = async () => {
    try {
      if (!isEmailConfigured()) {
        console.warn('EmailJS não configurado, usando WhatsApp como fallback');
        return { success: false, error: 'EmailJS não configurado' };
      }

      const templateParams = {
        from_name: formData.name,
        from_email: 'nao-informado@email.com',
        phone: formData.phone,
        course: formData.course,
        message: formData.message || 'Nenhuma mensagem adicional',
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: 'nao-informado@email.com'
      };

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  };

  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato - ${formData.course}*%0A%0A*Nome:* ${formData.name}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course}%0A*Mensagem:* ${formData.message || 'Nenhuma mensagem adicional'}`;
    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    
    // Track de conversão do Google Ads e abre WhatsApp
    trackGoogleAdsConversion(whatsappUrl);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const emailResult = await sendEmail();

      if (emailResult.success) {
        // Registra conversão do Google Ads para envio de formulário bem-sucedido
        trackGoogleAdsConversion();
        setSubmitStatus('email_success');
        setFormData({ name: '', email: '', phone: '', course: 'Informática', message: '' });
        setTimeout(() => {
          setStep(1);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('whatsapp_fallback');
        setTimeout(() => {
          sendWhatsApp();
          setStep(1);
          setSubmitStatus(null);
        }, 1500);
      }
    } catch (error) {
      setSubmitStatus('whatsapp_fallback');
      setTimeout(() => {
        sendWhatsApp();
        setStep(1);
        setSubmitStatus(null);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.phone.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getProgressValue = useCallback(() => {
    return (step / totalSteps) * 100;
  }, [step, totalSteps]);

  return (
    <Card className="max-w-2xl mx-auto bg-zinc-900/90 border-zinc-700/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-lg mb-4">
          Etapa {step} de {totalSteps}
        </CardTitle>
        <Progress
          value={getProgressValue()}
          className="w-full h-2 bg-zinc-700"
        />
      </CardHeader>

      <CardContent className="p-6">
        <div className="transition-all duration-300 ease-in-out">
          <StepContent
            step={step}
            submitStatus={submitStatus}
            formData={formData}
            onInputChange={handleInputChange}
            phoneInputRef={phoneInputRef}
            messageInputRef={messageInputRef}
          />
        </div>

        {!submitStatus && (
          <div className="flex justify-between mt-8 space-x-4">
            {step > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 h-12 text-lg border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Voltar
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex-1 h-12 text-lg ${step === 1 ? 'w-full' : ''} bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Continuar
                <ArrowRight size={20} className="ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid()}
                className="flex-1 h-12 text-lg bg-green-500 hover:bg-green-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <PaperPlaneTilt size={20} className="mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InformaticaInlineContactForm;