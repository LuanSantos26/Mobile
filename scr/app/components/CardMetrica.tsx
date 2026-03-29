import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const PRETO = '#1A1A1A';
const CINZA = '#757575';
const CINZA_CLARO = '#9E9E9E';
const BRANCO = '#FFFFFF';

interface CardMetricaProps {
  lib: 'material' | 'feather';
  icone: string;
  bg: string;
  cor: string;
  titulo: string;
  valor: string;
  badge: string;
  badgeCor: string;
  badgeBg: string;
  sub: string;
  largura: number;
  onPress?: () => void;
}

export default function CardMetrica({
  lib,
  icone,
  bg,
  cor,
  titulo,
  valor,
  badge,
  badgeCor,
  badgeBg,
  sub,
  largura,
  onPress,
}: CardMetricaProps) {
  return (
    <TouchableOpacity
      style={[estilos.card, { width: largura }]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={[estilos.cardIconeBg, { backgroundColor: bg }]}>
        {lib === 'material' ? (
          <MaterialIcons name={icone as any} size={22} color={cor} />
        ) : (
          <Feather name={icone as any} size={22} color={cor} />
        )}
      </View>

      <View style={estilos.cardTopoDir}>
        <View style={[estilos.badgePill, { backgroundColor: badgeBg }]}>
          <Text style={[estilos.badgeTexto, { color: badgeCor }]}>{badge}</Text>
        </View>
      </View>

      <Text style={estilos.cardTitulo}>{titulo}</Text>
      <Text style={estilos.cardValor}>{valor}</Text>
      <Text style={estilos.cardSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: BRANCO,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconeBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTopoDir: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  badgePill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitulo: {
    fontSize: 12,
    color: CINZA,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRETO,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: CINZA_CLARO,
  },
});
