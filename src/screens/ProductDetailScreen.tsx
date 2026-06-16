import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
  buscarProduto,
  corEstoque,
  formatarPreco,
  labelEstoque,
  normalizarEstoque,
} from '../services/productService';
import { listarProdutosFornecedor } from '../services/marketplaceService';

const GOLD = '#F8B125';

export function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Cart');
  const route = useRoute<any>();
  const { addItem, itemCount, itens } = usePurchaseCart();

  const fornecedorId = route.params?.fornecedorId as number;
  const fornecedorNome = route.params?.fornecedorNome as string ?? 'Distribuidora';
  const fornecedorDescricao = route.params?.fornecedorDescricao as string | undefined;
  const fornecedorLogoUrl = route.params?.fornecedorLogoUrl as string | undefined;
  const produtoId = route.params?.produtoId as number;
  const origem = route.params?.origem as string | undefined;
  const isCatalogo = origem === 'catalogo';

  const [productName, setProductName] = useState(route.params?.productName || 'Produto');
  const [descricao, setDescricao] = useState(route.params?.descricao as string | undefined);
  const [imagemUrl, setImagemUrl] = useState(route.params?.imagemUrl as string | undefined);
  const [unidade, setUnidade] = useState((route.params?.unidade as string) ?? 'UN');
  const [precoVenda, setPrecoVenda] = useState(Number(route.params?.precoVenda ?? 0));
  const [estoque, setEstoque] = useState(normalizarEstoque(route.params?.estoque));
  const [productCodigo, setProductCodigo] = useState(route.params?.codigo as string | undefined);
  const [loading, setLoading] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [adding, setAdding] = useState(false);

  const qtdNoCarrinho = useMemo(
    () =>
      itens.find(
        (item) => item.fornecedorId === fornecedorId && item.produtoId === produtoId,
      )?.quantidade ?? 0,
    [itens, fornecedorId, produtoId],
  );

  const estoqueRestante = isCatalogo
    ? estoque
    : Math.max(0, estoque - qtdNoCarrinho);
  const esgotado = estoqueRestante <= 0;
  const estoqueLabel = labelEstoque(isCatalogo ? estoque : estoqueRestante);
  const estoqueColor = corEstoque(isCatalogo ? estoque : estoqueRestante);

  const carregarProduto = useCallback(async () => {
    if (!produtoId) return;
    setLoading(true);
    try {
      if (isCatalogo) {
        const produto = await buscarProduto(produtoId);
        setProductName(produto.nome);
        setDescricao(produto.descricao);
        setImagemUrl(produto.imagemUrl);
        setUnidade(produto.unidade);
        setPrecoVenda(produto.precoVenda);
        setEstoque(normalizarEstoque(produto.estoque));
        setProductCodigo(produto.codigo);
        return;
      }

      if (!fornecedorId) return;
      const lista = await listarProdutosFornecedor(fornecedorId);
      const produto = lista.find((p) => p.id === produtoId);
      if (produto) {
        setProductName(produto.nome);
        setDescricao(produto.descricao);
        setImagemUrl(produto.imagemUrl);
        setUnidade(produto.unidade);
        setPrecoVenda(produto.precoVenda);
        setEstoque(normalizarEstoque(produto.estoque));
        setProductCodigo(produto.codigo);
      }
    } finally {
      setLoading(false);
    }
  }, [fornecedorId, produtoId, isCatalogo]);

  useFocusEffect(
    useCallback(() => {
      carregarProduto();
    }, [carregarProduto]),
  );

  const handleAddToCart = async () => {
    if (!fornecedorId || !produtoId) {
      setFeedback('Produto ou fornecedor inválido.');
      return;
    }

    if (esgotado) {
      setFeedback('Produto esgotado no momento.');
      return;
    }

    if (quantity > estoqueRestante) {
      setFeedback(`Apenas ${estoqueRestante} unidade(s) disponível(is).`);
      return;
    }

    setAdding(true);
    setFeedback('');

    const ok = await addItem(
      {
        id: produtoId,
        empresaId: fornecedorId,
        nome: productName,
        precoVenda,
        unidade,
        descricao,
        imagemUrl,
        ativo: 1,
        estoque: estoqueRestante,
      },
      { id: fornecedorId, nome: fornecedorNome },
      quantity,
    );

    setAdding(false);

    if (ok) {
      setFeedback('Produto adicionado ao carrinho!');
    } else {
      setFeedback('Quantidade indisponível em estoque.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BackTitleHeader
          title="Detalhes do produto"
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

        <View style={styles.heroCard}>
          <View style={styles.imageWrap}>
            {imagemUrl ? (
              <RemoteImage
                uri={getImageUrl(imagemUrl)}
                style={styles.heroImage}
                fallbackLabel={productName}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.heroPlaceholder}>
                <Ionicons name="wine-outline" size={48} color="#999" />
              </View>
            )}
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.productName}>{productName.replace('\n', ' ')}</Text>
            {productCodigo ? (
              <Text style={styles.productCode}>ID {productCodigo}</Text>
            ) : null}

            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatarPreco(precoVenda)}</Text>
              <View style={styles.unitChip}>
                <Text style={styles.unitChipText}>/{unidade}</Text>
              </View>
            </View>

            <View style={[styles.stockBadge, { borderColor: estoqueColor }]}>
              <Ionicons name="cube-outline" size={16} color={estoqueColor} />
              <Text style={[styles.stockText, { color: estoqueColor }]}>
                {loading ? 'Atualizando estoque...' : estoqueLabel}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.storeCard}
          activeOpacity={0.85}
          onPress={goBack}
          disabled={isCatalogo}
        >
          <RemoteImage
            uri={getImageUrl(fornecedorLogoUrl)}
            style={styles.storeLogo}
            fallbackLabel={fornecedorNome}
            resizeMode="cover"
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeLabel}>
              {isCatalogo ? 'Produto do seu catálogo' : 'Vendido por'}
            </Text>
            <Text style={styles.storeName} numberOfLines={1}>
              {fornecedorNome}
            </Text>
            <Text style={styles.storeDesc} numberOfLines={2}>
              {fornecedorDescricao ||
                (isCatalogo
                  ? 'Item cadastrado na sua empresa para controle de estoque.'
                  : 'Distribuidora parceira de bebidas para revenda.')}
            </Text>
          </View>
          {!isCatalogo ? (
            <Ionicons name="chevron-forward" size={20} color="#666" />
          ) : null}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o produto</Text>
          <Text style={styles.description}>
            {descricao || 'Produto disponível para solicitação de compra ao fornecedor.'}
          </Text>
        </View>

        {!isCatalogo ? (
          <View style={styles.section}>
            <View style={styles.observationTitleRow}>
              <Ionicons name="create-outline" size={18} color="#333" />
              <Text style={styles.observationTitle}>Observações do pedido</Text>
            </View>
            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder="Ex.: entregar antes das 18h"
              placeholderTextColor="#999"
              style={styles.observationInput}
              multiline
            />
          </View>
        ) : null}

        {feedback ? (
          <Text
            style={[
              styles.feedbackText,
              feedback.includes('adicionado') ? styles.feedbackOk : styles.feedbackErr,
            ]}
          >
            {feedback}
          </Text>
        ) : null}
      </ScrollView>

      {!isCatalogo ? (
        <View style={styles.bottomBar}>
          <View style={styles.quantityBox}>
            <TouchableOpacity
              style={[styles.quantityButton, esgotado && styles.quantityButtonDisabled]}
              activeOpacity={0.8}
              disabled={esgotado}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={22} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={[styles.quantityButton, esgotado && styles.quantityButtonDisabled]}
              activeOpacity={0.8}
              disabled={esgotado || quantity >= estoqueRestante}
              onPress={() => setQuantity((q) => Math.min(estoqueRestante, q + 1))}
            >
              <Ionicons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.addButton, (esgotado || adding) && styles.addButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleAddToCart}
            disabled={esgotado || adding}
          >
            {adding ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.addButtonText}>{esgotado ? 'Esgotado' : 'Adicionar'}</Text>
                {!esgotado ? (
                  <Text style={styles.addButtonPrice}>{formatarPreco(precoVenda * quantity)}</Text>
                ) : null}
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.catalogFooter}>
          <View style={[styles.catalogStockBadge, { borderColor: estoqueColor }]}>
            <Ionicons name="cube-outline" size={18} color={estoqueColor} />
            <Text style={[styles.catalogStockText, { color: estoqueColor }]}>
              {loading ? 'Atualizando...' : `${estoque} ${unidade} em estoque`}
            </Text>
          </View>
          <Text style={styles.catalogPrice}>{formatarPreco(precoVenda)}</Text>
        </View>
      )}

      {!isCatalogo && feedback.includes('adicionado') ? (
        <TouchableOpacity
          style={styles.checkoutFab}
          onPress={() => navigation.navigate('Sacola')}
        >
          <Text style={styles.checkoutFabText}>Ir ao carrinho</Text>
        </TouchableOpacity>
      ) : null}
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
    height: 280,
  },
  scrollContent: {
    paddingBottom: 130,
    paddingHorizontal: 16,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 14,
  },
  imageWrap: {
    height: 220,
    backgroundColor: '#F0F0F0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBody: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    lineHeight: 26,
  },
  productCode: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: GOLD,
  },
  unitChip: {
    backgroundColor: '#FFF8E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  unitChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '700',
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 14,
    gap: 10,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  storeInfo: {
    flex: 1,
  },
  storeLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  storeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginTop: 2,
  },
  storeDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 21,
  },
  observationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  observationTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },
  observationInput: {
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
  feedbackText: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  feedbackOk: {
    color: '#2E7D32',
  },
  feedbackErr: {
    color: '#C62828',
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  quantityBox: {
    flex: 1,
    maxWidth: 140,
    height: 48,
    borderRadius: 24,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.45,
  },
  quantityText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    flex: 1.4,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#999',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  addButtonPrice: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkoutFab: {
    position: 'absolute',
    right: 16,
    bottom: 78,
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  checkoutFabText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
  catalogFooter: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catalogStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  catalogStockText: {
    fontSize: 13,
    fontWeight: '700',
  },
  catalogPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: GOLD,
  },
});
