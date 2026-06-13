import AsyncStorage from '@react-native-async-storage/async-storage';

const LIDAS_KEY = 'notificacoes:lidas';

export async function obterNotificacoesLidas(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(LIDAS_KEY);
  if (!raw) return new Set();
  try {
    const ids = JSON.parse(raw) as string[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

export async function marcarComoLida(notificacaoId: string): Promise<void> {
  const lidas = await obterNotificacoesLidas();
  lidas.add(notificacaoId);
  await AsyncStorage.setItem(LIDAS_KEY, JSON.stringify([...lidas]));
}

export async function marcarTodasComoLidas(ids: string[]): Promise<void> {
  const lidas = await obterNotificacoesLidas();
  ids.forEach((id) => lidas.add(id));
  await AsyncStorage.setItem(LIDAS_KEY, JSON.stringify([...lidas]));
}

export async function contarNaoLidas(ids: string[]): Promise<number> {
  const lidas = await obterNotificacoesLidas();
  return ids.filter((id) => !lidas.has(id)).length;
}
