import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// --- COMPONENTE: CARTÃO EXPANSÍVEL DE ESTATÍSTICA E HISTÓRICO ---
const StatCard = ({ title, status, orderId, stockId, totalProducts, totalCost, movements }: any) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => setExpanded(!expanded)} 
      style={styles.statCard}
    >
      {/* Cabeçalho do Cartão (Sempre visível) */}
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#F8B125" 
        />
      </View>

      {/* Conteúdo Expandido (Detalhes do Lote e Histórico) */}
      {expanded && (
        <View style={styles.statCardContent}>
          <View style={styles.divider} />
          
          {/* Informações Gerais do Lote */}
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

          {/* Lista de Entradas e Saídas */}
          {movements.map((product: any, index: number) => (
            <View key={index} style={styles.productRowCard}>
              <View style={styles.productLeftInfo}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name={product.type === 'entrada' ? "package-variant-closed" : "package-variant"} 
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
                <Text style={[
                  styles.productQtyText, 
                  { color: product.type === 'entrada' ? '#32CD32' : 'red' }
                ]}>
                  {product.type === 'entrada' ? '+' : '-'} {product.qty}
                </Text>
                <Text style={styles.productPriceText}>{product.price}</Text>
              </View>
            </View>
          ))}

        </View>
      )}
    </TouchableOpacity>
  );
};

// --- TELA PRINCIPAL (ESTATÍSTICAS / CARTÕES) ---
export function CardsScreen() {
  const navigation = useNavigation<any>();

  // Dados fictícios para simular o histórico que você mostrou na imagem
  const mockMovements = [
    { name: 'Heineken Long Neck', qty: '80 un', price: 'R$ 480,00', type: 'entrada', time: '14:32' },
    { name: 'Brahma Duplo Malte', qty: '120 un', price: 'R$ 540,00', type: 'entrada', time: '14:35' },
    { name: 'Skol Lata 350ml', qty: '45 un', price: 'R$ 157,50', type: 'entrada', time: '14:38' },
    { name: 'Coca-Cola 2L', qty: '20 un', price: 'R$ 160,00', type: 'saida', time: '16:00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- CABEÇALHO --- */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={36} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#F8B125" />
            </View>
            <View>
              <Text style={styles.greetingText}>Bom dia.</Text>
              <Text style={styles.userName}>Marcelo</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.datePillHeader}>
              <Text style={styles.dateTextHeader}>Segunda-feira</Text>
              <Ionicons name="calendar-outline" size={16} color="#F8B125" style={{ marginLeft: 4 }} />
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={22} color="#F8B125" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- TÍTULO E GRÁFICO GERAL --- */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Estatística</Text>
        </View>

        {/* GRÁFICO DE ANEL */}
        <View style={styles.donutChartContainer}>
          <View style={[styles.circleBase, { borderColor: '#32CD32' }]} />
          <View style={[styles.circleBase, styles.circleRed]} />
          
          <View style={styles.chartTextContainer}>
            <Text style={styles.chartTextGreen}>R$ 900,00 ^</Text>
            <Text style={styles.chartTextRed}>R$ 600,00 v</Text>
          </View>
        </View>

        {/* --- LISTA DE COMPRAS / ESTOQUES --- */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Todos os Stock e compras:</Text>
          
          <StatCard 
            title="stock de segunda feira" 
            status="Concluído"
            orderId="31231"
            stockId="2211133"
            totalProducts="265 un"
            totalCost="R$ 1.337,50"
            movements={mockMovements}
          />

          <StatCard 
            title="Estoque online" 
            status="Em andamento"
            orderId="31232"
            stockId="2211134"
            totalProducts="150 un"
            totalCost="R$ 800,00"
            movements={mockMovements.slice(0, 2)} // Mostra só as duas primeiras pra dar variação
          />

          <StatCard 
            title="Compras do mês" 
            status="Concluído"
            orderId="31235"
            stockId="2211140"
            totalProducts="500 un"
            totalCost="R$ 3.500,00"
            movements={mockMovements}
          />
        </View>

      </ScrollView>

      {/* --- RODAPÉ --- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={30} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Products')}>
          <Feather name="box" size={30} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('AddItem')}>
            <Ionicons name="add" size={40} color="#F8B125" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={30} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="card" size={30} color="#fff" /> 
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  scrollContent: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 50,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 },
  avatarPlaceholder: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  greetingText: { color: '#fff', fontSize: 14 },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  datePillHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 10 },
  dateTextHeader: { color: '#F8B125', fontSize: 12, fontWeight: 'bold' },
  iconButton: { width: 38, height: 38, backgroundColor: '#fff', borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  
  pageHeader: { alignItems: 'center', marginTop: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },

  donutChartContainer: { width: 180, height: 180, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  circleBase: { width: 180, height: 180, borderRadius: 90, borderWidth: 25, position: 'absolute' },
  circleRed: { borderColor: 'transparent', borderTopColor: '#FF6666', transform: [{ rotate: '45deg' }] },
  chartTextContainer: { alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 50, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  chartTextGreen: { color: '#32CD32', fontWeight: 'bold', fontSize: 14 },
  chartTextRed: { color: '#FF6666', fontWeight: 'bold', fontSize: 14, marginTop: 2 },

  listSection: { paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },

  statCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1.5, borderColor: '#F8B125', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statCardContent: { marginTop: 15 },
  divider: { height: 1, backgroundColor: '#EAEAEA', marginBottom: 15 },
  
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 },
  statusTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#32CD32', marginRight: 6 },
  statusText: { fontSize: 11, color: '#2E7D32', fontWeight: 'bold' },
  stockIdText: { fontSize: 13, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#888' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#F8B125', marginTop: 4 },
  
  historyTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  productRowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAFA', borderRadius: 12, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EAEAEA' },
  productLeftInfo: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#F8B125' },
  productNameText: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  productTimeText: { fontSize: 11, color: '#999', marginTop: 2 },
  productRightInfo: { alignItems: 'flex-end' },
  productQtyText: { fontSize: 13, fontWeight: 'bold' },
  productPriceText: { fontSize: 11, color: '#666', marginTop: 2 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15, elevation: 10 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15, borderWidth: 2, borderColor: '#F8B125', elevation: 6 }
});