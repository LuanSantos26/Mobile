export interface Produto {
  id: number;
  empresaId: number;
  codigo?: string;
  codigoOrigem?: string;
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  ativo: number;
  estoque?: number;
}

export interface ProdutoPayload {
  nome: string;
  precoVenda: number;
  unidade: string;
  descricao?: string;
  imagemUrl?: string;
  estoque?: number;
  empresaId: number;
}
