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
import { BackTitleHeader } from '../../../components/BackTitleHeader';
import { useAppGoBack } from '../../../hooks/useAppGoBack';
import { useAuth } from '../../../context/AuthContext';
import { useProdutos } from '../../../context/ProductsContext';
import {
  EtapaPedido,
  SolicitacaoCompra,
  buscarSolicitacao,
  calcularProgressoPedido,
  labelMetodoPagamento,
  labelStatusPedido,
  obterPrevisaoEntrega,
} from '../../../services/marketplaceService';
import { formatarPreco } from '../../../services/productService';
import { formatarDataCurta } from '../../../utils/dateFormat';

const GOLD = '#F8B125';
const SUCCESS = '#2E7D32';
const SUCCESS_LIGHT = '#E8F5E9';
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
      return 'receipt-outline';
    case 'aguardando_liberacao':
      return 'cube-outline';
    case 'em_rota':
      return 'bicycle-outline';
    case 'entregue':
      return 'checkmark-done-outline';
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
      return 'Produtos creditados ao seu estoque.';
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
            ativa && !concluida && styles.stepCircleActive,
          ]}
        >
          {concluida ? (
            <Ionicons name="checkmark" size={16} color="#FFF" />
          ) : (
            <Ionicons
              name={iconeEtapa(etapa.codigo)}
              size={16}
              color={ativa ? GOLD : '#BDBDBD'}
            />
          )}
        </View>
        {!isLast ? (
          <View style={[styles.stepLine, concluida && styles.stepLineDone]} />
        ) : null}
      </View>
      <View style={[styles.stepContent, isLast && styles.stepContentLast]}>
        <Text
          style={[
            styles.stepLabel,
            concluida && styles.stepLabelDone,
            ativa && !concluida && styles.stepLabelActive,
          ]}
        >
          {etapa.label}
        </Text>
        {ativa && !concluida ? (
          <Text style={styles.stepHint}>{hintEtapa(etapa.codigo)}</Text>
        ) : null}
      </View>
    </View>
  );
}

