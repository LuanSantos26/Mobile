import { API_BASE_URL } from '../config/api';
import { Produto } from './productService';

export interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  tipo: string;
  totalProdutos: number;
  logoUrl?: string;
  capaUrl?: string;
}

export interface ItemSolicitacao {
  produtoId: number;
  nome: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  imagemUrl?: string;
}

export interface EtapaPedido {
  codigo: string;
  label: string;
  ordem: number;
  concluida: boolean;
  ativa: boolean;
}

export interface SolicitacaoCompra {
  id: number;
  fornecedorId: number;
  fornecedorNome: string;
  status: string;
  statusLabel?: string;
  etapas?: EtapaPedido[];
  valorTotal: number;
  observacao?: string;
  metodoPagamento?: string;
  enderecoResumo?: string;
  taxaEntrega?: number;
  criadoEm: string;
  itens: ItemSolicitacao[];
}

export type MetodoPagamento = 'pix' | 'credito' | 'debito' | 'dinheiro';

export interface ItemSolicitacaoPayload {
  produtoId: number;
  quantidade: number;
}

export interface SolicitacaoCompraPayload {
  empresaCompradoraId: number;
  empresaFornecedoraId: number;
  usuarioId: number;
  observacao?: string;
  metodoPagamento: MetodoPagamento;
  enderecoEntregaId: number;
  taxaEntrega?: number;
  itens: ItemSolicitacaoPayload[];
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  if (typeof data.erro === 'string' && data.erro.trim()) return data.erro;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;
  if (typeof data.error === 'string' && data.error.trim()) return data.error;
  return fallback;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(data as Record<string, unknown>, 'Não foi possível concluir a operação.'),
    );
  }

  return data as T;
}

function normalizeProduto(data: Produto): Produto {
  return {
    ...data,
    precoVenda: Number(data.precoVenda),
  };
}

function normalizeSolicitacao(data: SolicitacaoCompra): SolicitacaoCompra {
  return {
    ...data,
    valorTotal: Number(data.valorTotal),
    taxaEntrega: data.taxaEntrega != null ? Number(data.taxaEntrega) : undefined,
    itens: (data.itens ?? []).map((item) => ({
      ...item,
      quantidade: Number(item.quantidade),
      precoUnitario: Number(item.precoUnitario),
      subtotal: Number(item.subtotal),
    })),
  };
}

export async function listarFornecedores(empresaCompradoraId?: number): Promise<Fornecedor[]> {
  const query = empresaCompradoraId ? `?empresaCompradoraId=${empresaCompradoraId}` : '';
  const response = await fetch(`${API_BASE_URL}/api/marketplace/fornecedores${query}`);
  return parseResponse<Fornecedor[]>(response);
}

export async function listarProdutosFornecedor(fornecedorId: number): Promise<Produto[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/marketplace/fornecedores/${fornecedorId}/produtos`,
  );
  const lista = await parseResponse<Produto[]>(response);
  return lista.map(normalizeProduto);
}

export async function criarSolicitacaoCompra(
  payload: SolicitacaoCompraPayload,
): Promise<SolicitacaoCompra> {
  const response = await fetch(`${API_BASE_URL}/api/solicitacoes-compra`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return normalizeSolicitacao(await parseResponse<SolicitacaoCompra>(response));
}

export async function listarSolicitacoes(
  empresaCompradoraId: number,
): Promise<SolicitacaoCompra[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/solicitacoes-compra?empresaCompradoraId=${empresaCompradoraId}`,
  );
  const lista = await parseResponse<SolicitacaoCompra[]>(response);
  return lista.map(normalizeSolicitacao);
}

export async function buscarSolicitacao(
  pedidoId: number,
  empresaCompradoraId: number,
): Promise<SolicitacaoCompra> {
  const response = await fetch(
    `${API_BASE_URL}/api/solicitacoes-compra/${pedidoId}?empresaCompradoraId=${empresaCompradoraId}`,
  );
  return normalizeSolicitacao(await parseResponse<SolicitacaoCompra>(response));
}

export function labelStatusPedido(status: string): string {
  switch (status) {
    case 'aguardando_liberacao':
      return 'Aguardando liberação da distribuidora';
    case 'em_rota':
      return 'Saindo para rota de entrega';
    case 'entregue':
      return 'Pedido entregue';
    case 'cancelada':
      return 'Pedido cancelado';
    default:
      return 'Pedido em andamento';
  }
}

export function labelMetodoPagamento(metodo?: string): string {
  switch (metodo) {
    case 'pix':
      return 'PIX';
    case 'credito':
      return 'Cartão de crédito';
    case 'debito':
      return 'Cartão de débito';
    case 'dinheiro':
      return 'Dinheiro';
    default:
      return metodo ?? '—';
  }
}

export function labelTipoFornecedor(tipo: string): string {
  if (tipo === 'PLATAFORMA') return 'Plataforma';
  if (tipo === 'DISTRIBUIDOR') return 'Distribuidora';
  return tipo;
}
