import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import { Produto } from '../services/productService';

export interface CartItem {
  produtoId: number;
  nome: string;
  preco: number;
  unidade: string;
  quantidade: number;
  imagemUrl?: string;
}

interface FornecedorRef {
  id: number;
  nome: string;
}

interface PurchaseCartContextValue {
  fornecedorId: number | null;
  fornecedorNome: string | null;
  itens: CartItem[];
  itemCount: number;
  total: number;
  addItem: (
    produto: Produto,
    fornecedor: FornecedorRef,
    quantidade?: number,
  ) => Promise<boolean>;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  removeItem: (produtoId: number) => void;
  clear: () => void;
}

const PurchaseCartContext = createContext<PurchaseCartContextValue | null>(null);

function confirmarTrocaFornecedor(fornecedorNome: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      const ok = window.confirm(
        `Seu carrinho tem itens de outro fornecedor. Deseja limpar e comprar de ${fornecedorNome}?`,
      );
      resolve(ok);
      return;
    }

    Alert.alert(
      'Trocar fornecedor',
      `Seu carrinho tem itens de outro fornecedor. Deseja limpar e comprar de ${fornecedorNome}?`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Limpar e continuar', onPress: () => resolve(true) },
      ],
    );
  });
}

export function PurchaseCartProvider({ children }: { children: React.ReactNode }) {
  const [fornecedorId, setFornecedorId] = useState<number | null>(null);
  const [fornecedorNome, setFornecedorNome] = useState<string | null>(null);
  const [itens, setItens] = useState<CartItem[]>([]);

  const clear = useCallback(() => {
    setFornecedorId(null);
    setFornecedorNome(null);
    setItens([]);
  }, []);

  const addItem = useCallback(
    async (produto: Produto, fornecedor: FornecedorRef, quantidade = 1) => {
      if (fornecedorId !== null && fornecedorId !== fornecedor.id && itens.length > 0) {
        const confirmado = await confirmarTrocaFornecedor(fornecedor.nome);
        if (!confirmado) return false;
        clear();
      }

      setFornecedorId(fornecedor.id);
      setFornecedorNome(fornecedor.nome);

      setItens((prev) => {
        const existente = prev.find((item) => item.produtoId === produto.id);
        if (existente) {
          return prev.map((item) =>
            item.produtoId === produto.id
              ? { ...item, quantidade: item.quantidade + quantidade }
              : item,
          );
        }

        return [
          ...prev,
          {
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.precoVenda,
            unidade: produto.unidade,
            quantidade,
            imagemUrl: produto.imagemUrl,
          },
        ];
      });

      return true;
    },
    [clear, fornecedorId, itens.length],
  );

  const updateQuantity = useCallback((produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      setItens((prev) => prev.filter((item) => item.produtoId !== produtoId));
      return;
    }

    setItens((prev) =>
      prev.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((produtoId: number) => {
    setItens((prev) => {
      const next = prev.filter((item) => item.produtoId !== produtoId);
      if (next.length === 0) {
        setFornecedorId(null);
        setFornecedorNome(null);
      }
      return next;
    });
  }, []);

  const itemCount = useMemo(
    () => itens.reduce((acc, item) => acc + item.quantidade, 0),
    [itens],
  );

  const total = useMemo(
    () => itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
    [itens],
  );

  const value = useMemo(
    () => ({
      fornecedorId,
      fornecedorNome,
      itens,
      itemCount,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [
      fornecedorId,
      fornecedorNome,
      itens,
      itemCount,
      total,
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
