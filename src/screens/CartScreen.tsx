import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { RemoteImage } from '../components/RemoteImage';
import { useAuth } from '../context/AuthContext';
import { usePurchaseCart } from '../context/PurchaseCartContext';
import { getImageUrl } from '../config/api';
import {
  Fornecedor,
  SolicitacaoCompra,
  labelTipoFornecedor,
  labelStatusPedido,
  listarFornecedores,
  listarSolicitacoes,
} from '../services/marketplaceService';
import { formatarPreco } from '../services/productService';
import { formatarDataCurta } from '../utils/dateFormat';

const { width } = Dimensions.get('window');

function LogoAvatar({ nome, logoUrl }: { nome: string; logoUrl?: string }) {
  return (
    <RemoteImage
      uri={getImageUrl(logoUrl)}
      style={styles.avatarImage}
      fallbackLabel={nome}
      resizeMode="cover"
    />
  );
}

interface HorizontalCardProps {
  fornecedor: Fornecedor;
  subtitle: string;
  onPress: () => void;
}

const HorizontalCard = ({ fornecedor, subtitle, onPress }: HorizontalCardProps) => (
  <TouchableOpacity style={styles.horizontalCard} activeOpacity={0.8} onPress={onPress}>
    <LogoAvatar nome={fornecedor.nome} logoUrl={fornecedor.logoUrl} />
    <View style={styles.cardTextContainer}>
      <Text style={styles.cardTitle} numberOfLines={2}>{fornecedor.nome}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={2}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

interface StoreCardProps {
  fornecedor: Fornecedor;
  onPress: () => void;
}

const StoreCard = ({ fornecedor, onPress }: StoreCardProps) => (
  <TouchableOpacity style={styles.storeCard} activeOpacity={0.8} onPress={onPress}>
    <LogoAvatar nome={fornecedor.nome} logoUrl={fornecedor.logoUrl} />
    <View style={styles.storeTextContainer}>
      <Text style={styles.cardTitle}>{fornecedor.nome}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="storefront-outline" size={14} color="#F8B125" />
        <Text style={styles.ratingText}>{labelTipoFornecedor(fornecedor.tipo)}</Text>
        <Text style={styles.reviewsText}>({fornecedor.totalProdutos} produtos)</Text>
      </View>
      <Text style={styles.deliveryText} numberOfLines={2}>
        {fornecedor.descricao || 'Bebidas para revenda em atacado.'}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={22} color="#F8B125" />
  </TouchableOpacity>
);

export function CartScreen() {
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
    route.params?.solicitacaoEnviada ? 'Solicitação enviada com sucesso!' : '',
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
        setSuccessBanner('Solicitação enviada com sucesso!');
        navigation.setParams({ solicitacaoEnviada: undefined });
      }
      carregarDados();
    }, [carregarDados, navigation, route.params?.solicitacaoEnviada]),
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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          showCartBadge={itemCount > 0}
          cartItemCount={itemCount}
          onCartPress={() => navigation.navigate('Sacola')}
        />

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#F8B125" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar distribuidora..."
              value={busca}
              onChangeText={setBusca}
          />
        </View>

        {successBanner ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>{successBanner}</Text>
            <TouchableOpacity onPress={() => setSuccessBanner('')}>
              <Ionicons name="close" size={18} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        ) : null}

        {itemCount > 0 ? (
          <TouchableOpacity
            style={styles.checkoutBanner}
            onPress={() => navigation.navigate('Sacola')}
          >
            <Text style={styles.checkoutBannerText}>
              Ver carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : null}

        {fornecedoresFiltrados.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
            contentContainerStyle={styles.bannerListPadding}
          >
            {fornecedoresFiltrados.map((fornecedor) => {
              const capaUri = getImageUrl(fornecedor.capaUrl);
              return (
                <TouchableOpacity
                  key={`capa-${fornecedor.id}`}
                  style={styles.bannerCard}
                  activeOpacity={0.85}
                  onPress={() => abrirFornecedor(fornecedor)}
                >
                  {capaUri ? (
                    <RemoteImage
                      uri={capaUri}
                      style={styles.bannerImage}
                      fallbackLabel={fornecedor.nome}
                      resizeMode="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={['#F8B125', '#FFD76A']}
                      style={styles.bannerImage}
                    />
                  )}
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerText} numberOfLines={1}>{fornecedor.nome}</Text>
                    <Text style={styles.bannerSubtext} numberOfLines={1}>
                      {fornecedor.totalProdutos} produtos
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {loading ? (
          <ActivityIndicator color="#F8B125" style={{ marginVertical: 24 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={carregarDados}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distribuidoras parceiras</Text>
              {fornecedoresFiltrados.length === 0 ? (
                <Text style={styles.emptyText}>
                  {busca.trim()
                    ? 'Nenhuma distribuidora encontrada para esta busca.'
                    : 'Nenhuma distribuidora disponível no momento.'}
                </Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                  {fornecedoresFiltrados.map((fornecedor) => (
                    <HorizontalCard
                      key={fornecedor.id}
                      fornecedor={fornecedor}
                      subtitle={`${labelTipoFornecedor(fornecedor.tipo)} · ${fornecedor.totalProdutos} produtos`}
                      onPress={() => abrirFornecedor(fornecedor)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Últimas solicitações</Text>
              {solicitacoes.length === 0 ? (
                <Text style={styles.emptyText}>Você ainda não enviou solicitações de compra.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
                  {solicitacoes.slice(0, 10).map((solicitacao) => {
                    const fornecedorInfo = fornecedoresPorId.get(solicitacao.fornecedorId);
                    const fornecedorCard: Fornecedor = fornecedorInfo ?? {
                      id: solicitacao.fornecedorId,
                      nome: solicitacao.fornecedorNome,
                      tipo: 'DISTRIBUIDOR',
                      totalProdutos: 0,
                    };
                    return (
                    <HorizontalCard
                      key={solicitacao.id}
                      fornecedor={fornecedorCard}
                      subtitle={`${formatarDataCurta(solicitacao.criadoEm)} · ${formatarPreco(solicitacao.valorTotal)} · ${solicitacao.statusLabel ?? labelStatusPedido(solicitacao.status)}`}
                      onPress={() => navigation.navigate('PedidoAcompanhamento', { pedidoId: solicitacao.id })}
                    />
                    );
                  })}
                </ScrollView>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lojas</Text>
              <View style={styles.verticalListPadding}>
                {fornecedoresFiltrados.map((fornecedor) => (
                  <StoreCard
                    key={fornecedor.id}
                    fornecedor={fornecedor}
                    onPress={() => abrirFornecedor(fornecedor)}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomTabBar activeRoute="Cart" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 15, marginBottom: 12, paddingHorizontal: 15, height: 45,
    borderRadius: 25, borderWidth: 1, borderColor: '#F8B125',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#E8F5E9', marginHorizontal: 15, marginBottom: 10,
    padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#A5D6A7',
  },
  successBannerText: { color: '#2E7D32', flex: 1, marginRight: 8 },
  checkoutBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F8B125', marginHorizontal: 15, marginBottom: 12,
    padding: 14, borderRadius: 14,
  },
  checkoutBannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  bannerScroll: { marginBottom: 25 },
  bannerListPadding: { paddingHorizontal: 15 },
  bannerCard: {
    width: width * 0.75,
    height: 140,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 14,
  },
  bannerText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  bannerSubtext: { color: '#FFF', fontSize: 12, marginTop: 2, opacity: 0.9 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 15, marginBottom: 10 },
  emptyText: { marginHorizontal: 15, color: '#666' },
  emptyBox: { alignItems: 'center', padding: 20 },
  errorText: { color: '#D64545', textAlign: 'center', marginBottom: 8 },
  retryText: { color: '#F8B125', fontWeight: '600' },
  horizontalListPadding: { paddingHorizontal: 15 },
  verticalListPadding: { paddingHorizontal: 15 },
  horizontalCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 10,
    marginRight: 15, width: 220, height: 75,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatarFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8B125',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardTextContainer: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#000' },
  cardSubtitle: { fontSize: 11, color: '#666', marginTop: 2 },
  storeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 15, marginBottom: 15,
  },
  storeTextContainer: { flex: 1, justifyContent: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#000', marginLeft: 4, marginRight: 4 },
  reviewsText: { fontSize: 11, color: '#666' },
  deliveryText: { fontSize: 11, color: '#333' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
    backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15,
    borderWidth: 2, borderColor: '#F8B125', elevation: 6,
  },
});
