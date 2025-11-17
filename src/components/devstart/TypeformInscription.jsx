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
  CheckCircle,
  RocketLaunch,
  Sun,
  MoonStars,
  Confetti
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EMAIL_CONFIG } from '@/utils/emailConfig';

// Schema de validação Zod (simplificado)
const inscriptionSchema = z.object({
  studentName: z.string().min(3, 'Nome do aluno deve ter no mínimo 3 caracteres'),
  studentAge: z.coerce
    .number({ invalid_type_error: 'Idade deve ser um número' })
    .min(8, 'Idade mínima: 8 anos')
    .max(21, 'Idade máxima: 21 anos'),
  preferredShift: z.enum(['manha', 'tarde'], {
    required_error: 'Selecione um turno de preferência'
  }),
  guardianName: z.string().min(3, 'Nome do responsável deve ter no mínimo 3 caracteres'),
  whatsapp: z.string().regex(
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    'WhatsApp inválido. Use o formato: (48) 98855-9491'
  ),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos para continuar'
  })
});

// Etapas do formulário progressivo (simplificado - 7 etapas: 6 de preenchimento + 1 de sucesso)
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
    id: 'preferredShift',
    title: 'Qual turno você prefere?',
    subtitle: 'Escolha o melhor horário para você',
    icon: Sun,
    type: 'radio',
    options: [
      { value: 'manha', label: 'Manhã', icon: Sun, color: 'orange' },
      { value: 'tarde', label: 'Tarde', icon: MoonStars, color: 'indigo' }
    ]
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
  },
  {
    id: 'success',
    title: '🎉 Inscrição Realizada!',
    subtitle: 'Seu cadastro foi recebido com sucesso',
    icon: CheckCircle,
    type: 'success'
  }
];

