import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Função para formatar telefone brasileiro (celular com 9 dígitos)
export function formatPhoneNumber(value) {
  if (!value) return '';

  // Remove todos os caracteres que não são números
  const phoneNumber = value.replace(/[^\d]/g, '');

  // Limita a 11 dígitos (2 do DDD + 9 do celular)
  const limitedPhone = phoneNumber.slice(0, 11);

  // Aplica a formatação (XX) 9XXXX-XXXX
  if (limitedPhone.length === 0) {
    return '';
  } else if (limitedPhone.length <= 2) {
    return limitedPhone;
  } else if (limitedPhone.length <= 3) {
    return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2)}`;
  } else if (limitedPhone.length <= 7) {
    return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2, 3)} ${limitedPhone.slice(3)}`;
  } else {
    return `(${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2, 3)} ${limitedPhone.slice(3, 7)}-${limitedPhone.slice(7)}`;
  }
}