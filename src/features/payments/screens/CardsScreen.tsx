import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { TabScreenLayout } from '../../../components/TabScreenLayout';
import { BottomTabBar } from '../../../components/BottomTabBar';
import { useAuth } from '../../../context/AuthContext';
import { formatarPreco } from '../../../services/productService';
import {
  buscarResumoFinanceiro,
  buscarStockDia,
  extrairTotaisFinanceiros,
  FinanceiroResumo,
  MovimentoStockDia,
  StockDia,
} from '../../../services/financeiroService';

type AbaCarteira = 'stockDia' | 'estatisticas';

function ResumoCard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={[styles.resumoCard, { borderLeftColor: accent }]}>
      <View style={[styles.resumoIconWrap, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon} size={18} color={accent} />
      </View>
      <Text style={styles.resumoLabel}>{label}</Text>
      <Text style={[styles.resumoValue, { color: accent }]}>{value}</Text>
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
  items: Array<{ label: string; [key: string]: any }>;
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

function MovimentoRow({ movimento }: { movimento: MovimentoStockDia }) {
  const isVenda = movimento.tipo === 'venda';

  return (
    <View style={styles.movimentoRow}>
      <View style={[styles.movimentoIcon, isVenda ? styles.movimentoIconVenda : styles.movimentoIconCompra]}>
        <MaterialCommunityIcons
          name={isVenda ? 'cart-arrow-up' : 'cart-arrow-down'}
          size={20}
          color={isVenda ? '#2E7D32' : '#D64545'}
        />
      </View>
      <View style={styles.movimentoInfo}>
        <Text style={styles.movimentoNome} numberOfLines={1}>{movimento.nome}</Text>
        <Text style={styles.movimentoMeta}>
          {isVenda ? 'Venda' : 'Compra'} · {movimento.origem} · {movimento.horario}
        </Text>
      </View>
      <View style={styles.movimentoValores}>
        <Text style={[styles.movimentoQty, { color: isVenda ? '#2E7D32' : '#D64545' }]}>
          {isVenda ? '+' : '-'} {movimento.quantidade}
        </Text>
        <Text style={styles.movimentoValor}>{formatarPreco(movimento.valor)}</Text>
      </View>
    </View>
  );
}

function StockDoDiaTab({
  stock,
  loading,
  error,
  onRetry,
}: {
  stock: StockDia | null;
  loading: boolean;
  error: string;
  onRetry: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator color="#F8B125" size="large" />
        <Text style={styles.loadingHint}>Carregando stock do dia...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Ionicons name="alert-circle-outline" size={40} color="#D64545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!stock) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emptyText}>Nenhum dado disponível para hoje.</Text>
      </View>
    );
  }

  const lucroPositivo = stock.lucro >= 0;

  return (
    <View style={styles.stockSection}>
      <View style={styles.datePill}>
        <Ionicons name="calendar-outline" size={16} color="#F8B125" />
        <Text style={styles.datePillText}>{stock.dataLabel}</Text>
      </View>

      <View style={styles.lucroHero}>
        <Text style={styles.lucroHeroLabel}>Lucro do dia</Text>
        <Text style={[styles.lucroHeroValue, lucroPositivo ? styles.lucroPositivo : styles.lucroNegativo]}>
          {formatarPreco(stock.lucro)}
        </Text>
        <Text style={styles.lucroHeroSub}>
          Margem {stock.margemPercentual}% · {stock.quantidadeVendas} vendas · {stock.quantidadeCompras} compras
        </Text>
      </View>

      <View style={styles.resumoGrid}>
        <ResumoCard
          label="Compras (B2B)"
          value={formatarPreco(stock.totalCompras)}
          accent="#D64545"
          icon="arrow-down-circle-outline"
        />
        <ResumoCard
          label="Vendas"
          value={formatarPreco(stock.totalVendas)}
          accent="#2E7D32"
          icon="arrow-up-circle-outline"
        />
      </View>

      <View style={styles.movimentosCard}>
        <Text style={styles.movimentosTitle}>Movimentações do dia</Text>
        {stock.movimentos.length === 0 ? (
          <View style={styles.movimentosEmpty}>
            <MaterialCommunityIcons name="package-variant" size={40} color="#F8B125" />
            <Text style={styles.movimentosEmptyText}>
              Nenhuma compra ou venda registrada hoje.
            </Text>
          </View>
        ) : (
          stock.movimentos.map((movimento, index) => (
            <MovimentoRow key={`${movimento.tipo}-${movimento.nome}-${index}`} movimento={movimento} />
          ))
        )}
      </View>
    </View>
  );
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

  const totais = extrairTotaisFinanceiros(resumo);
  const idxMesAtual = resumo.comprasMensais.length - 1;
  const compraMesAtual = resumo.comprasMensais[idxMesAtual]?.valor ?? 0;
  const vendaMesAtual = resumo.vendasMensais?.[idxMesAtual]?.valor;
  const lucroMesAtual =
    vendaMesAtual != null
      ? vendaMesAtual - compraMesAtual
      : (() => {
          const m = resumo.lucrosMensais[idxMesAtual];
          if (m && Math.abs((m.gastos ?? 0) - compraMesAtual) < 0.02) return m.lucro;
          return -compraMesAtual;
        })();

  const lucrosChart = resumo.lucrosMensais.map((m, i) => {
    const compra = resumo.comprasMensais[i]?.valor ?? 0;
    const venda = resumo.vendasMensais?.[i]?.valor;
    if (venda != null) {
      return { ...m, lucro: venda - compra };
    }
    if (Math.abs((m.gastos ?? 0) - compra) < 0.02) {
      return m;
    }
    return { ...m, lucro: -compra };
  });

  return (
    <View style={styles.statsSection}>
      <View style={styles.resumoGrid}>
        <ResumoCard
          label="Lucro do mês"
          value={formatarPreco(lucroMesAtual)}
          accent="#2E7D32"
          icon="trending-up-outline"
        />
        <ResumoCard
          label="Lucro total"
          value={formatarPreco(totais.lucroTotal)}
          accent="#F8B125"
          icon="wallet-outline"
        />
        <ResumoCard
          label="Média pedidos/mês"
          value={String(resumo.mediaPedidosMensais)}
          accent="#5DB4CD"
          icon="receipt-outline"
        />
        <ResumoCard
          label="Média lucro/mês"
          value={formatarPreco(resumo.mediaLucroMensal)}
          accent="#E89510"
          icon="stats-chart-outline"
        />
      </View>

      <View style={styles.margemPill}>
        <Text style={styles.margemText}>
          Margem de lucro: {totais.margemPercentual}%
        </Text>
        <Text style={styles.margemSub}>
          Compras no mês: {formatarPreco(compraMesAtual)} ·{' '}
          {resumo.totalPedidosMesAtual} pedidos
        </Text>
      </View>

      <BarChart
        title="Lucros mensais"
        items={lucrosChart}
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

      <Text style={styles.sectionTitleDark}>Formas de pagamento</Text>
      {resumo.formasPagamento.length === 0 ? (
        <Text style={styles.pagamentoEmpty}>Nenhum pagamento PDV registrado no período.</Text>
      ) : (
        resumo.formasPagamento.map((forma) => (
          <View key={forma.metodo} style={styles.pagamentoRow}>
            <View style={styles.pagamentoLeft}>
              <View style={styles.pagamentoIconWrap}>
                <Ionicons name={iconePagamento(forma.metodo)} size={20} color="#F8B125" />
              </View>
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
        ))
      )}
    </View>
  );
}

