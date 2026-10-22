export type PerfilCadastro = 'Cliente' | 'Fornecedor' | 'ClienteFornecedor';

export interface CadastroContaPayload {
  empresa: {
    nome: string;
    cnpj: string;
    telefone?: string;
  };
  usuario: {
    nome: string;
    email: string;
    senha: string;
    cpf?: string;
  };
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: { id: number; nome: string; descricao?: string };
  empresa: {
    id: number;
    nome: string;
    cnpj: string;
    telefone?: string;
    tipo?: string;
    descricao?: string | null;
    logoUrl?: string | null;
    capaUrl?: string | null;
  };
  ativo: number;
  perfilUso?: PerfilCadastro;
  fotoUrl?: string | null;
}

export type CadastroContaResponse = UsuarioLogado;

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  usuario: UsuarioLogado;
}

export interface RecuperarSenhaPayload {
  email: string;
  novaSenha: string;
}

export interface AtualizarUsuarioPayload {
  nome?: string;
  email?: string;
  senha?: string;
  /** Foto de perfil: omitir mantém, string vazia remove. */
  fotoUrl?: string;
}

export interface AtualizarEmpresaPayload {
  nome?: string;
  cnpj?: string;
  telefone?: string;
  /** Perfil da loja: omitir mantém o valor atual, string vazia remove. */
  descricao?: string;
  logoUrl?: string;
  capaUrl?: string;
}

export interface StoredSession {
  token: string;
  usuario: UsuarioLogado;
  expiresAt: number;
}
