import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { usePurchaseCart } from '../../context/PurchaseCartContext';
import {
  Fornecedor,
  SolicitacaoCompra,
  listarFornecedores,
  listarSolicitacoes,
} from '../../services/marketplaceService';
import { useTabBarScrollPadding } from '../../components/layout/BottomTabBar';

export function useCart() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { itemCount } = usePurchaseCart();
  const empresaId = user?.empresa?.id;

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCompra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [successBanner, setSuccessBanner] = useState(
    route.params?.solicitacaoEnviada
      ? route.params?.mensagemSucesso ?? 'Solicitação enviada com sucesso!'
      : '',
  );

  const fornecedoresPorId = useMemo(
    () => new Map(fornecedores.map((f) => [f.id, f])),
    [fornecedores],
  );

  const fornecedoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return fornecedores;
    return fornecedores.filter(
      (f) =>
        f.nome.toLowerCase().includes(termo) ||
        (f.descricao?.toLowerCase().includes(termo) ?? false),
    );
  }, [fornecedores, busca]);

  const scrollBottomPadding = useTabBarScrollPadding();

  const carregarDados = useCallback(async () => {
    if (!empresaId) return;

    setLoading(true);
    try {
      const [listaFornecedores, listaSolicitacoes] = await Promise.all([
        listarFornecedores(empresaId),
        listarSolicitacoes(empresaId),
      ]);
      setFornecedores(listaFornecedores);
      setSolicitacoes(listaSolicitacoes);
      setError('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar marketplace.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.solicitacaoEnviada) {
        setSuccessBanner(
          route.params?.mensagemSucesso ?? 'Solicitação enviada com sucesso!',
        );
        navigation.setParams({ solicitacaoEnviada: undefined, mensagemSucesso: undefined });
      }
      carregarDados();
    }, [carregarDados, navigation, route.params?.solicitacaoEnviada, route.params?.mensagemSucesso]),
  );

  const abrirFornecedor = (fornecedor: Fornecedor) => {
    navigation.navigate('StoreVitrine', {
      fornecedorId: fornecedor.id,
      fornecedorNome: fornecedor.nome,
      descricao: fornecedor.descricao,
      logoUrl: fornecedor.logoUrl,
      capaUrl: fornecedor.capaUrl,
      tipo: fornecedor.tipo,
    });
  };

  return {
    navigation,
    itemCount,
    fornecedoresPorId,
    fornecedoresFiltrados,
    solicitacoes,
    loading,
    error,
    busca,
    setBusca,
    successBanner,
    setSuccessBanner,
    scrollBottomPadding,
    carregarDados,
    abrirFornecedor,
  };
}
