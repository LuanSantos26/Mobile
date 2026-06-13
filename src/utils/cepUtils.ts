export function formatarCepInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function cepDigitos(cep: string): string {
  return cep.replace(/\D/g, '').slice(0, 8);
}

export function cepValido(cep: string): boolean {
  return cepDigitos(cep).length === 8;
}

export function normalizarCep(cep: string): string {
  const digits = cepDigitos(cep);
  if (digits.length !== 8) {
    throw new Error('CEP inválido. Informe 8 números.');
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export interface DadosCep {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export async function buscarCep(cep: string): Promise<DadosCep | null> {
  const digits = cepDigitos(cep);
  if (digits.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  const data = await response.json().catch(() => null);

  if (!data || data.erro) return null;

  return {
    logradouro: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    cidade: data.localidade ?? '',
    uf: data.uf ?? '',
  };
}
