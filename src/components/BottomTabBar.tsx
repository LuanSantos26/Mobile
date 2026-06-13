import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePurchaseCart } from '../context/PurchaseCartContext';

export type BottomTabRoute = 'Home' | 'Barraquinhas' | 'Cart' | 'Sacola' | 'Cards' | 'FormasPagamento' | 'AddItem';

interface BottomTabBarProps {
  activeRoute?: BottomTabRoute;
}

export function BottomTabBar({ activeRoute }: BottomTabBarProps) {
  const navigation = useNavigation<any>();
  const { itemCount } = usePurchaseCart();

  const iconColor = (route: BottomTabRoute) =>
    activeRoute === route ? '#FFF' : 'rgba(255,255,255,0.85)';

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'Home' && navigation.navigate('Home')}
      >
        <Ionicons name={activeRoute === 'Home' ? 'home' : 'home-outline'} size={24} color={iconColor('Home')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'Barraquinhas' && navigation.navigate('Barraquinhas')}
      >
        <Feather name="box" size={24} color={iconColor('Barraquinhas')} />
      </TouchableOpacity>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddItem')}
        >
          <Ionicons name="add" size={34} color="#F8B125" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'Cart' && navigation.navigate('Cart')}
      >
        <Ionicons name={activeRoute === 'Cart' ? 'cart' : 'cart-outline'} size={24} color={iconColor('Cart')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'Sacola' && navigation.navigate('Sacola')}
      >
        <View>
          <Ionicons
            name={activeRoute === 'Sacola' ? 'bag-handle' : 'bag-handle-outline'}
            size={24}
            color={iconColor('Sacola')}
          />
          {itemCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'FormasPagamento' && navigation.navigate('FormasPagamento')}
      >
        <Ionicons
          name={activeRoute === 'FormasPagamento' ? 'wallet' : 'wallet-outline'}
          size={24}
          color={iconColor('FormasPagamento')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => activeRoute !== 'Cards' && navigation.navigate('Cards')}
      >
        <Ionicons name={activeRoute === 'Cards' ? 'card' : 'card-outline'} size={24} color={iconColor('Cards')} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: '#F8B125',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -12,
    borderWidth: 2,
    borderColor: '#F8B125',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D64545',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
