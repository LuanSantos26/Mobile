import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { listarProdutos, Produto } from '../services/productService';

interface ProductsContextValue {
  produtos: Produto[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!empresaId) {
      setProdutos([]);
      return;
    }

    setLoading(true);
    try {
      const lista = await listarProdutos(empresaId);
      setProdutos(lista);
      setError('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar produtos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ produtos, loading, error, refresh }),
    [produtos, loading, error, refresh],
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProdutos() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProdutos deve ser usado dentro de ProductsProvider.');
  }
  return context;
}