function ProgressBar({ progress, concluido }: { progress: number; concluido?: boolean }) {
  const pct = concluido ? 100 : Math.round(progress * 100);
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            concluido && styles.progressFillDone,
            { width: `${pct}%` },
          ]}
        />
      </View>
      <Text style={[styles.progressLabel, concluido && styles.progressLabelDone]}>
        {concluido ? '100% concluído' : `${pct}% do percurso`}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={18} color={GOLD} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoText}>{value}</Text>
      </View>
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
  const previsaoLabel = pedido ? obterPrevisaoEntrega(pedido) : '';
  const progresso = pedido ? calcularProgressoPedido(pedido) : 0.25;
  const entregue = pedido?.status === 'entregue';
  const emRota = pedido?.status === 'em_rota';

  const headerTitle = entregue ? 'Compra realizada' : 'Acompanhar pedido';

  const tituloHero = useMemo(() => {
    if (!pedido) return 'Acompanhar pedido';
    if (entregue) return 'Entrega concluída';
    if (emRota) return 'Pedido a caminho';
    return 'Preparando seu pedido';
  }, [pedido, entregue, emRota]);

  const subtituloHero = useMemo(() => {
    if (!pedido) return '';
    if (entregue) {
      return `Seus produtos de ${pedido.fornecedorNome} já estão no seu estoque.`;
    }
    return labelStatusPedido(pedido.status);
  }, [pedido, entregue]);

  const heroIcon = useMemo<{
    name: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    bg: string;
  }>(() => {
    if (entregue) return { name: 'check-decagram', color: SUCCESS, bg: SUCCESS_LIGHT };
    if (emRota) return { name: 'truck-fast', color: GOLD, bg: '#FFF8E7' };
    return { name: 'timer-outline', color: GOLD, bg: '#FFF8E7' };
  }, [entregue, emRota]);

  if (loading && !pedido) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={GOLD} />
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
      <LinearGradient colors={[GOLD, '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackTitleHeader title={headerTitle} onBack={goBack} />

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

        <View style={[styles.heroCard, entregue && styles.heroCardSuccess]}>
          {entregue ? (
            <LinearGradient
              colors={['#E8F5E9', '#FFFFFF']}
              style={styles.heroAccentStrip}
            />
          ) : (
            <LinearGradient
              colors={['#FFF8E7', '#FFFFFF']}
              style={styles.heroAccentStrip}
            />
          )}

          <View style={[styles.heroIconWrap, { backgroundColor: heroIcon.bg }]}>
            <MaterialCommunityIcons
              name={heroIcon.name}
              size={40}
              color={heroIcon.color}
            />
          </View>

          <Text style={styles.heroTitle}>{tituloHero}</Text>
          <Text style={styles.heroSubtitle}>{subtituloHero}</Text>

          {!entregue && previsaoLabel ? (
            <View style={styles.etaBox}>
              <Ionicons name="timer-outline" size={17} color="#C77800" />
              <Text style={styles.etaText}>{previsaoLabel}</Text>
            </View>
          ) : null}

          <ProgressBar progress={progresso} concluido={entregue} />

          <View style={styles.heroChipsRow}>
            <View style={styles.heroChip}>
              <Ionicons name="receipt-outline" size={13} color="#666" />
              <Text style={styles.heroChipText}>#{pedido.id}</Text>
            </View>
            <View style={[styles.heroChip, styles.heroChipWide]}>
              <Ionicons name="storefront-outline" size={13} color="#666" />
              <Text style={styles.heroChipText} numberOfLines={1}>
                {pedido.fornecedorNome}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="git-commit-outline" size={18} color={GOLD} />
            <Text style={styles.cardTitle}>Andamento</Text>
          </View>
          <View style={styles.timelineWrap}>
            {etapas.map((etapa, index) => (
              <TimelineStep key={etapa.codigo} etapa={etapa} isLast={index === etapas.length - 1} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={18} color={GOLD} />
            <Text style={styles.cardTitle}>Detalhes da entrega</Text>
          </View>
          {pedido.enderecoResumo ? (
            <InfoRow icon="navigate-outline" label="Endereço" value={pedido.enderecoResumo} />
          ) : null}
          <InfoRow
            icon="card-outline"
            label="Pagamento"
            value={labelMetodoPagamento(pedido.metodoPagamento)}
          />
          <InfoRow
            icon="calendar-outline"
            label="Realizado em"
            value={formatarDataCurta(pedido.criadoEm)}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bag-outline" size={18} color={GOLD} />
            <Text style={styles.cardTitle}>Itens ({pedido.itens.length})</Text>
          </View>
          {pedido.itens.map((item, index) => (
            <View
              key={item.produtoId}
              style={[
                styles.itemRow,
                index === pedido.itens.length - 1 && styles.itemRowLast,
              ]}
            >
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>{item.quantidade}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNome} numberOfLines={2}>{item.nome}</Text>
                <Text style={styles.itemDetalhe}>
                  {item.unidade} · {formatarPreco(item.precoUnitario)} un.
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
              <Text style={styles.totalLabelBold}>Total pago</Text>
              <Text style={styles.totalValueBold}>{formatarPreco(pedido.valorTotal)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {entregue ? (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="home-outline" size={18} color={GOLD} />
              <Text style={styles.secondaryButtonText}>Ir para início</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.primaryButton, !entregue && styles.primaryButtonFull]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.primaryButtonText}>Continuar comprando</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
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
    backgroundColor: GOLD,
    borderRadius: 12,
  },
  retryButtonText: {
    fontWeight: '700',
    color: '#FFF',
  },
  pedidosTabs: {
    gap: 8,
    paddingBottom: 14,
  },
  pedidoTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.25)',
  },
  pedidoTabActive: {
    backgroundColor: '#FFF',
    borderColor: GOLD,
  },
  pedidoTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  pedidoTabTextActive: {
    color: GOLD,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    marginBottom: 16,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  heroCardSuccess: {
    borderColor: 'rgba(46,125,50,0.2)',
  },
  heroAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.2)',
    alignSelf: 'stretch',
  },
  etaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C77800',
    flex: 1,
  },
  progressWrap: {
    width: '100%',
    marginTop: 18,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: GOLD,
    borderRadius: 3,
  },
  progressFillDone: {
    backgroundColor: SUCCESS,
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    fontWeight: '600',
  },
  progressLabelDone: {
    color: SUCCESS,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    width: '100%',
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  heroChipWide: {
    flex: 1,
  },
  heroChipText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timelineWrap: {
    paddingLeft: 2,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  stepIndicatorCol: {
    width: 32,
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: SUCCESS,
    borderColor: SUCCESS,
  },
  stepCircleActive: {
    backgroundColor: '#FFF8E1',
    borderColor: GOLD,
  },
  stepLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E8E8E8',
    marginVertical: 3,
    borderRadius: 1,
  },
  stepLineDone: {
    backgroundColor: SUCCESS,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 18,
  },
  stepContentLast: {
    paddingBottom: 0,
  },
  stepLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  stepLabelDone: {
    color: '#333',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: GOLD,
    fontWeight: '700',
  },
  stepHint: {
    marginTop: 3,
    fontSize: 12,
    color: '#888',
    lineHeight: 17,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrap: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    marginTop: 3,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF8E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: GOLD,
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
    fontSize: 12,
    color: '#888',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: '#777',
  },
  totalValue: {
    fontSize: 14,
    color: '#777',
  },
  totalLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValueBold: {
    fontSize: 16,
    fontWeight: '800',
    color: GOLD,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: GOLD,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonFull: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: GOLD,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: GOLD,
  },
});
