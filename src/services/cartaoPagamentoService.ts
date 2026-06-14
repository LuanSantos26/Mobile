import { API_BASE_URL } from '../config/api';

export type TipoCartao = 'credito' | 'debito';

export interface CartaoSalvo {
  id: number;
  empresaId: number;
  apelido: string | null;
  tipo: TipoCartao;
  bandeira: string;
  ultimosDigitos: string;
  numeroMascarado: string;
  validade: string;
  titular: string;
}

export interface CartaoSalvoPayload {
  empresaId: number;
  apelido?: string;
  tipo: TipoCartao;
  bandeira: string;
  ultimosDigitos: string;
  validade: string;
  titular: string;
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) {
    if (data.error === 'Method Not Allowed' || data.error === 'Not Found') {
      return 'Servidor desatualizado. Reinicie o backend e tente novamente.';
    }
    return data.error;
  }
  return fallback;
}

export function labelCartao(cartao: CartaoSalvo): string {
  if (cartao.apelido?.trim()) return cartao.apelido.trim();
  return `${cartao.bandeira} · •••• ${cartao.ultimosDigitos}`;
}

export async function listarCartoes(empresaId: number): Promise<CartaoSalvo[]> {
  const response = await fetch(`${API_BASE_URL}/api/cartoes-pagamento?empresaId=${empresaId}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar os cartões.'),
    );
  }

  return data as CartaoSalvo[];
}

export async function listarCartoesPorTipo(
  empresaId: number,
  tipo: TipoCartao,
): Promise<CartaoSalvo[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/cartoes-pagamento?empresaId=${empresaId}&tipo=${tipo}`,
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar os cartões.'),
    );
  }

  return data as CartaoSalvo[];
}

export async function salvarCartao(payload: CartaoSalvoPayload): Promise<CartaoSalvo> {
  const body: Record<string, unknown> = {
    empresaId: payload.empresaId,
    tipo: payload.tipo,
    bandeira: payload.bandeira,
    ultimosDigitos: payload.ultimosDigitos,
    validade: payload.validade,
    titular: payload.titular,
  };

  const apelido = payload.apelido?.trim();
  if (apelido) {
    body.apelido = apelido;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/cartoes-pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Não foi possível conectar ao servidor (${API_BASE_URL}). Verifique se o backend está rodando.`,
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível salvar o cartão.'),
    );
  }

  return data as CartaoSalvo;
}

export async function removerCartao(empresaId: number, cartaoId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/cartoes-pagamento/${cartaoId}?empresaId=${empresaId}`,
    { method: 'DELETE' },
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível remover o cartão.'),
    );
  }
}
