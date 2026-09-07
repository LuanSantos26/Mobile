import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Produto } from '../services/productService';
import { useAuth } from './AuthContext';
import {
  clearPurchaseCart,
  loadPurchaseCart,
  savePurchaseCart,
  CartItem,
  cartItemKey,
} from '../services/purchaseCartStorage';

export type { CartItem };

export const TAXA_ENTREGA = 7;

export interface FornecedorGrupo {
  fornecedorId: number;
  fornecedorNome: string;
  itens: CartItem[];
  subtotal: number;
}

interface FornecedorRef {
  id: number;
  nome: string;
}

interface PurchaseCartContextValue {
  itens: CartItem[];
  gruposFornecedor: FornecedorGrupo[];
  itemCount: number;
  total: number;
  taxaEntregaTotal: number;
  isHydrated: boolean;
  addItem: (
    produto: Produto,
    fornecedor: FornecedorRef,
    quantidade?: number,
  ) => Promise<boolean>;
  updateQuantity: (fornecedorId: number, produtoId: number, quantidade: number) => void;
  removeItem: (fornecedorId: number, produtoId: number) => void;
  clear: () => void;
}

const PurchaseCartContext = createContext<PurchaseCartContextValue | null>(null);

function buildGruposFornecedor(itens: CartItem[]): FornecedorGrupo[] {
  const map = new Map<number, FornecedorGrupo>();

  for (const item of itens) {
    const existing = map.get(item.fornecedorId);
    if (existing) {
      existing.itens.push(item);
      existing.subtotal += item.preco * item.quantidade;
    } else {
      map.set(item.fornecedorId, {
        fornecedorId: item.fornecedorId,
        fornecedorNome: item.fornecedorNome,
        itens: [item],
        subtotal: item.preco * item.quantidade,
      });
    }
  }

  return Array.from(map.values());
}

export function PurchaseCartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id ?? null;

  const [itens, setItens] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedEmpresaRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    setItens([]);
    if (empresaId) {
      void clearPurchaseCart(empresaId);
    }
  }, [empresaId]);

  useEffect(() => {
    if (!empresaId) {
      setItens([]);
      setIsHydrated(false);
      hydratedEmpresaRef.current = null;
      return;
    }

    if (hydratedEmpresaRef.current === empresaId) return;

    let cancelled = false;
    setIsHydrated(false);

    (async () => {
      const stored = await loadPurchaseCart(empresaId);
      if (cancelled) return;

      setItens((current) => {
        if (current.length > 0) return current;
        return stored?.itens ?? [];
      });

      hydratedEmpresaRef.current = empresaId;
      setIsHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [empresaId]);

  useEffect(() => {
    if (!empresaId || !isHydrated) return;
    void savePurchaseCart(empresaId, { itens });
  }, [empresaId, isHydrated, itens]);

  const addItem = useCallback(
    async (produto: Produto, fornecedor: FornecedorRef, quantidade = 1) => {
      let added = false;

      setItens((prev) => {
        const existente = prev.find(
          (item) =>
            item.fornecedorId === fornecedor.id && item.produtoId === produto.id,
        );

        const qtdFinal = (existente?.quantidade ?? 0) + quantidade;
        const estoqueDisponivel =
          produto.estoque != null ? Math.floor(produto.estoque) : undefined;

        if (estoqueDisponivel != null && qtdFinal > estoqueDisponivel) {
          return prev;
        }

        added = true;

        if (existente) {
          return prev.map((item) =>
            item.fornecedorId === fornecedor.id && item.produtoId === produto.id
              ? { ...item, quantidade: qtdFinal }
              : item,
          );
        }

        return [
          ...prev,
          {
            produtoId: produto.id,
            fornecedorId: fornecedor.id,
            fornecedorNome: fornecedor.nome,
            nome: produto.nome,
            preco: produto.precoVenda,
            unidade: produto.unidade,
            quantidade,
            imagemUrl: produto.imagemUrl,
          },
        ];
      });

      return added;
    },
    [],
  );

  const updateQuantity = useCallback(
    (fornecedorId: number, produtoId: number, quantidade: number) => {
      if (quantidade <= 0) {
        setItens((prev) =>
          prev.filter(
            (item) =>
              !(item.fornecedorId === fornecedorId && item.produtoId === produtoId),
          ),
        );
        return;
      }

      setItens((prev) =>
        prev.map((item) =>
          item.fornecedorId === fornecedorId && item.produtoId === produtoId
            ? { ...item, quantidade }
            : item,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((fornecedorId: number, produtoId: number) => {
    setItens((prev) =>
      prev.filter(
        (item) =>
          !(item.fornecedorId === fornecedorId && item.produtoId === produtoId),
      ),
    );
  }, []);

  const gruposFornecedor = useMemo(() => buildGruposFornecedor(itens), [itens]);

  const itemCount = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens],
  );

  const total = useMemo(
    () => itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
    [itens],
  );

  const taxaEntregaTotal = useMemo(
    () => TAXA_ENTREGA * gruposFornecedor.length,
    [gruposFornecedor.length],
  );

  const value = useMemo(
    () => ({
      itens,
      gruposFornecedor,
      itemCount,
      total,
      taxaEntregaTotal,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [
      itens,
      gruposFornecedor,
      itemCount,
      total,
      taxaEntregaTotal,
      isHydrated,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    ],
  );

  return (
    <PurchaseCartContext.Provider value={value}>{children}</PurchaseCartContext.Provider>
  );
}

export function usePurchaseCart() {
  const context = useContext(PurchaseCartContext);
  if (!context) {
    throw new Error('usePurchaseCart deve ser usado dentro de PurchaseCartProvider.');
  }
  return context;
}

export { cartItemKey };
