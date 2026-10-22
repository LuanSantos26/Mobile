export type TipoNotificacao = 'compra' | 'promocao' | 'oferta' | 'sistema';

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
