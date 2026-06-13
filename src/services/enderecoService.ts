import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';
import { normalizarCep } from '../utils/cepUtils';

const ENDERECO_STORAGE_KEY = 'sacola:enderecoId';

export interface EnderecoEntrega {
  id: number;
  empresaId: number;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  principal: boolean;
  resumo: string;
}

export interface EnderecoEntregaPayload {
  empresaId: number;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
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

export async function listarEnderecos(empresaId: number): Promise<EnderecoEntrega[]> {
  const response = await fetch(`${API_BASE_URL}/api/enderecos?empresaId=${empresaId}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar endereços.'),
    );
  }

  return data as EnderecoEntrega[];
}

export async function criarEndereco(payload: EnderecoEntregaPayload): Promise<EnderecoEntrega> {
  const body = {
    ...payload,
    cep: normalizarCep(payload.cep),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/enderecos`, {
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
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível salvar o endereço.'),
    );
  }

  return data as EnderecoEntrega;
}

export async function salvarEnderecoSelecionado(enderecoId: number): Promise<void> {
  await AsyncStorage.setItem(ENDERECO_STORAGE_KEY, String(enderecoId));
}

export async function obterEnderecoSelecionado(): Promise<number | null> {
  const value = await AsyncStorage.getItem(ENDERECO_STORAGE_KEY);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function resolverEnderecoInicial(
  enderecos: EnderecoEntrega[],
  enderecoSalvoId: number | null,
): EnderecoEntrega | null {
  if (enderecos.length === 0) return null;
  if (enderecoSalvoId != null) {
    const salvo = enderecos.find((e) => e.id === enderecoSalvoId);
    if (salvo) return salvo;
  }
  return enderecos.find((e) => e.principal) ?? enderecos[0];
}
