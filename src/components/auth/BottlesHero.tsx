import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AUTH_GOLD, AUTH_NAVY } from '../../theme/authTheme';

export function BottlesHero({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.row, compact && styles.compact]}>
      <Ionicons name="wine-outline" size={compact ? 36 : 52} color="#4DA3E8" />
      <Ionicons name="flask-outline" size={compact ? 44 : 64} color={AUTH_GOLD} />
      <Ionicons name="beer-outline" size={compact ? 40 : 56} color="#E23B3B" />
      <Ionicons name="water-outline" size={compact ? 34 : 48} color={AUTH_NAVY} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    height: 90,
  },
  compact: {
    height: 64,
    opacity: 0.35,
  },
});
