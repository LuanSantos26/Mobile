import type { SolicitacaoCompra } from '../services/marketplaceService';

export type RootStackParamList = {
  Animation: undefined;
  Welcome: { mensagemSucesso?: string } | undefined;
  Register: undefined;
  Cli_For: undefined;
  Login: undefined;
  ForgotPassword: { email?: string } | undefined;
  Home: undefined;
  Quiosque: undefined;
  Configuracoes: undefined;
  FormasPagamento: undefined;
  Enderecos: undefined;
  AddItem: undefined;
  Cart: { solicitacaoEnviada?: boolean; mensagemSucesso?: string } | undefined;
  Checkout: undefined;
  Sacola: undefined;
  PedidoAcompanhamento: { pedidoId: number; pedidoInicial?: SolicitacaoCompra; pedidosIds?: number[] };
  Cards: undefined;
  StoreVitrine: { fornecedorId: number; fornecedorNome: string; descricao?: string; logoUrl?: string; capaUrl?: string; tipo?: string };
  ProductDetail: { produtoId: number; fornecedorId: number; fornecedorNome: string; productName: string; price: string; descricao?: string; imagemUrl?: string; unidade?: string; precoVenda?: number; estoque?: number; codigo?: string; origem?: 'catalogo' | 'marketplace'; fornecedorDescricao?: string; fornecedorLogoUrl?: string; fornecedorTipo?: string };
  EmpresaVendas: undefined;
  Camioneiros: undefined;
  CadastroCamioneiros: undefined;
  Logistica: undefined;
  VitrineScreen: undefined;
};
