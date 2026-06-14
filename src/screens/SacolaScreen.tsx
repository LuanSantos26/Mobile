import React, { useCallback, useEffect, useState } from 'react';

import {

  View,

  Text,

  StyleSheet,

  TouchableOpacity,

  ActivityIndicator,

  Modal,

  Pressable,

  Alert,

} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { TabScreenLayout } from '../components/TabScreenLayout';

import { PagePrimaryButton } from '../components/PagePrimaryButton';

import { BottomTabBar, TAB_BAR_HEIGHT, useTabBarScrollPadding } from '../components/BottomTabBar';

import { SacolaItemRow } from '../components/SacolaItemRow';

import { EnderecoFormModal } from '../components/EnderecoFormModal';

import { useAuth } from '../context/AuthContext';

import { TAXA_ENTREGA, usePurchaseCart } from '../context/PurchaseCartContext';

import { formatarPreco } from '../services/productService';

import { criarSolicitacaoCompra, MetodoPagamento, SolicitacaoCompra } from '../services/marketplaceService';

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

import { cartItemKey } from '../services/purchaseCartStorage';



export function SacolaScreen() {

  const navigation = useNavigation<any>();

  const insets = useSafeAreaInsets();
  const scrollBottomPadding = useTabBarScrollPadding();
  const scrollBottomPaddingWithFooter = useTabBarScrollPadding(52);

  const { user } = useAuth();

  const {

    gruposFornecedor,

    itemCount,

    total,

    taxaEntregaTotal,

    updateQuantity,

    removeItem,

    clear,

  } = usePurchaseCart();



  const [editMode, setEditMode] = useState(false);

  const [enderecos, setEnderecos] = useState<EnderecoEntrega[]>([]);

  const [enderecoErro, setEnderecoErro] = useState('');

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

      return () => setEditMode(false);

    }, [carregarEnderecos, carregarFormasPagamento]),

  );



  useEffect(() => {

    if (itemCount === 0) setEditMode(false);

  }, [itemCount]);



  const handleClearAll = () => {

    Alert.alert(

      'Remover todos',

      'Deseja remover todos os itens da sacola?',

      [

        { text: 'Cancelar', style: 'cancel' },

        {

          text: 'Remover todos',

          style: 'destructive',

          onPress: () => {

            clear();

            setEditMode(false);

          },

        },

      ],

    );

  };



  const formatItemCount = (count: number): string => {

    if (count === 0) return '0 itens';

    if (count === 1) return '1 item';

    return `${count} itens`;

  };



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



    if (!user?.empresa?.id || !user.id || gruposFornecedor.length === 0) {

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

    const falhas: string[] = [];
    const pedidosCriados: SolicitacaoCompra[] = [];

    try {

      for (const grupo of gruposFornecedor) {

        try {

          const pedido = await criarSolicitacaoCompra({

            empresaCompradoraId: user.empresa.id,

            empresaFornecedoraId: grupo.fornecedorId,

            usuarioId: user.id,

            metodoPagamento,

            enderecoEntregaId: enderecoSelecionado.id,

            taxaEntrega: TAXA_ENTREGA,

            itens: grupo.itens.map((item) => ({

              produtoId: item.produtoId,

              quantidade: item.quantidade,

            })),

          });

          pedidosCriados.push(pedido);

        } catch {

          falhas.push(grupo.fornecedorNome);

        }

      }



      if (falhas.length === 0 && pedidosCriados.length > 0) {

        clear();

        const primeiro = pedidosCriados[0];

        navigation.navigate('PedidoAcompanhamento', {

          pedidoId: primeiro.id,

          pedidoInicial: primeiro,

          pedidosIds: pedidosCriados.map((p) => p.id),

        });

        return;

      }



      if (falhas.length === gruposFornecedor.length) {

        setError('Não foi possível enviar os pedidos. Tente novamente.');

      } else {

        setError(

          `Falha ao enviar pedido(s) de: ${falhas.join(', ')}. Tente novamente.`,

        );

      }

    } catch (err) {

      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido.');

    } finally {

      setLoading(false);

    }

  };



  const totalComTaxa = total + (itemCount > 0 ? taxaEntregaTotal : 0);

  const sacolaVazia = itemCount === 0;

  const pedidoCount = gruposFornecedor.length;

  const taxaEntregaLabel =

    pedidoCount > 1 ? `Taxa de entrega (${pedidoCount} pedidos)` : 'Taxa de entrega';



  return (

    <>

      <TabScreenLayout

        title="Sacola de compras"

        subtitle={itemCount > 0 ? formatItemCount(itemCount) : undefined}

        scrollContentStyle={{

          paddingBottom: sacolaVazia ? scrollBottomPadding : scrollBottomPaddingWithFooter,

        }}

        footer={

          !sacolaVazia ? (

            <View style={[styles.footer, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom }]}>

              <TouchableOpacity

                style={[styles.submitButton, loading && styles.submitButtonDisabled]}

                onPress={handleSubmit}

                disabled={loading || editMode}

              >

                {loading ? (

                  <ActivityIndicator color="#FFF" />

                ) : (

                  <Text style={styles.submitButtonText}>

                    {pedidoCount > 1 ? 'Finalizar pedidos' : 'Finalizar pedido'} ·{' '}

                    {formatarPreco(totalComTaxa)}

                  </Text>

                )}

              </TouchableOpacity>

            </View>

          ) : undefined

        }

        tabBar={<BottomTabBar activeRoute="Sacola" />}

      >

        {itemCount > 0 ? (

          <PagePrimaryButton

            label={editMode ? 'Concluir edição' : 'Editar sacola'}

            icon={editMode ? 'checkmark-circle-outline' : 'create-outline'}

            onPress={() => setEditMode((prev) => !prev)}

            compact

            light

          />

        ) : null}



        {sacolaVazia ? (

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

        ) : (

          <>

        <View style={styles.sectionHeaderRow}>

          <Text style={styles.sectionTitleHero}>Itens do pedido</Text>

          {editMode && itemCount > 0 ? (

            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>

              <Text style={styles.removeAllText}>Remover todos</Text>

            </TouchableOpacity>

          ) : null}

        </View>



        {gruposFornecedor.map((grupo) => (

          <View key={grupo.fornecedorId} style={styles.grupoCard}>

            <View style={styles.grupoHeader}>

              <View style={styles.grupoNomeWrap}>

                <Ionicons name="storefront-outline" size={16} color="#F8B125" />

                <Text style={styles.grupoNome} numberOfLines={1}>

                  {grupo.fornecedorNome}

                </Text>

              </View>

              <Text style={styles.grupoSubtotal}>{formatarPreco(grupo.subtotal)}</Text>

            </View>

            {grupo.itens.map((item, index) => (

              <SacolaItemRow

                key={cartItemKey(item)}

                item={item}

                editMode={editMode}

                nested

                isLast={index === grupo.itens.length - 1}

                onUpdateQuantity={(qty) =>

                  updateQuantity(item.fornecedorId, item.produtoId, qty)

                }

                onRemove={() => removeItem(item.fornecedorId, item.produtoId)}

              />

            ))}

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

                    size={16}

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

            <Text style={styles.summaryLabel}>{taxaEntregaLabel}</Text>

            <Text style={styles.summaryValue}>{formatarPreco(taxaEntregaTotal)}</Text>

          </View>

          <View style={[styles.summaryRow, styles.summaryTotalRow]}>

            <Text style={styles.summaryTotalLabel}>Total</Text>

            <Text style={styles.summaryTotalValue}>{formatarPreco(totalComTaxa)}</Text>

          </View>

        </View>



        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          </>

        )}

      </TabScreenLayout>



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

    </>

  );

}



const styles = StyleSheet.create({

  sectionHeaderRow: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 4,

    marginBottom: 14,

  },

  sectionTitleHero: {

    fontSize: 17,

    fontWeight: '800',

    color: '#1A1A1A',

    letterSpacing: 0.3,

  },

  sectionTitle: {

    fontSize: 16,

    fontWeight: '700',

    color: '#333',

    marginBottom: 10,

    marginTop: 8,

  },

  removeAllText: {

    fontSize: 13,

    fontWeight: '600',

    color: '#FFD6D6',

    textShadowColor: 'rgba(0,0,0,0.2)',

    textShadowOffset: { width: 0, height: 1 },

    textShadowRadius: 2,

  },

  grupoCard: {

    backgroundColor: '#FFF',

    borderRadius: 16,

    paddingHorizontal: 14,

    paddingTop: 14,

    paddingBottom: 6,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: 'rgba(248,177,37,0.18)',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.06,

    shadowRadius: 8,

    elevation: 2,

  },

  grupoHeader: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 4,

    paddingBottom: 10,

    borderBottomWidth: 1,

    borderBottomColor: '#F5F5F5',

  },

  grupoNomeWrap: {

    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    marginRight: 8,

  },

  grupoNome: {

    flex: 1,

    fontSize: 15,

    fontWeight: '700',

    color: '#1A1A1A',

  },

  grupoSubtotal: {

    fontSize: 13,

    fontWeight: '700',

    color: '#E89510',

  },

  addressCard: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFF',

    borderRadius: 16,

    padding: 14,

    marginBottom: 8,

    borderWidth: 1,

    borderColor: 'rgba(248,177,37,0.18)',

    gap: 10,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 1 },

    shadowOpacity: 0.04,

    shadowRadius: 4,

    elevation: 1,

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

    gap: 6,

    marginBottom: 16,

  },

  paymentChip: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    paddingHorizontal: 8,

    paddingVertical: 6,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: '#F8B125',

    backgroundColor: '#FFF',

  },

  paymentChipSelected: {

    backgroundColor: '#F8B125',

    borderColor: '#F8B125',

  },

  paymentLabel: { fontSize: 11, fontWeight: '600', color: '#F8B125' },

  paymentLabelSelected: { color: '#FFF' },

  summaryCard: {

    backgroundColor: '#FFF',

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,

    borderColor: 'rgba(248,177,37,0.18)',

    marginBottom: 12,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.05,

    shadowRadius: 6,

    elevation: 2,

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

    backgroundColor: '#E89510',

    borderRadius: 14,

    paddingVertical: 14,

    alignItems: 'center',

  },

  submitButtonDisabled: { opacity: 0.7 },

  submitButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },

  emptyState: {

    alignItems: 'center',

    paddingHorizontal: 32,

    paddingTop: 48,

    paddingBottom: 48,

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


