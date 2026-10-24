import { Platform } from 'react-native';
import { apiFetch, NETWORK_ERROR_MESSAGE, parseResponse } from './http';
import type {
  CadastroContaPayload,
  CadastroContaResponse,
  UsuarioLogado,
  LoginPayload,
  LoginResponse,
  RecuperarSenhaPayload,
  AtualizarUsuarioPayload,
  AtualizarEmpresaPayload,
} from '../types/auth';

export type {
  CadastroContaPayload,
  CadastroContaResponse,
  UsuarioLogado,
  LoginPayload,
  LoginResponse,
  RecuperarSenhaPayload,
  AtualizarUsuarioPayload,
  AtualizarEmpresaPayload,
};

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
  const response = await apiFetch(`/api/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<CadastroContaResponse>(response);
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await apiFetch(`/api/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        senha: payload.senha,
      }),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
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

export async function recuperarSenha(payload: RecuperarSenhaPayload): Promise<void> {
  let response: Response;

  try {
    response = await apiFetch(`/api/usuarios/recuperar-senha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        novaSenha: payload.novaSenha,
      }),
    });
  } catch {
    throw new Error(NETWORK_ERROR_MESSAGE);
  }

  await parseResponse<Record<string, unknown>>(response);
}

export async function obterUsuarioAtual(token: string): Promise<UsuarioLogado> {
  const response = await apiFetch(`/api/usuarios/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<UsuarioLogado>(response);
}

export async function atualizarUsuario(
  id: number,
  payload: AtualizarUsuarioPayload,
): Promise<UsuarioLogado> {
  const response = await apiFetch(`/api/usuarios/${id}`, {
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
  const response = await apiFetch(`/api/empresas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<UsuarioLogado['empresa']>(response);
}

async function enviarImagem(
  rota: string,
  nomeBase: string,
  uri: string,
  mimeType: string,
): Promise<string> {
  const normalizedMime = mimeType === 'image/jpg' ? 'image/jpeg' : mimeType || 'image/jpeg';
  const extension = normalizedMime === 'image/png' ? 'png' : normalizedMime === 'image/webp' ? 'webp' : 'jpg';
  const fileName = `${nomeBase}.${extension}`;
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const fileResponse = await fetch(uri);
    const blob = await fileResponse.blob();
    formData.append('file', blob, fileName);
  } else {
    formData.append('file', {
      uri,
      name: fileName,
      type: normalizedMime,
    } as unknown as Blob);
  }

  const response = await apiFetch(rota, {
    method: 'POST',
    body: formData,
  });

  const data = await parseResponse<{ imagemUrl: string }>(response);
  return data.imagemUrl;
}

/** Envia a foto ou a capa da loja e devolve a URL a gravar em logoUrl/capaUrl. */
export function uploadImagemEmpresa(uri: string, mimeType = 'image/jpeg'): Promise<string> {
  return enviarImagem('/api/empresas/upload', 'empresa', uri, mimeType);
}

/** Envia a foto de perfil do usuário e devolve a URL a gravar em fotoUrl. */
export function uploadFotoUsuario(uri: string, mimeType = 'image/jpeg'): Promise<string> {
  return enviarImagem('/api/usuarios/upload', 'usuario', uri, mimeType);
}