export function CardsScreen() {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;

  const [abaAtiva, setAbaAtiva] = useState<AbaCarteira>('stockDia');
  const [stockDia, setStockDia] = useState<StockDia | null>(null);
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStock, setErrorStock] = useState('');
  const [errorStats, setErrorStats] = useState('');

  const carregarStockDia = useCallback(async () => {
    if (!empresaId) return;
    setLoadingStock(true);
    try {
      const data = await buscarStockDia(empresaId);
      setStockDia(data);
      setErrorStock('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar stock do dia.';
      setErrorStock(msg);
    } finally {
      setLoadingStock(false);
    }
  }, [empresaId]);

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
      carregarStockDia();
      carregarResumo();
    }, [carregarStockDia, carregarResumo]),
  );

  return (
    <TabScreenLayout
      title="Carteira"
      wrapContent={false}
      scrollContentStyle={styles.scrollContent}
      tabBar={<BottomTabBar activeRoute="Cards" />}
    >
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, abaAtiva === 'stockDia' && styles.tabBtnActive]}
          onPress={() => setAbaAtiva('stockDia')}
        >
          <Text style={[styles.tabBtnText, abaAtiva === 'stockDia' && styles.tabBtnTextActive]}>
            Stock do dia
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

      {abaAtiva === 'stockDia' ? (
        <StockDoDiaTab
          stock={stockDia}
          loading={loadingStock}
          error={errorStock}
          onRetry={carregarStockDia}
        />
      ) : (
        <EstatisticasTab
          resumo={resumo}
          loading={loadingStats}
          error={errorStats}
          onRetry={carregarResumo}
        />
      )}
    </TabScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {},
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  tabBtnTextActive: { color: '#F8B125' },
  stockSection: { paddingHorizontal: 15 },
  statsSection: { paddingHorizontal: 15 },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.25)',
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  lucroHero: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lucroHeroLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  lucroHeroValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  lucroPositivo: { color: '#2E7D32' },
  lucroNegativo: { color: '#D64545' },
  lucroHeroSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitleDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 4,
  },
  resumoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  resumoCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  resumoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoLabel: { fontSize: 11, color: '#666', marginBottom: 4, fontWeight: '500' },
  resumoValue: { fontSize: 15, fontWeight: '800' },
  movimentosCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  movimentosTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
  },
  movimentosEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  movimentosEmptyText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  movimentoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  movimentoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movimentoIconVenda: { backgroundColor: '#E8F5E9' },
  movimentoIconCompra: { backgroundColor: '#FFEBEE' },
  movimentoInfo: { flex: 1 },
  movimentoNome: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  movimentoMeta: { fontSize: 11, color: '#888', marginTop: 2 },
  movimentoValores: { alignItems: 'flex-end' },
  movimentoQty: { fontSize: 12, fontWeight: '700' },
  movimentoValor: { fontSize: 13, fontWeight: '700', color: '#333', marginTop: 2 },
  margemPill: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
  },
  margemText: { fontSize: 14, fontWeight: '700', color: '#2E7D32' },
  margemSub: { fontSize: 12, color: '#666', marginTop: 4 },
  chartBlock: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
  },
  chartBlockTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  barColumn: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  bar: { width: '70%', backgroundColor: '#F8B125', borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 10, color: '#666', marginTop: 6 },
  barValue: { fontSize: 9, color: '#999', marginTop: 2 },
  pagamentoRow: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(248,177,37,0.15)',
  },
  pagamentoLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pagamentoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagamentoInfo: { marginLeft: 10, flex: 1 },
  pagamentoLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  pagamentoValor: { fontSize: 12, color: '#666', marginTop: 2 },
  pagamentoBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  pagamentoBarFill: { height: '100%', backgroundColor: '#F8B125', borderRadius: 4 },
  pagamentoPct: { fontSize: 12, fontWeight: '700', color: '#F8B125', marginTop: 4, textAlign: 'right' },
  pagamentoEmpty: { fontSize: 13, color: '#999', marginBottom: 12 },
  centerBox: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 10 },
  loadingHint: { fontSize: 13, color: '#666' },
  errorText: { color: '#D64545', textAlign: 'center' },
  retryBtn: { marginTop: 4 },
  retryText: { color: '#F8B125', fontWeight: '700' },
  emptyText: { color: '#666', textAlign: 'center' },
});