export default function TypeformInscription({ id = 'inscricao' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
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
        from_name: data.guardianName, // Nome do responsável
        from_email: 'inscricao@escolahabilidade.com', // Email padrão (não coletamos mais)
        phone: data.whatsapp,
        course: 'DevStart - Missão Criar Seu Jogo', // Curso de interesse
        message: `👤 Nome do Aluno: ${data.studentName}\n🎂 Idade: ${data.studentAge} anos\n⏰ Turno de Preferência: ${data.preferredShift === 'manha' ? 'Manhã 🌅' : 'Tarde 🌙'}\n👨‍👩‍👦 Responsável: ${data.guardianName}\n📱 WhatsApp: ${data.whatsapp}`, // Mensagem formatada com todos os dados
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: 'inscricao@escolahabilidade.com'
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

      // Armazenar dados submetidos
      setSubmittedData(data);
      setIsSubmitted(true);

      // Avançar para a etapa de sucesso
      setDirection('forward');
      setCurrentStep(STEPS.length - 1);

      // Toast de confirmação simples
      toast.success('✅ Inscrição enviada com sucesso!', {
        description: 'Aguarde na tela de confirmação',
        duration: 3000
      });

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
    const message = `Olá! Gostaria de me inscrever no DevStart! 🎮\n\n*Dados da Inscrição:*\n👤 Aluno: ${data.studentName}\n🎂 Idade: ${data.studentAge} anos\n⏰ Turno de Preferência: ${data.preferredShift === 'manha' ? 'Manhã 🌅' : 'Tarde 🌙'}\n👨‍👩‍👦 Responsável: ${data.guardianName}\n📱 WhatsApp: ${data.whatsapp}`;
    const whatsappUrl = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentStepData = STEPS[currentStep];
  const Icon = currentStepData.icon;

  // Calcular progresso (excluindo etapa de sucesso do total)
  const totalStepsWithoutSuccess = STEPS.length - 1;
  const progress = currentStepData.type === 'success'
    ? 100
    : ((currentStep + 1) / totalStepsWithoutSuccess) * 100;

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

        {/* Progress Bar (oculto na etapa de sucesso) */}
        {currentStepData.type !== 'success' && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-200">
                Etapa {currentStep + 1} de {STEPS.length - 1}
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
        )}

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
                ) : currentStepData.type === 'radio' ? (
                  <div className="space-y-4">
                    <RadioGroup
                      value={formValues[currentStepData.id]}
                      onValueChange={(value) => setValue(currentStepData.id, value, { shouldValidate: true })}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {currentStepData.options.map((option) => {
                        const OptionIcon = option.icon;
                        const isSelected = formValues[currentStepData.id] === option.value;

                        // Classes fixas para cada cor (Tailwind não suporta classes dinâmicas)
                        const colorClasses = {
                          orange: {
                            border: 'border-orange-500',
                            bg: 'bg-orange-50',
                            shadow: 'shadow-lg shadow-orange-200',
                            text: 'text-orange-600',
                            textDark: 'text-orange-900',
                            badge: 'bg-orange-500'
                          },
                          indigo: {
                            border: 'border-indigo-500',
                            bg: 'bg-indigo-50',
                            shadow: 'shadow-lg shadow-indigo-200',
                            text: 'text-indigo-600',
                            textDark: 'text-indigo-900',
                            badge: 'bg-indigo-500'
                          }
                        };

                        const colors = colorClasses[option.color];

                        return (
                          <Label
                            key={option.value}
                            htmlFor={option.value}
                            className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? `${colors.border} ${colors.bg} ${colors.shadow}`
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                            }`}
                          >
                            <RadioGroupItem
                              id={option.value}
                              value={option.value}
                              className="sr-only"
                            />
                            <OptionIcon
                              size={56}
                              weight="duotone"
                              className={`mb-4 transition-colors ${
                                isSelected ? colors.text : 'text-gray-400'
                              }`}
                            />
                            <span className={`text-xl font-bold transition-colors ${
                              isSelected ? colors.textDark : 'text-gray-700'
                            }`}>
                              {option.label}
                            </span>
                            {isSelected && (
                              <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${colors.badge} flex items-center justify-center`}>
                                <Check size={16} weight="bold" className="text-white" />
                              </div>
                            )}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                    {errors[currentStepData.id] && (
                      <p className="text-sm text-red-600 text-center">
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
                        <p className="text-gray-900"><strong className="text-gray-900">Turno:</strong> {formValues.preferredShift === 'manha' ? 'Manhã 🌅' : 'Tarde 🌙'}</p>
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
                ) : currentStepData.type === 'success' ? (
                  <div className="space-y-8 text-center">
                    {/* Ícone de Sucesso */}
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle size={80} weight="fill" className="text-green-600" />
                        </div>
                        <div className="absolute -top-4 -right-4">
                          <Confetti size={48} weight="duotone" className="text-yellow-500" />
                        </div>
                      </div>
                    </div>

                    {/* Mensagem Principal */}
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-green-700">
                        Cadastro Realizado com Sucesso!
                      </h3>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-3">
                        <p className="text-lg text-gray-800 font-semibold">
                          📞 Entraremos em contato pelo WhatsApp informado
                        </p>
                        <p className="text-base text-gray-700">
                          Você receberá uma mensagem quando sair o resultado dos inscritos para o evento DevStart!
                        </p>
                      </div>
                    </div>

                    {/* Resumo dos Dados */}
                    {submittedData && (
                      <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-left">
                        <h4 className="font-bold text-gray-900 mb-4 text-center">📋 Dados da Inscrição:</h4>
                        <div className="space-y-2 text-sm text-gray-900">
                          <p><strong>Aluno:</strong> {submittedData.studentName}</p>
                          <p><strong>Idade:</strong> {submittedData.studentAge} anos</p>
                          <p><strong>Turno:</strong> {submittedData.preferredShift === 'manha' ? 'Manhã 🌅' : 'Tarde 🌙'}</p>
                          <p><strong>Responsável:</strong> {submittedData.guardianName}</p>
                          <p><strong>WhatsApp:</strong> {submittedData.whatsapp}</p>
                        </div>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          // Reset completo
                          setCurrentStep(0);
                          setIsSubmitted(false);
                          setSubmittedData(null);
                          setValue('studentName', '');
                          setValue('studentAge', '');
                          setValue('preferredShift', undefined);
                          setValue('guardianName', '');
                          setValue('whatsapp', '');
                          setValue('acceptTerms', false);
                        }}
                        className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        <RocketLaunch className="w-5 h-5 mr-2" />
                        Fazer Nova Inscrição
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => submittedData && openWhatsApp(submittedData)}
                        className="flex-1 h-14 text-lg border-2 border-green-600 text-green-700 hover:bg-green-50"
                      >
                        <WhatsappLogo className="w-5 h-5 mr-2" weight="fill" />
                        Falar no WhatsApp
                      </Button>
                    </div>
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

              {/* Botões de Navegação (ocultos na etapa de sucesso) */}
              {currentStepData.type !== 'success' && (
                <>
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

                    {currentStepData.type === 'terms' ? (
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
                    ) : currentStep < STEPS.length - 1 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 h-12 sm:h-14 text-base sm:text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        {currentStepData.optional ? 'Pular' : 'Próximo'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    ) : null}
                  </div>

                  {/* Hint de navegação */}
                  {!currentStepData.optional && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Pressione Enter para continuar ↵
                    </p>
                  )}
                </>
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
