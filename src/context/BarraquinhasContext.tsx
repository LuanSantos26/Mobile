import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { Barraquinha, listarBarraquinhas } from '../services/barracaService';

interface BarraquinhasContextValue {
  barraquinhas: Barraquinha[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const BarraquinhasContext = createContext<BarraquinhasContextValue | null>(null);

export function BarraquinhasProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;
  const [barraquinhas, setBarraquinhas] = useState<Barraquinha[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!empresaId) {
      setBarraquinhas([]);
      return;
    }

    setLoading(true);
    try {
      const lista = await listarBarraquinhas(empresaId);
      setBarraquinhas(lista);
      setError('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar barraquinhas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ barraquinhas, loading, error, refresh }),
    [barraquinhas, loading, error, refresh],
  );

  return (
    <BarraquinhasContext.Provider value={value}>{children}</BarraquinhasContext.Provider>
  );
}

export function useBarraquinhas() {
  const context = useContext(BarraquinhasContext);
  if (!context) {
    throw new Error('useBarraquinhas deve ser usado dentro de BarraquinhasProvider.');
  }
  return context;
}
