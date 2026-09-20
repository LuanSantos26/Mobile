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
import { BackTitleHeader } from '../../components/Header/BackTitleHeader';
import { HeaderCartBadge } from '../../components/Header/HeaderCartBadge';
import { useAppGoBack } from '../../hooks/useAppGoBack';
import { usePurchaseCart } from '../../context/PurchaseCartContext';
import { RemoteImage } from '../../components/Header/RemoteImage';
import { getImageUrl } from '../../config/api';
import {
  labelTipoFornecedor,
  listarProdutosFornecedor,
} from '../../services/marketplaceService';
import { formatarPreco, Produto, labelEstoque, corEstoque, normalizarEstoque } from '../../services/productService';

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
      codigo: produto.codigo,
      fornecedorDescricao: descricao,
      fornecedorLogoUrl: logoUrl,
      fornecedorTipo: tipo,
    });
  };

  const renderProduct = (produto: Produto, key: string, featured = false) => {
    const estoqueQtd = normalizarEstoque(produto.estoque);
    const esgotado = estoqueQtd <= 0;

    return (
    <TouchableOpacity
      key={key}
      style={[
        styles.productSmall,
        featured && styles.productFeatured,
        esgotado && styles.productSmallDisabled,
      ]}
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
      <Text style={styles.productCode}>
        {produto.codigo ? `ID ${produto.codigo}` : `#${produto.id}`}
      </Text>
      <Text style={[styles.stockHint, { color: corEstoque(estoqueQtd) }]}>
        {labelEstoque(estoqueQtd)}
      </Text>
    </TouchableOpacity>
  );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={GOLD} />
          <TextInput
            placeholder="Procure o produto"
            placeholderTextColor="#999"
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
        </View>

        <View style={styles.storeCard}>
          <RemoteImage
            uri={getImageUrl(logoUrl)}
            style={styles.storeLogo}
            fallbackLabel={fornecedorNome}
            resizeMode="cover"
          />

          <Text style={styles.storeTitle} numberOfLines={1}>
            {fornecedorNome}
          </Text>

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
            {highlights.length > 0 ? (
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Destaques</Text>
                  <Text style={styles.sectionSubtitle}>Os primeiros itens da loja</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.highlightsRow}
                >
                  {highlights.map((item) => renderProduct(item, `highlight-${item.id}`, true))}
                </ScrollView>
              </View>
            ) : null}

            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Produtos</Text>
                <Text style={styles.sectionSubtitle}>
                  {produtosFiltrados.length} item(ns) no catálogo
                </Text>
              </View>
              <View style={styles.twoColumns}>
                {produtosFiltrados.map((item) => renderProduct(item, `product-${item.id}`))}
              </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 95,
  },

  banner: {
    height: 160,
    marginHorizontal: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
    position: 'relative',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  storeCard: {
    marginHorizontal: 15,
    marginTop: -28,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: 16,
  },

  storeLogo: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  storeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8B125',
    textAlign: 'center',
  },

  delivery: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  deliveryMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8B125',
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  highlightsRow: {
    paddingRight: 4,
  },
  twoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  productSmall: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  productFeatured: {
    width: 148,
    marginRight: 12,
    marginBottom: 0,
  },
  productSmallDisabled: {
    opacity: 0.72,
  },

  imageBox: {
    width: '100%',
    height: 108,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#F8B125',
    marginTop: 8,
  },

  name: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
    minHeight: 32,
  },
  productCode: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
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