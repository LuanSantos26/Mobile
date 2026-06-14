import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TipoChavePix,
  mascararChavePix,
  extrairUltimosDigitosPix,
  normalizarDocumento,
} from '../utils/pixUtils';

export type { TipoChavePix };

export interface PixSalvo {
  id: string;
  empresaId: number;
  apelido: string;
  tipoChave: TipoChavePix;
  chaveMascarada: string;
  ultimosDigitos: string;
}

export interface PixSalvoPayload {
  empresaId: number;
  apelido: string;
  tipoChave: TipoChavePix;
  chaveMascarada: string;
  ultimosDigitos: string;
}

const STORAGE_KEY_PREFIX = '@quickstock_pix_chaves';

function storageKey(empresaId: number): string {
  return `${STORAGE_KEY_PREFIX}_${empresaId}`;
}

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function listarChavesPix(empresaId: number): Promise<PixSalvo[]> {
  const raw = await AsyncStorage.getItem(storageKey(empresaId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as PixSalvo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    await AsyncStorage.removeItem(storageKey(empresaId));
    return [];
  }
}

export async function salvarChavePix(payload: PixSalvoPayload): Promise<PixSalvo> {
  const chaves = await listarChavesPix(payload.empresaId);
  const nova: PixSalvo = {
    id: gerarId(),
    ...payload,
  };

  chaves.unshift(nova);
  await AsyncStorage.setItem(storageKey(payload.empresaId), JSON.stringify(chaves));
  return nova;
}

export async function removerChavePix(empresaId: number, chaveId: string): Promise<void> {
  const chaves = await listarChavesPix(empresaId);
  const filtradas = chaves.filter((chave) => chave.id !== chaveId);
  await AsyncStorage.setItem(storageKey(empresaId), JSON.stringify(filtradas));
}

export async function garantirChaveCnpjInicial(
  empresaId: number,
  cnpjEmpresa?: string,
): Promise<PixSalvo[]> {
  const chaves = await listarChavesPix(empresaId);
  if (chaves.length > 0) return chaves;

  const cnpj = normalizarDocumento(cnpjEmpresa ?? '');
  if (cnpj.length !== 14) return chaves;

  await salvarChavePix({
    empresaId,
    apelido: 'CNPJ da empresa',
    tipoChave: 'cnpj',
    chaveMascarada: mascararChavePix('cnpj', cnpj),
    ultimosDigitos: extrairUltimosDigitosPix('cnpj', cnpj),
  });

  return listarChavesPix(empresaId);
}
