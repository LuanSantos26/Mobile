export type TipoChavePix = 'cnpj' | 'cpf' | 'email' | 'telefone' | 'aleatoria';

export function labelTipoChavePix(tipo: TipoChavePix): string {
  switch (tipo) {
    case 'cnpj':
      return 'CNPJ';
    case 'cpf':
      return 'CPF';
    case 'email':
      return 'E-mail';
    case 'telefone':
      return 'Telefone';
    case 'aleatoria':
      return 'Chave aleatória';
    default:
      return tipo;
  }
}

export function normalizarDocumento(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function formatarCnpjInput(valor: string): string {
  const digits = normalizarDocumento(valor).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarCpfInput(valor: string): string {
  const digits = normalizarDocumento(valor).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function formatarTelefoneInput(valor: string): string {
  const digits = normalizarDocumento(valor).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function mascararCnpj(cnpj: string): string {
  const digits = normalizarDocumento(cnpj);
  if (digits.length < 2) return '••.•••.•••/••••-••';
  return `••.•••.•••/••••-${digits.slice(-2)}`;
}

export function mascararCpf(cpf: string): string {
  const digits = normalizarDocumento(cpf);
  if (digits.length < 2) return '•••.•••.•••-••';
  return `•••.•••.•••-${digits.slice(-2)}`;
}

export function mascararEmail(email: string): string {
  const trimmed = email.trim();
  const [local, domain] = trimmed.split('@');
  if (!local || !domain) return '•••@•••';
  const visivel = local.charAt(0);
  return `${visivel}${'•'.repeat(Math.max(local.length - 1, 2))}@${domain}`;
}

export function mascararTelefone(telefone: string): string {
  const digits = normalizarDocumento(telefone);
  if (digits.length < 4) return '(••) •••••-••••';
  return `(••) •••••-${digits.slice(-4)}`;
}

export function mascararChaveAleatoria(chave: string): string {
  const limpa = chave.replace(/-/g, '').trim();
  if (limpa.length < 8) return '••••••••-••••-••••-••••-••••••••••••';
  return `${limpa.slice(0, 4)}••••-••••-••••-••••-${limpa.slice(-4)}`;
}

export function mascararChavePix(tipo: TipoChavePix, chave: string): string {
  switch (tipo) {
    case 'cnpj':
      return mascararCnpj(chave);
    case 'cpf':
      return mascararCpf(chave);
    case 'email':
      return mascararEmail(chave);
    case 'telefone':
      return mascararTelefone(chave);
    case 'aleatoria':
      return mascararChaveAleatoria(chave);
    default:
      return '••••••••';
  }
}

export function extrairUltimosDigitosPix(tipo: TipoChavePix, chave: string): string {
  if (tipo === 'email') {
    const [local] = chave.trim().split('@');
    return local.slice(-2) || '••';
  }
  if (tipo === 'aleatoria') {
    const limpa = chave.replace(/-/g, '');
    return limpa.slice(-4) || '••••';
  }
  const digits = normalizarDocumento(chave);
  return digits.slice(-2) || digits.slice(-4) || '••';
}

export function validarChavePix(tipo: TipoChavePix, chave: string): boolean {
  const trimmed = chave.trim();
  switch (tipo) {
    case 'cnpj':
      return normalizarDocumento(trimmed).length === 14;
    case 'cpf':
      return normalizarDocumento(trimmed).length === 11;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    case 'telefone': {
      const digits = normalizarDocumento(trimmed);
      return digits.length >= 10 && digits.length <= 11;
    }
    case 'aleatoria':
      return trimmed.replace(/-/g, '').length >= 32;
    default:
      return false;
  }
}

export function formatarChavePixInput(tipo: TipoChavePix, valor: string): string {
  switch (tipo) {
    case 'cnpj':
      return formatarCnpjInput(valor);
    case 'cpf':
      return formatarCpfInput(valor);
    case 'telefone':
      return formatarTelefoneInput(valor);
    default:
      return valor;
  }
}

export function placeholderChavePix(tipo: TipoChavePix): string {
  switch (tipo) {
    case 'cnpj':
      return '00.000.000/0000-00';
    case 'cpf':
      return '000.000.000-00';
    case 'email':
      return 'empresa@email.com';
    case 'telefone':
      return '(00) 00000-0000';
    case 'aleatoria':
      return '00000000-0000-0000-0000-000000000000';
    default:
      return '';
  }
}
