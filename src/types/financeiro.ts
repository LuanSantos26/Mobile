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

export interface FormaPagamentoResumo {
  metodo: string;
  label: string;
  percentual: number;
  valor: number;
}

/** Nome histórico no service financeiro — mesmo formato da API. */
export type FormaPagamento = FormaPagamentoResumo;

export interface FinanceiroResumo {
  lucroTotal: number;
  lucroMesAtual: number;
  mediaLucroMensal: number;
  margemLucroPercentual: number;
  mediaPedidosMensais: number;
  totalPedidosMesAtual: number;
  totalComprasMesAtual: number;
  mediaComprasMensais: number;
  totalVendasAcumulado?: number;
  totalComprasAcumulado?: number;
  lucrosMensais: MesLucro[];
  comprasMensais: MesValor[];
  vendasMensais?: MesValor[];
  pedidosMensais: MesPedidos[];
  formasPagamento: FormaPagamento[];
}

export interface TotaisFinanceiros {
  totalCompras: number;
  totalVendas: number;
  lucroTotal: number;
  margemPercentual: number;
}

export interface MovimentoStockDia {
  tipo: 'compra' | 'venda';
  nome: string;
  horario: string;
  quantidade: string;
  valor: number;
  origem: string;
}

export interface StockDia {
  data: string;
  dataLabel: string;
  totalCompras: number;
  totalVendas: number;
  lucro: number;
  margemPercentual: number;
  quantidadeCompras: number;
  quantidadeVendas: number;
  movimentos: MovimentoStockDia[];
}
