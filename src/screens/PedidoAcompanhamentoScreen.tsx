import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { ScreenHeader } from '../components/ScreenHeader';
import {
  EtapaPedido,
  SolicitacaoCompra,
  buscarSolicitacao,
  labelMetodoPagamento,
  labelStatusPedido,
} from '../services/marketplaceService';
import { formatarPreco } from '../services/productService';
import { formatarDataCurta } from '../utils/dateFormat';

const POLL_INTERVAL_MS = 5000;

const ETAPAS_PADRAO: EtapaPedido[] = [
  {
    codigo: 'pedido_efetuado',
    label: 'Pedido efetuado com sucesso',
    ordem: 1,
    concluida: true,
    ativa: false,
  },
  {
    codigo: 'aguardando_liberacao',
    label: 'Aguardando liberação da distribuidora',
    ordem: 2,
    concluida: false,
    ativa: true,
  },
  {
    codigo: 'em_rota',
    label: 'Saindo para rota de entrega',
    ordem: 3,
    concluida: false,
    ativa: false,
  },
];

function iconeEtapa(codigo: string): keyof typeof Ionicons.glyphMap {
  switch (codigo) {
    case 'pedido_efetuado':
      return 'checkmark-circle';
    case 'aguardando_liberacao':
      return 'time-outline';
    case 'em_rota':
      return 'bicycle-outline';
    default:
      return 'ellipse-outline';
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
        {!isLast && (
          <View style={[styles.stepLine, concluida && styles.stepLineDone]} />
        )}
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
        {ativa && (
          <Text style={styles.stepHint}>
            {etapa.codigo === 'aguardando_liberacao'
              ? 'A distribuidora está preparando seu pedido.'
              : 'Seu pedido saiu para entrega.'}
          </Text>
        )}
      </View>
    </View>
  );
}

export function PedidoAcompanhamentoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();

  const pedidoId: number = route.params?.pedidoId;
  const pedidoInicial: SolicitacaoCompra | undefined = route.params?.pedidoInicial;

  const [pedido, setPedido] = useState<SolicitacaoCompra | null>(pedidoInicial ?? null);
  const [loading, setLoading] = useState(!pedidoInicial);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const carregarPedido = useCallback(async (silencioso = false) => {
    if (!user?.empresa?.id || !pedidoId) return;

    if (!silencioso) setLoading(true);
    setError('');

    try {
      const dados = await buscarSolicitacao(pedidoId, user.empresa.id);
      setPedido(dados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedido.');
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, [pedidoId, user?.empresa?.id]);

  useEffect(() => {
    carregarPedido(!!pedidoInicial);
  }, [carregarPedido, pedidoInicial]);

  useEffect(() => {
    if (!pedidoId || !user?.empresa?.id) return;

    pollRef.current = setInterval(() => {
      carregarPedido(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [carregarPedido, pedidoId, user?.empresa?.id]);

  const etapas = pedido?.etapas?.length ? pedido.etapas : ETAPAS_PADRAO;
  const statusLabel = pedido?.statusLabel ?? labelStatusPedido(pedido?.status ?? 'aguardando_liberacao');

  if (loading && !pedido) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#F8B125" />
          <Text style={styles.loadingText}>Carregando pedido...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !pedido) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader />

        <Text style={styles.pageTitle}>Acompanhar pedido</Text>

        <View style={styles.successBanner}>
          <MaterialCommunityIcons name="check-decagram" size={32} color="#2E7D32" />
          <View style={styles.successTextWrap}>
            <Text style={styles.successTitle}>Pedido #{pedido.id} confirmado!</Text>
            <Text style={styles.successSubtitle}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status do pedido</Text>
          {etapas.map((etapa, index) => (
            <TimelineStep
              key={etapa.codigo}
              etapa={etapa}
              isLast={index === etapas.length - 1}
            />
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo</Text>
          <View style={styles.infoRow}>
            <Ionicons name="storefront-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{pedido.fornecedorNome}</Text>
          </View>
          {pedido.enderecoResumo ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{pedido.enderecoResumo}</Text>
            </View>
          ) : null}
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{labelMetodoPagamento(pedido.metodoPagamento)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{formatarDataCurta(pedido.criadoEm)}</Text>
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
              <>
                <View style={styles.totalLine}>
                  <Text style={styles.totalLabel}>Taxa de entrega</Text>
                  <Text style={styles.totalValue}>{formatarPreco(pedido.taxaEntrega)}</Text>
                </View>
              </>
            ) : null}
            <View style={styles.totalLine}>
              <Text style={styles.totalLabelBold}>Total</Text>
              <Text style={styles.totalValueBold}>{formatarPreco(pedido.valorTotal)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.homeButtonText}>Voltar para lojas</Text>
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
    height: 350,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    borderRadius: 8,
  },
  retryButtonText: {
    fontWeight: '600',
    color: '#333',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  successTextWrap: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  successSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#558B2F',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
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
    fontWeight: '600',
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
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
