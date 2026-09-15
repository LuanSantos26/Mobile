import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>; // Adicionado para aceitar estilos extras
}

export function CustomButton({ title, variant = 'primary', style, ...rest }: CustomButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity 
      // Agora ele junta o estilo padrão com o estilo extra que você mandar da tela
      style={[styles.button, isSecondary && styles.buttonSecondary, style]} 
      {...rest}
    >
      <Text style={[styles.text, isSecondary && styles.textSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F6B72D', 
    width: '100%', 
    height: 55,
    borderRadius: 15, 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', 
    marginTop: 10,
    elevation: 3, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: '#FFF',
  },
});