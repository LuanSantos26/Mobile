import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { RemoteImage } from '../components/RemoteImage';
import { EnderecoFormModal } from '../components/EnderecoFormModal';
import { useAuth } from '../context/AuthContext';
import { usePurchaseCart } from '../context/PurchaseCartContext';
import { formatarPreco } from '../services/productService';
import { criarSolicitacaoCompra, MetodoPagamento } from '../services/marketplaceService';
import {
  FormaPagamentoSalva,
  iconeTipoPagamento,
  listarFormasPagamento,
} from '../services/formaPagamentoService';
import {
  EnderecoEntrega,
  listarEnderecos,
  obterEnderecoSelecionado,
  resolverEnderecoInicial,
  salvarEnderecoSelecionado,
} from '../services/enderecoService';

const TAXA_ENTREGA = 7;

export function SacolaScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    fornecedorId,
    fornecedorNome,
    itens,
    total,
    updateQuantity,
    removeItem,
    clear,
  } = usePurchaseCart();

  const [enderecos, setEnderecos] = useState<EnderecoEntrega[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoEntrega | null>(null);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamentoSalva[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento | null>(null);
  const [loadingEnderecos, setLoadingEnderecos] = useState(false);
  const [loadingFormas, setLoadingFormas] = useState(false);
  const [formasErro, setFormasErro] = useState('');
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalCadastroEndereco, setModalCadastroEndereco] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const carregarEnderecos = useCallback(async () => {
    if (!user?.empresa?.id) return;
    setLoadingEnderecos(true);
    setEnderecoErro('');
    try {
      const lista = await listarEnderecos(user.empresa.id);
      const salvoId = await obterEnderecoSelecionado();
      setEnderecos(lista);
      setEnderecoSelecionado(resolverEnderecoInicial(lista, salvoId));
    } catch (err) {
      setEnderecoErro(err instanceof Error ? err.message : 'Erro ao carregar endereços.');
    } finally {
      setLoadingEnderecos(false);
    }
  }, [user?.empresa?.id]);

  const carregarFormasPagamento = useCallback(async () => {
    if (!user?.empresa?.id) return;
    setLoadingFormas(true);
    setFormasErro('');
    try {
      const lista = await listarFormasPagamento(user.empresa.id);
      setFormasPagamento(lista);
      setMetodoPagamento((atual) => {
        if (atual && lista.some((f) => f.tipo === atual)) return atual;
        const principal = lista.find((f) => f.principal);
        return (principal?.tipo ?? lista[0]?.tipo ?? null) as MetodoPagamento | null;
      });
    } catch (err) {
      setFormasErro(err instanceof Error ? err.message : 'Erro ao carregar formas de pagamento.');
      setFormasPagamento([]);
      setMetodoPagamento(null);
    } finally {
      setLoadingFormas(false);
    }
  }, [user?.empresa?.id]);

  useFocusEffect(
    useCallback(() => {
      carregarEnderecos();
      carregarFormasPagamento();
    }, [carregarEnderecos, carregarFormasPagamento]),
  );

  const selecionarEndereco = async (endereco: EnderecoEntrega) => {
    setEnderecoSelecionado(endereco);
    await salvarEnderecoSelecionado(endereco.id);
    setModalEndereco(false);
  };

  const handleEnderecoSalvo = async (endereco: EnderecoEntrega) => {
    setEnderecos((prev) => {
      const exists = prev.some((e) => e.id === endereco.id);
      if (exists) return prev;
      return [endereco, ...prev];
    });
    setEnderecoSelecionado(endereco);
    await salvarEnderecoSelecionado(endereco.id);
    setEnderecoErro('');
  };

  const abrirSelecaoEndereco = () => {
    if (enderecos.length === 0) {
      setModalCadastroEndereco(true);
    } else {
      setModalEndereco(true);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    if (!user?.empresa?.id || !user.id || !fornecedorId || itens.length === 0) {
      setError('Carrinho inválido. Adicione produtos antes de finalizar.');
      return;
    }
    if (!enderecoSelecionado) {
      setError('Cadastre ou selecione um endereço de entrega.');
      return;
    }
    if (!metodoPagamento) {
      setError('Selecione ou cadastre uma forma de pagamento.');
      return;
    }

    setLoading(true);
    try {
      const pedido = await criarSolicitacaoCompra({
        empresaCompradoraId: user.empresa.id,
        empresaFornecedoraId: fornecedorId,
        usuarioId: user.id,
        metodoPagamento,
        enderecoEntregaId: enderecoSelecionado.id,
        taxaEntrega: TAXA_ENTREGA,
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
      });

      clear();
      navigation.navigate('PedidoAcompanhamento', {
        pedidoId: pedido.id,
        pedidoInicial: pedido,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido.');
    } finally {
      setLoading(false);
    }
  };

  const totalComTaxa = total + (itens.length > 0 ? TAXA_ENTREGA : 0);

  if (!fornecedorId || itens.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ScreenHeader />
          <View style={styles.emptyState}>
          <MaterialCommunityIcons name="shopping-outline" size={72} color="#F8B125" />
          <Text style={styles.emptyTitle}>Sua sacola está vazia</Text>
          <Text style={styles.emptyText}>
            Explore as distribuidoras e adicione bebidas para fazer seu pedido.
          </Text>
          <TouchableOpacity style={styles.explorarButton} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.explorarButtonText}>Explorar lojas</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomTabBar activeRoute="Sacola" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
      >
        <ScreenHeader
          showCartBadge={itens.length > 0}
          cartItemCount={itens.length}
          onCartPress={() => navigation.navigate('Sacola')}
        />

        <Text style={styles.pageTitle}>Sacola</Text>

        <View style={styles.supplierCard}>
          <Text style={styles.supplierLabel}>Fornecedor</Text>
          <Text style={styles.supplierName}>{fornecedorNome}</Text>
        </View>

        <Text style={styles.sectionTitle}>Itens do pedido</Text>
        {itens.map((item) => (
          <View key={item.produtoId} style={styles.itemCard}>
            <RemoteImage
              uri={item.imagemUrl}
              style={styles.itemImage}
              fallbackLabel={item.nome}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.nome}</Text>
              <Text style={styles.itemPrice}>
                {formatarPreco(item.preco)} / {item.unidade}
              </Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.produtoId, item.quantidade - 1)}
              >
                <Ionicons name="remove" size={16} color="#333" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.quantidade}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.produtoId, item.quantidade + 1)}
              >
                <Ionicons name="add" size={16} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.produtoId)}>
              <Ionicons name="trash-outline" size={20} color="#D64545" />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Endereço de entrega</Text>
        <TouchableOpacity
          style={[styles.addressCard, enderecos.length === 0 && !loadingEnderecos && styles.addressCardEmpty]}
          onPress={abrirSelecaoEndereco}
          disabled={loadingEnderecos}
        >
          {loadingEnderecos ? (
            <ActivityIndicator color="#F8B125" />
          ) : enderecoSelecionado ? (
            <>
              <View style={styles.addressIconWrap}>
                <Ionicons name="location-outline" size={22} color="#F8B125" />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressApelido}>{enderecoSelecionado.apelido}</Text>
                <Text style={styles.addressResumo} numberOfLines={2}>{enderecoSelecionado.resumo}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </>
          ) : (
            <>
              <View style={styles.addressIconWrap}>
                <Ionicons name="add-circle-outline" size={24} color="#F8B125" />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressCadastroTitle}>Cadastrar endereço de entrega</Text>
                <Text style={styles.addressCadastroHint}>
                  {enderecoErro || 'Toque para informar onde receber seu pedido'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </>
          )}
        </TouchableOpacity>
        {enderecoErro && enderecos.length === 0 ? (
          <TouchableOpacity onPress={carregarEnderecos}>
            <Text style={styles.retryText}>Tocar para tentar novamente</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.sectionTitle}>Forma de pagamento</Text>
        {loadingFormas ? (
          <ActivityIndicator color="#F8B125" style={{ marginVertical: 12 }} />
        ) : formasPagamento.length === 0 ? (
          <TouchableOpacity
            style={styles.paymentEmptyCard}
            onPress={() => navigation.navigate('FormasPagamento')}
          >
            <Ionicons name="wallet-outline" size={24} color="#F8B125" />
            <View style={styles.paymentEmptyInfo}>
              <Text style={styles.paymentEmptyTitle}>Cadastre uma forma de pagamento</Text>
              <Text style={styles.paymentEmptyHint}>
                {formasErro || 'Toque para adicionar PIX, cartão ou dinheiro'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ) : (
          <View style={styles.paymentRow}>
            {formasPagamento.map((forma) => {
              const selected = metodoPagamento === forma.tipo;
              return (
                <TouchableOpacity
                  key={forma.id}
                  style={[styles.paymentChip, selected && styles.paymentChipSelected]}
                  onPress={() => setMetodoPagamento(forma.tipo as MetodoPagamento)}
                >
                  <Ionicons
                    name={iconeTipoPagamento(forma.tipo)}
                    size={20}
                    color={selected ? '#FFF' : '#F8B125'}
                  />
                  <Text style={[styles.paymentLabel, selected && styles.paymentLabelSelected]}>
                    {forma.apelido}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {formasErro && formasPagamento.length > 0 ? (
          <TouchableOpacity onPress={carregarFormasPagamento}>
            <Text style={styles.retryText}>Tocar para recarregar formas de pagamento</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatarPreco(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de entrega</Text>
            <Text style={styles.summaryValue}>{formatarPreco(TAXA_ENTREGA)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatarPreco(totalComTaxa)}</Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 68 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              Finalizar pedido · {formatarPreco(totalComTaxa)}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <BottomTabBar activeRoute="Sacola" />

      <Modal visible={modalEndereco} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalEndereco(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Escolher endereço</Text>
            {enderecos.map((endereco) => {
              const selected = enderecoSelecionado?.id === endereco.id;
              return (
                <TouchableOpacity
                  key={endereco.id}
                  style={[styles.modalItem, selected && styles.modalItemSelected]}
                  onPress={() => selecionarEndereco(endereco)}
                >
                  <Text style={styles.modalApelido}>{endereco.apelido}</Text>
                  <Text style={styles.modalResumo}>{endereco.resumo}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalEndereco(false)}>
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAddBtn}
              onPress={() => {
                setModalEndereco(false);
                setModalCadastroEndereco(true);
              }}
            >
              <Ionicons name="add" size={18} color="#F8B125" />
              <Text style={styles.modalAddBtnText}>Adicionar novo endereço</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {user?.empresa?.id ? (
        <EnderecoFormModal
          visible={modalCadastroEndereco}
          empresaId={user.empresa.id}
          isFirstAddress={enderecos.length === 0}
          onClose={() => setModalCadastroEndereco(false)}
          onSaved={handleEnderecoSalvo}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 220 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 15 },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 8,
  },
  supplierCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0E6CC',
  },
  supplierLabel: { fontSize: 12, color: '#888' },
  supplierName: { fontSize: 18, fontWeight: 'bold', color: '#F8B125', marginTop: 4 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 8,
  },
  itemImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#F5F5F5' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 12, color: '#666', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyValue: { minWidth: 20, textAlign: 'center', fontWeight: 'bold', fontSize: 13 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 10,
  },
  addressIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: { flex: 1 },
  addressApelido: { fontSize: 14, fontWeight: '700', color: '#333' },
  addressResumo: { fontSize: 12, color: '#666', marginTop: 2 },
  addressCardEmpty: {
    borderColor: '#F8B125',
    borderStyle: 'dashed',
    backgroundColor: '#FFF8E7',
  },
  addressCadastroTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  addressCadastroHint: { fontSize: 12, color: '#666', marginTop: 2 },
  retryText: { color: '#F8B125', fontSize: 12, marginBottom: 8, textAlign: 'center' },
  paymentEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F8B125',
    borderStyle: 'dashed',
    marginBottom: 16,
    gap: 12,
  },
  paymentEmptyInfo: { flex: 1 },
  paymentEmptyTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  paymentEmptyHint: { fontSize: 12, color: '#666', marginTop: 2 },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F8B125',
    backgroundColor: '#FFF',
  },
  paymentChipSelected: {
    backgroundColor: '#F8B125',
    borderColor: '#F8B125',
  },
  paymentLabel: { fontSize: 12, fontWeight: '600', color: '#F8B125' },
  paymentLabelSelected: { color: '#FFF' },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, color: '#333' },
  summaryTotalRow: { marginTop: 4, marginBottom: 0, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#EEE' },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  summaryTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#F8B125' },
  errorText: { color: '#D64545', textAlign: 'center', marginBottom: 8 },
  successText: { color: '#2E7D32', textAlign: 'center', marginBottom: 8 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 15,
    paddingTop: 8,
    backgroundColor: 'rgba(250,250,250,0.95)',
  },
  submitButton: {
    backgroundColor: '#F8B125',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 },
  emptyText: { color: '#666', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  explorarButton: {
    backgroundColor: '#F8B125',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  explorarButtonText: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  modalItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 10,
  },
  modalItemSelected: { borderColor: '#F8B125', backgroundColor: '#FFF8E7' },
  modalApelido: { fontSize: 14, fontWeight: '700', color: '#333' },
  modalResumo: { fontSize: 12, color: '#666', marginTop: 4 },
  modalClose: { marginTop: 8, alignItems: 'center', paddingVertical: 10 },
  modalCloseText: { color: '#888', fontWeight: '600' },
  modalAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F8B125',
    borderRadius: 12,
  },
  modalAddBtnText: { color: '#F8B125', fontWeight: '700' },
});
