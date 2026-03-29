import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PRETO = '#1A1A1A';
const CINZA_CLARO = '#9E9E9E';

interface ItemPedidoProps {
  id: string;
  produto: string;
  hora: string;
  status: string;
  cor: string;
  bg: string;
  onPress?: () => void;
}

export default function ItemPedido({
  id,
  produto,
  hora,
  status,
  cor,
  bg,
  onPress,
}: ItemPedidoProps) {
  return (
    <TouchableOpacity style={estilos.pedidoItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[estilos.pedidoIconeBg, { backgroundColor: bg }]}>
        <Feather name="package" size={16} color={cor} />
      </View>

      <View style={estilos.pedidoInfo}>
        <Text style={estilos.pedidoProduto} numberOfLines={1}>
          {produto}
        </Text>
        <Text style={estilos.pedidoHora}>
          {id} · {hora}
        </Text>
      </View>

      <View style={[estilos.statusPill, { backgroundColor: bg }]}>
        <Text style={[estilos.statusTexto, { color: cor }]}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  pedidoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    gap: 12,
  },
  pedidoIconeBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoProduto: {
    fontSize: 13,
    fontWeight: '600',
    color: PRETO,
    marginBottom: 2,
  },
  pedidoHora: {
    fontSize: 11,
    color: CINZA_CLARO,
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
});
