import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TabScreenLayout } from '../../components/layout/TabScreenLayout';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { styles } from './styles';
import { EstatisticasTab, StockDoDiaTab } from './components/CarteiraWidgets';
import { useCards } from './useCards';

export function CardsScreen() {
  const {
    abaAtiva,
    setAbaAtiva,
    stockDia,
    resumo,
    loadingStock,
    loadingStats,
    errorStock,
    errorStats,
    carregarStockDia,
    carregarResumo,
  } = useCards();

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
