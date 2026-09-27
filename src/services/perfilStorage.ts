import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PerfilCadastro } from '../types/auth';

const PERFIL_KEY = '@quickstock_perfil_uso';

function storageKey(email: string) {
  return `${PERFIL_KEY}:${email.trim().toLowerCase()}`;
}

export async function savePerfilUso(email: string, perfil: PerfilCadastro): Promise<void> {
  await AsyncStorage.setItem(storageKey(email), perfil);
}

export async function loadPerfilUso(email: string): Promise<PerfilCadastro | null> {
  const value = await AsyncStorage.getItem(storageKey(email));
  if (value === 'Cliente' || value === 'Fornecedor' || value === 'ClienteFornecedor') {
    return value;
  }
  return null;
}
