import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/Header/ScreenHeader';
import { CalendarDatePill } from '../../components/Header/CalendarDatePill';
import { BottomTabBar } from '../../components/layout/BottomTabBar';
import { ScreenTopGradient } from '../../components/layout/ScreenTopGradient';
import { ProductStockCard } from './components/ProductCard';
import { FinancialDonutChart } from './components/FinancialDonutChart';
import { formatarPreco } from '../../services/productService';
import { styles } from './styles';
import { useHome } from './useHome';

export default function HomeScreen() {
  const {
    navigation,
    user,
    produtos,
    loading,
    resumoFinanceiro,
    loadingFinanceiro,
    totalCatalogo,
    valorCatalogo,
    totalUnidadesEstoque,
    abrirDetalheProduto,
    totalCompras,
    totalVendas,
    lucroTotal,
    margemPercentual,
    quickActions,
    scrollBottomPadding,
  } = useHome();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScreenTopGradient />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
        
        {/* CABEÇALHO */}
        <ScreenHeader
          showGreeting
          greeting="Bem vindo."
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
            <View style={styles.cardTitleBlock}>
              <View style={styles.cardTitleContainer}>
                <View style={[styles.dot, { backgroundColor: '#D64545' }]} />
                <Text style={styles.cardTitle}>Último estoque</Text>
              </View>
              <Text style={styles.cardSubtitle}>Produtos cadastrados na empresa</Text>
            </View>
            <CalendarDatePill compact />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{totalCatalogo} produto(s)</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{totalUnidadesEstoque} un. em estoque</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {loading ? (
              <ActivityIndicator color="#F8B125" style={{ marginVertical: 12 }} />
            ) : produtos.length === 0 ? (
              <Text style={styles.emptyProductsText}>Nenhum produto cadastrado.</Text>
            ) : (
              produtos.map((produto) => (
                <ProductStockCard
                  key={produto.id}
                  produto={produto}
                  onPress={() => abrirDetalheProduto(produto)}
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* ESTOQUE ONLINE */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleBlock}>
              <View style={styles.cardTitleContainer}>
                <View style={[styles.dot, { backgroundColor: '#32CD32' }]} />
                <Text style={styles.cardTitle}>Estoque online</Text>
              </View>
              <Text style={styles.cardSubtitle}>Visão rápida do catálogo ativo</Text>
            </View>
            <CalendarDatePill compact />
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Valor ref. {formatarPreco(valorCatalogo)}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {user?.empresa?.nome ?? 'Sua empresa'}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {produtos.slice(0, 6).map((produto) => (
              <ProductStockCard
                key={`online-${produto.id}`}
                produto={produto}
                onPress={() => abrirDetalheProduto(produto)}
              />
            ))}
          </ScrollView>
        </View>

        {/* RESUMO FINANCEIRO */}
        <View style={styles.mainCard}>
          <View style={styles.financeHeader}>
            <Text style={styles.cardTitle}>Resumo financeiro</Text>
            <Text style={styles.cardSubtitle}>Compras, vendas e lucro da conta</Text>
          </View>
          <View style={styles.financialContainer}>
            <View style={[styles.financialBox, styles.financialBoxSpend]}>
              <Text style={styles.financialLabel}>Total gasto</Text>
              <Text style={[styles.financialValue, { color: '#D64545' }]}>
                {loadingFinanceiro ? '...' : formatarPreco(totalCompras)}
              </Text>
            </View>
            <View style={[styles.financialBox, styles.financialBoxProfit]}>
              <Text style={styles.financialLabel}>Total de lucro</Text>
              <Text style={[styles.financialValue, { color: lucroTotal < 0 ? '#D64545' : '#2E7D32' }]}>
                {loadingFinanceiro ? '...' : formatarPreco(lucroTotal)}
              </Text>
            </View>
          </View>
          <FinancialDonutChart
            totalCompras={totalCompras}
            totalVendas={totalVendas}
            lucroTotal={lucroTotal}
            margemPercentual={margemPercentual}
            loading={loadingFinanceiro}
          />
        </View>

        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsHeader}>
            <Text style={styles.quickActionsTitle}>Operação da empresa</Text>
            <Text style={styles.quickActionsSubtitle}>Atalhos para o dia a dia</Text>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={[styles.quickActionCard, item.wide && styles.quickActionCardWide]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.quickActionIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#F8B125" />
                </View>
                <View style={styles.quickActionCopy}>
                  <Text style={styles.quickActionText}>{item.title}</Text>
                  {item.subtitle ? (
                    <Text style={styles.quickActionHint}>{item.subtitle}</Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D4B56A" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
      </SafeAreaView>

      <BottomTabBar activeRoute="Home" />
    </View>
  );
}
