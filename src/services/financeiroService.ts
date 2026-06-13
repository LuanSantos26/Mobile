import { API_BASE_URL } from '../config/api';

export interface MesValor {
  mes: string;
  label: string;
  valor: number;
}

export interface MesLucro {
  mes: string;
  label: string;
  lucro: number;
  gastos: number;
}

export interface MesPedidos {
  mes: string;
  label: string;
  quantidade: number;
}

export interface FormaPagamento {
  metodo: string;
  label: string;
  percentual: number;
  valor: number;
}

export interface FinanceiroResumo {
  lucroTotal: number;
  lucroMesAtual: number;
  mediaLucroMensal: number;
  margemLucroPercentual: number;
  mediaPedidosMensais: number;
  totalPedidosMesAtual: number;
  totalComprasMesAtual: number;
  mediaComprasMensais: number;
  lucrosMensais: MesLucro[];
  comprasMensais: MesValor[];
  pedidosMensais: MesPedidos[];
  formasPagamento: FormaPagamento[];
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallback;
}

function normalizeResumo(data: FinanceiroResumo): FinanceiroResumo {
  return {
    ...data,
    lucroTotal: Number(data.lucroTotal),
    lucroMesAtual: Number(data.lucroMesAtual),
    mediaLucroMensal: Number(data.mediaLucroMensal),
    totalComprasMesAtual: Number(data.totalComprasMesAtual),
    mediaComprasMensais: Number(data.mediaComprasMensais),
    lucrosMensais: (data.lucrosMensais ?? []).map((m) => ({
      ...m,
      lucro: Number(m.lucro),
      gastos: Number(m.gastos),
    })),
    comprasMensais: (data.comprasMensais ?? []).map((m) => ({
      ...m,
      valor: Number(m.valor),
    })),
    pedidosMensais: data.pedidosMensais ?? [],
    formasPagamento: (data.formasPagamento ?? []).map((f) => ({
      ...f,
      valor: Number(f.valor),
    })),
  };
}

export async function buscarResumoFinanceiro(
  empresaCompradoraId: number,
): Promise<FinanceiroResumo> {
  const response = await fetch(
    `${API_BASE_URL}/api/financeiro/resumo?empresaCompradoraId=${empresaCompradoraId}`,
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível carregar estatísticas.'),
    );
  }

  return normalizeResumo(data as FinanceiroResumo);
}
