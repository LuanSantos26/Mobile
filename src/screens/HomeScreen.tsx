import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const StockItem = ({ name, total }: any) => (
    <View style={styles.stockItemCard}>
      <MaterialCommunityIcons name="bottle-wine-outline" size={35} color="#F8B125" style={styles.stockIcon} />
      <View style={styles.stockTextContainer}>
        <Text style={styles.stockItemName}>{name}</Text>
        <Text style={styles.stockItemTotal}>Total :<Text style={styles.stockItemTotalNumber}>{total}</Text></Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER COM CORREÇÃO DE MARGEM --- */}
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

        {/* BARRA DE PESQUISA */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#F8B125" />
          <TextInput style={styles.searchInput} placeholder="" />
        </View>

        {/* ÚLTIMO STOCK */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <View style={[styles.dot, { backgroundColor: 'red' }]} />
              <Text style={styles.cardTitle}>Ultimo Stock</Text>
            </View>
            <View style={styles.datePillCard}>
              <Text style={styles.dateTextCard}>Quinta-feira</Text>
              <Ionicons name="calendar-outline" size={14} color="#F8B125" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <StockItem name="Produto A" total="80" />
            <StockItem name="Produto B" total="120" />
             <StockItem name="Produto C" total="45" />
          </ScrollView>
        </View>

        {/* STOCK ONLINE */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <View style={[styles.dot, { backgroundColor: '#32CD32' }]} />
              <Text style={styles.cardTitle}>Stock Online</Text>
            </View>
            <View style={styles.datePillCard}>
              <Text style={styles.dateTextCard}>Segunda-feira</Text>
              <Ionicons name="calendar-outline" size={14} color="#F8B125" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Numero do pedido #31231</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>stock id #2211133</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <StockItem name="Produto A" total="33" />
            <StockItem name="Produto B" total="120" />
          </ScrollView>
        </View>

        {/* RESUMO FINANCEIRO */}
        <View style={styles.financialContainer}>
          <View style={[styles.financialBox, { borderLeftColor: 'red' }]}>
            <Text style={styles.financialLabel}>total gasto</Text>
            <Text style={styles.financialValue}>R$ 600,00</Text>
          </View>
          <View style={[styles.financialBox, { borderLeftColor: '#32CD32' }]}>
            <Text style={styles.financialLabel}>total de lucro</Text>
            <Text style={styles.financialValue}>R$ 900,00</Text>
          </View>
        </View>

        {/* GRÁFICO */}
        <View style={styles.chartContainer}>
          <View style={[styles.circleBase, { borderColor: '#66FF66' }]} />
          <View style={[styles.circleBase, styles.circleRed]} />
          <View style={styles.chartTextContainer}>
            <Text style={styles.chartTextGreen}>R$ 900,00 ^</Text>
            <Text style={styles.chartTextRed}>R$ 600,00 v</Text>
          </View>
        </View>

      </ScrollView>

      {/* RODAPÉ */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem}>
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
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cards')}>
          <Ionicons name="card-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 350 },
  scrollContent: { paddingBottom: 120 },
  
  // AQUI FOI APLICADA A CORREÇÃO DE MARGEM DO TOPO
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 15, marginTop: 20, marginBottom: 25, paddingHorizontal: 15, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#F8B125' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  mainCard: { backgroundColor: '#FFF', marginHorizontal: 15, borderRadius: 20, padding: 15, marginBottom: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8B125' },
  datePillCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8B125', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  dateTextCard: { color: '#F8B125', fontSize: 10, fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tag: { borderWidth: 1, borderColor: '#F8B125', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 10, color: '#333' },
  horizontalScroll: { flexDirection: 'row' },
  stockItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 10, marginRight: 10, minWidth: 160 },
  stockIcon: { marginRight: 8 },
  stockTextContainer: { justifyContent: 'center' },
  stockItemName: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  stockItemTotal: { fontSize: 12, color: '#000', fontWeight: 'bold' },
  stockItemTotalNumber: { color: '#F8B125', fontSize: 16 },
  financialContainer: { flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15, marginTop: 10 },
  financialBox: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F8B125', borderLeftWidth: 6, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, alignItems: 'center', marginHorizontal: 10, minWidth: 120 },
  financialLabel: { fontSize: 12, color: '#666' },
  financialValue: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 4 },
  chartContainer: { width: 180, height: 180, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  circleBase: { width: 180, height: 180, borderRadius: 90, borderWidth: 25, position: 'absolute' },
  circleRed: { borderColor: 'transparent', borderTopColor: '#FF6666', transform: [{ rotate: '45deg' }] },
  chartTextContainer: { alignItems: 'center' },
  chartTextGreen: { color: '#66FF66', fontWeight: 'bold', fontSize: 16 },
  chartTextRed: { color: '#FF6666', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15, borderWidth: 2, borderColor: '#F8B125', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 }
});