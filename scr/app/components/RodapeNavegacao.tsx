import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTES, ESPACOS } from '../constants/theme';

interface RodapeNavegacaoProps {
  texto: string;
  textoLink: string;
  onPress: () => void;
  desabilitado?: boolean;
  corLink?: string;
}

export default function RodapeNavegacao({
  texto,
  textoLink,
  onPress,
  desabilitado = false,
  corLink = COLORS.amarelo,
}: RodapeNavegacaoProps) {
  return (
    <View style={estilos.rodape}>
      <Text style={estilos.rodapeTexto}>{texto}</Text>
      <TouchableOpacity
        onPress={onPress}
        disabled={desabilitado}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[estilos.rodapeLink, { color: corLink }]}>{textoLink}</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: ESPACOS.lg,
  },
  rodapeTexto: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONTES.md,
  },
  rodapeLink: {
    fontSize: FONTES.md,
    fontWeight: FONTES.bold,
  },
});
