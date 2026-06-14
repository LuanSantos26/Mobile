import AsyncStorage from '@react-native-async-storage/async-storage';

function lidasKey(empresaId: number): string {
  return `notificacoes:lidas:${empresaId}`;
}

export async function obterNotificacoesLidas(empresaId: number): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(lidasKey(empresaId));
  if (!raw) return new Set();
  try {
    const ids = JSON.parse(raw) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export async function marcarComoLida(empresaId: number, notificacaoId: string): Promise<void> {
  const lidas = await obterNotificacoesLidas(empresaId);
  lidas.add(notificacaoId);
  await AsyncStorage.setItem(lidasKey(empresaId), JSON.stringify([...lidas]));
}

export async function marcarTodasComoLidas(empresaId: number, ids: string[]): Promise<void> {
  const lidas = await obterNotificacoesLidas(empresaId);
  ids.forEach((id) => lidas.add(id));
  await AsyncStorage.setItem(lidasKey(empresaId), JSON.stringify([...lidas]));
}

export async function contarNaoLidas(empresaId: number, ids: string[]): Promise<number> {
  const lidas = await obterNotificacoesLidas(empresaId);
  return ids.filter((id) => !lidas.has(id)).length;
}
