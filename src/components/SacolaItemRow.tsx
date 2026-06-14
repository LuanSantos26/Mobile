import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RemoteImage } from './RemoteImage';
import { CartItem } from '../services/purchaseCartStorage';
import { formatarPreco } from '../services/productService';

interface SacolaItemRowProps {
  item: CartItem;
  editMode: boolean;
  onUpdateQuantity: (quantidade: number) => void;
  onRemove: () => void;
  nested?: boolean;
  isLast?: boolean;
}

export function SacolaItemRow({
  item,
  editMode,
  onUpdateQuantity,
  onRemove,
  nested = false,
  isLast = false,
}: SacolaItemRowProps) {
  return (
    <View style={[styles.card, nested && styles.cardNested, nested && isLast && styles.cardNestedLast]}>
      <View style={styles.mainRow}>
        <RemoteImage
          uri={item.imagemUrl}
          style={styles.image}
          fallbackLabel={item.nome}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.nome}
          </Text>
          <Text style={styles.price}>
            {formatarPreco(item.preco)} / {item.unidade}
          </Text>
          {!editMode ? (
            <Text style={styles.qtyLabel}>Qtd: {item.quantidade}</Text>
          ) : null}
        </View>
        {!editMode ? (
          <Text style={styles.subtotal}>
            {formatarPreco(item.preco * item.quantidade)}
          </Text>
        ) : null}
      </View>

      {editMode ? (
        <View style={styles.actionsRow}>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onUpdateQuantity(item.quantidade - 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color="#333" />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{item.quantidade}</Text>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => onUpdateQuantity(item.quantidade + 1)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.7}
            accessibilityLabel="Remover item"
          >
            <Ionicons name="trash-outline" size={18} color="#D64545" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    gap: 10,
  },
  cardNested: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    marginBottom: 0,
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardNestedLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  qtyLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E89510',
    alignSelf: 'flex-start',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
