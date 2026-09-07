import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ScreenTopGradient } from '../../../components/ScreenTopGradient';
import { BackTitleHeader } from '../../../components/BackTitleHeader';
import { useAppGoBack } from '../../../hooks/useAppGoBack';

export function EmpresaVendasScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Home');

  // Estado para armazenar vendas
  const [vendasRecentes, setVendasRecentes] = useState([
    { id: '1007', cliente: 'Ateliê Jardim', valor: 'R$ 2.680,00', status: 'Entregue', hora: '08:30' },
  ]);

  // Estado para métricas
  const [metricas, setMetricas] = useState({
    hoje: { valor: 'R$ 18.450', delta: '+12,4% vs. ontem' },
    mes: { valor: 'R$ 172.380', delta: '+8,1% no mês' },
    pedidos: { valor: '258', delta: '34 em andamento' },
  });

  // Exemplo de atualização simulada (poderia ser chamada de API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMetricas({
        hoje: { valor: 'R$ 20.000', delta: '+15% vs. ontem' },
        mes: { valor: 'R$ 180.000', delta: '+9% no mês' },
        pedidos: { valor: '270', delta: '40 em andamento' },
      });

      setVendasRecentes(prev => [
        ...prev,
        { id: '1008', cliente: 'Loja Nova', valor: 'R$ 1.200,00', status: 'Em rota', hora: '10:15' },
      ]);
    }, 5000); // atualiza após 5 segundos

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenTopGradient />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <BackTitleHeader
          title="Vendas da empresa"
          onBack={goBack}
          rightSlot={
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('')}>
              <Text style={styles.headerButtonText}>Gráficos</Text>
            </TouchableOpacity>
          }
        />
        {/* Métricas */}
        <View style={styles.summaryGrid}>
          <View style={[styles.metricCard, styles.positiveCard]}>
            <Text style={styles.metricLabel}>Hoje</Text>
            <Text style={styles.metricValue}>{metricas.hoje.valor}</Text>
            <Text style={styles.metricDelta}>{metricas.hoje.delta}</Text>
          </View>
          <View style={[styles.metricCard, styles.primaryCard]}>
            <Text style={styles.metricLabel}>Mês</Text>
            <Text style={styles.metricValue}>{metricas.mes.valor}</Text>
            <Text style={styles.metricDelta}>{metricas.mes.delta}</Text>
          </View>
          <View style={[styles.metricCard, styles.warningCard]}>
            <Text style={styles.metricLabel}>Pedidos</Text>
            <Text style={styles.metricValue}>{metricas.pedidos.valor}</Text>
            <Text style={styles.metricDelta}>{metricas.pedidos.delta}</Text>
          </View>
        </View>

        {/* Últimas vendas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Últimas vendas</Text>
          {vendasRecentes.map((venda) => (
            <View key={venda.id} style={styles.saleRow}>
              <View>
                <Text style={styles.saleClient}>{venda.cliente}</Text>
                <Text style={styles.saleMeta}>Pedido {venda.id} • {venda.hora}</Text>
              </View>
              <View style={styles.saleRight}>
                <Text style={styles.saleValue}>{venda.valor}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{venda.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F8B125',
  },
  headerButtonText: {
    color: '#F8B125',
    fontWeight: '700',
    fontSize: 12,
  },
  summaryGrid: {
    marginTop: 8,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  positiveCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#2DBE6A',
  },
  primaryCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#F8B125',
  },
  warningCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#FF7D4D',
  },
  metricLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 6,
  },
  metricValue: {
    color: '#222',
    fontWeight: '800',
    fontSize: 24,
  },
  metricDelta: {
    marginTop: 6,
    color: '#555',
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiItem: {
    flex: 1,
    backgroundColor: '#FFF9EC',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3CF82',
  },
  kpiNumber: {
    fontSize: 20,
    color: '#F8B125',
    fontWeight: '800',
  },
  kpiLabel: {
    marginTop: 4,
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  saleClient: {
    color: '#222',
    fontWeight: '700',
    fontSize: 15,
  },
  saleMeta: {
    marginTop: 4,
    color: '#666',
    fontSize: 11,
  },
  saleRight: {
    alignItems: 'flex-end',
  },
  saleValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '800',
  },
  statusPill: {
    marginTop: 6,
    backgroundColor: '#FFF4D6',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F5CB72',
  },
  statusText: {
    color: '#A66B00',
    fontSize: 10,
    fontWeight: '700',
  },
});
