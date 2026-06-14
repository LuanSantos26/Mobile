import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { BackTitleHeader } from '../components/BackTitleHeader';
import { HeaderCartBadge } from '../components/HeaderCartBadge';
import { useAppGoBack } from '../hooks/useAppGoBack';
import { usePurchaseCart } from '../context/PurchaseCartContext';
import { RemoteImage } from '../components/RemoteImage';
import { getImageUrl } from '../config/api';
import {
  labelTipoFornecedor,
  listarProdutosFornecedor,
} from '../services/marketplaceService';
import { formatarPreco, Produto, labelEstoque, corEstoque, normalizarEstoque } from '../services/productService';

const GOLD = '#F8B125';

export function StoreVitrineScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Cart');
  const route = useRoute<any>();
  const { itemCount } = usePurchaseCart();

  const fornecedorId = route.params?.fornecedorId as number;
  const fornecedorNome = route.params?.fornecedorNome as string ?? 'Distribuidora';
  const descricao = route.params?.descricao as string | undefined;
  const logoUrl = route.params?.logoUrl as string | undefined;
  const capaUrl = route.params?.capaUrl as string | undefined;
  const tipo = route.params?.tipo as string | undefined;

  const [search, setSearch] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const carregarProdutos = useCallback(async () => {
    if (!fornecedorId) return;
    setLoading(true);
    try {
      const lista = await listarProdutosFornecedor(fornecedorId);
      setProdutos(lista);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar produtos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fornecedorId]);

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [carregarProdutos]),
  );

  const produtosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((p) => p.nome.toLowerCase().includes(termo));
  }, [produtos, search]);

  const highlights = produtosFiltrados.slice(0, 3);

  const abrirProduto = (produto: Produto) => {
    navigation.navigate('ProductDetail', {
      produtoId: produto.id,
      fornecedorId,
      fornecedorNome,
      productName: produto.nome,
      price: formatarPreco(produto.precoVenda),
      descricao: produto.descricao,
      imagemUrl: produto.imagemUrl,
      unidade: produto.unidade,
      precoVenda: produto.precoVenda,
      estoque: produto.estoque,
      fornecedorDescricao: descricao,
      fornecedorLogoUrl: logoUrl,
      fornecedorTipo: tipo,
    });
  };

  const renderProduct = (produto: Produto, key: string) => {
    const estoqueQtd = normalizarEstoque(produto.estoque);
    const esgotado = estoqueQtd <= 0;

    return (
    <TouchableOpacity
      key={key}
      style={[styles.productSmall, esgotado && styles.productSmallDisabled]}
      activeOpacity={0.85}
      onPress={() => abrirProduto(produto)}
    >
      <View style={styles.imageBox}>
        {produto.imagemUrl ? (
          <RemoteImage
            uri={getImageUrl(produto.imagemUrl)}
            style={styles.productImage}
            fallbackLabel={produto.nome}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="beer-outline" size={32} color="#999" />
        )}
        <View style={[styles.stockPill, { backgroundColor: corEstoque(estoqueQtd) }]}>
          <Text style={styles.stockPillText} numberOfLines={1}>
            {esgotado ? 'Esgotado' : `${estoqueQtd} un.`}
          </Text>
        </View>
      </View>
      <Text style={styles.price}>{formatarPreco(produto.precoVenda)}</Text>
      <Text style={styles.name} numberOfLines={2}>{produto.nome}</Text>
      <Text style={[styles.stockHint, { color: corEstoque(estoqueQtd) }]}>
        {labelEstoque(estoqueQtd)}
      </Text>
    </TouchableOpacity>
  );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <BackTitleHeader
        title={fornecedorNome}
        onBack={goBack}
        rightSlot={
          itemCount > 0 ? (
            <HeaderCartBadge
              itemCount={itemCount}
              onPress={() => navigation.navigate('Sacola')}
            />
          ) : undefined
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color={GOLD} />
          <TextInput
            placeholder="Procure o produto"
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.banner}>
          {getImageUrl(capaUrl) ? (
            <RemoteImage
              uri={getImageUrl(capaUrl)!}
              style={styles.bannerImage}
              fallbackLabel={fornecedorNome}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={['#F8B125', '#FFD76A']}
              style={styles.bannerImage}
            />
          )}
          <TouchableOpacity style={styles.heartBanner} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={26} color={GOLD} />
          </TouchableOpacity>
        </View>

        <View style={styles.storeCard}>
          <RemoteImage
            uri={getImageUrl(logoUrl)}
            style={styles.storeLogo}
            fallbackLabel={fornecedorNome}
            resizeMode="cover"
          />

          <TouchableOpacity style={styles.storeRow} activeOpacity={0.8}>
            <Text style={styles.storeTitle} numberOfLines={1}>
              {fornecedorNome}
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.delivery}>
            {descricao || 'Distribuidora parceira de bebidas para revenda.'}
          </Text>

          <Text style={styles.deliveryMeta}>
            {produtos.length} {produtos.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
            {' · '}
            {labelTipoFornecedor(tipo ?? 'DISTRIBUIDOR')}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={GOLD} style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : produtosFiltrados.length === 0 ? (
          <Text style={styles.errorText}>Nenhum produto disponível nesta distribuidora.</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Destaques</Text>
            <View style={styles.threeColumns}>
              {highlights.map((item) => renderProduct(item, `highlight-${item.id}`))}
            </View>

            <Text style={styles.productsTitle}>Produtos</Text>
            <View style={styles.threeColumns}>
              {produtosFiltrados.map((item) => renderProduct(item, `product-${item.id}`))}
            </View>
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.cartButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(itemCount > 0 ? 'Sacola' : 'Cart')}
      >
        <Text style={styles.cartText}>
          {itemCount > 0 ? `Ver carrinho (${itemCount})` : 'Ver marketplace'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: GOLD,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#111',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 95,
  },

  banner: {
    height: 160,
    backgroundColor: '#D9D9D9',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  heartBanner: {
    position: 'absolute',
    top: 7,
    right: 13,
  },

  storeCard: {
    marginHorizontal: 25,
    marginTop: -45,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: GOLD,
    paddingHorizontal: 9,
    paddingTop: 37,
    paddingBottom: 12,
  },

  storeLogo: {
    position: 'absolute',
    top: -37,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFCB3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  storeLogoInitial: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
  },

  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  storeTitle: {
    flex: 1,
    fontSize: 23,
    fontWeight: '800',
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 6,
  },

  delivery: {
    fontSize: 13,
    color: '#111',
  },
  deliveryMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 15,
    color: '#111',
    marginTop: 18,
    marginLeft: 21,
    marginBottom: 10,
  },

  productsTitle: {
    fontSize: 15,
    color: '#111',
    marginTop: 8,
    marginLeft: 21,
    marginBottom: 10,
  },

  threeColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  productSmall: {
    width: '30%',
    marginBottom: 12,
  },
  productSmallDisabled: {
    opacity: 0.72,
  },

  imageBox: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  stockPill: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  stockPillText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    paddingHorizontal: 20,
  },

  price: {
    fontSize: 13,
    color: '#000',
    marginTop: 7,
  },

  name: {
    fontSize: 13,
    color: '#000',
    marginTop: 1,
  },
  stockHint: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },

  cartButton: {
    position: 'absolute',
    right: 15,
    bottom: 20,
    backgroundColor: GOLD,
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    zIndex: 20,
  },

  cartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});