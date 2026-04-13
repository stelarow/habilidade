import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EMAIL_CONFIG } from '@/utils/emailConfig';
import { formatPhoneNumber } from '@/lib/utils';
import { cursos } from '@/data/afiliacao';

const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  whatsapp: z
    .string()
    .regex(/^\(\d{2}\) 9/, 'WhatsApp inválido. Use o formato: (48) 9 8855-9491'),
  chavePix: z.string().min(3, 'Chave Pix deve ter no mínimo 3 caracteres'),
  curso: z.string().min(1, 'Selecione um curso'),
});

const STORAGE_KEY = 'afiliacao_cadastros';

const getCadastros = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const salvarCadastro = (data, cupom) => {
  const cadastros = getCadastros();
  cadastros.push({ ...data, cupom, criadoEm: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastros));
};

const verificarDuplicado = (data) => {
  const cadastros = getCadastros();
  return cadastros.find(
    (c) =>
      c.nome.toLowerCase().trim() === data.nome.toLowerCase().trim() &&
      c.whatsapp === data.whatsapp &&
      c.chavePix === data.chavePix &&
      c.curso === data.curso
  );
};

const gerarCupom = (nome) => {
  const primeiro = nome
    .trim()
    .split(/\s+/)[0]
    .toUpperCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .slice(0, 6);

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo;
  const cadastros = getCadastros();
  const cuponsExistentes = new Set(cadastros.map((c) => c.cupom));

  do {
    let sufixo = '';
    for (let index = 0; index < 4; index++) {
      sufixo += chars[Math.floor(Math.random() * chars.length)];
    }
    codigo = `${primeiro}-${sufixo}`;
  } while (cuponsExistentes.has(codigo));

  return codigo;
};

const FormularioCadastro = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cupomGerado, setCupomGerado] = useState(null);
  const [dadosCadastro, setDadosCadastro] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', whatsapp: '', chavePix: '', curso: '' },
  });

  const openWhatsApp = (data) => {
    const message = `Olá! Quero participar do Indique e Ganhe!\n\nNome: ${data.nome}\nWhatsApp: ${data.whatsapp}\nChave Pix: ${data.chavePix}\nCurso: ${data.curso}`;
    const url = `https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const onSubmit = async (data) => {
    const duplicado = verificarDuplicado(data);
    if (duplicado) {
      toast.error('Cadastro já efetuado', {
        description: `Seu cupom existente é: ${duplicado.cupom}`,
        duration: 6000,
      });
      setCupomGerado(duplicado.cupom);
      setDadosCadastro(data);
      return;
    }

    setIsSubmitting(true);
    const cupom = gerarCupom(data.nome);
    try {
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        {
          from_name: data.nome,
          from_email: 'indique@escolahabilidade.com',
          phone: data.whatsapp,
          course: data.curso,
          message: `Cadastro Indique e Ganhe\n\nNome: ${data.nome}\nWhatsApp: ${data.whatsapp}\nChave Pix: ${data.chavePix}\nCurso: ${data.curso}\nCupom Gerado: ${cupom}`,
          to_email: EMAIL_CONFIG.CONTACT_EMAIL,
          reply_to: 'indique@escolahabilidade.com',
        },
        EMAIL_CONFIG.PUBLIC_KEY
      );
      salvarCadastro(data, cupom);
      setCupomGerado(cupom);
      setDadosCadastro(data);
      toast.success('Cupom gerado com sucesso!');
      reset();
    } catch {
      toast.error('Erro ao enviar cadastro', {
        description: 'Clique para tentar via WhatsApp',
        duration: 10_000,
        action: {
          label: 'Abrir WhatsApp',
          onClick: () => openWhatsApp(data),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copiarCupom = () => {
    navigator.clipboard.writeText(cupomGerado);
    toast.success('Cupom copiado!');
  };

  return (
    <section id="formulario" className="py-20 bg-gray-950">
      <div className="container mx-auto px-4 max-w-lg">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-2">
          Cadastre-se agora
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Preencha seus dados para receber seu cupom exclusivo
        </p>

        {cupomGerado ? (
          <div className="text-center space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-green-600 to-amber-600 p-8 shadow-lg shadow-green-900/30">
              <p className="text-amber-100 text-sm font-medium uppercase tracking-wider mb-2">
                Seu cupom exclusivo
              </p>
              <p className="text-5xl font-black text-white tracking-widest mb-4">
                {cupomGerado}
              </p>
              <p className="text-white text-sm mb-5">
                {dadosCadastro?.nome} &mdash; {dadosCadastro?.curso}
              </p>
              <button
                onClick={copiarCupom}
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Copiar cupom
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Compartilhe este cupom com seus indicados. A cada matrícula, você recebe comissão via Pix!
            </p>
            <button
              onClick={() => {
                setCupomGerado(null);
                setDadosCadastro(null);
              }}
              className="text-amber-400 hover:text-amber-300 text-sm underline underline-offset-4 transition-colors"
            >
              Fazer novo cadastro
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="nome" className="text-gray-200">
                Nome completo
              </Label>
              <Input
                id="nome"
                placeholder="Seu nome"
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-amber-500 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="whatsapp" className="text-gray-200">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                placeholder="(48) 9 8855-9491"
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                {...register('whatsapp', {
                  onChange: (e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setValue('whatsapp', formatted, { shouldValidate: true });
                  },
                })}
              />
              {errors.whatsapp && (
                <p className="text-amber-500 text-sm mt-1">{errors.whatsapp.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="chavePix" className="text-gray-200">
                Chave Pix (para receber comissão)
              </Label>
              <Input
                id="chavePix"
                placeholder="CPF, e-mail ou telefone"
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                {...register('chavePix')}
              />
              {errors.chavePix && (
                <p className="text-amber-500 text-sm mt-1">{errors.chavePix.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="curso" className="text-gray-200">
                Curso para divulgar
              </Label>
              <select
                id="curso"
                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                {...register('curso')}
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
              {errors.curso && (
                <p className="text-amber-500 text-sm mt-1">{errors.curso.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800"
            >
              {isSubmitting ? 'Enviando...' : 'QUERO MEU CUPOM'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default FormularioCadastro;
