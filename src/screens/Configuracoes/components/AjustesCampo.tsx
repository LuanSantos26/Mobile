import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { CLIENTE_COLORS } from '../../../theme/theme';
import { clienteStyles, styles } from '../styles';

interface AjustesCampoProps
  extends Pick<
    TextInputProps,
    'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'autoCapitalize' | 'secureTextEntry' | 'maxLength'
  > {
  label: string;
  /** Ícone à esquerda do campo (visual do cliente). */
  icon: keyof typeof Ionicons.glyphMap;
}

/** Campo de texto das subtelas de Ajustes, no visual do perfil ativo. */
export function AjustesCampo({ label, icon, ...inputProps }: AjustesCampoProps) {
  const { perfilUso } = useAuth();

  if (perfilUso === 'Cliente') {
    return (
      <>
        <Text style={clienteStyles.label}>{label}</Text>
        <View style={clienteStyles.field}>
          <Ionicons name={icon} size={18} color={CLIENTE_COLORS.primary} />
          <TextInput style={clienteStyles.input} placeholderTextColor="#9AA3B2" {...inputProps} />
        </View>
      </>
    );
  }

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...inputProps} />
    </>
  );
}
