import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { ProductFormModal } from '../components/ProductFormModal';
import { useAuth } from '../context/AuthContext';
import { useProdutos } from '../context/ProductsContext';
import { getImageUrl } from '../config/api';
import { formatarPreco, Produto, removerProduto } from '../services/productService';

export function ManageProductsScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { produtos, loading, error, refresh } = useProdutos();
  const empresaId = user?.empresa?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const abrirNovo = () => {
    setProdutoEmEdicao(null);
    setModalVisible(true);
  };

  const abrirEdicao = (produto: Produto) => {
    setProdutoEmEdicao(produto);
    setModalVisible(true);
  };

  const confirmarRemocao = (produto: Produto) => {
    Alert.alert(
      'Remover produto',
      `Deseja remover "${produto.nome}" do catálogo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerProduto(produto.id);
              await refresh();
            } catch (err) {
              const message =
                err instanceof Error ? err.message : 'Erro ao remover produto.';
              Alert.alert('Erro', message);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => abrirEdicao(item)}>
      {item.imagemUrl ? (
        <Image source={{ uri: getImageUrl(item.imagemUrl) }} style={styles.thumbnail} />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Feather name="box" size={24} color="#F8B125" />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nome}</Text>
        <Text style={styles.productPrice}>{formatarPreco(item.precoVenda)}</Text>
        <Text style={styles.productUnit}>{item.unidade}</Text>
        {item.descricao ? (
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmarRemocao(item)}
      >
        <Ionicons name="trash-outline" size={20} color="#D64545" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScreenHeader />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Gerenciar produtos</Text>
        <Text style={styles.pageSubtitle}>
          Cadastre, edite ou remova os produtos exibidos no app.
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={abrirNovo}>
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar produto</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#F8B125" style={styles.loader} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : produtos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
            <TouchableOpacity onPress={abrirNovo}>
              <Text style={styles.retryText}>Cadastrar primeiro produto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={produtos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <BottomTabBar activeRoute="AddItem" />

      {empresaId ? (
        <ProductFormModal
          visible={modalVisible}
          empresaId={empresaId}
          produto={produtoEmEdicao}
          onClose={() => setModalVisible(false)}
          onSaved={refresh}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8B125',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loader: { marginTop: 40 },
  listContent: { paddingBottom: 120 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E6CC',
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#FFF9EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#F8B125',
    fontWeight: '600',
    marginTop: 2,
  },
  productUnit: {
    fontSize: 12,
    color: '#888',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: '#D64545',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    color: '#F8B125',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#F8B125',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    borderWidth: 2,
    borderColor: '#F8B125',
    elevation: 6,
  },
});
