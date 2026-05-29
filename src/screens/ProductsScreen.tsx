import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

type ItemProps = { name: string; total: number | string; iconName?: any; };
type StockCardProps = { title: string; date: string; dotColor: string; orderId: string; stockId: string; items: ItemProps[]; };

const CollapsedStockItem = ({ name, total, iconName = 'bottle-wine-outline' }: ItemProps) => (
  <View style={styles.stockItemCardCollapsed}>
    <MaterialCommunityIcons name={iconName} size={35} color="#F8B125" style={styles.stockIcon} />
    <View style={styles.stockTextContainer}>
      <Text style={styles.stockItemName}>{name}</Text>
      <Text style={styles.stockItemTotal}>Total :<Text style={styles.stockItemTotalNumber}>{total}</Text></Text>
    </View>
  </View>
);

const ExpandedStockItem = ({ name, total, iconName = 'bottle-wine-outline' }: ItemProps) => (
  <View style={styles.stockItemCardExpanded}>
    <TouchableOpacity style={styles.actionIconAdd}>
      <Ionicons name="add-circle-outline" size={24} color="#32CD32" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionIconTrash}>
      <Ionicons name="trash-outline" size={20} color="red" />
    </TouchableOpacity>
    <MaterialCommunityIcons name={iconName} size={35} color="#F8B125" style={styles.stockIcon} />
    <View style={styles.stockTextContainer}>
      <Text style={styles.stockItemName}>{name}</Text>
      <Text style={styles.stockItemTotal}>Total :<Text style={styles.stockItemTotalNumber}>{total}</Text></Text>
    </View>
  </View>
);

const StockCard = ({ title, date, dotColor, orderId, stockId, items }: StockCardProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)} style={styles.mainCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.datePillCard}>
          <Text style={styles.dateTextCard}>{date}</Text>
          <Ionicons name="calendar-outline" size={14} color="#F8B125" style={{ marginLeft: 4 }} />
        </View>
      </View>
      {expanded && (
        <View style={styles.tagsContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>Numero do pedido #{orderId}</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>stock id #{stockId}</Text></View>
        </View>
      )}
      {expanded ? (
        <View style={styles.gridContainer}>
          {items.map((item, index) => <ExpandedStockItem key={index} {...item} />)}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {items.map((item, index) => <CollapsedStockItem key={index} {...item} />)}
        </ScrollView>
      )}
    </TouchableOpacity>
  );
};

export function ProductsScreen() {
  const navigation = useNavigation<any>();
  const offlineItems = [
    { name: 'Heineken', total: 80, iconName: 'bottle-wine' },
    { name: 'Brahma', total: 120, iconName: 'bottle-soda-outline' },
    { name: 'Skol', total: 45, iconName: 'bottle-wine-outline' },
  ];
  const onlineItems = [
    { name: 'Heineken', total: 33, iconName: 'bottle-wine' },
    { name: 'Brahma', total: 120, iconName: 'bottle-soda-outline' },
    { name: 'Cabare Ice', total: 67, iconName: 'bottle-wine-outline' },
    { name: 'Gaseificada', total: 22, iconName: 'bottle-soda-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- HEADER COM CORREÇÃO DE MARGEM --- */}
        <View style={styles.header}>
          <TouchableOpacity><Ionicons name="menu" size={36} color="#fff" /></TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder}><Ionicons name="person" size={24} color="#F8B125" /></View>
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
          <TextInput style={styles.searchInput} placeholder="Pesquisar estoque..." />
        </View>

        <StockCard title="Stock feito em 20/09/26" date="Sexta-feira" dotColor="red" orderId="10023" stockId="5544332" items={offlineItems} />
        <StockCard title="Stock carnaval 20/09/26" date="Quinta-feira" dotColor="red" orderId="31231" stockId="2211133" items={offlineItems} />
        <StockCard title="Stock Online" date="Segunda-feira" dotColor="#F8B125" orderId="99882" stockId="7776655" items={onlineItems} />
      </ScrollView>

      {/* RODAPÉ */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
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
  mainCard: { backgroundColor: '#FFF', marginHorizontal: 15, borderRadius: 20, padding: 15, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6, borderWidth: 1.5, borderColor: '#EAEAEA' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8B125' },
  datePillCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F8B125', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  dateTextCard: { color: '#F8B125', fontSize: 10, fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  tag: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 10, color: '#666' },
  horizontalScroll: { flexDirection: 'row' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  stockItemCardCollapsed: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 25, padding: 10, marginRight: 10, minWidth: 160 },
  stockItemCardExpanded: { width: '48%', backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#F8B125', borderRadius: 20, padding: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  stockIcon: { marginRight: 8 },
  stockTextContainer: { justifyContent: 'center', alignItems: 'center' },
  stockItemName: { fontSize: 13, fontWeight: 'bold', color: '#000', textAlign: 'center' },
  stockItemTotal: { fontSize: 11, color: '#000', fontWeight: 'bold' },
  stockItemTotalNumber: { color: '#F8B125', fontSize: 16 },
  actionIconAdd: { position: 'absolute', top: 5, left: 8, zIndex: 2 },
  actionIconTrash: { position: 'absolute', top: 7, right: 8, zIndex: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#F8B125', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButtonContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  floatingButton: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -15, borderWidth: 2, borderColor: '#F8B125', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 }
});