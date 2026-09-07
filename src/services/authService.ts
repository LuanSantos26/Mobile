import { API_BASE_URL } from '../config/api';

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
  };
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: { id: number; nome: string; descricao?: string };
  empresa: { id: number; nome: string; cnpj: string; telefone?: string };
  ativo: number;
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

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.erro === 'string'
        ? data.erro
        : 'Não foi possível concluir a operação.';
    throw new Error(message);
  }

  return data as T;
}

function normalizeLoginResponse(data: Record<string, unknown>): LoginResponse {
  if (typeof data.token === 'string' && data.usuario) {
    return {
      token: data.token,
      expiresIn: typeof data.expiresIn === 'number' ? data.expiresIn : 86400000,
      usuario: data.usuario as UsuarioLogado,
    };
  }

  if (typeof data.id === 'number' && typeof data.email === 'string') {
    return {
      token: `legacy:${data.id}`,
      expiresIn: 86400000,
      usuario: data as unknown as UsuarioLogado,
    };
  }

  throw new Error('Resposta inválida do servidor de login.');
}

export function isLegacyToken(token: string): boolean {
  return token.startsWith('legacy:');
}

export async function cadastrarConta(
  payload: CadastroContaPayload,
): Promise<CadastroContaResponse> {
  const response = await fetch(`${API_BASE_URL}/api/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<CadastroContaResponse>(response);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        senha: payload.senha,
      }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.erro === 'string'
        ? data.erro
        : 'E-mail ou senha incorretos.';
    throw new Error(message);
  }

  return normalizeLoginResponse(data as Record<string, unknown>);
}

export async function obterUsuarioAtual(token: string): Promise<UsuarioLogado> {
  const response = await fetch(`${API_BASE_URL}/api/usuarios/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<UsuarioLogado>(response);
}

export interface AtualizarUsuarioPayload {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface AtualizarEmpresaPayload {
  nome?: string;
  cnpj?: string;
  telefone?: string;
}

export async function atualizarUsuario(
  id: number,
  payload: AtualizarUsuarioPayload,
): Promise<UsuarioLogado> {
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<UsuarioLogado>(response);
}

export async function atualizarEmpresa(
  id: number,
  payload: AtualizarEmpresaPayload,
): Promise<UsuarioLogado['empresa']> {
  const response = await fetch(`${API_BASE_URL}/api/empresas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<UsuarioLogado['empresa']>(response);
}
