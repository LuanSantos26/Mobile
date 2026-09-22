export interface EstoqueItem {
  produtoId: number;
  nome: string;
  unidade: string;
  precoVenda: number;
  quantidade: number;
  imagemUrl?: string;
}

export interface Quiosque {
  id: number;
  nome: string;
  eventoId: number;
  eventoNome: string;
  ativa: number;
  totalProdutos: number;
  totalUnidades: number;
  atualizadoEm?: string;
  itens: EstoqueItem[];
}

export interface EstoqueItemPayload {
  produtoId: number;
  quantidade: number;
}

export interface QuiosquePayload {
  nome: string;
  empresaId: number;
  responsavelId: number;
  itens?: EstoqueItemPayload[];
}
