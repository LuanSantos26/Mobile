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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HamburgerButton } from '../components/HamburgerButton';
import HeaderGreeting from '../components/HeaderGreeting';
import { formatarDiaSemana } from '../utils/dateFormat';

//Precisa ligar essa página a página de Apps//

const { width } = Dimensions.get('window');

export function StoreVitrine() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerYellow}>
        <View style={styles.headerTopRow}>
          <HamburgerButton />
          
          <View style={styles.headerContentRow}>
            <HeaderGreeting name="Marcelo" />

            <View style={styles.rightHeader}>
              <TouchableOpacity style={styles.datePill} activeOpacity={0.8}>
                <Text style={styles.dateText}>{formatarDiaSemana()}</Text>
                <Ionicons name="calendar-outline" size={19} color="#F8B125" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.roundIcon} activeOpacity={0.8}>
                <Ionicons name="notifications-outline" size={22} color="#F8B125" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#F8B125" />
          <TextInput 
            placeholder="Procure o produto" 
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#F8B125" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={28} color="#F8B125" />
          </TouchableOpacity>
        </View>

        {/* 3. CARD DA EMPRESA (OVERLAP) */}
        <View style={styles.storeProfileContainer}>
          <View style={styles.storeAvatarBox}>
            {/* Imagem da loja aqui */}
          </View>
          <View style={styles.storeCard}>
            <View style={styles.storeTitleRow}>
              <Text style={styles.storeTitle}>Empresa Fictícia</Text>
              <Ionicons name="chevron-forward" size={20} color="#333" />
            </View>
            
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#F8B125" />
              <Text style={styles.ratingText}>4,7</Text>
              <Text style={styles.reviewsText}>(265 avaliações)</Text>
            </View>

            <Text style={styles.deliveryInfo}>Entrega Padrão - 10-20 min - R$ 7,00</Text>
          </View>
        </View>

        {/* 4. SEÇÃO DE DESTAQUES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          <View style={styles.productGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View key={item} style={styles.productCard}>
                <View style={styles.productImagePlaceholder} />
                <Text style={styles.productPrice}>R$ 7,00</Text>
                <Text style={styles.productName}>Produto {String.fromCharCode(64 + item)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 5. FOOTER SACOLA (FIXO) */}
      <View style={styles.footerCart}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartQty}>1 Produto</Text>
          <Text style={styles.cartTotal}>total R$ 7,00</Text>
        </View>
        <TouchableOpacity style={styles.btnSacola}>
          <Text style={styles.btnSacolaText}>Ver Sacola</Text>
          <Ionicons name="cart-outline" size={20} color="#F8B125" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  headerYellow: {
    backgroundColor: '#F8B125',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  
  // ADICIONADOS: Estilos que estavam faltando no cabeçalho :3
  headerContentRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10 },
  rightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roundIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  
  datePill: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, gap: 5 },
  dateText: { color: '#F8B125', fontSize: 10, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 15, height: 40, borderRadius: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  
  scrollContent: { paddingBottom: 100 },
  navActions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 15 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  
  storeProfileContainer: { alignItems: 'center', marginTop: -20 },
  storeAvatarBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DDD', zIndex: 2, borderWidth: 3, borderColor: '#FFF' },
  storeCard: { backgroundColor: '#FFF', width: '90%', borderRadius: 20, padding: 20, marginTop: -40, paddingTop: 50, elevation: 5 },
  storeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storeTitle: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 5 },
  ratingText: { fontWeight: 'bold', fontSize: 14 },
  reviewsText: { color: '#666', fontSize: 12 },
  deliveryInfo: { color: '#333', fontSize: 13, fontWeight: '500' },

  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '31%', marginBottom: 20 },
  productImagePlaceholder: { width: '100%', aspectRatio: 1, backgroundColor: '#444', borderRadius: 12 },
  productPrice: { color: '#FFF', fontWeight: 'bold', marginTop: 8, fontSize: 12 },
  productName: { color: '#AAA', fontSize: 11, marginTop: 2 },

  footerCart: { 
    position: 'absolute', 
    bottom: 20, 
    alignSelf: 'center', 
    width: '90%', 
    height: 60, 
    backgroundColor: '#FFF', 
    borderRadius: 30, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    elevation: 10
  },
  cartInfo: { flex: 1 },
  cartQty: { fontSize: 12, color: '#333' },
  cartTotal: { fontSize: 14, fontWeight: 'bold', color: '#F8B125' },
  btnSacola: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, gap: 8 },
  btnSacolaText: { color: '#F8B125', fontWeight: 'bold', fontSize: 14 }
});