import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { Quiosque, listarQuiosques } from '../services/barracaService';

interface QuiosqueContextValue {
  quiosques: Quiosque[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const QuiosqueContext = createContext<QuiosqueContextValue | null>(null);

export function QuiosqueProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;
  const [quiosques, setQuiosques] = useState<Quiosque[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!empresaId) {
      setQuiosques([]);
      return;
    }

    setLoading(true);
    try {
      const lista = await listarQuiosques(empresaId);
      setQuiosques(lista);
      setError('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar quiosques.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ quiosques, loading, error, refresh }),
    [quiosques, loading, error, refresh],
  );

  return (
    <QuiosqueContext.Provider value={value}>{children}</QuiosqueContext.Provider>
  );
}

export function useQuiosques() {
  const context = useContext(QuiosqueContext);
  if (!context) {
    throw new Error('useQuiosques deve ser usado dentro de QuiosqueProvider.');
  }
  return context;
}
