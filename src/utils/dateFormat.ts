function parseDate(value?: Date | string): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatarDiaSemana(value?: Date | string): string {
  const date = parseDate(value);
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  return capitalize(weekday);
}

export function formatarDataCurta(value?: Date | string): string {
  const date = parseDate(value);
  return date.toLocaleDateString('pt-BR');
}

export function formatarDataHora(value?: Date | string): string {
  const date = parseDate(value);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function hoje(): Date {
  return new Date();
}
