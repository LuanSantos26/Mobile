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
import { BottomTabBar, useTabBarScrollPadding } from '../components/BottomTabBar';
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

const H_PADDING = 15;
const CARD_GAP = 12;
const FEATURED_WIDTH = width - H_PADDING * 2;
const FEATURED_HEIGHT = Math.round(FEATURED_WIDTH * 0.42);
const PARTNER_CARD_WIDTH = Math.round((width - H_PADDING * 2 - CARD_GAP * 2) / 2.15);
const PARTNER_COVER_HEIGHT = Math.round(PARTNER_CARD_WIDTH * 0.58);

function LogoAvatar({
  nome,
  logoUrl,
  size = 50,
  style,
}: {
  nome: string;
  logoUrl?: string;
  size?: number;
  style?: object;
}) {
  return (
    <RemoteImage
      uri={getImageUrl(logoUrl)}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      fallbackLabel={nome}
      resizeMode="cover"
    />
  );
}

function CoverImage({
  capaUrl,
  nome,
  style,
}: {
  capaUrl?: string;
  nome: string;
  style?: object;
}) {
  const uri = getImageUrl(capaUrl);
  if (uri) {
    return (
      <RemoteImage
        uri={uri}
        style={[styles.coverFill, style]}
        fallbackLabel={nome}
        resizeMode="cover"
      />
    );
  }
  return (
    <LinearGradient
      colors={['#F8B125', '#FFD76A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.coverFill, style]}
    />
  );
}

interface FeaturedBannerProps {
  fornecedor: Fornecedor;
  onPress: () => void;
}

const FeaturedBanner = ({ fornecedor, onPress }: FeaturedBannerProps) => (
  <TouchableOpacity
    style={styles.featuredCard}
    activeOpacity={0.88}
    onPress={onPress}
  >
    <CoverImage capaUrl={fornecedor.capaUrl} nome={fornecedor.nome} />
    <LinearGradient
      colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0.78)']}
      locations={[0.35, 0.72, 1]}
      style={StyleSheet.absoluteFillObject}
    />
    <View style={styles.featuredFooter}>
      <LogoAvatar
        nome={fornecedor.nome}
        logoUrl={fornecedor.logoUrl}
        size={48}
        style={styles.featuredLogo}
      />
      <View style={styles.featuredTextWrap}>
        <Text style={styles.featuredTitle} numberOfLines={1}>
          {fornecedor.nome}
        </Text>
        <Text style={styles.featuredSubtitle} numberOfLines={1}>
          {labelTipoFornecedor(fornecedor.tipo)} · {fornecedor.totalProdutos} produtos
        </Text>
      </View>
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>Ver loja</Text>
        <Ionicons name="chevron-forward" size={14} color="#F8B125" />
      </View>
    </View>
  </TouchableOpacity>
);

interface PartnerCardProps {
  fornecedor: Fornecedor;
  onPress: () => void;
}

const PartnerCard = ({ fornecedor, onPress }: PartnerCardProps) => (
  <TouchableOpacity
    style={styles.partnerCard}
    activeOpacity={0.88}
    onPress={onPress}
  >
    <View style={styles.partnerCoverWrap}>
      <CoverImage capaUrl={fornecedor.capaUrl} nome={fornecedor.nome} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)']}
        style={styles.partnerCoverGradient}
      />
    </View>
    <View style={styles.partnerBody}>
      <LogoAvatar
        nome={fornecedor.nome}
        logoUrl={fornecedor.logoUrl}
        size={42}
        style={styles.partnerLogo}
      />
      <Text style={styles.partnerName} numberOfLines={2}>
        {fornecedor.nome}
      </Text>
      <Text style={styles.partnerMeta} numberOfLines={1}>
        {fornecedor.totalProdutos} produtos
      </Text>
    </View>
  </TouchableOpacity>
);

interface HorizontalCardProps {
  fornecedor: Fornecedor;
  subtitle: string;
  onPress: () => void;
}

