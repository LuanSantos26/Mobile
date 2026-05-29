import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const GOLD = '#F8B125';

export function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const productName = route.params?.productName || 'Produto A';
  const price = route.params?.price || 'R$ 7,00';

  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');

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

        <TouchableOpacity
          style={styles.miniStoreCard}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.miniStoreLogo} />

          <View style={styles.miniStoreInfo}>
            <Text style={styles.miniStoreTitle} numberOfLines={1}>
              Empresa Fictícia
            </Text>

            <View style={styles.miniRatingRow}>
              <Ionicons name="star-outline" size={10} color={GOLD} />

              <Text style={styles.miniRatingText}>
                <Text style={styles.bold}>4,7</Text> (265 avaliações)
              </Text>
            </View>

            <Text style={styles.miniDelivery} numberOfLines={1}>
              Entrega Padrão - 10-20 min - R$ 7,00
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.productName}>
            {productName.replace('\n', ' ')}
          </Text>

          <Text style={styles.description}>Descrição do produto</Text>

          <View style={styles.observationTitleRow}>
            <Ionicons name="information-circle-outline" size={15} color="#222" />
            <Text style={styles.observationTitle}>Alguma observação</Text>
          </View>

          <View style={styles.observationBox}>
            <Ionicons name="search-outline" size={27} color="#111" />

            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder=""
              style={styles.observationInput}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <View style={styles.quantityBox}>
          <TouchableOpacity
            style={styles.quantityButton}
            activeOpacity={0.8}
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={25} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            activeOpacity={0.8}
            onPress={() => setQuantity(q => q + 1)}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
          <Text style={styles.addButtonPrice}>{price}</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },

  banner: {
    height: 170,
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

  miniStoreCard: {
    width: 220,
    minHeight: 39,
    backgroundColor: '#FFF',
    borderWidth: 1.2,
    borderColor: GOLD,
    borderRadius: 20,
    marginTop: -52,
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    overflow: 'visible',
  },

  miniStoreLogo: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: '#FFCB3C',
    marginLeft: -1,
    marginRight: 6,
  },

  miniStoreInfo: {
    flex: 1,
    paddingVertical: 4,
  },

  miniStoreTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },

  miniRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },

  miniRatingText: {
    fontSize: 8,
    color: '#000',
    marginLeft: 1,
  },

  miniDelivery: {
    fontSize: 8,
    color: '#111',
    marginTop: 1,
  },

  bold: {
    fontWeight: '800',
  },

  content: {
    backgroundColor: '#FFF',
    paddingHorizontal: 13,
    paddingTop: 22,
  },

  productName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#000',
  },

  description: {
    fontSize: 10,
    color: '#333',
    marginTop: 12,
  },

  observationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },

  observationTitle: {
    fontSize: 9,
    color: '#333',
    marginLeft: 2,
  },

  observationBox: {
    height: 35,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 2,
  },

  observationInput: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    paddingVertical: 0,
    marginLeft: 4,
  },

  bottomActions: {
    position: 'absolute',
    left: 17,
    right: 17,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quantityBox: {
    width: 170,
    height: 39,
    borderRadius: 22,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
  },

  quantityButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
  },

  addButton: {
    width: 170,
    height: 39,
    borderRadius: 22,
    backgroundColor: GOLD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },

  addButtonPrice: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
});