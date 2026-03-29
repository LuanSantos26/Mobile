import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTES, BORDAS, SOMBRAS, ESPACOS } from '../constants/theme';

interface BotaoPrincipalProps {
  texto: string;
  icone: React.ComponentProps<typeof Feather>['name'];
  onPress: () => void;
  carregando?: boolean;
  desabilitado?: boolean;
  cor?: string;
}

export default function BotaoPrincipal({
  texto,
  icone,
  onPress,
  carregando = false,
  desabilitado = false,
  cor = COLORS.azul,
}: BotaoPrincipalProps) {
  return (
    <TouchableOpacity
      style={[estilos.botao, { backgroundColor: cor }, (carregando || desabilitado) && estilos.botaoDesabilitado]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={carregando || desabilitado}
    >
      {carregando ? (
        <ActivityIndicator color={COLORS.branco} size="small" />
      ) : (
        <>
          <Feather name={icone} size={18} color={COLORS.branco} />
          <Text style={estilos.botaoTexto}>{texto}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    borderRadius: BORDAS.circulo,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: ESPACOS.md,
    ...SOMBRAS.media,
  },
  botaoDesabilitado: {
    opacity: 0.65,
  },
  botaoTexto: {
    color: COLORS.branco,
    fontSize: FONTES.lg,
    fontWeight: FONTES.bold,
    letterSpacing: 0.5,
  },
});
