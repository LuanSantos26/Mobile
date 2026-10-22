import { TipoCartao } from '../../services/cartaoPagamentoService';
import { TipoPagamento } from '../../services/formaPagamentoService';

export const TIPOS_DISPONIVEIS: { id: TipoPagamento; label: string }[] = [
  { id: 'pix', label: 'PIX' },
  { id: 'credito', label: 'Crédito' },
  { id: 'debito', label: 'Débito' },
  { id: 'dinheiro', label: 'Dinheiro' },
];

export function isTipoCartao(tipo: TipoPagamento): tipo is TipoCartao {
  return tipo === 'credito' || tipo === 'debito';
}

export function isFormaComDetalhes(tipo: TipoPagamento): boolean {
  return tipo === 'pix' || isTipoCartao(tipo);
}

export function hintForma(tipo: TipoPagamento): string {
  if (tipo === 'pix') return ' · Toque para ver chaves PIX';
  if (isTipoCartao(tipo)) return ' · Toque para ver cartões';
  return '';
}

