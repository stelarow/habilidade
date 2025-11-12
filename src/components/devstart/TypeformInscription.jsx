import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import {
  ArrowRight,
  ArrowLeft,
  User,
  Cake,
  UserCircle,
  WhatsappLogo,
  EnvelopeSimple,
  ChatCircle,
  Check,
  RocketLaunch
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EMAIL_CONFIG } from '@/utils/emailConfig';

// Schema de validação Zod (simplificado)
const inscriptionSchema = z.object({
  studentName: z.string().min(3, 'Nome do aluno deve ter no mínimo 3 caracteres'),
  studentAge: z.coerce
    .number({ invalid_type_error: 'Idade deve ser um número' })
    .min(8, 'Idade mínima: 8 anos')
    .max(21, 'Idade máxima: 21 anos'),
  guardianName: z.string().min(3, 'Nome do responsável deve ter no mínimo 3 caracteres'),
  whatsapp: z.string().regex(
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    'WhatsApp inválido. Use o formato: (48) 98855-9491'
  ),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos para continuar'
  })
});

// Etapas do formulário progressivo (simplificado - 5 etapas)
const STEPS = [
  {
    id: 'studentName',
    title: 'Qual é o nome do aluno?',
    subtitle: 'Digite o nome completo',
    icon: User,
    type: 'text',
    placeholder: 'Ex: João Silva'
  },
  {
    id: 'studentAge',
    title: 'Qual é a idade do aluno?',
    subtitle: 'Idade entre 8 e 21 anos',
    icon: Cake,
    type: 'number',
    placeholder: '12',
    min: 8,
    max: 21,
    autoFocus: true
  },
  {
    id: 'guardianName',
    title: 'Nome do responsável',
    subtitle: 'Quem é o responsável pelo aluno?',
    icon: UserCircle,
    type: 'text',
    placeholder: 'Ex: Maria Silva',
    autoFocus: true
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp para contato',
    subtitle: 'Vamos enviar informações sobre o evento',
    icon: WhatsappLogo,
    type: 'tel',
    placeholder: '(48) 98855-9491',
    autoFocus: true
  },
  {
    id: 'acceptTerms',
    title: 'Confirmação final',
    subtitle: 'Revise seus dados e confirme',
    icon: Check,
    type: 'terms'
  }
];

