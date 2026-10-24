import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { CLIENTE_COLORS, COMPANY_COLORS } from '../../../theme/theme';
import { clienteStyles, styles } from '../styles';

interface AjustesMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** Item de Ajustes que abre uma subtela, no visual do perfil ativo. */
export function AjustesMenuItem({ icon, title, subtitle, onPress }: AjustesMenuItemProps) {
  const { perfilUso } = useAuth();
  const isCliente = perfilUso === 'Cliente';
  const cor = isCliente ? CLIENTE_COLORS.primary : COMPANY_COLORS.primary;

  return (
    <TouchableOpacity
      style={[isCliente ? clienteStyles.card : styles.card, styles.navCard]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={isCliente ? clienteStyles.sectionIcon : styles.navIcon}>
        <Ionicons name={icon} size={isCliente ? 18 : 20} color={cor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={isCliente ? clienteStyles.sectionTitle : styles.sectionTitle}>{title}</Text>
        <Text style={isCliente ? clienteStyles.sectionSubtitle : styles.navSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={cor} />
    </TouchableOpacity>
  );
}
