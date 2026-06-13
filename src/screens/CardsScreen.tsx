import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { useAuth } from '../context/AuthContext';
import { useProdutos } from '../context/ProductsContext';
import { formatarPreco } from '../services/productService';
import { buscarResumoFinanceiro, FinanceiroResumo } from '../services/financeiroService';

type AbaCarteira = 'carteira' | 'estatisticas';

interface MovementItem {
  name: string;
  qty: string;
  price: string;
  type: 'entrada' | 'saida';
  time: string;
}

interface StatCardProps {
  title: string;
  status: string;
  orderId: string;
  stockId: string;
  totalProducts: string;
  totalCost: string;
  movements: MovementItem[];
}

const StatCard = ({
  title,
  status,
  orderId,
  stockId,
  totalProducts,
  totalCost,
  movements,
}: StatCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setExpanded(!expanded)}
      style={styles.statCard}
    >
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#F8B125"
        />
      </View>

      {expanded && (
        <View style={styles.statCardContent}>
          <View style={styles.divider} />
          <View style={styles.cardHeaderRow}>
            <View style={styles.statusTag}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <Text style={styles.stockIdText}>ID do Lote: #{stockId}</Text>
          <Text style={styles.stockIdText}>Número do Pedido: #{orderId}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Produtos</Text>
              <Text style={styles.statValue}>{totalProducts}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Custo Total</Text>
              <Text style={styles.statValue}>{totalCost}</Text>
            </View>
          </View>
          <Text style={styles.historyTitle}>Produtos e Movimentações</Text>
          {movements.map((product, index) => {
            const isEntrada = product.type === 'entrada';
            return (
              <View key={index} style={styles.productRowCard}>
                <View style={styles.productLeftInfo}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={isEntrada ? 'package-variant-closed' : 'package-variant'}
                      size={24}
                      color="#F8B125"
                    />
                  </View>
                  <View>
                    <Text style={styles.productNameText}>{product.name}</Text>
                    <Text style={styles.productTimeText}>Horário: {product.time}</Text>
                  </View>
                </View>
                <View style={styles.productRightInfo}>
                  <Text
                    style={[
                      styles.productQtyText,
                      { color: isEntrada ? '#32CD32' : '#FF6666' },
                    ]}
                  >
                    {isEntrada ? '+' : '-'} {product.qty}
                  </Text>
                  <Text style={styles.productPriceText}>{product.price}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
};

function ResumoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resumoCard}>
      <Text style={styles.resumoLabel}>{label}</Text>
      <Text style={styles.resumoValue}>{value}</Text>
    </View>
  );
}

function BarChart({
  title,
  items,
  valueKey,
  formatValue,
}: {
  title: string;
  items: { label: string; [key: string]: string | number }[];
  valueKey: string;
  formatValue?: (v: number) => string;
}) {
  const valores = items.map((i) => Number(i[valueKey]));
  const max = Math.max(...valores, 1);

  return (
    <View style={styles.chartBlock}>
      <Text style={styles.chartBlockTitle}>{title}</Text>
      <View style={styles.barChartRow}>
        {items.map((item) => {
          const valor = Number(item[valueKey]);
          const altura = Math.max(8, (valor / max) * 100);
          return (
            <View key={item.label} style={styles.barColumn}>
              <View style={[styles.bar, { height: altura }]} />
              <Text style={styles.barLabel}>{item.label}</Text>
              {formatValue ? (
                <Text style={styles.barValue} numberOfLines={1}>
                  {formatValue(valor)}
                </Text>
              ) : (
                <Text style={styles.barValue}>{valor}</Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function iconePagamento(metodo: string): keyof typeof Ionicons.glyphMap {
  if (metodo === 'pix') return 'phone-portrait-outline';
  if (metodo === 'credito' || metodo === 'debito') return 'card-outline';
  return 'cash-outline';
}

function EstatisticasTab({
  resumo,
  loading,
  error,
  onRetry,
}: {
  resumo: FinanceiroResumo | null;
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator color="#F8B125" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!resumo) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>Nenhum dado financeiro disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.statsSection}>
      <View style={styles.resumoGrid}>
        <ResumoCard label="Lucro do mês" value={formatarPreco(resumo.lucroMesAtual)} />
        <ResumoCard label="Lucro total" value={formatarPreco(resumo.lucroTotal)} />
        <ResumoCard
          label="Média pedidos/mês"
          value={String(resumo.mediaPedidosMensais)}
        />
        <ResumoCard
          label="Média lucro/mês"
          value={formatarPreco(resumo.mediaLucroMensal)}
        />
      </View>

      <View style={styles.margemPill}>
        <Text style={styles.margemText}>
          Margem de lucro: {resumo.margemLucroPercentual}%
        </Text>
        <Text style={styles.margemSub}>
          Compras no mês: {formatarPreco(resumo.totalComprasMesAtual)} ·{' '}
          {resumo.totalPedidosMesAtual} pedidos
        </Text>
      </View>

      <BarChart
        title="Lucros mensais"
        items={resumo.lucrosMensais}
        valueKey="lucro"
        formatValue={(v) => formatarPreco(v)}
      />

      <BarChart
        title="Compras mensais (B2B)"
        items={resumo.comprasMensais}
        valueKey="valor"
        formatValue={(v) => formatarPreco(v)}
      />

      <BarChart
        title="Pedidos mensais"
        items={resumo.pedidosMensais}
        valueKey="quantidade"
      />

      <Text style={styles.sectionTitle}>Formas de pagamento</Text>
      {resumo.formasPagamento.map((forma) => (
        <View key={forma.metodo} style={styles.pagamentoRow}>
          <View style={styles.pagamentoLeft}>
            <Ionicons name={iconePagamento(forma.metodo)} size={22} color="#F8B125" />
            <View style={styles.pagamentoInfo}>
              <Text style={styles.pagamentoLabel}>{forma.label}</Text>
              <Text style={styles.pagamentoValor}>{formatarPreco(forma.valor)}</Text>
            </View>
          </View>
          <View style={styles.pagamentoBarBg}>
            <View style={[styles.pagamentoBarFill, { width: `${forma.percentual}%` }]} />
          </View>
          <Text style={styles.pagamentoPct}>{forma.percentual}%</Text>
        </View>
      ))}
    </View>
  );
}

export function CardsScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { produtos, refresh } = useProdutos();
  const empresaId = user?.empresa?.id;

  const [abaAtiva, setAbaAtiva] = useState<AbaCarteira>('carteira');
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState('');

  const carregarResumo = useCallback(async () => {
    if (!empresaId) return;
    setLoadingStats(true);
    try {
      const data = await buscarResumoFinanceiro(empresaId);
      setResumo(data);
      setErrorStats('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar estatísticas.';
      setErrorStats(msg);
    } finally {
      setLoadingStats(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      carregarResumo();
    }, [refresh, carregarResumo]),
  );

  const mockMovements: MovementItem[] = produtos.length
    ? produtos.map((produto, index) => ({
        name: produto.nome,
        qty: `1 ${produto.unidade}`,
        price: formatarPreco(produto.precoVenda),
        type: index % 2 === 0 ? 'entrada' : 'saida',
        time: `${14 + index}:00`,
      }))
    : [{ name: 'Sem produtos cadastrados', qty: '—', price: '—', type: 'entrada', time: '—' }];

  const totalProductsLabel = `${produtos.length} un`;
  const totalCostLabel = formatarPreco(
    produtos.reduce((acc, item) => acc + item.precoVenda, 0),
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader />

        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Carteira</Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, abaAtiva === 'carteira' && styles.tabBtnActive]}
            onPress={() => setAbaAtiva('carteira')}
          >
            <Text style={[styles.tabBtnText, abaAtiva === 'carteira' && styles.tabBtnTextActive]}>
              Carteira
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, abaAtiva === 'estatisticas' && styles.tabBtnActive]}
            onPress={() => setAbaAtiva('estatisticas')}
          >
            <Text style={[styles.tabBtnText, abaAtiva === 'estatisticas' && styles.tabBtnTextActive]}>
              Estatísticas
            </Text>
          </TouchableOpacity>
        </View>

        {abaAtiva === 'carteira' ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Todos os Stock e compras:</Text>
            <StatCard
              title="stock de segunda feira"
              status="Concluído"
              orderId="31231"
              stockId="2211133"
              totalProducts={totalProductsLabel}
              totalCost={totalCostLabel}
              movements={mockMovements}
            />
            <StatCard
              title="Estoque online"
              status="Em andamento"
              orderId="31232"
              stockId="2211134"
              totalProducts={totalProductsLabel}
              totalCost={totalCostLabel}
              movements={mockMovements.slice(0, Math.max(1, Math.min(2, mockMovements.length)))}
            />
            <StatCard
              title="Compras do mês"
              status="Concluído"
              orderId="31235"
              stockId="2211140"
              totalProducts={totalProductsLabel}
              totalCost={totalCostLabel}
              movements={mockMovements}
            />
          </View>
        ) : (
          <EstatisticasTab
            resumo={resumo}
            loading={loadingStats}
            error={errorStats}
            onRetry={carregarResumo}
          />
        )}
      </ScrollView>

      <BottomTabBar activeRoute="Cards" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  scrollContent: { paddingBottom: 120 },
  pageHeader: { alignItems: 'center', marginTop: 12, marginBottom: 8 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  tabRow: {
    flexDirection: 'row', marginHorizontal: 15, marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 25, padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 22, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#FFF' },
  tabBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  tabBtnTextActive: { color: '#F8B125' },
  listSection: { paddingHorizontal: 15 },
  statsSection: { paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  resumoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  resumoCard: {
    width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: '#F8B125',
  },
  resumoLabel: { fontSize: 12, color: '#666', marginBottom: 6 },
  resumoValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  margemPill: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  margemText: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32' },
  margemSub: { fontSize: 12, color: '#666', marginTop: 4 },
  chartBlock: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  chartBlockTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  barChartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 },
  barColumn: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  bar: { width: '70%', backgroundColor: '#F8B125', borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 10, color: '#666', marginTop: 6 },
  barValue: { fontSize: 9, color: '#999', marginTop: 2 },
  pagamentoRow: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  pagamentoLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pagamentoInfo: { marginLeft: 10, flex: 1 },
  pagamentoLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  pagamentoValor: { fontSize: 12, color: '#666', marginTop: 2 },
  pagamentoBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  pagamentoBarFill: { height: '100%', backgroundColor: '#F8B125', borderRadius: 4 },
  pagamentoPct: { fontSize: 12, fontWeight: 'bold', color: '#F8B125', marginTop: 4, textAlign: 'right' },
  centerBox: { alignItems: 'center', paddingVertical: 40 },
  errorText: { color: '#D64545', textAlign: 'center', marginBottom: 8 },
  retryText: { color: '#F8B125', fontWeight: '600' },
  emptyText: { color: '#666' },
  statCard: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 15,
    borderWidth: 1.5, borderColor: '#F8B125', elevation: 3,
  },
  statCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statCardContent: { marginTop: 15 },
  divider: { height: 1, backgroundColor: '#EAEAEA', marginBottom: 15 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },
  statusTag: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#32CD32', marginRight: 6 },
  statusText: { fontSize: 11, color: '#2E7D32', fontWeight: 'bold' },
  stockIdText: { fontSize: 13, color: '#666', marginTop: 2 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 20,
    borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#F8B125', marginTop: 4 },
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  productRowCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FAFAFA', borderRadius: 12, padding: 10, marginBottom: 10,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  productLeftInfo: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
    borderWidth: 1, borderColor: '#F8B125',
  },
  productNameText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  productTimeText: { fontSize: 11, color: '#999', marginTop: 2 },
  productRightInfo: { alignItems: 'flex-end' },
  productQtyText: { fontSize: 13, fontWeight: 'bold' },
  productPriceText: { fontSize: 11, color: '#666', marginTop: 2 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
    backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15,
    borderWidth: 2, borderColor: '#F8B125', elevation: 6,
  },
});
