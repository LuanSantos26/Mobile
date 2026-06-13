import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { usePurchaseCart } from '../context/PurchaseCartContext';
import { RemoteImage } from '../components/RemoteImage';
import { getImageUrl } from '../config/api';
import { formatarPreco } from '../services/productService';
import { formatarDiaSemana } from '../utils/dateFormat';

const GOLD = '#F8B125';

// DESCOBRIR QUE TELA É ESSA DPOIS //

export function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { addItem, itemCount } = usePurchaseCart();

  const productName = route.params?.productName || 'Produto';
  const price = route.params?.price || 'R$ 0,00';
  const fornecedorId = route.params?.fornecedorId as number;
  const fornecedorNome = route.params?.fornecedorNome as string ?? 'Distribuidora';
  const fornecedorDescricao = route.params?.fornecedorDescricao as string | undefined;
  const fornecedorLogoUrl = route.params?.fornecedorLogoUrl as string | undefined;
  const fornecedorTipo = route.params?.fornecedorTipo as string | undefined;
  const descricao = route.params?.descricao as string | undefined;
  const imagemUrl = route.params?.imagemUrl as string | undefined;
  const unidade = route.params?.unidade as string ?? 'UN';
  const precoVenda = Number(route.params?.precoVenda ?? 0);
  const produtoId = route.params?.produtoId as number;

  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const [feedback, setFeedback] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!fornecedorId || !produtoId) {
      setFeedback('Produto ou fornecedor inválido.');
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
      },
      { id: fornecedorId, nome: fornecedorNome },
      quantity,
    );

    setAdding(false);

    if (ok) {
      setFeedback('Produto adicionado ao carrinho!');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          showCartBadge={itemCount > 0}
          cartItemCount={itemCount}
          onCartPress={() => navigation.navigate('Sacola')}
        />

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color={GOLD} />
          <TextInput
            placeholder="Procure o produto"
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.banner}>
          {imagemUrl ? (
            <RemoteImage
              uri={getImageUrl(imagemUrl)}
              style={styles.bannerImage}
              fallbackLabel={productName}
              resizeMode="cover"
            />
          ) : null}
          <TouchableOpacity
            style={styles.backCircle}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartBanner} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={26} color={GOLD} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.miniStoreCard}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <RemoteImage
            uri={getImageUrl(fornecedorLogoUrl)}
            style={styles.miniStoreLogoImage}
            fallbackLabel={fornecedorNome}
            resizeMode="cover"
          />

          <View style={styles.miniStoreInfo}>
            <Text style={styles.miniStoreTitle} numberOfLines={1}>
              {fornecedorNome}
            </Text>

            <Text style={styles.miniDelivery} numberOfLines={2}>
              {fornecedorDescricao || 'Distribuidora parceira de bebidas para revenda.'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.productName}>
            {productName.replace('\n', ' ')}
          </Text>

          <Text style={styles.description}>
            {descricao || 'Produto disponível para solicitação de compra ao fornecedor.'}
          </Text>

          <View style={styles.observationTitleRow}>
            <Ionicons name="information-circle-outline" size={15} color="#222" />
            <Text style={styles.observationTitle}>Alguma observação</Text>
          </View>

          <View style={styles.observationBox}>
            <Ionicons name="search-outline" size={27} color="#111" />

            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder=""
              style={styles.observationInput}
            />
          </View>

          {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <View style={styles.quantityBox}>
          <TouchableOpacity
            style={styles.quantityButton}
            activeOpacity={0.8}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={25} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            activeOpacity={0.8}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={handleAddToCart}
          disabled={adding}
        >
          <Text style={styles.addButtonText}>{adding ? '...' : 'Adicionar'}</Text>
          <Text style={styles.addButtonPrice}>{formatarPreco(precoVenda * quantity)}</Text>
        </TouchableOpacity>
      </View>

      {feedback.includes('adicionado') ? (
        <TouchableOpacity
          style={styles.checkoutFab}
          onPress={() => navigation.navigate('Sacola')}
        >
          <Text style={styles.checkoutFabText}>Ir para checkout</Text>
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
    paddingBottom: 120,
  },

  banner: {
    height: 170,
    backgroundColor: '#D9D9D9',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  backCircle: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heartBanner: {
    position: 'absolute',
    top: 7,
    right: 13,
  },

  miniStoreCard: {
    width: 220,
    minHeight: 39,
    backgroundColor: '#FFF',
    borderWidth: 1.2,
    borderColor: GOLD,
    borderRadius: 20,
    marginTop: -52,
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    overflow: 'visible',
  },

  miniStoreLogo: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#FFCB3C',
    marginLeft: -1,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniStoreLogoImage: {
    width: 39,
    height: 39,
    borderRadius: 20,
    marginLeft: -1,
    marginRight: 6,
  },
  miniStoreLogoInitial: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },

  miniStoreInfo: {
    flex: 1,
    paddingVertical: 4,
  },

  miniStoreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },

  miniRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },

  miniRatingText: {
    fontSize: 8,
    color: '#000',
    marginLeft: 1,
  },

  miniDelivery: {
    fontSize: 8,
    color: '#111',
    marginTop: 1,
  },

  bold: {
    fontWeight: '800',
  },

  content: {
    backgroundColor: '#FFF',
    paddingHorizontal: 13,
    paddingTop: 22,
  },

  productName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000',
  },

  description: {
    fontSize: 10,
    color: '#333',
    marginTop: 12,
  },

  observationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },

  observationTitle: {
    fontSize: 9,
    color: '#333',
    marginLeft: 2,
  },

  observationBox: {
    height: 35,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 2,
  },

  observationInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    paddingVertical: 0,
    marginLeft: 4,
  },

  bottomActions: {
    position: 'absolute',
    left: 17,
    right: 17,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityBox: {
    width: 170,
    height: 39,
    borderRadius: 22,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },

  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
  },

  addButton: {
    width: 170,
    height: 39,
    borderRadius: 22,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },

  addButtonPrice: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  feedbackText: {
    marginTop: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  checkoutFab: {
    position: 'absolute',
    right: 17,
    bottom: 70,
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
});