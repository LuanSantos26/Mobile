import { API_BASE_URL } from '../config/api';

export type TipoPagamento = 'pix' | 'credito' | 'debito' | 'dinheiro';

export interface FormaPagamentoSalva {
  id: number;
  empresaId: number;
  tipo: TipoPagamento;
  apelido: string;
  label: string;
  principal: boolean;
}

export interface FormaPagamentoPayload {
  empresaId: number;
  tipo: TipoPagamento;
  apelido: string;
  principal?: boolean;
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) {
    if (data.error === 'Method Not Allowed') {
      return 'Servidor desatualizado. Reinicie o backend e tente novamente.';
    }
    return data.error;
  }
  return fallback;
}

export function labelTipoPagamento(tipo: string): string {
  switch (tipo) {
    case 'pix':
      return 'PIX';
    case 'credito':
      return 'Crédito';
    case 'debito':
      return 'Débito';
    case 'dinheiro':
      return 'Dinheiro';
    default:
      return tipo;
  }
}

export function iconeTipoPagamento(tipo: string): 'phone-portrait-outline' | 'card-outline' | 'card' | 'cash-outline' {
  switch (tipo) {
    case 'pix':
      return 'phone-portrait-outline';
    case 'credito':
      return 'card-outline';
    case 'debito':
      return 'card';
    default:
      return 'cash-outline';
  }
}

export async function listarFormasPagamento(empresaId: number): Promise<FormaPagamentoSalva[]> {
  const response = await fetch(`${API_BASE_URL}/api/formas-pagamento?empresaId=${empresaId}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar formas de pagamento.'),
    );
  }

  return data as FormaPagamentoSalva[];
}

export async function criarFormaPagamento(payload: FormaPagamentoPayload): Promise<FormaPagamentoSalva> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/formas-pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `Não foi possível conectar ao servidor (${API_BASE_URL}). Verifique se o backend está rodando.`,
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível salvar a forma de pagamento.'),
    );
  }

  return data as FormaPagamentoSalva;
}

export async function removerFormaPagamento(id: number, empresaId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/formas-pagamento/${id}?empresaId=${empresaId}`,
    { method: 'DELETE' },
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível remover a forma de pagamento.'),
    );
  }
}
