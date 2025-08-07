import { useState, useRef } from 'react';
import { PaperPlaneTilt, User, Envelope, Phone, BookOpen, CheckCircle, XCircle } from '@phosphor-icons/react';
import emailjs from '@emailjs/browser';
import Loading from './Loading';
import GradientButton from './GradientButton';
import { EMAIL_CONFIG, isEmailConfigured } from '../utils/emailConfig';

const ContactForm = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const courses = [
    'Projetista',
    'Edição de Vídeo', 
    'Informática',
    'Design Gráfico',
    'Programação',
    'Marketing Digital',
    'Inteligência Artificial',
    'Business Intelligence'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendEmail = async () => {
    try {
      // Verificar se o EmailJS está configurado
      if (!isEmailConfigured()) {
        console.warn('EmailJS não configurado, usando WhatsApp como fallback');
        return { success: false, error: 'EmailJS não configurado' };
      }

      console.log('Tentando enviar email com EmailJS...');
      console.log('Service ID:', EMAIL_CONFIG.SERVICE_ID);
      console.log('Template ID:', EMAIL_CONFIG.TEMPLATE_ID);

      // Preparar dados para EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        course: formData.course || 'Não especificado',
        message: formData.message || 'Nenhuma mensagem adicional',
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: formData.email
      };

      console.log('Parâmetros do template:', templateParams);

      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      console.log('Email enviado com sucesso!', result);
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }
  };

  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course || 'Não especificado'}%0A*Mensagem:* ${formData.message || 'Nenhuma mensagem adicional'}`;
    window.open(`https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    console.log('Formulário submetido, dados:', formData);
    
    try {
      // Tentativa 1: Enviar por email
      const emailResult = await sendEmail();
      
      if (emailResult.success) {
        console.log('Email enviado com sucesso!');
        setSubmitStatus('email_success');
        setFormData({ name: '', email: '', phone: '', course: '', message: '' });
      } else {
        console.log('Falha no email, redirecionando para WhatsApp...');
        // Fallback: WhatsApp
        setSubmitStatus('whatsapp_fallback');
        setTimeout(() => {
          sendWhatsApp();
        }, 1500);
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      // Fallback: WhatsApp
      setSubmitStatus('whatsapp_fallback');
      setTimeout(() => {
        sendWhatsApp();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-16 bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Entre em Contato
          </h2>
          <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
            Interessado em algum curso? Preencha o formulário e entraremos em contato!
          </p>
        </div>

        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                  <User size={16} className="inline mr-2" />
                  Nome completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  <Envelope size={16} className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
                  <Phone size={16} className="inline mr-2" />
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                  placeholder="(48) 9 9999-9999"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="course" className="block text-sm font-medium text-zinc-300">
                  <BookOpen size={16} className="inline mr-2" />
                  Curso de interesse
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-zinc-300">
                Mensagem (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all resize-none"
                placeholder="Deixe uma mensagem (opcional)"
              />
            </div>

            {/* Mensagens de Status */}
            {submitStatus === 'email_success' && (
              <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-green-300 font-medium">Email enviado com sucesso!</p>
                  <p className="text-green-400 text-sm">Entraremos em contato em breve.</p>
                </div>
              </div>
            )}

            {submitStatus === 'whatsapp_fallback' && (
              <div className="flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <CheckCircle size={24} className="text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-blue-300 font-medium">Redirecionando para WhatsApp...</p>
                  <p className="text-blue-400 text-sm">Você será direcionado para continuar pelo WhatsApp.</p>
                </div>
              </div>
            )}

            <GradientButton
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loading size="sm" />
                  Enviando...
                </>
              ) : (
                <>
                  <PaperPlaneTilt size={20} />
                  Enviar Mensagem
                </>
              )}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">
              Seus dados são tratados com total confidencialidade conforme nossa política de privacidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;