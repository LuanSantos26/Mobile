import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../components/Header/TabScreenLayout';
import { BottomTabBar } from '../../components/Header/BottomTabBar';
import { ProductFormModal } from '../../components/Card/ProductFormModal';
import { RemoteImage } from '../../components/Header/RemoteImage';
import { IconActionButton } from '../../components/Button/IconActionButton';
import { useAuth } from '../../context/AuthContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import { useProdutos } from '../../context/ProductsContext';
import { getImageUrl } from '../../config/api';
import { formatarPreco, formatarQuantidadeEstoque, Produto, removerProduto } from '../../services/productService';

export function ManageProductsScreen() {
  const { user } = useAuth();
  const { produtos, loading, error, refresh } = useProdutos();
  const { confirm } = useConfirmDialog();
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

  return (
    <>
      <TabScreenLayout
        title="Gerenciar produtos"
        subtitle="Cadastre, edite ou remova os produtos exibidos no app."
        wrapContent={false}
        tabBar={<BottomTabBar activeRoute="AddItem" />}
      >
        <TouchableOpacity style={styles.addButton} onPress={abrirNovo} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.addButtonText}>Adicionar produto</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#F8B125" style={styles.loader} />
        ) : error ? (
          <View style={styles.sectionCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : produtos.length === 0 ? (
          <View style={styles.sectionCard}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="cube-outline" size={22} color="#F8B125" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
            <Text style={styles.emptyText}>
              Adicione o primeiro item para exibir no estoque e no catálogo.
            </Text>
            <TouchableOpacity onPress={abrirNovo}>
              <Text style={styles.retryText}>Cadastrar primeiro produto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Catálogo</Text>
              <Text style={styles.sectionSubtitle}>
                {produtos.length} produto(s) cadastrado(s)
              </Text>
            </View>
            {produtos.map((item, index) => (
              <View
                key={item.id}
                style={[styles.productCard, index === produtos.length - 1 && styles.productCardLast]}
              >
                <TouchableOpacity
                  style={styles.productMain}
                  activeOpacity={0.85}
                  onPress={() => abrirEdicao(item)}
                >
                  <View style={styles.thumbnailWrap}>
                    <RemoteImage
                      uri={getImageUrl(item.imagemUrl)}
                      style={styles.thumbnail}
                      fallbackLabel={item.nome}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.nome}
                    </Text>
                    <Text style={styles.productCode}>
                      {item.codigo ? `ID ${item.codigo}` : `#${item.id}`}
                    </Text>
                    <Text style={styles.productPrice}>{formatarPreco(item.precoVenda)}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.stockPill}>
                        <Text style={styles.stockPillText}>
                          {formatarQuantidadeEstoque(item)}
                        </Text>
                      </View>
                      {item.unidade ? (
                        <Text style={styles.productUnit}>{item.unidade}</Text>
                      ) : null}
                    </View>
                    {item.descricao ? (
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {item.descricao}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>

                <View style={styles.productActions}>
                  <IconActionButton
                    name="trash-outline"
                    accessibilityLabel="Remover produto"
                    onPress={() => confirmarRemocao(item)}
                  />
                  <Ionicons name="chevron-forward" size={16} color="#D4B56A" />
                </View>
              </View>
            ))}
          </View>
        )}
      </TabScreenLayout>

      {empresaId ? (
        <ProductFormModal
          visible={modalVisible}
          empresaId={empresaId}
          produto={produtoEmEdicao}
          onClose={() => setModalVisible(false)}
          onSaved={refresh}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8B125',
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 15,
    marginBottom: 16,
    gap: 6,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  loader: {
    marginTop: 24,
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
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  productCardLast: {
    marginBottom: 0,
  },
  productMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
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
    fontWeight: '700',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  stockPill: {
    backgroundColor: '#FFF6DE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  stockPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  productUnit: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
  productActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF6DE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 18,
  },
  errorText: {
    color: '#D64545',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    color: '#F8B125',
    fontWeight: '600',
    textAlign: 'center',
  },
});
