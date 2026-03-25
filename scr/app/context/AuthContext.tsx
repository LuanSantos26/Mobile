import React, { createContext, useContext, useState, ReactNode } from 'react';
interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  logado: boolean;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  cadastrar: (dados: DadosCadastro) => Promise<boolean>;
}

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(false);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      if (email && senha.length >= 4) {
        setUsuario({
          id: '001',
          nome: 'Luan',
          email,
          perfil: 'admin',
        });
        return true;
      }
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const cadastrar = async (dados: DadosCadastro): Promise<boolean> => {
    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      if (dados.nome && dados.email && dados.senha.length >= 6) {
        setUsuario({
          id: Date.now().toString(),
          nome: dados.nome,
          email: dados.email,
        });
        return true;
      }
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => setUsuario(null);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        logado: !!usuario,
        carregando,
        login,
        logout,
        cadastrar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
