import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackTitleHeader } from '../components/BackTitleHeader';
import { useAppGoBack } from '../hooks/useAppGoBack';
import { useAuth } from '../context/AuthContext';
import { useProdutos } from '../context/ProductsContext';
import {
  EtapaPedido,
  SolicitacaoCompra,
  buscarSolicitacao,
  calcularProgressoPedido,
  labelMetodoPagamento,
  labelStatusPedido,
  obterPrevisaoEntrega,
} from '../services/marketplaceService';
import { formatarPreco } from '../services/productService';
import { formatarDataCurta } from '../utils/dateFormat';

const POLL_INTERVAL_MS = 5000;

const ETAPAS_PADRAO: EtapaPedido[] = [
  { codigo: 'pedido_efetuado', label: 'Pedido confirmado', ordem: 1, concluida: true, ativa: false },
  { codigo: 'aguardando_liberacao', label: 'Preparando pedido', ordem: 2, concluida: false, ativa: true },
  { codigo: 'em_rota', label: 'Saiu para entrega', ordem: 3, concluida: false, ativa: false },
  { codigo: 'entregue', label: 'Pedido entregue', ordem: 4, concluida: false, ativa: false },
];

function iconeEtapa(codigo: string): keyof typeof Ionicons.glyphMap {
  switch (codigo) {
    case 'pedido_efetuado':
      return 'checkmark-circle';
    case 'aguardando_liberacao':
      return 'restaurant-outline';
    case 'em_rota':
      return 'bicycle-outline';
    case 'entregue':
      return 'home-outline';
    default:
      return 'ellipse-outline';
  }
}

function hintEtapa(codigo: string): string {
  switch (codigo) {
    case 'aguardando_liberacao':
      return 'A distribuidora está separando seus produtos.';
    case 'em_rota':
      return 'O entregador está a caminho do seu endereço.';
    case 'entregue':
      return 'Seu pedido foi entregue com sucesso.';
    default:
      return '';
  }
}

interface TimelineStepProps {
  etapa: EtapaPedido;
  isLast: boolean;
}

function TimelineStep({ etapa, isLast }: TimelineStepProps) {
  const concluida = etapa.concluida;
  const ativa = etapa.ativa;

  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicatorCol}>
        <View
          style={[
            styles.stepCircle,
            concluida && styles.stepCircleDone,
            ativa && styles.stepCircleActive,
          ]}
        >
          {concluida ? (
            <Ionicons name="checkmark" size={18} color="#FFF" />
          ) : (
            <Ionicons
              name={iconeEtapa(etapa.codigo)}
              size={18}
              color={ativa ? '#F8B125' : '#BDBDBD'}
            />
          )}
        </View>
        {!isLast && <View style={[styles.stepLine, concluida && styles.stepLineDone]} />}
      </View>
      <View style={styles.stepContent}>
        <Text
          style={[
            styles.stepLabel,
            concluida && styles.stepLabelDone,
            ativa && styles.stepLabelActive,
          ]}
        >
          {etapa.label}
        </Text>
        {ativa ? <Text style={styles.stepHint}>{hintEtapa(etapa.codigo)}</Text> : null}
      </View>
    </View>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
    </View>
  );
}

export function PedidoAcompanhamentoScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Cart');
  const route = useRoute<any>();
  const { user } = useAuth();
  const { refresh: refreshProdutos } = useProdutos();

  const pedidosIds: number[] = route.params?.pedidosIds ?? [route.params?.pedidoId];
  const [pedidoAtivoId, setPedidoAtivoId] = useState<number>(route.params?.pedidoId);
  const pedidoInicial: SolicitacaoCompra | undefined =
    route.params?.pedidoInicial?.id === pedidoAtivoId ? route.params.pedidoInicial : undefined;

  const [pedido, setPedido] = useState<SolicitacaoCompra | null>(pedidoInicial ?? null);
  const [loading, setLoading] = useState(!pedidoInicial);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const entregueCreditadoRef = useRef(false);

  const carregarPedido = useCallback(async (silencioso = false) => {
    if (!user?.empresa?.id || !pedidoAtivoId) return;

    if (!silencioso) setLoading(true);
    setError('');

    try {
      const dados = await buscarSolicitacao(pedidoAtivoId, user.empresa.id);
      setPedido(dados);
      if (dados.status === 'entregue' && !entregueCreditadoRef.current) {
        entregueCreditadoRef.current = true;
        await refreshProdutos();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedido.');
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, [pedidoAtivoId, refreshProdutos, user?.empresa?.id]);

  useEffect(() => {
    setPedido(null);
    setLoading(true);
    carregarPedido(false);
  }, [carregarPedido, pedidoAtivoId]);

  useEffect(() => {
    if (!pedidoAtivoId || !user?.empresa?.id) return;

    pollRef.current = setInterval(() => {
      carregarPedido(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [carregarPedido, pedidoAtivoId, user?.empresa?.id]);

  const etapas = pedido?.etapas?.length ? pedido.etapas : ETAPAS_PADRAO;
  const statusLabel = pedido?.statusLabel ?? labelStatusPedido(pedido?.status ?? 'aguardando_liberacao');
  const previsaoLabel = pedido ? obterPrevisaoEntrega(pedido) : '';
  const progresso = pedido ? calcularProgressoPedido(pedido) : 0.25;
  const entregue = pedido?.status === 'entregue';

  const tituloHero = useMemo(() => {
    if (!pedido) return 'Acompanhar pedido';
    if (entregue) return 'Pedido entregue!';
    if (pedido.status === 'em_rota') return 'Seu pedido está a caminho';
    return 'Pedido em preparo';
  }, [pedido, entregue]);

  if (loading && !pedido) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#F8B125" />
          <Text style={styles.loadingText}>Carregando acompanhamento...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !pedido) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => carregarPedido()}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!pedido) return null;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <BackTitleHeader title="Acompanhar pedido" onBack={goBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pedidosIds.length > 1 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pedidosTabs}
          >
            {pedidosIds.map((id, index) => {
              const ativo = id === pedidoAtivoId;
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.pedidoTab, ativo && styles.pedidoTabActive]}
                  onPress={() => setPedidoAtivoId(id)}
                >
                  <Text style={[styles.pedidoTabText, ativo && styles.pedidoTabTextActive]}>
                    Pedido {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <MaterialCommunityIcons
              name={entregue ? 'check-decagram' : pedido.status === 'em_rota' ? 'motorbike' : 'clock-outline'}
              size={36}
              color={entregue ? '#2E7D32' : '#F8B125'}
            />
          </View>
          <Text style={styles.heroTitle}>{tituloHero}</Text>
          <Text style={styles.heroStatus}>{statusLabel}</Text>

          {!entregue ? (
            <View style={styles.etaBox}>
              <Ionicons name="time-outline" size={18} color="#E89510" />
              <Text style={styles.etaText}>{previsaoLabel}</Text>
            </View>
          ) : null}

          <ProgressBar progress={progresso} />

          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>Pedido #{pedido.id}</Text>
            <Text style={styles.heroMeta}>{pedido.fornecedorNome}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Andamento</Text>
          {etapas.map((etapa, index) => (
            <TimelineStep key={etapa.codigo} etapa={etapa} isLast={index === etapas.length - 1} />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrega</Text>
          {pedido.enderecoResumo ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="location-outline" size={18} color="#F8B125" />
              </View>
              <View style={styles.infoTextWrap}>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoText}>{pedido.enderecoResumo}</Text>
              </View>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="card-outline" size={18} color="#F8B125" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Pagamento</Text>
              <Text style={styles.infoText}>{labelMetodoPagamento(pedido.metodoPagamento)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="calendar-outline" size={18} color="#F8B125" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Realizado em</Text>
              <Text style={styles.infoText}>{formatarDataCurta(pedido.criadoEm)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Itens ({pedido.itens.length})</Text>
          {pedido.itens.map((item) => (
            <View key={item.produtoId} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNome} numberOfLines={2}>{item.nome}</Text>
                <Text style={styles.itemDetalhe}>
                  {item.quantidade} {item.unidade} × {formatarPreco(item.precoUnitario)}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>{formatarPreco(item.subtotal)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            {pedido.taxaEntrega != null && pedido.taxaEntrega > 0 ? (
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Taxa de entrega</Text>
                <Text style={styles.totalValue}>{formatarPreco(pedido.taxaEntrega)}</Text>
              </View>
            ) : null}
            <View style={styles.totalLine}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>{formatarPreco(pedido.valorTotal)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.homeButtonText}>Continuar comprando</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: '#E53935',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8B125',
    borderRadius: 10,
  },
  retryButtonText: {
    fontWeight: '700',
    color: '#FFF',
  },
  pedidosTabs: {
    gap: 8,
    paddingBottom: 12,
  },
  pedidoTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.3)',
  },
  pedidoTabActive: {
    backgroundColor: '#FFF',
    borderColor: '#F8B125',
  },
  pedidoTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  pedidoTabTextActive: {
    color: '#F8B125',
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  heroStatus: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.25)',
  },
  etaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E89510',
    flex: 1,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F8B125',
    borderRadius: 3,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  heroMeta: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  stepIndicatorCol: {
    width: 36,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  stepCircleActive: {
    backgroundColor: '#FFF8E1',
    borderColor: '#F8B125',
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: '#2E7D32',
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 15,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  stepLabelDone: {
    color: '#333',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#F8B125',
    fontWeight: '700',
  },
  stepHint: {
    marginTop: 4,
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoText: {
    marginTop: 2,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  itemDetalhe: {
    marginTop: 2,
    fontSize: 13,
    color: '#777',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    color: '#666',
  },
  totalLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8B125',
  },
  homeButton: {
    backgroundColor: '#F8B125',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
