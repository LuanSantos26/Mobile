import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const GOLD = '#F8B125';

export function StoreVitrineScreen() {
  const navigation = useNavigation<any>();

  const storeName = 'Empresa Fictícia';
  const [search, setSearch] = useState('');

  const highlights = [
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto B', price: 'R$ 7,00' },
    { name: 'Produto C', price: 'R$ 7,00' },
  ];

  const products = [
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto A', price: 'R$ 7,00' },
    { name: 'Produto A', price: 'R$ 7,00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <LinearGradient
        colors={['#F8B125', '#FFD76A', '#FFFFFF']}
        style={styles.header}
      >
        <TouchableOpacity activeOpacity={0.7} style={styles.menuButton}>
          <Feather name="menu" size={34} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerContentRow}>
          <View style={styles.userRow}>
            <View style={styles.userCircle}>
              <Ionicons name="person" size={24} color={GOLD} />
            </View>

            <View>
              <Text style={styles.goodMorning}>Bom dia.</Text>
              <Text style={styles.userName}>Marcelo</Text>
            </View>
          </View>

          <View style={styles.rightHeader}>
            <TouchableOpacity style={styles.datePill} activeOpacity={0.8}>
              <Text style={styles.dateText}>Segunda-feira</Text>
              <Ionicons name="calendar-outline" size={19} color={GOLD} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.roundIcon} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={22} color={GOLD} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={25} color={GOLD} />

          <TextInput
            placeholder="Procure o produto"
            placeholderTextColor="#222"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.banner}>
          <TouchableOpacity
            style={styles.backCircle}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.heartBanner} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={26} color={GOLD} />
          </TouchableOpacity>
        </View>

        <View style={styles.storeCard}>
          <View style={styles.storeLogo} />

          <TouchableOpacity style={styles.storeRow} activeOpacity={0.8}>
            <Text style={styles.storeTitle} numberOfLines={1}>
              {storeName}
            </Text>

            <Ionicons name="chevron-forward" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.ratingRow} activeOpacity={0.8}>
            <View style={styles.ratingLeft}>
              <Ionicons name="star-outline" size={18} color={GOLD} />

              <Text style={styles.ratingText}>
                <Text style={styles.bold}>4,7</Text> (265 avaliações)
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={28} color="#000" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.delivery}>
            Entrega Padrão - 10-20 min - R$ 7,00
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Destaques</Text>

        <View style={styles.threeColumns}>
          {highlights.map((item, index) => (
            <TouchableOpacity
              key={`highlight-${index}`}
              style={styles.productSmall}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productName: item.name,
                  price: item.price,
                })
              }
            >
              <View style={styles.imageBox} />
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.productsTitle}>Produtos</Text>

        <View style={styles.threeColumns}>
          {products.map((item, index) => (
            <TouchableOpacity
              key={`product-${index}`}
              style={styles.productSmall}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productName: item.name,
                  price: item.price,
                })
              }
            >
              <View style={styles.imageBox} />
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.cartButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.cartText}>Ver Sacola</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  header: {
    height: 185,
    paddingTop: Platform.OS === 'android' ? 24 : 14,
    paddingHorizontal: 10,
  },

  menuButton: {
    marginTop: 8,
    marginLeft: 0,
    alignSelf: 'flex-start',
  },

  headerContentRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  userCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  goodMorning: {
    color: '#FFF',
    fontSize: 11,
    marginLeft: 7,
  },

  userName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 7,
  },

  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  datePill: {
    height: 30,
    borderRadius: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  dateText: {
    color: GOLD,
    fontSize: 13,
    fontWeight: '600',
  },

  roundIcon: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBox: {
    width: '72%',
    height: 42,
    borderRadius: 22,
    backgroundColor: '#FFF',
    borderWidth: 1.2,
    borderColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    marginTop: -6,
    marginRight: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    color: '#111',
    paddingVertical: 0,
  },

  scrollContent: {
    paddingBottom: 95,
  },

  banner: {
    height: 160,
    backgroundColor: '#D9D9D9',
  },

  backCircle: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: GOLD,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heartBanner: {
    position: 'absolute',
    top: 7,
    right: 13,
  },

  storeCard: {
    marginHorizontal: 25,
    marginTop: -45,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1.2,
    borderColor: GOLD,
    paddingHorizontal: 9,
    paddingTop: 37,
    paddingBottom: 12,
  },

  storeLogo: {
    position: 'absolute',
    top: -37,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFCB3C',
  },

  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  storeTitle: {
    flex: 1,
    fontSize: 23,
    fontWeight: '800',
    color: '#000',
  },

  divider: {
    height: 1,
    backgroundColor: GOLD,
    marginVertical: 6,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 3,
  },

  bold: {
    fontWeight: '800',
  },

  delivery: {
    fontSize: 13,
    color: '#111',
  },

  sectionTitle: {
    fontSize: 15,
    color: '#111',
    marginTop: 18,
    marginLeft: 21,
    marginBottom: 10,
  },

  productsTitle: {
    fontSize: 15,
    color: '#111',
    marginTop: 8,
    marginLeft: 21,
    marginBottom: 10,
  },

  threeColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  productSmall: {
    width: '30%',
    marginBottom: 12,
  },

  imageBox: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },

  price: {
    fontSize: 13,
    color: '#000',
    marginTop: 7,
  },

  name: {
    fontSize: 13,
    color: '#000',
    marginTop: 1,
  },

  cartButton: {
    position: 'absolute',
    right: 15,
    bottom: 20,
    backgroundColor: GOLD,
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    zIndex: 20,
  },

  cartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});