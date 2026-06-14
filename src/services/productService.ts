import { Platform } from 'react-native';
import { API_BASE_URL } from '../config/api';

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) {
    return data.erro;
  }
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }
  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }
  return fallback;
}

export interface Produto {
  id: number;
  empresaId: number;
  codigo?: string;
  codigoOrigem?: string;
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  ativo: number;
  estoque?: number;
}

export interface ProdutoPayload {
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  estoque?: number;
  empresaId: number;
}

export function normalizarProduto(data: Produto): Produto {
  return {
    ...data,
    precoVenda: Number(data.precoVenda),
    estoque: normalizarEstoque(data.estoque),
    ativo: Number(data.ativo ?? 1),
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        data as Record<string, unknown>,
        'Não foi possível concluir a operação.',
      ),
    );
  }

  return data as T;
}

export async function listarProdutos(empresaId: number): Promise<Produto[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/produtos?empresaId=${empresaId}`,
  );
  const lista = await parseResponse<Produto[]>(response);
  return lista.map(normalizarProduto);
}

export async function buscarProduto(id: number): Promise<Produto> {
  const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`);
  return normalizarProduto(await parseResponse<Produto>(response));
}

export async function criarProduto(payload: ProdutoPayload): Promise<Produto> {
  const response = await fetch(`${API_BASE_URL}/api/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizarProduto(await parseResponse<Produto>(response));
}

export async function atualizarProduto(
  id: number,
  payload: ProdutoPayload,
): Promise<Produto> {
  const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizarProduto(await parseResponse<Produto>(response));
}

export async function removerProduto(id: number, empresaId?: number): Promise<void> {
  const query = empresaId != null ? `?empresaId=${empresaId}` : '';
  const response = await fetch(`${API_BASE_URL}/api/produtos/${id}${query}`, {
    method: 'DELETE',
  });

  if (response.status >= 200 && response.status < 300) {
    return;
  }

  const data = await response.json().catch(() => ({}));
  throw new Error(
    extractErrorMessage(
      data as Record<string, unknown>,
      'Não foi possível remover o produto.',
    ),
  );
}

function resolveExtension(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    default:
      return 'jpg';
  }
}

export async function uploadImagemProduto(
  uri: string,
  mimeType = 'image/jpeg',
): Promise<string> {
  const normalizedMime =
    mimeType === 'image/jpg' ? 'image/jpeg' : mimeType || 'image/jpeg';
  const extension = resolveExtension(normalizedMime);
  const fileName = `produto.${extension}`;
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const fileResponse = await fetch(uri);
    const blob = await fileResponse.blob();
    formData.append('file', blob, fileName);
  } else {
    formData.append('file', {
      uri,
      name: fileName,
      type: normalizedMime,
    } as unknown as Blob);
  }

  const response = await fetch(`${API_BASE_URL}/api/produtos/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await parseResponse<{ imagemUrl: string }>(response);
  return data.imagemUrl;
}

export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarQuantidadeEstoque(produto: Produto): string {
  const qtd = normalizarEstoque(produto.estoque);
  return `${qtd} ${produto.unidade}`;
}

export function normalizarEstoque(estoque?: number): number {
  if (estoque == null || Number.isNaN(estoque)) return 0;
  return Math.max(0, Math.floor(estoque));
}

export function labelEstoque(estoque?: number): string {
  const qtd = normalizarEstoque(estoque);
  if (qtd <= 0) return 'Esgotado';
  if (qtd <= 20) return `Últimas ${qtd} unidades`;
  return `${qtd} unidades em estoque`;
}

export function corEstoque(estoque?: number): string {
  const qtd = normalizarEstoque(estoque);
  if (qtd <= 0) return '#C62828';
  if (qtd <= 20) return '#E65100';
  return '#2E7D32';
}