const HorizontalCard = ({ fornecedor, subtitle, onPress }: HorizontalCardProps) => (
  <TouchableOpacity style={styles.horizontalCard} activeOpacity={0.8} onPress={onPress}>
    <LogoAvatar nome={fornecedor.nome} logoUrl={fornecedor.logoUrl} style={styles.avatarImage} />
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
    <View style={styles.storeCoverWrap}>
      <CoverImage capaUrl={fornecedor.capaUrl} nome={fornecedor.nome} />
    </View>
    <View style={styles.storeContent}>
      <View style={styles.storeHeaderRow}>
        <LogoAvatar nome={fornecedor.nome} logoUrl={fornecedor.logoUrl} size={46} style={styles.storeLogo} />
        <View style={styles.storeTextContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>{fornecedor.nome}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="storefront-outline" size={14} color="#F8B125" />
            <Text style={styles.ratingText}>{labelTipoFornecedor(fornecedor.tipo)}</Text>
            <Text style={styles.reviewsText}>({fornecedor.totalProdutos} produtos)</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#F8B125" />
      </View>
      <Text style={styles.deliveryText} numberOfLines={2}>
        {fornecedor.descricao || 'Bebidas para revenda em atacado.'}
      </Text>
    </View>
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

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
        <ScreenHeader
          showCartBadge={itemCount > 0}
          cartItemCount={itemCount}
          onCartPress={() => navigation.navigate('Sacola')}
        />

        <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#F8B125" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar distribuidora..."
              placeholderTextColor="#999"
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

        {fornecedoresFiltrados.length > 0 ? (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Em destaque</Text>
            <ScrollView
              horizontal
              pagingEnabled={false}
              decelerationRate="fast"
              snapToInterval={FEATURED_WIDTH + CARD_GAP}
              snapToAlignment="start"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredListPadding}
            >
              {fornecedoresFiltrados.map((fornecedor, index) => (
                <View
                  key={`destaque-${fornecedor.id}`}
                  style={[
                    styles.featuredItemWrap,
                    index === fornecedoresFiltrados.length - 1 && styles.featuredItemWrapLast,
                  ]}
                >
                  <FeaturedBanner
                    fornecedor={fornecedor}
                    onPress={() => abrirFornecedor(fornecedor)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.partnerListPadding}
                >
                  {fornecedoresFiltrados.map((fornecedor) => (
                    <PartnerCard
                      key={fornecedor.id}
                      fornecedor={fornecedor}
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
      </SafeAreaView>

      <BottomTabBar activeRoute="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E6CC',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#E8F5E9', marginHorizontal: 15, marginBottom: 10,
    padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#A5D6A7',
  },
  successBannerText: { color: '#2E7D32', flex: 1, marginRight: 8 },
  coverFill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  featuredSection: {
    marginBottom: 22,
  },
  featuredListPadding: {
    paddingHorizontal: H_PADDING,
  },
  featuredItemWrap: {
    width: FEATURED_WIDTH,
    marginRight: CARD_GAP,
  },
  featuredItemWrapLast: {
    marginRight: 0,
  },
  featuredCard: {
    width: FEATURED_WIDTH,
    height: FEATURED_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
  featuredFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  featuredLogo: {
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  featuredTextWrap: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  featuredSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    marginTop: 2,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 2,
  },
  featuredBadgeText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '600',
  },
  partnerListPadding: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 4,
  },
  partnerCard: {
    width: PARTNER_CARD_WIDTH,
    marginRight: CARD_GAP,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0E6CC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  partnerCoverWrap: {
    width: '100%',
    height: PARTNER_COVER_HEIGHT,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  partnerCoverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  partnerBody: {
    paddingHorizontal: 12,
    paddingTop: 22,
    paddingBottom: 12,
    minHeight: 96,
  },
  partnerLogo: {
    position: 'absolute',
    top: -21,
    left: 12,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
  },
  partnerName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    lineHeight: 17,
  },
  partnerMeta: {
    fontSize: 11,
    color: '#777',
  },
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
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F8B125',
    borderRadius: 18,
    marginBottom: 15,
    overflow: 'hidden',
  },
  storeCoverWrap: {
    width: '100%',
    height: 96,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  storeContent: {
    padding: 14,
  },
  storeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F0E6CC',
  },
  storeTextContainer: { flex: 1, justifyContent: 'center', marginRight: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#000', marginLeft: 4, marginRight: 4 },
  reviewsText: { fontSize: 11, color: '#666' },
  deliveryText: { fontSize: 11, color: '#333', marginTop: 8 },
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
