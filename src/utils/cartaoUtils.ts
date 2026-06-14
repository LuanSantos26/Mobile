export function normalizarNumeroCartao(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function detectarBandeira(numero: string): string {
  const digits = normalizarNumeroCartao(numero);
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|920))/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^(636368|636369|438935|504175|451416|636297|5067|4576|4011)/.test(digits)) {
    return 'Elo';
  }
  if (/^(606282|3841)/.test(digits)) return 'Hipercard';
  return 'Cartão';
}

export function extrairUltimosDigitos(numero: string): string {
  const digits = normalizarNumeroCartao(numero);
  return digits.slice(-4);
}

export function mascararTitular(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => `${parte.charAt(0).toUpperCase()}${'•'.repeat(Math.max(parte.length - 1, 2))}`)
    .join(' ');
}

export function formatarNumeroCartaoInput(valor: string): string {
  const digits = normalizarNumeroCartao(valor).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatarValidadeInput(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validadeValida(validade: string): boolean {
  const match = validade.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const mes = Number(match[1]);
  return mes >= 1 && mes <= 12;
}

export function mascararValidade(): string {
  return '••/••';
}

export function formatarCartaoExibicao(ultimosDigitos: string): string {
  return `•••• •••• •••• ${ultimosDigitos}`;
}

export function numeroCartaoValido(numero: string): boolean {
  const digits = normalizarNumeroCartao(numero);
  return digits.length >= 13 && digits.length <= 16;
}
