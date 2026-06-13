import { API_BASE_URL } from '../config/api';

export type TipoNotificacao = 'compra' | 'promocao' | 'oferta';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  fornecedorId?: number;
  fornecedorNome?: string;
  solicitacaoId?: number;
  criadoEm: string;
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallback;
}

export async function listarNotificacoes(empresaCompradoraId: number): Promise<Notificacao[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/notificacoes?empresaCompradoraId=${empresaCompradoraId}`,
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar notificações.'),
    );
  }

  return data as Notificacao[];
}

export function labelTipoNotificacao(tipo: TipoNotificacao): string {
  if (tipo === 'compra') return 'Compra';
  if (tipo === 'promocao') return 'Promoção';
  return 'Oferta';
}

export function iconeTipoNotificacao(tipo: TipoNotificacao): string {
  if (tipo === 'compra') return 'bag-check-outline';
  if (tipo === 'promocao') return 'pricetag-outline';
  return 'flash-outline';
}
