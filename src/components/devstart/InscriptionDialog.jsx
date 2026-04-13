import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { devstartData } from '@/data/devstart';
import {
  GameController,
  User,
  Cake,
  Users,
  Phone,
  Envelope,
  ChatCircle,
  Calendar,
  Timer,
  MapPin,
  Rocket
} from '@phosphor-icons/react';

// Validation Schema
const inscriptionSchema = z.object({
  studentName: z.string().min(3, 'Nome do aluno deve ter no mínimo 3 caracteres'),
  studentAge: z
    .number({ invalid_type_error: 'Idade é obrigatória' })
    .min(8, 'Idade mínima: 8 anos')
    .max(17, 'Para maiores de 17 anos, entre em contato'),
  guardianName: z.string().min(3, 'Nome do responsável deve ter no mínimo 3 caracteres'),
  whatsapp: z
    .string()
    .min(14, 'WhatsApp inválido')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX'),
  email: z.string().email('E-mail inválido'),
  message: z.string().optional(),
  acceptTerms: z.boolean().refine((value) => value === true, {
    message: 'Você precisa aceitar os termos',
  }),
});

const InscriptionDialog = ({ open, onOpenChange }) => {
  const { event, location, whatsappFallback } = devstartData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch('acceptTerms');

  // Format WhatsApp number
  const formatWhatsApp = (value) => {
    const cleaned = value.replaceAll(/\D/g, '');
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // Handle WhatsApp Fallback
  const handleWhatsAppFallback = (data) => {
    const message = `Olá! Gostaria de me inscrever no DevStart! 🎮

*Dados da Inscrição:*
👤 Aluno: ${data.studentName}
🎂 Idade: ${data.studentAge} anos
👨‍👩‍👦 Responsável: ${data.guardianName}
📱 WhatsApp: ${data.whatsapp}
📧 E-mail: ${data.email}
${data.message ? `\n💬 Mensagem: ${data.message}` : ''}`;

    window.open(whatsappFallback.url(message), '_blank');
  };

  // Submit Form
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Prepare EmailJS template params
      const templateParameters = {
        to_email: 'alessandro.ferreira@escolahabilidade.com',
        event_name: event.title,
        student_name: data.studentName,
        student_age: data.studentAge,
        guardian_name: data.guardianName,
        whatsapp: data.whatsapp,
        email: data.email,
        message: data.message || 'Nenhuma mensagem adicional',
        submission_date: new Date().toLocaleString('pt-BR'),
      };

      // Send via EmailJS (usar as mesmas credenciais do site)
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_escolahabilidade',
        import.meta.env.VITE_EMAILJS_DEVSTART_TEMPLATE_ID || 'template_devstart',
        templateParameters,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Success
      toast.success('Inscrição enviada com sucesso! 🎉', {
        description: 'Em breve entraremos em contato pelo WhatsApp!',
        duration: 5000,
      });

      // Reset form and close dialog
      reset();
      onOpenChange(false);

      // Optional: Open WhatsApp confirmation
      setTimeout(() => {
        toast.info('Quer confirmar via WhatsApp?', {
          action: {
            label: 'Abrir WhatsApp',
            onClick: () => handleWhatsAppFallback(data),
          },
          duration: 10_000,
        });
      }, 1000);
    } catch (error) {
      console.error('Error sending inscription:', error);

      // Error toast with WhatsApp fallback
      toast.error('Ops! Houve um erro ao enviar. 😔', {
        description: 'Tente enviar via WhatsApp!',
        action: {
          label: 'Abrir WhatsApp',
          onClick: () => handleWhatsAppFallback(data),
        },
        duration: 10_000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-2 border-blue-500/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-blue-300 flex items-center gap-2">
            <GameController size={36} weight="fill" />
            Garantir Minha Vaga - DevStart
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            Preencha os dados abaixo para se inscrever no evento <strong>GRATUITO</strong>!
            Temos apenas <strong>{event.vagas} vagas</strong> disponíveis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Student Name */}
          <div className="space-y-2">
            <Label htmlFor="studentName" className="text-white font-semibold flex items-center gap-2">
              <User size={20} weight="bold" />
              Nome do Aluno <span className="text-red-400">*</span>
            </Label>
            <Input
              id="studentName"
              placeholder="Ex: João Silva"
              {...register('studentName')}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {errors.studentName && (
              <p className="text-red-400 text-sm">{errors.studentName.message}</p>
            )}
          </div>

          {/* Student Age */}
          <div className="space-y-2">
            <Label htmlFor="studentAge" className="text-white font-semibold flex items-center gap-2">
              <Cake size={20} weight="bold" />
              Idade <span className="text-red-400">*</span>
            </Label>
            <Input
              id="studentAge"
              type="number"
              min={8}
              max={17}
              placeholder="Ex: 10"
              {...register('studentAge', { valueAsNumber: true })}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {errors.studentAge && (
              <p className="text-red-400 text-sm">{errors.studentAge.message}</p>
            )}
            <p className="text-xs text-gray-400">
              Idade mínima: {event.idadeMinima} anos
            </p>
          </div>

          {/* Guardian Name */}
          <div className="space-y-2">
            <Label htmlFor="guardianName" className="text-white font-semibold flex items-center gap-2">
              <Users size={20} weight="bold" />
              Nome do Responsável <span className="text-red-400">*</span>
            </Label>
            <Input
              id="guardianName"
              placeholder="Ex: Maria Silva"
              {...register('guardianName')}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {errors.guardianName && (
              <p className="text-red-400 text-sm">{errors.guardianName.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-white font-semibold flex items-center gap-2">
              <Phone size={20} weight="bold" />
              WhatsApp para contato <span className="text-red-400">*</span>
            </Label>
            <Input
              id="whatsapp"
              placeholder="(48) 98855-9491"
              {...register('whatsapp')}
              onChange={(e) => {
                const formatted = formatWhatsApp(e.target.value);
                setValue('whatsapp', formatted);
              }}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {errors.whatsapp && (
              <p className="text-red-400 text-sm">{errors.whatsapp.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-semibold flex items-center gap-2">
              <Envelope size={20} weight="bold" />
              E-mail <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              {...register('email')}
              className="bg-gray-800 border-gray-700 text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Message (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white font-semibold flex items-center gap-2">
              <ChatCircle size={20} weight="bold" />
              Mensagem (opcional)
            </Label>
            <Textarea
              id="message"
              placeholder="Deixe uma mensagem ou dúvida..."
              rows={3}
              {...register('message')}
              className="bg-gray-800 border-gray-700 text-white resize-none"
            />
          </div>

          {/* Accept Terms */}
          <div className="flex items-start gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', checked)}
              className="mt-1"
            />
            <div>
              <Label
                htmlFor="acceptTerms"
                className="text-sm text-gray-300 cursor-pointer leading-relaxed"
              >
                Li e concordo com os termos de inscrição. Autorizo o uso dos dados para contato
                sobre o evento DevStart e atividades da Escola Habilidade. <span className="text-red-400">*</span>
              </Label>
              {errors.acceptTerms && (
                <p className="text-red-400 text-sm mt-1">{errors.acceptTerms.message}</p>
              )}
            </div>
          </div>

          {/* Event Info */}
          <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-blue-200 text-sm space-y-1">
              <span className="flex items-center gap-2">
                <Calendar size={18} weight="bold" />
                <strong>Quando:</strong> {event.horario}
              </span>
              <span className="flex items-center gap-2">
                <Timer size={18} weight="bold" />
                <strong>Duração:</strong> {event.duracao}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={18} weight="bold" />
                <strong>Onde:</strong> {location.name} - {location.neighborhood}, {location.city}
              </span>
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 text-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Timer size={24} weight="bold" className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Rocket size={24} weight="fill" />
                  CONFIRMAR INSCRIÇÃO
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
          </div>

          {/* WhatsApp Alternative */}
          <div className="text-center pt-2 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Prefere se inscrever via WhatsApp?</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleWhatsAppFallback(watch())}
              className="border-green-600 text-green-400 hover:bg-green-900/30 flex items-center gap-2 mx-auto"
            >
              <ChatCircle size={20} weight="fill" />
              Inscrever via WhatsApp
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InscriptionDialog;
