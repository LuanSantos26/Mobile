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
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  ativo: number;
}

export interface ProdutoPayload {
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  empresaId: number;
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
  return parseResponse<Produto[]>(response);
}

export async function criarProduto(payload: ProdutoPayload): Promise<Produto> {
  const response = await fetch(`${API_BASE_URL}/api/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse<Produto>(response);
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
  return parseResponse<Produto>(response);
}

export async function removerProduto(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/produtos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      extractErrorMessage(
        data as Record<string, unknown>,
        'Não foi possível remover o produto.',
      ),
    );
  }
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