export default function TypeformInscription({ id = 'inscricao' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState('forward'); // Para animação

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(inscriptionSchema),
    mode: 'onChange',
    defaultValues: {
      acceptTerms: false
    }
  });

  // Formatar WhatsApp automaticamente
  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Navegar para próxima etapa
  const handleNext = async () => {
    const currentField = STEPS[currentStep].id;
    const isValid = await trigger(currentField);

    if (isValid) {
      setDirection('forward');
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  // Voltar etapa
  const handleBack = () => {
    setDirection('backward');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Enviar formulário
  const onSubmit = async (data) => {
    console.log('📝 Dados do formulário:', data);
    setIsSubmitting(true);

    try {
      // Mapear campos para o template existente (compatível com página inicial)
      const templateParams = {
        name: data.guardianName, // Nome do responsável
        email: 'inscricao@escolahabilidade.com', // Email padrão (não coletamos mais)
        telefone: data.whatsapp,
        curso: 'DevStart - Missão Criar Seu Jogo', // Curso de interesse
        message: `👤 Nome do Aluno: ${data.studentName}\n🎂 Idade: ${data.studentAge} anos\n👨‍👩‍👦 Responsável: ${data.guardianName}\n📱 WhatsApp: ${data.whatsapp}` // Mensagem formatada com todos os dados
      };

      console.log('📧 Enviando email com parâmetros:', templateParams);
      console.log('🔑 Service ID:', EMAIL_CONFIG.SERVICE_ID);
      console.log('📋 Template ID:', EMAIL_CONFIG.TEMPLATE_ID);

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID, // Usar o template padrão
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email enviado com sucesso:', result);

      toast.success('🎮 Inscrição confirmada!', {
        description: 'Em breve você receberá um e-mail com mais informações.',
        duration: 5000
      });

      // Oferecer contato via WhatsApp após sucesso
      setTimeout(() => {
        toast.info('💬 Quer falar conosco agora?', {
          description: 'Clique para conversar no WhatsApp',
          duration: 8000,
          action: {
            label: 'Abrir WhatsApp',
            onClick: () => openWhatsApp(data)
          }
        });
      }, 1000);

      // Reset form após 2 segundos
      setTimeout(() => {
        setCurrentStep(0);
        setValue('studentName', '');
        setValue('studentAge', '');
        setValue('guardianName', '');
        setValue('whatsapp', '');
        setValue('acceptTerms', false);
      }, 2000);

    } catch (error) {
      console.error('❌ Erro ao enviar inscrição:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        text: error.text,
        status: error.status
      });

      let errorDescription = 'Clique para tentar via WhatsApp';

      if (error.text) {
        errorDescription = `Erro: ${error.text}. Clique para tentar via WhatsApp`;
      } else if (error.message) {
        errorDescription = `${error.message}. Clique para tentar via WhatsApp`;
      }

      toast.error('❌ Erro ao enviar inscrição', {
        description: errorDescription,
        duration: 10000,
        action: {
          label: 'Abrir WhatsApp',
          onClick: () => openWhatsApp(data)
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir WhatsApp com dados preenchidos
  const openWhatsApp = (data) => {
    const message = `Olá! Gostaria de me inscrever no DevStart! 🎮\n\n*Dados da Inscrição:*\n👤 Aluno: ${data.studentName}\n🎂 Idade: ${data.studentAge} anos\n👨‍👩‍👦 Responsável: ${data.guardianName}\n📱 WhatsApp: ${data.whatsapp}`;
    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentStepData = STEPS[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const formValues = watch();

  return (
    <section
      id={id}
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.03) 10px, rgba(255,255,255,.03) 20px)`
        }} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            🎮 Garanta Sua Vaga Grátis!
          </h2>
          <p className="text-xl text-purple-200">
            Preencha os dados abaixo para confirmar sua inscrição
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-purple-200">
              Etapa {currentStep + 1} de {STEPS.length}
            </span>
            <span className="text-sm font-medium text-purple-200">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Formulário Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step Content com animação */}
            <div
              className={`min-h-[400px] flex flex-col transition-all duration-300 ${
                direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
              }`}
              key={currentStep}
            >
              {/* Ícone e Título */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-purple-600" weight="duotone" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Campo do Step Atual */}
              <div className="flex-1 flex flex-col justify-center">
                {currentStepData.type === 'textarea' ? (
                  <div className="space-y-2">
                    <Textarea
                      {...register(currentStepData.id)}
                      placeholder={currentStepData.placeholder}
                      rows={6}
                      className="text-lg resize-none text-gray-900 placeholder:text-gray-400"
                      autoFocus={currentStepData.autoFocus}
                    />
                    {errors[currentStepData.id] && (
                      <p className="text-sm text-red-600">
                        {errors[currentStepData.id]?.message}
                      </p>
                    )}
                  </div>
                ) : currentStepData.type === 'terms' ? (
                  <div className="space-y-6">
                    {/* Resumo dos dados */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                      <h4 className="font-bold text-gray-900 mb-4">📋 Revise seus dados:</h4>
                      <div className="space-y-2 text-sm text-gray-900">
                        <p className="text-gray-900"><strong className="text-gray-900">Aluno:</strong> {formValues.studentName}</p>
                        <p className="text-gray-900"><strong className="text-gray-900">Idade:</strong> {formValues.studentAge} anos</p>
                        <p className="text-gray-900"><strong className="text-gray-900">Responsável:</strong> {formValues.guardianName}</p>
                        <p className="text-gray-900"><strong className="text-gray-900">WhatsApp:</strong> {formValues.whatsapp}</p>
                      </div>
                    </div>

                    {/* Checkbox de termos */}
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={formValues.acceptTerms}
                        onCheckedChange={(checked) => setValue('acceptTerms', checked)}
                      />
                      <Label
                        htmlFor="acceptTerms"
                        className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                      >
                        Eu aceito receber informações sobre o evento DevStart e confirmo que
                        os dados acima estão corretos. Li e aceito a{' '}
                        <a href="/politica-privacidade" className="text-purple-600 hover:underline">
                          Política de Privacidade
                        </a>
                        .
                      </Label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-600">
                        {errors.acceptTerms?.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      {...register(currentStepData.id, {
                        onChange: (e) => {
                          // Formatação especial para WhatsApp
                          if (currentStepData.id === 'whatsapp') {
                            const formatted = formatWhatsApp(e.target.value);
                            setValue('whatsapp', formatted, { shouldValidate: true });
                          }
                        }
                      })}
                      type={currentStepData.type}
                      placeholder={currentStepData.placeholder}
                      min={currentStepData.min}
                      max={currentStepData.max}
                      className="text-lg h-14 text-gray-900 placeholder:text-gray-400 font-semibold"
                      autoFocus={currentStepData.autoFocus}
                    />
                    {errors[currentStepData.id] && (
                      <p className="text-sm text-red-600">
                        {errors[currentStepData.id]?.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Botões de Navegação */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 sm:h-14 text-base sm:text-lg"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                  </Button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    {currentStepData.optional ? 'Pular' : 'Próximo'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formValues.acceptTerms}
                    className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <RocketLaunch className="w-5 h-5 mr-2" />
                        <span className="truncate">Confirmar Inscrição</span>
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Hint de navegação */}
              {!currentStepData.optional && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Pressione Enter para continuar ↵
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-purple-200 text-sm">
            🔒 Seus dados estão seguros conosco • 💬 Suporte via WhatsApp: (48) 98855-9491
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
