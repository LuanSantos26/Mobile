import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  iconName: keyof typeof Feather.glyphMap;
}

export function CustomInput({ iconName, ...rest }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Feather name={iconName} size={20} color="#F2994A" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#A0A0A0"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 15,
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});