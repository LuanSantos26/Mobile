import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getImageUrl } from '../config/api';
import { formatarPreco, Produto } from '../services/productService';

interface ProductStockCardProps {
  produto: Produto;
  total?: string;
  onPress?: () => void;
}

export function ProductStockCard({
  produto,
  total = '—',
  onPress,
}: ProductStockCardProps) {
  const content = (
    <View style={styles.stockItemCard}>
      {produto.imagemUrl ? (
        <Image
          source={{ uri: getImageUrl(produto.imagemUrl) }}
          style={styles.productImage}
        />
      ) : (
        <MaterialCommunityIcons
          name="bottle-wine-outline"
          size={35}
          color="#F8B125"
          style={styles.stockIcon}
        />
      )}
      <View style={styles.stockTextContainer}>
        <Text style={styles.stockItemName} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={styles.stockItemPrice}>{formatarPreco(produto.precoVenda)}</Text>
        <Text style={styles.stockItemTotal}>
          Total :<Text style={styles.stockItemTotalNumber}>{total}</Text>
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface ProductHorizontalCardProps {
  produto: Produto;
  subtitle?: string;
  onPress?: () => void;
}

export function ProductHorizontalCard({
  produto,
  subtitle,
  onPress,
}: ProductHorizontalCardProps) {
  return (
    <TouchableOpacity
      style={styles.horizontalCard}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
    >
      {produto.imagemUrl ? (
        <Image
          source={{ uri: getImageUrl(produto.imagemUrl) }}
          style={styles.horizontalImage}
        />
      ) : (
        <View style={styles.horizontalPlaceholder}>
          <MaterialCommunityIcons name="bottle-wine-outline" size={28} color="#F8B125" />
        </View>
      )}
      <View style={styles.horizontalTextContainer}>
        <Text style={styles.horizontalTitle} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={styles.horizontalSubtitle}>
          {subtitle ?? formatarPreco(produto.precoVenda)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  stockItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F8B125',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    minWidth: 180,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 8,
  },
  stockIcon: {
    marginRight: 8,
  },
  stockTextContainer: {
    justifyContent: 'center',
    flexShrink: 1,
  },
  stockItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  stockItemPrice: {
    fontSize: 12,
    color: '#F8B125',
    fontWeight: '600',
  },
  stockItemTotal: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  stockItemTotalNumber: {
    color: '#F8B125',
    fontSize: 14,
  },
  horizontalCard: {
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0E6CC',
  },
  horizontalImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  horizontalPlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFF9EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  horizontalTextContainer: {
    gap: 4,
  },
  horizontalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  horizontalSubtitle: {
    fontSize: 12,
    color: '#F8B125',
    fontWeight: '600',
  },
});
