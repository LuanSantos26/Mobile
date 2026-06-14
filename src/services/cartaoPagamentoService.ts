import AsyncStorage from '@react-native-async-storage/async-storage';

export type TipoCartao = 'credito' | 'debito';

export interface CartaoSalvo {
  id: string;
  empresaId: number;
  apelido: string;
  tipo: TipoCartao;
  bandeira: string;
  ultimosDigitos: string;
  titularMascarado: string;
  validadeMascarada: string;
}

export interface CartaoSalvoPayload {
  empresaId: number;
  apelido: string;
  tipo: TipoCartao;
  bandeira: string;
  ultimosDigitos: string;
  titularMascarado: string;
  validadeMascarada: string;
}

const STORAGE_KEY_PREFIX = '@quickstock_cartoes_pagamento';

function storageKey(empresaId: number): string {
  return `${STORAGE_KEY_PREFIX}_${empresaId}`;
}

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function listarCartoes(empresaId: number): Promise<CartaoSalvo[]> {
  const raw = await AsyncStorage.getItem(storageKey(empresaId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartaoSalvo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await AsyncStorage.removeItem(storageKey(empresaId));
    return [];
  }
}

export async function listarCartoesPorTipo(
  empresaId: number,
  tipo: TipoCartao,
): Promise<CartaoSalvo[]> {
  const cartoes = await listarCartoes(empresaId);
  return cartoes.filter((cartao) => cartao.tipo === tipo);
}

export async function salvarCartao(payload: CartaoSalvoPayload): Promise<CartaoSalvo> {
  const cartoes = await listarCartoes(payload.empresaId);
  const novo: CartaoSalvo = {
    id: gerarId(),
    ...payload,
  };

  cartoes.unshift(novo);
  await AsyncStorage.setItem(storageKey(payload.empresaId), JSON.stringify(cartoes));
  return novo;
}

export async function removerCartao(empresaId: number, cartaoId: string): Promise<void> {
  const cartoes = await listarCartoes(empresaId);
  const filtrados = cartoes.filter((cartao) => cartao.id !== cartaoId);
  await AsyncStorage.setItem(storageKey(empresaId), JSON.stringify(filtrados));
}
