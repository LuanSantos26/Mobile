import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import { CalendarDatePill } from '../components/CalendarDatePill';
import { BottomTabBar, useTabBarScrollPadding } from '../components/BottomTabBar';
import { ProductStockCard } from '../components/ProductCard';
import { FinancialDonutChart } from '../components/FinancialDonutChart';
import { useAuth } from '../context/AuthContext';
import { useProdutos } from '../context/ProductsContext';
import { formatarPreco } from '../services/productService';
import { buscarResumoFinanceiro, extrairTotaisFinanceiros, FinanceiroResumo } from '../services/financeiroService';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { produtos, loading, refresh } = useProdutos();
  const empresaId = user?.empresa?.id;

  const [resumoFinanceiro, setResumoFinanceiro] = useState<FinanceiroResumo | null>(null);
  const [loadingFinanceiro, setLoadingFinanceiro] = useState(false);

  const carregarFinanceiro = useCallback(async () => {
    if (!empresaId) return;
    setLoadingFinanceiro(true);
    try {
      const data = await buscarResumoFinanceiro(empresaId);
      setResumoFinanceiro(data);
    } catch {
      setResumoFinanceiro(null);
    } finally {
      setLoadingFinanceiro(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      carregarFinanceiro();
    }, [refresh, carregarFinanceiro]),
  );

  const totalCatalogo = produtos.length;
  const valorCatalogo = produtos.reduce((acc, item) => acc + item.precoVenda, 0);

  const { totalCompras, totalVendas, lucroTotal, margemPercentual } = useMemo(
    () => extrairTotaisFinanceiros(resumoFinanceiro),
    [resumoFinanceiro],
  );
  const scrollBottomPadding = useTabBarScrollPadding();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* CABEÇALHO */}
        <ScreenHeader
          showGreeting
          name={user?.nome?.split(' ')[0] ?? 'Usuário'}
        />

        {/* BARRA DE PESQUISA */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#F8B125" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor="#999"
          />
        </View>

        {/* ÚLTIMO ESTOQUE */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <View style={[styles.dot, { backgroundColor: 'red' }]} />
              <Text style={styles.cardTitle}>Último estoque</Text>
            </View>
            <CalendarDatePill compact />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {loading ? (
              <ActivityIndicator color="#F8B125" style={{ marginVertical: 12 }} />
            ) : produtos.length === 0 ? (
              <Text style={styles.emptyProductsText}>Nenhum produto cadastrado.</Text>
            ) : (
              produtos.map((produto) => (
                <ProductStockCard
                  key={produto.id}
                  produto={produto}
                  total="—"
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productName: produto.nome,
                      price: formatarPreco(produto.precoVenda),
                    })
                  }
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* ESTOQUE ONLINE */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <View style={[styles.dot, { backgroundColor: '#32CD32' }]} />
              <Text style={styles.cardTitle}>Estoque Online</Text>
            </View>
            <CalendarDatePill compact />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{totalCatalogo} produtos no catálogo</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Valor ref. {formatarPreco(valorCatalogo)}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {produtos.slice(0, 6).map((produto) => (
              <ProductStockCard
                key={`online-${produto.id}`}
                produto={produto}
                total="—"
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    productName: produto.nome,
                    price: formatarPreco(produto.precoVenda),
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* RESUMO FINANCEIRO */}
        <View style={styles.financialContainer}>
          <View style={[styles.financialBox, { borderLeftColor: '#D64545' }]}>
            <Text style={styles.financialLabel}>Total gasto</Text>
            <Text style={styles.financialValue}>
              {loadingFinanceiro ? '...' : formatarPreco(totalCompras)}
            </Text>
          </View>
          <View style={[styles.financialBox, { borderLeftColor: '#32CD32' }]}>
            <Text style={styles.financialLabel}>Total de lucro</Text>
            <Text style={styles.financialValue}>
              {loadingFinanceiro ? '...' : formatarPreco(lucroTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <FinancialDonutChart
            totalCompras={totalCompras}
            totalVendas={totalVendas}
            lucroTotal={lucroTotal}
            margemPercentual={margemPercentual}
            loading={loadingFinanceiro}
          />
        </View>

      </ScrollView>

      <BottomTabBar activeRoute="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // ESTRUTURA E CONFIGURAÇÕES GERAIS
  // ==========================================
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
  scrollContent: {
  },
  emptyProductsText: {
    color: '#666',
    fontSize: 14,
    paddingVertical: 12,
  },

  // ==========================================
  // CABEÇALHO (HEADER) — ver ScreenHeader
  // ==========================================
  // FILTRO / BARRA DE PESQUISA
  // ==========================================
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    marginHorizontal: 15, 
    marginTop: 20, 
    marginBottom: 20, 
    paddingHorizontal: 12, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#F0E6CC',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },

  // ==========================================
  // CARDS PRINCIPAIS (MAIN CARD)
  // ==========================================
  mainCard: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 15, 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 20, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 10,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  cardTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 8,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#F8B125',
  },
  datePillCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#F8B125', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 15,
  },
  dateTextCard: { 
    color: '#F8B125', 
    fontSize: 10, 
    fontWeight: 'bold',
  },
  tagsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  tag: { 
    borderWidth: 1, 
    borderColor: '#F8B125', 
    borderRadius: 15, 
    paddingHorizontal: 10, 
    paddingVertical: 3,
  },
  tagText: { 
    fontSize: 10, 
    color: '#333',
  },

  // ==========================================
  // ELEMENTOS DE ITENS DO ESTOQUE
  // ==========================================
  horizontalScroll: { 
    flexDirection: 'row',
  },
  stockItemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1.5, 
    borderColor: '#F8B125', 
    borderRadius: 25, 
    padding: 10, 
    marginRight: 10, 
    minWidth: 160,
  },
  stockIcon: { 
    marginRight: 8,
  },
  stockTextContainer: { 
    justifyContent: 'center',
  },
  stockItemName: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#000',
  },
  stockItemTotal: { 
    fontSize: 12, 
    color: '#000', 
    fontWeight: 'bold',
  },
  stockItemTotalNumber: { 
    color: '#F8B125', 
    fontSize: 16,
  },

  // ==========================================
  // SESSÃO FINANCEIRA E GRÁFICOS
  // ==========================================
  financialContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginHorizontal: 15, 
    marginTop: 10,
  },
  financialBox: { 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#F8B125', 
    borderLeftWidth: 6, 
    borderRadius: 10, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    marginHorizontal: 10, 
    minWidth: 120,
  },
  financialLabel: { 
    fontSize: 12, 
    color: '#666',
  },
  financialValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 4,
  },
  chartSection: {
    paddingHorizontal: 15,
  },

  // ==========================================
  // BARRA DE NAVEGAÇÃO INFERIOR (BOTTOM BAR)
  // ==========================================
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 70, 
    backgroundColor: '#F8B125', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
  },
  tabItem: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  floatingButtonContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  floatingButton: { 
    width: 76, 
    height: 76, 
    borderRadius: 38, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: -15, 
    borderWidth: 2, 
    borderColor: '#F8B125', 
    elevation: 6, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5,
  },
});