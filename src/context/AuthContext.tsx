import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearSession,
  isSessionExpired,
  loadSession,
  saveSession,
  StoredSession,
} from '../services/sessionStorage';
import {
  login as loginRequest,
  LoginPayload,
  obterUsuarioAtual,
  UsuarioLogado,
  isLegacyToken,
} from '../services/authService';

interface AuthContextValue {
  user: UsuarioLogado | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (usuario: UsuarioLogado) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioLogado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((session: StoredSession | null) => {
    if (!session || isSessionExpired(session.expiresAt)) {
      setUser(null);
      setToken(null);
      return false;
    }

    setUser(session.usuario);
    setToken(session.token);
    return true;
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const session = await loadSession();

      if (!session || isSessionExpired(session.expiresAt)) {
        await clearSession();
        applySession(null);
        return;
      }

      if (isLegacyToken(session.token)) {
        applySession(session);
        return;
      }

      try {
        const usuario = await obterUsuarioAtual(session.token);
        const refreshed: StoredSession = {
          token: session.token,
          usuario,
          expiresAt: session.expiresAt,
        };
        await saveSession(refreshed);
        applySession(refreshed);
      } catch {
        await clearSession();
        applySession(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload);

    if (!response.token || !response.usuario) {
      throw new Error('Não foi possível autenticar. Tente novamente.');
    }

    const session: StoredSession = {
      token: response.token,
      usuario: response.usuario,
      expiresAt: Date.now() + response.expiresIn,
    };

    await saveSession(session);
    const applied = applySession(session);

    if (!applied) {
      throw new Error('Sessão inválida. Tente novamente.');
    }
  }, [applySession]);

  const signOut = useCallback(async () => {
    await clearSession();
    applySession(null);
  }, [applySession]);

  const updateUser = useCallback(async (usuario: UsuarioLogado) => {
    const session = await loadSession();
    if (!session || isSessionExpired(session.expiresAt)) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    const refreshed: StoredSession = {
      ...session,
      usuario,
    };

    await saveSession(refreshed);
    applySession(refreshed);
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      signIn,
      signOut,
      updateUser,
    }),
    [user, token, isLoading, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
