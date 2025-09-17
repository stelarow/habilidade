import { z } from "zod";

// Schema para validação do formulário progressivo de contato
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\) 9 \d{4}-\d{4}$/, "Telefone deve estar no formato (XX) 9 XXXX-XXXX")
    .refine((val) => {
      // Remove formatação e verifica se tem exatamente 11 dígitos
      const numbers = val.replace(/[^\d]/g, '');
      return numbers.length === 11 && numbers.charAt(2) === '9';
    }, {
      message: "Telefone deve incluir o 9º dígito e ter 11 números"
    }),

  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "E-mail inválido"
    }),

  course: z
    .string()
    .min(1, "Curso é obrigatório")
    .default("Informática"),

  message: z
    .string()
    .max(500, "Mensagem muito longa")
    .optional()
});

// Schema específico para cada etapa do formulário
export const stepSchemas = {
  step1: contactFormSchema.pick({ name: true }),
  step2: contactFormSchema.pick({ phone: true }),
  step3: contactFormSchema.pick({ message: true })
};

// Função para validar etapa específica
export const validateStep = (step, data) => {
  switch (step) {
    case 1:
      return stepSchemas.step1.safeParse(data);
    case 2:
      return stepSchemas.step2.safeParse(data);
    case 3:
      return stepSchemas.step3.safeParse(data);
    default:
      return contactFormSchema.safeParse(data);
  }
};

// Valores padrão do formulário
export const defaultFormValues = {
  name: "",
  phone: "",
  email: "",
  course: "Informática",
  message: ""
};