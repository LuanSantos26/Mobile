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
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Substitua o código dos Cards na sua CartScreen.tsx por este:

const HorizontalCard = ({ title, subtitle }: { title: string, subtitle: string }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity 
      style={styles.horizontalCard} 
      activeOpacity={0.8}
      // 👇 MANDA PARA A VITRINE COM O NOME DA LOJA
      onPress={() => navigation.navigate('StoreVitrine', { storeName: title })}
    >
      <View style={styles.avatarPlaceholder} />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const StoreCard = ({ title, rating, reviews, deliveryInfo }: any) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity 
      style={styles.storeCard} 
      activeOpacity={0.8}
      // 👇 MANDA PARA A VITRINE COM O NOME DA LOJA
      onPress={() => navigation.navigate('StoreVitrine', { storeName: title })}
    >
      <View style={styles.avatarPlaceholder} />
      <View style={styles.storeTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star-outline" size={14} color="#F8B125" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews} avaliações)</Text>
        </View>
        <Text style={styles.deliveryText}>{deliveryInfo}</Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={24} color="#F8B125" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export function CartScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER COM CORREÇÃO DE MARGEM --- */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon}>
            <Ionicons name="menu" size={36} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTopRow}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatarPlaceholder}>
                <Ionicons name="person" size={20} color="#F8B125" />
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

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#F8B125" />
            <TextInput style={styles.searchInput} placeholder="" />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerScroll} contentContainerStyle={{ paddingHorizontal: 15 }}>
          <View style={[styles.bannerPlaceholder, { backgroundColor: '#FF4B4B' }]}>
            <Text style={styles.bannerText}>VEM PRO CARNAVAL!</Text>
          </View>
          <View style={[styles.bannerPlaceholder, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.bannerText}>PROMOÇÕES</Text>
          </View>
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresas Afiliadas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
            <HorizontalCard title="Tonio Distribuidora de Bebidas" subtitle="Descrição simples" />
            <HorizontalCard title="Empresa Fictícia" subtitle="Descrição simples" />
            <HorizontalCard title="Empresa Fictícia 2" subtitle="Descrição simples" />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ultimas Compras</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalListPadding}>
            <HorizontalCard title="Empresa Fictícia" subtitle="Descrição simples" />
            <HorizontalCard title="Empresa Fictícia" subtitle="Descrição simples" />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lojas</Text>
          <View style={{ paddingHorizontal: 15 }}>
            <StoreCard title="Empresa Fictícia" rating="4,7" reviews="265" deliveryInfo="Entrega Padrão - 10-20 min - R$ 7,00" />
            <StoreCard title="Empresa Fictícia" rating="4,4" reviews="265" deliveryInfo="Entrega Padrão - 10-20 min - R$ 7,00" />
          </View>
        </View>

      </ScrollView>

      {/* RODAPÉ */}
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
        <TouchableOpacity style={styles.tabItem}>
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
  topGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  scrollContent: { paddingBottom: 100 },
  
  // AQUI FOI APLICADA A CORREÇÃO DE MARGEM DO TOPO
  header: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 50,
  },
  menuIcon: { marginBottom: 5 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  greetingText: { color: '#fff', fontSize: 12 },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  datePillHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 10 },
  dateTextHeader: { color: '#F8B125', fontSize: 12, fontWeight: 'bold' },
  iconButton: { width: 34, height: 34, backgroundColor: '#fff', borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginTop: 20, marginBottom: 20, paddingHorizontal: 15, height: 45, borderRadius: 25, borderWidth: 1, borderColor: '#F8B125' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  bannerScroll: { marginBottom: 25 },
  bannerPlaceholder: { width: width * 0.75, height: 140, borderRadius: 20, marginRight: 15, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bannerText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 15, marginBottom: 10 },
  horizontalListPadding: { paddingHorizontal: 15 },
  horizontalCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 10, marginRight: 15, width: 220, height: 75 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F8B125', marginRight: 10 },
  cardTextContainer: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 13, fontWeight: 'bold', color: '#000' },
  cardSubtitle: { fontSize: 11, color: '#666', marginTop: 2 },
  storeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 15, marginBottom: 15 },
  storeTextContainer: { flex: 1, justifyContent: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2, marginBottom: 2 },
  ratingText: { fontSize: 12, fontWeight: 'bold', color: '#000', marginLeft: 4, marginRight: 4 },
  reviewsText: { fontSize: 11, color: '#666' },
  deliveryText: { fontSize: 11, color: '#333' },
  favoriteButton: { padding: 5 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15, borderWidth: 2, borderColor: '#F8B125', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 }
});