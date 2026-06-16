import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar, useTabBarScrollPadding } from '../components/BottomTabBar';
import { ProductFormModal } from '../components/ProductFormModal';
import { RemoteImage } from '../components/RemoteImage';
import { ScreenTopGradient } from '../components/ScreenTopGradient';
import { IconActionButton } from '../components/IconActionButton';
import { useAuth } from '../context/AuthContext';
import { useConfirmDialog } from '../context/ConfirmDialogContext';
import { useProdutos } from '../context/ProductsContext';
import { getImageUrl } from '../config/api';
import { formatarPreco, formatarQuantidadeEstoque, Produto, removerProduto } from '../services/productService';

export function ManageProductsScreen() {
  const { user } = useAuth();
  const { produtos, loading, error, refresh } = useProdutos();
  const { confirm } = useConfirmDialog();
  const empresaId = user?.empresa?.id;

  const [modalVisible, setModalVisible] = useState(false);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<Produto | null>(null);
  const listBottomPadding = useTabBarScrollPadding();

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
    confirm({
      title: 'Remover produto',
      message: `Deseja remover "${produto.nome}" do catálogo?`,
      confirmText: 'Remover',
      destructive: true,
      onConfirm: async () => {
        await removerProduto(produto.id, empresaId);
        await refresh();
      },
    });
  };

  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        style={styles.productMain}
        activeOpacity={0.85}
        onPress={() => abrirEdicao(item)}
      >
        <RemoteImage
          uri={getImageUrl(item.imagemUrl)}
          style={styles.thumbnail}
          fallbackLabel={item.nome}
          resizeMode="cover"
        />

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.nome}</Text>
          <Text style={styles.productCode}>
            {item.codigo ? `ID ${item.codigo}` : `#${item.id}`}
          </Text>
          <Text style={styles.productPrice}>{formatarPreco(item.precoVenda)}</Text>
          <Text style={styles.productStock}>
            Estoque: {formatarQuantidadeEstoque(item)}
          </Text>
          <Text style={styles.productUnit}>{item.unidade}</Text>
          {item.descricao ? (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.descricao}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <IconActionButton
        name="trash-outline"
        accessibilityLabel="Remover produto"
        onPress={() => confirmarRemocao(item)}
      />
    </View>
  );

  const renderListHeader = () => (
    <>
      <ScreenHeader />
      <Text style={styles.pageTitle}>Gerenciar produtos</Text>
      <Text style={styles.pageSubtitle}>
        Cadastre, edite ou remova os produtos exibidos no app.
      </Text>

      <TouchableOpacity style={styles.addButton} onPress={abrirNovo}>
        <Ionicons name="add-circle-outline" size={22} color="#FFF" />
        <Text style={styles.addButtonText}>Adicionar produto</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScreenTopGradient />

        <View style={styles.content}>
        {loading || error || produtos.length === 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPadding }]}
          >
            {renderListHeader()}
            {loading ? (
              <ActivityIndicator color="#F8B125" style={styles.loader} />
            ) : error ? (
              <View style={styles.emptyState}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={refresh}>
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
                <TouchableOpacity onPress={abrirNovo}>
                  <Text style={styles.retryText}>Cadastrar primeiro produto</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        ) : (
          <FlatList
            data={produtos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ListHeaderComponent={renderListHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: listBottomPadding }]}
          />
        )}
      </View>
      </SafeAreaView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
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
  listContent: {},
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
  productMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
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
  productCode: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#F8B125',
    fontWeight: '600',
    marginTop: 2,
  },
  productStock: {
    fontSize: 12,
    color: '#2E7D32',
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
