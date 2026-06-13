import { API_BASE_URL } from '../config/api';

export interface EstoqueItem {
  produtoId: number;
  nome: string;
  unidade: string;
  precoVenda: number;
  quantidade: number;
  imagemUrl?: string;
}

export interface Barraquinha {
  id: number;
  nome: string;
  eventoId: number;
  eventoNome: string;
  ativa: number;
  totalProdutos: number;
  totalUnidades: number;
  atualizadoEm?: string;
  itens: EstoqueItem[];
}

export interface EstoqueItemPayload {
  produtoId: number;
  quantidade: number;
}

export interface BarraquinhaPayload {
  nome: string;
  empresaId: number;
  responsavelId: number;
  itens?: EstoqueItemPayload[];
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallback;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível concluir a operação.'),
    );
  }

  return data as T;
}

function normalizeBarraquinha(data: Barraquinha): Barraquinha {
  return {
    ...data,
    totalProdutos: Number(data.totalProdutos ?? 0),
    totalUnidades: Number(data.totalUnidades ?? 0),
    itens: (data.itens ?? []).map((item) => ({
      ...item,
      precoVenda: Number(item.precoVenda),
      quantidade: Number(item.quantidade),
    })),
  };
}

export async function listarBarraquinhas(empresaId: number): Promise<Barraquinha[]> {
  const response = await fetch(`${API_BASE_URL}/api/barracas?empresaId=${empresaId}`);
  const lista = await parseResponse<Barraquinha[]>(response);
  return lista.map(normalizeBarraquinha);
}

export async function criarBarraquinha(payload: BarraquinhaPayload): Promise<Barraquinha> {
  const response = await fetch(`${API_BASE_URL}/api/barracas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizeBarraquinha(await parseResponse<Barraquinha>(response));
}

export async function atualizarBarraquinha(
  id: number,
  payload: BarraquinhaPayload,
): Promise<Barraquinha> {
  const response = await fetch(`${API_BASE_URL}/api/barracas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizeBarraquinha(await parseResponse<Barraquinha>(response));
}

export async function atualizarEstoque(
  id: number,
  itens: EstoqueItemPayload[],
): Promise<Barraquinha> {
  const response = await fetch(`${API_BASE_URL}/api/barracas/${id}/estoque`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itens }),
  });
  return normalizeBarraquinha(await parseResponse<Barraquinha>(response));
}

export async function removerBarraquinha(id: number, empresaId: number): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/barracas/${id}?empresaId=${empresaId}`,
    { method: 'DELETE' },
  );

  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível remover a barraquinha.'),
    );
  }
}

export function formatarQuantidade(quantidade: number, unidade: string): string {
  const valor = Number.isInteger(quantidade)
    ? String(quantidade)
    : quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  return `${valor} ${unidade}`;
}
